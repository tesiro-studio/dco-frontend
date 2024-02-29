import { HeroKind } from "@/types";

export class Hero {
  kind: bigint;
  shield: bigint;
  hp: bigint;
  useSkill: bigint;
  maxMana: bigint;
  currentMana: bigint;
  weaponKind: bigint;
  weaponAttack: bigint;
  weaponDurability: bigint;
  cardsPlayedThisTurn: bigint;
  attacked: bigint;
  attackBoostThisTurn: bigint;

  constructor(kind: bigint, mana: bigint) {
    this.kind = kind;
    this.maxMana = mana;
    this.currentMana = mana;
    this.shield = 0n;
    this.useSkill = 1n;
    this.hp = 30n;
    this.weaponKind = 0n;
    this.weaponAttack = 0n;
    this.weaponDurability = 0n;
    this.cardsPlayedThisTurn = 0n;
    this.attacked = 0n;
    this.attackBoostThisTurn = 0n;
  }

  clone() {
    let c = new Hero(this.kind, this.maxMana);
    c.currentMana = this.currentMana;
    c.maxMana = this.maxMana;
    c.shield = this.shield;
    c.hp = this.hp;
    c.useSkill = this.useSkill;
    c.weaponKind = this.weaponKind;
    c.weaponAttack = this.weaponAttack;
    c.weaponDurability = this.weaponDurability;
    c.cardsPlayedThisTurn = this.cardsPlayedThisTurn;
    c.attacked = this.attacked;
    c.attackBoostThisTurn = this.attackBoostThisTurn;

    return c;
  }

  array(): bigint[] {
    return [
      this.kind,
      this.shield,
      this.hp,
      this.useSkill,
      this.maxMana,
      this.currentMana,
      this.weaponKind,
      this.weaponAttack,
      this.weaponDurability,
      this.cardsPlayedThisTurn,
      this.attacked,
      this.attackBoostThisTurn,
    ];
  }

  setWeapon(kind: bigint, attack: bigint, durability: bigint) {
    this.weaponKind = kind;
    this.weaponAttack = attack;
    this.weaponDurability = durability;
    return this;
  }

  costMana(cost: bigint) {
    if (this.currentMana < cost) {
      throw new Error("InsufficientMana");
    }
    this.currentMana -= cost;
  }

  damage(dmg: bigint) {
    const shieldAtk = this.shield > dmg ? dmg : this.shield;
    const hpAtk = dmg - shieldAtk;

    this.shield -= shieldAtk;
    this.hp -= hpAtk;
  }

  totalAttack() {
    return this.weaponAttack + this.attackBoostThisTurn;
  }

  heal(amount: bigint) {
    this.hp += amount;
    if (this.hp > 30n) {
      this.hp = 30n;
    }
  }
}

export function createHero(kind: HeroKind, mana: number) {
  let hero = new Hero(BigInt(kind), BigInt(mana));
  return hero;
}
