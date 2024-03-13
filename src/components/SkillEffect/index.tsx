import React from 'react'

import SkillImg from '@/assets/status/attack_skill.png';
import { Box, Center } from '@chakra-ui/react';
import ChakraBox from '../ChakraBox';

interface ISkillEffect {
  size: string;
  top: number;
  left: number;
}

const SkillEffect: React.FC<ISkillEffect> = ({ size, top, left }) => {
  return (
    <Center pos={'fixed'} top={top} left={left} zIndex={20} boxSize={size}>
      <ChakraBox
        pos={'absolute'}
        initial={{ width: '0%', height: '0%', borderRadius: '50%', opacity: 0 }}
        animate={{ width: ['0%', '100%'], height: ['0%', '100%'], borderRadius: ['50%', '0%'], opacity: [0, 1, 1, 1, 0, 1, 0] }}
        overflow={'hidden'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        // @ts-ignore no problem in operation, although type error appears.
        transition={{
          delay: 1.2,
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <Box boxSize={size} pos={'absolute'} bgImage={SkillImg} bgSize={'contain'} bgRepeat={'no-repeat'} bgPos={'center'} />
      </ChakraBox>
    </Center>
  )
};

export default SkillEffect;
