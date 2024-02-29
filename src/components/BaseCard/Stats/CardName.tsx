import { Box, Center } from '@chakra-ui/react';
import React from 'react'

interface ICardName {
  name: string;
  type: string;
}

const CardName: React.FC<ICardName> = ({ name, type }) => {
  const buttom = () => {
    if (type === 'servant') return '30%';
    if (type === 'weapon') return '33%';
    return '41.5%';
  }

  const nameLines = () => {
    if (type === 'servant') return 1;
    return 0;
  }
  return (
    <Box
      pos={'absolute'}
      zIndex={5}
      left={'0'}
      right={'0'}
      bottom={buttom()}
      transform={'scale(0.7)'}
    >
      <Center fontSize={'0.575rem'} gap={'0.25rem'} color={'font.1'}>
        <Box opacity={nameLines()} w={'20%'} h={'0.0625rem'} bgGradient={'linear(90deg, rgba(236, 186, 179, 0) 0%, rgba(236, 186, 179, 1) 80%, rgba(236, 186, 179, 1) 100%)'} />
        <Center color={'button.1'} flex={1} textAlign={'center'} lineHeight={1}>
          {name}
        </Center>
        <Box opacity={nameLines()} w={'20%'} h={'0.0625rem'} bgGradient={'linear(270deg, rgba(236, 186, 179, 0) 0%, rgba(236, 186, 179, 1) 80%, rgba(236, 186, 179, 1) 100%)'} />
      </Center>
    </Box>
  )
};

export default CardName;
