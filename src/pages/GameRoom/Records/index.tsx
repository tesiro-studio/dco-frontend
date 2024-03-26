import { store } from '@/stores/RootStore';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react'

import ActionsBg from '@/assets/images/actions-bg.png';
import { Box, Center, GridItem, Img, VStack } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import ChakraBox from '@/components/ChakraBox';
import { CardAttrs } from '@/constants/cards';
import { ActionKind, CardKind } from '@/types';
import BaseCard from '@/components/BaseCard';

function recordStyle (my: boolean) {
  if (my) {
    return {
      border: '#1D2967',
      shadow: 'inset 0px 0px 2px 0px #104141, inset 0.5px 0.5px 1px 0px #4756E1, inset -0.5px -0.5px 1px 0px #47AAE180',
      bg: 'radial-gradient(96.55% 96.55% at 25.86% 3.45%, #061F36 0%, #082748 36.56%, #0A1240 82.9%, #0E1038 100%)',
      main: 'radial-gradient(100% 100% at 18.94% 0%, #195987 0%, #1750E4 37.74%, #292C7E 100%)',
    }
  }
  return {
    border: '#2F1211',
    shadow: 'inset 0px 0px 2px 0px #411310, inset 0.5px 0.5px 1px 0px #E14F47, inset-0.5px -0.5px 1px 0px #E14F4780',
    bg: 'radial-gradient(96.55% 96.55% at 25.86% 3.45%, #2C0402 0%, #3B2B2A 36.56%, #3F0D0A 82.9%, #270605 100%)',
    main: 'radial-gradient(100% 100% at 18.94% 0%, #872419 0%, #E42517 37.74%, #7E2929 100%)',
  }
}

const Records: React.FC = () => {
  const { boardStore } = store;
  const [focusCard, setFocusCard] = useState({ id: CardKind.None, key: '' });

  const renderActions = () => {
    const lastActions = toJS(boardStore.records)
      .filter(record => [ActionKind.PlayCard, ActionKind.MinionAttack].includes(record.action.kind))
      .slice(-6);
    lastActions.reverse();
    return lastActions.map((action) => (
      <ChakraBox 
        key={action.action.stateHash}
        bg={recordStyle(action.isMyRecord).main}
        // p={'0.25rem'}
        boxSize={'100%'}
        borderRadius={'0.5rem'}
        pos={'relative'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        zIndex={3}
        filter={'drop-shadow(0px 8px 8px #0B0F0F)'}
        boxShadow={recordStyle(action.isMyRecord).shadow}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onMouseEnter={event => {
          event.stopPropagation();
          setFocusCard(() => ({ id: action.cardId, key: action.action.stateHash }))
        }}
        onMouseLeave={event => {
          event.stopPropagation();
          setFocusCard(() => ({ id: CardKind.None, key: '' }))
        }}
        className='pointer'
        // @ts-ignore no problem in operation, although type error appears.
        transition={{
          duration: 1.5,
        }}
      >
        <Center
          borderRadius={'0.25rem'}
          boxSize={'90%'}
          bg={recordStyle(action.isMyRecord).bg}
          overflow={'hidden'}
        >
          <Box
            boxSize={'90%'}
            bgImg={CardAttrs[action.cardId].image}
            bgRepeat={'no-repeat'}
            bgPos={'top'}
            bgSize={'cover'}
            borderRadius={'0.125rem'}
            border={'0.0625rem solid'}
            borderColor={recordStyle(action.isMyRecord).border}
          />
        </Center>
      </ChakraBox>
    ))
  }
  return (
    <GridItem
      as={Center}
      gap={'1rem'}
      area={'actions'}
      pos={'relative'}
      zIndex={20}
      pointerEvents={boardStore.myActions.length || boardStore.opActions.length ? 'none' : 'auto'}
    >
      <Center h={'100%'} pos={'relative'}>
        <Img src={ActionsBg} h={'100%'} w={'auto'} key={'img-action'} />
        <VStack pos={'absolute'} gap={'3%'} top={'12%'} left={'35%'} right={'35%'} bottom={'12%'}>
          <AnimatePresence mode='popLayout'>
            {renderActions()}
          </AnimatePresence>
        </VStack>
        <AnimatePresence mode='popLayout'>
          {focusCard.id !== CardKind.None && (
            <ChakraBox
              key={`card_${focusCard.key}`}
              pos={'absolute'}
              left={'100%'}
              top={'0'}
              boxSize={'10%'}
              zIndex={2}
              initial={{ x: -50, opacity: 0, scale: 3.5 }}
              animate={{ x: 0, opacity: 1, scale: 3.5 }}
              exit={{ x: 50, opacity: 0, scale: 3.5 }}
              transformOrigin={'top left'}
            >
              <BaseCard cardId={focusCard.id} />
            </ChakraBox>
          )}
        </AnimatePresence>
      </Center>
    </GridItem>
  )
};

export default observer(Records);
