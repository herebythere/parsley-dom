const whatIsParsley = `
Parsley is a library that creates chunks of interactive XML.
`;

const whatIsParsleyDOM = ` Parsley-DOM is an interface to Parsley
and lets you create chunks of interactive DOM.`;

const parsleyIsDifferent = `In fact, this page is rendered in Parsely-DOM.
But it works a little differently than other rendering libraries.`

const parsleyIsUnique = `Parsley has no dependencies and it's unique in that
it isn't concerned with the content rendered.`;

const parsleyNoDependenices = `It does not rely on DOM Templates
or JSX and is fully capable of being ported to other languages.`;

// code examples
const parsleyBasics = `Parsley starts with a "Chunker". Which is basically
three functions: update, connect, and disconnect.`;

const parsleyChunker = `
// return a template
const update = () => {
  return draw\`<p>hello, world!</p>\`;
};

// take initial params and return initial state
connect = (params) => state;

// a chance to observe state on disconnect
disconnect = (state) => void;
`;


const parsleyCreateChunkFactory = `
The compose function takes update, connect, and disconnect and
creates a 'chunk factory' that will produce chunks of DOM.
`;

const parsleySyntax = `
const chunkFactory = compose<Params, State>({
  update: ({params, state}) => {
    return draw\`<p>hello, world!</p>\`;
  },
  connect: (params) => state,
  disconnect: (state) => void,
})
`;

const parsleyHelloWorld = `
const helloWorld = compose<void, void>({
  update: () => {
    return draw\`<p>hello, world!</p>\`;
  },
  connect: () => {},
  disconnect: () => {},
})
const helloWorldChunk = helloWorld();

`;

const parsleyHelloChunk = `
const helloWorldChunk = helloWorld();

helloWorld.getSiblings(); // [<p>]
}
`;


