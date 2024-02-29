import { Box, Center, Grid, Image } from '@chakra-ui/react';
import React from 'react'

import FloorImg from '@/assets/images/floor-texture.webp';
import BoardImg from '@/assets/images/room-board.webp';
import SwitchTurnButton from '@/containers/SwitchTurnButton';
import { store } from '@/stores/RootStore';
import OpBoard from './OpBoard';
import MyBoard from './MyBoard';
import useRecoverGame from '@/hooks/useRecoverGame';
import useWatchOpTurnEnd from '@/hooks/useWatchOpTurnEnd';
import useHandleCardBattle from '@/hooks/useHandleCardBattle';
import { observer } from 'mobx-react-lite';
import YourTurn from '@/containers/YourTurn';
import GameOverModal from '@/containers/GameOverModal';

const GameRoom: React.FC = () => {
  const { roomStore, battleStore } = store;
  const { actionInit, cardsInit } = useRecoverGame(Number(roomStore.roomInfo?.turns));
  useWatchOpTurnEnd();
  const scope = useHandleCardBattle(battleStore.attacker);

  if (!actionInit || !cardsInit) {
    return (
      <Center w={'100vw'} h={'100vh'} bgImage={FloorImg} bgRepeat={'no-repeat'} bgSize={'cover'}>
        123
      </Center>
    );
  }

  return (
    <Center w={'100vw'} h={'100vh'} bgImage={FloorImg} bgRepeat={'no-repeat'} bgSize={'cover'}>
      <YourTurn />
      <GameOverModal />
      <Center h={'90%'} pos={'relative'}>
        <Image src={BoardImg} w={'auto'} h={'100%'} userSelect={'none'} draggable={false} />
        <Box pos={'absolute'} zIndex={11} right={'6.5%'} top={'calc(50% - 4rem)'}>
          <SwitchTurnButton />
        </Box>
        <Grid
          pos={'absolute'}
          w={'100%'}
          h={'100%'}
          templateAreas={`
            "opmana opcard ophero opempty opempty"
            "actions opboard opboard opboard opdeck"
            "actions myboard myboard myboard mydeck"
            "myempty myempty myhero mycard mymana"
          `}
          gridTemplateColumns={'200px 300px 1fr 300px 200px'}
          gridTemplateRows={'200px 1fr 1fr 200px'}
          ref={scope}
        >
          <OpBoard />
          <MyBoard />
        </Grid>
      </Center>
    </Center>
  )
};

export default observer(GameRoom);
