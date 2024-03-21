import React, { useEffect, useMemo, useState } from 'react'
import { Center, Img } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { store } from '@/stores/RootStore';
import Value from '@/components/Value';
import { CardEventType, EffectType, HeroKind } from '@/types';
import ChakraBox from '@/components/ChakraBox';
import HeroSkill from '@/components/HeroSkill';
import HeroShield from '@/components/HeroStats/HeroShield';
import AvatarBg from '@/assets/images/avatar-bg.webp';
import LivesImg from '@/assets/icons/lives.png';
import Rogue from '@/assets/servants/9.png';
import Warrior from '@/assets/servants/4.png';
import HeroWeapon from '@/components/HeroStats/HeroWeapon';
import { getEffectShadowColor } from '@/utils/action';

const Avatars = {
  [HeroKind.Rogue]: Rogue,
  [HeroKind.Warrior]: Warrior,
  [HeroKind.None]: '',
};

const MyAvatar: React.FC = () => {
  const { boardStore, gameStore, executeStore } = store;
  const [executing, setExecuting] = useState(false);

  const handleClickAvatar = async () => {
    if (myHeroSelectable.canSelect) {
      if (executeStore.executer?.event === CardEventType.Summon) {
        executeStore.setMyPlayCardTarget({
          isMyHero: true,
        })
      }
    } else if (canAttack) {
      executeStore.setMyHeroAttackEvent();
    }
  }

  const heroKind = Number(boardStore.myhero.kind) as HeroKind;

  const handleHeroSkill = async () => {
    try {
      setExecuting(true);
      executeStore.setHeroSkillEvent(true, () => boardStore.addHeroSkillAction());
    } catch (error) {
      console.log(error);
      setExecuting(false);
    }
  }

  const canUseSkill = useMemo(() => {
    if (!gameStore.isMyTurn() || executing) return false;
    return Boolean(boardStore.myhero.useSkill) && boardStore.myhero.currentMana >= BigInt(2) && Boolean(!executeStore.availableTargets);
  }, [boardStore.myhero.currentMana, gameStore.turns, executing, executeStore.availableTargets]);

  const canAttack = useMemo(() => {
    return !Boolean(boardStore.myhero.attacked) && Boolean(boardStore.myhero.weaponAttack);
  }, [boardStore.myhero.attacked, boardStore.myhero.weaponAttack]);

  const myHeroSelectable = useMemo(() => {
    const { from, to } = executeStore.executer ?? {}
    const selected = Boolean(executeStore.availableTargets?.myHeroCanSelected) || from?.isMyHero || to?.isMyHero;
    return {
      canSelect: Boolean(executeStore.availableTargets?.myHeroCanSelected),
      selected: from?.isMyHero || to?.isMyHero,
      effect: selected ? executeStore.executer?.effect ?? EffectType.None : EffectType.None,
      isAttacker: from?.isMyHero,
    }
  }, [executeStore.executer?.from, executeStore.executer?.to]);

  useEffect(() => {
    setExecuting(false);
  }, [gameStore.turns]);

  return (
    <Center pos={'relative'}>
      <ChakraBox
        zIndex={3}
        initial={{ x: 0, opacity: 0 }}
        animate={{ x: -150, opacity: 1 }}
        pos={'absolute'}
        pointerEvents={canUseSkill ? 'auto' : 'none'}
        filter={canUseSkill ? '' : 'brightness(0.5)'}
        onClick={handleHeroSkill}
      >
        <HeroSkill heroKind={heroKind} />
      </ChakraBox>
      <Center
        zIndex={5}
        className="pointer"
        pos={'relative'}
        data-hero="my"
        transform={myHeroSelectable.canSelect ? 'scale(1.05)' : 'scale(1)'}
        filter={myHeroSelectable.isAttacker ? 'drop-shadow(0px 2px 10px #FFAC0B)' : getEffectShadowColor(myHeroSelectable.effect)}
        pointerEvents={canAttack || myHeroSelectable.canSelect ? 'auto' : 'none'}
        onClick={handleClickAvatar}
      >
        {Boolean(boardStore.myhero.shield) && <HeroShield shield={Number(boardStore.myhero.shield)} />}
        {Boolean(boardStore.myhero.weaponAttack) && <HeroWeapon attack={Number(boardStore.myhero.weaponAttack)} />}
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
    </Center>
  )
};

export default observer(MyAvatar);
