import { ActionKind, BoardCardType, CardKind, EffectType, UploadAction } from "@/types";
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
    case ActionKind.HeroAttack: {
      return {
        kind: ActionKind.HeroAttack,
        card: 0,
        target: Number(rawAction.params),
        position: 0,
      };
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
    type: '',
  }
  const my = isMyTurn ? myCards : opCards;
  const op = isMyTurn ? opCards : myCards;
  switch (cardId) {
    case CardKind.Charge: {
      result.type = 'buff';
      result.myTargets = findAllOps(my);
      return result;
    }
    case CardKind.Backstab: {
      result.type = 'damage';
      result.opTargets = findUninjuredOps(op);
      result.myTargets = findUninjuredOps(my, 7);
      return result;
    }
    case CardKind.Assassinate: {
      result.type = 'damage';
      result.opTargets = findAllOps(op);
      return result;
    }
    case CardKind.Betrayal: {
      result.type = 'damage';
      result.opTargets = findAllOps(op);
      return result;
    }
    case CardKind.Eviscerate: {
      result.type = 'damage';
      result.myHeroCanSelected = '8';
      result.opHeroCanSelected = '0';
      result.opTargets = findAllOps(op, 1);
      result.myTargets = findAllOps(my, 9)
      return result;
    }
    case CardKind.Spellbreaker: {
      result.type = 'debuff';
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
      result.type = 'buff';
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
      result.type = 'buff';
      result.myTargets = findAllOps(my);
      if (!result.myTargets.length) {
        result.defaultValue = '7';
      }
      return result;
    }
    case CardKind.DarkIronDwarf: {
      result.type = 'buff';
      result.opTargets = findAllOps(op);
      result.myTargets = findAllOps(my, 7);

      if (!result.opTargets.length && !result.myTargets.length) {
        result.defaultValue = '14';
      }
      return result;
    }
    case CardKind.ElvenArcher: {
      result.type = 'damage';
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
    type: '',
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

export const findAvailableSkillTarget = (cardId: CardKind, info: { opCards?: BoardCardType[], myCards?: BoardCardType[] }, isMyTurn: boolean = true) => {
  const { myCards = [], opCards = [] } = info;
  const result = {
    myHeroCanSelected: '',
    opHeroCanSelected: '',
    targets: [] as TargetType[],
    defaultValue: '',
    effect: EffectType.None,
  }
  const my = isMyTurn ? myCards : opCards;
  const op = isMyTurn ? opCards : myCards;
  switch (cardId) {
    case CardKind.Charge: {
      result.effect = EffectType.Buff;
      result.targets = findAllOps(my);
      return result;
    }
    case CardKind.Backstab: {
      result.effect = EffectType.SkillAttack;
      result.targets = findUninjuredOps(op).concat(findUninjuredOps(my, 7));
      return result;
    }
    case CardKind.Assassinate: {
      result.effect = EffectType.SkillAttack;
      result.targets = findAllOps(op);
      return result;
    }
    case CardKind.Betrayal: {
      result.effect = EffectType.SkillAttack;
      result.targets = findAllOps(op);
      return result;
    }
    case CardKind.Eviscerate: {
      result.effect = EffectType.SkillAttack;
      result.myHeroCanSelected = '8';
      result.opHeroCanSelected = '0';
      result.targets = findAllOps(op, 1).concat(findAllOps(my, 9));
      return result;
    }
    case CardKind.Spellbreaker: {
      result.effect = EffectType.Debuff;
      // 沈默
      result.targets = findTraitOps(op);
      if (result.targets.length) {
        return result;
      }
      result.targets = findAllOps(op);
      if (result.targets.length) {
        return result;
      }
      result.targets = findAllOps(my, 7);
      if (result.targets.length) {
        return result;
      }
      result.effect = EffectType.None;
      result.defaultValue = '14';
      return result;
    }
    case CardKind.EarthenRingFarseer:
    case CardKind.VoodooDoctor: {
      // healing
      result.effect = EffectType.Heal;
      result.targets = findInjuredOps(my, 9);
      if (isMyTurn) {
        result.myHeroCanSelected = '8';
      } else {
        result.opHeroCanSelected = '8';
      }
      if (!result.targets.length) {
        result.defaultValue = '8';
      }
      return result;
    }
    case CardKind.ShatteredSunCleric: {
      result.effect = EffectType.Buff;
      result.targets = findAllOps(my);
      if (!result.targets.length) {
        result.defaultValue = '7';
      }
      return result;
    }
    case CardKind.DarkIronDwarf: {
      result.effect = EffectType.Buff;
      result.targets = findAllOps(op).concat(findAllOps(my, 7));
      if (!result.targets.length) {
        result.effect = EffectType.None;
        result.defaultValue = '14';
      }
      return result;
    }
    case CardKind.ElvenArcher: {
      result.effect = EffectType.SkillAttack;
      // targe: 0, op: 8, my: 0
      result.myHeroCanSelected = isMyTurn ? '8' : '0';
      result.opHeroCanSelected = isMyTurn ? '0' : '8';
      result.targets = findAllOps(op, 1).concat(findAllOps(my, 9));
      return result;
    }
    default: {
      result.defaultValue = '0';
      return result;
    }
  }
}

export const findAvailableAttackTarget = (info: { opCards?: BoardCardType[], myCards?: BoardCardType[] }, isMyTurn: boolean = true) => {
  const { opCards = [], myCards = [] } = info;
  const result = {
    myHeroCanSelected: '',
    opHeroCanSelected: '',
    targets: [] as TargetType[],
    defaultValue: '',
    effect: EffectType.Attack,
  }
  result.targets = isMyTurn ? findTraitOps(opCards) : findTraitOps(myCards);
  if (!result.targets.length) {
    if (isMyTurn) {
      result.opHeroCanSelected = '7';
      result.targets = findAllOps(opCards);
    } else {
      result.myHeroCanSelected = '7';
      result.targets = findAllOps(myCards);
    }
  }
  return result;
}

export const getEffectShadowColor = (effect: EffectType) => {
  switch (effect) {
    case EffectType.Attack:
    case EffectType.SkillAttack:
      return 'drop-shadow(0px 2px 10px #E82424)';
    case EffectType.Buff:
    case EffectType.Debuff:
    case EffectType.Heal:
      return 'drop-shadow(0px 1px 6px #34eb55)';
    default:
      return 'drop-shadow(2px 4px 10px #000000)';
  }
}