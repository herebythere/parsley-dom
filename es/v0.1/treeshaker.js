// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function cloneNodes(utils, sourceNodes) {
    let nodes = [];
    for (const node of sourceNodes){
        nodes.push(utils.cloneTree(node));
    }
    return nodes;
}
function createInjections(utils, nodes, builderInjections) {
    const injections = [];
    for (const entry of builderInjections){
        const { address , parentAddress  } = entry;
        const node = utils.getDescendant(nodes, address);
        const parentNode = utils.getDescendant(nodes, parentAddress);
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
class SourceLink {
    drawIndex;
    nodeIndex;
    parentIndex = 0;
    constructor(drawIndex, nodeIndex){
        this.drawIndex = drawIndex;
        this.nodeIndex = nodeIndex;
    }
}
function findTargets(render, targets, sourceIndex) {
    let index = targets.push(sourceIndex);
    const source = render.sources[sourceIndex];
    if (!(source instanceof SourceLink)) return;
    const node = render.nodes[source.nodeIndex];
    for (const descArray of node){
        for (const descIndex of descArray){
            targets.push(descIndex);
        }
    }
    while(index < targets.length){
        const targetIndex = targets[index];
        index += 1;
        const source1 = render.sources[targetIndex];
        if (!(source1 instanceof SourceLink)) continue;
        const node1 = render.nodes[source1.nodeIndex];
        for (const descArray1 of node1){
            for (const descIndex1 of descArray1){
                targets.push(descIndex1);
            }
        }
    }
}
function createAddedBuilds(utils, delta, render) {
    for (const index of delta.addedIndexes){
        const source = render.sources[index];
        const node = utils.getIfNode(source);
        if (node !== undefined) {
            render.builds[index] = node;
            continue;
        }
        if (source instanceof SourceLink) {
            const draw = render.draws[source.drawIndex];
            const builderData = utils.getBuilderData(draw.templateStrings);
            if (builderData === undefined) continue;
            const build = new Build(utils, builderData);
            render.builds[index] = build;
            const node1 = render.nodes[source.nodeIndex];
            for(let buildIndex = 0; buildIndex < build.descendants.length; buildIndex++){
                let parentIndex = source.parentIndex;
                const descendant = build.descendants[buildIndex];
                if (descendant.parentNode !== undefined) {
                    render.parents.push(descendant.parentNode);
                    parentIndex = render.parents.length - 1;
                }
                const descIndexArray = node1[buildIndex];
                for (const descIndex of descIndexArray){
                    const source1 = render.sources[descIndex];
                    if (source1 instanceof SourceLink) {
                        source1.parentIndex = parentIndex;
                    }
                }
            }
            continue;
        }
        render.builds[index] = utils.createTextNode(source);
    }
}
function addSourceToRender(render, indexes, source) {
    if (source instanceof Draw) {
        const nodeLink = new SourceLink(render.draws.push(source) - 1, render.nodes.push([]) - 1);
        render.sources.push(nodeLink);
    } else {
        render.sources.push(source);
    }
    render.builds.push(undefined);
    indexes.push(render.sources.length - 1);
}
function addSource(render, sourceIndexArray, source) {
    if (!Array.isArray(source)) {
        addSourceToRender(render, sourceIndexArray, source);
    }
    if (Array.isArray(source)) {
        for (const chunk of source){
            addSourceToRender(render, sourceIndexArray, chunk);
        }
    }
}
function addDescToRender(utils, render, sourceIndexArray) {
    for (const sourceIndex of sourceIndexArray){
        const source = render.sources[sourceIndex];
        if (!(source instanceof SourceLink)) continue;
        const node = render.nodes[source.nodeIndex];
        const draw = render.draws[source.drawIndex];
        const buildData = utils.getBuilderData(draw.templateStrings);
        if (buildData === undefined) continue;
        while(node.length < buildData.descendants.length){
            const { index  } = buildData.descendants[node.length];
            const descendants = [];
            node.push(descendants);
            addSource(render, descendants, draw.injections[index]);
        }
    }
}
function createNodesFromSource(utils, render) {
    let index = 0;
    for (const sourceIndex of render.root){
        const source = render.sources[sourceIndex];
        if (source instanceof SourceLink) {
            index = source.nodeIndex;
        }
    }
    while(index < render.nodes.length){
        const node = render.nodes[index];
        for(let descArrayIndex = 0; descArrayIndex < node.length; descArrayIndex++){
            const descArray = node[descArrayIndex];
            for (const sourceIndex1 of descArray){
                const source1 = render.sources[sourceIndex1];
                if (!(source1 instanceof SourceLink)) continue;
                const draw = render.draws[source1.drawIndex];
                let data = utils.getBuilderData(draw.templateStrings);
                if (data === undefined) continue;
                const node1 = render.nodes[source1.nodeIndex];
                for(let descIndex = 0; descIndex < data.descendants.length; descIndex++){
                    const descendant = data.descendants[descIndex];
                    const descSource = draw.injections[descendant.index];
                    const descendants = [];
                    node1.push(descendants);
                    addSource(render, descendants, descSource);
                    addDescToRender(utils, render, descendants);
                }
            }
        }
        index += 1;
    }
}
function buildRender(utils, render, source) {
    addSource(render, render.root, source);
    addDescToRender(utils, render, render.root);
    createNodesFromSource(utils, render);
    return render;
}
function getDeltas(render, prevRender, delta) {
    let index = 0;
    while(index < render.root.length && index < prevRender.root.length){
        const sourceIndex = render.root[index];
        const prevSourceIndex = prevRender.root[index];
        const source = render.sources[sourceIndex];
        const prevSource = prevRender.sources[prevSourceIndex];
        if (prevSource instanceof SourceLink && source instanceof SourceLink) {
            const draw = render.draws[source.drawIndex];
            const prevDraw = prevRender.draws[prevSource.drawIndex];
            if (prevDraw.templateStrings !== draw.templateStrings) {
                findTargets(render, delta.addedIndexes, sourceIndex);
                findTargets(prevRender, delta.removedIndexes, prevSourceIndex);
                delta.remountRoot = true;
            } else {
                render.builds[sourceIndex] = prevRender.builds[prevSourceIndex];
                delta.survivedIndexes.push(sourceIndex);
                delta.prevSurvivedIndexes.push(prevSourceIndex);
            }
        } else {
            if (prevSource !== source) {
                findTargets(render, delta.addedIndexes, sourceIndex);
                findTargets(prevRender, delta.removedIndexes, prevSourceIndex);
                delta.remountRoot = true;
            } else {
                render.builds[index] = prevRender.builds[index];
            }
        }
        index += 1;
    }
    while(index < render.root.length){
        findTargets(render, delta.addedIndexes, render.root[index]);
        delta.remountRoot = true;
        index += 1;
    }
    while(index < prevRender.root.length){
        findTargets(prevRender, delta.removedIndexes, prevRender.root[index]);
        delta.remountRoot = true;
        index += 1;
    }
    let survivedIndex = 0;
    while(survivedIndex < delta.survivedIndexes.length){
        const sourceIndex1 = delta.survivedIndexes[survivedIndex];
        const prevSourceIndex1 = delta.prevSurvivedIndexes[survivedIndex];
        survivedIndex += 1;
        const source1 = render.sources[sourceIndex1];
        const prevSource1 = prevRender.sources[prevSourceIndex1];
        if (!(prevSource1 instanceof SourceLink && source1 instanceof SourceLink)) {
            continue;
        }
        render.parents.push(prevRender.parents[prevSource1.parentIndex]);
        source1.parentIndex = render.parents.length - 1;
        const nodes = render.nodes[source1.nodeIndex];
        const prevNodes = prevRender.nodes[prevSource1.nodeIndex];
        for(let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++){
            const node = nodes[nodeIndex];
            const prevNode = prevNodes[nodeIndex];
            let resetIndex = false;
            let descIndex = 0;
            while(descIndex < node.length && descIndex < prevNode.length){
                const sourceIndex2 = node[descIndex];
                const prevSourceIndex2 = prevNode[descIndex];
                const source2 = render.sources[sourceIndex2];
                const prevSource2 = prevRender.sources[prevSourceIndex2];
                if (prevSource2 instanceof SourceLink && source2 instanceof SourceLink) {
                    const draw1 = render.draws[source2.drawIndex];
                    const prevDraw1 = prevRender.draws[prevSource2.drawIndex];
                    if (prevDraw1.templateStrings !== draw1.templateStrings) {
                        findTargets(render, delta.addedIndexes, sourceIndex2);
                        findTargets(prevRender, delta.removedIndexes, prevSourceIndex2);
                        resetIndex = true;
                    } else {
                        render.builds[sourceIndex2] = prevRender.builds[prevSourceIndex2];
                        delta.survivedIndexes.push(sourceIndex2);
                        delta.prevSurvivedIndexes.push(prevSourceIndex2);
                    }
                } else {
                    if (prevSource2 !== source2) {
                        findTargets(render, delta.addedIndexes, sourceIndex2);
                        findTargets(prevRender, delta.removedIndexes, prevSourceIndex2);
                        resetIndex = true;
                    } else {
                        render.builds[index] = prevRender.builds[index];
                    }
                }
                descIndex += 1;
            }
            while(descIndex < node.length){
                findTargets(render, delta.addedIndexes, node[descIndex]);
                resetIndex = true;
                descIndex += 1;
            }
            while(descIndex < prevNode.length){
                findTargets(prevRender, delta.removedIndexes, prevNode[descIndex]);
                resetIndex = true;
                descIndex += 1;
            }
            if (resetIndex) {
                delta.prevDescIndexes.push(prevSourceIndex1);
                delta.descIndexes.push(sourceIndex1);
                delta.descArrayIndexes.push(nodeIndex);
            }
        }
    }
}
function mountBuilds(utils, render, sourceIndexes, parentNode, prevNode) {
    let prev = prevNode;
    for (const sourceIndex of sourceIndexes){
        const build = render.builds[sourceIndex];
        if (build instanceof Build) {
            for (const node of build.nodes){
                utils.insertNode(node, parentNode, prev);
                prev = node;
            }
        }
        const node1 = utils.getIfNode(build);
        if (node1 !== undefined) {
            utils.insertNode(node1, parentNode, prev);
            prev = node1;
        }
    }
}
function mountNodes(utils, render, delta) {
    for (const sourceIndex of delta.addedIndexes){
        const source = render.sources[sourceIndex];
        const buildSource = render.builds[sourceIndex];
        if (source instanceof SourceLink && buildSource instanceof Build) {
            const parent = render.parents[source.parentIndex];
            const nodes = render.nodes[source.nodeIndex];
            for(let arrayIndex = 0; arrayIndex < nodes.length; arrayIndex++){
                const descs = nodes[arrayIndex];
                const { node , parentNode  } = buildSource.descendants[arrayIndex];
                mountBuilds(utils, render, descs, parentNode ?? parent, node);
            }
        }
    }
}
function mountChangedAreas(utils, render, delta) {
    for(let index = 0; index < delta.descIndexes.length; index++){
        const renderIndex = delta.descIndexes[index];
        const source = render.sources[renderIndex];
        if (!(source instanceof SourceLink)) continue;
        const nodes = render.nodes[source.nodeIndex];
        const descArrayIndex = delta.descArrayIndexes[index];
        const descs = nodes[descArrayIndex];
        const build = render.builds[renderIndex];
        if (!(build instanceof Build)) continue;
        const { node , parentNode  } = build.descendants[descArrayIndex];
        mountBuilds(utils, render, descs, parentNode ?? render.parents[source.parentIndex], node);
    }
}
function unmountBuilds(utils, render, delta, sourceIndexes) {
    for (const sourceIndex of sourceIndexes){
        const build = render.builds[sourceIndex];
        const nodeBuild = utils.getIfNode(build);
        if (nodeBuild !== undefined) {
            utils.removeNode(nodeBuild);
        }
        if (build instanceof Build) {
            for (const node of build.nodes){
                utils.removeNode(node);
            }
        }
    }
}
function unmountChangedAreas(utils, prevRender, delta) {
    for(let index = 0; index < delta.prevDescIndexes.length; index++){
        const prevRenderIndex = delta.prevDescIndexes[index];
        const prevSource = prevRender.sources[prevRenderIndex];
        if (!(prevSource instanceof SourceLink)) continue;
        const prevNodes = prevRender.nodes[prevSource.nodeIndex];
        const descArrayIndex = delta.descArrayIndexes[index];
        const prevDescs = prevNodes[descArrayIndex];
        unmountBuilds(utils, prevRender, delta, prevDescs);
    }
}
function diff(utils, source, parentNode, leftNode, prevRender) {
    const render = {
        root: [],
        sources: [],
        draws: [],
        builds: [],
        parents: [
            parentNode
        ],
        nodes: []
    };
    const delta = {
        remountRoot: false,
        addedIndexes: [],
        prevSurvivedIndexes: [],
        survivedIndexes: [],
        descIndexes: [],
        prevDescIndexes: [],
        descArrayIndexes: [],
        removedIndexes: []
    };
    buildRender(utils, render, source);
    if (prevRender === undefined) {
        for (const sourceIndex of render.root){
            findTargets(render, delta.addedIndexes, sourceIndex);
        }
    }
    if (prevRender !== undefined) {
        getDeltas(render, prevRender, delta);
        unmountChangedAreas(utils, prevRender, delta);
        unmountBuilds(utils, prevRender, delta, delta.removedIndexes);
    }
    createAddedBuilds(utils, delta, render);
    if (prevRender !== undefined) {
        mountChangedAreas(utils, render, delta);
    }
    if (prevRender === undefined) {
        mountBuilds(utils, render, render.root, parentNode, leftNode);
    }
    mountNodes(utils, render, delta);
    console.log("\n", delta, render);
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
        const start = performance.now();
        const source = this.renderFunc(state);
        this.render = diff(utils, source, this.parentNode, this.leftNode, this.render);
        console.log("time", performance.now() - start);
    }
}
export { Build as Build };
export { Hangar as Hangar };
export { draw as draw };
