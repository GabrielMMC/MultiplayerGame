import React from "react";
import { EchoProvider } from "./context/EchoContext";
import InitialRoom from "./components/InitialRoom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Searching for room</h1>
      <EchoProvider>
        <InitialRoom />
      </EchoProvider>
    </div>
  );
};

export default App;
