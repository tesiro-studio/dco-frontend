import React from 'react'
import { Center } from '@chakra-ui/react';

import Attack from '@/assets/icons/attack.png';
import Value from '../Value';
import ChakraBox from '../ChakraBox';

interface IHeroWeapon {
  attack: number;
}

const HeroWeapon: React.FC<IHeroWeapon> = ({ attack }) => {
  return (
    <ChakraBox
      zIndex={10}
      initial={{ scale: 1.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      pos={'absolute'}
      left={'-2%'}
      bottom={'2%'}
      boxSize={'40%'}
      // @ts-ignore no problem in operation, although type error appears.
      transition={{
        duration: 1.5,
        ease: "easeInOut",
      }}
    >
      <Center
        boxSize={'100%'}
        pos={'relative'}
        bgImg={Attack}
        bgRepeat={'no-repeat'}
        bgPos={'center'}
        bgSize={'contain'}
        color={'#ffffff'}
        pt={'1rem'}
      >
        <Value val={`${attack}`} fontSize='2.25rem' />
      </Center>
    </ChakraBox>
  )
};

export default HeroWeapon;
