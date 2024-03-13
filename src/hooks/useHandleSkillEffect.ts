import { CasterCardType } from "@/stores/BattleStore";
import { store } from "@/stores/RootStore";
import { toJS } from "mobx";
import { useEffect } from "react";
import { useImmer } from "use-immer";

type AttackedType = {
  top: number;
  left: number;
  show: boolean;
}

const useHandleSkillEffect = (attacker: CasterCardType | null, animate: any): AttackedType => {
  const { boardStore, battleStore } = store;
  const [attacked, setAttacked] = useImmer<AttackedType>({
    top: 0,
    left: 0,
    show: false,
  })
  const handleSkillBattle = async () => {
    console.log('skill::', toJS(attacker));
    if (attacker) {
      const isOpHeroTarget = attacker.target === battleStore.availableTargets?.opHeroCanSelected;
      const isMyHeroTarget = attacker.target === battleStore.availableTargets?.myHeroCanSelected;
      if (boardStore.isMyTurn) {
        const { revealIndex } = battleStore.availableTargets?.opTargets.find((ot) => `${ot.target}` === attacker.target) ?? {};
        let targetSelector = `[data-index="${revealIndex}"]`;
        if (isMyHeroTarget) {
          targetSelector = '[data-hero="my"]';
        } else if (isOpHeroTarget) {
          targetSelector = '[data-hero="op"]';
        }
        const { left, top } = (document.querySelector(targetSelector))?.getBoundingClientRect() as DOMRect;
        setAttacked(state => {
          state.show = true;
          state.left = left ?? 0;
          state.top = top ?? 0;
        })
        await Promise.all([
          animate(
            targetSelector,
            { x: [0, 0, 0, 0, -10, 10, -10, 10, 0, 0, 0, 0] },
            { duration: 1, delay: 1 }
          )
        ])
        await battleStore.casterEffectReady();
        battleStore.done()
      } else {
        const { revealIndex } = battleStore.availableTargets?.myTargets.find((mt) => `${mt.target}` === attacker.target) ?? {};
        // const targetSelector = !isMyHeroTarget ? `[data-index="${revealIndex}"]` : '[data-hero="my"]';
        let targetSelector = `[data-index="${revealIndex}"]`;
        if (isMyHeroTarget) {
          targetSelector = '[data-hero="my"]';
        } else if (isOpHeroTarget) {
          targetSelector = '[data-hero="op"]';
        }
        const { left, top } = (document.querySelector(targetSelector))?.getBoundingClientRect() as DOMRect;
        setAttacked(state => {
          state.show = true;
          state.left = left ?? 0;
          state.top = top ?? 0;
        })
        await Promise.all([
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
    Boolean(attacker?.target) && handleSkillBattle();
  }, [attacker?.target]);

  return attacked;
}

export default useHandleSkillEffect;
