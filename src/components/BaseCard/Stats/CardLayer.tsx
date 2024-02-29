import React, { useMemo } from 'react'

import CardMagicBorderImg from '@/assets/card/card_magic_layer.webp';
import { Box } from '@chakra-ui/react';

interface ICardLayer {
  type: 'magic' | 'servant' | 'weapon' | 'none';
}

const CardLayer: React.FC<ICardLayer> = ({ type }) => {
  const bgImage = useMemo(() => {
    if (type === 'magic') return CardMagicBorderImg;
    return ''
  }, [type]);

  if (!bgImage) return null;

  return (
    <Box
      pos={'absolute'}
      zIndex={3}
      top={0}
      left={0}
      right={0}
      bottom={0}
      bgImage={bgImage}
      bgRepeat={'no-repeat'}
      bgSize={'contain'}
      bgPos={'center'}
      sx={{ backfaceVisibility: 'hidden' }}
    />
  )
};

export default CardLayer;
