// actual exports
// intended user interaction
export type { BuilderDataInterface } from "./type_flyweight/builder.ts";
export type { BuildInterface } from "./type_flyweight/build.ts";
export type { DrawInterface } from "./type_flyweight/draw.ts";
export type { HangarInterface } from "./type_flyweight/hangar.ts";
export type { UtilsInterface } from "./type_flyweight/utils.ts";
export type { RenderFunc } from "./type_flyweight/render.ts";



// build exports
// not meant for user interaction
export { Build } from "./build/build.ts";
export { Hangar } from "./hangar/hangar.ts";
export { draw } from "./draw/draw.ts";
