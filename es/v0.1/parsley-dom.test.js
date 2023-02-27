// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const title = "DOMBuilder";
function autoFail() {
    return [
        "fail first"
    ];
}
const tests = [
    autoFail
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
