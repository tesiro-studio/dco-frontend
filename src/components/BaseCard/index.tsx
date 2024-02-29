import { Box, Center, CenterProps, Img } from '@chakra-ui/react';
import React, { useMemo } from 'react'

import CardBackImg from '@/assets/card/card_back.webp';
import CardCost from './Stats/CardCost';
import CardAttack from './Stats/CardAttack';
import CardLives from './Stats/CardLives';
import { CardKind } from '@/types';
import { CardAttrs } from '@/constants/cards';
import CardName from './Stats/CardName';
import CardBorder from './Stats/CardBorder';
import CardLayer from './Stats/CardLayer';
import CardRank from './Stats/CardRank';
import CardDesc from './Stats/CardDesc';
import CardImage from './Stats/CardImage';

interface ICard extends CenterProps {
  cardId: CardKind;
  flip?: boolean;
}

const BaseCard: React.FC<ICard> = ({ cardId, flip = false }) => {
  const cardAttr = useMemo(() => CardAttrs[cardId], [cardId]);
  const isCardFlip = useMemo(() => {
    if (flip) return 'rotateY(180deg)';
    return cardId ? '' : 'rotateY(180deg)';
  }, [cardId, flip]);
  return (
    <Center w={'120px'} h={'auto'} color={'white'} transform={isCardFlip} className="card" pos={'relative'} sx={{ transformStyle: 'preserve-3d'}}>
      <CardCost cost={Number(cardAttr.cost)} />
      {['servant', 'weapon'].includes(cardAttr.type) && <CardAttack attack={Number(cardAttr.attack)} /> }
      {['servant', 'weapon'].includes(cardAttr.type) && <CardLives lives={Number(cardAttr.hp)} type={cardAttr.type} /> }
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

export default BaseCard;
