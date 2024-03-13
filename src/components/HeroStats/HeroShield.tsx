import React from 'react'
import { Center } from '@chakra-ui/react';

import ShieldImg from '@/assets/icons/def.png';
import Value from '../Value';
import ChakraBox from '../ChakraBox';

interface IHeroShield {
  shield: number;
}

const HeroShield: React.FC<IHeroShield> = ({ shield }) => {
  return (
    <ChakraBox
      zIndex={10}
      initial={{ scale: 1.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      pos={'absolute'}
      top={'-1.5rem'}
    >
      <Center
        boxSize={'5rem'}
        pos={'relative'}
        bgImg={ShieldImg}
        bgRepeat={'no-repeat'}
        bgPos={'center'}
        bgSize={'contain'}
        color={'#ffffff'}
        pt={'1rem'}
      >
        <Value val={`${shield}`} fontSize='2.25rem' />
      </Center>
    </ChakraBox>
  )
};

export default HeroShield;
