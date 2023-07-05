# Treeshaker

Visit the [quick start](https://herebythere.github.io/treeshaker).

## About

Treeshaker composes structures from XML. It provides methods for `retain` mode
and `immediate` mode interfaces.

Treeshaker itself is angositc to what is composed.

It relies on a `Utils` class that provides the most atomic interactions needed
to maintain a tree of nodes in a given environment.

And that makes Treeshaker portable and extendable.

With treeshaker you can:

- create templates from XML
- build scenes and UIs from XML
- create custom XML attribute syntaxes

## Typescript

Treeshaker is available in TS via Deno.

It uses [Parsley](https://github.com/herebythere/parsley) to deserialize XML
data.

DOM-Utils are available (although you can definitely make your own!).

## C#

The C# implementation is being brainstormed (July 2023).

The goal is to provide `TreeShaker` for Godot (and possibly Unity).

## License

BSD 3-Clause License
