import { HeroKind } from '@/types';
import { Center, VStack, Text, Box } from '@chakra-ui/react';
import React from 'react'

import Rogue from '@/assets/servants/9.png';
import Warrior from '@/assets/servants/4.png';

interface IMatchHeroCard {
  address: string;
  hero: HeroKind;
  isMe?: boolean;
}

const MatchHeroCard: React.FC<IMatchHeroCard> = ({ address, hero, isMe = false }) => {
  return (
    <VStack gap={'1rem'}>
      <Box border={'0.0625rem solid'} borderColor={'border.1'} w={'21.825rem'} h={'30rem'} bgImage={hero === HeroKind.Warrior ? Warrior : Rogue} bgRepeat={'no-repeat'} bgPos={'center'} bgSize={'cover'}>
      </Box>
      <VStack alignItems={'center'} lineHeight={1.2} gap={'0.75rem'}>
        <Text color={'font.7'} fontSize={'2rem'}>{address.slice(0, 6)}...{address.slice(-4)}</Text>
        <Text color={'font.6'} fontSize={'1.5rem'}>{isMe ? 'YOU' : 'ENEMY'}</Text>
      </VStack>
    </VStack>
  )
};

export default MatchHeroCard;
