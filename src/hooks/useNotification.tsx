import React from "react";
import { toast } from "react-toastify";
import { Text } from "rebass";

type NotificationPropType = {
  title: string | JSX.Element;
  description: string | JSX.Element;
};
const useNotiifcation = () => {
  const notify = React.useCallback(({ title, description }: NotificationPropType) => {
    toast(
      <>
        <Text fontFamily={"Roboto Mono"} fontWeight={"bold"} fontSize={14} color={"flash"}>
          {title}
        </Text>
        <Text fontFamily={"Roboto Mono"} fontSize={12} color={"grey"}>
          {description}
        </Text>
      </>,
      {
        className: "app-notification",
        bodyClassName: "grow-font-size",
        progressClassName: "fancy-progress-bar",
      }
    );
  }, []);

  return {
    notify,
  };
};

export default useNotiifcation;
