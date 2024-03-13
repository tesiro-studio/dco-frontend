import { Center, Flex, GridItem } from '@chakra-ui/react';
import React, { Fragment } from 'react'
import MyBoardCards from './MyBoardCards';
import MyHandCards from './MyHandCards';
import MyAvatar from './MyAvatar';
import MyMana from './MyMana';

const MyBoard: React.FC = () => {
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
      </GridItem>
    </Fragment>
  )
};

export default MyBoard;
