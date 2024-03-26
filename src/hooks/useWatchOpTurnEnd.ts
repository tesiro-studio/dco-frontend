import tcg from "@/services/tcg";
import { store } from "@/stores/RootStore";
import { ActionKind, ActionRecord } from "@/types";
import delay from "delay";
import { useEffect } from "react";

const useWatchOpTurnEnd = () => {
  const { roomStore, boardStore } = store;

  const addTurnActions = async (roomId: bigint, turn: bigint, over: boolean = false) => {
    const { turns } = store.gameStore;
    if (over || (turn > store.gameStore.turns)) {
      const actions = await tcg.getActions(roomId, BigInt(store.gameStore.turns));
      if (!store.boardStore.isMyTurn) {
        await store.opCardStore.pullCard(turns);
        await delay(1000);
        const opActions: ActionRecord[] = actions.map(action => ({
          isMyRecord: false,
          cardId: Number(action.cardId),
          fromHero: [ActionKind.HeroAttack, ActionKind.HeroSkill].includes(action.kind),
          action: {
            kind: action.kind,
            cardId: Number(action.cardId),
            params: Number(action.params),
            nthDrawn: Number(action.nthDrawn),
            stateHash: action.stateHash as any,
            rtoken: [...action.rtoken] as any,
          }
        }))
        boardStore.addOpActions(opActions);
      }
    }
  }

  useEffect(() => {
    const unwatchTurn = tcg.watchTurnStart((roomId, turn) => {
      if (roomStore.roomId === roomId) {
        addTurnActions(roomId, turn);
      }
    });
    const unwatchGameOver = tcg.watchGameOver((roomId, winner) => {
      if (roomStore.roomId === roomId) {
        console.log('------- end:', winner, roomId, roomStore.roomId);
        addTurnActions(roomId, BigInt(store.gameStore.turns), true);
      }
    });
    // window.add = () => addTurnActions(24n, 6n);
    return () => {
      unwatchTurn();
      unwatchGameOver();
    }
  }, []);
}

export default useWatchOpTurnEnd;
