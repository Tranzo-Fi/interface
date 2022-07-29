import { ethers } from "ethers";
import { Connection } from "./../container/connection/index";
import { Contract } from "./../container/contract/index";
import React from "react";
import { Contract as MulticallContract, ContractCall } from "ethers-multicall";
import { Fragment } from "ethers/lib/utils";
// import { useAsyncMemo } from "use-async-memo";

/**
 * Provides utils for approval of token, balance of token, balances of tokens
 * get allowance by spender, get allowances for list of token etc..
 */

export type Token = {
  symbol: string;
  address: string;
  decimal: number;
};

export interface BalanceTokenType extends Token {
  balance: ethers.BigNumber;
}

export interface AllownaceTokenType extends Token {
  allowance: ethers.BigNumber;
}

const useTokens = (tokenList: Token[]) => {
  const [balances, setBalances] = React.useState<BalanceTokenType[]>();
  const [allowances, setAllowances] = React.useState<AllownaceTokenType[]>([]);
  const [isBalanceLoading, setIsBalanceLoading] =
    React.useState<boolean>(false);
  const [isAllowanceLoading, setIsAllowanceLoading] =
    React.useState<boolean>(false);
  const { erc20: ERC20Contract } = Contract.useContainer();
  const { ethMulticallProvider, account } = Connection.useContainer();
  const erc20 = ERC20Contract.eth;

  React.useEffect(() => {
    async function fetchBalance() {
      setIsBalanceLoading(true);
      const tokenBalanceCalls: ContractCall[] = [];
      tokenList.forEach((token) => {
        if (erc20 && ethMulticallProvider && token && account) {
          const contract = new MulticallContract(
            token.address,
            erc20.interface.fragments as Fragment[]
          );
          tokenBalanceCalls.push(contract.balanceOf(account));
        }
      });
      const tokenBalances = await ethMulticallProvider?.all([
        ...tokenBalanceCalls,
      ]);

      if (tokenBalances) {
        setBalances(
          tokenList.map((t, i) => {
            return { ...t, balance: tokenBalances[i] };
          })
        );
      } else {
        return setBalances([]);
      }
      setIsBalanceLoading(false);
    }
    fetchBalance();

    /**
     * @Todo
     * Casuing infinite re-render when all dependencies are
     * added. Need to be fixed
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, ethMulticallProvider]);

  React.useEffect(() => {
    async function fetchAllowance() {
      setIsAllowanceLoading(true);
      const allowanceContractCalls: ContractCall[] = [];
      tokenList.forEach((token) => {
        if (erc20 && ethMulticallProvider && token && account) {
          const contract = new MulticallContract(
            token.address,
            erc20.interface.fragments as Fragment[]
          );
          allowanceContractCalls.push(
            contract.allowance(account, token.address)
          );
        }
      });
      const allowances = await ethMulticallProvider?.all([
        ...allowanceContractCalls,
      ]);
      if (allowances) {
        setAllowances(
          tokenList.map((t, i) => {
            return { ...t, allowance: allowances[i] };
          })
        );
      } else {
        setAllowances([]);
      }
      setIsAllowanceLoading(false);
    }

    fetchAllowance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, ethMulticallProvider]);

  return {
    isAllowanceLoading,
    isBalanceLoading,
    balances,
    allowances,
  };
};

export default useTokens;
