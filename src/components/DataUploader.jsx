import React from "react";
import { CSVLink } from "react-csv";

function DataUploader() {
  const [scan, setScan] = React.useState(-1);
  const [content, setContent] = React.useState([]);
  const [data, setData] = React.useState([]);

  const RefreshPage = () => {
    window.location.reload();
  };

  const ProcessData = () => {
    // find scan id and corresponding line numbers
    let scanId = [];
    let lineId = [];

    for (let ii = 0; ii < content.length; ii++) {
      if (content[ii].split(" ")[0] === "#S") {
        scanId.push(parseInt(content[ii].split(" ")[1]));
        lineId.push(ii + 1);
      };
    };

    let id;
    if (scan === -1) {
      id = scanId.length - 1;
    } else {
      id = scanId.indexOf(scan);
    }

    let lineStart = lineId[id];
    let lineEnd;

    if (scan === -1) {
      lineEnd = content.length - 1;
    } else {
      lineEnd = lineId[id + 1] - 1;
    }

    let data = [];
    for (let ii = 0; ii < lineEnd - lineStart; ii++) {
      if (content[ii + lineStart][0] !== "#") {
        data.push(content[ii + lineStart].split(" "));
      }
    }

    // convert intensity values to number instead of str
    for (let ii = 0; ii < data.length; ii++) {
      for (let jj = 0; jj < data[0].length; jj++) {
        data[ii][jj] = parseFloat(data[ii][jj]);
      }
    }
    setData(data);
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

      <p>Select data file:</p>
      <form className="form">
      <input type="file" onChange={HandleUpload} />
      </form>

      <p>Set scan number (by default it will process last scan):</p>
      <form className="form">
      <input
        type="number"
        id="scan"
        name="scan"
        value={scan}
        onChange={(e) => {
          setScan(parseInt(e.target.value));
        }}
      ></input>
      </form>

      <p><button onClick={ ProcessData } className="btn">Process data</button></p>
      <p>&nbsp;&nbsp;<CSVLink data={data}>Download CSV</CSVLink></p>
      <button onClick={RefreshPage} className="btn">Clear All</button>
    </div>
  );
}

export default DataUploader;
