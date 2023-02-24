# parsley-dom

Visit the [quick start](https://taylor-vann.github.io/parsley-dom).

Parsley-DOM is created with [Parsley](https://github.com/taylor-vann/parsley), a
library that provides XML build steps.

## Usage

### compose

```

const template = draw`<hello></hello>`;

// component is a "render" of outside "state"
// component composition *reflects* data

function helloComponent(state: HTMLELement) {
	return draw`<hello></hello>`
}

state -> returns template

template is evaluated in the context


parsely-dom will cache previous renders

draw`` -> returns basic template {} simple object

something like DOMRender{} will use a DOMBuilder() to 
cache and store an object

cache and store should probaly be left up to application
that's a big assumption for whatever

so user provides a Map weakMap <templateArray, DOMBuilder>



DOMRender(
```

## License

BSD 3-Clause License

TODO

DOM xml factory

Builder

- template
- injections
- references
- top level tree
- tree as [sibling [children injection] sibling sibling]

Web Component use HTMLElement as state and render contexts use function for draw
method use shadow root, closed compare previous results with
