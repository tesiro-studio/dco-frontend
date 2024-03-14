import React from 'react'
import { Box, keyframes } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import SkillImg from '@/assets/effect/skill.png';

interface ISkillSprite {
  onEnd?: () => void;
}

const animationKeyframes = keyframes`
  0% { background-position: 0px 0px; }
  100% { background-position: -960px 0px; }
`;

const animation = `${animationKeyframes} 0.5s steps(5) 1s`;

const SkillSprite: React.FC<ISkillSprite> = ({ onEnd }) => {
  return (
    <Box
      as={motion.div}
      animation={animation}
      bgImg={SkillImg}
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

export default SkillSprite;
