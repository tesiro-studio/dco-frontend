import React, { useMemo } from 'react'
import { Center, Img } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import AvatarBg from '@/assets/images/avatar-bg.webp';
import LivesImg from '@/assets/icons/lives.png';
import Rogue from '@/assets/servants/9.png';
import Warrior from '@/assets/servants/4.png';
import { store } from '@/stores/RootStore';
import Value from '@/components/Value';
import { CardEventType, EffectType, HeroKind } from '@/types';
import ChakraBox from '@/components/ChakraBox';
import HeroSkill from '@/components/HeroSkill';
import HeroShield from '@/components/HeroStats/HeroShield';
import HeroWeapon from '@/components/HeroStats/HeroWeapon';
import { getEffectShadowColor } from '@/utils/action';

const Avatars = {
  [HeroKind.Rogue]: Rogue,
  [HeroKind.Warrior]: Warrior,
  [HeroKind.None]: '',
};

const OpAvatar: React.FC = () => {
  const { boardStore, executeStore } = store;

  const handleClickAvatar = async () => {
    if (opHeroSelectable.canSelect) {
      if (executeStore.executer?.event === CardEventType.Summon) {
        executeStore.setMyPlayCardTarget({
          isOpHero: true,
        })
      }
      if (executeStore.executer?.event === CardEventType.Attack) {
        executeStore.setMyAttackTarget({
          isOpHero: true,
        })
      }
      if (executeStore.executer?.event === CardEventType.HeroAttack) {
        executeStore.setMyHeroAttackTarget({
          isOpHero: true,
        })
      }
    }
  }

  const opHeroSelectable = useMemo(() => {
    const { from, to } = executeStore.executer ?? {}
    const selected = Boolean(executeStore.availableTargets?.opHeroCanSelected) || from?.isOpHero || to?.isOpHero;
    return {
      canSelect: Boolean(executeStore.availableTargets?.opHeroCanSelected),
      selected: from?.isOpHero || to?.isOpHero,
      effect: selected ? executeStore.executer?.effect ?? EffectType.None : EffectType.None,
      isAttacker: from?.isOpHero,
    }
  }, [executeStore.executer?.from, executeStore.executer?.to]);

  const heroKind = Number(boardStore.ophero.kind) as HeroKind;
  return (
    <Center pos={'relative'}>
      <ChakraBox
        zIndex={3}
        initial={{ x: 0, opacity: 0 }}
        animate={{ x: 150, opacity: 1 }}
        pos={'absolute'}
        pointerEvents={'none'}
      >
        <HeroSkill heroKind={heroKind} />
      </ChakraBox>
      <Center
        data-hero={'op'}
        className="pointer"
        onClick={handleClickAvatar}
        pos={'relative'}
        transition={'0.3s'}
        transform={opHeroSelectable.canSelect ? 'scale(1.05)' : 'scale(1)'}
        filter={opHeroSelectable.isAttacker ? 'drop-shadow(0px 2px 10px #FFAC0B)' : getEffectShadowColor(opHeroSelectable.effect)}
        pointerEvents={opHeroSelectable.canSelect ? 'auto' : 'none'}
      >
        {Boolean(boardStore.ophero.shield) && <HeroShield shield={Number(boardStore.ophero.shield)} />}
        {Boolean(boardStore.ophero.weaponAttack) && <HeroWeapon attack={Number(boardStore.ophero.weaponAttack)} />}
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
            <Value val={boardStore.ophero.hp.toString()} fontSize='2.5rem' />
          )}
        </Center>
      </Center>
    </Center>
  )
};

export default observer(OpAvatar);
