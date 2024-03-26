import React from 'react'
import { Box, keyframes } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import SkillImg from '@/assets/effect/debuff.png';

interface IDebuffSprite {
  onEnd?: () => void;
}

const animationKeyframes = keyframes`
  0% { background-position: 0px 0px; }
  100% { background-position: -5568px 0px; }
`;

const animation = `${animationKeyframes} 2s steps(29) 0.5s`;

const DebuffSprite: React.FC<IDebuffSprite> = ({ onEnd }) => {
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
      transform={'translate(-96px, -96px) scale(1.5)'}
    />
  )
};

export default DebuffSprite;
