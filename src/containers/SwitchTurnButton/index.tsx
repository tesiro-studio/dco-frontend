import { store } from '@/stores/RootStore';
import { Text, VStack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React from 'react'

const SwitchTurnButton: React.FC = () => {
  const { gameStore, boardStore, battleStore } = store;
  const handleEndTurn = () => {
    battleStore.done()
    boardStore.addMyEndTurnAction();
  }

  if (!gameStore) {
    return null;
  }
  if (gameStore.isMyTurn()) {
    return (
      <VStack
        borderRadius={'50%'}
        bg={'radial-gradient(circle, rgba(255,229,0,1) 50%, rgba(255,236,69, 0) 70%)'}
        color={'font.5'}
        fontSize={'2rem'}
        lineHeight={1}
        textAlign={'center'}
        justifyContent={'center'}
        boxSize={'8rem'}
        onClick={handleEndTurn}
        cursor={'pointer'}
      >
        <Text>END</Text>
        <Text>TURN</Text>
      </VStack>
    )
  }
  return (
    <VStack
      borderRadius={'50%'}
      bg={'radial-gradient(circle, rgba(64,50,40,1) 20%, rgba(24,16,10,1) 70%)'}
      color={'font.3'}
      fontSize={'2rem'}
      lineHeight={1}
      textAlign={'center'}
      justifyContent={'center'}
      boxSize={'8rem'}
      textShadow={'1px 2px 4px #000'}
    >
      <Text>ENEMY</Text>
      <Text>TURN</Text>
    </VStack>
  )
};

export default observer(SwitchTurnButton);
