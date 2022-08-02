import React from "react";
import Approve from "../../../components/Approve";
import ConnectAccount from "../../../components/ConnectAccount";
import PositionTable from "../../../components/PositionTable";
import { Step } from "../../../types/app.types";

type Props = {
  currentStep: Step;
};

const HomeFlow = ({ currentStep }: Props) => {
  function renderFlowComponent() {
    switch (currentStep) {
      case Step.ONE:
        return <PositionTable />;
      case Step.TWO:
        return <Approve />;
      case Step.THREE:
        return <ConnectAccount from={"a"} to={"0"} />;
      case Step.FOUR:
        return <PositionTable />;
      default:
        return <></>;
    }
  }
  return <>{renderFlowComponent()}</>;
};

export default HomeFlow;
