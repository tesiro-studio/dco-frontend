import React from 'react'

import { Center } from '@chakra-ui/react';
import AttackSprite from './AttackSprite';

interface IAttackEffect {
  top: number;
  left: number;
  onEnd: () => void;
}

const AttackEffect: React.FC<IAttackEffect> = ({ top, left, onEnd }) => {
  return (
    <Center pos={'fixed'} top={top} left={left} zIndex={20}>
      <AttackSprite onEnd={onEnd} />
    </Center>
  )
};

export default AttackEffect;
