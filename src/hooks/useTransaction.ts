import { BigNumber, Contract } from "ethers";

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

export default useTransaction;
