import { Box, Text, Image, Flex } from "rebass/styled-components";
import { Wallet } from "../app/assets";
import AppButton from "./primitives/Button";
import Avatar from "boring-avatars";
import Layout from "./primitives/Layout";

type Props = {};

const ConnectAccount = (props: Props) => {
  return (
    <Layout title={"Connect Account"}>
      <Box
        minHeight={"60vh"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Text
          fontWeight={"body"}
          mb={3}
          color={"fadedFlash"}
          fontFamily={"Roboto Mono"}
        >
          {"Connect to the account you want to move your positions to".toUpperCase()}
        </Text>
        <Flex>
          <Flex flexDirection={"column"}>
            <Avatar
              size={130}
              name="dsddfd,nssdd3355vcnjksnk"
              variant="sunset"
              colors={["#2623dd", "#6462de", "#939398", "#4a4a5c", "#5757ae"]}
            />
            <Box
              bg={"flash"}
              width={"fix-content"}
              textAlign="center"
              fontFamily={"Roboto Mono"}
              color={"white"}
              p={1}
              px={10}
              ml={-10}
              mt={3}
              sx={{
                border: "2px solid #6b68f2",
                borderRadius: "10px",
              }}
            >
              0x56BF...7GZC
            </Box>
          </Flex>
          <Box
            width={40}
            display={"grid"}
            alignContent={"center"}
            justifyContent={"center"}
            height={40}
            mt={40}
            ml={20}
            sx={{
              borderRadius: "100%",
            }}
            bg={"grey"}
          >
            <i className="fas fa-arrow-right grey"></i>
          </Box>
          <Flex justifyContent={"center"} flexDirection={"column"}>
            <Box
              width={200}
              height={200}
              sx={{
                border: `2px dashed #544f8e`,
                borderRadius: "100%",
              }}
              display={"grid"}
              justifyContent={"center"}
              alignContent={"center"}
              bg={"#35325a"}
              ml={20}
            >
              <Image
                opacity={0.15}
                mb={2}
                src={Wallet}
                width={"80px"}
                height={"auto"}
              />
            </Box>
            <AppButton
              style={{
                marginRight: "-10px",
                marginTop: "15px",
                padding: "15px 0px 15px 0px",
              }}
              label={"Connect Account"}
              onPress={() => {}}
            />
          </Flex>
        </Flex>
        {/* <Image
          opacity={0.5}
          mb={2}
          src={Wallet}
          width={"200px"}
          height={"auto"}
        />
        <Text
          fontWeight={"body"}
          mb={3}
          color={"fadedFlash"}
          fontFamily={"Roboto Mono"}
        >
          {"Connect to the account you want to move your positions to".toUpperCase()}
        </Text>
        <AppButton label="Connect Account" onPress={() => console.log("hey")} /> */}
      </Box>
    </Layout>
  );
};

export default ConnectAccount;
