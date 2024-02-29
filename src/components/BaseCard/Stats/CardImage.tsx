import { Box } from '@chakra-ui/react';
import React from 'react'

interface ICardImage {
  image: string;
  type: string;
}

const CardImage: React.FC<ICardImage> = ({ image, type }) => {
  const props = () => {
    if (type === 'weapon') {
      return {
        top: '5%',
        left: '8%',
        right: '8%',
        bottom: '5%',
        borderTopRadius: '10rem',
      };
    }
    return {
      top: '5%',
      left: '5%',
      right: '5%',
      bottom: '5%',
    };
  }
  return (
    <Box
      pos={'absolute'}
      zIndex={2}
      bgBlendMode={'overlay'}
      bg={`url(${image}), linear-gradient(to top, #000000 0%, transparent 60%, transparent 100%)`}
      bgRepeat={'no-repeat'}
      bgSize={'contain'}
      bgPos={'top'}
      sx={{ backfaceVisibility: 'hidden' }}
      {...props()}
    />
  )
};

export default CardImage;
