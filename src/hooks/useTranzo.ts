import { truncateAddress } from "utils/address";
import { CHAIN_ID } from "connector";
import { TOKEN_LIST } from "./../constants/tokens";
import { BigNumber, ethers } from "ethers";
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
  const CONTRACT_ABI = [
    {
      inputs: [{ internalType: "address", name: "_addressProvider", type: "address" }],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "address", name: "_from", type: "address" },
        { indexed: true, internalType: "address", name: "_assetAddress", type: "address" },
        { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "LogWithdraw",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
        { indexed: true, internalType: "address", name: "newOwner", type: "address" },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      inputs: [],
      name: "ADDRESSES_PROVIDER",
      outputs: [{ internalType: "contract ILendingPoolAddressesProviderV2", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "LENDING_POOL",
      outputs: [{ internalType: "contract ILendingPoolV2", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address[]", name: "assets", type: "address[]" },
        { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
        { internalType: "uint256[]", name: "premiums", type: "uint256[]" },
        { internalType: "address", name: "initiator", type: "address" },
        { internalType: "bytes", name: "params", type: "bytes" },
      ],
      name: "executeOperation",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
    {
      inputs: [
        { internalType: "address", name: "_recipientAccount", type: "address" },
        {
          components: [
            { internalType: "address", name: "tokenAddress", type: "address" },
            { internalType: "uint256", name: "stableDebtTokenBalance", type: "uint256" },
            { internalType: "uint256", name: "variableDebtTokenBalance", type: "uint256" },
          ],
          internalType: "struct TransferAccount.DebtTokenBalance[]",
          name: "_DebtTokenBalance",
          type: "tuple[]",
        },
        {
          components: [
            { internalType: "address", name: "Token", type: "address" },
            { internalType: "address", name: "aTokenAddress", type: "address" },
            { internalType: "uint256", name: "aTokenBalance", type: "uint256" },
          ],
          internalType: "struct TransferAccount.aTokenBalance[]",
          name: "_aTokenBalance",
          type: "tuple[]",
        },
      ],
      name: "transferAccount",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_assetAddress", type: "address" }],
      name: "withdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    { stateMutability: "payable", type: "receive" },
  ];
  const tranzoTransfer = async (recepientAddress: string) => {
    console.log(recepientAddress);
    const contract = new ethers.Contract(
      "0xB12822917909ce07712Bb4602bb46dF0353e2A88",
      CONTRACT_ABI,
      fromAccount.signer || undefined
    );
    console.log("siggner", fromAccount.signer);
    console.log("contractx", contract);
    const params = [recepientAddress, debtTokenTranzoList, aTokenTranzoList];
    console.log("transferAccount params: ", params);
    const action = "transferAccount";
    const unsignedRawTx = await contract[action](...params);
    console.log(unsignedRawTx);
  };

  return {
    actions: {
      tranzoTransfer,
    },
  };
};

export default useTranzo;
