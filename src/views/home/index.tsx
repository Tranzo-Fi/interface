import { Box, Flex } from "rebass/styled-components";
import { STEPPER } from "../../app/config/stepper";
import Approve from "../../components/Approve";
import ConnectAccount from "../../components/ConnectAccount";

import Header from "../../components/Header";
import PositionTable from "../../components/PositionTable";
import AppButton from "../../components/primitives/Button";
import { Flow } from "../../container/flow";
import HomeFlow from "./components/HomeFlow";
import Stepper from "./components/Stepper";

type Props = {};

const Home = (props: Props) => {
  const {
    currentStep,
    actions: { changeStep },
  } = Flow.useContainer();

  console.log(currentStep);
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
          <Box
            display={"grid"}
            alignContent="center"
            height={"100%"}
            px={"100px"}
          >
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
          label="Transfer Positions"
          onPress={() => {
            changeStep(currentStep + 1);
          }}
        />
      </Flex>
    </>
  );
};

export default Home;
