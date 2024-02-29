import { CARD_NUMBER } from "@/constants/deck";
import { MaskedDeck, ShuffledCard, ShuffledCards, ZShuffleWorkerParams, ZShuffleWorkerResponse } from "@/types"
import { Hex } from "viem";

class ZShuffle {
  mounted!: Promise<typeof import('zshuffle/mjs/zshuffle_wasm')>;

  constructor() {
    this.mounted = this.mount();
  }

  private async mount(): Promise<any> {
    try {
      const zshuffle = import('zshuffle/mjs/zshuffle_wasm');
      this.mounted = zshuffle;
      const zs = await this.mounted;
      return zs;
    } catch (err) {
      return this.mount();
    }
  }
}

const toHexString = (p: [bigint, bigint]) => {
  return [
    `0x${p[0].toString(16).padStart(64, "0")}`,
    `0x${p[1].toString(16).padStart(64, "0")}`,
  ];
};

const zShuffle = new ZShuffle();

const postMessage = self.postMessage

self.onmessage = async function (event: MessageEvent<ZShuffleWorkerParams>) {
  const zs = await zShuffle.mounted;
  const { data, type } = event.data;
  switch (type) {
    case 'gen': {
      let error = '';
      try {
        zs.init_prover_key(data);
        const result = zs.generate_key();
        postMessage({ result, error} as ZShuffleWorkerResponse);
      } catch (e) {
        error = (e as Error).message;
        postMessage({ result: null, error } as ZShuffleWorkerResponse);
      }
      break;
    }
    case 'shuffle': {
      let error = '';
      try {
        const jointPk = zs.public_compress(toHexString(data));
        const pkc = zs.refresh_joint_key(jointPk, CARD_NUMBER);
        const maskedDeck: MaskedDeck = zs.init_masked_cards(jointPk, CARD_NUMBER);
        const maskedCards = maskedDeck.map((card) => card.card);
        const { cards, proof } = zs.shuffle_cards(jointPk, maskedCards);
        const result = [
          proof,
          [...maskedCards.flat(), ...cards.flat()],
          pkc,
          false,
        ];
        postMessage({ result, error} as ZShuffleWorkerResponse);
      } catch (e) {
        error = (e as Error).message;
        postMessage({ result: null, error } as ZShuffleWorkerResponse);
      }
      break;
    }
    case 'remaskShuffle': {
      let error = '';
      try {
        const [pkx, pky, shuffledCards]: [pkx: bigint, pky: bigint, shuffledCards: ShuffledCards] = data;
        const hexifyShuffled = shuffledCards.map(card => [
          ...toHexString([card[0], card[1]]),
          ...toHexString([card[2], card[3]]),
        ])
        const jointPk = zs.public_compress(toHexString([pkx, pky]));
        const pkc = zs.refresh_joint_key(jointPk, CARD_NUMBER);
        const { cards, proof } = zs.shuffle_cards(jointPk, hexifyShuffled);
        const result = [
          proof,
          [...hexifyShuffled.flat(), ...cards.flat()],
          pkc,
          true,
        ]
        postMessage({ result, error} as ZShuffleWorkerResponse);
      } catch (e) {
        error = (e as Error).message;
        postMessage({ result: null, error } as ZShuffleWorkerResponse);
      }
      break;
    }
    case 'reveal': {
      let error = '';
      try {
        const [secret, card]: [Hex, ShuffledCard] = data;
        const result = zs.reveal_card(secret, card.map(p => `0x${p.toString(16).padStart(64, "0")}`));
        postMessage({ result, error} as ZShuffleWorkerResponse);
      } catch (e) {
        error = (e as Error).message;
        postMessage({ result: null, error } as ZShuffleWorkerResponse);
      }
      break;
    }
    case 'unmask': {
      let error = '';
      try {
        const [secret, card, token]: [Hex, ShuffledCard, [bigint, bigint]] = data;
        const result = zs.unmask_card(secret, card.map(p => `0x${p.toString(16).padStart(64, "0")}`), [toHexString(token)]);
        postMessage({ result, error} as ZShuffleWorkerResponse);
      } catch (e) {
        error = (e as Error).message;
        postMessage({ result: null, error } as ZShuffleWorkerResponse);
      }
      break;
    }
  }
}
