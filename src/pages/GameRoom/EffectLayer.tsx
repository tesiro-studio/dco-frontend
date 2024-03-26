import AttackEffect from '@/components/Effect/AttackEffect';
import BuffEffect from '@/components/Effect/BuffEffect';
import DebuffEffect from '@/components/Effect/DebuffEffect';
import SkillEffect from '@/components/Effect/SkillEffect';
import { store } from '@/stores/RootStore';
import { EffectType } from '@/types';
import { observer } from 'mobx-react-lite';
import React, { Fragment, useEffect, useMemo } from 'react'

interface IEffectLayer {
  animate: any;
}

const EffectLayer: React.FC<IEffectLayer> = ({ animate }) => {
  const { executeStore } = store;

  // const fromCardPosition = useMemo(() => {
  //   if (executeStore.executer?.from && executeStore.executer.effect !== EffectType.None) {
  //     const { isMyHero, isOpHero, revealIndex } = executeStore.executer.from;
  //     let targetSelector = `[data-index="${revealIndex}"]`;
  //     if (isOpHero) targetSelector = '[data-hero="op"]';
  //     if (isMyHero) targetSelector = '[data-hero="my"]';

  //     const { left = 0, top = 0, width = 0, height = 0 } = (document.querySelector(targetSelector))?.getBoundingClientRect() as DOMRect ?? {};
  //     return {
  //       effect: executeStore.executer.effect,
  //       x: left + (width / 2),
  //       y: top + (height / 2),
  //     };
  //   }
  //   return null;
  // }, [executeStore.executer?.from]);

  const toCardPosition = useMemo(() => {
    if (executeStore.executer?.to && executeStore.executer.effect !== EffectType.None) {
      const { isMyHero, isOpHero, revealIndex } = executeStore.executer.to;
      let targetSelector = `[data-index="${revealIndex}"]`;
      if (isOpHero) targetSelector = '[data-hero="op"]';
      if (isMyHero) targetSelector = '[data-hero="my"]';
      const { left = 0, top = 0, width = 0, height = 0 } = (document.querySelector(targetSelector))?.getBoundingClientRect() as DOMRect ?? {};
      return {
        targetSelector,
        effect: executeStore.executer.effect,
        x: left + (width / 2),
        y: top + (height / 2),
      };
    }
    return null;
  }, [executeStore.executer?.to]);

  const handleAttacked = (targetSelector: string) => {
    animate(
      targetSelector,
      { x: [0, 0, -20, 20, -20, 20, -20, 20, 0, 0, 0, 0] },
      { duration: 1, delay: 1 }
    )
  }

  useEffect(() => {
    if (toCardPosition) {
      [EffectType.SkillAttack, EffectType.Attack].includes(toCardPosition.effect) && handleAttacked(toCardPosition.targetSelector);
    }
  }, [toCardPosition])

  return (
    <Fragment>
      {/* {fromCardPosition?.effect === EffectType.Buff && (
        <BuffEffect top={fromCardPosition.y} left={fromCardPosition.x} onEnd={() => executeStore.done()}  />
      )} */}
      {toCardPosition?.effect === EffectType.Buff && (
        <BuffEffect top={toCardPosition.y} left={toCardPosition.x} onEnd={() => executeStore.done()}  />
      )}
      {toCardPosition?.effect === EffectType.Heal && (
        <BuffEffect top={toCardPosition.y} left={toCardPosition.x} onEnd={() => executeStore.done()}  />
      )}
      {toCardPosition?.effect === EffectType.SkillAttack && (
        <SkillEffect
          top={toCardPosition.y}
          left={toCardPosition.x}
          onEnd={() => executeStore.done()}
        />
      )}
      {toCardPosition?.effect === EffectType.Attack && (
        <AttackEffect
          top={toCardPosition.y}
          left={toCardPosition.x}
          onEnd={() => executeStore.done()}
        />
      )}
      {toCardPosition?.effect === EffectType.Debuff && (
        <DebuffEffect
          top={toCardPosition.y}
          left={toCardPosition.x}
          onEnd={() => executeStore.done()}
        />
      )}
    </Fragment>
  )
};

export default observer(EffectLayer);
