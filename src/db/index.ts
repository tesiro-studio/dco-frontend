import Dexie, { Table } from 'dexie';
import { Address } from 'viem/accounts';
import { ShuffledCards, UploadAction, ZKey } from '@/types';

export interface ZKeys {
  id?: number;
  key: ZKey;
  chainId: number;
  address: Address;
  roomId: number;
}

export interface PlayerShuffledCards {
  roomId: number;
  chainId: number;
  address: Address;
  playerIndex: number;
  shuffledCards: ShuffledCards;
}

export interface RoomActions {
  id?: number;
  roomId: number;
  chainId: number;
  turn: number;
  actions: UploadAction[]; 
}

export interface UnmaskCards {
  id?: number;
  roomId: number;
  chainId: number;
  turn: number;
  index: number;
  revealIndex: number;
}

export class DcoDB extends Dexie {
  zkeys!: Table<ZKeys>;
  actions!: Table<RoomActions>;

  constructor() {
    super('dco_frontend_v1');
    this.version(2).stores({
      zkeys: '++id, [chainId+roomId+address], chainId, roomId, address',
      actions: '++id, [chainId+roomId+turn]',
    })
  }

  async recovery (address: Address, roomId: number, chainId: number ) {
    try {
      const [zkey] = await this.zkeys.where({ chainId, roomId, address }).toArray();
      return zkey.key;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async saveActions (turn: number, roomId: number, chainId: number, actions: UploadAction[]) {
    try {
      await this.actions.put({ turn, roomId, chainId, actions });
    } catch (error) {
      console.log(error);
    }
  }

  async getTurnActions (turn: number, roomId: number, chainId: number) {
    try {
      const turnAction = await this.actions.where({ chainId, roomId, turn }).first();
      return turnAction?.actions ?? [];
    } catch (error) {
      return [];
    }
  }
}

export const db = new DcoDB();
