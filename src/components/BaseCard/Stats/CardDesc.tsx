import { CardKind } from '@/types';
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { Trans } from 'react-i18next';

interface ICardDesc {
  cardId: CardKind;
  type: string;
}

const CardDesc: React.FC<ICardDesc> = ({ cardId, type }) => {
  return (
    <Flex
      pos={'absolute'}
      zIndex={5}
      left={'15%'}
      right={'15%'}
      bottom={type === 'magic' ? '18%' : '14%'}
      h={'18%'}
      flexWrap={'nowrap'}
      justifyContent={'center'}
      alignItems={'flex-end'}
    >
      <Flex
        gap={'0.25rem'}
        minW={'24rem'}
        h={'10rem'}
        transform={'scale(0.2)'}
        transformOrigin={'bottom'}
        alignItems={'center'}
        fontSize={'1.6rem'}
        lineHeight={1.2}
        color={'desc.1'}
      >
        <Trans
          parent={'span'}
          i18nKey={`card.${cardId}.desc`}
          components={{
            br: <br />,
            d1: <Box as={'span'} verticalAlign={'middle'} color={'damage.1'} />,
            h1: <Box as={'span'} verticalAlign={'middle'} color={'heal.1'} />,
            d2: <Box as={'span'} verticalAlign={'middle'} color={'damage.2'} />,
            h2: <Box as={'span'} verticalAlign={'middle'} color={'heal.2'} />
          }}
        />
      </Flex>
    </Flex>
  )
};

export default CardDesc;
