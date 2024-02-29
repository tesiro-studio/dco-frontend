import { Box, Center, Img } from '@chakra-ui/react';
import React from 'react'

import FragmentImg from '@/assets/icons/fragment.png';
import Value from '@/components/Value';

interface ICardCost {
  cost: number;
}

const CardCost: React.FC<ICardCost> = ({ cost }) => {
  return (
    <Center
      pos={'absolute'}
      zIndex={5}
      top={0}
      left={0}
      w={'30%'}
      transform={'translate(-25%, -10%)'}
      sx={{ backfaceVisibility: 'hidden' }}
    >
      <Img src={FragmentImg} w={'100%'} h={'auto'} />
      <Box
        pos={'absolute'}
        h={'40px'}
        lineHeight={1}
        transform={'scale(0.6)'}
        top={'0'}
        color={'white'}
      >
        <Value val={`${cost}`} fontSize='32px' />
      </Box>
    </Center>
  )
};

export default CardCost;
