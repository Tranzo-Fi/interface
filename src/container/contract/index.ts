import { createContainer } from "unstated-next";
import { CHAIN_ID } from "./../../connector/index";
import { useMemo } from "react";
import { Connection } from "./../connection/index";
import { ERC20__factory, DebtToken__factory, Tranzo__factory } from "../../types/contract";
import { constants } from "ethers";

export const TRANZO_CONTRACT_ADDRESS = {
  [CHAIN_ID.Kovan]: "0xB12822917909ce07712Bb4602bb46dF0353e2A88",
};

export const Contract = createContainer(useContract);

function useContract() {
  const { ethProvider } = Connection.useContainer();

  return useMemo(() => {
    return {
      erc20: {
        eth: ERC20__factory.connect(constants.AddressZero, ethProvider),
      },
      debtToken: DebtToken__factory.connect(constants.AddressZero, ethProvider),
      tranzo: Tranzo__factory.connect(TRANZO_CONTRACT_ADDRESS[CHAIN_ID.Kovan], ethProvider),
    };
  }, [ethProvider]);
}
