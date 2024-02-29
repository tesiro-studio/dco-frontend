import { CardKind, HeroKind } from '@/types';
import React, { useMemo } from 'react'
import { Box, Center } from '@chakra-ui/react';

import Rogue from '@/assets/servants/9.png';
import Warrior from '@/assets/servants/4.png';
import LightImg from '@/assets/images/light_2.webp';
import ChakraBox from '@/components/ChakraBox';
import { CardAttrs } from '@/constants/cards';

interface IClassCard {
  classKind: HeroKind;
  onClick: () => void;
  selected: boolean;
}

const ClassCard: React.FC<IClassCard> = ({ classKind, onClick, selected }) => {
  const cardAttrs = useMemo(() => {
    if (classKind === HeroKind.Rogue) {
      return CardAttrs[CardKind.EdwinVanCleef];
    }
    if (classKind === HeroKind.Warrior) {
      return CardAttrs[CardKind.KingMosh];
    }
    return null;
  }, [classKind]);
  return (
    <Center flex={'1 1 20rem'} h={'30rem'} pos={'relative'}>
      {selected && (
        <ChakraBox
          position={'absolute'}
          left={'-1rem'}
          top={'-1rem'}
          right={'-1rem'}
          bottom={'-1rem'}
          bgImg={LightImg}
          initial={{ scale: 1 }}
          animate={{ scale: 2.5 }}
          bgRepeat={'no-repeat'}
          bgPos={'center'}
          bgSize={'contain'}
          zIndex={1}
        />
      )}
      <Box
        zIndex={2}
        pos={'relative'}
        border={'0.125rem solid'}
        borderColor={selected ? 'border.1' : 'black'}
        boxSize={'100%'}
        bgImg={classKind === HeroKind.Rogue ? Rogue : Warrior}
        bgSize={'cover'}
        bgPos={'center'}
        bgRepeat={'no-repeat'}
        cursor={'pointer'}
        onClick={onClick}
        _hover={{
          borderColor: 'border.1',
        }}
      >
        <Box
          pos={'absolute'}
          zIndex={5}
          left={'10%'}
          right={'10%'}
          bottom={'30%'}
        >
          <Center fontSize={'1.5rem'} gap={'0.5rem'} color={'button.1'}>
            <Box w={'20%'} h={'0.125rem'} bgGradient={'linear(90deg, rgba(236, 186, 179, 0) 0%, rgba(236, 186, 179, 1) 80%, rgba(236, 186, 179, 1) 100%)'} />
            <Center flex={1} textAlign={'center'} lineHeight={1}>
              {cardAttrs?.name}
            </Center>
            <Box w={'20%'} h={'0.125rem'} bgGradient={'linear(270deg, rgba(236, 186, 179, 0) 0%, rgba(236, 186, 179, 1) 80%, rgba(236, 186, 179, 1) 100%)'} />
          </Center>
        </Box>
        <Box
          pos={'absolute'}
          zIndex={2}
          top={0}
          right={0}
          left={0}
          bottom={0}
          boxShadow={selected ? 'class.2' : 'class.1'}
          transition={'box-shadow 0.1s'}
          _hover={{
            boxShadow: 'class.2'
          }}
        />
        <Box pos={'absolute'} zIndex={1} top={0} right={0} left={0} bottom={0} bgGradient={'linear(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)'} />
      </Box>
    </Center>
  )
};

export default ClassCard;
