import React, { useState } from "react";

function DataUploader() {
  const [filename, setFilename] = useState("");
  const [outFilename, SetOutFilename] = useState("");
  const [content, setContent] = useState([]);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("No data file uploaded yet.");
  const [scan, setScan] = useState(-1);
  const [isColNames, setIsColNames] = useState("");
  const [colNames, setColNames] = useState([]);
  const [xCol, setXCol] = useState(0);
  const [ICol, setICol] = useState(1);
  const [I0Col, setI0Col] = useState(-1);

  const ProcessData = () => {
    const t0 = performance.now();

    // check content exists
    if (content.length < 1) {
      setStatus("Input file is empty.");
      setData([]);
      setColNames([]);
      return;
    }

    // check validity of scan number
    if (!scan) {
      setStatus("Please enter a valid scan number.");
      setData([]);
      setColNames([]);
      return;
    }

    // find scan id and corresponding line numbers
    let scanId = [];
    let lineId = [];

    for (let ii = 0; ii < content.length; ii++) {
      if (content[ii].split(" ")[0] === "#S") {
        scanId.push(parseInt(content[ii].split(" ")[1]));
        lineId.push(ii + 1);
      }
    }

    let id;
    if (scan === -1) {
      id = scanId.length - 1;
      setScan(scanId[scanId.length - 1]);
    } else {
      id = scanId.indexOf(scan);
    }

    // check if the scan exists
    if (content.length && id === -1) {
      setStatus(`Scan number ${scan} not found.`);
      setData([]);
      setColNames([]);
      return;
    }

    let lineStart = lineId[id];
    let lineEnd;

    if (id === scanId.length - 1) {
      lineEnd = content.length - 1;
    } else {
      lineEnd = lineId[id + 1] - 1;
    }

    let data = [];
    let colNames = [];
    for (let ii = 0; ii < lineEnd - lineStart; ii++) {
      if (content[ii + lineStart][0] !== "#" && content[ii + lineStart]) {
        data.push(content[ii + lineStart].split(" "));
      } else if (content[ii + lineStart].slice(0, 2) === "#L") {
        colNames = content[ii + lineStart];
        colNames = colNames.split(" ");
        colNames = colNames.filter((x) => x);
        colNames.shift();
      }
    }

    if (colNames.length > 0) {
      setColNames(colNames);
      setIsColNames("Column names: ");
    } else {
      setColNames([]);
      setIsColNames(["No column name header found."]);
    }

    // convert intensity values to number instead of str
    for (let ii = 0; ii < data.length; ii++) {
      for (let jj = 0; jj < data[0].length; jj++) {
        data[ii][jj] = parseFloat(data[ii][jj]);
      }
    }

    // check if data found
    if (data.length < 1) {
      setStatus("Empty data! Please check data file and inputs.");
      setData([]);
      return;
    }

    // check validity of column index
    if (!xCol && xCol !== 0) {
      setStatus("Please enter a valid X-col index.");
      setData([]);
      return;
    }

    if (!ICol && ICol !== 0) {
      setStatus("Please enter a valid intensity-col index.");
      setData([]);
      return;
    }

    if (!I0Col && I0Col !== 0) {
      setStatus("Please enter a valid I_0-col index.");
      setData([]);
      return;
    }

    if (xCol > data[0].length - 1 || xCol < 0) {
      setStatus("X-column index is out of range.");
      setData([]);
      return;
    } else if (ICol > data[0].length - 1 || ICol < 0) {
      setStatus("Intensity-column index is out of range.");
      setData([]);
      return;
    } else if (I0Col > data[0].length - 1 || I0Col < -1) {
      setStatus("I_0-column index is out of range.");
      setData([]);
      return;
    }

    // export desired columns
    let newData = new Array(data.length);

    if (I0Col === -1) {
      for (let ii = 0; ii < data.length; ii++) {
        newData[ii] = [data[ii][xCol], data[ii][ICol].toExponential()];
      }
    } else {
      for (let ii = 0; ii < data.length; ii++) {
        newData[ii] = [
          data[ii][xCol],
          (data[ii][ICol] / data[ii][I0Col]).toExponential(),
        ];
      }
    }

    setData(newData);

    const t1 = performance.now();
    // console.log("The processing took " + (t1 - t0) + " milliseconds.");
    if (newData.length > 0) {
      setStatus(
        `Success! Processed in ~${parseInt(
          t1 - t0 + 1 + Math.random() * 10 // random number [0, 10] added
        )} millisecond.`
      );
    } else {
      setStatus(
        "Empty output! Please check your data file and inputs, and try again!"
      );
    }

    if (
      filename.slice(filename.length - 4, filename.length).toLowerCase() ===
        ".txt" ||
      filename.slice(filename.length - 4, filename.length).toLowerCase() ===
        ".csv" ||
      filename.slice(filename.length - 4, filename.length).toLowerCase() ===
        ".dat"
    ) {
      SetOutFilename(filename.slice(0, filename.length - 4) + "_scan_");
    } else {
      SetOutFilename(filename + "_scan_");
    }
  };

  const DownloadPlaintext = () => {
    if (data.length > 0) {
      let downloadContent = "";

      for (let ii = 0; ii < data.length; ii++) {
        downloadContent = downloadContent.concat(
          `${data[ii][0]}  ${parseFloat(data[ii][1]).toExponential()}\n`
        );
      }

      const element = document.createElement("a");
      const file = new Blob([downloadContent], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = outFilename + scan + ".txt";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    } else {
      setStatus(
        "Empty output! Please check your data file and inputs, and try again!"
      );
      alert(
        "Empty output! Please check your data file and inputs, and try again!"
      );
    }
  };

  const DownloadCSV = () => {
    if (data.length > 0) {
      let downloadContent = "";

      for (let ii = 0; ii < data.length - 1; ii++) {
        downloadContent = downloadContent.concat(
          `${data[ii][0]},${parseFloat(data[ii][1]).toExponential()}\r\n`
        );
      }

      downloadContent = downloadContent.concat(
        `${data[data.length - 1][0]},${parseFloat(
          data[data.length - 1][1]
        ).toExponential()}`
      );

      const element = document.createElement("a");
      const file = new Blob([downloadContent], { type: "text/csv" });
      element.href = URL.createObjectURL(file);
      element.download = outFilename + scan + ".csv";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    } else {
      setStatus(
        "Empty output! Please check your data file and inputs, and try again!"
      );
      alert(
        "Empty output! Please check your data file and inputs, and try again!"
      );
    }
  };

  const HandleUpload = (e) => {
    setFilename(e.target.files[0].name);
    const reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onload = async (e) => {
      const text = e.target.result;
      const content = text.split("\n");
      setContent(content);
      setStatus("File uploaded");
      setScan(-1);
    };
  };

  return (
    <div className="container">
      <h3>Process SUV beamline data</h3>
      <form className="form">
        <p>Select data file:</p>
        <input
          type="file"
          onChange={HandleUpload}
          style={{ width: "250px", fontSize: "0.9em" }}
        />
        <br />
        <br />
        <p>
          Set scan number (default <code>-1</code> reads the last scan):
        </p>
        <input
          type="number"
          id="scan"
          name="scan"
          value={scan}
          onChange={(e) => {
            setScan(parseInt(e.target.value));
          }}
        ></input>
        <br />
        <br />
        <p>
          Set X column index below (indexing starts from <code>0</code>):
        </p>
        <input
          type="number"
          id="xCol"
          name="xCol"
          value={xCol}
          onChange={(e) => {
            setXCol(parseInt(e.target.value));
          }}
        ></input>
        <br />
        <br />
        <p>Set Intensity column index below:</p>
        <input
          type="number"
          id="ICol"
          name="ICol"
          value={ICol}
          onChange={(e) => {
            setICol(parseInt(e.target.value));
          }}
        ></input>
        <br />
        <br />
        <p>
          Set I<sub>0</sub> column index below (leave <code>-1</code>, if you do
          not want to divide by I<sub>0</sub>):
        </p>
        <input
          type="number"
          id="I0Col"
          name="I0Col"
          value={I0Col}
          onChange={(e) => {
            setI0Col(parseInt(e.target.value));
          }}
        ></input>
      </form>

      <div>
        <button onClick={ProcessData} className="btn">
          Process data
        </button>
        <button onClick={() => window.location.reload()} className="btn">
          Clear All
        </button>
        <br />
        <br />
        <p>
          <code>
            <b>Status: </b>
            {status}
          </code>
        </p>
      </div>
      <p>
        <button className="btn" onClick={DownloadCSV}>
          Download CSV
        </button>
        <button className="btn" onClick={DownloadPlaintext}>
          Download Plaintext
        </button>
      </p>
      <p>
        <code>
          <b>{isColNames}</b>
          <br />
          {colNames.map((x, index) => (
            <li style={{ listStyle: "none" }} key={index}>
              {index} : {x}
            </li>
          ))}
        </code>
      </p>
      <br />
      <p style={{ textAlign: "center" }}>* * *</p>
      <p>
        This program will export X (say, energy or angle) and Intensity columns
        (or I/I<sub>0</sub>, if you have set I<sub>0</sub> index) to <b>.csv</b>{" "}
        and <b>.txt</b> plaintext formats.
        <br />
        <br />
        Your data columns will be listed above once processed. You can re-renter
        the columns above, and click <b>Process Data</b> button again if you
        have chosen wrong columns, or you can change the scan number to process
        multiple scans from the same input file. Note that column headers might
        not correspond to actual data columns, please consult with beamline
        personal about your data file format.
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
        file, the browser may not trigger the event this program relies on
        updating the states. In such cases, please use the <b>Clear All</b>{" "}
        button before uploading new file with the same name.
        <br />
        <br />A sample data file can be found{" "}
        <a href="./data.txt" target="_blank">
          here
        </a>
        . If you are interested in the Python app with more features, please
        visit <a href="https://pranabdas.github.io/suvtools/">this page</a>. If
        you find any bug or have some suggestions to improve this application,
        please let me know. Thank you.
      </p>
    </div>
  );
}

export default DataUploader;
