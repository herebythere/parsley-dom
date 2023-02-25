// way we can tell if renders have updated

// iterate through draws



function recursiveCheck(addresses: number[], prevDraws: unknown[], currDraws: unknown[]) {
	if (previousDraws.length !== currDraws.length) return false;
	const drawIndex = 0;
	// nested
	while (drawIndex < currDraws.length) {
		const prevDraw = prevDraws[drawIndex];
		const currDraw = currDraws[drawIndex];

		
		if (draw.templateStrings !== currDraw.templateStrings) return false;
		// loop
		const index = 0;
		while (index < currDraw.injections.length) {
			const prevInjection = prevDraw.injections[]
			const injection = currDraw.injections[index];
			
			if (injection instanceof Draw) {
				// get render data
				return recursive(prevDraw, currDraw, prevRender);
			}
		
			index += 1;
		}
		
		drawIndex += 1;
	}
}

export { recursiveCheck }
