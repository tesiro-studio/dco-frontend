import { Game, GameConfig } from "@/model/Game";
import { MyCards } from "./MyCards";
import { RoomStore } from "./RoomStore";
import { OpCards } from "./OpCards";
import { ZKey } from "@/types";
import { BoardStore } from "./BoardStore";
import { ExecuteStore } from "./ExecuteStore";

export class RootStore {
  roomStore!: RoomStore;
  myCardStore!: MyCards;
  opCardStore!: OpCards;
  boardStore!: BoardStore;
  executeStore!: ExecuteStore;
  gameStore!: Game;
  zkey!: ZKey | null;

  constructor() {
    this.init();
  }

  async initGame (config: GameConfig) {
    this.gameStore = new Game(config);
  }

  init () {
    // this.roomStore = new RoomStore(this);
    this.roomStore = new RoomStore(this, this.roomStore?.assetsLoaded);
    this.myCardStore = new MyCards(this);
    this.opCardStore = new OpCards(this);
    this.boardStore = new BoardStore(this);
    this.executeStore = new ExecuteStore(this);
    this.zkey = null;
  }
}

export const store = new RootStore();
