import * as zs from "./zshuffle_wasm_bg.wasm";
import { __wbg_set_wasm } from "./zshuffle_wasm_bg.js";
__wbg_set_wasm(zs);
export * from "./zshuffle_wasm_bg.js";
