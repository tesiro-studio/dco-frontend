import React from 'react'
import { Box, keyframes } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import SkillImg from '@/assets/effect/buff.png';

interface IBuffSprite {
  onEnd?: () => void;
}

const animationKeyframes = keyframes`
  0% { background-position: 0px 0px; }
  100% { background-position: -5760px 0px; }
`;

const animation = `${animationKeyframes} 2s steps(30) 0.5s`;

const BuffSprite: React.FC<IBuffSprite> = ({ onEnd }) => {
  return (
    <Box
      as={motion.div}
      animation={animation}
      bgImg={SkillImg}
      w={'192px'}
      h={'192px'}
      bgRepeat={'no-repeat'}
      bgSize={'auto'}
      bgPos={'192px 0px'}
      onAnimationEnd={() => onEnd?.()}
      transform={'translate(-96px, -96px) scale(2)'}
    />
  )
};

export default BuffSprite;
