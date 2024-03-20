import { Center, GridItem } from '@chakra-ui/react';
import React, { Fragment, useEffect } from 'react'
import { useAnimate } from 'framer-motion';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import delay from 'delay';

import OpHandCards from './OpHandCards';
import OpAvatar from './OpAvatar';
import OpBoardCards from './OpBoardCards';
import { store } from '@/stores/RootStore';
import { ActionKind, CardKind, EffectType } from '@/types';
import { parseRawAction } from '@/utils/action';
import OpMana from './OpMana';

const OpBoard: React.FC = () => {
  const { opCardStore, boardStore, gameStore, myCardStore, executeStore } = store;
  const [handCardScope, handCardAnimate] = useAnimate();

  const addCardToBoard = async (revealIndex: number, cardId: CardKind, target: number = 0) => {
    // 執行對方出牌效果
    opCardStore.playCardFromHand(cardId, revealIndex);
  
    const { innerHeight, innerWidth } = window;
    const cardSelector = `[data-index="${revealIndex}"]`;
    const cardFilpSelector = `[data-index="${revealIndex}"] > .card`;
    const { top, height, left } = (handCardScope.current as HTMLDivElement).querySelector(cardSelector)?.getBoundingClientRect() as DOMRect;
    const posY = (innerHeight / 2) - (height / 2) - top;
    const posX = (innerWidth * 0.2) - left;
    await handCardAnimate(
      cardSelector,
      { scale: [1, 1, 2.5], y: [0, posY, posY], x: [0, posX, posX] },
      { duration: 1 },
    )
    await handCardAnimate(
      cardFilpSelector,
      { rotateY: ['180deg', '0deg'], },
      { duration: 0.5, delay: 0.5 },
    )
    const effect = executeStore.setOpPlayCardEvent(
      {
        revealIndex: `${revealIndex}`,
        cardId: `${cardId}`,
      },
      target,
      async () => {
        await delay(1000);
        await handCardAnimate(
          cardSelector,
          { opacity: [1, 0, 0, 0], x: [posX, posX - 20, posX - 20, posX - 20], zIndex: -1 },
          { duration: 1, delay: 0.5 },
        )
        await delay(1000);
        opCardStore.addCardsToBoard([{ cardId, revealIndex, turn: gameStore.turns }]);
        await boardStore.completeOpAction();
      }
    )
    if (effect === EffectType.None) {
      // no animation.
      executeStore.done();
    }
  }

  const handleAction = async () => {
    const [action] = toJS(boardStore.opActions);
    if (action) {
      await delay(1500);
      const applyAction = parseRawAction(action);
      switch (action.kind) {
        case ActionKind.PlayCard: {
          // 對方出牌步驟： 盤面載入動作, 將手牌對應位置卡牌添上cardId預備做翻牌效果, 從手牌拉出並翻牌, 將卡牌加入盤面並刷新裝態
          await gameStore.applyAction(applyAction);
          await addCardToBoard(action.nthDrawn, action.cardId, applyAction.target);
          break;
        }
        case ActionKind.EndTurn: {
          // 回合結束步驟：盤面載入動作，刷新狀態
          await gameStore.applyAction(applyAction);
          await boardStore.completeOpAction();
          await delay(1000);
          // 對方回合結束則我方抽牌
          myCardStore.pullCard(gameStore.turns);
          break;
        }
        case ActionKind.MinionAttack: {
          // 對方攻擊步驟：盤面載入, 高亮雙方卡牌
          const { revealIndex, attrs: { id } } = opCardStore.boardCards[applyAction.position ?? -1];
          // const { revealIndex: target = -1 } = myCardStore.boardCards[applyAction.target ?? -1] || {};
          await gameStore.applyAction(applyAction);
          executeStore.setOpAttackEvent(
            { cardId: `${id}`, revealIndex: `${revealIndex}` },
            applyAction.target ?? 0,
            async () => {
              await delay(1000);
              await boardStore.completeOpAction();
            }
          )
          break;
        }
        case ActionKind.HeroSkill: {
          executeStore.setHeroSkillEvent(false, async () => {
            await gameStore.applyAction(applyAction);
            await delay(1500);
            await boardStore.completeOpAction();
          })
          break;
        }
        default: {
          console.log('action:', action);
        }
      }
    }
  }

  useEffect(() => {
    handleAction();
  }, [boardStore.opActions.length]);

  return (
    <Fragment>
      <GridItem as={Center} gap={'1rem'} area={'opboard'}>
        <OpBoardCards />
      </GridItem>
      <GridItem ref={handCardScope} area={'opcard'}>
        <OpHandCards />
      </GridItem>
      <GridItem as={Center} area={'ophero'}>
        <OpAvatar />
      </GridItem>
      <GridItem area={'opmana'}>
        <OpMana />
      </GridItem>
    </Fragment>
  )
};

export default observer(OpBoard);
