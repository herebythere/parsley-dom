// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

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
        slotFound: false,
        slotName: undefined,
        attributeStep: undefined,
        address: []
    };
}
function buildLogic(data, step) {
    if (step.type !== "BUILD") return;
    if (step.state === "INITIAL") {
        data.stack.address.push(-1);
    }
    if (step.state === "TAGNAME") {
        data.stack.address[data.stack.address.length - 1] += 1;
        data.stack.address.push(-1);
    }
    if (step.state === "TEXT") {
        data.stack.address[data.stack.address.length - 1] += 1;
    }
    if (step.state === "CLOSE_TAGNAME") {
        data.stack.address.pop();
    }
    if (step.state === "INDEPENDENT_NODE_CLOSED") {
        data.stack.address.pop();
    }
    if (step.state === "ATTRIBUTE") {
        data.stack.attributeStep = step;
    }
    if (step.state === "ATTRIBUTE_VALUE" && data.stack.attributeStep !== undefined) {
        data.stack.attributeStep = undefined;
    }
    if (step.state === "NODE_SPACE") {}
}
function injectLogic(data, step) {
    if (step.type !== "INJECT") return;
    const { index , state  } = step;
    if (state === "ATTRIBUTE_MAP_INJECTION") {
        data.render.injections.set(index, {
            address: data.stack.address.slice(),
            type: state,
            index
        });
    }
    if (state === "DESCENDANT_INJECTION") {
        data.render.injections.set(index, {
            address: data.stack.address.slice(),
            index,
            type: state
        });
    }
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
