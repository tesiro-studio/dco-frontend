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
import ChakraBox from '@/components/ChakraBox';
import HeroSkill from '@/components/HeroSkill';
import HeroShield from '@/components/HeroStats/HeroShield';
import HeroWeapon from '@/components/HeroStats/HeroWeapon';
import HeroExecute from '@/components/HeroStats/HeroExecute';

const Avatars = {
  [HeroKind.Rogue]: Rogue,
  [HeroKind.Warrior]: Warrior,
  [HeroKind.None]: '',
};

const OpAvatar: React.FC = () => {
  const { boardStore, battleStore, gameStore } = store;

  const opAvatarCanSelected = useMemo(() => {
    if (battleStore.caster) {
      const { defaultValue, opHeroCanSelected, myHeroCanSelected } = battleStore.availableTargets ?? {};
      if (defaultValue) {
        return gameStore.isMyTurn() ? defaultValue === opHeroCanSelected : defaultValue === myHeroCanSelected;
      }
      const hasTarget = Boolean(battleStore.caster?.target);
      let targetIsOpHero = false;
      if (gameStore.isMyTurn()) {
        targetIsOpHero = hasTarget && battleStore.caster?.target === opHeroCanSelected;
      } else {
        targetIsOpHero = hasTarget && battleStore.caster?.target === myHeroCanSelected;
      }
      return hasTarget ? targetIsOpHero : Boolean(opHeroCanSelected);
    }
    if (battleStore.attacker) {
      const hasTarget = Boolean(battleStore.attacker?.target);
      let targetIsOpHero = false;
      if (gameStore.isMyTurn()) {
        targetIsOpHero = hasTarget && battleStore.attacker?.target === battleStore.availableTargets?.opHeroCanSelected;
      } else {
        return false;
      }
      return hasTarget ? targetIsOpHero : Boolean(battleStore.availableTargets?.opHeroCanSelected);
    }
    return false;
  }, [battleStore.availableTargets, battleStore.caster?.target, battleStore.attacker?.target, gameStore.turns]);

  const handleClickAvatar = async () => {
    if (battleStore.availableTargets) {
      battleStore.confirmTarget(battleStore.availableTargets.opHeroCanSelected);
      if (battleStore.caster) {
        // await delay(500);
        // await battleStore.casterEffectReady();
        // battleStore.done()
      }
    }
  }

  const heroKind = Number(boardStore.ophero.kind) as HeroKind;
  return (
    <Center pos={'relative'}>
      {battleStore.buff === 'op' && (
        <HeroExecute onAnimationEnd={() => battleStore.done()} />
      )}
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
        transform={opAvatarCanSelected ? 'scale(1.05)' : 'scale(1)'}
        filter={opAvatarCanSelected ? 'drop-shadow(0px 2px 10px #E82424)' : 'drop-shadow(2px 4px 10px #000000)'}
        pointerEvents={opAvatarCanSelected ? 'auto' : 'none'}
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
