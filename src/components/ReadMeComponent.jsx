import React from "react";

function ReadMe() {
  return (
    <div className="container">
      <div className="readMe">
        <h4 style={{ textAlign: "center", fontSize: "1.2em" }}>Read me</h4>
        <p>
          This program can read SUV beamline data format, and export two needed
          columns of which first column is usually energy or angle and second
          column is intensity (or I/I
          <sub>0</sub>, if you have set I<sub>0</sub> index) to <b>.csv</b> or{" "}
          <b>.txt</b> plaintext formats. You can also copy data to clipboard,
          and directly paste into Origin/ Igor/ Excel tables, or any other
          program.
          <br />
          <br />
          Select your data file, set scan number and column indices, and click{" "}
          <b>Process&nbsp;Data</b>. Data columns will be listed above once the
          file is processed (if your file has column name header). You can
          re-enter the column indices, and click <b>Process&nbsp;Data</b> button
          again if you have chosen wrong columns, or you can change the scan
          number to process multiple scans from the same input file. Note that
          column header names might not match actual data columns, please
          consult with beamline personal about your data file format.
          <br />
          <br />
          You may not be able to enter <code>-1</code> in some fields by start
          typing with <code>-</code> sign. Please type <code>1</code> first, and
          then move the cursor to the beginning and enter <code>-</code> sign.
          Alternatively, you may enter <code>0</code> and use the down arrow to
          set <code>-1</code> if your browser supports.
          <br />
          <br />
          If you upload a new data file with the same name as currently uploaded
          file, some browsers may not trigger the event which this program
          relies on updating the states. In such cases, please use the{" "}
          <b>Start&nbsp;Over</b> button before uploading new file with the same
          name. A sample data file can be found{" "}
          <a href="./data.txt" target="_blank">
            here
          </a>
          .
          <br />
          <br />
          This is a client side application. All data are processed in your
          computer locally. Once the webapp (less than 1&nbsp;MB) is loaded in
          your browser, you do not require internet connection to process your
          files. Want to improve this application, or curious to find out how it
          works? View code on{" "}
          <a href="https://github.com/pranabdas/suvapp">GitHub</a>. You can also
          check out{" "}
          <a href="https://pranabdas.github.io/suvtools/">SUV Python Tools</a>{" "}
          which offers more functionality. If you find any bug or have feedback,
          please let me know. Thank you.
        </p>
      </div>
    </div>
  );
}

export default ReadMe;
