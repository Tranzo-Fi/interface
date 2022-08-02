import { useWeb3React } from "@web3-react/core";
import AccountAvatar from "components/AccountAvatar";
import ConnectAccount from "components/ConnectAccount";
import AppButton from "components/primitives/Button";
import { User } from "container/user";
import React from "react";
import { Box, Button, Flex } from "rebass/styled-components";
import { SUPPORTED_WALLETS } from "../../constants/wallet";
import { Global } from "../../container/global";
import Modal from "../primitives/Modal";
import WalletButton from "./WalletButton";

type Props = {};

enum GetSignerType {
  GET_TO_SIGNER = "GET_TO_SIGNER",
  GET_FROM_SIGNER = "GET_FROM_SIGNER",
  SHOW_PREVIEW = "SHOW_PREVIEW",
}

/**
 * Wallet Modal Flow
 * GET_TO_SIGNER -> GET_FROM_SIGNER -> SHOW_PREVIEW
 */

const WalletModal = (props: Props) => {
  const [type, setType] = React.useState(GetSignerType.GET_TO_SIGNER);
  const {
    state: {
      modal: { isOpen },
      signer: { to: toSignerData, from: fromSignerData },
    },
    actions: { toggleWalletModal, setToSigner, setFromSigner },
  } = Global.useContainer();

  const { account, library } = useWeb3React();

  const {
    state: { address },
    actions: { logout },
  } = User.useContainer();

  function closeWalletModal() {
    toggleWalletModal(false);
  }

  const getWalletModalHeading = React.useCallback(() => {
    switch (type) {
      case GetSignerType.GET_FROM_SIGNER:
        return "Connect to the wallet you wish to move positions from";
      case GetSignerType.GET_TO_SIGNER:
        return "Connect to the wallet you wish to move positions to";
      case GetSignerType.SHOW_PREVIEW:
        return "Accounts Preview";
      default:
        return "";
    }
  }, [type]);

  function moveNext() {
    if (type === GetSignerType.GET_TO_SIGNER) {
      console.log("library?.getSigner()", library?.getSigner());
      setToSigner({
        signer: library?.getSigner() || null,
        address: account || "",
      });
      logout();
      setType(GetSignerType.GET_FROM_SIGNER);
    } else if (type === GetSignerType.GET_FROM_SIGNER) {
      setFromSigner({
        signer: library?.getSigner() || null,
        address: account || "",
      });
      setType(GetSignerType.SHOW_PREVIEW);
    } else {
      setType(GetSignerType.GET_TO_SIGNER);
      toggleWalletModal(false);
    }
  }
  const walletList = React.useCallback(() => {
    return (
      <>
        {SUPPORTED_WALLETS.map((wallet) => (
          <WalletButton
            key={wallet.name}
            name={wallet.name}
            description={wallet.description}
            connector={wallet.connector}
            id={wallet.id}
            icon={wallet.iconName}
          />
        ))}
      </>
    );
  }, []);

  const walletModal = React.useCallback(() => {
    switch (type) {
      case GetSignerType.GET_FROM_SIGNER:
      case GetSignerType.GET_TO_SIGNER:
        return (
          <>
            {address ? (
              <Box display={"flex"} justifyContent={"center"} width="100%" mt={3}>
                <AccountAvatar size={150} address={address} />
              </Box>
            ) : (
              walletList()
            )}
          </>
        );
      case GetSignerType.SHOW_PREVIEW:
        return (
          <>
            <ConnectAccount from={"a"} to={"b"} />
          </>
        );
    }
  }, [address, type, walletList]);

  return (
    <Modal height={"auto"} close={closeWalletModal} heading={getWalletModalHeading()} show={isOpen}>
      <>
        <Flex height={"100%"} flexDirection={"column"} justifyContent={"space-between"}>
          <Box>{walletModal()}</Box>
          <Box>
            <AppButton
              style={{
                width: "100%",
                padding: `15px 0px 15px 0px`,
                marginTop: "80px",
              }}
              rightIcon={<i className="fas fa-arrow-right white"></i>}
              label={type === GetSignerType.SHOW_PREVIEW ? "Done" : "Next"}
              onPress={moveNext}
            />
          </Box>
        </Flex>
      </>
    </Modal>
  );
};

export default WalletModal;
