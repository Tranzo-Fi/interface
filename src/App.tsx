import { BrowserRouter, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Routes from "./components/utils/Routes";
import WalletModal from "./components/wallet/WalletModal";
import GlobalStyle from "./utils/globalStyle";
import { theme } from "./utils/theme";
import WalletConnectModal from "components/wallet/WalletConnectModal";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <WalletConnectModal />
        <WalletModal />
        <GlobalStyle />
        <BrowserRouter>
          <Switch>
            <Routes />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
