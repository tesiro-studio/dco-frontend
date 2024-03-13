import { computed, makeAutoObservable, runInAction, toJS } from "mobx";
import { RootStore } from "./RootStore";
import { PulledCardType } from "@/types";
import { findAvailableTargets, findAvailableVictims } from "@/utils/action";
import { getCardRealPosition } from "@/utils/game";

export type CasterCardType = {
  top: number;
  left: number;
  card: PulledCardType;
  target: string;
  from: 'my' | 'op',
  callback?: () => void;
}

export type AttackerType = {
  card: PulledCardType;
  target: string;
  from: 'my' | 'op',
  callback?: () => void;
}

export class BattleStore {
  attacker: AttackerType | null = null;
  caster: CasterCardType | null = null;
  buff: string | 'my' | 'op' = '';

  availableTargets: ReturnType<typeof findAvailableVictims> | null = null;

  rootStore: RootStore;
  constructor (rootStore: RootStore) {
    makeAutoObservable(this, {
      opHeroCanSelect: computed,
      myHeroCanSelect: computed,
      rootStore: false,
    });
    this.rootStore = rootStore;
  }

  get opHeroCanSelect () {
    return Boolean(this.availableTargets?.opHeroCanSelected)
  }

  get myHeroCanSelect () {
    return Boolean(this.availableTargets?.myHeroCanSelected)
  }

  setAttacker (card: PulledCardType, from: 'my' | 'op') {
    const { opCardStore, myCardStore, gameStore } = this.rootStore;
    runInAction(() => {
      this.buff = '';
      this.caster = null;
      this.attacker = {
        card,
        target: '',
        from,
        callback: () => {},
      }
      const targets = findAvailableTargets(
        gameStore.isMyTurn(),
        {
          opCards: toJS(opCardStore.boardCards),
          myCards: toJS(myCardStore.boardCards),
        }
      )
      this.setTargets(targets);
    })
  }

  setCaster (card: PulledCardType, from: 'my' | 'op') {
    const { opCardStore, myCardStore, gameStore } = this.rootStore;
    runInAction(() => {
      const { left, top } = getCardRealPosition(card.revealIndex);
      this.buff = '';
      this.attacker = null;
      this.caster = {
        left,
        top,
        card,
        target: '',
        from,
        callback: () => {},
      };

      const targets = findAvailableVictims(card.cardId, 
        {
          opCards: toJS(opCardStore.boardCards),
          myCards: toJS(myCardStore.boardCards),
        },
        gameStore.isMyTurn()
      )
      this.setTargets(targets);
    })
  }

  setCasterCallback (callback: () => void) {
    runInAction(() => {
      if (this.caster) {
        this.caster.callback = callback;
      }
    })
  }

  setTargets (targets: ReturnType<typeof findAvailableVictims>) {
    runInAction(() => {
      this.availableTargets = targets;
    })
  }

  confirmTarget (target: string) {
    runInAction(() => {
      if (this.caster && !this.caster.target) {
        this.caster.target = `${target}`;
      }
      if (this.attacker && !this.attacker.target) {
        this.attacker.target = `${target}`;
      }
    })
  }

  async casterEffectReady () {
    const { boardStore } = this.rootStore;
    const { card, target } = this.caster || {};
    if (card && this.availableTargets) {
      await this.caster?.callback?.();
      await boardStore.addMyPlayCardAction(card, target ? +target : +this.availableTargets.defaultValue);
    }
  }

  async setBuff (target: string | 'my' | 'op') {
    runInAction(() => {
      this.done();
      this.buff = target;
    })
  }

  done () {
    runInAction(() => {
      this.attacker = null;
      this.caster = null;
      this.availableTargets = null;
      this.buff = '';
    })
  }
}
