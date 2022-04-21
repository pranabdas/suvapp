import { useState } from "react";
import PlotComponent from "./PlotComponent";
import RenderTable from "./RenderTable";

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
    I0Col: "None selected",
  });
  const [data, setData] = useState([]);
  const [IbyI0, setIbyI0] = useState(true);
  const [showPlot, setShowPlot] = useState(false);

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
    setData([]);
  };

  const handleSelectCol = (e) => {
    e.preventDefault();
    const value = e.target.value;
    const name = e.target.name;

    setSelectedCol({ ...selectedCol, [name]: value });
    setData([]);
    setShowPlot(false);
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

    if (selectedCol.I0Col === "None selected") {
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
    } else if (!IbyI0 && selectedCol.I0Col !== "None Selected") {
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
  };

  const HandleCheckbox = (e) => {
    setData([]);
    setShowPlot(false);
    setIbyI0(e.target.checked);
  };

  const SetShowPlot = () => {
    setShowPlot(!showPlot);
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
    } else {
      navigator.clipboard.writeText("");
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <h3>SUV App</h3>
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
            <p>{scan.length} scan(s) found.</p>
          ) : (
            <p>No scans found.</p>
          )
        ) : null}

        {scan.length ? (
          <form className="form" onChange={handleSelect}>
            <label htmlFor="scan">Choose scan: &nbsp;</label>
            <select id="scan" name="scan">
              <option value="None selected">None Selected</option>
              {scan.map((item, key) => (
                <option value={item} key={key}>
                  {item}
                </option>
              ))}
            </select>
          </form>
        ) : null}

        {selectedScan ? (
          colNames.length ? (
            <form className="form" onChange={handleSelectCol}>
              <label htmlFor="xCol">Choose xCol: &nbsp;</label>
              <select id="xCol" name="xCol">
                <option value="None selected">None Selected</option>
                {colNames.map((item, key) => (
                  <option value={item} key={key}>
                    {item}
                  </option>
                ))}
              </select>
              <br />
              <label htmlFor="ICol">Choose ICol: &nbsp;</label>
              <select id="ICol" name="ICol">
                <option value="None selected">None Selected</option>
                {colNames.map((item, key) => (
                  <option value={item} key={key}>
                    {item}
                  </option>
                ))}
              </select>
              <br />
              <label htmlFor="I0Col">Choose I0Col: &nbsp;</label>
              <select id="I0Col" name="I0Col">
                <option value="None selected">None Selected</option>
                {colNames.map((item, key) => (
                  <option value={item} key={key}>
                    {item}
                  </option>
                ))}
              </select>
            </form>
          ) : (
            <p>Column name header not found</p>
          )
        ) : null}

        {selectedCol.ICol && selectedCol.I0Col !== "None selected" ? (
          <p>
            <input
              type="checkbox"
              style={{ width: "25px" }}
              id="IbyI0"
              name="IbyI0"
              checked={IbyI0}
              onChange={HandleCheckbox}
            />
            I want to export I/I<sub>0</sub>, instead of I and I<sub>0</sub>{" "}
            columns separately.
          </p>
        ) : null}

        {selectedCol.xCol && selectedCol.ICol ? (
          <>
            <button onClick={ProcessData} className="btn">
              Process Data
            </button>

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
          </>
        ) : null}

        {data.length ? (
          <>
            <button onClick={SaveData} className="btn">
              Save
            </button>
            <button onClick={CopyData} className="btn">
              Copy
            </button>
          </>
        ) : null}

        {showPlot ? <PlotComponent data={data} /> : null}

        <br />
        <br />
        {data.length && IbyI0 ? (
          <table>
            <tbody>
              <tr>
                <th>X-Col</th>
                <th>I-Col</th>
              </tr>
              <RenderTable data={data} />
            </tbody>
          </table>
        ) : null}

        {data.length && !IbyI0 ? (
          <table>
            <tbody>
              <tr>
                <th>X-Col</th>
                <th>I-Col</th>
                <th>
                  I<sub>0</sub>-Col
                </th>
              </tr>
              <RenderTable data={data} />
            </tbody>
          </table>
        ) : null}
      </div>
      <footer>
        The previous version of the app is available <a href="./v1/">here</a>.
        Built and maintained by{" "}
        <a href="https://github.com/pranabdas/xps">Pranab Das</a>.
      </footer>
    </div>
  );
}

export default App;
