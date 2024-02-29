import { CardAttrs } from "@/constants/cards";
import { ROGUE_CARDS, WARRIOR_CARDS } from "@/constants/deck";
import { HeroKind, CardKind } from "@/types";

export function createCard(card: CardKind, param?: bigint) {
  switch (card) {
    case CardKind.EdwinVanCleef:
      if (param === undefined) {
        throw new Error("EdwinVanCleef needs param");
      }
      return new Card(BigInt(card), 2n + 2n * param, 2n + 2n * param, 0n, 0n)
        .setAttackBoost(2n * param)
        .setHpBoost(2n * param);
    case CardKind.FrostwolfWarlord:
      if (param === undefined) {
        throw new Error("FrostwolfWarlord needs param");
      }
      return new Card(BigInt(card), 4n + param, 4n + param, 0n, 0n)
        .setAttackBoost(param)
        .setHpBoost(param);
    default:
      const { attack, hp, trait, canAttack } = CardAttrs[card];
      return new Card(BigInt(card), BigInt(attack), BigInt(hp), BigInt(trait), BigInt(canAttack));
      // throw new Error("Unknown card");
    // case CardKind.GoldshireFootman:
    //   return new Card(BigInt(card), 1n, 2n, 3n, 0n);
    // case CardKind.SenjinShieldmasta:
    //   return new Card(BigInt(card), 3n, 5n, 3n, 0n);
    // case CardKind.FrostwolfGrunt:
    //   return new Card(BigInt(card), 2n, 2n, 3n, 0n);
    // case CardKind.FenCreeper:
    //   return new Card(BigInt(card), 3n, 6n, 3n, 0n);
    // case CardKind.Spellbreaker:
    //   return new Card(BigInt(card), 4n, 3n, 0n, 0n);
    // case CardKind.AcidicSwampOoze:
    //   return new Card(BigInt(card), 3n, 2n, 0n, 0n);
    // case CardKind.Nightblade:
    //   return new Card(BigInt(card), 4n, 4n, 0n, 0n);
    // case CardKind.EarthenRingFarseer:
    //   return new Card(BigInt(card), 3n, 3n, 0n, 0n);
    // case CardKind.VoodooDoctor:
    //   return new Card(BigInt(card), 2n, 1n, 0n, 0n);
    // case CardKind.ShatteredSunCleric:
    //   return new Card(BigInt(card), 3n, 2n, 0n, 0n);
    // case CardKind.PriestessOfElune:
    //   return new Card(BigInt(card), 5n, 4n, 0n, 0n);
    // case CardKind.DarkscaleHealer:
    //   return new Card(BigInt(card), 4n, 5n, 0n, 0n);
    // case CardKind.DarkIronDwarf:
    //   return new Card(BigInt(card), 4n, 4n, 0n, 0n);
    // case CardKind.ElvenArcher:
    //   return new Card(BigInt(card), 1n, 1n, 0n, 0n);
  }
}

export function getPreset(hero: HeroKind) {
  let out = BigInt(hero);
  let cards: number[] = [];
  if (hero === HeroKind.Rogue) {
    cards = ROGUE_CARDS;
  } else if (hero === HeroKind.Warrior) {
    cards = WARRIOR_CARDS;
  }

  for (let i = 0; i < 20; i++) {
    out = out * BigInt(2 ** 12) + BigInt(cards[i]);
  }

  return out;
}

export function getCard(index: bigint, preset: bigint) {
  let out = 0n;
  for (let i = 0; i < index; i++) {
    preset >>= 12n;
  }
  out = preset & 4095n;
  return out;
}

export class Card {
  id: bigint;
  attack: bigint;
  hp: bigint;
  trait: bigint;
  race: bigint;
  canAttack: bigint;
  tmpAtk: bigint;
  maxHp: bigint;
  silenced: bigint;
  attacked: bigint;
  attackBoost: bigint;
  hpBoost: bigint;

  constructor(
    id: bigint,
    attack: bigint,
    hp: bigint,
    trait: bigint,
    canAttack: bigint
  ) {
    this.id = id;
    this.attack = attack;
    this.hp = hp;
    this.trait = trait;
    this.canAttack = canAttack;
    this.race = 0n;
    this.maxHp = hp;
    this.silenced = 0n;
    this.attacked = 0n;
    this.tmpAtk = 0n;
    this.attackBoost = 0n;
    this.hpBoost = 0n;
  }

  clone() {
    let c = new Card(this.id, this.attack, this.hp, this.trait, this.canAttack);
    c.race = this.race;
    c.maxHp = this.maxHp;
    c.silenced = this.silenced;
    c.attacked = this.attacked;
    c.tmpAtk = this.tmpAtk;
    c.attackBoost = this.attackBoost;
    c.hpBoost = this.hpBoost;

    return c;
  }

  array(): bigint[] {
    return [
      this.id,
      this.attack,
      this.hp,
      this.trait,
      this.race,
      this.canAttack,
      this.tmpAtk,
      this.maxHp,
      this.silenced,
      this.attacked,
      this.attackBoost,
      this.hpBoost,
    ];
  }

  setMaxHp(hp: bigint) {
    this.maxHp = hp;
    return this;
  }

  setAttacked() {
    this.attacked = 1n;
    this.canAttack = 0n;
    return this;
  }

  setCharge() {
    this.canAttack = 1n;
    return this;
  }

  setAttackBoost(boost: bigint) {
    this.attackBoost = boost;
    return this;
  }

  setHpBoost(boost: bigint) {
    this.hpBoost = boost;
    return this;
  }

  setTmpAtk(atk: bigint) {
    this.tmpAtk = atk;
    return this;
  }

  injured() {
    return this.maxHp !== this.hp;
  }

  damage(dmg: bigint) {
    if (this.id === 0n) {
      return;
    }

    if (this.hp <= dmg) {
      this.destroy();
    } else {
      this.hp -= dmg;
    }
  }

  silent() {
    this.trait = 0n;
    this.attack = this.attack - this.attackBoost;
    this.tmpAtk = 0n;

    const originalHp = this.maxHp - this.hpBoost;
    if (this.hp > originalHp) {
      this.hp = originalHp;
    }
    this.maxHp = originalHp;
    this.attackBoost = 0n;
    this.hpBoost = 0n;
  }

  destroy() {
    this.id = 0n;
    this.attack = 0n;
    this.hp = 0n;
    this.trait = 0n;
    this.race = 0n;
    this.canAttack = 0n;
    this.tmpAtk = 0n;
    this.maxHp = 0n;
    this.silenced = 0n;
    this.attacked = 0n;
    this.attackBoost = 0n;
    this.hpBoost = 0n;
  }

  heal(amount: bigint) {
    this.hp += amount;
    if (this.hp > this.maxHp) {
      this.hp = this.maxHp;
    }
  }
}
