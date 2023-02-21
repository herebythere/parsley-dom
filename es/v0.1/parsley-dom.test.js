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
const INIITAL_MAP = new Map([
    [
        "<",
        NODE
    ],
    [
        DEFAULT,
        TEXT
    ]
]);
const NODE_MAP = new Map([
    [
        " ",
        ERROR
    ],
    [
        "\n",
        ERROR
    ],
    [
        "\t",
        ERROR
    ],
    [
        "/",
        CLOSE_NODE_SLASH
    ],
    [
        ">",
        ERROR
    ],
    [
        DEFAULT,
        TAGNAME
    ]
]);
const CLOSE_NODE_SLASH_MAP = new Map([
    [
        " ",
        ERROR
    ],
    [
        "\n",
        ERROR
    ],
    [
        "\t",
        ERROR
    ],
    [
        DEFAULT,
        CLOSE_TAGNAME
    ]
]);
const TAGNAME_MAP = new Map([
    [
        ">",
        NODE_CLOSED
    ],
    [
        " ",
        NODE_SPACE
    ],
    [
        "\n",
        NODE_SPACE
    ],
    [
        "\t",
        NODE_SPACE
    ],
    [
        "/",
        INDEPENDENT_NODE
    ],
    [
        DEFAULT,
        TAGNAME
    ]
]);
const CLOSE_TAGNAME_MAP = new Map([
    [
        ">",
        CLOSE_NODE_CLOSED
    ],
    [
        " ",
        CLOSE_NODE_SPACE
    ],
    [
        "\n",
        CLOSE_NODE_SPACE
    ],
    [
        "\t",
        CLOSE_NODE_SPACE
    ],
    [
        DEFAULT,
        CLOSE_TAGNAME
    ]
]);
const CLOSE_NODE_SPACE_MAP = new Map([
    [
        ">",
        CLOSE_NODE_CLOSED
    ],
    [
        DEFAULT,
        CLOSE_NODE_SPACE
    ]
]);
const INDEPENDENT_NODE_MAP = new Map([
    [
        ">",
        INDEPENDENT_NODE_CLOSED
    ],
    [
        DEFAULT,
        INDEPENDENT_NODE
    ]
]);
const NODE_SPACE_MAP = new Map([
    [
        ">",
        NODE_CLOSED
    ],
    [
        " ",
        NODE_SPACE
    ],
    [
        "\n",
        NODE_SPACE
    ],
    [
        "\t",
        NODE_SPACE
    ],
    [
        "/",
        INDEPENDENT_NODE
    ],
    [
        DEFAULT,
        ATTRIBUTE
    ]
]);
const ATTRIBUTE_MAP = new Map([
    [
        " ",
        NODE_SPACE
    ],
    [
        "\n",
        NODE_SPACE
    ],
    [
        "\t",
        NODE_SPACE
    ],
    [
        "=",
        ATTRIBUTE_SETTER
    ],
    [
        ">",
        NODE_CLOSED
    ],
    [
        "/",
        INDEPENDENT_NODE
    ],
    [
        DEFAULT,
        ATTRIBUTE
    ]
]);
const ATTRIBUTE_SETTER_MAP = new Map([
    [
        '"',
        ATTRIBUTE_DECLARATION
    ],
    [
        "\n",
        NODE_SPACE
    ],
    [
        DEFAULT,
        NODE_SPACE
    ]
]);
const ATTRIBUTE_DECLARATION_MAP = new Map([
    [
        '"',
        ATTRIBUTE_DECLARATION_CLOSE
    ],
    [
        DEFAULT,
        ATTRIBUTE_VALUE
    ]
]);
const ATTRIBUTE_VALUE_MAP = new Map([
    [
        '"',
        ATTRIBUTE_DECLARATION_CLOSE
    ],
    [
        DEFAULT,
        ATTRIBUTE_VALUE
    ]
]);
const ATTRIBUTE_DECLARATION_CLOSE_MAP = new Map([
    [
        ">",
        INDEPENDENT_NODE_CLOSED
    ],
    [
        "/",
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
function draw(templateStrings, ...injections) {
    return {
        templateStrings,
        injections
    };
}
new Set([
    "script"
]);
function createBuilderRender() {
    return {
        slots: new Map(),
        references: new Map(),
        injections: new Map()
    };
}
function createStack() {
    return {
        attribute: undefined,
        slotFound: false,
        address: []
    };
}
function buildLogic(data, step) {
    if (step.type !== "BUILD") return;
    if (step.state === "INITIAL") {
        data.stack.address.push(-1);
    }
    if (step.state === "TAGNAME") {
        const tagname = getText(data.template, step.vector);
        data.stack.slotFound = tagname === "slot";
        data.stack.address[data.stack.address.length - 1] += 1;
    }
    if (step.state === "NODE_CLOSED") {
        data.stack.address.push(-1);
    }
    if (step.state === "TEXT") {
        data.stack.address[data.stack.address.length - 1] += 1;
    }
    if (step.state === "CLOSE_TAGNAME") {
        data.stack.address.pop();
    }
    if (step.state === "INDEPENDENT_NODE_CLOSED") {}
    if (step.state === "ATTRIBUTE") {
        const attribute = getText(data.template, step.vector);
        if (attribute !== undefined && attribute.startsWith("*")) {
            const name = attribute.slice(1);
            data.render.references.set(name, data.stack.address.slice());
            return;
        }
        data.stack.attribute = undefined;
    }
    if (step.state === "ATTRIBUTE_VALUE" && data.stack.attribute !== undefined) {
        const value = getText(data.template, step.vector);
        if (value !== undefined && data.stack.slotFound && data.stack.attribute === "name") {
            data.render.slots.set(value, data.stack.address.slice());
        }
        data.stack.attribute = undefined;
    }
}
function injectLogic(data, step) {
    if (step.type !== "INJECT") return;
    const { state , index  } = step;
    data.render.injections.set(index, {
        address: data.stack.address.slice(),
        type: state,
        index
    });
}
class DOMBuilder {
    template;
    stack;
    render;
    setup(template) {
        this.render = createBuilderRender();
        this.stack = createStack();
        this.template = template;
    }
    push(step) {
        if (step.state === "ERROR") {}
        if (step.type === "BUILD") {
            buildLogic(this, step);
        }
        if (step.type === "INJECT") {
            injectLogic(this, step);
        }
    }
}
const title = "DOMBuilder";
function isNotEqual(mapA, mapB) {
    if (mapA.size !== mapB.size) {
        return false;
    }
    for (const [index, entry] of mapA){
        const mapEntry = mapB.get(index);
        if (mapEntry === undefined) return true;
        if (entry.type !== mapEntry.type) return true;
        if (entry.address.length !== mapEntry.address.length) return true;
        let arrIndex = 0;
        while(arrIndex < entry.address.length){
            if (entry.address[arrIndex] !== mapEntry.address[arrIndex]) return true;
            arrIndex += 1;
        }
    }
    return false;
}
const testInjectionAddresses = ()=>{
    const assertions = [];
    const expectedResults = new Map([]);
    const template = draw`<a ${"a"}><b>${"b"}</b>${"b_tail"}</a>`;
    const builder = new DOMBuilder();
    builder.setup(template.templateStrings);
    parse(template.templateStrings, builder);
    console.log(builder.render.injections);
    if (isNotEqual(expectedResults, builder.render.injections)) {
        assertions.push("map addresses do not match");
    }
    return assertions;
};
const testInjectionAddressesWithText = ()=>{
    const assertions = [];
    const expectedResults = new Map([]);
    const template = draw`${"a_head"}
  	<a ${"a"}>
  		<b>  ${"b"} </b>
  		${"b_tail"}
  	</a>
${"a_tail"}`;
    const builder = new DOMBuilder();
    builder.setup(template.templateStrings);
    parse(template.templateStrings, builder);
    if (isNotEqual(expectedResults, builder.render.injections)) {
        assertions.push("map addresses do not match");
    }
    return assertions;
};
const testReferenceAddresses = ()=>{
    const assertions = [];
    const expectedResults = new Map([]);
    const template = draw`<a *ref ></a>`;
    const builder = new DOMBuilder();
    builder.setup(template.templateStrings);
    parse(template.templateStrings, builder);
    console.log(builder.render);
    if (isNotEqual(expectedResults, builder.render.injections)) {
        assertions.push("map addresses do not match");
    }
    return assertions;
};
const testSlotAddresses = ()=>{
    const assertions = [];
    const expectedResults = new Map([]);
    const template = draw`<slot name="boop" ></a>`;
    const builder = new DOMBuilder();
    builder.setup(template.templateStrings);
    parse(template.templateStrings, builder);
    console.log(builder.render);
    if (isNotEqual(expectedResults, builder.render.injections)) {
        assertions.push("map addresses do not match");
    }
    return assertions;
};
const tests = [
    testInjectionAddresses,
    testInjectionAddressesWithText,
    testReferenceAddresses,
    testSlotAddresses
];
const unitTestDOMBuilder = {
    title,
    tests,
    runTestsAsynchronously: true
};
const testCollections = [
    unitTestDOMBuilder
];
export { testCollections as testCollections };
