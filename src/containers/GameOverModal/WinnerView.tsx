import { Center, Img } from '@chakra-ui/react';
import React from 'react'

import WinTextImg from '@/assets/images/game_win-text.webp';
import WinBorderImg from '@/assets/images/game_win-border.webp';
import WinBgImg from '@/assets/images/game_win-bg.webp';
import LightImg1 from '@/assets/images/light_1.webp';
import LightImg2 from '@/assets/images/light_2.webp';
import ChakraBox from '@/components/ChakraBox';

interface IWinnerView {}

const WinnerView: React.FC<IWinnerView> = () => {
  return (
    <Center pos={'relative'} mb={'5rem'}>
      <Img src={WinBgImg} h={'8rem'} w={'auto'} top={'1.5rem'} zIndex={20} pos={'absolute'} />
      <Img src={WinBorderImg} h={'12rem'} w={'auto'} zIndex={21} pos={'relative'} />
      <Img src={WinTextImg} h={'1.25rem'} top={'40%'} w={'auto'} pos={'absolute'} zIndex={22} />
      <ChakraBox
        pos={'absolute'}
        animate={{
          rotate: [0, -180, -360, -540, -720],
        }}
        // @ts-ignore no problem in operation, although type error appears.
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "loop",
        }}
        zIndex={18}
      >
        <Img src={LightImg1} boxSize={'20rem'} />
      </ChakraBox>
      <ChakraBox
        pos={'absolute'}
        animate={{
          rotate: [0, 180, 360, 540, 720],
        }}
        // @ts-ignore no problem in operation, although type error appears.
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "loop",
        }}
        zIndex={19} 
      >
        <Img src={LightImg2} boxSize={'20rem'}/>
      </ChakraBox>
    </Center>
  )
};

export default WinnerView;
