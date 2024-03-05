import * as wasm from "./zshuffle_wasm_bg.wasm?init";
import { __wbg_set_wasm } from "./zshuffle_wasm_bg.js";
__wbg_set_wasm(wasm);
export * from "./zshuffle_wasm_bg.js";
