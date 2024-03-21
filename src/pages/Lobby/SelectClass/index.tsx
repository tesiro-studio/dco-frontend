import { Center, Flex, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'

import ChakraBox from '@/components/ChakraBox';
import ClassCard from './ClassCard';
import { HeroKind } from '@/types';
import AppButton from '@/components/AppButton';
import { observer } from 'mobx-react-lite';
import { store } from '@/stores/RootStore';
import tcg from '@/services/tcg';
import { opBNBTestnet } from 'wagmi/chains';
import { useAccount } from 'wagmi';

const SelectClass: React.FC = () => {
  const { roomStore } = store;
  const { address } = useAccount();
  const [join, setJoin] = useState(false);

  const handleJoinGame = async () => {
    if (address) {
      setJoin(true);
      try {
        Notification.permission !== 'granted' && Notification.requestPermission();
        await tcg.joinGame(address, roomStore.myHeroSelected, opBNBTestnet.id);
        await roomStore.check();
      } catch (error) {
        setJoin(false);
      }
    }
  }

  return (
    <ChakraBox
      flex={1}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      initial={{ opacity: 0.1, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      // @ts-ignore no problem in operation, although type error appears.
      transition={{
        duration: 1,
        ease: "easeInOut",
      }}
    >
      <VStack h={'100%'} textAlign={'center'}>
        <VStack gap={'1.5rem'}>
          <Text fontSize={'3rem'} lineHeight={1.2} color={'white'}>Select a Class for Your In-game Persona</Text>
          <Text fontSize={'1.125rem'} lineHeight={1.5} color={'font.4'}>Once chosen, your class will remain unchanged for each turn until the beginning of the next round.</Text>
        </VStack>
        <Flex w={'100%'} flex={1} alignItems={'center'} gap={'4rem'}>
          <ClassCard
            onClick={() => roomStore.selecteMyHero(HeroKind.Rogue)}
            classKind={HeroKind.Rogue}
            selected={roomStore.myHeroSelected === HeroKind.Rogue}
          />
          <ClassCard
            onClick={() => roomStore.selecteMyHero(HeroKind.Warrior)}
            classKind={HeroKind.Warrior}
            selected={roomStore.myHeroSelected === HeroKind.Warrior}
          />
        </Flex>
        <Center pos={'relative'} zIndex={10}>
          <AppButton
            isDisabled={!roomStore.myHeroSelected || join}
            onClick={handleJoinGame}
          >
            CONFIRM
          </AppButton>
        </Center>
      </VStack>
    </ChakraBox>
  )
};

export default observer(SelectClass);
