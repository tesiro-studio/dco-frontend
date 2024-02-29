import { buildMimcSponge } from 'circomlibjs';

export async function calculateBoardHash(
  opponentHero: bigint[],
  opponentBoard: bigint[][],
  myHero: bigint[],
  myBoard: bigint[][]
) {
  const compressOpponent = compressBoard({
    hero: opponentHero,
    board: opponentBoard,
  });
  let compressMine = compressBoard({
    hero: myHero,
    board: myBoard,
  });

  const boardHash = await calculateMimcSpongeHash([
    ...compressOpponent,
    ...compressMine,
  ]);

  return boardHash;
}

export type BoardInfo = {
  hero: bigint[];
  board: bigint[][];
};

export function decompressBoard(hero: bigint, board4: bigint, board3: bigint) {
  let h: bigint[] = [];
  const hBits = [4, 1, 4, 4, 7, 5, 4, 4, 1, 7, 7, 5];
  for (let i = 0; i < hBits.length; i++) {
    const and = 2 ** hBits[i] - 1;
    const val = hero & BigInt(and);
    h = [val, ...h];
    hero >>= BigInt(hBits[i]);
  }

  let board: bigint[][] = new Array(7).fill([]);
  const bBits = [5, 5, 1, 1, 7, 4, 1, 4, 4, 7, 7, 15];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < bBits.length; j++) {
      const and = 2 ** bBits[j] - 1;
      const val = board4 & BigInt(and);
      board[3 - i] = [val, ...board[3 - i]];
      board4 >>= BigInt(bBits[j]);
    }
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < bBits.length; j++) {
      const and = 2 ** bBits[j] - 1;
      const val = board3 & BigInt(and);
      board[6 - i] = [val, ...board[6 - i]];
      board3 >>= BigInt(bBits[j]);
    }
  }

  return { hero: h, board: board };
}

export function compressBoard(bi: BoardInfo): bigint[] {
  let heroOut = 0n;
  let boardOut4 = 0n;
  let boardOut3 = 0n;

  heroOut = heroOut * 32n + bi.hero[0];
  heroOut = heroOut * 128n + bi.hero[1];
  heroOut = heroOut * 128n + bi.hero[2];
  heroOut = heroOut * 2n + bi.hero[3];
  heroOut = heroOut * 16n + bi.hero[4];
  heroOut = heroOut * 16n + bi.hero[5];
  heroOut = heroOut * 32n + bi.hero[6];
  heroOut = heroOut * 128n + bi.hero[7];
  heroOut = heroOut * 16n + bi.hero[8];
  heroOut = heroOut * 16n + bi.hero[9];
  heroOut = heroOut * 2n + bi.hero[10];
  heroOut = heroOut * 16n + bi.hero[11];
  for (let i = 0; i < 4; i++) {
    boardOut4 = boardOut4 * 32768n + bi.board[i][0];
    boardOut4 = boardOut4 * 128n + bi.board[i][1];
    boardOut4 = boardOut4 * 128n + bi.board[i][2];
    boardOut4 = boardOut4 * 16n + bi.board[i][3];
    boardOut4 = boardOut4 * 16n + bi.board[i][4];
    boardOut4 = boardOut4 * 2n + bi.board[i][5];
    boardOut4 = boardOut4 * 16n + bi.board[i][6];
    boardOut4 = boardOut4 * 128n + bi.board[i][7];
    boardOut4 = boardOut4 * 2n + bi.board[i][8];
    boardOut4 = boardOut4 * 2n + bi.board[i][9];
    boardOut4 = boardOut4 * 32n + bi.board[i][10];
    boardOut4 = boardOut4 * 32n + bi.board[i][11];
  }
  for (let i = 4; i < 7; i++) {
    boardOut3 = boardOut3 * 32768n + bi.board[i][0];
    boardOut3 = boardOut3 * 128n + bi.board[i][1];
    boardOut3 = boardOut3 * 128n + bi.board[i][2];
    boardOut3 = boardOut3 * 16n + bi.board[i][3];
    boardOut3 = boardOut3 * 16n + bi.board[i][4];
    boardOut3 = boardOut3 * 2n + bi.board[i][5];
    boardOut3 = boardOut3 * 16n + bi.board[i][6];
    boardOut3 = boardOut3 * 128n + bi.board[i][7];
    boardOut3 = boardOut3 * 2n + bi.board[i][8];
    boardOut3 = boardOut3 * 2n + bi.board[i][9];
    boardOut3 = boardOut3 * 32n + bi.board[i][10];
    boardOut3 = boardOut3 * 32n + bi.board[i][11];
  }

  return [heroOut, boardOut4, boardOut3];
}

export async function calculateMimcSpongeHash(params: any[]) {
  const mimcSponge = await buildMimcSponge();
  const hash = mimcSponge.multiHash(params);
  return mimcSponge.F.toObject(hash);
}

export function encodeDefeatParam(iWin: boolean) {
  return iWin ? 2n : 1n;
}

export function encodeTargetParam(target: number) {
  return target;
}

export function encodePositionAndTargetParam(position: number, target: number) {
  return position * 32 + target;
}
