import { computed, makeAutoObservable, runInAction, toJS } from "mobx";
import { RootStore } from "./RootStore";
import { getCardRealPosition } from "@/utils/game";
import { CardEventType, CardKind, EffectType } from "@/types";
import { CardAttrs } from "@/constants/cards";
import { findAvailableAttackTarget, findAvailableSkillTarget } from "@/utils/action";

type ExecuterType = {
  revealIndex: string;
  cardId: string;
  isMyHero: boolean;
  isOpHero: boolean;
  x?: number;
  y?: number;
  value?: number;
}

type ExecuteEventType = {
  event: CardEventType,
  effect: EffectType,
  executing: boolean;
  from?: ExecuterType,
  to?: ExecuterType,
  callback?: () => Promise<void>;
}

export class ExecuteStore {
  executer: ExecuteEventType | null = null;

  rootStore: RootStore;
  constructor (rootStore: RootStore) {
    makeAutoObservable(this, {
      rootStore: false,
      availableTargets: computed,
      needSelectTarget: computed,
    });
    this.rootStore = rootStore;
  }

  get availableTargets () {
    if (this.executer?.from && !this.executer?.to) {
      const { cardId } = this.executer.from;
      const { event } = this.executer;
      const { opCardStore, myCardStore } = this.rootStore;
      if (event === CardEventType.Summon) {
        return findAvailableSkillTarget(+cardId, {
          opCards: toJS(opCardStore.boardCards),
          myCards: toJS(myCardStore.boardCards),
        });
      }
      if ([CardEventType.HeroAttack, CardEventType.Attack].includes(event)) {
        return findAvailableAttackTarget({
          opCards: toJS(opCardStore.boardCards),
          myCards: toJS(myCardStore.boardCards),
        });
      }
    }
    return null;
  }

  get needSelectTarget () {
    return this.executer && this.executer.from && !this.executer.to && !this.executer.executing;
  }

  setMyPlayCardEvent (from: Partial<ExecuterType>) {
    const { myCardStore, opCardStore, boardStore } = this.rootStore;
    const { revealIndex = '', cardId = '' } = from;
    const { left, top } = getCardRealPosition(+revealIndex);
    const excuter: ExecuteEventType = {
      from: {
        value: 0,
        revealIndex,
        cardId,
        x: left,
        y: top,
        isMyHero: false,
        isOpHero: false,
      },
      event: CardEventType.Summon,
      effect: EffectType.None,
      executing: true,
    }

    const { needTarget } = CardAttrs[+cardId as CardKind];
    if (needTarget) {
      // need to select a target
      const { defaultValue, myHeroCanSelected, opHeroCanSelected, targets, effect } = findAvailableSkillTarget(+cardId, {
        opCards: toJS(opCardStore.boardCards),
        myCards: toJS(myCardStore.boardCards),
      });
      if (defaultValue) {
        const { revealIndex: toRevealIndex = '' } =  targets.find(target => target.target === +defaultValue) || {};
        excuter.to = {
          value: +defaultValue,
          revealIndex: `${toRevealIndex}`,
          cardId: '',
          isMyHero: defaultValue === myHeroCanSelected,
          isOpHero: defaultValue === opHeroCanSelected,
        }
        excuter.callback = () => boardStore.addMyPlayCardAction(
          { cardId: +(cardId), revealIndex: +(revealIndex) },
          +defaultValue,
        );
      } else {
        excuter.executing = false;
      }
      excuter.effect = effect;
    } else {
      excuter.to = {
        value: 0,
        revealIndex: '',
        cardId: '',
        isMyHero: false,
        isOpHero: false,
      }
    }

    runInAction(() => {
      console.log('@@@@', excuter.to);
      this.executer = excuter
    })
  }

  setMyPlayCardTarget (to: Partial<ExecuterType>) {
    runInAction(() => {
      if (this.executer && this.executer.from) {
        const { boardStore } = this.rootStore;
        const { cardId: fromCardId, revealIndex: fromRevealIndex } = this.executer.from;
        const { isMyHero = false, isOpHero = false, revealIndex = '', cardId = '' } = to;
        let value = 0;
        if (isMyHero) value = +(this.availableTargets?.myHeroCanSelected ?? 0);
        if (isOpHero) value = +(this.availableTargets?.opHeroCanSelected ?? 0);
        if (revealIndex) value = +(this.availableTargets?.targets.find(target => target.revealIndex === +revealIndex)?.target ?? 0);
        this.executer.to = {
          value,
          isMyHero,
          isOpHero,
          revealIndex,
          cardId,
        }
        this.executer.executing = true;
        this.executer.callback = () => boardStore.addMyPlayCardAction(
          { cardId: +fromCardId, revealIndex: +fromRevealIndex },
          value,
        );
      }
    })
  }

  setMyAttackEvent (from: Partial<ExecuterType>) {
    const { myCardStore } = this.rootStore;
    const { revealIndex = '', cardId = '' } = from;
    const position = myCardStore.boardCards.findIndex(card => card.revealIndex === +revealIndex);
    runInAction(() => {
      this.executer = {
        from: {
          value: position,
          revealIndex,
          cardId,
          isMyHero: false,
          isOpHero: false,
        },
        event: CardEventType.Attack,
        effect: EffectType.Attack,
        executing: false,
      }
    })
  }

  setMyAttackTarget (to: Partial<ExecuterType>) {
    runInAction(() => {
      if (this.executer && this.executer.from) {
        const { boardStore, opCardStore } = this.rootStore;
        const { isMyHero = false, isOpHero = false, revealIndex = '', cardId = '' } = to;
        const position = opCardStore.boardCards.findIndex(card => card.revealIndex === +revealIndex);
        this.executer.to = {
          value: isOpHero ? 7 : position,
          isMyHero,
          isOpHero,
          revealIndex,
          cardId,
        }
        this.executer.executing = true;
        this.executer.callback = () => boardStore.addMyAttackAction(
          this.executer?.from?.value ?? 0,
          this.executer?.to?.value ?? 0,
        );
      }
    })
  }

  setOpPlayCardEvent (from: Partial<ExecuterType>, target: number, callback?: () => Promise<void>) {
    const { cardId = '' } = from;
    const { opCardStore, myCardStore } = this.rootStore;
    const { effect, myHeroCanSelected, opHeroCanSelected, targets } = findAvailableSkillTarget(+cardId, {
      opCards: toJS(opCardStore.boardCards),
      myCards: toJS(myCardStore.boardCards),
    }, false);
    const executer: ExecuteEventType = {
      event: CardEventType.Summon,
      effect,
      executing: true,
      callback,
    }
    if (effect !== EffectType.None) {
      console.log('myHeroCanSelected:', myHeroCanSelected);
      console.log('opHeroCanSelected:', opHeroCanSelected);
      const revealIndex = targets.find(t => t.target === target)?.revealIndex ?? '';
      executer.to = {
        revealIndex: `${revealIndex}`,
        cardId: '',
        isMyHero: myHeroCanSelected === `${target}`,
        isOpHero: opHeroCanSelected === `${target}`,
      }
    }
    runInAction(() => {
      console.log('---->', executer);
      this.executer = executer;
    })
    return effect;
  }

  setOpAttackEvent (from: Partial<ExecuterType>, target: number, callback?: () => Promise<void>) {
    const { opCardStore, myCardStore } = this.rootStore;
    const { effect, myHeroCanSelected, opHeroCanSelected, targets } = findAvailableAttackTarget(
      {
        opCards: toJS(opCardStore.boardCards),
        myCards: toJS(myCardStore.boardCards),
      },
      false
    );
    console.log('targets:', targets);
    console.log('myHeroCanSelected:', myHeroCanSelected);
    console.log('opHeroCanSelected:', opHeroCanSelected);
    const revealIndex = targets.find(t => t.target === target)?.revealIndex ?? '';
    runInAction(() => {
      this.executer = {
        event: CardEventType.Attack,
        effect,
        executing: true,
        callback,
        from: {
          revealIndex: from.revealIndex ?? '',
          cardId: from.cardId ?? '',
          isOpHero: from.isOpHero ?? false,
          isMyHero: false,
        },
        to: {
          revealIndex: `${revealIndex}`,
          cardId: '',
          isMyHero: myHeroCanSelected === `${target}`,
          isOpHero: opHeroCanSelected === `${target}`,
        },
      };
    })
  }

  setHeroSkillEvent (isMyHero: boolean, callback?: () => Promise<void>) {
    runInAction(() => {
      this.executer = {
        to: {
          revealIndex: '',
          cardId: '',
          isMyHero,
          isOpHero: !isMyHero,
        },
        event: CardEventType.HeroSkill,
        effect: EffectType.Buff,
        callback,
        executing: true,
      }
      console.log(toJS(this.executer));
    })
  }

  // setHeroAttackEvent (isMyHero: boolean, target: number) {

  // }

  async done () {
    console.log('- done');
    runInAction(async () => {
      await this.executer?.callback?.();
      this.executer = null;
    })
  }
}
