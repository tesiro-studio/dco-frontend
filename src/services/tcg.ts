import { waitForTransactionReceipt } from 'wagmi/actions';

import { config } from '@/constants/config';
import { GameState, HeroKind, RToken, ShuffledCards, UploadAction, ZKey } from "@/types";
import { getPreset } from "@/model/Card";
import { Address } from "viem/accounts";
import { db } from '@/db';
import { write, read, watch, ViewReturnType} from '@/utils/tcgContract';
import { CARD_NUMBER } from '@/constants/deck';
import zhuffle from '@/workers/zshuffle';
import { opBNBTestnet } from 'wagmi/chains';

class TCG {
  // key: ZKey | null = null;

  async joinGame (address: Address, heroKind: HeroKind, chainId: number) {
    const zkey = await zhuffle.gen(CARD_NUMBER) as ZKey;
    const txHash = await write(
      'joinGame',
      [
        getPreset(heroKind),
        {
          x: zkey.publicxy[0],
          y: zkey.publicxy[1],
        }
      ]
    );
    const receipt = await waitForTransactionReceipt(config, { hash: txHash });
    const roomId = await read('currentRoom', [address]) as unknown as ViewReturnType<'currentRoom'>[0];
    console.log('-- join game:', roomId, receipt, zkey);

    await db.zkeys.put({ chainId, address, roomId: Number(roomId), key: zkey });
  }

  async getCurrentRoomId (address: Address) {
    const roomId = await read('currentRoom', [address]) as unknown as ViewReturnType<'currentRoom'>[0];
    console.log('roomId:', roomId);
    return roomId
  }

  async getCurrentRoomInfo (roomId: bigint) {
    const roomInfo = await read('roomInfo', [roomId]) as unknown as ViewReturnType<'roomInfo'>[0];
    return roomInfo;
  }

  async verifyShuffle (roomPk2x: bigint, roomPk2y: bigint, shuffledCards?: ShuffledCards) {
    try {
      let shuffleResult = [];
      if (shuffledCards) {
        shuffleResult = await zhuffle.remaskShuffle([roomPk2x, roomPk2y, shuffledCards]) as any[];
      } else {
        shuffleResult = await zhuffle.shuffle([roomPk2x, roomPk2y]) as any[];
      }
      console.log('--->', shuffleResult);
      const txHash = await write('verifyShuffle', shuffleResult);
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });
      console.log('verifyShuffle:', receipt);
    } catch (error) {
      console.log(error);
    }
  }

  async getShuffledCards (roomId: bigint, playerIndex: number): Promise<ShuffledCards> {
    try {
      return await read('getShuffledCards', [roomId, BigInt(playerIndex)]) as unknown as ShuffledCards;
    } catch (error) {
      console.log(error);
    }
    return [] as ShuffledCards;
  }

  async revealStart (key: ZKey, roomId: bigint, playerIndex: number, isPlayFirst: boolean) {
    try {
      const cards = await this.getShuffledCards(roomId, playerIndex);
      for (const idx in cards.slice(0, 4)) {
        const rToken = await zhuffle.reveal([key.secret, cards[idx]]) as { card: [bigint, bigint], proof: string };
        console.log(+idx + (isPlayFirst ? 4 : 0), rToken);
        // revealStart(uint256 index, (uint256[2] card, bytes proof))
        await write('revealStart', [BigInt(+idx + (isPlayFirst ? 4 : 0)), rToken]);
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getActions (roomId: bigint, turn: bigint) {
    try {
      console.log('get action:', roomId, turn);
      let actions = await db.getTurnActions(Number(turn), Number(roomId), opBNBTestnet.id);
      if (!actions.length) {
        actions = await read('getActions', [roomId, turn]) as unknown as UploadAction[];
        db.saveActions(Number(turn), Number(roomId), opBNBTestnet.id, actions);
      }
      return actions;
    } catch (error) {
      console.log(error);
    }
    return [];
  }

  async getRevealCard (roomId: bigint, index: number) {
    try {
      const card = await read('getRevealCard', [roomId, BigInt(index)]) as unknown as ViewReturnType<'getRevealCard'>[0];
      return card;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async uploadActions (actions: UploadAction[], rToken: RToken) {
    try {
      await write('uploadActions', [actions, rToken]);
      return true;
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  async quitGame () {
    try {
      await write('quitGame', []);
    } catch (error) {
      console.log(error);
    }
  }

  watchGameStart (callback: (roomId: bigint) => void) {
    const unwatch = watch(
      'GameStart',
      (logs) => {
        const [log] = logs;
        // log.eventName; 'GameStart'
        // log.args.player1
        // log.args.player2
        // log.args.roomId
        // log.startWithPlayer2
        console.log(log.eventName);
        console.log(log.args.player1);
        console.log(log.args.player2);
        console.log(log.args.roomId);
        console.log(log.startWithPlayer2);
        callback(log.args.roomId);
      })
    return unwatch;
  }

  watchGameOver (callback: (roomId: bigint, winner: Address) => void) {
    const unwatch = watch(
      'GameOver',
      (logs) => {
        const [log] = logs;
        console.log('GameOver:', log);
        callback(log.args.roomId, log.args.winner)
        // log.eventName; 'GameStart'
        // log.args.player1
        // log.args.player2
        // log.args.roomId
        // log.startWithPlayer2
      })
    return unwatch;
  }

  watchTurnStart (callback: (roomId: bigint, turn: bigint) => void) {
    const unwatch = watch(
      'StartTurn',
      (logs) => {
        const [log] = logs;
        callback(log.args.roomId, log.args.turn);
        // const [log] = logs;
        // log.eventName; 'GameStart'
        // log.args.player1
        // log.args.player2
        // log.args.roomId
        // log.startWithPlayer2
      })
    return unwatch;
  }

  watchShuffleVerified (roomId: bigint, playerIndex: number, callback: () => void) {
    const timer = setInterval(async () => {
      const roomInfo = await this.getCurrentRoomInfo(roomId);
      if (roomInfo.shuffleVerified[playerIndex]) {
        console.log('watchShuffleVerified', roomInfo.shuffleVerified);
        callback();
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }

  watchShuffleRemasked (roomId: bigint, callback: () => void) {
    const timer = setInterval(async () => {
      const roomInfo = await this.getCurrentRoomInfo(roomId);
      if (roomInfo.shuffleRemasked[0] && roomInfo.shuffleRemasked[1]) {
        console.log('watchShuffleRemasked', roomInfo.shuffleRemasked, roomInfo.state);
        callback();
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }

  watchReveal (roomId: bigint, callback: () => void) {
    const timer = setInterval(async () => {
      const roomInfo = await this.getCurrentRoomInfo(roomId);
      if (roomInfo.shuffleRemasked[0] && roomInfo.shuffleRemasked[1]) {
        console.log('watchReveal', roomInfo.state);
        if (roomInfo.state === GameState.Playing) {
          callback();
          clearInterval(timer);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }
}

export default new TCG();
