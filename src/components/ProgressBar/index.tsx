import { Center, Text, Img, Flex } from '@chakra-ui/react';
import React from 'react'

import ProgressBgImg from '@/assets/preload/progress-bg.webp';
import ProgressOverlayImg from '@/assets/preload/progress-overlay.webp';

interface IProgressBar {
  value: number;
}

const ProgressBar: React.FC<IProgressBar> = ({ value = 0 }) => {
  return (
    <Center pos={'relative'} color={'white'}>
      <Text top={'15%'} pos={'absolute'} fontSize={'1.125rem'} lineHeight={1.2}>
        Loading game resources, please wait...
      </Text>
      <Img src={ProgressBgImg} flex={1} h={'auto'} />
      <Flex
        pos={'absolute'}
        zIndex={2}
        top={'42%'}
        bottom={'42%'}
        left={'6.5%'}
        right={'6.5%'}
        bg={'transparent'}
        borderRadius={'0.5rem'}
        overflow={'hidden'}
      >
        <Center
          h={'100%'}
          w={`${value * 100}%`}
          transition={'0.3s'}
          borderRightRadius={'0.5rem'}
          bgBlendMode={'overlay'}
          bg={`url(${ProgressOverlayImg}), linear-gradient(180deg, #FF5353 0%, #5B0C0C 67.83%, #610C0C 100%)`}
          bgPos={'center, right'}
          overflow={'hidden'}
          boxShadow={'inset -1px 1px 2px rgba(255, 255, 255, 0.7)'}
          pos={'relative'}
        >
          <Text pos={'absolute'} color={'font.1'} right={'0.75rem'} fontSize={'1.125rem'} lineHeight={1}>
            {(value * 100).toFixed(1)}%
          </Text>
        </Center>
      </Flex>
    </Center>
  )
};

export default ProgressBar;
