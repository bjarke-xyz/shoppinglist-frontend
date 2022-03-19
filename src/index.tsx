import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { StoreProvider } from "easy-peasy";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./store/store";
import keycloak, { initOptions } from "./Keycloak";

(window as any).enableKeycloakLogging = true;

const eventLogger = (event: unknown, error: unknown) => {
  if ((window as any).enableKeycloakLogging) {
    console.log("onKeycloakEvent", event, error);
  }
};

const tokenLogger = (tokens: unknown) => {
  if ((window as any).enableKeycloakLogging) {
    console.log("onKeycloakTokens", tokens);
  }
};

ReactDOM.render(
  <ReactKeycloakProvider
    authClient={keycloak}
    LoadingComponent={<p />}
    onEvent={eventLogger}
    onTokens={tokenLogger}
    initOptions={initOptions}
  >
    <BrowserRouter>
      <StoreProvider store={store}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </StoreProvider>
    </BrowserRouter>
  </ReactKeycloakProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
