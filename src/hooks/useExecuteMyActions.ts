import { toJS } from "mobx";
import { useEffect } from "react";
import { store } from "@/stores/RootStore";
import { ActionKind } from "@/types";
import delay from "delay";

const useExecuteMyActions = () => {
  const { boardStore, battleStore } = store;

  const handleAction = async () => {
    const [action] = toJS(boardStore.myActions);
    if (action) {
      switch (action.kind) {
        case ActionKind.EndTurn: {
          boardStore.executedMyAction();
          return await boardStore.endTurn();
        }
        case ActionKind.HeroSkill: {
          battleStore.setBuff('my');
          await delay(2000);
          boardStore.executedMyAction();
          break;
        }
        default: {
          boardStore.executedMyAction();
          break;
        }
      }
    }
  }

  useEffect(() => {
    handleAction();
  }, [boardStore.myActions.length]);
}

export default useExecuteMyActions;
