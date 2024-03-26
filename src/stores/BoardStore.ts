import tcg from "@/services/tcg";
import { ActionKind, PulledCardType, RToken, ActionRecord, UploadAction, CardKind } from "@/types";
import { computed, makeAutoObservable, runInAction, toJS } from "mobx";
import { zeroHash } from "viem";

import { RootStore } from "./RootStore";
import zhuffle from "@/workers/zshuffle";
import { parseRawAction } from "@/utils/action";

export class BoardStore {
  myActions: ActionRecord[] = [];
  opActions: ActionRecord[] = [];
  uploadActions: ActionRecord[] = [];
  records: ActionRecord[] = [];

  rootStore: RootStore;
  constructor (rootStore: RootStore) {
    makeAutoObservable(this, {
      myhero: computed,
      myboard: computed,
      ophero: computed,
      opboard: computed,
      isMyTurn: computed,
    });
    this.rootStore = rootStore;
  }

  get isMyTurn () {
    return this.rootStore.gameStore.turns > 0 && this.rootStore.gameStore.isMyTurn();
  }

  get myhero () {
    const board = this.rootStore.gameStore.board;
    if (this.uploadActions && this.isMyTurn) {
      return board.myHero.clone();
    }
    return board.opponentHero.clone();
  }

  get myboard () {
    const board = this.rootStore.gameStore.board;
    if (this.uploadActions && this.isMyTurn) {
      return (board.myBoard ?? []).map((c) => c.clone());
    }
    return (board.opponentBoard ?? []).map((c) => c.clone());
  }

  get ophero () {
    const board = this.rootStore.gameStore.board;
    if (this.uploadActions && this.isMyTurn) {
      return board.opponentHero.clone();
    }
    return board.myHero.clone();
  }

  get opboard () {
    const board = this.rootStore.gameStore.board;
    if (this.uploadActions && this.isMyTurn) {
      return (board.opponentBoard ?? []).map((c) => c.clone());
    }
    return (board.myBoard ?? []).map((c) => c.clone());
  }

  async addMyPlayCardAction (card: PulledCardType, target?: number) {
    const { zkey, myCardStore, gameStore } = this.rootStore;
    if (zkey && gameStore) {
      const action: UploadAction = {
        kind: ActionKind.PlayCard,
        cardId: Number(card.cardId),
        params: target || 0,
        nthDrawn: card.revealIndex,
        stateHash: zeroHash,
        rtoken: [0, 0],
      }
      const applyAction = parseRawAction(action);
      const { boardHashAfter } = await gameStore.applyAction(applyAction);
      action.stateHash = boardHashAfter;

      const index = myCardStore.pulledCards.findIndex(card => card.revealIndex === card.revealIndex);
      const rtoken = await zhuffle.reveal([zkey.secret, toJS(myCardStore.myShuffledCards[index])]) as RToken;
      action.rtoken = [rtoken.card[0], rtoken.card[1]];
      runInAction(() => {
        this.myActions.push({
          cardId: Number(card.cardId),
          fromHero: false,
          isMyRecord: true,
          action,
        });
      })
    }
  }

  async addMyEndTurnAction () {
    const { gameStore } = this.rootStore;
    if (gameStore) {
      const action = {
        kind: ActionKind.EndTurn,
        cardId: 0,
        params: 0,
        nthDrawn: 0,
        stateHash: zeroHash,
        rtoken: [0, 0],
      };
      const applyAction = parseRawAction(action);
      const { boardHashAfter } = await gameStore.applyAction(applyAction);
      action.stateHash = boardHashAfter
      runInAction(() => {
        this.myActions.push({
          cardId: CardKind.None,
          fromHero: false,
          isMyRecord: true,
          action,
        });
      })
    }
  }

  async addMyAttackAction (position: number, target: number) {
    const { gameStore, myCardStore } = this.rootStore;
    if (gameStore) {
      const action = {
        kind: ActionKind.MinionAttack,
        cardId: 0,
        params: position * 32 + target,
        nthDrawn: 0,
        stateHash: zeroHash,
        rtoken: [0, 0]
      }
      const applyAction = parseRawAction(action);
      const { boardHashAfter } = await gameStore.applyAction(applyAction);
      action.stateHash = boardHashAfter;
      runInAction(() => {
        this.myActions.push({
          cardId: Number(myCardStore.boardCards[position].attrs.id) ?? CardKind.None,
          fromHero: false,
          isMyRecord: true,
          action,
        });
      })
    }
  }

  async addMyHeroAttackAction (target: number) {
    const { gameStore } = this.rootStore;
    if (gameStore) {
      const action = {
        kind: ActionKind.HeroAttack,
        cardId: 0,
        params: target,
        nthDrawn: 0,
        stateHash: zeroHash,
        rtoken: [0, 0]
      }
      const applyAction = parseRawAction(action);
      const { boardHashAfter } = await gameStore.applyAction(applyAction);
      action.stateHash = boardHashAfter;
      runInAction(() => {
        this.myActions.push({
          cardId: CardKind.None,
          isMyRecord: true,
          fromHero: true,
          action,
        });
      })
    }
  }

  async endTurn () {
    const { gameStore, zkey, opCardStore, roomStore } = this.rootStore;
    if (gameStore && zkey && roomStore.config) {
      const turns = gameStore.turns;
      const nextTurnCardAmount = 4 + Math.floor((roomStore.config.startWithOp ? turns : turns + 1)  / 2);
      const shuffledCard = toJS(opCardStore.opShuffledCards[nextTurnCardAmount - 1]);
      const opsNext = await zhuffle.reveal([zkey.secret, shuffledCard]) as RToken;
      const uploadActions = this.uploadActions.map(upload => toJS(upload.action));
      const isUploaded = await tcg.uploadActions(uploadActions, opsNext);
      if (isUploaded) {
        runInAction(() => {
          this.records = this.records.concat(toJS(this.uploadActions));
          this.uploadActions = [];
        });
      } else {
        const prevAction = this.uploadActions.pop();
        gameStore.revertToSnapshot();
        prevAction?.action.kind === ActionKind.EndTurn && (gameStore.turns -= 1);
      }
    }
  }

  async executedMyAction () {
    const rawAction = this.myActions.shift();
    if (rawAction) {
      runInAction(() => {
        this.uploadActions = this.uploadActions.concat(rawAction);
      })
    }
  }

  addOpActions (opActions: ActionRecord[]) {
    runInAction(() => {
      this.opActions = opActions.map(opAction => ({
        ...opAction,
        action: {
          ...opAction.action,
          rtoken: [...opAction.action.rtoken]
        }
      }));
    })
  }

  async completeOpAction (cardId?: CardKind) {
    runInAction(() => {
      if (this.opActions.length) {
        const action = this.opActions.shift();
        if (cardId && action) action.cardId = cardId;
        this.records.push(action as ActionRecord);
        this.uploadActions = [];
      }
    })
  }

  async addGameOverAction () {
    const { gameStore } = this.rootStore;
    const action = {
      kind: ActionKind.Defeat,
      cardId: 0,
      params: 2,
      nthDrawn: 0,
      stateHash: zeroHash,
      rtoken: [0, 0],
    };
    const applyAction = parseRawAction(action);
    await gameStore.applyAction(applyAction);
    runInAction(() => {
      this.uploadActions.push({
        cardId: CardKind.None,
        fromHero: false,
        isMyRecord: true,
        action,
      });
    })
  }

  async addHeroSkillAction () {
    const { gameStore } = this.rootStore;
    const action = {
      kind: ActionKind.HeroSkill,
      cardId: 0,
      params: 0,
      nthDrawn: 0,
      stateHash: zeroHash,
      rtoken: [0, 0],
    };
    const applyAction = parseRawAction(action);
    const { boardHashAfter } = await gameStore.applyAction(applyAction);
    action.stateHash = boardHashAfter;
    runInAction(() => {
      this.myActions.push({
        cardId: CardKind.None,
        fromHero: true,
        isMyRecord: true,
        action,
      });
    })
  }

  addRecords (records: ActionRecord[]) {
    runInAction(() => {
      this.records = records;
    })
  }
}
