import { BalanceTokenType } from "hooks/useTokens";
import { Box, Flex } from "rebass/styled-components";
import { normalizeBignumber } from "utils/format";
import TokenItem from "./TokenItem";

type Props = {
  token: BalanceTokenType;
};

const DelegateTokenItem = ({ token }: Props) => {
  return (
    <Box
      sx={{
        border: `1px solid #262638`,
        borderRadius: "10px",
      }}
      ml={2}
      width={"250px"}
      height={"112px"}
      mt={3}
    >
      <Flex flexDirection={"column"} justifyContent={"flex-end"}>
        <Box px={3} py={2}>
          <TokenItem token={token?.symbol} balance={Number(normalizeBignumber(token?.balance, token.decimal)).toFixed(7)} />
        </Box>
        <Box
          onClick={() => {}}
          bg={"flash"}
          fontFamily={"Roboto Mono"}
          color={"white"}
          width={"100%"}
          textAlign={"center"}
          height={"38px"}
          display={"grid"}
          alignContent={"center"}
          fontSize={"12px"}
          sx={{
            transition: `0.5s`,
            borderRadius: `0px 0px 10px 10px`,
            borderTop: `1px solid #262638`,
            "&:hover": {
              cursor: "pointer",
              backgroundColor: "fadedFlash",
            },
          }}
        >
          Delegate
        </Box>
      </Flex>
    </Box>
  );
};

export default DelegateTokenItem;
