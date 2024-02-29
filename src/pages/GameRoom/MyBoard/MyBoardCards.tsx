import { AnimatePresence } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react'
import BoardCard from '@/components/BaseCard/BoardCard';
import { store } from '@/stores/RootStore';
import { BoardCardType } from '@/types';
import delay from 'delay';

const MyBoardCards: React.FC = () => {
  const { myCardStore, battleStore, boardStore, gameStore } = store;

  const selectionInfo = useMemo(() => {
    const info = {
      isDefender: false,
      isAttacker: gameStore.isMyTurn(),
      selectors: [] as number[],
    };
    if (!battleStore.availableTargets?.defaultValue) {
      if (battleStore.caster) {
        const { target } = battleStore.caster;
        const hasTarget = Boolean(target);
        const targetIsHero = hasTarget && [battleStore.availableTargets?.opHeroCanSelected, battleStore.availableTargets?.myHeroCanSelected].includes(target);
        if (gameStore.isMyTurn()) {
          info.isDefender = (battleStore.availableTargets?.myTargets.length ?? 0) > 0;
          info.selectors = hasTarget ? battleStore.availableTargets?.myTargets.filter((mt) => `${mt.target}` === target).map((mt) => mt.revealIndex) ?? [] : battleStore.availableTargets?.myTargets.map((mt) => mt.revealIndex) ?? [];
        } else {
          info.isDefender = (battleStore.availableTargets?.opTargets.length ?? 0) > 0;
          info.selectors = hasTarget ? battleStore.availableTargets?.opTargets.filter((mt) => `${mt.target}` === target).map((mt) => mt.revealIndex) ?? [] : battleStore.availableTargets?.opTargets.map((mt) => mt.revealIndex) ?? [];
        }
        if (targetIsHero) {
          info.selectors = [-1];
        }
        info.isAttacker = false;
      }
      if (battleStore.attacker) {
        info.isAttacker = battleStore.attacker.from === 'my';
        info.isDefender = battleStore.attacker.from === 'op';
        if (info.isAttacker) {
          info.selectors = [battleStore.attacker.card.revealIndex];
        } else {
          const { target } = battleStore.attacker;
          if (target) {
            info.selectors = battleStore.availableTargets?.myTargets.filter((mt) => `${mt.target}` === target).map((mt) => mt.revealIndex) ?? [];
          } else {
            info.selectors = battleStore.availableTargets?.myTargets.map((mt) => mt.revealIndex) ?? [];
          }
        }
      }
    }
    return info;
  }, [gameStore.turns, battleStore.availableTargets, battleStore.attacker?.target, battleStore.caster?.target]);

  // const defenderCanSelect = useMemo(() => {
  //   if (battleStore.caster && battleStore.availableTargets) {
  //     const { target } = battleStore.caster;
  //     const hasTarget = Boolean(target);
  //     const targets = battleStore.availableTargets.myTargets.filter(ot => `${ot.target}` === target);
  //     if (hasTarget) {
  //       return targets.length ? targets.map(({ revealIndex }) => revealIndex) : [];
  //     }
  //     return battleStore.availableTargets.myTargets.map(({ revealIndex }) => revealIndex);
  //   }
  //   return [];
  // }, [battleStore.availableTargets, battleStore.caster?.target]);

  // const attackerCanSelect = useMemo(() => {
  //   if (battleStore.caster) {
  //     return [];
  //   }
  //   if (battleStore.attacker && battleStore.availableTargets) {
  //     const { card } = battleStore.attacker;
  //     return [card.revealIndex];
  //   }
  //   return gameStore.isMyTurn() ? myCardStore.boardCards.filter(bc => Boolean(bc.attrs.canAttack)).map(({ revealIndex }) => revealIndex) : [];
  // }, [myCardStore.boardCards, battleStore.availableTargets]);

  const handleSelect = async (card: BoardCardType) => {
    if (selectionInfo.isAttacker) {
      battleStore.setAttacker({ cardId: Number(card.attrs.id), revealIndex: card.revealIndex }, 'my');
    }
    if (battleStore.caster) {
      const { target = 0 } = battleStore.availableTargets?.myTargets.find(mt => mt.revealIndex === card.revealIndex) ?? {};
      battleStore.confirmTarget(`${target}`);
      await delay(500);
      await battleStore.casterEffectReady();
      battleStore.done();
    }
    // }
  }

  // const isDefender = useMemo(() => {
  //   if (battleStore.availableTargets) {
  //     return battleStore.availableTargets.myTargets.map(({ revealIndex }) => revealIndex);
  //   }
  //   return [];
  // }, [battleStore.availableTargets]);

  // const isAttacker = useMemo(() => {
  //   if (battleStore.caster) {
  //     return [];
  //   }
  //   return myCardStore.boardCards.filter(({ attrs }) => Boolean(attrs.canAttack)).map(({ revealIndex }) => revealIndex);
  // }, [battleStore.caster, myCardStore.boardCards]);

  // const selectors = useMemo(() => {
  //   // 如果是技能施放 則選caster target
  //   if (battleStore.caster && battleStore.availableTargets) {
  //     const { target } = battleStore.caster;
  //     const { revealIndex } = battleStore.availableTargets.myTargets.find(ot => `${ot.target}` === target) ?? {};
  //     return revealIndex ? [revealIndex] : [];
  //   }
  //   if (battleStore.attacker && battleStore.availableTargets) {
  //     const isMyTurn = gameStore.isMyTurn();
  //     if (isMyTurn) {
  //       const { card } = battleStore.attacker;
  //       return [card.revealIndex];
  //     }
  //     const { card } = battleStore.attacker;
  //     return [card.revealIndex];
  //   }
  //   return [];
  // }, [battleStore.caster?.target, battleStore.attacker?.target]);

  return (
    <AnimatePresence>
      {myCardStore.boardCards.map(card => (
        <BoardCard
          key={`${card.attrs.id}_${card.revealIndex}`}
          boardCard={card}
          op={!boardStore.isMyTurn}
          isDefender={selectionInfo.isDefender}
          isAttacker={selectionInfo.isAttacker && Boolean(card.attrs.canAttack)}
          onSelect={() => handleSelect(card)}
          thisTurn={card.turn === gameStore.turns}
          selectors={selectionInfo.selectors}
        />
      ))}
    </AnimatePresence>
  )
};

export default observer(MyBoardCards);
