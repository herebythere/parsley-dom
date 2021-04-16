const copy1 = (position)=>{
    return {
        ...position
    };
};
const increment = (template, position)=>{
    const chunk = template.templateArray[position.arrayIndex];
    if (chunk === undefined) {
        return;
    }
    const templateLength = template.templateArray.length - 1;
    if (position.arrayIndex >= templateLength && position.stringIndex >= chunk.length - 1) {
        return;
    }
    if (chunk.length > 0) {
        position.stringIndex += 1;
        position.stringIndex %= chunk.length;
    }
    if (position.stringIndex === 0) {
        position.arrayIndex += 1;
    }
    return position;
};
const decrement = (template, position)=>{
    const chunk = template.templateArray[position.arrayIndex];
    if (chunk === undefined) {
        return;
    }
    if (position.arrayIndex <= 0 && position.stringIndex <= 0) {
        return;
    }
    position.stringIndex -= 1;
    if (position.arrayIndex > 0 && position.stringIndex < 0) {
        position.arrayIndex -= 1;
        const chunk1 = template.templateArray[position.arrayIndex];
        position.stringIndex = chunk1.length - 1;
        if (chunk1 === "") {
            position.stringIndex = chunk1.length;
        }
    }
    return position;
};
const getCharAtPosition = (template, position)=>{
    const templateArray = template.templateArray;
    return templateArray[position.arrayIndex]?.[position.stringIndex];
};
const DEFAULT_POSITION = {
    arrayIndex: 0,
    stringIndex: 0
};
const create = (position = DEFAULT_POSITION)=>({
        origin: {
            ...position
        },
        target: {
            ...position
        }
    })
;
const createFollowingVector = (template, vector)=>{
    const followingVector = copy2(vector);
    if (increment(template, followingVector.target)) {
        followingVector.origin = copy1(followingVector.target);
        return followingVector;
    }
};
const copy2 = (vector)=>{
    return {
        origin: copy1(vector.origin),
        target: copy1(vector.target)
    };
};
const incrementOrigin = (template, vector)=>{
    if (increment(template, vector.origin)) {
        return vector;
    }
    return;
};
const decrementOrigin = (template, vector)=>{
    if (decrement(template, vector.origin)) {
        return vector;
    }
    return;
};
const incrementTarget = (template, vector)=>{
    if (increment(template, vector.target)) {
        return vector;
    }
    return;
};
const decrementTarget = (template, vector)=>{
    if (decrement(template, vector.target)) {
        return vector;
    }
    return;
};
const getTextFromTarget = (template, vector)=>{
    const templateArray = template.templateArray;
    const { arrayIndex , stringIndex  } = vector.target;
    if (arrayIndex > templateArray.length - 1) {
        return;
    }
    if (stringIndex > templateArray[arrayIndex].length - 1) {
        return;
    }
    return templateArray[arrayIndex][stringIndex];
};
const hasOriginEclipsedTaraget = (vector)=>{
    if (vector.origin.arrayIndex >= vector.target.arrayIndex && vector.origin.stringIndex >= vector.target.stringIndex) {
        return true;
    }
    return false;
};
const getText = (template, vector)=>{
    if (vector.target.arrayIndex === vector.origin.arrayIndex) {
        const distance = vector.target.stringIndex - vector.origin.stringIndex + 1;
        const templateText = template.templateArray[vector.origin.arrayIndex];
        const copiedText = templateText.substr(vector.origin.stringIndex, distance);
        return copiedText;
    }
    const texts = [];
    let templateText = template.templateArray[vector.origin.arrayIndex];
    if (templateText === undefined) {
        return;
    }
    const templateTextIndex = vector.origin.stringIndex;
    let distance = templateText.length - templateTextIndex;
    let copiedText = templateText.substr(templateTextIndex, distance);
    texts.push(copiedText);
    let tail = vector.origin.arrayIndex + 1;
    while(tail < vector.target.arrayIndex){
        texts.push(template.templateArray[tail]);
        tail += 1;
    }
    templateText = template.templateArray[vector.target.arrayIndex];
    if (templateText === undefined) {
        return;
    }
    distance = vector.target.stringIndex + 1;
    copiedText = templateText.substr(0, distance);
    texts.push(copiedText);
    return texts.join("");
};
const BREAK_RUNES = {
    " ": true,
    "\n": true
};
const crawlForTagName = (template, innerXmlBounds)=>{
    const tagVector = copy2(innerXmlBounds);
    let positionChar = getCharAtPosition(template, tagVector.origin);
    if (positionChar === undefined || BREAK_RUNES[positionChar]) {
        return;
    }
    while(BREAK_RUNES[positionChar] === undefined && !hasOriginEclipsedTaraget(tagVector)){
        if (incrementOrigin(template, tagVector) === undefined) {
            return;
        }
        positionChar = getCharAtPosition(template, tagVector.origin);
        if (positionChar === undefined) {
            return;
        }
    }
    const adjustedVector = {
        origin: {
            ...innerXmlBounds.origin
        },
        target: {
            ...tagVector.origin
        }
    };
    if (BREAK_RUNES[positionChar]) {
        decrementTarget(template, adjustedVector);
    }
    return adjustedVector;
};
const QUOTE_RUNE = '"';
const ASSIGN_RUNE = "=";
const ATTRIBUTE_FOUND = "ATTRIBUTE_FOUND";
const ATTRIBUTE_ASSIGNMENT = "ATTRIBUTE_ASSIGNMENT";
const IMPLICIT_ATTRIBUTE = "IMPLICIT_ATTRIBUTE";
const EXPLICIT_ATTRIBUTE = "EXPLICIT_ATTRIBUTE";
const INJECTED_ATTRIBUTE = "INJECTED_ATTRIBUTE";
const BREAK_RUNES1 = {
    " ": true,
    "\n": true,
    "/": true
};
const getAttributeName = (template, vectorBounds)=>{
    let positionChar = getCharAtPosition(template, vectorBounds.origin);
    if (positionChar === undefined || BREAK_RUNES1[positionChar]) {
        return;
    }
    let tagNameCrawlState = ATTRIBUTE_FOUND;
    const bounds = copy2(vectorBounds);
    while(tagNameCrawlState === ATTRIBUTE_FOUND && !hasOriginEclipsedTaraget(bounds)){
        if (incrementOrigin(template, bounds) === undefined) {
            return;
        }
        positionChar = getCharAtPosition(template, bounds.origin);
        if (positionChar === undefined) {
            return;
        }
        tagNameCrawlState = ATTRIBUTE_FOUND;
        if (BREAK_RUNES1[positionChar]) {
            tagNameCrawlState = IMPLICIT_ATTRIBUTE;
        }
        if (positionChar === ASSIGN_RUNE) {
            tagNameCrawlState = ATTRIBUTE_ASSIGNMENT;
        }
    }
    const attributeVector = {
        origin: {
            ...vectorBounds.origin
        },
        target: {
            ...bounds.origin
        }
    };
    if (tagNameCrawlState === ATTRIBUTE_FOUND) {
        return {
            kind: IMPLICIT_ATTRIBUTE,
            attributeVector
        };
    }
    if (tagNameCrawlState === IMPLICIT_ATTRIBUTE) {
        if (BREAK_RUNES1[positionChar]) {
            decrementTarget(template, attributeVector);
        }
        return {
            kind: IMPLICIT_ATTRIBUTE,
            attributeVector
        };
    }
    if (tagNameCrawlState === ATTRIBUTE_ASSIGNMENT) {
        decrementTarget(template, attributeVector);
        return {
            kind: EXPLICIT_ATTRIBUTE,
            valueVector: attributeVector,
            attributeVector
        };
    }
};
const getAttributeValue = (template, vectorBounds, attributeAction)=>{
    let positionChar = getCharAtPosition(template, vectorBounds.origin);
    if (positionChar !== ASSIGN_RUNE) {
        return;
    }
    const bound = copy2(vectorBounds);
    incrementOrigin(template, bound);
    if (hasOriginEclipsedTaraget(bound)) {
        return;
    }
    positionChar = getCharAtPosition(template, bound.origin);
    if (positionChar !== QUOTE_RUNE) {
        return;
    }
    const { arrayIndex  } = bound.origin;
    const valVector = copy2(bound);
    if (incrementOrigin(template, valVector) === undefined) {
        return;
    }
    positionChar = getCharAtPosition(template, valVector.origin);
    if (positionChar === undefined) {
        return;
    }
    const arrayIndexDistance = Math.abs(arrayIndex - valVector.origin.arrayIndex);
    if (arrayIndexDistance === 1 && positionChar === QUOTE_RUNE) {
        return {
            kind: INJECTED_ATTRIBUTE,
            injectionID: arrayIndex,
            attributeVector: attributeAction.attributeVector,
            valueVector: {
                origin: {
                    ...bound.origin
                },
                target: {
                    ...valVector.origin
                }
            }
        };
    }
    while(positionChar !== QUOTE_RUNE && !hasOriginEclipsedTaraget(valVector)){
        if (incrementOrigin(template, valVector) === undefined) {
            return;
        }
        if (arrayIndex < valVector.origin.arrayIndex) {
            return;
        }
        positionChar = getCharAtPosition(template, valVector.origin);
        if (positionChar === undefined) {
            return;
        }
    }
    if (attributeAction.kind === "EXPLICIT_ATTRIBUTE" && positionChar === QUOTE_RUNE) {
        attributeAction.valueVector = {
            origin: {
                ...bound.origin
            },
            target: {
                ...valVector.origin
            }
        };
        return attributeAction;
    }
};
const crawlForAttribute = (template, vectorBounds)=>{
    const attrResults = getAttributeName(template, vectorBounds);
    if (attrResults === undefined) {
        return;
    }
    if (attrResults.kind === "IMPLICIT_ATTRIBUTE") {
        return attrResults;
    }
    const valBounds = copy2(vectorBounds);
    valBounds.origin = {
        ...attrResults.attributeVector.target
    };
    incrementOrigin(template, valBounds);
    return getAttributeValue(template, valBounds, attrResults);
};
const incrementOriginToNextSpaceRune = (template, innerXmlBounds)=>{
    let positionChar = getCharAtPosition(template, innerXmlBounds.origin);
    if (positionChar === undefined) {
        return;
    }
    while(positionChar !== " "){
        if (hasOriginEclipsedTaraget(innerXmlBounds)) {
            return;
        }
        if (incrementOrigin(template, innerXmlBounds) === undefined) {
            return;
        }
        positionChar = getCharAtPosition(template, innerXmlBounds.origin);
        if (positionChar === undefined) {
            return;
        }
    }
    return innerXmlBounds;
};
const incrementOriginToNextCharRune = (template, innerXmlBounds)=>{
    let positionChar = getCharAtPosition(template, innerXmlBounds.origin);
    if (positionChar === undefined) {
        return;
    }
    while(positionChar === " "){
        if (hasOriginEclipsedTaraget(innerXmlBounds)) {
            return;
        }
        if (incrementOrigin(template, innerXmlBounds) === undefined) {
            return;
        }
        positionChar = getCharAtPosition(template, innerXmlBounds.origin);
        if (positionChar === undefined) {
            return;
        }
    }
    return innerXmlBounds;
};
const appendNodeAttributeIntegrals = ({ integrals , template , chunk ,  })=>{
    let safety = 0;
    while(!hasOriginEclipsedTaraget(chunk) && safety < 256){
        safety += 1;
        if (incrementOriginToNextSpaceRune(template, chunk) === undefined) {
            return;
        }
        if (incrementOriginToNextCharRune(template, chunk) === undefined) {
            return;
        }
        const attributeCrawlResults = crawlForAttribute(template, chunk);
        if (attributeCrawlResults === undefined) {
            return;
        }
        if (attributeCrawlResults.kind === "IMPLICIT_ATTRIBUTE") {
            chunk.origin = {
                ...attributeCrawlResults.attributeVector.target
            };
        }
        if (attributeCrawlResults.kind === "EXPLICIT_ATTRIBUTE") {
            chunk.origin = {
                ...attributeCrawlResults.valueVector.target
            };
        }
        if (attributeCrawlResults.kind === "INJECTED_ATTRIBUTE") {
            chunk.origin = {
                ...attributeCrawlResults.valueVector.target
            };
        }
        integrals.push(attributeCrawlResults);
    }
    return integrals;
};
const appendNodeIntegrals = ({ kind , integrals , template , chunk ,  })=>{
    const innerXmlBounds = copy2(chunk.vector);
    incrementOrigin(template, innerXmlBounds);
    decrementTarget(template, innerXmlBounds);
    const tagNameVector = crawlForTagName(template, innerXmlBounds);
    if (tagNameVector === undefined) {
        return;
    }
    integrals.push({
        kind,
        tagNameVector
    });
    const followingVector = createFollowingVector(template, tagNameVector);
    if (followingVector === undefined) {
        return;
    }
    followingVector.target = {
        ...innerXmlBounds.target
    };
    appendNodeAttributeIntegrals({
        integrals,
        template,
        chunk: followingVector
    });
    return integrals;
};
const appendCloseNodeIntegrals = ({ integrals , template , chunk ,  })=>{
    const innerXmlBounds = copy2(chunk.vector);
    incrementOrigin(template, innerXmlBounds);
    incrementOrigin(template, innerXmlBounds);
    decrementTarget(template, innerXmlBounds);
    const tagNameVector = crawlForTagName(template, copy2(innerXmlBounds));
    if (tagNameVector === undefined) {
        return;
    }
    tagNameVector.origin = {
        ...innerXmlBounds.origin
    };
    integrals.push({
        kind: "CLOSE_NODE",
        tagNameVector
    });
    return integrals;
};
const appendContentIntegrals = ({ integrals , template , chunk ,  })=>{
    const { origin , target  } = chunk.vector;
    if (origin.arrayIndex === target.arrayIndex) {
        integrals.push({
            kind: "TEXT",
            textVector: chunk.vector
        });
        return;
    }
    let stringIndex = template.templateArray[origin.arrayIndex].length - 1;
    let textVector = {
        origin,
        target: {
            arrayIndex: origin.arrayIndex,
            stringIndex
        }
    };
    integrals.push({
        kind: "TEXT",
        textVector
    });
    integrals.push({
        kind: "CHUNK_ARRAY_INJECTION",
        injectionID: origin.arrayIndex
    });
    let arrayIndex = origin.arrayIndex + 1;
    while(arrayIndex < target.arrayIndex){
        stringIndex = template.templateArray[arrayIndex].length - 1;
        textVector = {
            origin: {
                arrayIndex,
                stringIndex: 0
            },
            target: {
                arrayIndex,
                stringIndex
            }
        };
        integrals.push({
            kind: "TEXT",
            textVector
        });
        integrals.push({
            kind: "CHUNK_ARRAY_INJECTION",
            injectionID: arrayIndex
        });
        arrayIndex += 1;
    }
    textVector = {
        origin: {
            arrayIndex: target.arrayIndex,
            stringIndex: 0
        },
        target
    };
    integrals.push({
        kind: "TEXT",
        textVector
    });
    return integrals;
};
const buildIntegrals = ({ template , skeleton  })=>{
    const integrals = [];
    for (const chunk of skeleton){
        const nodeType = chunk.nodeType;
        const origin = chunk.vector.origin;
        if (origin.stringIndex === 0 && origin.arrayIndex !== 0) {
            integrals.push({
                kind: "CHUNK_ARRAY_INJECTION",
                injectionID: origin.arrayIndex - 1
            });
        }
        if (nodeType === "OPEN_NODE_CONFIRMED") {
            appendNodeIntegrals({
                kind: "NODE",
                integrals,
                template,
                chunk
            });
        }
        if (nodeType === "CLOSE_NODE_CONFIRMED") {
            appendCloseNodeIntegrals({
                integrals,
                template,
                chunk
            });
        }
        if (nodeType === "CONTENT_NODE") {
            appendContentIntegrals({
                integrals,
                template,
                chunk
            });
        }
        if (nodeType === "SELF_CLOSING_NODE_CONFIRMED") {
            appendNodeIntegrals({
                kind: "SELF_CLOSING_NODE",
                integrals,
                template,
                chunk
            });
        }
    }
    return integrals;
};
const routers = {
    CONTENT_NODE: {
        "<": "OPEN_NODE",
        DEFAULT: "CONTENT_NODE"
    },
    OPEN_NODE: {
        " ": "CONTENT_NODE",
        "\n": "CONTENT_NODE",
        "<": "OPEN_NODE",
        "/": "CLOSE_NODE",
        DEFAULT: "OPEN_NODE_VALID"
    },
    OPEN_NODE_VALID: {
        "<": "OPEN_NODE",
        "/": "SELF_CLOSING_NODE_VALID",
        ">": "OPEN_NODE_CONFIRMED",
        DEFAULT: "OPEN_NODE_VALID"
    },
    CLOSE_NODE: {
        " ": "CONTENT_NODE",
        "\n": "CONTENT_NODE",
        "<": "OPEN_NODE",
        DEFAULT: "CLOSE_NODE_VALID"
    },
    CLOSE_NODE_VALID: {
        "<": "OPEN_NODE",
        ">": "CLOSE_NODE_CONFIRMED",
        DEFAULT: "CLOSE_NODE_VALID"
    },
    SELF_CLOSING_NODE_VALID: {
        "<": "OPEN_NODE",
        ">": "SELF_CLOSING_NODE_CONFIRMED",
        DEFAULT: "SELF_CLOSING_NODE_VALID"
    }
};
const DEFAULT = "DEFAULT";
const CONTENT_NODE = "CONTENT_NODE";
const OPEN_NODE = "OPEN_NODE";
const validSieve = {
    ["OPEN_NODE_VALID"]: "OPEN_NODE_VALID",
    ["CLOSE_NODE_VALID"]: "CLOSE_NODE_VALID",
    ["SELF_CLOSING_NODE_VALID"]: "SELF_CLOSING_NODE_VALID"
};
const confirmedSieve = {
    ["OPEN_NODE_CONFIRMED"]: "OPEN_NODE_CONFIRMED",
    ["CLOSE_NODE_CONFIRMED"]: "CLOSE_NODE_CONFIRMED",
    ["SELF_CLOSING_NODE_CONFIRMED"]: "SELF_CLOSING_NODE_CONFIRMED"
};
const setStartStateProperties = (template, previousCrawl)=>{
    if (previousCrawl === undefined) {
        return {
            nodeType: CONTENT_NODE,
            vector: create()
        };
    }
    const followingVector = createFollowingVector(template, previousCrawl.vector);
    if (followingVector === undefined) {
        return;
    }
    const crawlState = {
        nodeType: CONTENT_NODE,
        vector: followingVector
    };
    return crawlState;
};
const setNodeType = (template, crawlState)=>{
    const nodeStates = routers[crawlState.nodeType];
    const __char = getCharAtPosition(template, crawlState.vector.target);
    if (nodeStates !== undefined && __char !== undefined) {
        const defaultNodeType = nodeStates[DEFAULT] ?? CONTENT_NODE;
        crawlState.nodeType = nodeStates[__char] ?? defaultNodeType;
    }
    return crawlState;
};
const crawl = (template, previousCrawl)=>{
    const crawlState = setStartStateProperties(template, previousCrawl);
    if (crawlState === undefined) {
        return;
    }
    let openPosition;
    setNodeType(template, crawlState);
    while(incrementTarget(template, crawlState.vector)){
        if (validSieve[crawlState.nodeType] === undefined && crawlState.vector.target.stringIndex === 0) {
            crawlState.nodeType = CONTENT_NODE;
        }
        setNodeType(template, crawlState);
        if (crawlState.nodeType === OPEN_NODE) {
            openPosition = copy1(crawlState.vector.target);
        }
        if (confirmedSieve[crawlState.nodeType]) {
            if (openPosition !== undefined) {
                crawlState.vector.origin = openPosition;
            }
            break;
        }
    }
    return crawlState;
};
const DEFAULT_CRAWL_RESULTS = {
    nodeType: "CONTENT_NODE",
    vector: {
        origin: {
            arrayIndex: 0,
            stringIndex: 0
        },
        target: {
            arrayIndex: 0,
            stringIndex: 0
        }
    }
};
const SKELETON_SIEVE = {
    ["OPEN_NODE_CONFIRMED"]: "OPEN_NODE",
    ["SELF_CLOSING_NODE_CONFIRMED"]: "SELF_CLOSING_NODE",
    ["CLOSE_NODE_CONFIRMED"]: "CLOSE_NODE",
    ["CONTENT_NODE"]: "CONTENT_NODE"
};
const isDistanceGreaterThanOne = ({ template , origin , target ,  })=>{
    if (hasOriginEclipsedTaraget({
        origin,
        target
    })) {
        return false;
    }
    const originCopy = copy1(origin);
    if (increment(template, originCopy) === undefined) {
        return false;
    }
    if (target.arrayIndex === originCopy.arrayIndex && target.stringIndex === originCopy.stringIndex) {
        return false;
    }
    return true;
};
const buildMissingStringNode = ({ template , previousCrawl , currentCrawl ,  })=>{
    const originPos = previousCrawl !== undefined ? previousCrawl.vector.target : DEFAULT_CRAWL_RESULTS.vector.target;
    const targetPos = currentCrawl.vector.origin;
    if (!isDistanceGreaterThanOne({
        template,
        origin: originPos,
        target: targetPos
    })) {
        return;
    }
    const origin = previousCrawl === undefined ? copy1(DEFAULT_CRAWL_RESULTS.vector.target) : copy1(previousCrawl.vector.target);
    const target = copy1(currentCrawl.vector.origin);
    decrement(template, target);
    if (previousCrawl !== undefined) {
        increment(template, origin);
    }
    return {
        nodeType: "CONTENT_NODE",
        vector: {
            origin,
            target
        }
    };
};
const buildSkeleton = (template)=>{
    const skeleton = [];
    let previousCrawl;
    let currentCrawl = crawl(template, previousCrawl);
    let depth = 0;
    while(currentCrawl && depth < 128){
        const stringBone = buildMissingStringNode({
            template,
            previousCrawl,
            currentCrawl
        });
        if (stringBone) {
            skeleton.push(stringBone);
        }
        if (SKELETON_SIEVE[currentCrawl.nodeType]) {
            skeleton.push(currentCrawl);
        }
        previousCrawl = currentCrawl;
        currentCrawl = crawl(template, previousCrawl);
        depth += 1;
    }
    return skeleton;
};
const popSelfClosingNode = (rs)=>{
    const parent = rs.stack[rs.stack.length - 1];
    if (parent !== undefined && parent.kind === "NODE" && parent.selfClosing === true) {
        rs.stack.pop();
        rs.lastNodes.pop();
    }
};
const createTextNode = ({ hooks , rs , integral  })=>{
    popSelfClosingNode(rs);
    const text = getText(rs.template, integral.textVector);
    if (text === undefined) {
        return;
    }
    const descendant = hooks.createTextNode(text);
    const parentNode = rs.stack[rs.stack.length - 1]?.node;
    const lastNodeIndex = rs.lastNodes.length - 1;
    const leftNode = rs.lastNodes[lastNodeIndex];
    const isSiblingLevel = rs.stack.length === 0;
    if (rs.stack.length === 0) {
        rs.siblings.push([
            descendant
        ]);
    } else {
        hooks.insertDescendant({
            parentNode,
            descendant,
            leftNode
        });
    }
    rs.lastNodes[lastNodeIndex] = descendant;
};
const createNode = ({ hooks , rs , integral  })=>{
    popSelfClosingNode(rs);
    const tagName = getText(rs.template, integral.tagNameVector);
    if (tagName === undefined) {
        return;
    }
    const parent = rs.stack[rs.stack.length - 1];
    const descendant = hooks.createNode(tagName);
    const parentNode = parent?.node;
    const lastNodeIndex = rs.lastNodes.length - 1;
    const leftNode = rs.lastNodes[lastNodeIndex];
    const isSiblingLevel = rs.stack.length === 0;
    if (isSiblingLevel) {
        rs.siblings.push([
            descendant
        ]);
    } else {
        hooks.insertDescendant({
            parentNode,
            leftNode,
            descendant
        });
    }
    rs.lastNodes[lastNodeIndex] = descendant;
    rs.lastNodes.push(undefined);
    const selfClosing = integral.kind === "SELF_CLOSING_NODE";
    rs.stack.push({
        kind: "NODE",
        node: descendant,
        selfClosing,
        tagName
    });
};
const closeNode = ({ hooks , rs , integral  })=>{
    if (rs.stack.length === 0) {
        return;
    }
    popSelfClosingNode(rs);
    const tagName = getText(rs.template, integral.tagNameVector);
    const nodeBit = rs.stack[rs.stack.length - 1];
    if (nodeBit.kind !== "NODE") {
        return;
    }
    if (nodeBit.tagName === tagName) {
        rs.stack.pop();
        rs.lastNodes.pop();
    }
};
const createChunkArrayInjection = ({ hooks , rs , integral ,  })=>{
    popSelfClosingNode(rs);
    const parentNode = rs.stack[rs.stack.length - 1]?.node;
    const lastNodeIndex = rs.lastNodes.length - 1;
    const leftNode = rs.lastNodes[lastNodeIndex];
    const injection = rs.template.injections[integral.injectionID];
    const isSiblingLevel = rs.stack.length === 0;
    let siblingIndex;
    if (!Array.isArray(injection)) {
        const text = String(injection);
        const textNode = hooks.createTextNode(text);
        if (rs.stack.length === 0) {
            rs.siblings.push([
                textNode
            ]);
            siblingIndex = rs.siblings.length - 1;
        } else {
            hooks.insertDescendant({
                descendant: textNode,
                parentNode,
                leftNode
            });
        }
        rs.descendants[integral.injectionID] = {
            kind: "TEXT",
            params: {
                textNode,
                leftNode,
                parentNode,
                text,
                siblingIndex
            }
        };
        rs.lastNodes[lastNodeIndex] = textNode;
        return;
    }
    const siblingsFromContextArray = [];
    let prevSibling = leftNode;
    for(const contextID in injection){
        const context = injection[contextID];
        const siblings = context.getSiblings();
        if (isSiblingLevel) {
            for(const siblingID in siblings){
                const sibling = siblings[siblingID];
                siblingsFromContextArray.push(sibling);
                prevSibling = sibling;
            }
        } else {
            prevSibling = context.mount(parentNode, prevSibling);
        }
    }
    if (isSiblingLevel) {
        rs.siblings.push(siblingsFromContextArray);
        siblingIndex = rs.siblings.length - 1;
    }
    rs.descendants[integral.injectionID] = {
        kind: "CHUNK_ARRAY",
        params: {
            chunkArray: injection,
            leftNode,
            parentNode,
            siblingIndex
        }
    };
    rs.lastNodes[lastNodeIndex] = prevSibling;
};
const appendExplicitAttribute = ({ hooks , rs , integral ,  })=>{
    const references = rs.references;
    const node = rs.stack[rs.stack.length - 1].node;
    const attribute = getText(rs.template, integral.attributeVector);
    if (attribute === undefined) {
        return;
    }
    incrementOrigin(rs.template, integral.valueVector);
    decrementTarget(rs.template, integral.valueVector);
    const value = getText(rs.template, integral.valueVector);
    if (value === undefined) {
        return;
    }
    hooks.setAttribute({
        references: rs.references,
        node,
        attribute,
        value
    });
};
const appendImplicitAttribute = ({ hooks , rs , integral ,  })=>{
    if (rs.stack.length === 0) {
        return;
    }
    const { node  } = rs.stack[rs.stack.length - 1];
    const attribute = getText(rs.template, integral.attributeVector);
    if (attribute === undefined) {
        return;
    }
    hooks.setAttribute({
        value: true,
        references: rs.references,
        node,
        attribute
    });
};
const appendInjectedAttribute = ({ hooks , rs , integral ,  })=>{
    if (rs.stack.length === 0) {
        return;
    }
    const { node  } = rs.stack[rs.stack.length - 1];
    const attribute = getText(rs.template, integral.attributeVector);
    if (attribute === undefined) {
        return;
    }
    const { injectionID  } = integral;
    const value = rs.template.injections[injectionID];
    rs.attributes[injectionID] = {
        kind: "ATTRIBUTE",
        params: {
            references: rs.references,
            node,
            attribute,
            value
        }
    };
    hooks.setAttribute({
        references: rs.references,
        node,
        attribute,
        value
    });
};
const buildRender = ({ hooks , template , integrals  })=>{
    const rs = {
        template,
        attributes: {
        },
        references: {
        },
        descendants: {
        },
        siblings: [],
        lastNodes: [
            undefined
        ],
        stack: []
    };
    for (const integral of integrals){
        if (integral.kind === "NODE") {
            createNode({
                hooks,
                rs,
                integral
            });
        }
        if (integral.kind === "SELF_CLOSING_NODE") {
            createNode({
                hooks,
                rs,
                integral
            });
        }
        if (integral.kind === "CLOSE_NODE") {
            closeNode({
                hooks,
                rs,
                integral
            });
        }
        if (integral.kind === "TEXT") {
            createTextNode({
                hooks,
                rs,
                integral
            });
        }
        if (integral.kind === "CHUNK_ARRAY_INJECTION") {
            createChunkArrayInjection({
                hooks,
                rs,
                integral
            });
        }
        if (integral.kind === "EXPLICIT_ATTRIBUTE") {
            appendExplicitAttribute({
                hooks,
                rs,
                integral
            });
        }
        if (integral.kind === "IMPLICIT_ATTRIBUTE") {
            appendImplicitAttribute({
                hooks,
                rs,
                integral
            });
        }
        if (integral.kind === "INJECTED_ATTRIBUTE") {
            appendInjectedAttribute({
                hooks,
                rs,
                integral
            });
        }
    }
    return rs;
};
const builds = {
};
const buildRenderStructure = (hooks, template)=>{
    const cacheable = template.templateArray.join();
    let integrals = builds[cacheable];
    if (integrals === undefined) {
        const skeleton = buildSkeleton(template);
        integrals = buildIntegrals({
            template,
            skeleton
        });
        builds[cacheable] = integrals;
    }
    const render = buildRender({
        hooks,
        template,
        integrals
    });
    return render;
};
class Banger {
    constructor(chunk){
        this.chunk = chunk;
    }
    bang() {
        this.chunk.bang();
    }
    getReferences() {
        return this.chunk.getReferences();
    }
}
class Chunk {
    constructor(baseParams){
        this.banger = new Banger(this);
        this.hooks = baseParams.hooks;
        this.chunker = baseParams.chunker;
        this.params = baseParams.params;
        this.state = this.chunker.connect({
            banger: this.banger,
            params: baseParams.params
        });
        const template1 = this.getTemplate();
        this.rs = buildRenderStructure(this.hooks, template1);
        this.siblings = getUpdatedSiblings(this.rs);
        this.effect = this.updateEffect("UNMOUNTED");
    }
    bang() {
        this.update(this.params);
    }
    update(params) {
        this.setParams(params);
        const template1 = this.getTemplate();
        if (this.effect.quality === "DISCONNECTED") {
            this.disconnect();
            this.remount(template1);
            return;
        }
        if (hasTemplateChanged(this.rs, template1)) {
            this.remount(template1);
            return;
        }
        updateAttributes(this.hooks, this.rs, template1);
        const descendantsHaveUpdated = updateDescendants({
            contextParentNode: this.parentNode,
            hooks: this.hooks,
            rs: this.rs,
            template: template1
        });
        if (descendantsHaveUpdated) {
            this.siblings = getUpdatedSiblings(this.rs);
        }
    }
    mount(parentNode, leftNode) {
        this.parentNode = parentNode;
        this.leftNode = leftNode;
        let prevSibling;
        let descendant = leftNode;
        for(const siblingID in this.siblings){
            prevSibling = descendant;
            descendant = this.siblings[siblingID];
            this.hooks.insertDescendant({
                leftNode: prevSibling,
                parentNode,
                descendant
            });
        }
        this.updateEffect("MOUNTED");
        return descendant;
    }
    unmount() {
        this.parentNode = undefined;
        this.leftNode = undefined;
        for(const siblingID in this.siblings){
            const sibling = this.siblings[siblingID];
            this.hooks.removeDescendant(sibling);
        }
        this.updateEffect("UNMOUNTED");
    }
    disconnect() {
        disconnectDescendants(this.hooks, this.rs);
        if (this.state !== undefined && this.chunker.disconnect !== undefined) {
            this.chunker.disconnect({
                state: this.state
            });
        }
        this.updateEffect("DISCONNECTED");
    }
    getSiblings() {
        return this.siblings;
    }
    getReferences() {
        if (this.rs !== undefined) {
            return this.rs.references;
        }
    }
    getEffect() {
        return this.effect;
    }
    remount(template) {
        this.rs = buildRenderStructure(this.hooks, template);
        this.siblings = getUpdatedSiblings(this.rs);
        this.mount(this.parentNode, this.leftNode);
        this.effect = this.updateEffect("CONNECTED");
    }
    updateEffect(quality) {
        this.effect = {
            timestamp: performance.now(),
            quality
        };
        return this.effect;
    }
    setParams(params) {
        this.params = params;
    }
    getTemplate() {
        return this.chunker.update({
            banger: this.banger,
            state: this.state,
            params: this.params
        });
    }
}
const getUpdatedSiblings = (rs)=>{
    const siblings = [];
    const originalSiblings = rs.siblings;
    for(const siblingArrayID in originalSiblings){
        const siblingArray = originalSiblings[siblingArrayID];
        for(const siblingID in siblingArray){
            const sibling = siblingArray[siblingID];
            siblings.push(sibling);
        }
    }
    return siblings;
};
const hasTemplateChanged = (rs, template2)=>{
    const templateLength = template2.templateArray.length;
    if (rs.template.templateArray.length !== templateLength) {
        return true;
    }
    let index = 0;
    while(index < templateLength){
        const sourceStr = rs.template.templateArray[index];
        const targetStr = template2.templateArray[index];
        if (sourceStr !== targetStr) {
            return true;
        }
        index += 1;
    }
    return false;
};
const updateAttributes = (hooks, rs, template2)=>{
    for(const attributesID in rs.attributes){
        const pastInjection = rs.attributes[attributesID];
        const attributeValue = template2.injections[attributesID];
        if (attributeValue === pastInjection.params.value) {
            continue;
        }
        hooks.removeAttribute(pastInjection.params);
        pastInjection.params.value = attributeValue;
        hooks.setAttribute(pastInjection.params);
    }
};
const updateDescendants = ({ hooks , rs , template: template2 , contextParentNode ,  })=>{
    let siblingLevelUpdated = false;
    for(const descenantID in rs.descendants){
        const pastDescendant = rs.descendants[descenantID];
        const descendant = template2.injections[descenantID];
        if (pastDescendant.kind === "TEXT" && !Array.isArray(descendant)) {
            const text = String(descendant);
            if (pastDescendant.params.text === text) {
                continue;
            }
        }
        if (pastDescendant.kind === "CHUNK_ARRAY") {
            const chunkArray = pastDescendant.params.chunkArray;
            for(const contextID in chunkArray){
                chunkArray[contextID].unmount();
            }
        }
        const { leftNode , parentNode , siblingIndex  } = pastDescendant.params;
        if (!siblingLevelUpdated) {
            siblingLevelUpdated = siblingIndex !== undefined;
        }
        if (pastDescendant.kind === "TEXT") {
            hooks.removeDescendant(pastDescendant.params.textNode);
        }
        if (!Array.isArray(descendant)) {
            const text = String(descendant);
            const textNode = hooks.createTextNode(text);
            rs.descendants[descenantID] = {
                kind: "TEXT",
                params: {
                    textNode,
                    text,
                    leftNode,
                    parentNode,
                    siblingIndex
                }
            };
            hooks.insertDescendant({
                descendant: textNode,
                leftNode,
                parentNode: parentNode ?? contextParentNode
            });
            if (siblingIndex !== undefined) {
                rs.siblings[siblingIndex] = [
                    textNode
                ];
            }
            continue;
        }
        const chunkArray = descendant;
        rs.descendants[descenantID] = {
            kind: "CHUNK_ARRAY",
            params: {
                chunkArray,
                leftNode,
                parentNode,
                siblingIndex
            }
        };
        let currLeftNode = leftNode;
        for(const contextID in descendant){
            const chunk1 = chunkArray[contextID];
            currLeftNode = chunk1.mount(parentNode ?? contextParentNode, currLeftNode);
        }
        if (pastDescendant.kind === "CHUNK_ARRAY") {
            const chunkArray1 = pastDescendant.params.chunkArray;
            for(const contextID1 in chunkArray1){
                const context = chunkArray1[contextID1];
                const effect = context.getEffect();
                if (effect.quality === "UNMOUNTED") {
                    context.disconnect();
                }
            }
        }
    }
    return siblingLevelUpdated;
};
const disconnectDescendants = (hooks, rs)=>{
    const attributes = rs.attributes;
    for(const attributeID in attributes){
        const attribute = attributes[attributeID];
        hooks.removeAttribute(attribute.params);
    }
    for(const descendantID in rs.descendants){
        const descendant = rs.descendants[descendantID];
        if (descendant.kind === "TEXT") {
            hooks.removeDescendant(descendant.params.textNode);
        }
        if (descendant.kind === "CHUNK_ARRAY") {
            const chunkArray = descendant.params.chunkArray;
            for(const contextID in chunkArray){
                const context = chunkArray[contextID];
                context.unmount();
                context.disconnect();
            }
        }
    }
};
const createNode1 = (tag)=>{
    return document.createElement(tag);
};
const createTextNode1 = (content)=>{
    return document.createTextNode(content);
};
const setAttribute = ({ node , attribute , value , references  })=>{
    if (!(node instanceof HTMLElement)) {
        return;
    }
    const firstChar = attribute.charAt(0);
    if (firstChar === "*") {
        const trimmedAttribute = attribute.substr(1);
        references[trimmedAttribute] = node;
        return;
    }
    if (firstChar === "@" && value instanceof Function) {
        const trimmedAttribute = attribute.substr(1);
        node.addEventListener(trimmedAttribute, value);
        return;
    }
    if (firstChar === "?") {
        const trimmedAttribute = attribute.substr(1);
        if (value === undefined) {
            node.removeAttribute(trimmedAttribute);
            return;
        }
        node.setAttribute(trimmedAttribute, String(value));
        return;
    }
    node.setAttribute(attribute, String(value));
};
const removeAttribute = ({ node , attribute , value  })=>{
    if (!(node instanceof HTMLElement)) {
        return;
    }
    if (attribute.charAt(0) === "@" && value instanceof Function) {
        const trimmedAttribute = attribute.substr(1, attribute.length - 2);
        node.removeEventListener(trimmedAttribute, value);
        return;
    }
    if (attribute.charAt(0) === "?") {
        const trimmedAttribute = attribute.substr(1);
        node.removeAttribute(trimmedAttribute);
        return;
    }
    node.removeAttribute(attribute);
};
const insertDescendant = ({ descendant , leftNode , parentNode ,  })=>{
    if (leftNode === undefined && parentNode?.hasChildNodes()) {
        const firstNode = parentNode.firstChild;
        parentNode.insertBefore(descendant, firstNode);
        return;
    }
    const nextSibling = leftNode?.nextSibling;
    if (nextSibling !== undefined) {
        parentNode?.insertBefore(descendant, nextSibling);
    } else {
        parentNode?.appendChild(descendant);
    }
    if (nextSibling instanceof HTMLElement || nextSibling instanceof Text) {
        return nextSibling;
    }
};
const removeDescendant = (descendant)=>{
    const parentNode = descendant.parentNode;
    parentNode?.removeChild(descendant);
    return descendant;
};
const getSibling = (descendant)=>{
    const nextSibling = descendant.nextSibling;
    if (nextSibling instanceof HTMLElement || nextSibling instanceof Text) {
        return nextSibling;
    }
};
const hooks = {
    createNode: createNode1,
    createTextNode: createTextNode1,
    setAttribute,
    removeAttribute,
    insertDescendant,
    removeDescendant,
    getSibling
};
const compose = (chunker)=>{
    return (params)=>{
        return new Chunk({
            hooks,
            chunker,
            params
        });
    };
};
const draw = (templateArray, ...injections)=>{
    return {
        templateArray,
        injections
    };
};
const attach = (parentNode, chunkArray)=>{
    let leftNode;
    for(const chunkID in chunkArray){
        const chunk1 = chunkArray[chunkID];
        leftNode = chunk1.mount(parentNode, leftNode);
    }
};
const parsleyNoStackDependenices = `It does not rely on DOM Templates\nor JSX and is fully capable of being ported to other languages.`;
const introDemo = compose({
    connect: ()=>{
    },
    update: ()=>{
        return draw`\n      <section id="parsley-dom">\n        <h1>PARSLEY-DOM</h1>\n        <h2>Quick Start</h2>\n        <p>Brian Taylor Vann</p>\n      </section>\n    `;
    },
    disconnect: ()=>{
    }
});
const parsleyURL = "https://github.com/taylor-vann/parsley";
const outroDemo = compose({
    connect: ()=>{
    },
    update: ()=>{
        return draw`\n      <section>\n        <h2>Note</h2>\n        <p>\n          This page is rendered in Parsely-DOM, a library built with\n          <a href="${parsleyURL}" target="_blank">Parsley</a>\n        </p>\n        <p>${parsleyNoStackDependenices}</p>\n      </section>\n    `;
    },
    disconnect: ()=>{
    }
});
const introDemoChunk = introDemo();
const outroDemoChunk = outroDemo();
const codeDemo = compose({
    update: ({ params  })=>{
        return draw`\n      <code>\n        <pre>${params}</pre>\n      </code>\n    `;
    },
    connect: ()=>{
    },
    disconnect: ()=>{
    }
});
class Counter {
    constructor(banger){
        this.count = 0;
        this.banger = banger;
    }
    increase = ()=>{
        this.count += 1;
        this.banger.bang();
    };
    decrease = ()=>{
        this.count -= 1;
        this.banger.bang();
    };
}
const countDisplay = compose({
    connect: ()=>{
    },
    update: ({ params: count  })=>{
        return draw`<p>${count} </p>`;
    },
    disconnect: ()=>{
    }
});
const descendants = [
    countDisplay(0),
    countDisplay(0),
    countDisplay(0), 
];
const updateDescendants1 = (count)=>{
    let index = 0;
    while(index < descendants.length){
        const descendant = descendants[index];
        const value = Math.pow(2, index * count);
        descendant.update(value);
        index += 1;
    }
};
const counterWithDescendants = compose({
    connect: ({ banger: banger1  })=>{
        return new Counter(banger1);
    },
    update: ({ state  })=>{
        updateDescendants1(state.count);
        return draw`\n      <p>sums:</p>\n      <div>\n        ${descendants}\n      </div>\n      <input\n        type="button"\n        value="- 1"\n        @click="${state.decrease}">\n      </input>\n      <input\n        type="button"\n        value="+ 1"\n        @click="${state.increase}">\n      </input>\n    `;
    },
    disconnect: ()=>{
    }
});
const counterWithDescendantsChunk = counterWithDescendants();
const parsleyURL1 = "https://github.com/taylor-vann/parsley";
const counterShellDemoCode = `// typescript\nconst countDisplay = compose<number, void>({\n  connect: () => {},\n  update: ({params: count}) => {\n    return draw\`<p>\$\{count\}</p>\`;\n  },\n  disconnect: () => {},\n});`;
const countDisplayMemoryDemoCode = `const descendants = [\n  countDisplay(0),\n  countDisplay(0),\n  countDisplay(0),\n];`;
const updateDisplayMemoryDemoCode = `// typescript\nconst updateDescendants = (count: number) => {\n  let index = 0;\n  while (index < descendants.length) {\n    const descendant = descendants[index];\n    const value = Math.pow(2, index * count);\n    descendant.update(value);\n\n    index += 1;\n  }\n};`;
const counterWithSavedChildrenDemoCode = `// typescript\nconst counterFactory = compose<void, Counter>({\n  ...\n  update: ({state}) => {\n    updateDescendants(state.count);\n    return draw\`\n      <p>sums:</p>\n      <div> \$\{descendants\}</div>\n      ...\n    \`;\n  },\n  ...\n});`;
const countDisplayMemoryCode = codeDemo(countDisplayMemoryDemoCode);
const updateDisplayMemoryCode = codeDemo(updateDisplayMemoryDemoCode);
const counterShellCode = codeDemo(counterShellDemoCode);
const counterWithSavedChildrenCode = codeDemo(counterWithSavedChildrenDemoCode);
const paramsDemoFactory = compose({
    connect: ()=>{
    },
    update: ()=>{
        return draw`\n      <section id="descend">\n        <h2>Descend</h2>\n        <h3>Data Flow</h3>\n        <p>\n          Parsley-DOM passes parameters unidirectionally from \n          <span>chunk</span> to <span>chunk</span>, from parent\n          to descendants.\n        </p>\n        <p>\n          Desendants are expected to be\n          <span>chunk</span> arrays. Otherwise, descendants\n          are converted into strings.\n        </p>\n        ${[
            counterShellCode
        ]}\n        <h3>Reduce draws</h3>\n        <p>\n          Three instances of <code>countDisplay</code> are created\n          in the example below.\n        </p>\n        ${[
            countDisplayMemoryCode
        ]}\n        <p>\n          By giving descendants a place in memory, Parsley-DOM can\n          ensure that a finite number of instances exist in a document.\n        </p>\n        <p>\n          In the example below <code>updateDescendants</code> modulates\n          the value of each <code>countDisplay</code> instance.\n        </p>\n        ${[
            updateDisplayMemoryCode
        ]}\n        <p>\n          <span>Chunks</span> draw when descendants change. Luckily,\n          <a target="_blank" href="${parsleyURL1}">Parsley</a>\n          caches renders and only updates when necessary.\n        </p>\n        <p>\n          In the example below, the previous <code>counterFactory</code>\n          is modified to include <code>updateDescendants</code> and\n          <code>descendants</code>.\n        </p>\n        ${[
            counterWithSavedChildrenCode
        ]}\n        <h3>Chunk out</h3>\n        <p>The example above will output the following:</p>\n        ${[
            counterWithDescendantsChunk
        ]}\n      </section>\n    `;
    },
    disconnect: ()=>{
    }
});
const paramsDemoChunk = paramsDemoFactory();
class Counter1 {
    constructor(banger1){
        this.banger = banger1;
        this.count = 0;
    }
    increase = ()=>{
        this.count += 1;
        this.banger.bang();
    };
    decrease = ()=>{
        this.count -= 1;
        this.banger.bang();
    };
}
const counterFactory = compose({
    connect: ({ banger: banger2  })=>{
        return new Counter1(banger2);
    },
    update: ({ state  })=>{
        const count = state.count;
        return draw`\n      <div class="leverage_state__demo">\n        <h3>\&Sigma\;: ${count}</h3>\n        <input\n          type="button"\n          value="- 1"\n          @click="${state.decrease}"/>\n        <input\n          type="button"\n          value="+ 1"\n          @click="${state.increase}"/>\n      </div>\n    `;
    },
    disconnect: ()=>{
    }
});
const typescriptSyntax = `//typescript\ncompose<Params, State>({\n  connect: ({ params, banger }) => {\n    // initialization\n    return state;\n  },\n  update: ({ params, state }) => {\n    // render logic\n    return draw\`<html>\`;\n  },\n  disconnect: ({state}) => {\n    // tear down\n  },\n});\n`;
const counterStateCode = `//typescript\nimport type { Banger } from "../parsley-dom.ts";\n\nclass Counter {\n  banger: Banger;\n  count: number;\n\n  constructor(banger: Banger) {\n    this.banger = banger;\n    this.count = 0\n  }\n  increase = () => {\n    this.count += 1;\n    this.banger.bang();\n  }\n  decrease = () => {\n    this.count -= 1;\n    this.banger.bang();\n  }\n}\n`;
const counterDemoCode = `//typescript\nconst counterFactory = compose<void, Counter>({\n  connect: ({banger}) => {\n    return new Counter(banger);\n  },\n  update: ({state}) => {\n    return draw\`\n      <p>sum: \$\{state.count\}</p>\n      <input type="button" value="- 1" @click="\$\{state.decrease\}"/>\n      <input type="button" value="+ 1" @click="\$\{state.increase\}"/>\`;\n  },\n  disconnect: () => {},\n});\n\nconst counterChunk = counterFactory();\n`;
const parsleyLifecycle = `Parsley-DOM has a three-part lifecycle:\nconnect, update, and disconnect.`;
const counterChunk = counterFactory();
const tsSyntaxChunk = codeDemo(typescriptSyntax);
const exampleStateCode = codeDemo(counterStateCode);
const exampleCode = codeDemo(counterDemoCode);
const stateDemoFactory = compose({
    connect: ()=>{
    },
    update: ()=>{
        return draw`\n      <section  id="interact">\n        <h2>Interact</h2>\n        <h3>The Lifecycle</h3>\n        <p>\n          ${parsleyLifecycle} These functions also constitute a\n          <span>chunk</span>.\n        </p>\n        ${[
            tsSyntaxChunk
        ]}\n        <h3>Update chunks</h3>\n        <p>\n          Updates in Parsley depend on the\n          <span><code>banger</code></span> class.\n          In the example below, event listeners use\n          <span><code>banger.bang()</code></span> to update and redraw.\n        </p>\n        ${[
            exampleStateCode
        ]}\n        <h3>Event Listeners</h3>\n        <p>\n          Event listeners are attached to DOM elements through an\n          <span><code>@</code></span> atmark. They can interact\n          with state through the <span><code>banger</code></span> class.\n        </p>\n        <p>\n          In the example below, Parsley-DOM understands that the\n          <code>@click</code> property is going\n          to be an Event Listener.\n        </p>\n        ${[
            exampleCode
        ]}\n        <h3>Chunk out</h3>\n        <p>The <span><code>counterChunk</code></span> will output:</p>\n        ${[
            counterChunk
        ]}\n      </section>\n    `;
    },
    disconnect: ()=>{
    }
});
const stateDemoChunk = stateDemoFactory();
const helloWorld = compose({
    update: ()=>{
        return draw`\n      <h3>hello, world!</h3>\n    `;
    },
    connect: ()=>{
    },
    disconnect: ()=>{
    }
});
const parsleyURL2 = "https://github.com/taylor-vann/parsley";
const helloWorldDemoCode = `// typescript\nimport { attach, compose, draw } from "../parsley-dom.ts";\n\nconst helloWorldFactory = compose<void, void>({\n    connect: () => {},\n    update: () => {\n      return draw\`<h4>hello, world!</h4>\`;\n    },\n    disconnect: () => {},\n});`;
const helloWorldChunkDemoCode = `const helloWorldChunk = helloWorldFactory();`;
const helloWorldAttachDemoCode = `const fixture = document.querySelector("#fixture");\nif (fixture !== null) {\n  attach(fixture, [helloWorldChunk]);\n}`;
const helloWorldChunk = helloWorld();
const codeDemoChunk = codeDemo(helloWorldDemoCode);
const codeDemoChunkChunk = codeDemo(helloWorldChunkDemoCode);
const codeDemoConnectChunk = codeDemo(helloWorldAttachDemoCode);
const helloWorldDemo = compose({
    connect: ()=>{
    },
    update: ()=>{
        return draw`\n       <section id="chunk">\n        <h2>Chunk</h2>\n        <p>\n          Parsley-DOM creates chunks of interactive DOM with\n          <a href="${parsleyURL2}" target="_blank">Parsley</a>\n          in three broad steps.\n        </p>        \n        <h3>1) Build a Factory</h3>\n        <p>\n          Use <span><code>compose</code></span>\n          and <span><code>draw</code></span> to\n          create a <span>Chunk Factory</span>.\n        </p>\n        ${[
            codeDemoChunk
        ]}\n        <h3>2) Make a chunk</h3>\n        <p>\n          Use the <span>Chunk Factory</span> to create\n          a <span>Chunk</span>.\n        </p>\n        ${[
            codeDemoChunkChunk
        ]}\n        <h3>3) Attach to DOM</h3>\n        <p>\n          Append the <span>Chunk</span> with\n          <span><code>attach</code></span>.\n        </p>\n        ${[
            codeDemoConnectChunk
        ]}\n        <h3>Chunk out</h3>\n        <p>\n          The <span><code>helloWorldChunk</code></span>\n          will output:\n        </p>\n        <div class="hello_world__demo">${[
            helloWorldChunk
        ]}</div>\n      </section>\n    `;
    },
    disconnect: ()=>{
    }
});
const helloWorldDemoChunk = helloWorldDemo();
const articleWithRefs = compose({
    connect: ({ banger: banger2  })=>{
        return {
            click: (e)=>{
                const refs = banger2.getReferences();
                console.log(refs);
            }
        };
    },
    update: ({ state  })=>{
        return draw`\n      <article\n        *article\n        @click="${state.click}">\n        <h3 *title>Hello, world!</h3>\n        <section *content>\n          <p>Press <code>ctl alt i</code>.</p>\n          <p>Then click this button!</p>\n        </section>\n        <input\n          *button\n          type="button"\n          value="Get Refs"></input>\n      </article>\n    `;
    },
    disconnect: ()=>{
    }
});
const articleWithRefsDemoCode = `// typescript\ninterface ArticleWithRefsState {\n  click: EventListener;\n}\n\nconst articleWithRefs = compose<void, ArticleWithRefsState>({\n  connect: ({ banger }) => {\n    return {\n      click: (e: Event) => {\n        const refs = banger.getReferences();        \n        console.log(refs);\n      },\n    };\n  },\n  update: ({ state }) => {\n    return draw\`\n    <article *article @click="\$\{state.click}\">\n      <h3 *title>Hello, world!</h3>\n      <section *content>\n        <p>Press <code>ctl alt i</code>.</p>\n        <p>Then click this button!</p>\n      </section>\n      <input *button type="button" value="Get Refs"></input>\n    </article>\n    \`;\n  },\n  disconnect: () => {},\n});`;
const articleWithRefsChunk = articleWithRefs();
const articleWithRefsCode = codeDemo(articleWithRefsDemoCode);
const refsDemoFactory = compose({
    connect: ()=>{
    },
    update: ()=>{
        return draw`\n      <section id="reference">\n        <h2>Reference</h2>\n        <h3>Pointers</h3>\n        <p>\n          A <code>chunk</code> might need to reference\n          rendered HTMLElements. Parsley-DOM declares references\n          with an <code>*</code> asterisk prefix on an attribue.\n          It's visually similar to pointer syntax in C/C++.\n        </p>\n        <p>\n          Parsley-DOM uses <code>banger.getReferences()</code> to return\n          an object with the attributes as keys and the elements as values.\n        </p>\n        <p>\n          The example below will log references on <code>state.click</code>.\n        </p>\n        ${[
            articleWithRefsCode
        ]}\n        <h3>Chunk out</h3>\n        <p>The example above will output:</p>\n        ${[
            articleWithRefsChunk
        ]}\n      </section>\n    `;
    },
    disconnect: ()=>{
    }
});
const refsDemoChunk = refsDemoFactory();
const demoContent = [
    introDemoChunk,
    helloWorldDemoChunk,
    stateDemoChunk,
    paramsDemoChunk,
    refsDemoChunk,
    outroDemoChunk, 
];
const mainElement = document.querySelector("main");
if (mainElement !== null) {
    attach(mainElement, demoContent);
}
