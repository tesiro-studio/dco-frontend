import { Center, Img } from '@chakra-ui/react';
import React from 'react'

import LoseBgImg from '@/assets/images/game_lose-bg.webp';

interface ILoserView {}

const LoserView: React.FC<ILoserView> = () => {
  return (
    <Center mb={'5rem'}>
      <Img src={LoseBgImg} h={'7rem'} w={'auto'} top={'1.5rem'} zIndex={20} />
    </Center>
  )
};

export default LoserView;
