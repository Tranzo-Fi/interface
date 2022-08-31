import React from "react";
import { Box, Flex, Text } from "rebass/styled-components";

import Header from "../../components/Header";
import AppButton from "../../components/primitives/Button";
import { Flow } from "../../container/flow/index";
import HomeFlow from "./components/HomeFlow";
import Stepper from "./components/Stepper";
import useTranzo from "hooks/useTranzo";
import { Step } from "types/app.types";
import { Global } from "container/global";
import Strip from "components/Strip";

type Props = {};

const Home = (props: Props) => {
  const {
    actions: { tranzoTransfer },
  } = useTranzo();
  const {
    currentStep,
    loading,
    actions: { changeStep, buttonFlow },
  } = Flow.useContainer();
  const {
    state: {
      tranzoDone,
      signer: { to: toAccount },
    },
  } = Global.useContainer();

  const handlePress = React.useCallback(() => {
    if (loading || tranzoDone) return;
    if (currentStep === Step.FOUR) {
      tranzoTransfer(toAccount.address);
      return;
    }

    buttonFlow(currentStep).action();
  }, [buttonFlow, currentStep, loading, toAccount.address, tranzoDone, tranzoTransfer]);

  const getAppButtonText = React.useCallback(() => {
    if (currentStep === Step.FOUR) {
      return "Transfer Positions";
    } else if (tranzoDone) {
      return "Transfer Completed";
    } else {
      return buttonFlow(currentStep).buttonLabel;
    }
  }, [buttonFlow, currentStep, tranzoDone]);
  return (
    <>
      <Strip />
      <Header />
      <HomeFlow currentStep={currentStep} />
      <Box
        width={"80%"}
        textAlign={"center"}
        margin={"auto"}
        sx={{
          display: "none",
          "@media screen and (max-width: 40em)": {
            display: "block",
          },
        }}
      >
        <Box mt={5}>
          <i className="fas fa-desktop flash large"></i>
          <Text fontFamily={"Roboto Mono"} mt={3} color={"flash"}>
            For better experience try Tranzo on desktop
          </Text>
        </Box>
      </Box>
      <Box
        sx={{
          "@media screen and (max-width: 40em)": {
            display: "none",
          },
        }}
      >
        <Flex width={"80%"} margin={"auto"} mt={2}>
          <Box
            bg={"fadedDark"}
            width={"100%"}
            sx={{
              border: `1px solid #262638`,
              borderRadius: "5px",
            }}
          >
            <Box display={"grid"} alignContent="center" height={"100%"} px={"100px"}>
              <Flex width={"100%"} justifyContent={"space-between"}>
                <Stepper currentStep={currentStep} changeStep={changeStep} />
              </Flex>
            </Box>
          </Box>
          <AppButton
            loading={loading}
            style={{
              marginLeft: "10px",
              padding: `15px 40px 15px 40px`,
              width: "280px",
              height: "70px",
            }}
            rightIcon={<i className="fas fa-arrow-right white"></i>}
            label={getAppButtonText()}
            onPress={handlePress}
          />
        </Flex>
      </Box>
    </>
  );
};

export default Home;
