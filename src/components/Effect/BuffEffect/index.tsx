import React from 'react'

import { Center } from '@chakra-ui/react';
import BuffSprite from './BuffSprite';

interface ISkillEffect {
  top: number | string;
  left: number | string;
  onEnd: () => void;
}

const BuffEffect: React.FC<ISkillEffect> = ({ top, left, onEnd }) => {
  return (
    <Center pos={'fixed'} top={top} left={left} zIndex={20}>
      <BuffSprite onEnd={onEnd} />
    </Center>
  )
};

export default BuffEffect;
