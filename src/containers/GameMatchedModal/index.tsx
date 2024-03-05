import { Center, Modal, ModalContent } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer';

import ChakraBox from '@/components/ChakraBox';
import { GameConfigType } from '@/types';
import MatcheLeftImg from '@/assets/images/match_left-bg.webp';
import MatcheRightImg from '@/assets/images/match_right-bg.webp';
import MatcheVSImg from '@/assets/images/match_vs.webp';
import { AnimatePresence } from 'framer-motion';
import MatchHeroCard from './MatchHeroCard';

interface IGameMatchedModal {
  open: boolean;
  playing: boolean;
  config: GameConfigType;
}

const GameMatchedModal: React.FC<IGameMatchedModal> = ({ open, playing, config }) => {
  const [modalState, setModalState] = useImmer({ open, playing: false, destory: false });
  useEffect(() => {
    setModalState(state => {
      state.open = open;
    })
  }, [open]);

  useEffect(() => {
    if (!modalState.destory && playing) {
      setModalState(state => {
        state.playing = playing;
      })
      setTimeout(() => {
        setModalState(state => { state.destory = true })
      }, 2000);
    }
  }, [playing]);

  if (modalState.destory) {
    return null;
  }

  return (
    <Modal autoFocus={false} isCentered isOpen={modalState.open} onClose={() => {}}>
      <ModalContent
        w={'100vw'}
        h={'100vh'}
        minW={'auto'}
        maxW={'none'}
        bg={'transparent'}
      >
        <Center h={'100%'} pos={'relative'}>
          <AnimatePresence>
            {!modalState.playing && (
              <ChakraBox
                key={'left'}
                pos={'relative'}
                animate={{
                  opacity: [0, 1, 1],
                  x: ['-100%', '-80%', '0%'],
                }}
                exit={{
                  opacity: [1, 1, 1],
                  x: ['0%', '-50%', '-100%'],
                }}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                flexDirection={'column'}
                h={'100%'}
                flex={1}
                bgImage={MatcheLeftImg}
                bgRepeat={'no-repeat'}
                bgSize={'cover'}
                bgPos={'right'}
                // @ts-ignore no problem in operation, although type error appears.
                transition={{
                  ease: "easeInOut",
                }}
              >
                <MatchHeroCard
                  address={config.myAddress}
                  hero={config.myHero}
                  isMe
                />
              </ChakraBox>
            )}
            {!modalState.playing && (
              <ChakraBox
                key={'vs'}
                pos={'absolute'}
                animate={{
                  opacity: [0, 1, 1],
                  scale: [3, 2, 1],
                }}
                exit={{
                  opacity: [1, 0.5, 0],
                  scale: [1, 2, 3],
                }}
                zIndex={20}
                // @ts-ignore no problem in operation, although type error appears.
                transition={{
                  delay: 0.5,
                  ease: "easeInOut",
                }}
              >
                <ChakraBox
                  w={'25vw'}
                  h={'50vh'}
                  initial={{ scale: 1.5 }}
                  animate={{
                    scale: [1, 1.5, 1, 1.5, 1, 1, 1, 1, 1, 1]
                  }}
                  bgImage={MatcheVSImg}
                  bgRepeat={'no-repeat'}
                  bgSize={'contain'}
                  bgPos={'center'}
                  zIndex={20}
                  // @ts-ignore no problem in operation, although type error appears.
                  transition={{
                    repeatType: 'loop',
                    repeat: Infinity,
                    delay: 1,
                    repeatDelay: 2,
                    duration: 1,
                    ease: "easeInOut",
                  }}
                />
              </ChakraBox>
            )}
            {!modalState.playing && (
              <ChakraBox
                key={'right'}
                pos={'relative'}
                animate={{
                  opacity: [0, 1, 1],
                  x: ['100%', '80%', '0%'],
                }}
                exit={{
                  opacity: [1, 1, 1],
                  x: ['0%', '50%', '100%'],
                }}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                flexDirection={'column'}
                h={'100%'}
                flex={1}
                bgImage={MatcheRightImg}
                bgRepeat={'no-repeat'}
                bgSize={'cover'}
                bgPos={'left'}
                // @ts-ignore no problem in operation, although type error appears.
                transition={{
                  ease: "easeInOut",
                }}
              >
                <MatchHeroCard
                  address={config.opAddress}
                  hero={config.opHero}
                />
              </ChakraBox>
            )}
          </AnimatePresence>
        </Center>
      </ModalContent>
    </Modal>
  )
};

export default GameMatchedModal;
