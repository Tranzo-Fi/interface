import { Box, Flex } from "rebass/styled-components";
import ApproveTokenItem from "./ApproveTokenItem";
import Layout from "./primitives/Layout";

type Props = {};

const Progress = () => {
  return (
    <Box
      bg={"flash"}
      width={"50%"}
      height={14}
      mt={1}
      sx={{
        borderRadius: "10px",
      }}
    ></Box>
  );
};

const Approve = (props: Props) => {
  return (
    <Layout title={"Approve aTokens"}>
      <Box px={3}>
        <Flex
          p={10}
          justifyContent={"space-between"}
          sx={{
            borderBottom: `1px solid #262638`,
          }}
        >
          <Box width={"97%"}>
            <Progress />
          </Box>
          <Box width={"2%"}>
            <i className="fa fa-info-circle flash" aria-hidden="true"></i>
          </Box>
        </Flex>
        <Box minHeight={"55vh"}>
          <Flex flexWrap={"wrap"}>
            <ApproveTokenItem />
            <ApproveTokenItem />
          </Flex>
        </Box>
      </Box>
    </Layout>
  );
};

export default Approve;
