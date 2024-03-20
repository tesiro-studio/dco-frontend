import { Center, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi';
import { observer } from 'mobx-react-lite';
import { useImmer } from 'use-immer';
import { injected } from 'wagmi/connectors';
import { AnimatePresence } from 'framer-motion';

import { store } from '@/stores/RootStore';
import ChakraBox from '@/components/ChakraBox';
import AppButton from '@/components/AppButton';
import LobbyBgImg from '@/assets/images/lobby-bg.webp';
import ResourceLoading from './ResourceLoading';
import SelectClass from './SelectClass';
import WaitingRoom from './WaitingRoom';
import { opBNBTestnet } from 'viem/chains';
import { switchChain } from 'wagmi/actions';
import { config } from '@/constants/config';
// import tcg from '@/services/tcg';

const Lobby: React.FC = () => {
  const { roomStore } = store;
  const { isConnected, address, chainId } = useAccount();
  const [lobbyState, setLobbyState] = useImmer({ init: false });
  const { connect } = useConnect();

  const handleLobbyInit = () => {
    setLobbyState(state => {
      state.init = true;
    })
  }

  const renderView = () => {
    if (!lobbyState.init) return null;
    if (!isConnected) {
      return (
        <Center flex={1}>
          <AppButton onClick={() => connect({ connector: injected({ target: 'metaMask' }) })}>Connect</AppButton>
        </Center>
      );
    }
    if (chainId !== opBNBTestnet.id) {
      return (
        <Center flex={1}>
          <AppButton onClick={() => switchChain(config, { chainId: opBNBTestnet.id })}>Switch Network</AppButton>
        </Center>
      );
    }
    if (!roomStore.assetsLoaded) {
      return <ResourceLoading key={'load'} />
    }
    // return <AppButton onClick={() => tcg.quitGame()}>Quit</AppButton>
    return roomStore.joined ? <WaitingRoom key={'waiting'} /> : <SelectClass key={'select'} />;
  }

  useEffect(() => {
    if (address) {
      roomStore.check(address);
    }
  }, [address]);

  return (
    <ChakraBox
      w={'100vw'}
      h={'100vh'}
      initial={{ opacity: 0.1, scale: 1.2 }}
      animate={{ opacity: 1, scale: 1 }}
      onAnimationComplete={handleLobbyInit}
      // @ts-ignore no problem in operation, although type error appears.
      transition={{
        duration: 1,
        ease: "easeInOut",
        delay: 1,
      }}
    >
      <VStack
        bgImage={LobbyBgImg}
        bgRepeat={'no-repeat'}
        bgSize={'cover'}
        boxSize={'100%'}
        p={'4.5rem'}
      >
        <AnimatePresence mode='wait'>
          {renderView()}
        </AnimatePresence>
      </VStack>
      {/* <Box>
        {
          Boolean(roomStore.roomId) ? (
            <Box onClick={handleQuit} fontSize={'48px'} color={'red'}>Game joined</Box>
          ) : (
            <Button onClick={() => tcg.joinGame(address, HeroKind.Warrior, opBNBTestnet.id)}>Join Game</Button>
          )
        }
      </Box> */}
    </ChakraBox>
  )
};

export default observer(Lobby);
