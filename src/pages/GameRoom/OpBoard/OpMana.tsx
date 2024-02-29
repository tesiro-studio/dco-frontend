import React, { useMemo } from 'react'
import { Box, Center } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import FragmentImg from '@/assets/icons/fragment.png';
import ManaBg from '@/assets/images/mana-bg.webp';
import { store } from '@/stores/RootStore';
import Value from '@/components/Value';

const OpMana: React.FC = () => {
  const { boardStore } = store;
  const mana = useMemo(() => {
    return {
      current: boardStore.ophero.currentMana.toString(),
      max: boardStore.ophero.maxMana.toString(),
    }
  }, [boardStore.ophero]);
  return (
    <Center
      boxSize={'12.5rem'}
      bgImg={ManaBg}
      bgRepeat={'no-repeat'}
      bgPos={'center'}
      bgSize={'contain'}
    >
      <Center
        boxSize={'60%'}
        bgImg={FragmentImg}
        bgRepeat={'no-repeat'}
        bgPos={'center'}
        bgSize={'contain'}
        color={'white'}
      >
        <Box boxSize={'2.5rem'}>
          <Value val={mana.current} fontSize='2.5rem' />
        </Box>
        <Box w={'1.25rem'} mx={'-0.25rem'}>
          <Value val={'/'} fontSize='2rem' />
        </Box>
        <Box boxSize={'2.5rem'}>
          <Value val={mana.max} fontSize='2.5rem' />
        </Box>
      </Center>
    </Center>
  )
};

export default observer(OpMana);
