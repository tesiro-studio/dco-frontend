import React, { useEffect, useMemo, useState } from 'react'
import { Center, Img } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import delay from 'delay';

import { store } from '@/stores/RootStore';
import Value from '@/components/Value';
import { HeroKind } from '@/types';
import ChakraBox from '@/components/ChakraBox';
import HeroSkill from '@/components/HeroSkill';
import HeroShield from '@/components/HeroStats/HeroShield';
import BuffImg from '@/assets/images/buff.png';
import AvatarBg from '@/assets/images/avatar-bg.webp';
import LivesImg from '@/assets/icons/lives.png';
import Rogue from '@/assets/servants/9.png';
import Warrior from '@/assets/servants/4.png';
import HeroWeapon from '@/components/HeroStats/HeroWeapon';
import HeroExecute from '@/components/HeroStats/HeroExecute';

const Avatars = {
  [HeroKind.Rogue]: Rogue,
  [HeroKind.Warrior]: Warrior,
  [HeroKind.None]: '',
};

const MyAvatar: React.FC = () => {
  const { boardStore, battleStore, gameStore } = store;
  const [executing, setExecuting] = useState(false);

  const myAvatarCanSelected = useMemo(() => {
    // const isMyTurn = gameStore.isMyTurn();
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
      // await delay(500);
      // await battleStore.casterEffectReady();
      // battleStore.done()
    }
  }

  const heroKind = Number(boardStore.myhero.kind) as HeroKind;

  const handleHeroSkill = async () => {
    try {
      setExecuting(true);
      await boardStore.addHeroSkillAction()
    } catch (error) {
      console.log(error);
      setExecuting(false);
    }
  }

  const canUseSkill = useMemo(() => {
    if (!gameStore.isMyTurn() || executing) return false;
    return Boolean(boardStore.myhero.useSkill) && boardStore.myhero.currentMana >= BigInt(2);
  }, [boardStore.myhero.currentMana, gameStore.turns, executing]);

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
      {battleStore.buff === 'my' && (
        <HeroExecute onAnimationEnd={() => battleStore.done()} />
      )}
      <Center
        zIndex={5}
        className="pointer"
        pos={'relative'}
        data-hero="my"
        transform={myAvatarCanSelected ? 'scale(1.05)' : 'scale(1)'}
        filter={myAvatarCanSelected ? 'drop-shadow(0px 2px 10px #E82424)' : 'drop-shadow(2px 4px 10px #000000)'}
        pointerEvents={myAvatarCanSelected ? 'auto' : 'none'}
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
