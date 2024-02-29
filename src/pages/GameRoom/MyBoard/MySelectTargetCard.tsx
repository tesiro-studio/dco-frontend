import BaseCard from '@/components/BaseCard';
import { CardAttrs } from '@/constants/cards';
import { store } from '@/stores/RootStore';
import { CardKind } from '@/types';
import { Box } from '@chakra-ui/react';
import { useAnimate } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react'

interface IMySelectTargetCard {
  left: number;
  top: number;
  cardId: CardKind;
}

const MySelectTargetCard: React.FC<IMySelectTargetCard> = ({ left, top, cardId }) => {
  const { battleStore } = store;
  const [scope, animate] = useAnimate();

  const handlePosition = async () => {
    const { innerHeight, innerWidth } = window;
    const { left, top, height, width } = (scope.current as HTMLDivElement).getBoundingClientRect() as DOMRect;
    const posY = (innerHeight / 2) - (height) - top;
    const posX = (innerWidth * 0.9) - (width * 1.5) - left;
    await animate(
      scope.current,
      { scale: [1.32, 1.98, 2.64], y: [0, posY, posY], x: [0, posX, posX] },
      { duration: 1 },
    )
    if (!CardAttrs[cardId].needTarget) {
      await animate(
        scope.current,
        { opacity: [1, 0.5, 0, 0], x: [posX, posX + 10, posX + 20, posX + 20] },
        { duration: 1, delay: 0.5 },
      )
      await battleStore.casterEffectReady();
      battleStore.done()
    } else {
      battleStore.setCasterCallback(() => animate(
        scope.current,
        { opacity: [1, 0.5, 0, 0], x: [posX, posX + 10, posX + 20, posX + 20] },
        { duration: 1, delay: 0.5 },
      ))
    }
  }

  useEffect(() => {
    handlePosition();
  }, []);

  return (
    <Box
      ref={scope}
      pointerEvents={'none'}
      zIndex={20}
      pos={'fixed'}
      left={left}
      top={top}
      transform={'scale(1.32)'}
      transformOrigin={'top left'}
    >
      <BaseCard cardId={cardId} />
    </Box>
  )
};

export default observer(MySelectTargetCard);
