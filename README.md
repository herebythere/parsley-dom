# parsley-dom

Visit the [quick start](https://taylor-vann.github.io/parsley-dom).

Parsley-DOM is created with [Parsley](https://github.com/taylor-vann/parsley), a
library that provides XML build steps.

## Usage

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

TODO / GOALS

Web components are self contained and on the client side.

however, loading a template resource from server or from service worker is more
difficult

sevice worker would load template, send steps to a builder on UI thread UI
thread builds and caches fragment

then copies and renders fragments as needed
