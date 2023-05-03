// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function cloneNodes(utils, nodes) {
    let clonedNodes = [];
    for (const node of nodes){
        clonedNodes.push(utils.cloneTree(node));
    }
    return clonedNodes;
}
function createInjections(utils, nodes, builderInjections) {
    const injections = [];
    for (const entry of builderInjections){
        const { address  } = entry;
        const node = utils.getDescendant(nodes, address);
        const parentNode = utils.getDescendant(nodes, address, address.length - 1);
        const { index , type  } = entry;
        injections.push({
            index,
            node,
            parentNode,
            type
        });
    }
    return injections;
}
class Build {
    nodes;
    descendants;
    injections;
    constructor(utils, data){
        this.nodes = cloneNodes(utils, data.nodes);
        this.injections = createInjections(utils, this.nodes, data.injections);
        this.descendants = createInjections(utils, this.nodes, data.descendants);
    }
}
class Draw {
    templateStrings;
    injections;
    constructor(templateStrings, injections){
        this.templateStrings = templateStrings;
        this.injections = injections;
    }
}
function draw(templateStrings, ...injections) {
    return new Draw(templateStrings, injections);
}
function createAddedBuilds(utils, delta, render) {
    for (const index of delta.addedIndexes){
        const source = render.sources[index];
        let result = utils.getIfNode(source);
        if (source instanceof Draw) {
            const builderData = utils.getBuilder(source.templateStrings);
            if (builderData !== undefined) {
                result = new Build(utils, builderData);
            }
        }
        if (result === undefined && source !== undefined) {
            result = utils.createTextNode(source);
        }
        render.results[index] = result;
    }
}
function addSourceToRender(utils, render, source, parentId, parentDescId) {
    render.sources.push(source);
    render.results.push(undefined);
    const id = render.sources.length - 1;
    const parentNode = render.nodes[parentId];
    parentNode.descendants[parentDescId].push(id);
    const node = {
        id,
        parentId,
        descendants: []
    };
    if (!(source instanceof Draw)) {
        node.descendants.push([]);
    }
    if (source instanceof Draw) {
        let data = utils.getBuilder(source.templateStrings);
        if (data !== undefined) {
            for (const desc of data.descendants){
                node.descendants.push([]);
            }
        }
    }
    render.nodes.push(node);
}
function createNodesFromSource(utils, render, source) {
    let index = 1;
    while(index < render.sources.length){
        const source1 = render.sources[index];
        if (source1 instanceof Draw) {
            let data = utils.getBuilder(source1.templateStrings);
            if (data !== undefined) {
                for(let descIndex = 0; descIndex < data.descendants.length; descIndex++){
                    const descendant = data.descendants[descIndex];
                    const descSource = source1.injections[descendant.index];
                    if (!Array.isArray(descSource)) {
                        addSourceToRender(utils, render, descSource, index, descIndex);
                    }
                    if (Array.isArray(descSource)) {
                        for (const chunk of descSource){
                            addSourceToRender(utils, render, chunk, index, descIndex);
                        }
                    }
                }
            }
        }
        index += 1;
    }
}
function createRender(utils, source, parent) {
    const node = {
        id: 0,
        parentId: -1,
        descendants: [
            []
        ]
    };
    const render = {
        results: [
            parent
        ],
        sources: [
            parent
        ],
        nodes: [
            node
        ]
    };
    if (!Array.isArray(source)) {
        addSourceToRender(utils, render, source, 0, 0);
    }
    if (Array.isArray(source)) {
        for (const chunk of source){
            addSourceToRender(utils, render, chunk, 0, 0);
        }
    }
    return render;
}
function adoptSurvivedTargets(prevRender, render, delta) {
    for(let index = 0; index < delta.survivedIndexes.length; index++){
        const prevSurvivedIndex = delta.prevSurvivedIndexes[index];
        const prevSurvivedDescIndex = delta.prevSurvivedDescIndexes[index];
        const survivedIndex = delta.survivedIndexes[index];
        const survivedDescIndex = delta.survivedDescIndexes[index];
        const prevNode = prevRender.nodes[prevSurvivedIndex];
        const node = prevRender.nodes[survivedIndex];
        const prevDescendants = prevNode.descendants[prevSurvivedDescIndex];
        const descendants = node.descendants[survivedDescIndex];
        for(let descIndex = 0; descIndex < descendants.length; descIndex++){
            const prevResultIndex = prevDescendants[descIndex];
            const resultIndex = descendants[descIndex];
            render.results[resultIndex] = prevRender.results[prevResultIndex];
        }
    }
}
function findTargets(render, targets, descTargets, nodeIndex, nodeDescIndex) {
    targets.push(nodeIndex);
    descTargets.push(nodeDescIndex);
    let index = targets.length - 1;
    while(index < targets.length){
        const targetIndex = targets[index];
        const targetDescIndex = descTargets[index];
        const node = render.nodes[targetIndex];
        const nodeDescIndexes = node.descendants[targetDescIndex];
        for (const nodeIndex1 of nodeDescIndexes){
            const descNode = render.nodes[nodeIndex1];
            for(let descIndex = 0; index < descNode.descendants.length; index++){
                targets.push(nodeIndex1);
                descTargets.push(descIndex);
            }
        }
        index += 1;
    }
}
function compareSources(prevRender, render, prevDescendants, descendants) {
    if (prevDescendants.length !== descendants.length) return false;
    for(let index = 0; index < descendants.length; index++){
        const prevSourceIndex = prevDescendants[index];
        const sourceIndex = descendants[index];
        const prevSource = prevRender.sources[prevSourceIndex];
        const source = render.sources[sourceIndex];
        if (prevSource instanceof Draw && source instanceof Draw) {
            if (prevSource.templateStrings !== source.templateStrings) return false;
            continue;
        }
        if (prevSource !== source) return false;
    }
}
function adoptNodes(render, prevRender, delta) {
    delta.prevSurvivedIndexes.push(0);
    delta.survivedIndexes.push(0);
    let survIndex = 0;
    while(survIndex < delta.survivedIndexes.length){
        const prevParentIndex = delta.prevSurvivedIndexes[survIndex];
        const parentIndex = delta.survivedIndexes[survIndex];
        const prevRenderNode = prevRender.nodes[prevParentIndex];
        const renderNode = render.nodes[parentIndex];
        const descArrayLength = Math.max(prevRenderNode.descendants.length, renderNode.descendants.length);
        for(let descArrayIndex = 0; descArrayIndex < descArrayLength; descArrayIndex++){
            const prevDescIndexes = prevRenderNode.descendants[descArrayIndex];
            const descIndexes = renderNode.descendants[descArrayIndex];
            if (compareSources(prevRender, render, prevDescIndexes, descIndexes)) {
                delta.survivedIndexes.push(parentIndex);
                delta.survivedDescIndexes.push(descArrayIndex);
                delta.prevSurvivedIndexes.push(prevParentIndex);
                delta.prevSurvivedDescIndexes.push(descArrayIndex);
                continue;
            }
            findTargets(render, delta.removedIndexes, delta.removedDescIndexes, prevParentIndex, descArrayIndex);
            findTargets(render, delta.addedIndexes, delta.addedDescIndexes, parentIndex, descArrayIndex);
        }
        if (descArrayLength < prevRenderNode.descendants.length) {
            for(let index = descArrayLength; index < prevRenderNode.descendants.length; index++){
                findTargets(render, delta.removedIndexes, delta.removedDescIndexes, prevParentIndex, index);
            }
        }
        if (descArrayLength < renderNode.descendants.length) {
            for(let index1 = descArrayLength; index1 < prevRenderNode.descendants.length; index1++){
                findTargets(render, delta.addedIndexes, delta.addedDescIndexes, parentIndex, index1);
            }
        }
        survIndex += 1;
    }
}
function unmountResultChunk(utils, result, parent, left) {
    const node = utils.getIfNode(result);
    if (node !== undefined) {
        utils.insertNode(node, parent, left);
        return node;
    }
    if (result instanceof Build) {
        let leftNode = left;
        for (const node1 of result.nodes){
            utils.removeNode(node1, parent, leftNode);
            leftNode = node1;
        }
        return leftNode;
    }
}
function unmountResults(utils, delta, render, parent) {
    for (const removedIndex of delta.removedIndexes){
        const result = render.results[removedIndex];
        if (!(result instanceof Build)) continue;
        const renderNode = render.nodes[removedIndex];
        for(let index = 0; index < result.descendants.length; index++){
            const descIndexes = renderNode.descendants[index];
            const { parentNode , node  } = result.descendants[index];
            let leftNode = node;
            for (const descIndex of descIndexes){
                const descResult = render.results[descIndex];
                leftNode = unmountResultChunk(utils, descResult, parentNode ?? parent, leftNode);
            }
        }
    }
}
function mountResultChunk(utils, result, parent, left) {
    const node = utils.getIfNode(result);
    if (node !== undefined) {
        utils.insertNode(node, parent, left);
        return node;
    }
    if (result instanceof Build) {
        let leftNode = left;
        for (const node1 of result.nodes){
            utils.insertNode(node1, parent, leftNode);
            leftNode = node1;
        }
        return leftNode;
    }
}
function mountResults(utils, delta, render, parent) {
    for (const addedIndex of delta.addedIndexes){
        const result = render.results[addedIndex];
        if (!(result instanceof Build)) continue;
        const renderNode = render.nodes[addedIndex];
        for(let index = 0; index < result.descendants.length; index++){
            const descIndexes = renderNode.descendants[index];
            const { parentNode , node  } = result.descendants[index];
            let leftNode = node;
            for (const descIndex of descIndexes){
                const descResult = render.results[descIndex];
                leftNode = mountResultChunk(utils, descResult, parentNode ?? parent, leftNode);
            }
        }
    }
}
function mountRootToResults(utils, delta, render, parent, left) {
    const rootNode = render.nodes[0];
    let leftNode = left;
    for (const index of rootNode.descendants[0]){
        const result = render.results[index];
        leftNode = mountResultChunk(utils, result, parent, leftNode);
    }
}
function diff(utils, source, parentNode, leftNode, prevRender) {
    const render = createRender(utils, source, parentNode);
    const delta = {
        addedIndexes: [],
        addedDescIndexes: [],
        survivedIndexes: [],
        survivedDescIndexes: [],
        prevSurvivedIndexes: [],
        prevSurvivedDescIndexes: [],
        removedIndexes: [],
        removedDescIndexes: []
    };
    createNodesFromSource(utils, render, source);
    if (prevRender === undefined) {
        findTargets(render, delta.addedIndexes, delta.addedDescIndexes, 0, 0);
    }
    if (prevRender !== undefined) {
        adoptNodes(prevRender, render, delta);
    }
    unmountResults(utils, delta, render, parentNode);
    if (prevRender !== undefined) {
        adoptSurvivedTargets(prevRender, render, delta);
    }
    createAddedBuilds(utils, delta, render);
    console.log(render);
    console.log(delta);
    mountResults(utils, delta, render, parentNode);
    if (prevRender === undefined) {
        mountRootToResults(utils, delta, render, parentNode, leftNode);
    }
    return render;
}
class Hangar {
    renderFunc;
    parentNode;
    leftNode;
    render;
    constructor(renderFunc, parentNode, leftNode){
        this.renderFunc = renderFunc;
        this.parentNode = parentNode;
        this.leftNode = leftNode;
    }
    update(utils, state) {
        performance.now();
        const source = this.renderFunc(state);
        this.render = diff(utils, source, this.parentNode, this.leftNode, this.render);
    }
}
export { Build as Build };
export { Hangar as Hangar };
export { draw as draw };
