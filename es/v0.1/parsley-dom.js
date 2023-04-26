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
        parentNode.insertBefore(node, leftNode.nextSibling);
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
            const addressIndex = address[index];
            currNode = currNode.childNodes[addressIndex];
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
function mountAddedNodes(utils, delta, render, parent1, left) {
    const result = render.results[0];
    const node = utils.getIfNode(result);
    if (node !== undefined) {
        utils.insertNode(node, parent1, left);
    }
    if (result instanceof Build) {
        let leftNode = left;
        for (const node1 of result.nodes){
            utils.insertNode(node1, parent1, leftNode);
            leftNode = node1;
        }
    }
    for(let addedIndex = 0; addedIndex < delta.addedIndexes.length; addedIndex++){
        const index = delta.addedIndexes[addedIndex];
        const result1 = render.results[index];
        if (!(result1 instanceof Build)) continue;
        const node2 = render.nodes[index];
        for(let descIndex = 0; descIndex < node2.descendants.length; descIndex++){
            const descNodeIndex = node2.descendants[descIndex];
            const descResult = render.results[descNodeIndex];
            let { parentNode , node: leftNode1  } = result1.descendants[descIndex];
            if (parentNode === undefined) {
                parentNode = parent1;
            }
            const descNode = utils.getIfNode(descResult);
            if (descNode !== undefined) {
                utils.insertNode(descNode, parentNode, leftNode1);
            }
            if (descResult instanceof Build) {
                for (const node3 of descResult.nodes){
                    utils.insertNode(node3, parentNode, leftNode1);
                    leftNode1 = node3;
                }
            }
        }
    }
}
function adoptProperties(utils, delta, render, prevRender) {
    for(let index = 0; index < delta.survivedIndexes.length; index++){
        const source = render.sources[index];
        const prevSource = prevRender.sources[index];
        const result = render.results[index];
        if (source instanceof Draw && prevSource instanceof Draw && result instanceof Build) {
            for (const descIndex of result.injections){}
        }
    }
}
function removeProperties(utils, delta, render) {
    for(let index = 0; index < delta.addedIndexes.length; index++){
        const source = render.sources[index];
        const result = render.results[index];
        if (source instanceof Draw && result instanceof Build) {
            for (const descIndex of result.injections){}
        }
    }
}
function addProperties(utils, delta, render) {
    for(let index = 0; index < delta.addedIndexes.length; index++){
        const source = render.sources[index];
        const result = render.results[index];
        if (source instanceof Draw && result instanceof Build) {
            for (const descIndex of result.injections){}
        }
    }
}
function unmountNodes(utils, delta, render, parentNode, leftNode) {
    for(let index = 0; index < delta.removedIndexes.length; index++){
        const result = render.results[index];
        if (!(result instanceof Build)) continue;
        const node = render.nodes[index];
        for(let descIndex = 0; descIndex < node.descendants.length; descIndex++){
            const descNodeIndex = node.descendants[descIndex];
            const descResult = render.results[descNodeIndex];
            let { parentNode: parentNode1 , node: leftNode1  } = result.descendants[descIndex];
            if (parentNode1 === undefined) {
                parentNode1 = parent;
            }
            const descNode = utils.getIfNode(descResult);
            if (descNode !== undefined) {
                utils.removeNode(descNode, parentNode1, leftNode1);
            }
            if (descResult instanceof Build) {
                for (const node1 of descResult.nodes){
                    utils.removeNode(node1, parentNode1, leftNode1);
                }
            }
        }
    }
}
function createAddedBuilds(utils, delta, render) {
    for (const index of delta.addedIndexes){
        const source = render.sources[index];
        let result = utils.getIfNode(source);
        if (source instanceof Draw) {
            result = getBuild(utils, source);
        }
        if (result === undefined && source !== undefined) {
            result = utils.createTextNode(source);
        }
        render.results[index] = result;
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
function getBuilderData(utils, template) {
    let builderData = utils.getBuilder(template);
    if (builderData === undefined) {
        const builder = new Builder();
        parse(template, builder);
        builderData = builder.build(utils, template);
    }
    if (builderData !== undefined) {
        utils.setBuilder(template, builderData);
    }
    return builderData;
}
function getBuild(utils, draw) {
    const builderData = getBuilderData(utils, draw.templateStrings);
    if (builderData !== undefined) {
        return new Build(utils, builderData);
    }
}
function compareSources(source, prevSource) {
    if (source instanceof Draw && prevSource instanceof Draw) {
        return source.templateStrings === prevSource.templateStrings;
    }
    return source === prevSource;
}
function adoptNodes(delta, render, prevRender) {
    let index = 0;
    const prev = prevRender.sources[index];
    const curr = render.sources[index];
    if (!compareSources(prev, curr)) {
        findTargets(delta.removedIndexes, prevRender, index);
        findTargets(delta.addedIndexes, render, index);
        return;
    }
    delta.survivedIndexes.push(index);
    delta.prevSurvivedIndexes.push(index);
    while(index < delta.survivedIndexes.length){
        const prevIndex = delta.prevSurvivedIndexes[index];
        const currIndex = delta.survivedIndexes[index];
        const prevNode = prevRender.nodes[prevIndex];
        const currNode = render.nodes[currIndex];
        for(let descIndex = 0; descIndex < prevNode.descendants.length; descIndex++){
            const prevDescIndex = prevNode.descendants[descIndex];
            const currDescIndex = currNode.descendants[descIndex];
            const prevDescSource = prevRender.sources[prevDescIndex];
            const currDescSource = render.sources[currDescIndex];
            if (compareSources(prevDescSource, currDescSource)) {
                delta.prevSurvivedIndexes.push(prevDescIndex);
                delta.survivedIndexes.push(currDescIndex);
                continue;
            }
            findTargets(delta.removedIndexes, prevRender, prevDescIndex);
            findTargets(delta.addedIndexes, render, currDescIndex);
        }
        index += 1;
    }
}
function findTargets(targets, render, sourceIndex) {
    targets.push(sourceIndex);
    let index = targets.length - 1;
    while(index < targets.length){
        const nodeIndex = targets[index];
        const node = render.nodes[nodeIndex];
        for (const descIndex of node.descendants){
            targets.push(descIndex);
        }
        index += 1;
    }
}
function createNodesFromSource(utils, render) {
    let index = 0;
    while(index < render.sources.length){
        const node = render.nodes[index];
        const source = render.sources[index];
        if (source instanceof Draw) {
            let data = getBuilderData(utils, source.templateStrings);
            if (data !== undefined) {
                for (const descendant of data.descendants){
                    const { index: index1  } = descendant;
                    const descSource = source.injections[index1];
                    render.sources.push(descSource);
                    const id = render.sources.length - 1;
                    node.descendants.push(id);
                    render.nodes.push({
                        parentId: node.id,
                        descendants: [],
                        id
                    });
                    render.results.push(undefined);
                }
            }
        }
        index += 1;
    }
}
function diff(utils, source, parentNode, leftNode, prevRender) {
    const render = {
        results: [
            undefined
        ],
        sources: [
            source
        ],
        nodes: [
            {
                id: 0,
                descendants: [],
                parentId: -1
            }
        ]
    };
    const delta = {
        addedIndexes: [],
        removedIndexes: [],
        survivedIndexes: [],
        prevSurvivedIndexes: []
    };
    createNodesFromSource(utils, render);
    if (prevRender === undefined) {
        findTargets(delta.addedIndexes, render, 0);
    }
    if (prevRender !== undefined) {
        adoptNodes(delta, render, prevRender);
    }
    if (prevRender !== undefined) {
        unmountNodes(utils, delta, prevRender, parentNode, leftNode);
    }
    if (prevRender === undefined) {
        createAddedBuilds(utils, delta, render);
    }
    if (prevRender !== undefined) {
        adoptBuilds(delta, render, prevRender);
    }
    if (prevRender !== undefined) {
        removeProperties(utils, delta, prevRender);
        adoptProperties(utils, delta, render, prevRender);
    }
    addProperties(utils, delta, render);
    mountAddedNodes(utils, delta, render, parentNode, leftNode);
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
        const source = this.renderFunc(state);
        this.render = diff(utils, source, this.parentNode, this.leftNode, this.render);
    }
}
export { draw as draw };
export { DOMUtils as DOMUtils };
export { Builder as Builder };
export { Build as Build };
export { Hangar as Hangar };
