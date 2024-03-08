import { Box, Center } from '@chakra-ui/react';
import React, { Fragment, useMemo, useState } from 'react'

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
import AttackEffect from '@/components/AttackEffect';
import { AnimatePresence } from 'framer-motion';
import ChakraBox, { ChakraImg } from '@/components/ChakraBox';

const GameRoom: React.FC = () => {
  const { roomStore, battleStore } = store;
  const [boardLaunched, setBoardLaunched] = useState(false);
  const { actionInit, cardsInit } = useRecoverGame(Number(roomStore.roomInfo?.turns));
  useWatchOpTurnEnd();
  const [scope, attacked] = useHandleCardBattle(battleStore.attacker);
  const isGameInited = useMemo(() => actionInit && cardsInit, [actionInit, cardsInit])

  return (
    <Center w={'100vw'} h={'100vh'} bgImage={FloorImg} bgRepeat={'no-repeat'} bgSize={'cover'}>
      <Center h={'90%'} pos={'relative'}>
        {boardLaunched && (
          <Fragment>
            {attacked.show && <AttackEffect top={attacked.top} left={attacked.left} size='8rem' />}
            <YourTurn key={'turn'} />
            <GameOverModal key={'over'} />
            <Box pos={'absolute'} zIndex={11} right={'6.5%'} top={'calc(50% - 4rem)'}>
              <SwitchTurnButton />
            </Box>
          </Fragment>
        )}
        <AnimatePresence mode='wait'>
          {boardLaunched && (
            <ChakraBox
              key={'wholeboard'}
              display={'grid'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              pos={'absolute'}
              w={'100%'}
              h={'100%'}
              gridTemplateAreas={`
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
            </ChakraBox>
          )}
          {
            isGameInited && (
              <ChakraImg
                key={'board'}
                src={BoardImg}
                w={'auto'}
                h={'100%'}
                userSelect={'none'}
                draggable={false}
                initial={{ opacity: 0, scale: 1.25 }}
                animate={{ opacity: 1, scale: 1 }}
                onAnimationComplete={() => setBoardLaunched(true)}
                // @ts-ignore no problem in operation, although type error appears.
                transition={{
                  delay: 0.5,
                  duration: 1,
                  ease: "easeInOut",
                }}
              />
            )
          }
        </AnimatePresence>
      </Center>
    </Center>
  )
};

export default observer(GameRoom);
