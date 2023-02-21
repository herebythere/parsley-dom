

function MyElementRender(element: ElementInterface) => {
	return draw`
		<div>hello</div>
	`;
}

update(renderContext, myElementRender) {
	const hello = myElementRender

	if templates are different {
		
	}
	
	if injections are different {
	
	}
}

// root, left, state
class Component {
	constructor(root?: HTMLElement, leftSibling?: HTMLElement, element: HTMLElement) {
	
	}
	
	update() {
		
	}
}

class Root {
	
	update() {
		// iterate through descendant injections
	}
}

/* 
	concept of a root?
	
	root.update();

	roots can exist outside of a pubsub
	
	state updates and tree is updated
	
	reliable, direct
	
	iterate through child injections
	
	and update each child
*/
