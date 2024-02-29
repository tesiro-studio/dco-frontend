import ActiveCard from '@/components/BaseCard/ActiveCard';
import ChakraBox from '@/components/ChakraBox';
import React, { useMemo } from 'react'
import { BoardCardType } from '@/types';

interface IBoardCard {
  boardCard: BoardCardType;
  selectors?: number[];
  op?: boolean;
  thisTurn?: boolean;
  onSelect?: () => void;
  isDefender: boolean;
  isAttacker: boolean;
}

const BoardCard = (props: IBoardCard, ref: any) => {
  const {
    boardCard,
    onSelect,
    op = false,
    thisTurn = false,
    isDefender = false,
    isAttacker = false,
    selectors = [],
  } = props;

  const cardEffect = useMemo(() => {
    const hasSelected = selectors.length > 0;
    const selected = selectors.includes(boardCard.revealIndex);
    const scale = hasSelected ? (selected ? 1.05 : 1) : 1.05;
    const opacity = hasSelected ? (selected ? 1 : 0.6) : 1;
    const filter = hasSelected ? (selected ? 'drop-shadow(0px 2px 6px #E82424)' : 'drop-shadow(1px 3px 3px #000000)') : 'drop-shadow(1px 3px 3px #000000)';
    // 對方卡牌 -- 被標示為可被技能施放者/可被攻擊者
    if (op && isDefender) {
      return {
        cursor: 'pointer',
        initial: { scale: 1.05, opacity: 0  },
        animate: { scale, opacity },
        exit: { scale: 0.8, opacity: 0 },
        filter: filter,
      }
    }
    // 對方卡牌 -- 被標示為攻擊者
    if (op && isAttacker) {
      return {
        cursor: 'none',
        initial: { scale: 1.05, opacity: 0  },
        animate: { scale, opacity },
        exit: { scale: 0.8, opacity: 0 },
        filter: filter,
      }
    }
    // 我方卡牌 -- 被標示為可被技能施放者/可被攻擊者
    if (isDefender) {
      return {
        cursor: 'pointer',
        initial: { scale: 1.05, opacity: 0  },
        animate: { scale, opacity },
        exit: { scale: 0.8, opacity: 0 },
        filter: filter,
      }
    }
    // 我方卡牌 -- 被標示為攻擊者
    if (isAttacker) {
      return {
        cursor: 'pointer',
        initial: { scale: 1.05, opacity: 0  },
        animate: { scale, opacity },
        exit: { scale: 0.8, opacity: 0 },
        filter: hasSelected && selected ? 'drop-shadow(0px 2px 6px #2FD436)' : 'drop-shadow(1px 3px 3px #000000)',
      }
    }
    return {
      cursor: 'none',
      initial: { scale: 1.05, opacity: 0  },
      animate: { scale: 1.05, opacity },
      exit: { scale: 0.8, opacity: 0 },
      filter: 'drop-shadow(1px 3px 3px #000000)',
    }
  }, [op, selectors, isAttacker, isDefender])

  return (
    <ChakraBox
      ref={ref}
      layout
      pointerEvents={cardEffect.cursor === 'none' ? 'none' : 'auto'}
      pos={'relative'}
      transition={{ type: "spring" }}
      data-id={boardCard.attrs.id}
      data-index={boardCard.revealIndex}
      onClick={() => onSelect?.()}
      {...cardEffect}
    >
      <ActiveCard
        hp={Number(boardCard.attrs.hp)}
        attack={Number(boardCard.attrs.attack)}
        tmpAttack={Number(boardCard.attrs.tmpAtk)}
        cardId={Number(boardCard.attrs.id)}
        canAttack={op ? !thisTurn : Boolean(boardCard.attrs.canAttack)}
      />
    </ChakraBox>
  )
};

export default React.forwardRef<any, IBoardCard>(BoardCard);
