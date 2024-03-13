import { ActionKind, BoardCardType, CardKind, UploadAction } from "@/types";
import { Action } from "@/model/Game";
import { CardAttrs } from "@/constants/cards";

export const parseRawAction = (rawAction: UploadAction): Action => {
  switch (rawAction.kind) {
    case ActionKind.PlayCard: {
      const action: Action = {
        kind: ActionKind.PlayCard,
        card: Number(rawAction.cardId),
        position: 0,
      }
      action.target = Number(rawAction.params) % 32;
      action.position = Math.floor(Number(rawAction.params) / 32);
      switch (action.card) {
        case CardKind.VoodooDoctor: {
          action.target = 8;
        }
      }
      return action;
    }
    case ActionKind.MinionAttack: {
      return {
        kind: ActionKind.MinionAttack,
        target: Number(rawAction.params) % 32,
        position: Math.floor(Number(rawAction.params) / 32),
      }
    }
    case ActionKind.EndTurn: {
      return { kind: ActionKind.EndTurn };
    }
    case ActionKind.HeroSkill: {
      return { kind: ActionKind.HeroSkill };
    }
  }
  return { kind: ActionKind.Defeat }
};

export const findTraitOps = (cards: BoardCardType[]) => {
  const targets: TargetType[] = [];
  for (const idx in cards) {
    const { attrs: { trait }, revealIndex } = cards[idx];
    if (trait === BigInt(3)) {
      targets.push({
        revealIndex,
        target: +idx,
      })
    }
  }
  return targets;
}

export const findInjuredOps = (cards: BoardCardType[], prefix: number = 0) => {
  const targets: TargetType[] = [];
  for (const idx in cards) {
    const { revealIndex } = cards[idx];
    if (cards[idx].attrs.injured()) {
      targets.push({
        revealIndex,
        target: +idx + prefix,
      })
    }
  }
  return targets;
}

export const findUninjuredOps = (cards: BoardCardType[], prefix: number = 0) => {
  const targets: TargetType[] = [];
  for (const idx in cards) {
    const { revealIndex } = cards[idx];
    if (!cards[idx].attrs.injured()) {
      targets.push({
        revealIndex,
        target: +idx + prefix,
      })
    }
  }
  return targets;
}

export const findAllOps = (cards: BoardCardType[], prefix: number = 0): TargetType[] => {
  return cards.map(({ revealIndex }, idx) => ({ revealIndex, target: idx + prefix }));
}

type TargetType = {
  revealIndex: number;
  target: number;
}

export const findAvailableVictims = (cardId: CardKind, info: { opCards?: BoardCardType[], myCards?: BoardCardType[] }, isMyTurn: boolean = true) => {
  const { myCards = [], opCards = [] } = info;
  const result = {
    myHeroCanSelected: '',
    opHeroCanSelected: '',
    opTargets: [] as TargetType[],
    myTargets: [] as TargetType[],
    defaultValue: '',
    type: '' as 'damage' | 'buff',
  }
  const my = isMyTurn ? myCards : opCards;
  const op = isMyTurn ? opCards : myCards;
  switch (cardId) {
    case CardKind.Charge: {
      result.myTargets = findAllOps(my);
      return result;
    }
    case CardKind.Backstab: {
      result.opTargets = findUninjuredOps(op);
      result.myTargets = findUninjuredOps(my, 7);
      return result;
    }
    case CardKind.Assassinate: {
      result.opTargets = findAllOps(op);
      return result;
    }
    case CardKind.Betrayal: {
      result.opTargets = findAllOps(op);
      return result;
    }
    case CardKind.Eviscerate: {
      result.myHeroCanSelected = '8';
      result.opHeroCanSelected = '0';
      result.opTargets = findAllOps(op, 1);
      result.myTargets = findAllOps(my, 9);
      return result;
    }
    case CardKind.Spellbreaker: {
      // 沈默
      result.opTargets = findTraitOps(op);
      if (result.opTargets.length) {
        return result;
      }
      result.opTargets = findAllOps(op);
      if (result.opTargets.length) {
        return result;
      }
      result.myTargets = findAllOps(my, 7);
      if (result.myTargets.length) {
        return result;
      }
      result.defaultValue = '14';
      return result;
    }
    case CardKind.EarthenRingFarseer:
    case CardKind.VoodooDoctor: {
      // healing
      result.myTargets = findInjuredOps(my, 9);
      result.myHeroCanSelected = '8';
      // if (isMyTurn) {
      //   result.myHeroCanSelected = '8';
      // } else {
      //   result.opHeroCanSelected = '8';
      // }
      if (!result.myTargets.length) {
        result.defaultValue = '8';
      }
      return result;
    }
    case CardKind.ShatteredSunCleric: {
      result.myTargets = findAllOps(my);
      if (!result.myTargets.length) {
        result.defaultValue = '7';
      }
      return result;
    }
    case CardKind.DarkIronDwarf: {
      result.opTargets = findAllOps(op);
      result.myTargets = findAllOps(my, 7);

      if (!result.opTargets.length && !result.myTargets.length) {
        result.defaultValue = '14';
      }
      return result;
    }
    case CardKind.ElvenArcher: {
      // targe: 0, op: 8, my: 0
      result.myHeroCanSelected = '8';
      result.opHeroCanSelected = '0';
      result.opTargets = findAllOps(op, 1);
      result.myTargets = findAllOps(my, 9);
      return result;
    }
    default: {
      result.defaultValue = '0';
      return result;
    }
  }
}

export const findAvailableTargets = (isMyTurn: boolean, info: { opCards?: BoardCardType[], myCards?: BoardCardType[] }) => {
  const { opCards = [], myCards = [] } = info;
  const result = {
    myHeroCanSelected: '',
    opHeroCanSelected: '',
    opTargets: [] as TargetType[],
    myTargets: [] as TargetType[],
    defaultValue: '',
  }
  if (isMyTurn) {
    result.opTargets = findTraitOps(opCards);
    if (!result.opTargets.length) {
      result.opHeroCanSelected = '7';
      result.opTargets = findAllOps(opCards);
    }
    return result;
  }
  result.myTargets = findTraitOps(myCards);
  if (!result.opTargets.length) {
    result.myHeroCanSelected = '7';
    result.myTargets = findAllOps(myCards);
  }
  return result;
}

export const verifyManaEnough = (cardId: CardKind, currentMana: number) => {
  const { cost } = CardAttrs[cardId];
  return currentMana >= cost;
}

export const checkHasTargetCanSelect = (availableTargets?: ReturnType<typeof findAvailableVictims>) => {
  const { myHeroCanSelected, myTargets = [], opHeroCanSelected, opTargets = [] } = availableTargets || {};
  return [
    myHeroCanSelected,
    myTargets.length,
    opHeroCanSelected,
    opTargets.length,
  ].some(Boolean);
}
