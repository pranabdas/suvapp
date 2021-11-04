import React from "react";
import DataHandler from "./components/DataHandler.jsx";
// import PlotComponent from "./components/PlotComponent.jsx";
import ReadMe from "./components/ReadMeComponent.jsx"

function App() {
  return (
    <>
      <DataHandler />
      {/* <PlotComponent /> */}
      <ReadMe />
      <footer>
        © Copyright {new Date().getFullYear().toString()}{" "}
        <a href="https://pranabdas.github.io/">Pranab Das</a>. All rights
        reserved.
      </footer>
    </>
  );
}

export default App;
