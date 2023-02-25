import { DrawInterface } from "../type_flyweight/draw.ts";

class Draw implements DrawInterface {
	templateStrings: Readonly<string[]>;
	injections: unknown[];
	
	constructor(templateStrings, injections) {
		this.templateStrings = templateStrings;
		this.injections = injections
	}
}

function draw(
  templateStrings: Readonly<string[]>,
  ...injections: unknown[],
): Draw {
  return new Draw(templateStrings, injections);
}

export { draw };

