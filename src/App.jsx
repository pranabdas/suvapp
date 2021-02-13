import React from "react";
import DataUploader from "./components/DataUploader.jsx";

function App() {
  return (
    <>
      <DataUploader />

      <br />
      <br />
      <footer>
        © Copyright {new Date().getFullYear().toString()}{" "}
        <a href="https://pranabdas.github.io/">Pranab Das</a>. All rights
        reserved.
      </footer>
    </>
  );
}

export default App;
