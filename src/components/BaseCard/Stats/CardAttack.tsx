import { Box, Center, Img } from '@chakra-ui/react';
import React from 'react'

import AttackImg from '@/assets/icons/attack.png';
import Value from '@/components/Value';

interface ICardAttack {
  attack: number;
  tmpAttack?: number;
  willChange?: boolean;
}

const CardAttack: React.FC<ICardAttack> = ({ attack, tmpAttack = 0 }) => {
  return (
    <Center
      pos={'absolute'}
      zIndex={5}
      bottom={0}
      left={0}
      w={'30%'}
      transform={'translate(-25%, 10%)'}
      sx={{ backfaceVisibility: 'hidden' }}
    >
      <Img src={AttackImg} w={'100%'} h={'auto'} />
      <Box
        pos={'absolute'}
        h={'40px'}
        lineHeight={1}
        transform={'scale(0.6)'}
        top={'0'}
        color={tmpAttack > 0 ? 'heal.1' : (tmpAttack === 0 ? '#ffffff' : 'damage.1')}
      >
        <Value val={tmpAttack ? `${attack + tmpAttack}` : `${attack}`} fontSize='28px' />
      </Box>
    </Center>
  )
};

export default CardAttack;
