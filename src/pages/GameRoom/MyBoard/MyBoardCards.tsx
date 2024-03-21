import { AnimatePresence } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react'
import BoardCard from '@/components/BaseCard/BoardCard';
import { store } from '@/stores/RootStore';
import { BoardCardType, CardEventType } from '@/types';

const MyBoardCards: React.FC = () => {
  const { myCardStore, boardStore, gameStore, executeStore } = store;

  const handleSelect = async (card: BoardCardType) => {
    const eventExecuter = { revealIndex: `${card.revealIndex}`, cardId: `${card.attrs.id.toString()}` };
    if (executeStore.executer?.executing) return;
    if (executeStore.availableTargets) {
      if (executeStore.availableTargets.targets.findIndex(target => target.revealIndex === +eventExecuter.revealIndex) >= 0) {
        if (executeStore.executer?.event === CardEventType.Summon) executeStore.setMyPlayCardTarget(eventExecuter);
      } else {
        executeStore.setMyAttackEvent(eventExecuter);
      }
    } else if (Boolean(card.attrs.canAttack) && executeStore.executer?.from?.revealIndex !== eventExecuter.revealIndex) {
      executeStore.setMyAttackEvent(eventExecuter);
    }
  }

  const executeEffect = useMemo(() => {
    return executeStore.executer?.effect;
  }, [executeStore.executer]);

  const selectors = useMemo(() => {
    return executeStore.availableTargets?.targets.map(({ revealIndex }) => +revealIndex);
  }, [executeStore.availableTargets]);

  const isAttacker = useMemo(() => {
    if (executeStore.executer) {
      const { from } = executeStore.executer;
      const indexs = [];
      from?.revealIndex && indexs.push(+from.revealIndex);
      return indexs;
    }
    return [];
  }, [executeStore.executer?.from])

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
      {myCardStore.boardCards.map(card => (
        <BoardCard
          key={`${card.attrs.id}_${card.revealIndex}`}
          boardCard={card}
          op={!boardStore.isMyTurn}
          canSelected={selectors?.includes(card.revealIndex)}
          canAttack={Boolean(card.attrs.canAttack)}
          isTarget={isTarget.includes(card.revealIndex)}
          isAttacker={isAttacker.includes(card.revealIndex)}
          hasConfirmTarget={isTarget.length === 2}
          effect={executeEffect}
          onSelect={() => handleSelect(card)}
          thisTurn={card.turn === gameStore.turns}
          // selectors={selectionInfo.selectors}
        />
      ))}
    </AnimatePresence>
  )
};

export default observer(MyBoardCards);
