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
function findTargets(targets, descTargets, render, nodeIndex, nodeDescIndex) {
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
        findTargets(delta.addedIndexes, delta.addedDescIndexes, render, 0, 0);
    }
    if (prevRender !== undefined) {}
    createAddedBuilds(utils, delta, render);
    console.log(render);
    console.log(delta);
    mountResults(utils, delta, render, parentNode);
    mountRootToResults(utils, delta, render, parentNode, leftNode);
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
