import type { UtilsInterface } from "../type_flyweight/utils.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";
import type { BuildInterface } from "../type_flyweight/build.ts";
import type {
  DeltaTargets,
  Render,
  RenderNode,
  RenderResult,
  RenderSource,
} from "../type_flyweight/render.ts";

import { Draw } from "../draw/draw.ts";
import { Build } from "../build/build.ts";
import { Builder } from "../builder/builder.ts";
import { parse } from "../deps.ts";

function adoptProperties<N>(
  utils: UtilsInterface<N>,
  delta: DeltaTargets,
  render: Render<N>,
  prevRender: Render<N>,
) {
  for (let index = 0; index < delta.survivedIndexes.length; index++) {
    const source = render.sources[index];
    const prevSource = prevRender.sources[index];

    const result = render.results[index];
    if (
      source instanceof Draw && prevSource instanceof Draw &&
      result instanceof Build
    ) {
      for (const descIndex of result.injections) {
        // add injections from map
        // "ATTRIBUTE_MAP_INJECTION"
        // "ATTRIBUTE_INJECTION"

        // compare source stuff
      }
    }
  }
}

function removeProperties<N>(
  utils: UtilsInterface<N>,
  delta: DeltaTargets,
  render: Render<N>,
) {
  for (let index = 0; index < delta.addedIndexes.length; index++) {
    const source = render.sources[index];
    const result = render.results[index];
    if (source instanceof Draw && result instanceof Build) {
      for (const descIndex of result.injections) {
        // add injection map
        // "ATTRIBUTE_MAP_INJECTION"
        // "ATTRIBUTE_INJECTION"
      }
    }
  }
}

function addProperties<N>(
  utils: UtilsInterface<N>,
  delta: DeltaTargets,
  render: Render<N>,
) {
  for (let index = 0; index < delta.addedIndexes.length; index++) {
    const source = render.sources[index];
    const result = render.results[index];
    if (source instanceof Draw && result instanceof Build) {
      for (const descIndex of result.injections) {
        // add injections from map
        // "ATTRIBUTE_MAP_INJECTION"
        // "ATTRIBUTE_INJECTION"
      }
    }
  }
}
