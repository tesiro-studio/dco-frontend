import React from 'react'

import { Center } from '@chakra-ui/react';
import DebuffSprite from './DebuffSprite';

interface ISkillEffect {
  top: number | string;
  left: number | string;
  onEnd: () => void;
}

const DebuffEffect: React.FC<ISkillEffect> = ({ top, left, onEnd }) => {
  return (
    <Center pos={'fixed'} top={top} left={left} zIndex={20}>
      <DebuffSprite onEnd={onEnd} />
    </Center>
  )
};

export default DebuffEffect;
