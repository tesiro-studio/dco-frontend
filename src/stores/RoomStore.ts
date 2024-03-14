import { computed, makeAutoObservable, observable, runInAction, toJS } from 'mobx'
import tcg from '@/services/tcg';
import { GameState, HeroKind, RoomPlayer } from '@/types';
import { opBNBTestnet } from 'viem/chains';
import { ViewReturnType } from '@/utils/tcgContract';
import { getGameConfig } from '@/utils/game';
import { zeroAddress } from 'viem';
import { RootStore } from './RootStore';
import { db } from '@/db';

export class RoomStore {
  assetsLoaded: boolean = false;
  myHeroSelected: HeroKind = HeroKind.None;

  player: RoomPlayer = { address: zeroAddress, chainId: opBNBTestnet.id };
  roomId!: bigint;
  roomInfo!: ViewReturnType<'roomInfo'>[0] | null;
  fetched: boolean = false;

  rootStore: RootStore;
  constructor (rootStore: RootStore, loaded: boolean = false) {
    makeAutoObservable(this, {
      roomInfo: observable.struct,
      joined: computed,
      matched: computed,
      playing: computed,
      rootStore: false,
    });
    this.rootStore = rootStore;
    this.assetsLoaded = loaded;
  }

  get config () {
    if (this.roomInfo) {
      return getGameConfig(this.roomInfo, this.player.address);
    }
    return null;
  }

  get joined () {
    return this.roomId !== 0n;
  }

  get matched () {
    return this.joined && this.roomInfo?.state !== GameState.WaitingForPlayers;
  }

  get playing () {
    return this.matched && this.roomInfo?.state === GameState.Playing;
  }

  async loadComplete () {
    runInAction(() => {
      this.assetsLoaded = true;
    })
  }

  selecteMyHero (hero: HeroKind) {
    runInAction(() => {
      this.myHeroSelected = hero;
    })
  }

  async check (address = this.player.address, chainId = this.player.chainId) {
    // 初始化roomInfo / roomId
    let roomInfo: ViewReturnType<'roomInfo'>[0] | null = null;
    let roomId: bigint = BigInt(0);
    if (address) {
      try {
        roomId = await tcg.getCurrentRoomId(address);
        roomInfo = await tcg.getCurrentRoomInfo(roomId);
      } catch (error) {
        console.log(error);
      }
      try {
        this.rootStore.zkey = await db.recovery(address, Number(roomId), chainId);
      } catch (error) {
        console.log(error);
      }
    }
    runInAction(() => {
      this.player = { address, chainId };
      this.roomInfo = toJS(roomInfo);
      this.roomId = roomId;
      console.log(roomInfo);
      // this.game = null;
    })
  }

  async sync () {
    let roomInfo: ViewReturnType<'roomInfo'>[0] | null = null;
    if (this.roomId) {
      roomInfo = await tcg.getCurrentRoomInfo(this.roomId);
      runInAction(() => {
        this.roomInfo = roomInfo;
        // if (roomInfo && !this.game) {
        //   this.game = new Game(getGameConfig(roomInfo, this.player.address));
        // }
      })
    }
  }

  destory () {
  }
}
