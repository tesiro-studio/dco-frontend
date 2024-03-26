import { Card } from '@/model/Card';
import { Address, Hex } from 'viem';

export type ZKey = {
  secret: Hex;
  public: Hex;
  publicxy: [Hex, Hex];
}

export type MaskedDeck = Array<{
  card: [Hex, Hex, Hex, Hex];
  proof: Hex;
}>;

export type ShuffledCard = [bigint, bigint, bigint, bigint];
export type ShuffledCards = Array<ShuffledCard>;

export const enum CardRank {
  N,
  R,
  SR,
  SSR
}

export const enum HeroKind {
  None,
  Rogue,
  Warrior,
}

export const enum CardKind {
  None,
  HeroicStrike,
  Whirlwind,
  Charge,
  KingMosh,
  Backstab,
  Assassinate,
  Betrayal,
  Eviscerate,
  EdwinVanCleef,
  GoldshireFootman,
  SenjinShieldmasta,
  FrostwolfGrunt,
  FenCreeper,
  Spellbreaker,
  AcidicSwampOoze,
  Nightblade,
  EarthenRingFarseer,
  VoodooDoctor,
  ShatteredSunCleric,
  PriestessOfElune,
  DarkscaleHealer,
  DarkIronDwarf,
  ElvenArcher,
  FrostwolfWarlord,
  Gorehowl,
}

export const enum GameState {
  WaitingForPlayers,
  WaitingForShuffling,
  WaitingForRevealFirst,
  Playing,
  GameOverWinnerPlayer1,
  GameOverWinnerPlayer2,
  GameOver,
}

export const enum ActionKind {
  PlayCard,
  MinionAttack,
  HeroAttack,
  HeroSkill,
  EndTurn,
  Defeat,
}

export type RoomPlayer = {
  address: Address;
  chainId: number;
}

export type ZShuffleWorkerParams = {
  type: 'gen' | 'shuffle' | 'remaskShuffle' | 'reveal' | 'unmask';
  data: any;
}

export type ZShuffleWorkerResponse = {
  result: any;
  error: string;
}

export type GameConfigType = {
  myAddress: string;
  myHero: HeroKind;
  myPlayerIndex: number;
  opAddress: string;
  opHero: HeroKind;
  opPlayerIndex: number;
  startWithOp: boolean;
}

export type PulledCardType = {
  revealIndex: number;
  cardId: CardKind;
  turn?: number;
}

export type UploadAction = {
  kind: ActionKind;
  cardId: CardKind;
  params: number;
  nthDrawn: number;
  stateHash: Hex;
  rtoken: (Hex | number)[];
};

export type ActionRecord = {
  fromHero: boolean;
  cardId: CardKind;
  action: UploadAction;
  isMyRecord: boolean;
}

export type RToken = {
  card: [Hex, Hex];
  proof: Hex;
}

export type BoardCardType = {
  revealIndex: number;
  attrs: Card;
  turn: number;
}

export const enum CardEventType {
  Summon,
  Attack,
  HeroSkill,
  HeroAttack,
};

export const enum EffectType {
  None,
  Attack,
  SkillAttack,
  Buff,
  Debuff,
  Heal,
};
