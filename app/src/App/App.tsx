import * as React from "react";
import { Switch, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Settings from "./Settings";
import Music from "./Music";

const Null = () => <div></div>;

function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Switch>
          <Route path="/settings" component={Settings} />
          <Route path="/music" component={Music} />
          <Route path="/" component={Null} />
        </Switch>
      </main>
    </div>
  );
}

export default App;
