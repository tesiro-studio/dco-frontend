import { AnimatePresence } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react'

import BoardCard from '@/components/BaseCard/BoardCard';
import { store } from '@/stores/RootStore';
import delay from 'delay';
import { toJS } from 'mobx';

const OpBoardCards: React.FC = () => {
  const { opCardStore, battleStore, boardStore, gameStore } = store;

  const opCardsCanSelected = useMemo(() => {
    if (battleStore.availableTargets) {
      const { target } = battleStore.caster ?? battleStore.attacker ?? {};
      const targets = battleStore.availableTargets.opTargets.filter(ot => `${ot.target}` === target);
      if (targets.length) {
        return targets.map(({ revealIndex }) => revealIndex);
      }
      return battleStore.availableTargets.opTargets.map(({ revealIndex }) => revealIndex);
    }
    return [];
  }, [battleStore.availableTargets, battleStore.caster?.target]);

  const selectionInfo = useMemo(() => {
    const info = {
      isDefender: false,
      isAttacker: !gameStore.isMyTurn() && Boolean(battleStore.attacker),
      selectors: [] as number[],
    };
    if (!battleStore.availableTargets?.defaultValue) {
      if (battleStore.caster) {
        const { target } = battleStore.caster;
        const hasTarget = Boolean(target);
        const targetIsHero = hasTarget && [battleStore.availableTargets?.opHeroCanSelected, battleStore.availableTargets?.myHeroCanSelected].includes(target);
        if (gameStore.isMyTurn()) {
          info.isDefender = (battleStore.availableTargets?.opTargets.length ?? 0) > 0;
          info.selectors = hasTarget ? battleStore.availableTargets?.opTargets.filter((mt) => `${mt.target}` === target).map((mt) => mt.revealIndex) ?? [] : battleStore.availableTargets?.opTargets.map((mt) => mt.revealIndex) ?? [];
        } else {
          info.isDefender = (battleStore.availableTargets?.myTargets.length ?? 0) > 0;
          info.selectors = hasTarget ? battleStore.availableTargets?.myTargets.filter((mt) => `${mt.target}` === target).map((mt) => mt.revealIndex) ?? [] : battleStore.availableTargets?.myTargets.map((mt) => mt.revealIndex) ?? [];
        }
        if (targetIsHero) {
          info.selectors = [-1];
        }
        info.isAttacker = false;
      }
      if (battleStore.attacker) {
        info.isAttacker = battleStore.attacker.from === 'op';
        info.isDefender = battleStore.attacker.from === 'my';
        if (info.isAttacker) {
          info.selectors = [battleStore.attacker.card.revealIndex];
        } else {
          const { target } = battleStore.attacker;
          if (target) {
            if (target === battleStore.availableTargets?.opHeroCanSelected) {
              info.selectors = [-1];
            } else {
              info.selectors = battleStore.availableTargets?.opTargets.filter((mt) => `${mt.target}` === target).map((mt) => mt.revealIndex) ?? [];
            }
          } else {
            info.selectors = battleStore.availableTargets?.opTargets.map((mt) => mt.revealIndex) ?? [];
          }
        }
      }
    }
    return info;
  }, [gameStore.turns, battleStore.availableTargets, battleStore.attacker?.target, battleStore.caster?.target]);

  const handleConfirmTarget = async (revealIndex: number) => {
    if (battleStore.availableTargets) {
      const { target = 0 } = battleStore.availableTargets.opTargets.find(ot => ot.revealIndex === revealIndex) ?? {};
      battleStore.confirmTarget(`${target}`);
      if (battleStore.caster) {
        await delay(500);
        await battleStore.casterEffectReady();
        battleStore.done()
      }
    }
  }

  return (
    <AnimatePresence>
      {opCardStore.boardCards
        .map(card => (
          <BoardCard
            key={`${card.attrs.id}_${card.revealIndex}`}
            boardCard={card}
            op={boardStore.isMyTurn}
            onSelect={() => handleConfirmTarget(card.revealIndex)}
            isDefender={selectionInfo.isDefender}
            isAttacker={selectionInfo.isAttacker}
            thisTurn={card.turn === gameStore.turns}
            selectors={selectionInfo.selectors}
          />
      ))}
    </AnimatePresence>
  )
};

export default observer(OpBoardCards);
