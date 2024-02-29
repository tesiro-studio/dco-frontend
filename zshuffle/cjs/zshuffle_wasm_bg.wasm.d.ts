/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function card_to_index(a: number, b: number): void;
export function index_to_card(a: number, b: number): void;
export function public_uncompress(a: number, b: number, c: number): void;
export function public_compress(a: number, b: number): void;
export function generate_key(a: number): void;
export function aggregate_keys(a: number, b: number): void;
export function init_masked_cards(a: number, b: number, c: number, d: number): void;
export function mask_card(a: number, b: number, c: number, d: number): void;
export function verify_masked_card(a: number, b: number, c: number, d: number, e: number, f: number, g: number): void;
export function init_prover_key(a: number): void;
export function refresh_joint_key(a: number, b: number, c: number, d: number): void;
export function shuffle_cards(a: number, b: number, c: number, d: number): void;
export function verify_shuffled_cards(a: number, b: number, c: number, d: number, e: number): void;
export function reveal_card(a: number, b: number, c: number, d: number): void;
export function verify_revealed_card(a: number, b: number, c: number, d: number, e: number): void;
export function unmask_card(a: number, b: number, c: number, d: number, e: number): void;
export function decode_point(a: number, b: number, c: number): void;
export function __wbindgen_malloc(a: number, b: number): number;
export function __wbindgen_realloc(a: number, b: number, c: number, d: number): number;
export function __wbindgen_add_to_stack_pointer(a: number): number;
export function __wbindgen_free(a: number, b: number, c: number): void;
export function __wbindgen_exn_store(a: number): void;
