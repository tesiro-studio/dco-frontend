import React from 'react'

import { Center } from '@chakra-ui/react';
import AttackSprite from './AttackSprite';

interface IAttackEffect {
  top: number;
  left: number;
}

const AttackEffect: React.FC<IAttackEffect> = ({ top, left }) => {
  return (
    <Center pos={'fixed'} top={top} left={left} zIndex={20}>
      <AttackSprite />
    </Center>
  )
};

export default AttackEffect;
