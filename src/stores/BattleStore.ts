import { computed, makeAutoObservable, runInAction, toJS } from "mobx";
import { RootStore } from "./RootStore";
import { PulledCardType } from "@/types";
import { findAvailableTargets, findAvailableVictims } from "@/utils/action";
import { getCardRealPosition } from "@/utils/game";

type CasterCardType = {
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
      console.log('--->', targets);
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

  // async attackerEffectReady () {
  //   const { boardStore, myCardStore } = this.rootStore;
  //   const { card, target } = this.attacker || {};
  //   if (card && this.availableTargets) {
  //     await this.attacker?.callback?.();
  //     const idx = myCardStore.boardCards.findIndex(({ revealIndex }) => card.revealIndex === revealIndex);
  //     await boardStore.addMyAttackAction(idx, target ? +target : +this.availableTargets.defaultValue);
  //     this.action = {
  //       opHero: 
  //     };
  //   }
  // }

  done () {
    runInAction(() => {
      console.log('done', toJS(this.availableTargets));
      this.attacker = null;
      this.caster = null;
      this.availableTargets = null;
    })
  }
}
