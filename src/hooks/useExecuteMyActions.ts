import { toJS } from "mobx";
import { useEffect } from "react";
import { store } from "@/stores/RootStore";
import { ActionKind } from "@/types";

const useExecuteMyActions = () => {
  const { boardStore } = store;

  const handleAction = async () => {
    const [myAction] = toJS(boardStore.myActions);
    if (myAction) {
      switch (myAction.action.kind) {
        case ActionKind.EndTurn: {
          boardStore.executedMyAction();
          return await boardStore.endTurn();
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
