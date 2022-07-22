import { Box, Flex, Image } from "rebass/styled-components";
import { Logo } from "../app/assets";
import WalletConnectButton from "./WalletConnectButton";

type Props = {};

const Header = (props: Props) => {
  return (
    <>
      <Flex mx={30} justifyContent={"space-between"} py={15}>
        <Image
          sx={{
            "&:hover": {
              cursor: "pointer",
            },
          }}
          height={50}
          width={50}
          src={Logo}
        />
        <Box color={"flash"} fontFamily={"primary"}>
          <WalletConnectButton />
        </Box>
      </Flex>
      <Box width={"100%"} height={0.25} bg={"dullDark"} />
    </>
  );
};

export default Header;
