import { Box, Center, Img } from '@chakra-ui/react';
import React, { useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer';

import CardBackImg from '@/assets/card/card_back.webp';
import { CardKind } from '@/types';
import { CardAttrs } from '@/constants/cards';
import SleepStatus from '../SleepStatus';
import CardBorder from './Stats/CardBorder';
import CardName from './Stats/CardName';
import CardCost from './Stats/CardCost';
import CardAttack from './Stats/CardAttack';
import CardLives from './Stats/CardLives';
import CardLayer from './Stats/CardLayer';
import CardRank from './Stats/CardRank';
import CardDesc from './Stats/CardDesc';
import CardImage from './Stats/CardImage';

interface IActiveCard {
  hp: number;
  attack: number;
  tmpAttack: number;
  cardId: CardKind;
  canAttack?: boolean;
}

const ActiveCard: React.FC<IActiveCard> = ({ cardId, hp, attack, tmpAttack, canAttack = false }) => {
  const [currentState, setCurrentState] = useImmer({ hp, attack, init: false });
  const cardAttr = useMemo(() => CardAttrs[cardId], [cardId]);

  useEffect(() => {
    setCurrentState(state => {
      state.init = true;
    })
  }, []);

  useEffect(() => {
    setCurrentState(state => {
      state.hp = hp;
    })
  }, [hp]);

  useEffect(() => {
    setCurrentState(state => {
      state.attack = attack;
    })
  }, [attack]);

  return (
    <Center w={'120px'} h={'auto'} color={'white'} transform={cardAttr ? '' : 'rotateY(180deg)'} className="card" pos={'relative'} sx={{ transformStyle: 'preserve-3d'}}>
      {!canAttack && <Box pos={'absolute'} zIndex={12} top={0} right={0} boxSize={'2rem'}>
        <SleepStatus />
      </Box>}
      <CardCost cost={Number(cardAttr.cost)} />
      <CardAttack attack={currentState.attack} tmpAttack={tmpAttack} />
      <CardLives lives={currentState.hp} type={cardAttr.type} />
      <CardName name={cardAttr.name} type={cardAttr.type} />
      <CardBorder type={cardAttr.type} />
      <CardLayer type={cardAttr.type} />
      <CardRank type={cardAttr.rank} />
      <CardDesc cardId={cardId} type={cardAttr.type} />
      <CardImage image={cardAttr?.image} type={cardAttr.type} />
      <Box
        pos={'relative'}
        zIndex={5}
        transform={'rotateY(180deg)'}
        sx={{ backfaceVisibility: 'hidden' }}
      >
        <Img
          src={CardBackImg}
          w={'100%'}
          h={'auto'}
        />
      </Box>
    </Center>
  )
};

export default ActiveCard;
