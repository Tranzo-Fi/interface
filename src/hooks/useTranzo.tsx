import useNotification from "hooks/useNotification";
import { useWeb3React } from "@web3-react/core";
import { truncateAddress } from "utils/address";
import { CHAIN_ID } from "connector";
import { TOKEN_LIST } from "../constants/tokens";
import { BigNumber, ethers } from "ethers";
import { aTokenList, stableDebtTokenList, variableDebtTokenList } from "constants/tokens";
import { TokenType } from "types/token.types";
import useTokens from "./useTokens";
import { useContractCall } from "./useContractCall";
import { Contract, TRANZO_CONTRACT_ADDRESS } from "container/contract";
import { Transaction } from "container/Transaction";
import { Connection } from "container/connection";
import { Global } from "container/global";
import { ExternalLink } from "components/ExternalLink";
import { getEtherscanTxLink } from "utils/link";
import { decreaseByPercent, increaseByPercent } from "utils/format";

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

/**
 * Contract spec 
 *  struct DebtTokenBalance {
        address tokenAddress;
        uint256 stableDebtTokenBalance;
        uint256 variableDebtTokenBalance;
    }

    struct aTokenBalance {
        address Token;
        address aTokenAddress;
        uint256 aTokenBalance;
    }
 *  
 */

const useTranzo = () => {
  const { balances: aTokenBalances } = useTokens(aTokenList, TokenType.AToken);
  const { balances: stableDebtTokenBalances } = useTokens(stableDebtTokenList, TokenType.DebtToken);
  const { balances: variableDebtTokenBalances } = useTokens(variableDebtTokenList, TokenType.DebtToken);
  const { tranzo } = Contract.useContainer();
  const { deactivate } = useWeb3React();
  const { notify } = useNotification();
  const { executeWithGasLimit } = Transaction.useContainer();
  const {
    state: {
      signer: { to: toAccount, from: fromAccount },
    },
    actions: { setConenctTo },
  } = Global.useContainer();
  const { signer, account } = Connection.useContainer();
  const aTokenTranzoList = [] as any[];
  const debtTokenTranzoList = [] as any[];
  // populating aTokens with balance
  aTokenBalances
    .filter((t) => t?.balance?.toString() !== "0")
    .forEach((t) => {
      const token = TOKEN_LIST.find((tk) => tk.symbol === t.symbol);

      if (token && t) {
        const item = [];
        item[0] = token?.tokenAddress;
        item[1] = t.address;
        item[2] = t.balance;
        aTokenTranzoList.push(item);
      }
    });

  stableDebtTokenBalances
    .filter((t) => t?.balance?.toString() !== "0")
    .forEach((t) => {
      const token = TOKEN_LIST.find((tk) => tk.stableDebtTokenAddress === t.address);
      if (!token) return;

      const item = [];
      item[0] = token.tokenAddress;
      item[1] = t.balance;
      item[2] = BigNumber.from(0);
      debtTokenTranzoList.push(item);
    });

  variableDebtTokenBalances
    .filter((t) => t?.balance?.toString() !== "0")
    .forEach((t) => {
      const token = TOKEN_LIST.find((tk) => tk.variableDebtTokenAddress === t.address);
      if (!token) return;

      // if already a stableDebt entry is present modify variableDebt field
      const index = debtTokenTranzoList.findIndex((st) => st[0] === token.tokenAddress);
      if (index !== -1) {
        debtTokenTranzoList[index][2] = t?.balance;
        return;
      }

      // else add a new entry for token with stableDebt zero
      const item = [];
      item[0] = token.tokenAddress;
      item[1] = BigNumber.from(0);
      item[2] = t.balance;
      debtTokenTranzoList.push(item);
    });

  const tranzoTransfer = useContractCall(
    async (recipientAddress: string) => {
      if (account !== fromAccount.address) {
        deactivate();
        setConenctTo(fromAccount.address);
        return;
      }
      const contract = tranzo.attach(TRANZO_CONTRACT_ADDRESS[CHAIN_ID.Kovan]);
      // todo : refactor to handle in line :74
      console.log(0.0001);
      // const modifiedATokenBalanceList = aTokenTranzoList.map((t) => {
      //   t[2] = decreaseByPercent(t[2] as ethers.BigNumber, 0.0001);
      //   return t;
      // });
      // console.log(modifiedATokenBalanceList);
      const receipt = await executeWithGasLimit(contract!.connect(signer), "transferAccount", [
        recipientAddress,
        debtTokenTranzoList,
        aTokenTranzoList,
      ]);
      if (receipt && receipt.transactionHash) {
        notify({
          title: "Transaction Completed!",
          description: <ExternalLink href={getEtherscanTxLink(receipt.transactionHash)}>View Transaction</ExternalLink>,
        });
      }
      return receipt;
    },
    [executeWithGasLimit, signer, tranzo, debtTokenTranzoList, aTokenTranzoList]
  );

  return {
    actions: {
      tranzoTransfer,
    },
  };
};

export default useTranzo;
