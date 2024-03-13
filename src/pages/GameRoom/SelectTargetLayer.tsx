import AppButton from '@/components/AppButton';
import BaseCard from '@/components/BaseCard';
import ChakraBox from '@/components/ChakraBox';
import { CardAttrs } from '@/constants/cards';
import { store } from '@/stores/RootStore';
import { CardKind } from '@/types';
import { Box, Center, VStack } from '@chakra-ui/react';
import { useAnimate } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react'

interface ISelectTargetLayer {
  left: number;
  top: number;
  cardId: CardKind;
}

const SelectTargetLayer: React.FC<ISelectTargetLayer> = ({ left, top, cardId }) => {
  const { battleStore, myCardStore } = store;
  const [scope, animate] = useAnimate();

  const handlePosition = async () => {
    const { innerHeight, innerWidth } = window;
    const { left, top, height, width } = (scope.current as HTMLDivElement).getBoundingClientRect() as DOMRect;
    const posY = (innerHeight / 2) - (height * 1.75) - top;
    const posX = (innerWidth * 0.85) - (width * 1.5) - left;
    await animate(
      scope.current,
      { scale: [1.32, 2.64, 4.62], y: [0, posY, posY], x: [0, posX, posX] },
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

  const handleCancel = () => {
    battleStore.done();
    myCardStore.cancelCardToBoard();
  }

  useEffect(() => {
    handlePosition();
  }, []);

  return (
    <Box pos={'absolute'}>
      <Box
        ref={scope}
        pointerEvents={'none'}
        zIndex={100}
        pos={'fixed'}
        left={left}
        top={top}
        transform={'scale(1.32)'}
        transformOrigin={'top left'}
        filter={'drop-shadow(-2px 7px 9px black)'}
      >
        <BaseCard cardId={cardId} />
      </Box>
      {CardAttrs[cardId].needTarget && (
        <ChakraBox
          pos={'fixed'}
          bottom={0}
          zIndex={99}
          left={0}
          top={0}
          w={'20vw'}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          bgGradient={'linear(90deg, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0) 100%)'}
        >
          <VStack h={'100%'} w={'100%'} justifyContent={'center'} py={'5rem'}>
            <Center flex={1} fontSize={'2.5rem'} color={'font.4'}>Please select a target</Center>
            <AppButton onClick={handleCancel}>
              Cancel
            </AppButton>
          </VStack>
        </ChakraBox>
      )}
    </Box>
  )
};

export default observer(SelectTargetLayer);
