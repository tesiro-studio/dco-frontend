import React from 'react'
import { Box, keyframes } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import AttackImg from '@/assets/effect/attack.png';

interface IAttackSprite {
  onEnd?: () => void;
}

const animationKeyframes = keyframes`
  0% { background-position: 0px 0px; }
  100% { background-position: -960px 0px; }
`;

const animation = `${animationKeyframes} 0.5s steps(5) 1s`;

const AttackSprite: React.FC<IAttackSprite> = ({ onEnd }) => {
  return (
    <Box
      as={motion.div}
      animation={animation}
      bgImg={AttackImg}
      w={'192px'}
      h={'172px'}
      bgRepeat={'no-repeat'}
      bgSize={'auto'}
      bgPos={'192px 0px'}
      onAnimationEnd={() => onEnd?.()}
      transform={'translateX(-30px)'}
    />
  )
};

export default AttackSprite;
