import React from "react";
import { CSVLink } from "react-csv";

function DataUploader() {
  const [scan, setScan] = React.useState(-1);
  const [content, setContent] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [status, setStatus] = React.useState("Not processed");
  const [colNames, setColNames] = React.useState([]);
  const [energyCol, setEnergyCol] = React.useState(0);
  const [ICol, setICol] = React.useState(1);
  const [I0Col, setI0Col] = React.useState(-1);

  const ProcessData = () => {
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
    } else {
      id = scanId.indexOf(scan);
    }

    let lineStart = lineId[id];
    let lineEnd;

    if (id === scanId.length - 1) {
      lineEnd = content.length - 1;
    } else {
      lineEnd = lineId[id + 1] - 1;
    }

    let data = [];
    for (let ii = 0; ii < lineEnd - lineStart; ii++) {
      if (content[ii + lineStart][0] !== "#" && content[ii + lineStart]) {
        data.push(content[ii + lineStart].split(" "));
      } else if (
        content[ii + lineStart][0] === "#" &&
        content[ii + lineStart][1] === "L"
      ) {
        let colNames = content[ii + lineStart];
        colNames = colNames.split(" ");
        colNames = colNames.filter((x) => x);
        colNames.shift();
        setColNames(colNames);
      }
    }

    // convert intensity values to number instead of str
    for (let ii = 0; ii < data.length; ii++) {
      for (let jj = 0; jj < data[0].length; jj++) {
        data[ii][jj] = parseFloat(data[ii][jj]);
      }
    }

    // export only Energy and I/I0
    let newData = new Array(data.length);

    if (I0Col === -1) {
      for (let ii = 0; ii < data.length; ii++) {
        newData[ii] = [data[ii][energyCol], data[ii][ICol].toExponential()];
      }
    } else {
      for (let ii = 0; ii < data.length; ii++) {
        newData[ii] = [
          data[ii][energyCol],
          (data[ii][ICol] / data[ii][I0Col]).toExponential(),
        ];
      }
    }

    setData(newData);

    if (data.length > 0) {
      setStatus("Processing done");
    } else {
      setStatus("Empty data");
    }
  };

  const HandleUpload = (e) => {
    const reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onload = async (e) => {
      const text = e.target.result;
      const content = text.split("\n");
      setContent(content);
    };
  };

  return (
    <div className="container">
      <h3>Process SUV beamline data</h3>
      <form className="form">
        <p>Select data file:</p>
        <input type="file" onChange={HandleUpload} />
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
          id="energyCol"
          name="energyCol"
          value={energyCol}
          onChange={(e) => {
            setEnergyCol(parseInt(e.target.value));
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

      <p>
        <button onClick={ProcessData} className="btn">
          Process data
        </button>
        ({status})
      </p>
      <p>
        <i>
          It will export X (say, energy or angle) and Intensity columns (or I/I
          <sub>0</sub>, if you have set I<sub>0</sub> index) to <b>.csv</b>{" "}
          format, which can be read by other programs (virtually every plotting
          software, spreadsheet software, and text editors can read <b>.csv</b>{" "}
          file).
        </i>
      </p>

      <h4>
        <button className="dwbtn">
          <CSVLink data={data}>Download CSV</CSVLink>
        </button>
      </h4>
      <p>
        <i>
          Your data columns will be listed bellow once processed. You can
          re-renter the columns above, and click <b>Process Data</b> button
          again if you have chosen wrong columns. Note that column headers might
          not correspond to actual data columns, please consult with beamline
          personal about your data file format.
        </i>
      </p>
      <p>
        {colNames.map((x, index) => (
          <li key={index}>
            {index} : {x}
          </li>
        ))}
      </p>

      <button onClick={() => window.location.reload()} className="btn">
        Clear All
      </button>
      <br />
      <br />
      <p>
        A sample data file can be found{" "}
        <a href="./data.txt" target="_blank">
          here
        </a>
        .
      </p>
      <p>
        If you are interested in the Python app with more features, please visit{" "}
        <a href="https://pranabdas.github.io/suvtools/">this page</a>.
      </p>
    </div>
  );
}

export default DataUploader;
