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
function getText(template, vector) {
    const origin = vector.origin;
    let templateText = template[origin.x];
    if (templateText) {
        return templateText.substr(origin.y, vector.target.y - origin.y + 1);
    }
}
const ATTRIBUTE = "ATTRIBUTE";
const ATTRIBUTE_DECLARATION = "ATTRIBUTE_DECLARATION";
const ATTRIBUTE_DECLARATION_CLOSE = "ATTRIBUTE_DECLARATION_CLOSE";
const ATTRIBUTE_SETTER = "ATTRIBUTE_SETTER";
const ATTRIBUTE_VALUE = "ATTRIBUTE_VALUE";
const CLOSE_NODE_SLASH = "CLOSE_NODE_SLASH";
const CLOSE_NODE_SPACE = "CLOSE_NODE_SPACE";
const CLOSE_NODE_CLOSED = "CLOSE_NODE_CLOSED";
const CLOSE_TAGNAME = "CLOSE_TAGNAME";
const ERROR = "ERROR";
const INDEPENDENT_NODE = "INDEPENDENT_NODE";
const INDEPENDENT_NODE_CLOSED = "INDEPENDENT_NODE_CLOSED";
const NODE = "NODE";
const NODE_CLOSED = "NODE_CLOSED";
const NODE_SPACE = "NODE_SPACE";
const TAGNAME = "TAGNAME";
const TEXT = "TEXT";
const ATTRIBUTE_INJECTION = "ATTRIBUTE_INJECTION";
const DESCENDANT_INJECTION = "DESCENDANT_INJECTION";
const ATTRIBUTE_MAP_INJECTION = "ATTRIBUTE_MAP_INJECTION";
const INITIAL = "INITIAL";
const DEFAULT = "DEFAULT";
const LB = "<";
const RB = ">";
const SP = " ";
const NL = "\n";
const TB = "\t";
const FS = "/";
const QT = '"';
const EQ = "=";
const INIITAL_MAP = new Map([
    [
        LB,
        NODE
    ],
    [
        DEFAULT,
        TEXT
    ]
]);
const NODE_MAP = new Map([
    [
        SP,
        ERROR
    ],
    [
        NL,
        ERROR
    ],
    [
        TB,
        ERROR
    ],
    [
        FS,
        CLOSE_NODE_SLASH
    ],
    [
        RB,
        ERROR
    ],
    [
        DEFAULT,
        TAGNAME
    ]
]);
const CLOSE_NODE_SLASH_MAP = new Map([
    [
        SP,
        ERROR
    ],
    [
        NL,
        ERROR
    ],
    [
        TB,
        ERROR
    ],
    [
        DEFAULT,
        CLOSE_TAGNAME
    ]
]);
const TAGNAME_MAP = new Map([
    [
        RB,
        NODE_CLOSED
    ],
    [
        SP,
        NODE_SPACE
    ],
    [
        NL,
        NODE_SPACE
    ],
    [
        TB,
        NODE_SPACE
    ],
    [
        FS,
        INDEPENDENT_NODE
    ],
    [
        DEFAULT,
        TAGNAME
    ]
]);
const CLOSE_TAGNAME_MAP = new Map([
    [
        RB,
        CLOSE_NODE_CLOSED
    ],
    [
        SP,
        CLOSE_NODE_SPACE
    ],
    [
        NL,
        CLOSE_NODE_SPACE
    ],
    [
        TB,
        CLOSE_NODE_SPACE
    ],
    [
        DEFAULT,
        CLOSE_TAGNAME
    ]
]);
const CLOSE_NODE_SPACE_MAP = new Map([
    [
        RB,
        CLOSE_NODE_CLOSED
    ],
    [
        DEFAULT,
        CLOSE_NODE_SPACE
    ]
]);
const INDEPENDENT_NODE_MAP = new Map([
    [
        RB,
        INDEPENDENT_NODE_CLOSED
    ],
    [
        DEFAULT,
        INDEPENDENT_NODE
    ]
]);
const NODE_SPACE_MAP = new Map([
    [
        RB,
        NODE_CLOSED
    ],
    [
        SP,
        NODE_SPACE
    ],
    [
        NL,
        NODE_SPACE
    ],
    [
        TB,
        NODE_SPACE
    ],
    [
        FS,
        INDEPENDENT_NODE
    ],
    [
        DEFAULT,
        ATTRIBUTE
    ]
]);
const ATTRIBUTE_MAP = new Map([
    [
        SP,
        NODE_SPACE
    ],
    [
        NL,
        NODE_SPACE
    ],
    [
        TB,
        NODE_SPACE
    ],
    [
        EQ,
        ATTRIBUTE_SETTER
    ],
    [
        RB,
        NODE_CLOSED
    ],
    [
        FS,
        INDEPENDENT_NODE
    ],
    [
        DEFAULT,
        ATTRIBUTE
    ]
]);
const ATTRIBUTE_SETTER_MAP = new Map([
    [
        QT,
        ATTRIBUTE_DECLARATION
    ],
    [
        NL,
        NODE_SPACE
    ],
    [
        DEFAULT,
        NODE_SPACE
    ]
]);
const ATTRIBUTE_DECLARATION_MAP = new Map([
    [
        QT,
        ATTRIBUTE_DECLARATION_CLOSE
    ],
    [
        DEFAULT,
        ATTRIBUTE_VALUE
    ]
]);
const ATTRIBUTE_VALUE_MAP = new Map([
    [
        QT,
        ATTRIBUTE_DECLARATION_CLOSE
    ],
    [
        DEFAULT,
        ATTRIBUTE_VALUE
    ]
]);
const ATTRIBUTE_DECLARATION_CLOSE_MAP = new Map([
    [
        RB,
        NODE_CLOSED
    ],
    [
        FS,
        INDEPENDENT_NODE
    ],
    [
        DEFAULT,
        NODE_SPACE
    ]
]);
new Map([
    [
        INITIAL,
        INIITAL_MAP
    ],
    [
        TEXT,
        INIITAL_MAP
    ],
    [
        NODE,
        NODE_MAP
    ],
    [
        CLOSE_NODE_SLASH,
        CLOSE_NODE_SLASH_MAP
    ],
    [
        TAGNAME,
        TAGNAME_MAP
    ],
    [
        CLOSE_TAGNAME,
        CLOSE_TAGNAME_MAP
    ],
    [
        CLOSE_NODE_SPACE,
        CLOSE_NODE_SPACE_MAP
    ],
    [
        INDEPENDENT_NODE,
        INDEPENDENT_NODE_MAP
    ],
    [
        NODE_CLOSED,
        INIITAL_MAP
    ],
    [
        CLOSE_NODE_CLOSED,
        INIITAL_MAP
    ],
    [
        INDEPENDENT_NODE_CLOSED,
        INIITAL_MAP
    ],
    [
        NODE_SPACE,
        NODE_SPACE_MAP
    ],
    [
        ATTRIBUTE,
        ATTRIBUTE_MAP
    ],
    [
        ATTRIBUTE_SETTER,
        ATTRIBUTE_SETTER_MAP
    ],
    [
        ATTRIBUTE_DECLARATION,
        ATTRIBUTE_DECLARATION_MAP
    ],
    [
        ATTRIBUTE_VALUE,
        ATTRIBUTE_VALUE_MAP
    ],
    [
        ATTRIBUTE_DECLARATION_CLOSE,
        ATTRIBUTE_DECLARATION_CLOSE_MAP
    ]
]);
new Map([
    [
        ATTRIBUTE_DECLARATION,
        ATTRIBUTE_INJECTION
    ],
    [
        ATTRIBUTE_VALUE,
        ATTRIBUTE_INJECTION
    ],
    [
        NODE_SPACE,
        ATTRIBUTE_MAP_INJECTION
    ],
    [
        ATTRIBUTE_DECLARATION_CLOSE,
        ATTRIBUTE_MAP_INJECTION
    ],
    [
        TAGNAME,
        ATTRIBUTE_MAP_INJECTION
    ],
    [
        CLOSE_NODE_CLOSED,
        DESCENDANT_INJECTION
    ],
    [
        INDEPENDENT_NODE_CLOSED,
        DESCENDANT_INJECTION
    ],
    [
        INITIAL,
        DESCENDANT_INJECTION
    ],
    [
        NODE_CLOSED,
        DESCENDANT_INJECTION
    ],
    [
        TEXT,
        DESCENDANT_INJECTION
    ]
]);
function insertNode(utils, stack, data, node) {
    const parentIndex = stack.nodes.length - 2;
    let parentNode = stack.nodes[parentIndex];
    if (parentNode === undefined) {
        data.nodes.push(node);
    }
    utils.insertNode(node, parentNode);
    const nodesLength = stack.nodes.length - 1;
    stack.nodes[nodesLength] = node;
    stack.address[nodesLength] += 1;
}
function stackLogic(utils, template, stack, step, data) {
    if (step.type !== "BUILD") return;
    if (step.state === "TEXT") {
        const text = getText(template, step.vector);
        if (text === undefined) return;
        const node = utils.createTextNode(text);
        insertNode(utils, stack, data, node);
    }
    if (step.state === "TAGNAME") {
        const tagname = getText(template, step.vector);
        if (tagname === undefined || tagname === "") return;
        const node1 = utils.createNode(tagname);
        insertNode(utils, stack, data, node1);
    }
    if (step.state === "NODE_CLOSED") {
        stack.address.push(-1);
        stack.nodes.push(undefined);
    }
    if (step.state === "CLOSE_NODE_CLOSED") {
        stack.address.pop();
        stack.nodes.pop();
    }
}
function injectLogic(stack, step, data) {
    if (step.type !== "INJECT") return;
    const { index , state: type  } = step;
    const injection = {
        address: stack.address.slice(),
        index,
        type
    };
    if (type === "DESCENDANT_INJECTION") {
        data.descendants.push(injection);
        return;
    }
    data.injections.push(injection);
}
class Builder {
    steps = [];
    push(step) {
        this.steps.push(step);
    }
    build(utils, template) {
        const stack = {
            nodes: [
                undefined
            ],
            address: [
                -1
            ],
            attribute: undefined
        };
        const data = {
            nodes: [],
            injections: [],
            descendants: []
        };
        for (const step of this.steps){
            if (step.type === "BUILD") {
                stackLogic(utils, template, stack, step, data);
            }
            if (step.type === "INJECT") {
                injectLogic(stack, step, data);
            }
        }
        return data;
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
            const builderData = utils.getBuilderData(source.templateStrings);
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
        let data = utils.getBuilderData(source.templateStrings);
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
            let data = utils.getBuilderData(source1.templateStrings);
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
            for(let descIndex = 0; descIndex < descNode.descendants.length; descIndex++){
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
        console.log("prevRender delta:", delta);
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
        const start = performance.now();
        const source = this.renderFunc(state);
        this.render = diff(utils, source, this.parentNode, this.leftNode, this.render);
        console.log("time", performance.now() - start);
    }
}
export { Build as Build };
export { Builder as Builder };
export { Hangar as Hangar };
export { draw as draw };
