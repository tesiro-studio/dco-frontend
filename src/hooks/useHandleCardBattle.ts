import { AttackerType } from "@/stores/BattleStore";
import { store } from "@/stores/RootStore";
import { useAnimate } from "framer-motion";
import { useEffect } from "react";
import { useImmer } from "use-immer";

type AttackedType = {
  top: number;
  left: number;
  show: boolean;
}

const useHandleCardBattle = (attacker: AttackerType | null): [scope: any, attacked: AttackedType] => {
  const { boardStore, myCardStore, opCardStore, battleStore } = store;
  const [scope, animate] = useAnimate();
  const [attacked, setAttacked] = useImmer<AttackedType>({
    top: 0,
    left: 0,
    show: false,
  })
  const handleBattle = async () => {
    if (attacker) {
      const isOpHeroTarget = attacker.target === battleStore.availableTargets?.opHeroCanSelected;
      const isMyHeroTarget = attacker.target === battleStore.availableTargets?.myHeroCanSelected;
      const initiator = `[data-index="${attacker.card.revealIndex}"]`;
      if (boardStore.isMyTurn) {
        const { revealIndex } = battleStore.availableTargets?.opTargets.find((ot) => `${ot.target}` === attacker.target) ?? {};
        const targetSelector = !isOpHeroTarget ? `[data-index="${revealIndex}"]` : '[data-hero="op"]';
        const { left, top } = (document.querySelector(targetSelector))?.getBoundingClientRect() as DOMRect;
        setAttacked(state => {
          state.show = true;
          state.left = left ?? 0;
          state.top = top ?? 0;
        })
        await Promise.all([
          animate(
            initiator,
            { y: [0, 10, -10, 0, 0, 0, 0, 0] },
            { duration: 2, delay: 1 }
          ),
          animate(
            targetSelector,
            { x: [0, 0, 0, 0, -10, 10, -10, 10, 0, 0, 0, 0] },
            { duration: 1, delay: 1 }
          )
        ])
        const position = myCardStore.boardCards.findIndex(card => card.revealIndex === attacker.card.revealIndex);
        const target = opCardStore.boardCards.findIndex(card => card.revealIndex === revealIndex);
        await boardStore.addMyAttackAction(position, target >= 0 ? target : 7);
        battleStore.done()
      } else {
        const { revealIndex } = battleStore.availableTargets?.myTargets.find((mt) => `${mt.target}` === attacker.target) ?? {};
        const targetSelector = !isMyHeroTarget ? `[data-index="${revealIndex}"]` : '[data-hero="my"]';
        const { left, top } = (document.querySelector(targetSelector))?.getBoundingClientRect() as DOMRect;
        setAttacked(state => {
          state.show = true;
          state.left = left ?? 0;
          state.top = top ?? 0;
        })
        await Promise.all([
          animate(
            initiator,
            { y: [0, -10, -10, 10, 0, 0, 0, 0, 0, 0] },
            { duration: 2, delay: 1 }
          ),
          animate(
            targetSelector,
            { x: [0, 0, 0, 0, 0, 0, -10, 10, -10, 10, 0, 0] },
            { duration: 1, delay: 1 }
          )
        ])
        await boardStore.completeOpAction();
        battleStore.done();
      }
      setAttacked(state => {
        state.show = false;
      })
    }
  }

  useEffect(() => {
    Boolean(attacker?.target) && handleBattle();
  }, [attacker?.target]);

  return [scope, attacked];
}

export default useHandleCardBattle;
