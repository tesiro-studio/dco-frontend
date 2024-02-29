import { Box, Center, Img } from '@chakra-ui/react';
import React from 'react'

import LivesImg from '@/assets/icons/lives.png';
import DefImg from '@/assets/icons/def.png';
// import { useAnimate } from 'framer-motion';
import Value from '@/components/Value';

interface ICardLives {
  lives: number;
  type: string;
}

const CardLives: React.FC<ICardLives> = ({ lives, type }) => {
  const liveImg = () => {
    if (type === 'weapon') {
      return DefImg;
    }
    return LivesImg;
  }
  return (
    <Center
      pos={'absolute'}
      zIndex={5}
      bottom={0}
      right={0}
      w={'30%'}
      sx={{ backfaceVisibility: 'hidden' }}
      transform={'translate(25%, 15%)'}
    >
      <Img src={liveImg()} w={'100%'} h={'auto'} />
      <Box
        pos={'absolute'}
        h={'40px'}
        lineHeight={1}
        transform={'scale(0.6)'}
        top={'0'}
        color={'white'}
      >
        <Value val={`${lives}`} fontSize='28px' />
      </Box>
    </Center>
  )
};

export default CardLives;
