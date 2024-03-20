import ActiveCard from '@/components/BaseCard/ActiveCard';
import ChakraBox from '@/components/ChakraBox';
import React, { useMemo } from 'react'
import { BoardCardType, EffectType } from '@/types';
import { getEffectShadowColor } from '@/utils/action';

interface IBoardCard {
  effect?: EffectType,
  isTarget?: boolean,
  canSelected?: boolean,
  canAttack?: boolean,

  boardCard: BoardCardType;
  op?: boolean;
  thisTurn?: boolean;
  onSelect?: () => void;
}

const BoardCard = (props: IBoardCard, ref: any) => {
  const {
    effect = EffectType.None,
    isTarget = false,
    canSelected = false,
    canAttack = false,

    boardCard,
    onSelect,
    op = false,
    thisTurn = false,
  } = props;

  const cardEffect = useMemo(() => {
    // const filter = hasSelected ? (selected ? 'drop-shadow(0px 2px 6px #E82424)' : 'drop-shadow(1px 3px 3px #000000)') : 'drop-shadow(1px 3px 3px #000000)';
    const initial = { scale: 1.05, opacity: 0 };
    const filter = canSelected || isTarget ? getEffectShadowColor(effect) : getEffectShadowColor(EffectType.None);
    const exit = { scale: 0.8, opacity: 0 };
    let className = canAttack || canSelected ? 'pointer' : '';
    let scale = isTarget || canSelected ? 1.05 : 1;
    let opacity = !canAttack ? 0.8 : 1;
    // op's card -- 被標示為可被技能施放者/可被攻擊者
    if (op) {
      className = canSelected ? 'pointer' : '';
      opacity = effect === EffectType.None && !isTarget ? 0.6 : 1;
    }
    return {
      initial,
      animate: { scale, opacity },
      exit,
      filter,
      className,
    }
  }, [op, isTarget, canSelected, effect, canAttack])

  return (
    <ChakraBox
      ref={ref}
      layout
      pointerEvents={cardEffect.className ? 'auto' : 'none'}
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
