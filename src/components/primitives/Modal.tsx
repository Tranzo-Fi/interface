import { Box, Flex, Text } from "rebass/styled-components";
import styled from "styled-components";

interface ModalProps {
  show: boolean;
  height?: number;
  width?: number;
  heading?: string;
  children: JSX.Element;
  close: () => void;
}

const CloseIcon = styled.div`
  > i {
    color: #4a4a5c;
    font-size: 25px;
    transition: 0.5s;
    :hover {
      cursor: pointer;
      color: #57576c;
    }
  }
`;

const BasicModal = ({
  heading,
  show,
  height = 400,
  width = 400,
  children,
  close,
}: ModalProps) => {
  return (
    <>
      {show && (
        <>
          <Box
            onClick={close}
            backgroundColor={"fadedDark"}
            height={"100vh"}
            width={"100%"}
            opacity={0.9}
            sx={{
              position: "absolute",
              filter: `blur(5px)`,
              zIndex: 3,
            }}
          ></Box>
          <Box
            width={width}
            height={height}
            padding={20}
            backgroundColor={"#1d1d30"}
            sx={{
              border: `1px solid #262638`,
              borderRadius: 10,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%)`,
              zIndex: 4,
            }}
          >
            {heading && (
              <Flex justifyContent={"space-between"}>
                <Text fontSize={20} fontFamily={"Roboto Mono"} color={"grey"}>
                  Connect Wallet
                </Text>
                <Box>
                  <CloseIcon>
                    <i
                      onClick={close}
                      className="fa fa-times"
                      aria-hidden="true"
                    ></i>
                  </CloseIcon>
                </Box>
              </Flex>
            )}
            {children}
          </Box>
        </>
      )}
    </>
  );
};

export default BasicModal;
