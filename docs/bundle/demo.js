// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

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
class NodeLink {
    drawIndex;
    nodeIndex;
    constructor(drawIndex, nodeIndex){
        this.drawIndex = drawIndex;
        this.nodeIndex = nodeIndex;
    }
}
function addSourceToRender(utils, render, source, parentId, parentDescId) {
    if (source instanceof Draw) {
        render.draws.push(source);
        const descendants = [];
        const builderData = utils.getBuilderData(source.templateStrings);
        if (builderData !== undefined) {
            while(descendants.length < builderData.descendants.length){
                descendants.push([]);
            }
        }
        render.nodes.push(descendants);
        const drawIndex = render.draws.length - 1;
        const nodeIndex = render.nodes.length - 1;
        const nodeLink = new NodeLink(drawIndex, nodeIndex);
        render.sources.push(nodeLink);
    } else {
        render.sources.push(source);
    }
    const parent = render.nodes[parentId];
    const sourceIndex = render.sources.length - 1;
    parent[parentDescId].push(sourceIndex);
}
function createNodesFromSource(utils, render) {
    let index = 0;
    while(index < render.nodes.length){
        const node = render.nodes[index];
        for(let descArrayIndex = 0; descArrayIndex < node.length; descArrayIndex++){
            const descArray = node[descArrayIndex];
            for (const sourceIndex of descArray){
                const source = render.sources[sourceIndex];
                if (source instanceof NodeLink) {
                    render.nodes[source.nodeIndex];
                    const draw = render.draws[source.drawIndex];
                    let data = utils.getBuilderData(draw.templateStrings);
                    if (data !== undefined) {
                        for(let descIndex = 0; descIndex < data.descendants.length; descIndex++){
                            const descendant = data.descendants[descIndex];
                            const descSource = draw.injections[descendant.index];
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
            }
        }
        index += 1;
    }
}
function createRender(utils, source) {
    const node = [
        []
    ];
    const render = {
        root: [],
        sources: [],
        draws: [],
        builds: [],
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
function findTargets(render, targets, nodeIndex) {
    targets.push(nodeIndex);
    let index = targets.length - 1;
    while(index < targets.length){
        const targetIndex = targets[index];
        const node = render.nodes[targetIndex];
        for (const descArray of node){
            for (const descIndex of descArray){
                const source = render.sources[descIndex];
                if (source instanceof NodeLink) {
                    targets.push(source.nodeIndex);
                }
            }
        }
        index += 1;
    }
}
function diff(utils, source, parentNode, leftNode, prevRender) {
    const render = createRender(utils, source);
    createNodesFromSource(utils, render);
    console.log(render);
    const delta = {
        addedIndexes: [],
        survivedIndexes: [],
        prevSurvivedIndexes: [],
        removedIndexes: []
    };
    if (prevRender === undefined) {
        findTargets(render, delta.addedIndexes, 0);
    }
    console.log(delta);
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
const builderDataCache = new WeakMap();
function getBuilder(utils, template) {
    let builderData = builderDataCache.get(template);
    if (builderData === undefined) {
        const builder = new Builder();
        parse(template, builder);
        builderData = builder.build(utils, template);
    }
    if (builderData !== undefined) {
        builderDataCache.set(template, builderData);
    }
    return builderData;
}
class DOMUtils {
    createNode(tagname) {
        return document.createElement(tagname);
    }
    createTextNode(text) {
        return document.createTextNode(text);
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
    getBuilderData(template) {
        return getBuilder(this, template);
    }
}
const domutils = new DOMUtils();
document.createTextNode("hello!");
const testArray = ()=>{
    return [
        "world",
        [
            "what's",
            "really"
        ],
        "good"
    ];
};
const testNodeNested = ()=>{
    return draw`
  	<p>howdy!</p>
		<p>hello ${testArray()}!</p>
	`;
};
class TestComponent extends HTMLElement {
    hangar;
    static get observedAttributes() {
        return [
            "message"
        ];
    }
    constructor(){
        super();
        const shadowRoot = this.attachShadow({
            mode: "closed"
        });
        if (shadowRoot) {
            this.hangar = new Hangar(testNodeNested, shadowRoot);
            this.hangar.update(domutils, this);
        }
    }
    attributeChangedCallback() {
        this.hangar.update(domutils, this);
    }
    update() {
        this.hangar.update(domutils, this);
    }
}
customElements.define("test-component", TestComponent);
const testComponent = document.querySelector("test-component");
function onButtonClick() {
    if (testComponent instanceof TestComponent) {
        testComponent.update();
    }
}
const button = document.querySelector("button");
button?.addEventListener("click", onButtonClick);
