import { createContainer } from "unstated-next";
import { BigNumber, Contract } from "ethers";

export const Transaction = createContainer(useTransaction);

function useTransaction() {
  const execute = (
    contract: Contract,
    funcName: string,
    args: any[],
    overrides: Record<string, string>
  ) => {
    return (
      contract[funcName](...args),
      {
        ...overrides,
        gasLimit: BigNumber.from(2_000_000),
      }
    );
  };

  return {
    execute,
  };
}
