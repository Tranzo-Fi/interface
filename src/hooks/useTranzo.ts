import { truncateAddress } from "utils/address";
import { CHAIN_ID } from "connector";
import { TOKEN_LIST } from "./../constants/tokens";
import { BigNumber } from "ethers";
import { aTokenList, stableDebtTokenList, variableDebtTokenList } from "constants/tokens";
import { TokenType } from "types/token.types";
import useTokens from "./useTokens";
import { useContractCall } from "./useContractCall";
import { Contract, TRANZO_CONTRACT_ADDRESS } from "container/contract";
import { Transaction } from "container/Transaction";
import { Connection } from "container/connection";
import { Global } from "container/global";

interface aTokenTranzoItem {
  tokenAddress: string;
  aTokenAddress: string;
  aTokenBalance: BigNumber;
}

interface debtTokenTranzoItem {
  tokenAddress: string;
  stableDebtTokenBalance: BigNumber;
  variableDebtTokenBalance: BigNumber;
}

const useTranzo = () => {
  const { balances: aTokenBalances } = useTokens(aTokenList, TokenType.AToken);
  const { balances: stableDebtTokenBalances } = useTokens(stableDebtTokenList, TokenType.DebtToken);
  const { balances: variableDebtTokenBalances } = useTokens(variableDebtTokenList, TokenType.DebtToken);
  const { tranzo } = Contract.useContainer();
  const { executeWithGasLimit } = Transaction.useContainer();
  const {
    state: {
      signer: { from: fromAccount },
    },
  } = Global.useContainer();
  const { signer } = Connection.useContainer();
  const aTokenTranzoList = [] as aTokenTranzoItem[];
  const debtTokenTranzoList = [] as debtTokenTranzoItem[];
  // populating aTokens with balance
  aTokenBalances
    .filter((t) => t?.balance?.toString() !== "0")
    .forEach((t) => {
      const token = TOKEN_LIST.find((tk) => tk.symbol === t.symbol);

      if (token) {
        aTokenTranzoList.push({
          tokenAddress: token?.tokenAddress,
          aTokenAddress: t.address,
          aTokenBalance: t.balance,
        });
      }
    });

  stableDebtTokenBalances
    .filter((t) => t?.balance?.toString() !== "0")
    .forEach((t) => {
      const token = TOKEN_LIST.find((tk) => tk.stableDebtTokenAddress === t.address);
      if (!token) return;

      debtTokenTranzoList.push({
        tokenAddress: token.tokenAddress,
        stableDebtTokenBalance: t.balance,
        variableDebtTokenBalance: BigNumber.from(0),
      });
    });

  variableDebtTokenBalances
    .filter((t) => t?.balance?.toString() !== "0")
    .forEach((t) => {
      const token = TOKEN_LIST.find((tk) => tk.variableDebtTokenAddress === t.address);
      if (!token) return;

      // if already a stableDebt entry is present modify variableDebt field
      const index = debtTokenTranzoList.findIndex((st) => st.tokenAddress === token.tokenAddress);
      if (index !== -1) {
        debtTokenTranzoList[index].variableDebtTokenBalance = t?.balance;
        return;
      }

      // else add a new entry for token with stableDebt zero
      debtTokenTranzoList.push({
        tokenAddress: token.tokenAddress,
        variableDebtTokenBalance: t.balance,
        stableDebtTokenBalance: BigNumber.from(0),
      });
    });

  const tranzoTransfer = useContractCall(
    async (recipientAddress: string) => {
      const currentWalletAddress = await signer.getAddress();
      if (currentWalletAddress !== fromAccount.address) {
        alert(`Please switch to ${truncateAddress(fromAccount.address)}`);
        return;
      }
      console.log("tranzo", TRANZO_CONTRACT_ADDRESS[CHAIN_ID.Kovan]);

      const contract = tranzo.attach(TRANZO_CONTRACT_ADDRESS[CHAIN_ID.Kovan].toString());
      console.log(contract);
      console.log(signer);
      const receipt = await executeWithGasLimit(contract!.connect(signer), "transferAccount", [
        recipientAddress,
        aTokenTranzoList,
        debtTokenTranzoList,
      ]);
      return receipt;
    },
    [executeWithGasLimit, signer, fromAccount, tranzo]
  );

  return {
    actions: {
      tranzoTransfer,
    },
  };
};

export default useTranzo;
