import React from 'react'

import { Center } from '@chakra-ui/react';
import SkillSprite from './SkillSprite';

interface ISkillEffect {
  top: number;
  left: number;
  onEnd: () => void;
}

const SkillEffect: React.FC<ISkillEffect> = ({ top, left, onEnd }) => {
  return (
    <Center pos={'fixed'} top={top} left={left} zIndex={20}>
      <SkillSprite onEnd={onEnd} />
    </Center>
  )
};

export default SkillEffect;
