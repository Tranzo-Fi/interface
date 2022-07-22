import { BrowserRouter, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import Routes from "./components/utils/Routes";
import GlobalStyle from "./utils/globalStyle";
import { theme } from "./utils/theme";

function App() {
  // const {
  //   actions: {login}
  // } = User.useContainer();

  // function handleLogin() {
  //   login(injected, 'metamask');
  // }

  return (
    <>
        <ThemeProvider theme={theme}>
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
