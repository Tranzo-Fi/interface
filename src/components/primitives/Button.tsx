import React from "react";
import { Button } from "rebass/styled-components";

type Props = {
  label: string;
  style?: React.CSSProperties;
  rightIcon?: React.ReactElement;
  onPress: (e: React.MouseEvent<HTMLElement>) => void;
};

const AppButton = ({ label, style, rightIcon, onPress }: Props) => {
  return (
    <Button
      onClick={onPress}
      sx={{
        ...style,
        border: `1.5px solid #6462de`,
        ":hover": {
          backgroundColor: "fadedFlash",
          cursor: "pointer",
        },
      }}
    >
      {label} {rightIcon}
    </Button>
  );
};

export default AppButton;
