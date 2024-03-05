import { getCard, getPreset } from "@/model/Card";
import { computed, makeAutoObservable, runInAction, toJS } from "mobx";

import tcg from "@/services/tcg";
import { PulledCardType, BoardCardType, HeroKind, ShuffledCards, CardKind } from "@/types";
import zhuffle from "@/workers/zshuffle";
import { RootStore } from "./RootStore";
import { findAvailableVictims, verifyManaEnough } from "@/utils/action";

export class MyCards {
  rootStore: RootStore;

  pulledCards: PulledCardType[] = []; // 紀錄已抽的卡牌
  playedCards: PulledCardType[] = []; // 紀錄已打的卡牌
  myShuffledCards!: ShuffledCards;

  constructor (rootStore: RootStore) {
    makeAutoObservable(this, {
      rootStore: false,
      myShuffledCards: false,
      handCards: computed,
      boardCards: computed,
    });
    this.rootStore = rootStore;
  }

  get handCards(): PulledCardType[] {
    const revealIdxs = this.playedCards.map(card => card.revealIndex);
    return this.pulledCards.filter(card => !revealIdxs.includes(card.revealIndex));
  }

  get boardCards(): BoardCardType[] {
    if (!this.rootStore.gameStore) return [];
    const boardCards: BoardCardType[] = [];
    const cardIds = this.playedCards.map(card => card.cardId); // 已打過的牌
    for (const card of this.rootStore.boardStore.myboard) {
      // 透過場面上的卡 交叉比對已打過的牌
      if (Boolean(card.id) && cardIds.includes(Number(card.id))) {
        const { revealIndex = -1, turn = 0 } = this.playedCards.find(({ cardId }) => BigInt(cardId) === card.id) || {}
        boardCards.push({
          attrs: card.clone(),
          revealIndex,
          turn,
        })
      }
    }
    return boardCards;
  }

  async initShuffledCards () {
    try {
      const { roomStore } = this.rootStore;
      if (roomStore.config) {
        const shuffledCards = await tcg.getShuffledCards(roomStore.roomId, roomStore.config.opPlayerIndex); // get opponent's shuffled cards
        runInAction(() => {
          this.playedCards = [];
          this.pulledCards = [];
          this.myShuffledCards = shuffledCards;
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async pullCard (turn: number) {
    const { roomStore, zkey } = this.rootStore;
    if (roomStore.config && zkey) {
      const totalCardAmount = 4 + Math.floor((roomStore.config.startWithOp ? turn : turn - 1) / 2);
      const revealFromIdx = roomStore.config.startWithOp ? 4 : 0; // first hand: [0, 1, 2, 3], second hand: [4, 5, 6, 7]
      const currentIndex = this.pulledCards.length;
      for (let index = currentIndex; index < totalCardAmount; index++) {
        let revealIndex = revealFromIdx + index;
        if (index >= 4) {
          // 從第二回合開始 如果我方先攻 則抽 9, 11, 13... 後攻則 8, 10, 12...
          revealIndex = index * 2 + (roomStore.config.startWithOp ? 0 : 1);
        }
        const token = await tcg.getRevealCard(roomStore.roomId, revealIndex);
        if (token) {
          const cardIndex = await zhuffle.unmask([zkey.secret, this.myShuffledCards[index], [...token]]);
          runInAction(() => {
            const cardId = getCard(BigInt(cardIndex), getPreset(HeroKind.Rogue));
            this.pulledCards.push({
              revealIndex,
              cardId: Number(cardId),
            });
          });
        }
      }
    }
  }

  preApplyCard (cardId: CardKind) {
    return verifyManaEnough(cardId, Number(this.rootStore.boardStore.myhero.currentMana ?? 0));
  }

  addCardsToBoard (cards: PulledCardType[]) {
    runInAction(() => {
      this.playedCards = toJS(this.playedCards).concat(cards);
    })
  }

  cancelCardToBoard () {
    runInAction(() => {
      this.playedCards = toJS(this.playedCards).slice(0, this.playedCards.length - 1);
    })
  }

  // async addCardToBoardFromReady () {
  //   const { boardStore } = this.rootStore;
  //   const { card, target } = this.readyToPlay || {};
  //   const hasTarget = typeof target === 'number' && !isNaN(target);
  //   if (card) {
  //     await this.readyToPlay?.callback?.();
  //     await boardStore.addMyPlayCardAction(card, hasTarget ? target : this.availableTargets?.defaultValue);
  //   }
  //   runInAction(() => {
  //     this.readyToPlay = null;
  //   })
  // }

  // addReadyCallback (callback: () => void) {
  //   runInAction(() => {
  //     if (this.readyToPlay) {
  //       this.readyToPlay.callback = callback;
  //     }
  //   })
  // }
}

