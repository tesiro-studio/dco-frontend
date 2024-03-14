import { Img, Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer';

import { store } from '@/stores/RootStore';
import LightImg1 from '@/assets/images/light_1.webp';
import LightImg2 from '@/assets/images/light_2.webp';
import YourTurnBgImg from '@/assets/images/your_turn-bg.webp';
import YourTurnTextImg from '@/assets/images/your_turn-text.webp';
import ChakraBox from '@/components/ChakraBox';

const YourTurn: React.FC = () => {
  const { gameStore } = store;
  const [currentState, setCurrentState] = useImmer({
    turns: gameStore.turns,
    open: gameStore.isMyTurn(),
  })

  const handleYourTurn = () => {
    if (gameStore.turns > currentState.turns) {
      setCurrentState(state => {
        state.turns = gameStore.turns;
        state.open = gameStore.isMyTurn();
      })
    }
  }

  useEffect(() => { handleYourTurn() }, [gameStore.turns]);

  useEffect(() => {
    if (currentState.open) {
      setTimeout(() => {
        setCurrentState(state => { state.open = false; });
      }, 2500);
    }
  }, [currentState.open])

  return (
    <Modal autoFocus={false} isCentered isOpen={currentState.open} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent
        w={'auto'}
        minW={'auto'}
        maxW={'none'}
        bg={'transparent'}
      >
        <ChakraBox
          pos={'relative'}
          animate={{
            scale: [0, 1.6, 1.4, 1.4],
            opacity: [0, 1, 1, 1],
          }}
          exit={{
            scale: [1.4, 2, 2, 2],
          }}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Img src={YourTurnBgImg} h={'10rem'} w={'auto'} zIndex={20} pos={'relative'} />
          <Img src={YourTurnTextImg} h={'2.5rem'} pt={'1rem'} w={'auto'} pos={'absolute'} zIndex={21} />
          <ChakraBox
            pos={'absolute'}
            animate={{
              rotate: [0, -180, -360, -540, -720],
            }}
            // @ts-ignore no problem in operation, although type error appears.
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "loop",
            }}
            zIndex={18}
          >
            <Img src={LightImg1} boxSize={'15rem'} />
          </ChakraBox>
          <ChakraBox
            pos={'absolute'}
            animate={{
              rotate: [0, 180, 360, 540, 720],
            }}
            // @ts-ignore no problem in operation, although type error appears.
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "loop",
            }}
            zIndex={19} 
          >
            <Img src={LightImg2} boxSize={'15rem'}/>
          </ChakraBox>
        </ChakraBox>
      </ModalContent>
    </Modal>
  )
};

export default observer(YourTurn);
