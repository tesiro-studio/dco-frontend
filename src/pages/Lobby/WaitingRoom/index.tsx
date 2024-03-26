import { VStack, Text, Center } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite';

import AppButton from '@/components/AppButton';
import ChakraBox from '@/components/ChakraBox';
import { store } from '@/stores/RootStore';
import { GameState } from '@/types';
import tcg from '@/services/tcg';
import { getGameConfig } from '@/utils/game';
import { useNavigate } from 'react-router-dom';
import { usePageVisibility } from 'react-page-visibility';
import { show } from '@/utils/notification';

const WaitingRoom: React.FC = () => {
  const { roomStore } = store;
  const [quiting, setQuiting] = useState(false);
  const unwatch = useRef<() => void>();
  const navigate = useNavigate();
  const isVisible = usePageVisibility();

  const handleWatchGame = async () => {
    const { roomInfo } = roomStore;
    if (roomInfo && !quiting) {
      const gameConfig = getGameConfig(roomInfo, roomStore.player.address);
      switch (roomInfo.state) {
        case GameState.WaitingForPlayers: {
          console.log('@等待玩家加入');
          unwatch.current = tcg.watchGameStart((roomId) => {
            if (roomId === roomStore.roomId) {
              roomStore.check();
            }
          })
          break;
        }
        case GameState.WaitingForShuffling: {
          console.log('@配對成功，等待雙方洗牌');
          if (!isVisible) show('Getting matched!', 'The game is beginning...');
          let initShuffle = roomInfo.shuffleVerified[gameConfig.myPlayerIndex];
          const initOpShuffle = roomInfo.shuffleVerified[gameConfig.opPlayerIndex];
          const remaskShuffle = roomInfo.shuffleRemasked[gameConfig.myPlayerIndex];
          const [pkx, pky] = [BigInt(roomInfo.pk[2].x.toString()), BigInt(roomInfo.pk[2].y.toString())];

          if (!initShuffle) {
            console.log('--尚未幫對方洗牌', pkx, pky);
            await tcg.verifyShuffle(pkx, pky);
            initShuffle = true;
          }
          if (!initOpShuffle) {
            // 等待對方幫我洗完牌
            unwatch.current = tcg.watchShuffleVerified(
              roomStore.roomId,
              gameConfig.opPlayerIndex,
              () => {
                roomStore.check();
              }
            )
          }
          if (initShuffle && initOpShuffle && !remaskShuffle) {
            console.log('-- 對手已完成你的洗牌');
            console.log(`-- 尚未幫自己二次洗牌 ${remaskShuffle}, 對手index: ${gameConfig.opPlayerIndex}`);
            const cards = await tcg.getShuffledCards(roomStore.roomId, gameConfig.opPlayerIndex);
            await tcg.verifyShuffle(pkx, pky, cards);
          }
          if (initShuffle && initOpShuffle) {
            console.log('-- 等待雙方幫自己洗完牌');
            unwatch.current = tcg.watchShuffleRemasked(
              roomStore.roomId,
              () => {
                roomStore.check();
              }
            )
          }
          break;
        }
        case GameState.WaitingForRevealFirst: {
          console.log('@洗牌完成，等待初始發牌:');
          if (!roomInfo.revealedFirst[gameConfig.myPlayerIndex] && store.zkey) {
            console.log('--尚未幫對方發牌');
            await tcg.revealStart(store.zkey, roomStore.roomId, gameConfig.myPlayerIndex, !gameConfig.startWithOp);
          }
          unwatch.current = tcg.watchReveal(
            roomStore.roomId,
            () => {
              roomStore.check();
            }
          )
          break;
        }
        case GameState.Playing: {
          console.log('@進行遊戲ing');
          navigate('/game');
        }
      }
    }
  }

  const handleQuitMatch = async () => {
    setQuiting(true);
    try {
      unwatch.current?.();
      await tcg.quitGame();
    } catch (error) {
      console.log(error);
    }
    await roomStore.check();
    setQuiting(false);
  }

  useEffect(() => {
    unwatch.current?.();
    handleWatchGame();
    return () => {
      unwatch.current?.();
    }
  }, [roomStore.roomInfo]);

  return (
    <ChakraBox
      flex={1}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      initial={{ opacity: 0.1, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      // @ts-ignore no problem in operation, although type error appears.
      transition={{
        duration: 1,
        ease: "easeInOut",
      }}
    >
      <VStack h={'100%'} gap={'4rem'} justifyContent={'center'} textAlign={'center'}>
        <VStack gap={'0.5rem'}>
          <Text fontSize={'2rem'} lineHeight={1.2} color={'font.4'}>Matchmaking</Text>
          <Text fontSize={'3rem'} lineHeight={1.2} color={'white'}>Matching opponents for you...</Text>
        </VStack>
        <Center pos={'relative'} zIndex={10}>
          {!roomStore.matched && (
            <AppButton
              onClick={handleQuitMatch}
              isDisabled={quiting}
            >
              CANCEL
            </AppButton>
          )}
        </Center>
      </VStack>
    </ChakraBox>
  )
};

export default observer(WaitingRoom);
