import { AnimatePresence } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react'

import BoardCard from '@/components/BaseCard/BoardCard';
import { store } from '@/stores/RootStore';
import { BoardCardType, CardEventType } from '@/types';

const OpBoardCards: React.FC = () => {
  const { opCardStore, executeStore, boardStore, gameStore } = store;

  const handleSelect = async (card: BoardCardType) => {
    const eventExecuter = { revealIndex: `${card.revealIndex}`, cardId: `${card.attrs.id.toString()}` };
    if (executeStore.availableTargets) {
      if (executeStore.availableTargets.targets.findIndex(target => target.revealIndex === +eventExecuter.revealIndex) >= 0) {
        if (executeStore.executer?.event === CardEventType.Summon) executeStore.setMyPlayCardTarget(eventExecuter);
        if (executeStore.executer?.event === CardEventType.Attack) executeStore.setMyAttackTarget(eventExecuter);
        if (executeStore.executer?.event === CardEventType.HeroAttack) {};
      }
    }
  }

  const executeEffect = useMemo(() => {
    return executeStore.executer?.effect;
  }, [executeStore.executer]);

  const selectors = useMemo(() => {
    return executeStore.availableTargets?.targets.map(({ revealIndex }) => +revealIndex);
  }, [executeStore.availableTargets]);

  const isTarget = useMemo(() => {
    if (executeStore.executer) {
      const { from, to } = executeStore.executer;
      const indexs = [];
      from?.revealIndex && indexs.push(+from.revealIndex);
      to?.revealIndex && indexs.push(+to.revealIndex);
      return indexs;
    }
    return [];
  }, [executeStore.executer?.from, executeStore.executer?.to])

  return (
    <AnimatePresence>
      {opCardStore.boardCards
        .map(card => (
          <BoardCard
            key={`${card.attrs.id}_${card.revealIndex}`}
            boardCard={card}
            op={boardStore.isMyTurn}
            onSelect={() => handleSelect(card)}
            isTarget={isTarget.includes(card.revealIndex)}
            canSelected={selectors?.includes(card.revealIndex)}
            effect={executeEffect}
            thisTurn={card.turn === gameStore.turns}
          />
      ))}
    </AnimatePresence>
  )
};

export default observer(OpBoardCards);
