import React, { useMemo } from 'react'

import CardServantBorderImg from '@/assets/card/card_servant_border.webp';
import CardMagicBorderImg from '@/assets/card/card_magic_border.webp';
import CardItemBorderImg from '@/assets/card/card_item_border.webp';
import { Box } from '@chakra-ui/react';

interface ICardBorder {
  type: 'magic' | 'servant' | 'weapon' | 'none';
}

const CardBorder: React.FC<ICardBorder> = ({ type }) => {
  const bgImage = useMemo(() => {
    if (type === 'weapon') return CardItemBorderImg;
    if (type === 'magic') return CardMagicBorderImg;
    return CardServantBorderImg
  }, [type]);
  return (
    <Box
      pos={'absolute'}
      zIndex={4}
      top={0}
      left={0}
      right={0}
      bottom={0}
      bgImage={bgImage}
      bgRepeat={'no-repeat'}
      bgSize={'contain'}
      bgPos={'center'}
      sx={{ backfaceVisibility: 'hidden' }}
      overflow={'hidden'}
    />
  )
};

export default CardBorder;
