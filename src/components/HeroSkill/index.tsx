import { Center, Img } from '@chakra-ui/react';
import React from 'react'

import HeroSkillBg from '@/assets/images/hero-skill_bg.png';
import { HeroKind } from '@/types';

import RougeSkillImg from '@/assets/images/rouge_skill.webp';
import WarriorSkillImg from '@/assets/images/warrior_skill.webp';
import FragmentImg from '@/assets/icons/fragment.png';
import Value from '../Value';

interface IHeroSkill {
  heroKind: HeroKind
}

const HeroSkill: React.FC<IHeroSkill> = ({ heroKind }) => {
  return (
    <Center
      position={'relative'}
      transition={'0.3s'}
      className='pointer'
      _hover={{
        transform: 'scale(1.2)'
      }}
    >
      <Center
        pos={'absolute'}
        top={'-1rem'}
        boxSize={'3.5rem'}
        bgImg={FragmentImg}
        bgRepeat={'no-repeat'}
        bgSize={'contain'}
        bgPos={'center'}
        zIndex={3}
        color={'#ffffff'}
        filter={'drop-shadow(1px 6px 6px black)'}
      >
        <Value val={`${2}`} fontSize='1.75rem' />
      </Center>
      <Img
        pos={'relative'}
        zIndex={2}
        src={HeroSkillBg}
        boxSize={'7rem'}
        filter={'drop-shadow(1px 6px 6px black)'}
      />
      <Img
        src={heroKind === HeroKind.Rogue ? RougeSkillImg : WarriorSkillImg}
        boxSize={'4rem'}
        pos={'absolute'}
        borderRadius={'50%'}
      />
    </Center>
  )
};

export default HeroSkill;
