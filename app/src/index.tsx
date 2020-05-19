import React from "react";
import { render } from "react-dom";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";

import "./styles/main.scss";

import App from "./App";
import { store } from "./reduxHandler";
import { init } from "./localStorage";

init();

render(
  <MemoryRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </MemoryRouter>,
  document.getElementById("root")
);
