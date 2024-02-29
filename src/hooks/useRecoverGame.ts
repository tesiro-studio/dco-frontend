import { ZeroAddress } from "ethers";
import { useLocalStore, useObserver } from "mobx-react-lite";
import { useEffect } from "react";
import { useAccount } from "wagmi";

import tcg from "@/services/tcg";
import { store } from "@/stores/RootStore";
import { parseRawAction } from "@/utils/action";
import { getGameConfig } from "@/utils/game";
import { ActionKind, PulledCardType } from "@/types";

const useRecoverGame = (turns: number) => {
  const { address = ZeroAddress } = useAccount();
  const { roomStore, myCardStore, opCardStore } = store;
  const state = useLocalStore(() => ({
    turns,
    actionInit: false,
    cardsInit: false,
    recovering: false,
    async recoverActions() {
      if (state.recovering) { return; }
      state.recovering = true;
      if (roomStore.roomInfo && roomStore.roomId) {
        const config = getGameConfig(roomStore.roomInfo, address);
        store.initGame(config);
        await Promise.all([
          myCardStore.initShuffledCards(), // 獲取我方shuffled卡牌
          opCardStore.initShuffledCards(), // 獲取對方shuffled卡牌
        ])
        const allMyPlayedCard: PulledCardType[] = []; 
        const allOpPlayedCard: PulledCardType[] = [];
        // 從第一個回合開始初始化狀態
        for (let idx = 1; idx < state.turns; idx++) {
          const actions = await tcg.getActions(roomStore.roomId, BigInt(idx));
          for (const rawAction of actions) {
            const action = parseRawAction(rawAction as any);
            await store.gameStore.applyAction(action);
            if (action.kind === ActionKind.PlayCard) {
              (store.gameStore.isMyTurn() ? allMyPlayedCard : allOpPlayedCard)
                .push({
                  cardId: Number(rawAction.cardId),
                  revealIndex: Number(rawAction.nthDrawn),
                  turn: store.gameStore.turns,
                })
            }
          }
        }
        opCardStore.addCardsToBoard(allOpPlayedCard);
        myCardStore.addCardsToBoard(allMyPlayedCard);
      }
      state.actionInit = true;
      state.recovering = false;
    },
    async recoverHandCards() {
      if (state.recovering || !roomStore.roomInfo) { return; }
      state.recovering = true;
      const turn = Number(roomStore.roomInfo.turns);
      await myCardStore.pullCard(turn);
      await opCardStore.pullCard(turn);
      state.cardsInit = true;
      state.recovering = false;
    }
  }));

  useEffect(() => {
    if (!state.actionInit) {
      state.recoverActions();
    } else {
      state.recoverHandCards();
    }
  }, [state.actionInit]);

  return useObserver(() => ({ actionInit: state.actionInit, cardsInit: state.cardsInit }));
}

export default useRecoverGame;
