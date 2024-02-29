import { Game, GameConfig } from "@/model/Game";
import { MyCards } from "./MyCards";
import { RoomStore } from "./RoomStore";
import { OpCards } from "./OpCards";
import { ZKey } from "@/types";
import { BoardStore } from "./BoardStore";
import { BattleStore } from "./BattleStore";

export class RootStore {
  roomStore!: RoomStore;
  myCardStore!: MyCards;
  opCardStore!: OpCards;
  boardStore!: BoardStore;
  battleStore!: BattleStore;
  gameStore!: Game;
  zkey!: ZKey | null;

  constructor() {
    this.init();
  }

  async initGame (config: GameConfig) {
    this.gameStore = new Game(config);
  }

  init () {
    this.roomStore = new RoomStore(this);
    this.myCardStore = new MyCards(this);
    this.opCardStore = new OpCards(this);
    this.boardStore = new BoardStore(this);
    this.battleStore = new BattleStore(this);
    this.zkey = null;
  }
}

export const store = new RootStore();
