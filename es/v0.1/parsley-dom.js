// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function draw(templateStrings, ...injections) {
    return {
        templateStrings,
        injections
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
export { draw as draw };
export { DOMBuilder as DOMBuilder };
