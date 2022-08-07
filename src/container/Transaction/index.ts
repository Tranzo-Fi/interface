import React from "react";

import { BigNumber, ethers } from "ethers";
import { Connection } from "container/connection";
import { ContractTransaction } from "@ethersproject/contracts";
import { STORAGE_KEY } from "../../constants/storage";
import { TransactionReceipt } from "@ethersproject/providers";
import { User } from "../user";
import { createContainer } from "unstated-next";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export const Transaction = createContainer(useTransaction);

export enum TransactionAction {
  GENERAL = "general",
  APPROVE = "approve",
}

const { LATEST_TX_DATA } = STORAGE_KEY;
const MAX_RETRY_TIMES = 5;

function useTransaction() {
  const [error, setError] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [receipts, setReceipts] = React.useState<TransactionReceipt[]>([]);
  const [latestTxData, setLatestTxData] = useLocalStorage(LATEST_TX_DATA.name, LATEST_TX_DATA.defaultValue);
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false);
  const {
    state: { address },
  } = User.useContainer();

  const { ethProvider } = Connection.useContainer();
  const provider = ethProvider;

  const resetTxStatus = React.useCallback(() => {
    setIsLoading(false);
    setLatestTxData("");
  }, [setLatestTxData]);

  React.useEffect(() => {
    async function checkReceipt(triedTimes: number) {
      const { txHash } = JSON.parse(latestTxData);
      try {
        const receipt = await provider.getTransactionReceipt(txHash);
        if (receipt) {
          resetTxStatus();
        } else if (triedTimes < MAX_RETRY_TIMES) {
          setTimeout(() => {
            checkReceipt(triedTimes + 1);
          }, 2000);
        } else {
          resetTxStatus();
        }
      } catch (err) {
        resetTxStatus();
      }
    }
    if (!isInitialized) {
      setIsInitialized(true);
      if (latestTxData) {
        setIsLoading(true);
        checkReceipt(0);
      }
    }
  }, [resetTxStatus, isInitialized, latestTxData, provider, setLatestTxData]);

  const userConfirmTx = React.useCallback(
    async (txAction: Promise<ContractTransaction | string>) => {
      let tx, txHash;
      let isRejected = false;
      try {
        setIsLoading(true);
        tx = await txAction;
        txHash = (tx as ContractTransaction).hash;
        setLatestTxData(JSON.stringify({ txHash }));

        console.log(txHash);
      } catch (error: any) {
        if (error.code && error.code === 4001) {
          // user cancelled tx
          isRejected = true;
          console.log("User cancelled tx");
        }
        resetTxStatus();
      }

      return {
        isRejected,
        tx,
        txHash,
      };
    },
    [resetTxStatus, setLatestTxData]
  );

  const execute = React.useCallback(
    async (txAction: Promise<ContractTransaction | string>) => {
      let receipt: TransactionReceipt | null = null;
      const { tx, isRejected, txHash } = await userConfirmTx(txAction);
      if (isRejected) {
        return;
      }
      try {
        receipt = await (tx as ContractTransaction).wait();
        setReceipts((prev) => [...prev, receipt as TransactionReceipt]);
        console.log("receipt", receipt);
      } catch (error) {
        console.log("execute - error", error);
      }

      resetTxStatus();
      return receipt;
    },
    [resetTxStatus, userConfirmTx]
  );

  const executeWithGasLimit = React.useCallback(
    async (contract: ethers.Contract, funcName: string, args: any[]) => {
      const overrides = { from: address };
      const gasLimitRatio = BigNumber.from(2);
      let gasLimit: BigNumber;
      let receipt: TransactionReceipt | undefined | null = null;

      try {
        gasLimit = await contract.estimateGas[funcName](...args, overrides);
        receipt = await execute(contract[funcName](...args, { ...overrides, gasLimit: gasLimitRatio.mul(gasLimit) }));
      } catch (err) {
        console.log("executeWithGasLimit - error", error);
        setError(err);
      }

      return receipt;
    },
    [address, error, execute]
  );
  return {
    error,
    receipts,
    isLoading,
    execute,
    executeWithGasLimit,
  };
}