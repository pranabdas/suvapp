import { useState, useRef } from "react";
import PlotComponent from "./PlotComponent";
import RenderTable from "./RenderTable";
import * as React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

function App() {
  const [filename, setFilename] = useState(null);
  const [content, setContent] = useState([]);
  const [scan, setScan] = useState([]);
  const [scanLine, setScanLine] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [colNames, setColNames] = useState([]);
  const [selectedCol, setSelectedCol] = useState({
    xCol: "",
    ICol: "",
    I0Col: "",
  });
  const [data, setData] = useState([]);
  const [IbyI0, setIbyI0] = useState(true);
  const [showPlot, setShowPlot] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const ploRef = useRef();

  const HandleUpload = (e) => {
    const fname = e.target.files[0].name;
    setFilename(fname);
    const reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onload = async (e) => {
      const text = e.target.result;
      const content = text.split("\n");
      setContent(content);

      let tmpScan = [],
        scanLine = [];

      for (let ii = 0; ii < content.length; ii++) {
        if (content[ii].split(" ")[0] === "#S") {
          tmpScan.push(parseInt(content[ii].split(" ")[1]));
          scanLine.push(ii + 1);
        }
      }

      setScan(tmpScan);
      setScanLine(scanLine);
    };
    setData([]);
    setScan([]);
    setSelectedScan(null);
    setColNames([]);
    setSelectedCol({
      xCol: "",
      ICol: "",
      I0Col: "",
    });
    setIbyI0(true);
    setShowPlot(false);
    setShowData(false);
  };

  const handleSelect = (e) => {
    e.preventDefault();
    const selectedScan = parseInt(e.target.value);

    const selectedScanIndex = scan.indexOf(selectedScan);
    const lineStart = scanLine[selectedScanIndex];

    let lineEnd;
    if (selectedScanIndex === scan.length - 1) {
      lineEnd = content.length;
    } else {
      lineEnd = scanLine[selectedScanIndex + 1];
    }

    let tmpColNames = [];
    for (let ii = lineStart; ii < lineEnd; ii++) {
      if (content[ii].slice(0, 2) === "#L") {
        tmpColNames = content[ii];
        tmpColNames = tmpColNames.split(" ");
        tmpColNames = tmpColNames.filter((x) => x);
        tmpColNames.shift();
        break;
      }
    }

    setColNames(tmpColNames);
    setSelectedScan(selectedScan);
    setShowPlot(false);
    setShowData(false);
    setIbyI0(true);
    setData([]);
  };

  const handleSelectCol = (e) => {
    e.preventDefault();
    const value = e.target.value;
    const name = e.target.name;

    setSelectedCol({ ...selectedCol, [name]: value });
    setData([]);
    setShowPlot(false);
    setShowData(false);
    setIbyI0(true);
  };

  const ProcessData = () => {
    const selectedScanIndex = scan.indexOf(selectedScan);
    const lineStart = scanLine[selectedScanIndex];

    let lineEnd;
    if (selectedScanIndex === scan.length - 1) {
      lineEnd = content.length;
    } else {
      lineEnd = scanLine[selectedScanIndex + 1];
    }

    let lineData = [],
      fullData = [],
      tmpData = [];

    for (let ii = lineStart; ii < lineEnd; ii++) {
      if (content[ii][0] !== "#" && content[ii]) {
        lineData = content[ii].split(" ");
        lineData = lineData.filter((x) => x);
        fullData.push(lineData);
      }
    }

    const xColIndex = colNames.indexOf(selectedCol.xCol);
    const IColIndex = colNames.indexOf(selectedCol.ICol);

    if (!selectedCol.I0Col) {
      for (let ii = 0; ii < fullData.length; ii++) {
        tmpData.push([
          parseFloat(fullData[ii][xColIndex]),
          parseFloat(fullData[ii][IColIndex]),
        ]);
      }
    } else if (IbyI0) {
      const I0ColIndex = colNames.indexOf(selectedCol.I0Col);
      for (let ii = 0; ii < fullData.length; ii++) {
        tmpData.push([
          parseFloat(fullData[ii][xColIndex]),
          parseFloat(fullData[ii][IColIndex]) /
            parseFloat(fullData[ii][I0ColIndex]),
        ]);
      }
    } else if (!IbyI0 && selectedCol.I0Col) {
      const I0ColIndex = colNames.indexOf(selectedCol.I0Col);
      for (let ii = 0; ii < fullData.length; ii++) {
        tmpData.push([
          parseFloat(fullData[ii][xColIndex]),
          parseFloat(fullData[ii][IColIndex]),
          parseFloat(fullData[ii][I0ColIndex]),
        ]);
      }
    }
    setData(tmpData);
    setShowPlot(false);
    setShowData(true);
  };

  const HandleCheckbox = (e) => {
    setData([]);
    setShowPlot(false);
    setIbyI0(e.target.checked);
  };

  const SetShowPlot = () => {
    setShowPlot(!showPlot);
    setShowData(false);
    ploRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const SetShowData = () => {
    setShowData(!showData);
    setShowPlot(false);
  };

  const SaveData = () => {
    let outFilename;
    const dim = data[0].length;

    if (
      [".csv", ".dat", ".txt"].includes(
        filename.slice(filename.length - 4, filename.length).toLowerCase()
      )
    ) {
      outFilename = filename.slice(0, filename.length - 4) + "_scan_";
    } else {
      outFilename = filename + "_scan_";
    }

    let downloadContent = "";

    for (let ii = 0; ii < data.length; ii++) {
      if (dim === 2) {
        downloadContent = downloadContent.concat(
          `${data[ii][0]}\t${data[ii][1]}\r\n`
        );
      } else if (dim === 3) {
        downloadContent = downloadContent.concat(
          `${data[ii][0]}\t${data[ii][1]}\t${data[ii][2]}\r\n`
        );
      }
    }

    const element = document.createElement("a");
    const file = new Blob([downloadContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = outFilename + selectedScan + ".txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const CopyData = () => {
    setTimeout(() => {
      setShowCopied(false);
    }, 1500);

    const dim = data[0].length;
    if (data.length) {
      let dataContent = "";

      for (let ii = 0; ii < data.length; ii++) {
        if (dim === 2) {
          dataContent = dataContent.concat(
            `${data[ii][0]}\t${data[ii][1]}\r\n`
          );
        } else if (dim === 3) {
          dataContent = dataContent.concat(
            `${data[ii][0]}\t${data[ii][1]}\t${data[ii][2]}\r\n`
          );
        }
      }
      navigator.clipboard.writeText(dataContent);
      setShowCopied(true);
    } else {
      navigator.clipboard.writeText("");
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <h3 style={{ color: "#15847b" }}>Convert SUV beamline data</h3>
        <hr />
        <br />
        <form className="form">
          <p>
            Select data file:&emsp;
            <input
              type="file"
              onChange={HandleUpload}
              style={{ width: "300px", cursor: "pointer" }}
              title="Select file"
            />
          </p>
        </form>

        {filename ? (
          scan.length ? (
            <Alert severity="success">
              {scan.length} scan(s) found in the file <b>{filename}</b>.
            </Alert>
          ) : (
            <Alert severity="error">
              No scans found in the file <b>{filename}</b>. Please check the
              data file format.
            </Alert>
          )
        ) : null}

        {scan.length ? (
          <>
            <br />
            <p>Select scan :</p>
            <Box sx={{ m: 1, minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="scan">Scan</InputLabel>
                <Select
                  labelId="scan"
                  id="scan"
                  value={selectedScan || ""}
                  label="Scan"
                  onChange={handleSelect}
                >
                  {scan.map((item, key) => (
                    <MenuItem value={item} key={key}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </>
        ) : null}

        <br />

        {selectedScan ? (
          colNames.length ? (
            <>
              <p>
                Select data columns (first and second columns are required, last
                column is optional):
              </p>
              <FormControl required sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="xCol">X-col</InputLabel>
                <Select
                  name="xCol"
                  id="xCol"
                  value={selectedCol.xCol || ""}
                  label="X-Col"
                  onChange={handleSelectCol}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {colNames.map((item, key) => (
                    <MenuItem value={item} key={key}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl required sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="ICol">I-col</InputLabel>
                <Select
                  name="ICol"
                  id="ICol"
                  value={selectedCol.ICol || ""}
                  label="I-Col"
                  onChange={handleSelectCol}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {colNames.map((item, key) => (
                    <MenuItem value={item} key={key}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="I0Col">
                  I<sub>0</sub>-col
                </InputLabel>
                <Select
                  name="I0Col"
                  id="I0Col"
                  value={selectedCol.I0Col || ""}
                  label="I0-Col"
                  onChange={handleSelectCol}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {colNames.map((item, key) => (
                    <MenuItem value={item} key={key}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          ) : (
            <Alert severity="error">Oops column header missing!</Alert>
          )
        ) : null}

        <br />

        {selectedCol.ICol && selectedCol.I0Col ? (
          <>
            <p>
              <Checkbox
                checked={IbyI0}
                onChange={HandleCheckbox}
                inputProps={{ "aria-label": "controlled" }}
              />
              I want to export I/I<sub>0</sub>, instead of I and I<sub>0</sub>{" "}
              columns separately.
            </p>
          </>
        ) : null}

        {selectedCol.xCol && selectedCol.ICol ? (
          <button onClick={ProcessData} className="btn">
            Process Data
          </button>
        ) : null}

        <br />
        <br />
        {data.length ? (
          <>
            <button onClick={SaveData} className="btn">
              Save data
            </button>
            <button onClick={CopyData} className="btn">
              {showCopied ? "Data copied" : "Copy data"}
            </button>
          </>
        ) : null}

        <div ref={ploRef}>
          <br />
          {showData && data.length ? (
            <button onClick={SetShowData} className="btn">
              Hide Data
            </button>
          ) : null}

          {!showData && data.length ? (
            <button onClick={SetShowData} className="btn">
              Show Data
            </button>
          ) : null}

          {showPlot && data.length ? (
            <button onClick={SetShowPlot} className="btn">
              Hide Plot
            </button>
          ) : null}

          {!showPlot && data.length ? (
            <button onClick={SetShowPlot} className="btn">
              Show Plot
            </button>
          ) : null}
        </div>

        {showPlot ? (
          <PlotComponent data={data} selectedCol={selectedCol} IbyI0={IbyI0} />
        ) : null}

        <br />
        <br />

        {showData ? (
          <div>
            {data.length && IbyI0 ? (
              <table>
                <tbody>
                  <tr>
                    <th>{selectedCol.xCol || "X-col"}</th>
                    {selectedCol.I0Col ? (
                      <th>
                        {selectedCol.ICol + " / " + selectedCol.I0Col ||
                          "I-col / I0-col"}
                      </th>
                    ) : (
                      <th>{selectedCol.ICol || "I-col"}</th>
                    )}
                  </tr>
                  <RenderTable data={data} />
                </tbody>
              </table>
            ) : null}

            {data.length && !IbyI0 ? (
              <table>
                <tbody>
                  <tr>
                    <th>{selectedCol.xCol || "X-col"}</th>
                    <th>{selectedCol.ICol || "X-col"}</th>
                    <th>{selectedCol.I0Col || "I0-Col"}</th>
                  </tr>
                  <RenderTable data={data} />
                </tbody>
              </table>
            ) : null}
          </div>
        ) : null}
      </div>
      <footer>
        {/* The previous version of the app is available <a href="./v1/">here</a>. */}
        Built and maintained by{" "}
        <a href="https://github.com/pranabdas/suvapp">Pranab Das</a>.
      </footer>
    </div>
  );
}

export default App;
