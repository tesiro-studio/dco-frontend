import React from 'react'

import { Center } from '@chakra-ui/react';
import SkillSprite from './SkillSprite';

interface ISkillEffect {
  top: number;
  left: number;
}

const SkillEffect: React.FC<ISkillEffect> = ({ top, left }) => {
  return (
    <Center pos={'fixed'} top={top} left={left} zIndex={20}>
      <SkillSprite />
    </Center>
  )
};

export default SkillEffect;
