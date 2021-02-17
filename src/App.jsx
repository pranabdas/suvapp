import React from "react";
import DataUploader from "./components/DataUploader.jsx";
// import PlotComponent from "./components/PlotComponent.jsx";

function App() {
  return (
    <>
      <DataUploader />
      {/* <PlotComponent /> */}
      <footer>
        © Copyright {new Date().getFullYear().toString()}{" "}
        <a href="https://pranabdas.github.io/">Pranab Das</a>. All rights
        reserved.
      </footer>
    </>
  );
}

export default App;
