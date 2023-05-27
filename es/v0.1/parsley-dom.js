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
        const source1 = render.sources[targetIndex];
        if (source1 instanceof SourceLink) {
            const node1 = render.nodes[source1.nodeIndex];
            for (const descArray1 of node1){
                for (const descIndex1 of descArray1){
                    targets.push(descIndex1);
                }
            }
        }
        index += 1;
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
                        continue;
                    }
                }
            }
            continue;
        }
        render.builds[index] = utils.createTextNode(source);
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
                if (source1 instanceof SourceLink) {
                    const draw = render.draws[source1.drawIndex];
                    const node1 = render.nodes[source1.nodeIndex];
                    let data = utils.getBuilderData(draw.templateStrings);
                    if (data !== undefined) {
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
            }
        }
        index += 1;
    }
}
function addDescToRender(utils, render, sourceIndexArray) {
    for (const sourceIndex of sourceIndexArray){
        const source = render.sources[sourceIndex];
        if (source instanceof SourceLink) {
            const node = render.nodes[source.nodeIndex];
            const draw = render.draws[source.drawIndex];
            const buildData = utils.getBuilderData(draw.templateStrings);
            if (buildData !== undefined) {
                while(node.length < buildData.descendants.length){
                    const { index  } = buildData.descendants[node.length];
                    const descendants = [];
                    node.push(descendants);
                    addSource(render, descendants, draw.injections[index]);
                }
            }
        }
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
function createRender(utils, source, parentNode) {
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
    addSource(render, render.root, source);
    addDescToRender(utils, render, render.root);
    createNodesFromSource(utils, render);
    return render;
}
function mount(utils, render, parentNode, prevNode) {
    let prev = prevNode;
    for (const sourceIndex of render.root){
        const build = render.builds[sourceIndex];
        const node = utils.getIfNode(build);
        if (node !== undefined) {
            utils.insertNode(node, parentNode, prev);
            prev = node;
            continue;
        }
        if (build instanceof Build) {
            for (const node1 of build.nodes){
                utils.insertNode(node1, parentNode, prev);
                prev = node1;
            }
        }
    }
}
function mountNodes(utils, render, delta) {
    for (const sourceIndex of delta.addedIndexes){
        const source = render.sources[sourceIndex];
        if (!(source instanceof SourceLink)) continue;
        if (source instanceof SourceLink) {
            const parentNode = render.parents[source.parentIndex];
            const node = render.nodes[source.nodeIndex];
            const buildSource = render.builds[sourceIndex];
            if (!(buildSource instanceof Build)) continue;
            for(let arrayIndex = 0; arrayIndex < node.length; arrayIndex++){
                const sourceIndexes = node[arrayIndex];
                let { node: prev , parentNode: descParentNode  } = buildSource.descendants[arrayIndex];
                descParentNode = descParentNode ?? parentNode;
                for (const sourceIndex1 of sourceIndexes){
                    const source1 = render.sources[sourceIndex1];
                    if (source1 instanceof SourceLink) {
                        const parent = render.parents[source1.parentIndex];
                        const build = render.builds[sourceIndex1];
                        if (build instanceof Build) {
                            for (const node1 of build.nodes){
                                utils.insertNode(node1, parent, prev);
                                prev = node1;
                            }
                        }
                        continue;
                    }
                    const build1 = render.builds[sourceIndex1];
                    const nodeBuild = utils.getIfNode(build1);
                    if (nodeBuild !== undefined) {
                        console.log("found node descendants!");
                        utils.insertNode(nodeBuild, descParentNode, prev);
                        prev = node;
                    }
                }
            }
        }
    }
}
function diff(utils, source, parentNode, leftNode, prevRender) {
    const render = createRender(utils, source, parentNode);
    const delta = {
        addedIndexes: [],
        survivedIndexes: [],
        prevSurvivedIndexes: [],
        removedIndexes: []
    };
    if (prevRender === undefined) {
        for (const sourceIndex of render.root){
            findTargets(render, delta.addedIndexes, sourceIndex);
        }
    }
    createAddedBuilds(utils, delta, render);
    if (prevRender === undefined) {
        mount(utils, render, parentNode, leftNode);
    }
    mountNodes(utils, render, delta);
    console.log(delta);
    console.log(render);
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
