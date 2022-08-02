import { TokenType } from "./../types/token.types";
import { Connection } from "./../container/connection/index";
import { Transaction } from "../container/Transaction";
import { ethers } from "ethers";
import { useContractCall } from "./useContractCall";
import { Contract } from "container/contract";

function useToken(tokenType: TokenType) {
  const { executeWithGasLimit } = Transaction.useContainer();
  const { signer } = Connection.useContainer();
  const { erc20: ERC20Contract, debtToken } = Contract.useContainer();
  const erc20 = tokenType === TokenType.AToken ? ERC20Contract.eth : debtToken;

  /**
   * Approves a spender to spend
   * @param tokenAddress
   * @param spender
   * @param amount
   */
  const approve = useContractCall(
    async (tokenAddress: string, spender: string, amount: ethers.BigNumber) => {
      const contract = erc20.attach(tokenAddress);
      const receipt = await executeWithGasLimit(contract!.connect(signer), "approve", [spender, amount]);
      return receipt;
    },
    [executeWithGasLimit, signer, erc20]
  );

  return {
    approve,
  };
}

export default useToken;
