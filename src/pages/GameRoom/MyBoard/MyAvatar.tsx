import React, { useMemo } from 'react'
import { Center, Img } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import delay from 'delay';

import AvatarBg from '@/assets/images/avatar-bg.webp';
import LivesImg from '@/assets/icons/lives.png';
import Rogue from '@/assets/servants/9.png';
import Warrior from '@/assets/servants/4.png';
import { store } from '@/stores/RootStore';
import Value from '@/components/Value';
import { HeroKind } from '@/types';

const Avatars = {
  [HeroKind.Rogue]: Rogue,
  [HeroKind.Warrior]: Warrior,
  [HeroKind.None]: '',
};

const MyAvatar: React.FC = () => {
  const { boardStore, battleStore, gameStore } = store;

  const myAvatarCanSelected = useMemo(() => {
    if (battleStore.caster) {
      const { defaultValue, opHeroCanSelected, myHeroCanSelected } = battleStore.availableTargets ?? {};
      if (defaultValue) {
        return gameStore.isMyTurn() ? defaultValue === myHeroCanSelected : defaultValue === opHeroCanSelected;
      }
      const hasTarget = Boolean(battleStore.caster?.target);
      let targetIsMyHero = false;
      if (gameStore.isMyTurn()) {
        targetIsMyHero = hasTarget && battleStore.caster?.target === myHeroCanSelected;
      } else {
        targetIsMyHero = hasTarget && battleStore.caster?.target === opHeroCanSelected;
      }
      return hasTarget ? targetIsMyHero : Boolean(myHeroCanSelected);
    }
    if (battleStore.attacker) {
      const hasTarget = Boolean(battleStore.attacker?.target);
      let targetIsMyHero = false;
      if (gameStore.isMyTurn()) {
        return false; // dont hit yourself
      } else {
        targetIsMyHero = hasTarget && battleStore.attacker?.target === battleStore.availableTargets?.myHeroCanSelected;
      }
      return hasTarget ? targetIsMyHero : true;
    }
    return false;
  }, [battleStore.availableTargets, battleStore.caster?.target, gameStore.turns]);

  const handleClickAvatar = async () => {
    if (battleStore.availableTargets) {
      battleStore.confirmTarget(battleStore.availableTargets.myHeroCanSelected);
      await delay(500);
      await battleStore.casterEffectReady();
      battleStore.done()
    }
  }

  const heroKind = Number(boardStore.myhero.kind) as HeroKind;

  return (
    <Center
      cursor={'pointer'}
      pos={'relative'}
      data-hero="my"
      transform={myAvatarCanSelected ? 'scale(1.05)' : 'scale(1)'}
      filter={myAvatarCanSelected ? 'drop-shadow(0px 2px 10px #E82424)' : 'drop-shadow(2px 4px 10px #000000)'}
      pointerEvents={myAvatarCanSelected ? 'auto' : 'none'}
      onClick={handleClickAvatar}
    >
      <Img src={AvatarBg} w={'12.5rem'} h={'auto'} />
      <Center
        pos={'absolute'}
        boxSize={'55%'}
        bgImg={Avatars[heroKind ?? HeroKind.None]}
        bgRepeat={'no-repeat'}
        bgPos={'top'}
        bgSize={'cover'}
        borderRadius={'50%'}
      />
      <Center
        pos={'absolute'}
        bottom={'0'}
        right={'0'}
        bgImage={LivesImg}
        bgRepeat={'no-repeat'}
        bgPos={'top'}
        bgSize={'cover'}
        boxSize={'40%'}
        color={'white'}
        pt={'1.25rem'}
      >
        {boardStore && (
          <Value val={boardStore.myhero.hp.toString()} fontSize='2.5rem' />
        )}
      </Center>
    </Center>
  )
};

export default observer(MyAvatar);
