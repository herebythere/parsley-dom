function draw<I>(
  templateStrings: TemplateStringsArray,
  ...injections: I[]
) {	
  return {templateStrings, injections};
}

export { draw }
