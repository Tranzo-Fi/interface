import React from "react";
import { Box, Flex } from "rebass/styled-components";

import Header from "../../components/Header";
import AppButton from "../../components/primitives/Button";
import { Flow } from "../../container/flow/index";
import HomeFlow from "./components/HomeFlow";
import Stepper from "./components/Stepper";
import useTranzo from "hooks/useTranzo";
import { Step } from "types/app.types";
import { Global } from "container/global";

type Props = {};

const Home = (props: Props) => {
  const {
    actions: { tranzoTransfer },
  } = useTranzo();
  const {
    currentStep,
    actions: { changeStep, buttonFlow },
  } = Flow.useContainer();

  const {
    state: {
      signer: { to: toAccount },
    },
  } = Global.useContainer();

  const handlePress = React.useCallback(() => {
    if (currentStep === Step.FOUR) {
      tranzoTransfer(toAccount.address);
      return;
    }

    buttonFlow(currentStep).action();
  }, [buttonFlow, currentStep, toAccount.address, tranzoTransfer]);
  return (
    <>
      <Header />
      <HomeFlow currentStep={currentStep} />
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
          style={{
            marginLeft: "10px",
            padding: `15px 40px 15px 40px`,
            width: "280px",
            height: "70px",
          }}
          rightIcon={<i className="fas fa-arrow-right white"></i>}
          label={currentStep === Step.FOUR ? "Transfer Positions" : buttonFlow(currentStep).buttonLabel}
          onPress={handlePress}
        />
      </Flex>
    </>
  );
};

export default Home;
