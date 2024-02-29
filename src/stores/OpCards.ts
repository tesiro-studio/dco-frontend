import tcg from "@/services/tcg";
import { BoardCardType, CardKind, PulledCardType, ShuffledCards } from "@/types";
import { computed, makeAutoObservable, runInAction, toJS } from "mobx";
import { RootStore } from "./RootStore";


export class OpCards {
  rootStore: RootStore;

  pulledCards: PulledCardType[] = []; // 紀錄已抽的卡牌
  playedCards: PulledCardType[] = []; // 紀錄已打的卡牌
  opShuffledCards!: ShuffledCards;

  constructor (rootStore: RootStore) {
    makeAutoObservable(this, {
      handCards: computed,
      boardCards: computed,
      rootStore: false,
      opShuffledCards: false,
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
    for (const card of this.rootStore.boardStore.opboard) {
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
        const shuffledCards = await tcg.getShuffledCards(roomStore.roomId, roomStore.config.myPlayerIndex); // get my shuffled cards
        runInAction(() => {
          this.playedCards = [];
          this.pulledCards = [];
          this.opShuffledCards = shuffledCards;
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async pullCard (turn: number) {
    const { roomStore, zkey } = this.rootStore;
    if (roomStore.config && zkey) {
      const totalCardAmount = 4 + Math.floor((roomStore.config.startWithOp ? turn - 1 : turn) / 2);
      console.log('totalCardAmount::', totalCardAmount);
      const revealFromIdx = roomStore.config.startWithOp ? 0 : 4; // first hand: [0, 1, 2, 3], second hand: [4, 5, 6, 7]
      const currentIndex = this.pulledCards.length;
      for (let index = currentIndex; index < totalCardAmount; index++) {
        let revealIndex = revealFromIdx + index;
        if (index >= 4) {
          // 從第二回合開始 則是抽 8, 9, 10, 11, 12...
          revealIndex = index * 2 + (roomStore.config.startWithOp ? 1 : 0);
        }
        const token = await tcg.getRevealCard(roomStore.roomId, revealIndex);
        if (token) {
          runInAction(() => {
            this.pulledCards.push({
              revealIndex,
              cardId: CardKind.None
            });
          });
        }
      }
    }
  }

  playCardFromHand (cardId: number, revealIndex: number) {
    runInAction(() => {
      const card = this.pulledCards.find(card => card.revealIndex === revealIndex);
      card && (card.cardId = cardId);
    })
  }

  addCardsToBoard (cards: PulledCardType[]) {
    runInAction(() => {
      this.playedCards = toJS(this.playedCards).concat(cards);
    })
  }
}
