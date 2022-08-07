import React from "react";
import { Box, Flex } from "rebass/styled-components";

import { User } from "container/user";
import Modal from "../primitives/Modal";
import WalletButton from "./WalletButton";
import { Global } from "../../container/global";
import AccountAvatar from "components/AccountAvatar";
import AppButton from "components/primitives/Button";
import ConnectAccount from "components/ConnectAccount";
import { SUPPORTED_WALLETS } from "../../constants/wallet";
import useWalletModal, { GetSignerType } from "hooks/useWalletModal";

type Props = {};

/**
 * Wallet Modal Flow
 * GET_TO_SIGNER -> GET_FROM_SIGNER -> SHOW_PREVIEW
 */

const WalletModal = (props: Props) => {
  const { type, handleWalletModalNext, getWalletModalHeading } = useWalletModal();
  const {
    state: {
      modal: { isOpen },
      signer: { to: toSignerData, from: fromSignerData },
    },
    actions: { toggleWalletModal },
  } = Global.useContainer();

  const {
    state: { address },
    actions: { logout },
  } = User.useContainer();

  function closeWalletModal() {
    logout();
    toggleWalletModal(false);
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
            <ConnectAccount from={fromSignerData?.address} to={toSignerData?.address} />
          </>
        );
    }
  }, [address, fromSignerData?.address, toSignerData?.address, type, walletList]);

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
              onPress={handleWalletModalNext}
            />
          </Box>
        </Flex>
      </>
    </Modal>
  );
};

export default WalletModal;
