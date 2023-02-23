// weak map

interface Draw<I = unknown> {
	templateStrings: Readonly<string[]>;
	injections: I[]
}

function draw<I>(
  templateStrings: Readonly<string[]>,
  ...injections: I[]
): Draw<I> {
  return { templateStrings, injections };
}



export { draw };
