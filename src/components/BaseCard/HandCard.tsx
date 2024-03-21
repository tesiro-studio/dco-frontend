import BaseCard from '@/components/BaseCard';
import ChakraBox from '@/components/ChakraBox';
import React, { useMemo } from 'react'

interface IHandCard {
  index: number;
  cardId: number;
  selected?: boolean;
  locked?: boolean;
  ml?: string;
  flip?: boolean;
  disabledExitEffect?: boolean;
  onSelect?: () => void;
}

const HandCard = ({ cardId, index, selected = false, onSelect, ml, locked = false, flip = false, disabledExitEffect = false }: IHandCard, ref: any) => {
  const cardStyle = useMemo(() => {
    if (selected) {
      return {
        initial: { y: -50, opacity: 0.5  },
        animate: { y: 0, scale: 1.1, opacity: 1  },
        exit: disabledExitEffect ? {} : { scale: 0.8, opacity: 0 },
        whileHover: {},
      }
    }
    return {
      initial: { y: -50, opacity: 0.5  },
      animate: { y: 0, scale: 1, opacity: 1  },
      whileHover: { zIndex: 100, y: -20, scale: 1.1 }
    }
  }, [selected, locked]);

  return (
    <ChakraBox
      ref={ref}
      layout
      className='pointer'
      zIndex={selected ? 99 : index}
      bottom={selected ? '40px' : '0'}
      filter={selected ? 'drop-shadow(0px 1px 6px #34eb55)' : 'drop-shadow(1px 6px 6px black)'}
      transition={{ type: "spring" }}
      onClick={() => onSelect?.()}
      ml={ml}
      {...cardStyle}
      data-id={cardId}
      data-index={index}
    >
      <BaseCard
        flip={flip}
        cardId={cardId}
      />
    </ChakraBox>
  )
};

export default React.forwardRef<any, IHandCard>(HandCard);
