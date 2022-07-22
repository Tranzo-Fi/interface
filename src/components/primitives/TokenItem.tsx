import React from "react";
import { Flex, Box, Text } from "rebass";

type Props = {
  token: string;
  balance: string;
};

const TokenItem = ({ token, balance }: Props) => {
  return (
    <Flex my={2}>
      <Box
        width={38}
        mr={"9px"}
        height={38}
        bg={"grey"}
        sx={{
          borderRadius: "100%",
        }}
      ></Box>
      <Box mt={1}>
        <Text fontFamily={"Roboto"} color={"lightGrey"}>
          {token}
        </Text>
        <Text fontFamily={"Roboto Mono"} fontSize={"12px"} color={"grey"}>
          {balance}
        </Text>
      </Box>
    </Flex>
  );
};

export default TokenItem;
