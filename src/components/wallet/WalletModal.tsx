import { Box, Button, Flex } from "rebass/styled-components";
import { SUPPORTED_WALLETS } from "../../constants/wallet";
import { Global } from "../../container/global";
import Modal from "../primitives/Modal";
import WalletButton from "./WalletButton";

type Props = {};

const WalletModal = (props: Props) => {
  const {
    state: {
      modal: { isOpen },
    },
    actions: { toggleWalletModal },
  } = Global.useContainer();

  function closeWalletModal() {
    toggleWalletModal(false);
  }

  return (
    <Modal close={closeWalletModal} heading={"Connect Wallet"} show={isOpen}>
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
    </Modal>
  );
};

export default WalletModal;
