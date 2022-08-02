import { Contract } from "ethers";
import React from "react";
import { Token } from "types/token.types";

type Callback = (...args: any[]) => void;

const useContractEvent = (contract: Contract, tokenList: Token[], eventName: string, callback: Callback) => {
  const savedCallback = React.useRef<Callback | null>();

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    function listener(...args: any[]) {
      if (savedCallback.current) {
        savedCallback.current(...args);
      }
    }
    if (contract && eventName) {
      for (const token of tokenList) {
        contract.attach(token.address);
        contract.on(eventName, listener);
      }

      return () => {
        for (const token of tokenList) {
          contract.attach(token.address);
          contract.off(eventName, listener);
        }
      };
    }
  }, [contract, eventName, tokenList]);
};

export default useContractEvent;
