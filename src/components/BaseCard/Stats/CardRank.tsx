import React, { Fragment, useMemo } from 'react'

import CardRankNImage from '@/assets/card/card_rank_n.webp';
import CardRankRImage from '@/assets/card/card_rank_r.webp';
import CardRankSRImage from '@/assets/card/card_rank_sr.webp';
import CardRankSSRImage from '@/assets/card/card_rank_ssr.webp';
import CardSymbolSSRImage from '@/assets/card/card_symbol_ssr.webp';
import { Box } from '@chakra-ui/react';
import { CardRank as Rank } from '@/types';

interface ICardRank {
  type: Rank;
}

const CardRank: React.FC<ICardRank> = ({ type }) => {
  const bgImage = useMemo(() => {
    if (type === Rank.N) return CardRankNImage;
    if (type === Rank.R) return CardRankRImage;
    if (type === Rank.SR) return CardRankSRImage;
    return CardRankSSRImage
  }, [type]);
  return (
    <Fragment>
      {type === Rank.SSR && (
        <Box
          pos={'absolute'}
          zIndex={10}
          boxSize={'3rem'}
          top={'-0.75rem'}
          bgImage={CardSymbolSSRImage}
          pointerEvents={'none'}
          bgRepeat={'no-repeat'}
          bgSize={'contain'}
          bgPos={'center'}
          filter={'drop-shadow(1px 1px 2px black)'}
          sx={{ backfaceVisibility: 'hidden' }}
        />
      )}
      <Box
        pos={'absolute'}
        zIndex={4}
        boxSize={'2.5rem'}
        bottom={'-0.5rem'}
        bgImage={bgImage}
        pointerEvents={'none'}
        bgRepeat={'no-repeat'}
        bgSize={'contain'}
        bgPos={'center'}
        sx={{ backfaceVisibility: 'hidden' }}
      />
    </Fragment>
  )
};

export default CardRank;
