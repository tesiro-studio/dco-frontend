import { Box, Center } from '@chakra-ui/react';
import React, { Fragment, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { AnimatePresence, useAnimate } from 'framer-motion';

import FloorImg from '@/assets/images/floor-texture.webp';
import BoardImg from '@/assets/images/room-board.webp';
import SwitchTurnButton from '@/containers/SwitchTurnButton';
import { store } from '@/stores/RootStore';
import OpBoard from './OpBoard';
import MyBoard from './MyBoard';
import useRecoverGame from '@/hooks/useRecoverGame';
import useWatchOpTurnEnd from '@/hooks/useWatchOpTurnEnd';
import YourTurn from '@/containers/YourTurn';
import GameOverModal from '@/containers/GameOverModal';
import ChakraBox, { ChakraImg } from '@/components/ChakraBox';
import useExecuteMyActions from '@/hooks/useExecuteMyActions';
import SummonLayer from './SummonLayer';
import EffectLayer from './EffectLayer';
import Records from './Records';

const GameRoom: React.FC = () => {
  const [scope, animate] = useAnimate();
  const { roomStore, executeStore } = store;
  const [boardLaunched, setBoardLaunched] = useState(false);
  const { actionInit, cardsInit } = useRecoverGame(Number(roomStore.roomInfo?.turns));
  const isGameInited = useMemo(() => actionInit && cardsInit, [actionInit, cardsInit]);
  useWatchOpTurnEnd();
  useExecuteMyActions();

  return (
    <Center w={'100vw'} ref={scope} h={'100vh'} bgImage={FloorImg} bgRepeat={'no-repeat'} bgSize={'cover'}>
      <Center h={'90%'} pos={'relative'}>
        <EffectLayer animate={animate} />
        <SummonLayer />
        {boardLaunched && (
          <Fragment>
            <YourTurn key={'turn'} />
            <GameOverModal key={'over'} />
            <Box
              pos={'absolute'}
              zIndex={11}
              right={'6.5%'}
              top={'calc(50% - 4rem)'}
              pointerEvents={executeStore.executer?.executing ? 'none' : 'auto'}
            >
              <SwitchTurnButton />
            </Box>
          </Fragment>
        )}
        <AnimatePresence mode='popLayout'>
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
            >

              <Records />
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
