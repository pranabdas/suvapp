import React from "react";
import Plot from "react-plotly.js";

function PlotComponent() {
  const [scan, setScan] = React.useState(-1);
  const [content, setContent] = React.useState([]);
  const [colX, setColX] = React.useState(0);
  const [colY, setColY] = React.useState(0);
  const [plotData, setPlotData] = React.useState([]);

  const MakePlot = () => {
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

    let dataX = [];
    let dataY = [];

    for (let ii = 0; ii < data.length; ii++) {
      dataX.push(data[ii][colX]);
    }

    for (let ii = 0; ii < data.length; ii++) {
      dataY.push(data[ii][colY]);
    }

    setPlotData([
      {
        x: dataX,
        y: dataY,
        type: "line",
      },
    ]);
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

        <p>Set x-column</p>
        <input
          type="number"
          id="colX"
          name="colX"
          value={colX}
          onChange={(e) => {
            setColX(parseInt(e.target.value));
          }}
        ></input>

        <p>Set y-column</p>
        <input
          type="number"
          id="colY"
          name="colY"
          value={colY}
          onChange={(e) => {
            setColY(parseInt(e.target.value));
          }}
        ></input>
      </form>

      <p>
        <button onClick={MakePlot} className="btn">
          Make plot
        </button>
      </p>
      <Plot data={plotData} layout={{ width: "auto", height: "auto" }} />

      <button onClick={() => window.location.reload()} className="btn">
        Clear All
      </button>
    </div>
  );
}

export default PlotComponent;
