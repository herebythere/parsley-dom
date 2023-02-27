// way we can tell if renders have updated

// iterate through draws

// itereate and find the top most draw with changes changed

// return the 

/*
	walk both draws.
	
	returnn addresses of draws
*/


function recursiveCheck(
	address:[],
	addresses: number[],
	prevDraws: unknown[],
	currDraws: unknown[],
	safety: number,
) {
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
			const prevInjection = prevDraw.injections[index];
			const injection = currDraw.injections[index];
			
			// prevInjection could be a draw
			// currInjection could be a draw
			
			// if theyre both not a draw continue
			
			// if theyre both a draw, has template changed?
			// if not continue
			
			// if previous injection draw and current injection is not draw
			// if current injection is draw and previous is not
			// if so add address for change
			
			
			if (prevInjection instanceof Draw && injection instanceof Draw) {
				// get address
				recursive(address, addresses, prevDraw, currDraw, prevRender);	
			}
		
			index += 1;
		}
		
		if condition {
				// get render data
				return address
		}
		
		drawIndex += 1;
	}
}

export { recursiveCheck }
