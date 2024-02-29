
import React, { useEffect, useMemo } from 'react'
import { Flex } from '@chakra-ui/react';
import { AnimatePresence, useAnimate } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { useImmer } from 'use-immer';

import HandCard from '@/components/BaseCard/HandCard';
import { store } from '@/stores/RootStore';
import { PulledCardType } from '@/types';

type SelectedHandCard = {
  selectedId: number;
  selectedIndex: number;
  locked: boolean;
}

const MyHandCards: React.FC = () => {
  const { myCardStore, battleStore, gameStore } = store;
  const [scope, animate] = useAnimate();
  const [handCard, setHandCard] = useImmer<SelectedHandCard>({ selectedId: -1, selectedIndex: -1, locked: false });

  const handleSelectCard = async (card: PulledCardType) => {
    if (handCard.selectedIndex !== card.revealIndex) {
      setHandCard(state => {
        state.selectedId = card.cardId;
        state.selectedIndex = card.revealIndex;
      })
    } else {
      setHandCard(state => {
        state.locked = true;
      });

      const success = myCardStore.preApplyCard(card.cardId);
      if (success) {
        myCardStore.addCardsToBoard([{ ...card, turn: store.gameStore.turns }]);
        battleStore.setCaster(card, 'my');
        setHandCard(state => {
          state.locked = false;
          state.selectedId = -1;
          state.selectedIndex = -1;
        });
      } else {
        setHandCard(state => {
          state.locked = false;
        });
        animate(
          `[data-id="${card.cardId}"][data-index="${card.revealIndex}"]`,
          { opacity: [1, 0.5, 0.5, 0.5, 0.5, 0.5, 1], x: [5, -5, 5, -5, 5, -5, 0] },
          { duration: 0.7 },
        )
      }
    }
  }

  const cardGap = useMemo(() => `-${myCardStore.handCards.length * 0.8}rem`, [myCardStore.handCards.length]);

  const isExpand = useMemo(() => {
    return handCard.selectedIndex >= 0 && !handCard.locked;
  }, [handCard]);

  useEffect(() => {
    setHandCard(state => {
      state.locked = false;
      state.selectedId = -1;
      state.selectedIndex = -1;
    })
  }, [gameStore.turns]);
  return (
    <Flex
      display={'inline-flex'}
      ref={scope}
      justifyContent={'center'}
      maxW={'100%'}
      gap={0}
      right={0}
      left={0}
      bottom={0}
      zIndex={20}
      position={isExpand ? 'absolute' : 'relative'}
      transform={isExpand ? 'scale(1.2)' : 'scale(0.85)'}
      pointerEvents={!gameStore.isMyTurn() || handCard.locked ? 'none' : 'auto'}
    >
      <AnimatePresence mode='popLayout'>
        {myCardStore.handCards.map((card, idx) => (
          <HandCard
            key={`${card.cardId}_${card.revealIndex}`}
            ml={!isExpand && idx !== 0 ? cardGap : '0'}
            index={card.revealIndex}
            cardId={card.cardId}
            selected={handCard.selectedId === card.cardId && handCard.selectedIndex === card.revealIndex}
            locked={handCard.locked}
            onSelect={() => handleSelectCard({ ...card })}
          />
        ))}
      </AnimatePresence>
    </Flex>
  )
};

export default observer(MyHandCards);
