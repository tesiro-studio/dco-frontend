import { Center, Flex, GridItem } from '@chakra-ui/react';
import React, { Fragment, useEffect } from 'react'
import MyBoardCards from './MyBoardCards';
import MyHandCards from './MyHandCards';
import MyAvatar from './MyAvatar';
import MyMana from './MyMana';
import { observer } from 'mobx-react-lite';
import { store } from '@/stores/RootStore';
import { toJS } from 'mobx';
import { ActionKind } from '@/types';
import MySelectTargetCard from './MySelectTargetCard';

const MyBoard: React.FC = () => {
  const { battleStore, boardStore } = store;

  const handleAction = async () => {
    const [action] = toJS(boardStore.myActions);
    if (action) {
      switch (action.kind) {
        case ActionKind.EndTurn: {
          boardStore.executedMyAction();
          return await boardStore.endTurn();
        }
        default: {
          boardStore.executedMyAction();
          break;
        }
      }
    }
  }

  useEffect(() => {
    handleAction();
  }, [boardStore.myActions.length]);

  return (
    <Fragment>
      <GridItem as={Center} gap={'1rem'} area={'myboard'}>
        <MyBoardCards />
      </GridItem>
      <GridItem as={Flex} alignItems={'flex-end'} justifyContent={'flex-end'} area={'mycard'}>
        <MyHandCards />
      </GridItem>
      <GridItem as={Center} area={'myhero'}>
        <MyAvatar />
      </GridItem>
      <GridItem area={'mymana'}>
        <MyMana />
        {battleStore.caster?.from === 'my' && (
          <MySelectTargetCard left={battleStore.caster.left} top={battleStore.caster.top} cardId={battleStore.caster.card.cardId} />
        )}
      </GridItem>
    </Fragment>
  )
};

export default observer(MyBoard);
