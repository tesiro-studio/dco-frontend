
import tcg from '@/services/tcg';
import { store } from '@/stores/RootStore';
import { GameState } from '@/types';
import { getGameConfig } from '@/utils/game';
import { toJS } from 'mobx';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi'

const useGameInit = () => {
  const { address, isConnected } = useAccount();
  const { roomStore } = store;
  const navigate = useNavigate();
  const unwatch = useRef<() => void>();

  const handleGameState = async () => {
    unwatch.current?.();
    if (roomStore.roomInfo && address) {
      const roomInfo = toJS(roomStore.roomInfo);
      const gameConfig = getGameConfig(roomInfo, address);
      switch (roomInfo.state) {
        case GameState.WaitingForPlayers: {
          console.log('@等待玩家加入');
          unwatch.current = tcg.watchGameStart(() => { roomStore.check() })
          break;
        }
        case GameState.WaitingForShuffling: {
          console.log('@配對成功，等待雙方洗牌');
          const initShuffle = roomInfo.shuffleVerified[gameConfig.myPlayerIndex];
          const initOpShuffle = roomInfo.shuffleVerified[gameConfig.opPlayerIndex];
          const remaskShuffle = roomInfo.shuffleRemasked[gameConfig.myPlayerIndex];
          const pkx = BigInt(roomInfo.pk[2].x.toString());
          const pky = BigInt(roomInfo.pk[2].y.toString());
          if (!initShuffle) {
            console.log('--尚未幫對方洗牌', pkx, pky);
            await tcg.verifyShuffle(pkx, pky);
            roomStore.check();
          } else if (initShuffle && !remaskShuffle) {
            console.log(`--尚未幫自己二次洗牌 對手index: ${gameConfig.opPlayerIndex}`);
            if (initOpShuffle) {
              console.log('--對手已完成你的洗牌');
              const cards = await tcg.getShuffledCards(roomStore.roomId, gameConfig.opPlayerIndex);
              await tcg.verifyShuffle(pkx, pky, cards);
            }
            roomStore.check();
          }
          break;
        }
        case GameState.WaitingForRevealFirst: {
          console.log('@洗牌完成，等待初始發牌:');
          if (!roomInfo.revealedFirst[gameConfig.myPlayerIndex] && store.zkey) {
            console.log('--尚未幫對方發牌');
            await tcg.revealStart(store.zkey, roomStore.roomId, gameConfig.myPlayerIndex, !gameConfig.startWithOp);
          }
          break;
        }
        case GameState.Playing: {
          console.log('@進行遊戲ing');
          navigate('/game');
        }
      }
    }
  };

  useEffect(() => {
    const pre = async () => {
      await roomStore.check(address);
      await roomStore.sync();
    }
    if (address) {
      pre();
    } else {
      roomStore.destory();
    }
  }, [address]);

  useEffect(() => {
    isConnected && handleGameState();
  }, [roomStore.roomInfo?.state, isConnected]);
}

export default useGameInit;
