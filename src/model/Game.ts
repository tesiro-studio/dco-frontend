import { calculateMimcSpongeHash, compressBoard } from "@/utils/board";
import { Card } from "./Card";
import { Hero, createHero } from "./Hero";
import { ROGUE_CARDS, WARRIOR_CARDS } from "@/constants/deck";
import { ethers } from "ethers";
import { HeroKind, CardKind, ActionKind } from "@/types";
import { makeAutoObservable } from "mobx";

export class Board {
  myHero: Hero;
  myBoard: Card[];
  opponentHero: Hero;
  opponentBoard: Card[];

  constructor(myClass: HeroKind, opClass: HeroKind) {
    this.myHero = createHero(myClass, 2);
    this.opponentHero = createHero(opClass, 0);
    this.myBoard = new Array(7).fill(new Card(0n, 0n, 0n, 0n, 0n));
    this.opponentBoard = new Array(7).fill(new Card(0n, 0n, 0n, 0n, 0n));
  }

  clone() {
    let c = new Board(0, 0);
    c.myHero = this.myHero.clone();
    c.opponentHero = this.opponentHero.clone();
    c.myBoard = this.myBoard.map((c) => c.clone());
    c.opponentBoard = this.opponentBoard.map((c) => c.clone());

    return c;
  }

  async generateInput() {
    let input = {
      opponentHero: this.opponentHero.array(),
      opponentBoard: this.opponentBoard.map((c) => c.array()),
      myHero: this.myHero.array(),
      myBoard: this.myBoard.map((c) => c.array()),
      compressedOpponentHero: 0n,
      compressedOpponentBoard4: 0n,
      compressedOpponentBoard3: 0n,
      compressedMyHero: 0n,
      compressedMyBoard4: 0n,
      compressedMyBoard3: 0n,
      boardHashBefore: 0n,
    };

    [
      input.compressedOpponentHero,
      input.compressedOpponentBoard4,
      input.compressedOpponentBoard3,
    ] = compressBoard({
      hero: input.opponentHero,
      board: input.opponentBoard,
    });

    [
      input.compressedMyHero,
      input.compressedMyBoard4,
      input.compressedMyBoard3,
    ] = compressBoard({
      hero: input.myHero,
      board: input.myBoard,
    });

    input.boardHashBefore = await calculateMimcSpongeHash([
      input.compressedOpponentHero,
      input.compressedOpponentBoard4,
      input.compressedOpponentBoard3,
      input.compressedMyHero,
      input.compressedMyBoard4,
      input.compressedMyBoard3,
    ]);

    return input;
  }

  async calculateBoardHash() {
    const compressOpponent = compressBoard({
      hero: this.opponentHero.array(),
      board: this.opponentBoard.map((c) => c.array()),
    });
    let compressMine = compressBoard({
      hero: this.myHero.array(),
      board: this.myBoard.map((c) => c.array()),
    });

    const boardHash = await calculateMimcSpongeHash([
      ...compressOpponent,
      ...compressMine,
    ]);

    return boardHash;
  }

  async calculateEndTurnHash() {
    const compressOpponent = compressBoard({
      hero: this.opponentHero.array(),
      board: this.opponentBoard.map((c) => c.array()),
    });
    let compressMine = compressBoard({
      hero: this.myHero.array(),
      board: this.myBoard.map((c) => c.array()),
    });

    const boardHash = await calculateMimcSpongeHash([
      ...compressMine,
      ...compressOpponent,
    ]);

    return boardHash;
  }

  playCard(card: Card, position: number) {
    let emptySlot = 0;
    for (let i = 0; i < 7; i++) {
      if (this.myBoard[i].id === 0n) {
        emptySlot += 1;
      }
    }
    if (emptySlot === 0) {
      throw new Error("BoardIsFull");
    }
    if (position > 6) {
      throw new Error("InvalidPosition");
    }

    this.myBoard.splice(position, 0, card);
    this.myBoard = shiftBoard(this.myBoard);
    this.myBoard.pop();
  }
}

export function getVerifierByCardId(card: number) {
  const cardIdBytes = card.toString(16).padStart(32, "0");
  const cardIdUint8Array = Uint8Array.from(Buffer.from(cardIdBytes, "hex"));
  let id = ethers.toUtf8Bytes("card_");
  id = new Uint8Array([...id, ...cardIdUint8Array]);

  return ethers.keccak256(id);
}

function countTaunt(board: Card[]) {
  let count = 0;
  for (let i = 0; i < board.length; i++) {
    if (board[i].trait === 3n) {
      count += 1;
    }
  }
  return count;
}

function shiftBoard(board: Card[]) {
  let out = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i].id !== 0n) {
      out.push(board[i]);
    }
  }

  const more = board.length - out.length;
  for (let i = 0; i < more; i++) {
    out.push(new Card(0n, 0n, 0n, 0n, 0n));
  }

  return out;
}

function dropWeapon(hero: Hero, attackMinion: boolean) {
  const gorehowlCheck = attackMinion && hero.weaponKind === 2n;

  if (gorehowlCheck) {
    if (hero.weaponAttack > 1n) {
      hero.weaponAttack -= 1n;
    }
  } else {
    const drop = hero.weaponDurability <= 1n;
    if (drop) {
      hero.weaponAttack = 0n;
      hero.weaponKind = 0n;
      hero.weaponDurability = 0n;
    } else {
      hero.weaponDurability -= 1n;
    }
  }
}

function validTarget(card: Card) {
  return card.id !== 0n;
}

function countMinion(card: Card[]) {
  let count = 0;
  for (let i = 0; i < card.length; i++) {
    if (card[i].id !== 0n) {
      count += 1;
    }
  }
  return count;
}

export type GameConfig = {
  myHero: HeroKind;
  opHero: HeroKind;
  startWithOp: boolean;
};

export type Action = {
  kind: ActionKind;
  card?: CardKind;
  position?: number;
  target?: number;
};

export class Game {
  config: GameConfig;
  myCardSet: number[];
  opCardSet: number[];
  board: Board;
  turns: number;
  snapshot: Board | undefined;

  constructor(config: GameConfig) {
    makeAutoObservable(this, {});
    this.config = config;

    if (config.myHero === 1) {
      this.myCardSet = ROGUE_CARDS;
    } else {
      this.myCardSet = WARRIOR_CARDS;
    }
    if (config.opHero === 1) {
      this.opCardSet = ROGUE_CARDS;
    } else {
      this.opCardSet = WARRIOR_CARDS;
    }
    if (config.startWithOp) {
      this.board = new Board(config.opHero, config.myHero);
    } else {
      this.board = new Board(config.myHero, config.opHero);
    }
    this.turns = 1;
  }

  takeSnapshot() {
    this.snapshot = this.board.clone();
  }

  revertToSnapshot() {
    if (this.snapshot === undefined) {
      throw new Error("NoSnapshot");
    }
    this.board = this.snapshot.clone();
  }

  isMyTurn() {
    if (this.config.startWithOp) {
      return this.turns % 2 === 0;
    } else {
      return this.turns % 2 === 1;
    }
  }

  // check if i am defeated
  async isDefeated() {
    if (this.isMyTurn()) {
      return this.board.myHero.hp <= 0n;
    } else {
      return this.board.opponentHero.hp <= 0n;
    }
  }

  async endturn() {
    // swap mine and opponent's
    const mine = this.board.myHero.clone();
    this.board.myHero = this.board.opponentHero.clone();
    this.board.opponentHero = mine;

    this.board.opponentHero.attackBoostThisTurn = 0n;
    this.board.myHero.cardsPlayedThisTurn = 0n;
    this.board.myHero.attackBoostThisTurn = 0n;
    this.board.myHero.maxMana =
      this.board.myHero.maxMana == 10n ? 10n : this.board.myHero.maxMana + 2n;
    this.board.myHero.currentMana = this.board.myHero.maxMana;
    this.board.myHero.attacked = 0n;
    this.board.myHero.useSkill = 1n;

    const myBoard = this.board.myBoard.map((c) => {
      c.tmpAtk = 0n;
      return c.clone();
    });
    this.board.myBoard = this.board.opponentBoard.map((c) => {
      if (c.id !== 0n) {
        c.attacked = 0n;
        c.canAttack = 1n;
        c.tmpAtk = 0n;
      }
      return c.clone();
    });
    this.board.opponentBoard = myBoard;
    this.turns += 1;
  }

  async applyAction(action: Action) {
    const baseInput = await this.board.generateInput();

    this.takeSnapshot();
    // apply action here
    let additionalInput = {};
    try {
      if (action.kind === ActionKind.EndTurn) {
        await this.endturn();
      } else if (action.kind === ActionKind.HeroSkill) {
        await this.handleHeroSkill();
      } else if (action.kind === ActionKind.HeroAttack) {
        additionalInput = await this.handleHeroAttack(action);
      } else if (action.kind === ActionKind.PlayCard) {
        additionalInput = await this.handlePlayCard(action);
      } else if (action.kind === ActionKind.MinionAttack) {
        additionalInput = await this.handleMinionAttack(action);
      }
    } catch (e: any) {
      this.revertToSnapshot();
      throw e;
    }

    return {
      ...baseInput,
      ...additionalInput,
      boardHashAfter: await this.board.calculateBoardHash(),
    };
  }

  async handleHeroSkill() {
    const targetClass = this.isMyTurn()
      ? this.config.myHero
      : this.config.opHero;

    if (this.board.myHero.currentMana < 2n) {
      throw new Error("InsufficientMana");
    }

    this.board.myHero.currentMana -= 2n;
    this.board.myHero.useSkill = 0n;

    if (targetClass === 1) {
      // rogue
      this.board.myHero.weaponAttack = 1n;
      this.board.myHero.weaponKind = 1n;
      this.board.myHero.weaponDurability = 2n;
    } else {
      // warrior
      this.board.myHero.shield += 2n;
    }
  }

  async handlePlayCard(action: Action) {
    let additionalInput = {};
    switch (action.card) {
      case CardKind.HeroicStrike:
        additionalInput = this.handleHeroicStrike(action);
        break;
      case CardKind.Whirlwind:
        additionalInput = this.handleWhirlwind(action);
        break;
      case CardKind.Charge:
        additionalInput = this.handleCharge(action);
        break;
      case CardKind.KingMosh:
        additionalInput = this.handleKingMosh(action);
        break;
      case CardKind.Backstab:
        additionalInput = this.handleBackstab(action);
        break;
      case CardKind.Assassinate:
        additionalInput = this.handleAssassinate(action);
        break;
      case CardKind.Betrayal:
        additionalInput = this.handleBetrayal(action);
        break;
      case CardKind.Eviscerate:
        additionalInput = this.handleEviscerate(action);
        break;
      case CardKind.EdwinVanCleef:
        additionalInput = this.handleEdwinVanCleef(action);
        break;
      case CardKind.GoldshireFootman:
        additionalInput = this.handleGoldshireFootman(action);
        break;
      case CardKind.SenjinShieldmasta:
        additionalInput = this.handleSenjinShieldmasta(action);
        break;
      case CardKind.FrostwolfGrunt:
        additionalInput = this.handleFrostwolfGrunt(action);
        break;
      case CardKind.FenCreeper:
        additionalInput = this.handleFenCreeper(action);
        break;
      case CardKind.Spellbreaker:
        additionalInput = this.handleSpellbreaker(action);
        break;
      case CardKind.AcidicSwampOoze:
        additionalInput = this.handleAcidicSwampOoze(action);
        break;
      case CardKind.Nightblade:
        additionalInput = this.handleNightblade(action);
        break;
      case CardKind.EarthenRingFarseer:
        additionalInput = this.handleEarthenRingFarseer(action);
        break;
      case CardKind.VoodooDoctor:
        additionalInput = this.handleVoodooDoctor(action);
        break;
      case CardKind.ShatteredSunCleric:
        additionalInput = this.handleShatteredSunCleric(action);
        break;
      case CardKind.PriestessOfElune:
        additionalInput = this.handlePriestessOfElune(action);
        break;
      case CardKind.DarkscaleHealer:
        additionalInput = this.handleDarkscaleHealer(action);
        break;
      case CardKind.DarkIronDwarf:
        additionalInput = this.handleDarkIronDwarf(action);
        break;
      case CardKind.ElvenArcher:
        additionalInput = this.handleElvenArcher(action);
        break;
      case CardKind.FrostwolfWarlord:
        additionalInput = this.handleFrostwolfWarlord(action);
        break;
      case CardKind.Gorehowl:
        additionalInput = this.handleGorehowl(action);
        break;
      default:
        throw new Error("InvalidCard");
    }
    return additionalInput;
  }

  handleHeroicStrike(_: Action) {
    this.board.myHero.costMana(2n);

    this.board.myHero.cardsPlayedThisTurn += 1n;
    this.board.myHero.attackBoostThisTurn += 4n;

    return {};
  }
  handleWhirlwind(_: Action) {
    this.board.myHero.costMana(1n);
    this.board.myHero.cardsPlayedThisTurn += 1n;

    this.board.myBoard.forEach((c) => {
      c.damage(1n);
    });
    this.board.opponentBoard.forEach((c) => {
      c.damage(1n);
    });

    return {};
  }
  handleCharge(action: Action) {
    if (
      action.target === undefined ||
      !validTarget(this.board.myBoard[action.target])
    ) {
      throw new Error("InvalidTarget");
    }
    this.board.myHero.costMana(3n);
    this.board.myHero.cardsPlayedThisTurn += 1n;
    this.board.myBoard[action.target].canAttack = 1n;
    this.board.myBoard[action.target].attack += 2n;
    this.board.myBoard[action.target].attackBoost += 2n;

    return { target: action.target };
  }
  handleBackstab(action: Action) {
    if (action.target === undefined) {
      throw new Error("NoTarget");
    }
    if (action.target >= 7) {
      // my minion
      if (
        !validTarget(this.board.myBoard[action.target - 7]) ||
        this.board.myBoard[action.target - 7].injured()
      ) {
        throw new Error("InvalidTarget");
      }
      this.board.myBoard[action.target - 7].damage(2n);
      this.board.myBoard = shiftBoard(this.board.myBoard);
    } else {
      // op minion
      if (
        !validTarget(this.board.opponentBoard[action.target]) ||
        this.board.opponentBoard[action.target].injured()
      ) {
        throw new Error("InvalidTarget");
      }
      this.board.opponentBoard[action.target].damage(2n);
      this.board.opponentBoard = shiftBoard(this.board.opponentBoard);
    }

    this.board.myHero.cardsPlayedThisTurn += 1n;

    return { target: action.target };
  }
  handleAssassinate(action: Action) {
    if (
      action.target === undefined ||
      !validTarget(this.board.opponentBoard[action.target])
    ) {
      throw new Error("InvalidTarget");
    }
    this.board.myHero.costMana(5n);

    this.board.myHero.cardsPlayedThisTurn += 1n;
    this.board.opponentBoard[action.target].destroy();
    this.board.opponentBoard = shiftBoard(this.board.opponentBoard);

    return { target: action.target };
  }
  handleBetrayal(action: Action) {
    if (
      action.target === undefined ||
      !validTarget(this.board.opponentBoard[action.target])
    ) {
      throw new Error("InvalidTarget");
    }
    if (this.board.opponentBoard[action.target].attack === 0n) {
      throw new Error("ZeroAttack");
    }
    this.board.myHero.costMana(2n);

    if (action.target > 0) {
      this.board.opponentBoard[action.target - 1].damage(
        this.board.opponentBoard[action.target].attack
      );
    }
    if (action.target < 6) {
      this.board.opponentBoard[action.target + 1].damage(
        this.board.opponentBoard[action.target].attack
      );
    }
    this.board.opponentBoard = shiftBoard(this.board.opponentBoard);
    this.board.myHero.cardsPlayedThisTurn += 1n;

    return { target: action.target };
  }
  handleEviscerate(action: Action) {
    if (action.target === undefined) {
      throw new Error("NoTarget");
    }
    if (
      action.target > 0 &&
      action.target < 8 &&
      !validTarget(this.board.opponentBoard[action.target - 1])
    ) {
      throw new Error("InvalidTarget");
    }
    if (
      action.target > 8 &&
      action.target < 16 &&
      !validTarget(this.board.myBoard[action.target - 8])
    ) {
      throw new Error("InvalidTarget");
    }

    this.board.myHero.costMana(2n);
    const atk = this.board.myHero.cardsPlayedThisTurn > 0n ? 4n : 2n;
    if (action.target === 0) {
      this.board.opponentHero.damage(atk);
    } else if (action.target === 8) {
      this.board.myHero.damage(atk);
    } else if (action.target > 0 && action.target < 8) {
      this.board.opponentBoard[action.target - 1].damage(atk);
      this.board.opponentBoard = shiftBoard(this.board.opponentBoard);
    } else if (action.target > 8 && action.target < 16) {
      this.board.myBoard[action.target - 8].damage(atk);
      this.board.myBoard = shiftBoard(this.board.myBoard);
    }

    this.board.myHero.cardsPlayedThisTurn += 1n;

    return { target: action.target };
  }
  handleKingMosh(action: Action) {
    if (action.position === undefined) {
      throw new Error("InvalidPosition");
    }
    this.board.myHero.costMana(7n);
    this.board.playCard(new Card(4n, 7n, 6n, 0n, 0n), action.position);
    this.board.myHero.cardsPlayedThisTurn += 1n;
    this.board.myBoard.forEach((c) => {
      if (c.injured()) {
        c.destroy();
      }
    });
    this.board.opponentBoard.forEach((c) => {
      if (c.injured()) {
        c.destroy();
      }
    });

    this.board.myBoard = shiftBoard(this.board.myBoard);
    this.board.opponentBoard = shiftBoard(this.board.opponentBoard);

    return { position: action.position };
  }
  handleEdwinVanCleef(action: Action) {
    if (action.position === undefined) {
      throw new Error("InvalidPosition");
    }
    const boost = 2n * this.board.myHero.cardsPlayedThisTurn;
    this.board.myHero.costMana(3n);
    this.board.playCard(
      new Card(9n, 2n + boost, 2n + boost, 0n, 0n)
        .setAttackBoost(boost)
        .setHpBoost(boost),
      action.position
    );
    this.board.myHero.cardsPlayedThisTurn += 1n;
    return { position: action.position };
  }
  handleGoldshireFootman(action: Action) {
    if (action.position === undefined) {
      throw new Error("InvalidPosition");
    }
    this.board.myHero.costMana(1n);
    this.board.playCard(new Card(10n, 1n, 2n, 3n, 0n), action.position);
    this.board.myHero.cardsPlayedThisTurn += 1n;
    return { position: action.position };
  }
  handleSenjinShieldmasta(action: Action) {
    if (action.position === undefined) {
      throw new Error("InvalidPosition");
    }
    this.board.myHero.costMana(4n);
    this.board.playCard(new Card(11n, 3n, 5n, 3n, 0n), action.position);
    this.board.myHero.cardsPlayedThisTurn += 1n;
    return { position: action.position };
  }
  handleFrostwolfGrunt(action: Action) {
    if (action.position === undefined) {
      throw new Error("InvalidPosition");
    }
    this.board.myHero.costMana(2n);
    this.board.playCard(new Card(12n, 2n, 2n, 3n, 0n), action.position);
    this.board.myHero.cardsPlayedThisTurn += 1n;
    return { position: action.position };
  }
  handleFenCreeper(action: Action) {
    if (action.position === undefined) {
      throw new Error("InvalidPosition");
    }
    this.board.myHero.costMana(5n);
    this.board.playCard(new Card(13n, 3n, 6n, 3n, 0n), action.position);
    this.board.myHero.cardsPlayedThisTurn += 1n;
    return { position: action.position };
  }
  handleSpellbreaker(action: Action) {
    if (action.position === undefined) {
      throw new Error("InvalidPosition");
    }
    if (action.target === undefined || action.target > 14) {
      throw new Error("InvalidTarget");
    }
    this.board.myHero.costMana(4n);
    if (action.target === 14) {
      // no minion
      if (
        countMinion(this.board.myBoard) +
          countMinion(this.board.opponentBoard) !=
        0
      ) {
        throw new Error("MinionExists");
      }
    } else if (action.target > 6) {
      // my minion
      this.board.myBoard[action.target - 7].silent();
    } else {
      // opponent
      this.board.opponentBoard[action.target].silent();
    }
    this.board.playCard(new Card(14n, 4n, 3n, 0n, 0n), action.position);
    this.board.myHero.cardsPlayedThisTurn += 1n;
    return { position: action.position, target: action.target };
  }
  handleAcidicSwampOoze(action: Action) {
    if (action.position === undefined) {
      throw new Error("InvalidPosition");
    }
    this.board.myHero.costMana(2n);
    this.board.opponentHero.weaponAttack = 0n;
    this.board.opponentHero.weaponKind = 0n;
    this.board.opponentHero.weaponDurability = 0n;
    this.board.playCard(new Card(15n, 3n, 2n, 0n, 0n), action.position);
    this.board.myHero.cardsPlayedThisTurn += 1n;
    return { position: action.position };
  }
  handleNightblade(action: Action) {
    if (action.position === undefined) {
      throw new Error("InvalidPosition");
    }
    this.board.myHero.costMana(5n);
    this.board.playCard(new Card(16n, 4n, 4n, 0n, 0n), action.position);
    this.board.opponentHero.damage(3n);
    this.board.myHero.cardsPlayedThisTurn += 1n;
    return { position: action.position };
  }
  handleEarthenRingFarseer(action: Action) {
    if (action.position === undefined) {
      throw new Error("InvalidPosition");
    }
    if (action.target === undefined || action.target > 15) {
      throw new Error("InvalidTarget");
    }

    this.board.myHero.costMana(3n);

    if (action.target === 0) {
      // op hero
      this.board.opponentHero.heal(3n);
    } else if (action.target === 8) {
      // my hero
      this.board.myHero.heal(3n);
    } else if (action.target > 0 && action.target < 8) {
      // op board
      this.board.opponentBoard[action.target - 1].heal(3n);
    } else {
      // my board
      this.board.myBoard[action.target - 9].heal(3n);
    }

    this.board.playCard(new Card(17n, 3n, 3n, 0n, 0n), action.position);
    this.board.myHero.cardsPlayedThisTurn += 1n;
    return { position: action.position, target: action.target };
  }
  handleVoodooDoctor(action: Action) {
    if (action.position === undefined) {
      throw new Error("InvalidPosition");
    }
    if (action.target === undefined || action.target > 15) {
      throw new Error("InvalidTarget");
    }

    this.board.myHero.costMana(1n);
    if (action.target === 0) {
      // op hero
      this.board.opponentHero.heal(2n);
    } else if (action.target === 8) {
      // my hero
      this.board.myHero.heal(2n);
    } else if (action.target > 0 && action.target < 8) {
      // op board
      this.board.opponentBoard[action.target - 1].heal(2n);
    } else {
      // my board
      this.board.myBoard[action.target - 9].heal(2n);
    }

    this.board.playCard(new Card(18n, 2n, 1n, 0n, 0n), action.position);
    this.board.myHero.cardsPlayedThisTurn += 1n;
    return { position: action.position, target: action.target };
  }
  handleShatteredSunCleric(action: Action) {
    if (action.position === undefined) {
      throw new Error("InvalidPosition");
    }
    if (action.target === undefined || action.target > 8) {
      throw new Error("InvalidTarget");
    }

    if (action.target === 7) {
      if (
        countMinion(this.board.myBoard) +
          countMinion(this.board.opponentBoard) !==
        0
      ) {
        throw new Error("MinionExists");
      }
    } else {
      if (!validTarget(this.board.myBoard[action.target])) {
        throw new Error("InvalidTarget");
      }
      this.board.myBoard[action.target].attack += 1n;
      this.board.myBoard[action.target].hp += 1n;
      this.board.myBoard[action.target].maxHp += 1n;
      this.board.myBoard[action.target].attackBoost += 1n;
      this.board.myBoard[action.target].hpBoost += 1n;
    }

    this.board.myHero.costMana(3n);
    this.board.playCard(new Card(19n, 3n, 2n, 0n, 0n), action.position);
    this.board.myHero.cardsPlayedThisTurn += 1n;
    return { position: action.position, target: action.target };
  }
  handlePriestessOfElune(action: Action) {
    if (action.position === undefined) {
      throw new Error("InvalidPosition");
    }
    this.board.myHero.costMana(6n);
    this.board.playCard(new Card(20n, 5n, 4n, 0n, 0n), action.position);
    this.board.myHero.heal(4n);
    this.board.myHero.cardsPlayedThisTurn += 1n;
    return { position: action.position };
  }
  handleDarkscaleHealer(action: Action) {
    if (action.position === undefined) {
      throw new Error("InvalidPosition");
    }
    this.board.myHero.costMana(4n);
    this.board.playCard(new Card(21n, 4n, 5n, 0n, 0n), action.position);
    this.board.myHero.heal(2n);
    this.board.myBoard.forEach((c) => {
      c.heal(2n);
    });
    this.board.myHero.cardsPlayedThisTurn += 1n;
    return { position: action.position };
  }
  handleDarkIronDwarf(action: Action) {
    if (action.position === undefined) {
      throw new Error("InvalidPosition");
    }
    if (action.target === undefined || action.target > 14) {
      throw new Error("InvalidTarget");
    }

    if (action.target === 14) {
      // no minion
      if (
        countMinion(this.board.myBoard) +
          countMinion(this.board.opponentBoard) !==
        0
      ) {
        throw new Error("MinionExists");
      }
    } else if (action.target > 6 && action.target < 14) {
      // my minion
      this.board.myBoard[action.target - 7].tmpAtk += 2n;
    } else {
      // op minion
      this.board.opponentBoard[action.target].tmpAtk += 2n;
    }

    this.board.myHero.costMana(4n);
    this.board.playCard(new Card(22n, 4n, 4n, 0n, 0n), action.position);
    this.board.myHero.cardsPlayedThisTurn += 1n;
    return { position: action.position, target: action.target };
  }
  handleElvenArcher(action: Action) {
    if (action.position === undefined) {
      throw new Error("InvalidPosition");
    }
    if (action.target === undefined || action.target > 15) {
      throw new Error("InvalidTarget");
    }

    if (action.target === 0) {
      // op hero
      this.board.opponentHero.damage(1n);
    } else if (action.target === 8) {
      // my hero
      this.board.myHero.damage(1n);
    } else if (action.target > 8 && action.target < 16) {
      // my minion
      this.board.myBoard[action.target - 9].damage(1n);
    } else {
      // op minion
      this.board.opponentBoard[action.target - 1].damage(1n);
    }

    this.board.myHero.costMana(1n);
    this.board.playCard(new Card(23n, 1n, 1n, 0n, 0n), action.position);
    this.board.myHero.cardsPlayedThisTurn += 1n;
    return { position: action.position, target: action.target };
  }
  handleFrostwolfWarlord(action: Action) {
    if (action.position === undefined) {
      throw new Error("InvalidPosition");
    }
    const boost = BigInt(countMinion(this.board.myBoard));
    this.board.myHero.costMana(5n);
    this.board.playCard(
      new Card(24n, 4n + boost, 4n + boost, 0n, 0n)
        .setAttackBoost(boost)
        .setHpBoost(boost),
      action.position
    );
    this.board.myHero.cardsPlayedThisTurn += 1n;
    return { position: action.position };
  }
  handleGorehowl(_: Action) {
    this.board.myHero.costMana(7n);
    this.board.myHero.weaponKind = 2n;
    this.board.myHero.weaponAttack = 7n;
    this.board.myHero.weaponDurability = 1n;
    this.board.myHero.cardsPlayedThisTurn += 1n;
    return {};
  }

  async handleHeroAttack(action: Action) {
    if (action.target === undefined) {
      throw new Error("NoTarget");
    }

    const isOpHero = action.target === 7;
    const atk = this.board.myHero.totalAttack();

    if (atk === 0n) {
      throw new Error("ZeroAttack");
    }

    const tauntCount = countTaunt(this.board.opponentBoard);

    if (isOpHero) {
      if (tauntCount !== 0) {
        throw new Error("TauntExists");
      }
      this.board.opponentHero.damage(atk);
    } else {
      if (!validTarget(this.board.opponentBoard[action.target])) {
        throw new Error("InvalidTarget");
      }

      const targetTaunt = this.board.opponentBoard[action.target].trait === 3n;
      if (!targetTaunt && tauntCount !== 0) {
        throw new Error("TauntExists");
      }
      this.board.myHero.damage(this.board.opponentBoard[action.target].attack);
      this.board.opponentBoard[action.target].damage(atk);
    }
    dropWeapon(this.board.myHero, !isOpHero);
    this.board.myHero.attacked = 1n;
    this.board.opponentBoard = shiftBoard(this.board.opponentBoard);

    return {
      target: action.target,
    };
  }

  async handleMinionAttack(action: Action) {
    if (action.target === undefined || action.position === undefined) {
      throw new Error("NoTargetOrPosition");
    }
    const isOpHero = action.target === 7;

    if (!validTarget(this.board.myBoard[action.position])) {
      throw new Error("InvalidPosition");
    }
    if (
      this.board.myBoard[action.position].attacked === 1n ||
      this.board.myBoard[action.position].canAttack === 0n
    ) {
      throw new Error("MinionCantAttack");
    }

    const tauntCount = countTaunt(this.board.opponentBoard);
    if (isOpHero) {
      if (tauntCount !== 0) {
        throw new Error("TauntExists");
      }
      this.board.opponentHero.damage(
        this.board.myBoard[action.position].attack +
          this.board.myBoard[action.position].tmpAtk
      );
    } else {
      if (!validTarget(this.board.opponentBoard[action.target])) {
        throw new Error("InvalidTarget");
      }

      const targetTaunt = this.board.opponentBoard[action.target].trait === 3n;
      if (!targetTaunt && tauntCount !== 0) {
        throw new Error("TauntExists");
      }

      const atkMyMinion =
        this.board.myBoard[action.position].attack +
        this.board.myBoard[action.position].tmpAtk;
      const atkOpMinion =
        this.board.opponentBoard[action.target].attack +
        this.board.opponentBoard[action.target].tmpAtk;

      this.board.myBoard[action.position].damage(atkOpMinion);
      this.board.opponentBoard[action.target].damage(atkMyMinion);
    }
    if (this.board.myBoard[action.position].id !== 0n) {
      this.board.myBoard[action.position].attacked = 1n;
      this.board.myBoard[action.position].canAttack = 0n;
    }
    this.board.myBoard = shiftBoard(this.board.myBoard);
    this.board.opponentBoard = shiftBoard(this.board.opponentBoard);

    return { position: action.position, target: action.target };
  }

  setMana(mana: number, current?: number) {
    this.board.myHero.maxMana = BigInt(mana);

    if (current === undefined) {
      this.board.myHero.currentMana = BigInt(mana);
    } else {
      this.board.myHero.currentMana = BigInt(current);
    }
  }
}
