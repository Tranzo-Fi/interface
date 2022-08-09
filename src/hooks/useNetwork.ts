import { providers } from "ethers";

const useNetwork = () => {
  const switchNetwork = async (provider: providers.Web3Provider, chainId: number) => {
    const hexChainId = "0x" + chainId.toString(16);
    console.log(provider);
    if (!provider || !provider.provider || !provider.provider.request) return;
    try {
      await provider.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      });
    } catch (error) {
      let params = {
        chainId: "0x42",
        chainName: "Ethereum Testnet Kovan",
        nativeCurrency: {
          name: "Kovan Ether",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: ["https://kovan.infura.io/v3/ef6468f72f524d5ea0be6b57dd803d35"],
        blockExplorerUrls: ["https://kovan.etherscan.io"],
      };

      if (params) {
        try {
          await provider.provider.request({
            method: "wallet_addEthereumChain",
            params: [params],
          });
        } catch (addError) {
          // handle "add" error
          console.error("Add network error"); // eslint-disable-line
        }
      } else {
        throw new Error("Network not found");
      }
    }
  };

  return {
    switchNetwork,
  };
};

export default useNetwork;
