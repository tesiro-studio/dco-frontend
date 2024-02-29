import { GameConfigType, HeroKind } from "@/types";
import { ViewReturnType } from "./tcgContract";
import { getPreset } from "@/model/Card";

const findHeroKind = (cards: bigint) => {
  if (getPreset(HeroKind.Rogue) === cards) {
    return HeroKind.Rogue;
  }
  return HeroKind.Warrior;
}

export const getGameConfig = (roomInfo: ViewReturnType<'roomInfo'>[0], address: string): GameConfigType => {
  const myPlayerIndex = roomInfo.player1 === address ? 0 : 1;
  const opPlayerIndex = myPlayerIndex ? 0 : 1;

  const myHeroCards = roomInfo[myPlayerIndex ? 'player2Cards' : 'player1Cards'];
  const opHeroCards = roomInfo[opPlayerIndex ? 'player2Cards' : 'player1Cards'];

  const myHero = findHeroKind(myHeroCards);
  const opHero = findHeroKind(opHeroCards);

  const startWithOp = Boolean((roomInfo.player2sTurnStart && opPlayerIndex) || (!roomInfo.player2sTurnStart && !opPlayerIndex));

  return {
    myAddress: address,
    myHero,
    myPlayerIndex,
    opAddress: opPlayerIndex === 0 ? roomInfo.player1 : roomInfo.player2,
    opHero,
    opPlayerIndex,
    startWithOp,
  };
}

export const getCardRealPosition = (revealIndex: number) => {
  const cardSelector = `[data-index="${revealIndex}"]`;
  const { left, top, width } = document.querySelector(cardSelector)?.getBoundingClientRect() as DOMRect ?? {};
  return { left, top, width };
}
