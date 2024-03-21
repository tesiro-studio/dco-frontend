import { ShuffledCard, ShuffledCards, ZShuffleWorkerParams, ZShuffleWorkerResponse } from "@/types";
// import workerUrl from './worker?worker&url';
import ZkShuffleWorker from './worker?worker';
import { Hex } from "viem";

const worker = new ZkShuffleWorker();
// const worker = new Worker(new URL(workerUrl, import.meta.url), { type: 'module' });

class ZShuffle {
  callback<T> (_name: string): Promise<T> {
    return new Promise((resolve, reject) => {
      worker.onmessage = (response: MessageEvent<ZShuffleWorkerResponse>) => {
        const { result, error } = response.data;
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    });
  }
  async gen (data: number) {
    worker.postMessage({ type: 'gen', data } as ZShuffleWorkerParams);
    return this.callback('gen');
  }

  async shuffle (data: [bigint, bigint]) {
    worker.postMessage({ type: 'shuffle', data } as ZShuffleWorkerParams);
    return this.callback('shuffle');
  }

  async remaskShuffle (data: [bigint, bigint, ShuffledCards]) {
    worker.postMessage({ type: 'remaskShuffle', data } as ZShuffleWorkerParams);
    return this.callback('remaskShuffle');
  }

  async reveal (data: [Hex, ShuffledCard]) {
    worker.postMessage({ type: 'reveal', data } as ZShuffleWorkerParams);
    return this.callback('reveal');
  }

  async unmask (data: [Hex, ShuffledCard, [bigint, bigint]]) {
    worker.postMessage({ type: 'unmask', data } as ZShuffleWorkerParams);
    return this.callback<number>('unmask');
  }
}

const zhuffle = new ZShuffle();

export default zhuffle;

