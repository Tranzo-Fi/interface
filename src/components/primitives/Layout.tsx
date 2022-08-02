import { Text, Box } from "rebass/styled-components";

type Props = {
  title: string;
  children?: React.ReactNode;
};

const Layout = ({ title, children }: Props) => {
  return (
    <>
      <Text width={"80%"} fontFamily={"secondary"} margin={"auto"} mt={30} fontSize={3} fontWeight="body" color="fadedFlash">
        {title}
      </Text>
      <Box
        margin={"auto"}
        width={"80%"}
        height={"auto"}
        bg={"fadedDark"}
        mt={10}
        sx={{
          borderRadius: 8,
          border: `1px solid #262638`,
        }}
      >
        {children && children}
      </Box>
    </>
  );
};

export default Layout;
