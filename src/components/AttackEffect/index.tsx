import React from 'react'

import AttackImg from '@/assets/status/attack.png';
import { Box } from '@chakra-ui/react';
import ChakraBox from '../ChakraBox';

interface IAttackEffect {
  size: string;
  top: number;
  left: number;
}

const AttackEffect: React.FC<IAttackEffect> = ({ size, top, left }) => {
  return (
    <Box pos={'fixed'} top={top} left={left} zIndex={20} boxSize={size}>
      <ChakraBox
        pos={'absolute'}
        top={0}
        right={0}
        initial={{ width: '0%', height: '0%' }}
        animate={{ width: ['0%', '100%'], height: ['0%', '100%'] }}
        overflow={'hidden'}
        // @ts-ignore no problem in operation, although type error appears.
        transition={{
          delay: 1.2,
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <Box boxSize={size} pos={'absolute'} bgImage={AttackImg} top={0} right={0} bgSize={'contain'} bgRepeat={'no-repeat'} bgPos={'center'} />
      </ChakraBox>
    </Box>
  )
};

export default AttackEffect;
