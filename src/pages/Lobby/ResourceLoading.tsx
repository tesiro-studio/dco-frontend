import React, { useState } from 'react'
import { Img, VStack } from '@chakra-ui/react';

import ChakraBox from '@/components/ChakraBox';
import Logo from '@/assets/preload/logo.webp';
import ProgressBar from '@/components/ProgressBar';
import { loadAllAssets } from '@/utils/loader';
import { store } from '@/stores/RootStore';

const ResourceLoading: React.FC = () => {
  const { roomStore } = store;
  const [progress, setProgress] = useState(0);

  const handleProgress = (value: number) => {
    setProgress(() => value);
    if (value === 1) {
      setTimeout(() => { roomStore.loadComplete(); }, 2000);
    }
  }

  return (
    <VStack flex={1} w={'100%'} maxW={'65rem'}>
      <ChakraBox
        flex={1}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        initial={{ opacity: 0.1, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        // @ts-ignore no problem in operation, although type error appears.
        transition={{
          duration: 1,
          ease: "easeInOut",
        }}
      >
        <Img src={Logo} h={'auto'} w={'100%'} maxW={'25rem'}  />
      </ChakraBox>
      <ChakraBox
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        // @ts-ignore no problem in operation, although type error appears.
        transition={{
          duration: 1,
          delay: 0.5,
          ease: "easeInOut",
        }}
        onAnimationComplete={() => loadAllAssets(handleProgress)}
      >
        <ProgressBar value={progress} />
      </ChakraBox>
    </VStack>
  )
};

export default ResourceLoading;
