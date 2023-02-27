// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

class DOMHangar {
    drawFuncs;
    parentNode;
    leftNode;
    prevDraw;
    prevRender;
    state;
    queuedForUpdate = false;
    setup(drawFuncs, parentNode, leftNode) {
        this.drawFuncs = drawFuncs;
        this.parentNode = parentNode;
        this.leftNode = leftNode;
    }
    update(state) {
        this.state = state;
        if (!this.queuedForUpdate) {
            queueMicrotask(this.render);
            this.queuedForUpdate = true;
        }
    }
    render = ()=>{
        this.queuedForUpdate = false;
    };
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
export { DOMHangar as DOMHangar };
export { draw as draw };
