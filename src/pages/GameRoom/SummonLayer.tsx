import AppButton from '@/components/AppButton';
import BaseCard from '@/components/BaseCard';
import ChakraBox from '@/components/ChakraBox';
import { store } from '@/stores/RootStore';
import { CardEventType, EffectType } from '@/types';
import { Box, Center, VStack } from '@chakra-ui/react';
import delay from 'delay';
import { AnimatePresence } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react'

const SummonLayer: React.FC = () => {
  const { executeStore, myCardStore, gameStore, boardStore } = store;

  const handleCancel = () => {
    executeStore.done();
    if (executeStore.executer?.event === CardEventType.Summon) {
      myCardStore.cancelCardToBoard();
    }
  }

  const executerPosition = useMemo(() => {
    if (executeStore.executer?.from && executeStore.executer.event === CardEventType.Summon && gameStore.isMyTurn()) {
      const { innerHeight, innerWidth } = window;
      // const { left, top, height, width } = (scope.current as HTMLDivElement).getBoundingClientRect() as DOMRect;
      const posY = (innerHeight / 4) - (executeStore.executer.from.y ?? 0);
      const posX = (innerWidth * 0.7) - (executeStore.executer.from.x ?? 0);
      return {
        x: executeStore.executer.from.x,
        y: executeStore.executer.from.y,
        cardId: executeStore.executer.from.cardId,
        animateX: [0, posX, posX],
        animateY: [0, posY, posY],
        scale: [1.32, 2.64, 4.62],
      }
    }
    return null;
  }, [executeStore.executer]);

  const selectTargetPopup = useMemo(() => {
    return executeStore.availableTargets && gameStore.isMyTurn();
    // return executerPosition && !executeStore.executer?.to && CardAttrs[+(executerPosition?.cardId ?? -1) as CardKind].needTarget && gameStore.isMyTurn()
  }, [executeStore.availableTargets]);

  const handleExecute = async () => {
    // 不需要選擇對象則立刻執行出牌動作
    if (!selectTargetPopup && executeStore.executer?.from && executeStore.executer.effect === EffectType.None) {
      const { cardId, revealIndex } = executeStore.executer.from;
      await delay(2000);
      await boardStore.addMyPlayCardAction(
        { cardId: +(cardId), revealIndex: +(revealIndex) },
        executeStore.executer?.to?.value
      );
      await executeStore.done();
    }
  }

  return (
    <Box pos={'absolute'}>
      <AnimatePresence mode='wait'>
        {executerPosition && (
          <ChakraBox
            key={'cardmove'}
            pointerEvents={'revert'}
            zIndex={100}
            pos={'fixed'}
            transformOrigin={'top left'}
            left={executerPosition.x}
            top={executerPosition.y}
            initial={{ x: 0, y: 0, scale: 1.32 }}
            animate={{ x: executerPosition.animateX, y: executerPosition.animateY, scale: executerPosition.scale }}
            exit={{ opacity: 0, x: executerPosition.animateX[2] - 30 }}
            onAnimationComplete={handleExecute}
            filter={'drop-shadow(-2px 7px 9px black)'}
            // @ts-ignore no problem in operation, although type error appears.
            transition={{
              duration: 1,
            }}
          >
            <BaseCard cardId={+executerPosition.cardId} />
          </ChakraBox>
        )}
      </AnimatePresence>
      {selectTargetPopup && (
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

export default observer(SummonLayer);
