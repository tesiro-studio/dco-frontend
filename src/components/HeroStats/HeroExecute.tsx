import React from 'react'

import BuffImg from '@/assets/images/buff.png';
import ChakraBox from '../ChakraBox';

interface IHeroExecute {
  onAnimationEnd: () => void;
}

const HeroExecute: React.FC<IHeroExecute> = ({ onAnimationEnd }) => {
  return (
    <ChakraBox
      zIndex={11}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [1, 0.5, 1, 1, 0.5, 0],
        scale: [1.5, 1.5, 1.75, 2, 3, 4],
      }}
      pos={'absolute'}
      bgImg={BuffImg}
      boxSize={'7rem'}
      bgPos={'center'}
      onAnimationEnd={onAnimationEnd}
      bgSize={'contain'}
      bgRepeat={'no-repeat'}
      // @ts-ignore no problem in operation, although type error appears.
      transition={{
        duration: 2,
        ease: "easeInOut",
      }}
    />
  )
};

export default HeroExecute;
