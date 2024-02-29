import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer';

import { store } from '@/stores/RootStore';
import ChakraBox from '@/components/ChakraBox';
import WinnerView from './WinnerView';
import LoserView from './LoserView';
import { GameState } from '@/types';
import AppButton from '@/components/AppButton';
import { useNavigate } from 'react-router-dom';

const GameOverModal: React.FC = () => {
  const { boardStore, roomStore } = store;
  const navigate = useNavigate();
  const [state, setState] = useImmer({ gameOver: false, isWinner: false, pending: false });

  const handleGameOver = async (isWinner: boolean) => {
    setState(st => {
      st.gameOver = true;
      st.isWinner = isWinner;
    })
    if (roomStore.roomInfo?.state === GameState.Playing) {
      // 遊戲進行中
      if (isWinner) {
        setState(st => {
          st.pending = true;
        })
        try {
          await boardStore.addGameOverAction();
          await boardStore.endTurn();
        } catch (error) {
          console.log(error);
          setState(st => {
            st.gameOver = false;
          })
        } finally {
          setState(st => {
            st.pending = false;
          })
        }
      }
    }
  }

  const handleClose = () => {
    store.init();
    navigate('/');
  }

  const renderView = () => {
    if (!state.gameOver) return null;
    return state.isWinner ? <WinnerView /> : <LoserView />;
  }

  useEffect(() => {
    if (boardStore.ophero.hp <= 0n || boardStore.myhero.hp <= 0n) {
      !state.gameOver && handleGameOver(boardStore.ophero.hp <= 0n);
    }
  }, [boardStore.ophero, boardStore.myhero, state.gameOver]);

  return (
    <Modal autoFocus={false} isCentered isOpen={state.gameOver} onClose={() => {}}>
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
            scale: [0, 1.4, 1.2, 1.2],
            opacity: [0, 1, 1, 1],
          }}
          exit={{ scale: [1.2, 2, 2, 2] }}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          flexDirection={'column'}
        >
          {renderView()}
          <AppButton isDisabled={state.pending} onClick={handleClose}>
            Close
          </AppButton>
        </ChakraBox>
      </ModalContent>
    </Modal>
  )
};

export default observer(GameOverModal);
