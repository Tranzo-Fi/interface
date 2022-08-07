import { CHAIN_ID } from "connector";
import { stableDebtTokenList, variableDebtTokenList } from "constants/tokens";
import { TRANZO_CONTRACT_ADDRESS } from "container/contract";
import { Global } from "container/global";
import { ethers } from "ethers";
import useApproveDelegationProgress from "hooks/useApproveDelegationProgress";
import useDelegation from "hooks/useDelegation";
import useToken from "hooks/useToken";
import useTokens from "hooks/useTokens";
import React from "react";
import { Box, Flex } from "rebass";
import { TokenType } from "types/token.types";
import DelegateTokenItem, { TokenWithAllowanceAndBalanceType } from "./DelegateTokenItem";
import Layout from "./primitives/Layout";
import Progress from "./primitives/Progress";

type Props = {};

const Delegate = (props: Props) => {
  const { balances: stableDebtTokenBalances, allowances: stableDebtTokenAllowances } = useTokens(
    stableDebtTokenList,
    TokenType.DebtToken
  );
  const { balances: variableDebtTokenBalances, allowances: variableDebtTokenAllownaces } = useTokens(
    variableDebtTokenList,
    TokenType.DebtToken
  );

  const { delegateTokens } = useDelegation(
    stableDebtTokenBalances,
    stableDebtTokenAllowances,
    variableDebtTokenBalances,
    variableDebtTokenAllownaces
  );

  const {
    state: {
      signer: { to: toAccountSigner },
    },
  } = Global.useContainer();
  const progress = useApproveDelegationProgress(delegateTokens);
  const { approveDelegation } = useToken(TokenType.DebtToken, toAccountSigner?.signer || undefined);
  const doDelegateApprove = React.useCallback(
    (tokenAddress: string, amount: ethers.BigNumber) => {
      approveDelegation(tokenAddress, TRANZO_CONTRACT_ADDRESS[CHAIN_ID.Kovan], amount);
    },
    [approveDelegation]
  );
  return (
    <Layout title={"Aprove Delegation"}>
      <Box px={3}>
        <Flex
          p={10}
          justifyContent={"space-between"}
          sx={{
            borderBottom: `1px solid #262638`,
          }}
        >
          <Box width={"97%"}>
            <Progress progress={progress} />
          </Box>
          <Box width={"2%"}>
            <i className="fa fa-info-circle flash" aria-hidden="true"></i>
          </Box>
        </Flex>
        <Box minHeight={"55vh"}>
          <Flex flexWrap={"wrap"}>
            {(delegateTokens || []).map((t: TokenWithAllowanceAndBalanceType) => {
              return <DelegateTokenItem key={t?.address} onClick={doDelegateApprove} token={t} />;
            })}
          </Flex>
        </Box>
      </Box>
    </Layout>
  );
};

export default Delegate;
