import init from "./zshuffle_wasm_bg.wasm?init";
import { __wbg_set_wasm } from "./zshuffle_wasm_bg.js";
init().then((instance) => {
  __wbg_set_wasm(instance.exports);
})
export * from "./zshuffle_wasm_bg.js";
