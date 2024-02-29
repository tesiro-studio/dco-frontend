/* tslint:disable */
/* eslint-disable */
/**
* @param {any} value
* @returns {number}
*/
export function card_to_index(value: any): number;
/**
* @param {number} index
* @returns {any}
*/
export function index_to_card(index: number): any;
/**
* uncompress public key to x, y
* @param {string} public
* @returns {any}
*/
export function public_uncompress(public: string): any;
/**
* comporess (public_x, public_y) to public
* @param {any} publics
* @returns {string}
*/
export function public_compress(publics: any): string;
/**
* generate keypair
* @returns {any}
*/
export function generate_key(): any;
/**
* aggregate all pk to joint pk
* @param {any} publics
* @returns {string}
*/
export function aggregate_keys(publics: any): string;
/**
* mask the card, return the masked card and masked proof
* @param {string} joint
* @param {number} num
* @returns {any}
*/
export function init_masked_cards(joint: string, num: number): any;
/**
* mask the card, return the masked card and masked proof
* @param {string} joint
* @param {number} index
* @returns {any}
*/
export function mask_card(joint: string, index: number): any;
/**
* verify masked card with the proof
* @param {string} joint
* @param {number} index
* @param {any} masked
* @param {string} proof
* @returns {boolean}
*/
export function verify_masked_card(joint: string, index: number, masked: any, proof: string): boolean;
/**
* Initialize the prover key
* @param {number} num
*/
export function init_prover_key(num: number): void;
/**
* refresh joint public key when it changed.
* @param {string} joint
* @param {number} num
* @returns {(string)[]}
*/
export function refresh_joint_key(joint: string, num: number): (string)[];
/**
* shuffle the cards and shuffled proof
* @param {string} joint
* @param {any} deck
* @returns {any}
*/
export function shuffle_cards(joint: string, deck: any): any;
/**
* verify the shuffled cards
* @param {any} deck1
* @param {any} deck2
* @param {string} proof
* @returns {boolean}
*/
export function verify_shuffled_cards(deck1: any, deck2: any, proof: string): boolean;
/**
* compute masked to revealed card and the revealed proof
* @param {string} sk
* @param {any} card
* @returns {any}
*/
export function reveal_card(sk: string, card: any): any;
/**
* verify reveal point
* @param {string} pk
* @param {any} card
* @param {any} reveal
* @returns {boolean}
*/
export function verify_revealed_card(pk: string, card: any, reveal: any): boolean;
/**
* unmask the card use others' reveals
* @param {string} sk
* @param {any} card
* @param {any} reveals
* @returns {number}
*/
export function unmask_card(sk: string, card: any, reveals: any): number;
/**
* decode masked to card use all reveals
* @param {any} card
* @param {any} reveals
* @returns {number}
*/
export function decode_point(card: any, reveals: any): number;
