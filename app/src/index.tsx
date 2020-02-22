import * as React from "react";
import { render } from "react-dom";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";

import "./styles/main.scss";

import App from "./App";
import { store } from "./reduxHandler";

render(
  <MemoryRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </MemoryRouter>,
  document.getElementById("root")
);
