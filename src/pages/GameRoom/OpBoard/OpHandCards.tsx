import { store } from '@/stores/RootStore';
import { Flex } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react'

import HandCard from '@/components/BaseCard/HandCard';

const OpHandCards: React.FC = () => {
  const { opCardStore } = store;
  const cardGap = useMemo(() => `-${opCardStore.handCards.length}rem`, [opCardStore.handCards.length]);
  return (
    <Flex
      display={'inline-flex'}
      justifyContent={'center'}
      maxW={'100%'}
      gap={0}
      left={0}
      bottom={0}
      zIndex={20}
      position={'relative'}
      pointerEvents={'none'}
    >
      <AnimatePresence mode='popLayout'>
        {opCardStore.handCards.map((card, idx) => (
          <HandCard
            key={`${idx}_${card.revealIndex}`}
            ml={idx !== 0 ? cardGap : '0'}
            index={card.revealIndex}
            cardId={card.cardId}
            flip
            disabledExitEffect
          />
        ))}
      </AnimatePresence>
    </Flex>
  )
};

export default observer(OpHandCards);
