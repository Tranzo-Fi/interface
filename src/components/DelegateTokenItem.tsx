import { ethers } from "ethers";
import { BalanceTokenType } from "hooks/useTokens";
import React from "react";
import { Box, Flex } from "rebass/styled-components";
import { increaseByPercent, normalizeBignumber } from "utils/format";
import TokenItem from "./TokenItem";

export interface TokenWithAllowanceAndBalanceType extends BalanceTokenType {
  allowance: number;
  type: "stable" | "variable";
}

type Props = {
  token: TokenWithAllowanceAndBalanceType;
  onClick: (tokenAddress: string, amount: ethers.BigNumber) => void;
};

const DelegateTokenItem = ({ token, onClick }: Props) => {
  const isDisabled = React.useMemo(() => {
    return parseFloat(token?.allowance?.toString()) >= parseFloat(token?.balance?.toString());
  }, [token?.allowance, token?.balance]);
  const handleClick = () => {
    if (isDisabled) return;
    const amountWithBuffer = increaseByPercent(token.balance, 0.01); // buffer 1%
    // console.log(amountWithBuffer.toString());
    onClick(token.address, amountWithBuffer);
  };
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
          onClick={handleClick}
          bg={isDisabled ? "dullFlash" : "flash"}
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
              backgroundColor: isDisabled ? "" : "fadedFlash",
            },
          }}
        >
          {isDisabled ? "Delegated" : "Delegate"}
        </Box>
      </Flex>
    </Box>
  );
};

export default DelegateTokenItem;
