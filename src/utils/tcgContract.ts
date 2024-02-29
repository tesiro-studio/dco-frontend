import { readContract, writeContract, watchContractEvent } from 'wagmi/actions';
import { ExtractAbiFunctionNames, ExtractAbiEventNames, AbiParametersToPrimitiveTypes, ExtractAbiFunction } from 'abitype';

import { config } from '@/constants/config';
import TCG_MAIN_ABI from '@/abis/TCGMain';
import TCG_VIEW_ABI from '@/abis/TCGView';
import { TCG_CONTRACTS } from '@/constants/contract';

export type MainEventNames = ExtractAbiEventNames<typeof TCG_MAIN_ABI>;
export type ViewFuctionNames = ExtractAbiFunctionNames<typeof TCG_VIEW_ABI, 'pure' | 'view'>;
export type MainFuctionNames = ExtractAbiFunctionNames<typeof TCG_MAIN_ABI, 'payable' | 'nonpayable'>;
export type ViewReturnType<T extends ViewFuctionNames> = AbiParametersToPrimitiveTypes<ExtractAbiFunction<typeof TCG_VIEW_ABI, T>['outputs'], 'outputs'>

export const write = async (functionName: MainFuctionNames, args: (string | bigint | Record<string, any>)[]) => {
  return writeContract(config, {
    abi: TCG_MAIN_ABI,
    address: TCG_CONTRACTS.Main,
    functionName,
    args: args as any,
  })
}

export const read = async (functionName: ViewFuctionNames, args: (string | bigint | Record<string, any>)[]) => {
  return readContract(config, {
    abi: TCG_VIEW_ABI,
    address: TCG_CONTRACTS.Main,
    functionName,
    args: args as any,
  });
}

export const watch = (eventName: MainEventNames, callback: (logs: any) => void) => {
  const unwatch = watchContractEvent(config, {
    address: TCG_CONTRACTS.Main,
    abi: TCG_MAIN_ABI,
    eventName,
    // args: { 
    //   to: '0xd2135CfB216b74109775236E36d4b433F1DF507B', 
    // }, 
    onLogs: callback,
  })
  return unwatch;
}