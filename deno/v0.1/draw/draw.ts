interface Draw<I = unknown> {
	templateStrings: Readonly<string[]>;
	injections: I[]
}

function draw<I = unknown>(
  templateStrings: Readonly<string[]>,
  ...injections: I[]
): Draw<I> {
  return { templateStrings, injections };
}

export { draw };
