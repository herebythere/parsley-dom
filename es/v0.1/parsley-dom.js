// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

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
const builderCache = new Map();
class DOMUtils {
    createNode(tagname) {
        if (tagname === ":fragment") {
            return document.createDocumentFragment();
        }
        return document.createElement(tagname);
    }
    createTextNode(text) {
        return document.createTextNode(text?.toString() ?? "error: unable to render to string");
    }
    insertNode(node, parentNode, leftNode) {
        if (parentNode === undefined) return;
        if (leftNode?.nextSibling === undefined) {
            parentNode.appendChild(node);
            return;
        }
        node.insertBefore(node, leftNode.nextSibling);
    }
    removeNode(node, parentNode, leftNode) {
        parentNode.removeChild(node);
    }
    getIfNode(node) {
        if (node instanceof Node) {
            return node;
        }
    }
    cloneTree(node) {
        return node.cloneNode(true);
    }
    getDescendant(baseTier, address, depth = address.length) {
        if (address.length === 0) return;
        let currNode = baseTier[address[0]];
        if (currNode === undefined) return;
        for(let index = 1; index < depth; index++){
            currNode = currNode.childNodes[index];
            if (currNode === undefined) return;
        }
        return currNode;
    }
    setBuilder(template, builder) {
        builderCache.set(template, builder);
    }
    getBuilder(template) {
        const builder = builderCache.get(template);
        if (builder !== undefined) {
            return builder;
        }
    }
}
const DEFAULT_POSITION = {
    x: 0,
    y: 0
};
function increment(template, position) {
    const templateLength = template.length - 1;
    const chunk = template[position.x];
    const chunkLength = chunk.length - 1;
    if (position.x >= templateLength && position.y >= chunkLength) return;
    position.y += 1;
    if (position.y > chunkLength) {
        position.x += 1;
        position.y = 0;
    }
    return position;
}
function getChar(template, position) {
    const str = template[position.x];
    if (str === undefined) return;
    if (str.length === 0) return "";
    return str[position.y];
}
function create(origin = DEFAULT_POSITION, target = origin) {
    return {
        origin: {
            ...origin
        },
        target: {
            ...target
        }
    };
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
const BUILD = "BUILD";
const INJECT = "INJECT";
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
const routes = new Map([
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
const injectionMap = new Map([
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
function parse(template, builder, prev = INITIAL) {
    let prevState = prev;
    let currState = prev;
    const origin = {
        x: 0,
        y: 0
    };
    const prevOrigin = {
        x: 0,
        y: 0
    };
    const prevTarget = {
        x: 0,
        y: 0
    };
    do {
        const __char = getChar(template, origin);
        if (__char !== undefined) {
            prevState = currState;
            let route = routes.get(prevState);
            if (route) {
                currState = route.get(__char) ?? route.get(DEFAULT) ?? ERROR;
            }
        }
        if (prevState !== currState || prevTarget.x < origin.x) {
            builder.push({
                type: BUILD,
                state: prevState,
                vector: create(prevOrigin, prevTarget)
            });
            prevOrigin.x = origin.x;
            prevOrigin.y = origin.y;
        }
        if (prevTarget.x < origin.x) {
            const state = injectionMap.get(prevState);
            if (state !== undefined) {
                builder.push({
                    type: INJECT,
                    index: prevTarget.x,
                    state
                });
            }
        }
        prevTarget.x = origin.x;
        prevTarget.y = origin.y;
    }while (increment(template, origin) && currState !== ERROR)
    builder.push({
        type: BUILD,
        state: currState,
        vector: create(origin, origin)
    });
}
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
        const error = this.steps[this.steps.length - 1];
        if (error?.state === "ERROR") {
            return;
        }
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
function getBuild(utils, draw) {
    const { templateStrings  } = draw;
    const builderData = utils.getBuilder(templateStrings);
    if (builderData !== undefined) {
        return new Build(utils, builderData);
    }
    const builder = new Builder();
    parse(templateStrings, builder);
    const data = builder.build(utils, templateStrings);
    if (data !== undefined) {
        utils.setBuilder(templateStrings, data);
        return new Build(utils, data);
    }
}
function compareSources(source, prevSource) {
    if (source instanceof Draw && prevSource instanceof Draw) {
        return source.templateStrings === prevSource.templateStrings;
    }
    return source === prevSource;
}
function createRenderResult(utils, source) {
    if (source instanceof Draw) {
        const build = getBuild(utils, source);
        if (build !== undefined) return build;
    }
    return utils.getIfNode(source) ?? utils.createTextNode(source);
}
function findRemovedTargets(delta, render, sourceIndex) {
    delta.removedIndexes.push(sourceIndex);
    let index = delta.removedIndexes.length - 1;
    while(index < delta.removedIndexes.length){
        const nodeIndex = delta.removedIndexes[index];
        const node = render.nodes[nodeIndex];
        for (const descIndex of node.descendants){
            delta.removedIndexes.push(descIndex);
        }
        index += 1;
    }
}
function findAddedTargets(delta, render, sourceIndex) {
    delta.addedIndexes.push(sourceIndex);
    let index = delta.addedIndexes.length - 1;
    while(index < delta.addedIndexes.length){
        const nodeIndex = delta.addedIndexes[index];
        const node = render.nodes[nodeIndex];
        for (const descIndex of node.descendants){
            delta.addedIndexes.push(descIndex);
        }
        index += 1;
    }
}
function adoptPrevNodes(delta, render, prevRender) {
    const minLength = Math.min(render.rootLength, prevRender.rootLength);
    for(let index = 0; index < minLength; index++){
        const prev = prevRender.sources[index];
        const curr = render.sources[index];
        if (compareSources(prev, curr)) {
            delta.survivedIndexes.push(index);
            delta.prevSurvivedIndexes.push(index);
            continue;
        }
        findRemovedTargets(delta, render, index);
        findAddedTargets(delta, render, index);
    }
    if (prevRender.rootLength > minLength) {
        for(let index1 = prevRender.rootLength; index1 < prevRender.rootLength; index1++){
            findRemovedTargets(delta, render, index1);
        }
    }
    if (render.rootLength > minLength) {
        for(let index2 = render.rootLength; index2 < render.rootLength; index2++){
            findAddedTargets(delta, render, index2);
        }
    }
    let index3 = 0;
    while(index3 < delta.survivedIndexes.length){
        const prevIndex = delta.prevSurvivedIndexes[index3];
        const currIndex = delta.survivedIndexes[index3];
        const prevNode = prevRender.nodes[prevIndex];
        const currNode = render.nodes[currIndex];
        for(let index4 = 0; index4 < prevNode.descendants.length; index4++){
            const prevDescIndex = prevNode.descendants[index4];
            const currDescIndex = currNode.descendants[index4];
            const prevDescSource = prevRender.sources[prevDescIndex];
            const currDescSource = render.sources[currDescIndex];
            if (compareSources(prevDescSource, currDescSource)) {
                delta.prevSurvivedIndexes.push(prevDescIndex);
                delta.survivedIndexes.push(currDescIndex);
                continue;
            }
            findRemovedTargets(delta, render, prevDescIndex);
            findAddedTargets(delta, render, currDescIndex);
        }
        index3 += 1;
    }
}
function createNodesFromSources(utils, render, sources) {
    for (const source of sources){
        render.sources.push(source);
        const receipt = render.sources.length - 1;
        render.nodes.push({
            id: receipt,
            descendants: [],
            parentId: -1
        });
        render.results.push(undefined);
    }
    let index = 0;
    while(index < render.sources.length){
        const node = render.nodes[index];
        const source1 = render.sources[index];
        if (source1 instanceof Draw) {
            const builder = utils.getBuilder(source1.templateStrings);
            if (builder !== undefined) {
                for (const descendant of builder.descendants){
                    const { index: index1  } = descendant;
                    const descSource = source1.injections[index1];
                    render.sources.push(descSource);
                    const receipt1 = render.sources.length - 1;
                    render.nodes.push({
                        id: receipt1,
                        parentId: node.id,
                        descendants: []
                    });
                    render.results.push(undefined);
                    node.descendants.push(receipt1);
                }
            }
        }
        index += 1;
    }
}
function adoptBuilds(delta, render, prevRender) {
    for(let index = 0; index < delta.survivedIndexes.length; index++){
        const prevIndex = delta.prevSurvivedIndexes[index];
        const currIndex = delta.survivedIndexes[index];
        const result = prevRender.results[prevIndex];
        render.results[currIndex] = result;
    }
}
function createNewBuilds(utils, delta, render) {
    for (const index of delta.addedIndexes){
        const source = render.sources[index];
        const result = createRenderResult(utils, source);
        render.results[index] = result;
    }
}
function unmountPrevNodes(utils, delta, prevRender, parentNode, leftNode) {}
function mountNewNodes(utils, delta, render, parentNode, leftNode) {
    for(let index = 0; index < delta.addedIndexes.length; index++){
        const node = render.nodes[index];
        render.results[index];
        for (const descIndex of node.descendants){}
    }
}
function diff(utils, sources, parentNode, leftNode, prevRender) {
    const render = {
        rootLength: sources.length - 1,
        results: [],
        sources: [],
        nodes: []
    };
    const delta = {
        addedIndexes: [],
        removedIndexes: [],
        survivedIndexes: [],
        prevSurvivedIndexes: []
    };
    createNodesFromSources(utils, render, sources);
    if (prevRender !== undefined) {
        adoptPrevNodes(delta, render, prevRender);
    }
    if (prevRender === undefined) {
        for(let index = 0; index < render.rootLength; index++){
            findAddedTargets(delta, render, index);
        }
    }
    if (prevRender !== undefined) {
        unmountPrevNodes(utils, delta, prevRender, parentNode, leftNode);
    }
    if (prevRender === undefined) {
        createNewBuilds(utils, delta, render);
    }
    if (prevRender !== undefined) {
        adoptBuilds(delta, render, prevRender);
    }
    mountNewNodes(utils, delta, render, parentNode, leftNode);
    return render;
}
class Hangar {
    renderFuncs;
    parentNode;
    leftNode;
    render;
    constructor(renderFuncs, parentNode, leftNode){
        this.renderFuncs = renderFuncs;
        this.parentNode = parentNode;
        this.leftNode = leftNode;
    }
    update(utils, state) {
        let renderSources = [];
        for (const func of this.renderFuncs){
            renderSources.push(func(state));
        }
        const render = diff(utils, renderSources, this.parentNode, this.leftNode, this.render);
        this.render = render;
    }
}
export { draw as draw };
export { DOMUtils as DOMUtils };
export { Builder as Builder };
export { Build as Build };
export { Hangar as Hangar };
