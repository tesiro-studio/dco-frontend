
import GameMatchedModal from '@/containers/GameMatchedModal';
import { store } from '@/stores/RootStore';
import { Box, VStack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React from 'react'
import { Outlet } from 'react-router-dom';
// import { usePageVisibility } from 'react-page-visibility';

const MainLayout: React.FC = () => {
  const { roomStore } = store;
  // const isVisible = usePageVisibility();

  // useEffect(() => {
  // }, [isVisible]);
  return (
    <VStack w={'100vw'} pos={'relative'} gap={0}>
      {roomStore.config && (
        <GameMatchedModal open={roomStore.assetsLoaded && roomStore.matched} config={roomStore.config} playing={roomStore.playing} />
      )}
      <Outlet />
    </VStack>
  )
};

export default observer(MainLayout);