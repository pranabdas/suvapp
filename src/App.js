import { useState } from "react";

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
    setData([]);
  };

  const handleSelectCol = (e) => {
    e.preventDefault();
    const value = e.target.value;
    const name = e.target.name;

    setSelectedCol({ ...selectedCol, [name]: value });
    setData([]);
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
  };

  const HandleCheckbox = (e) => {
    setData([]);
    setIbyI0(e.target.checked);
  };

  return (
    <div className="container">
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

      {selectedCol.ICol && selectedCol.I0Col ? (
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
        <button onClick={ProcessData} className="btn">
          Process Data
        </button>
      ) : null}

      {data.length && IbyI0 ? (
        <table>
          <tbody>
            <tr>
              <th>X-Col</th>
              <th>I-Col</th>
            </tr>
            {data.map((value, key) => (
              <tr key={key}>
                <td>
                  <code>{parseFloat(value[0])}</code>
                </td>
                <td>
                  <code>{parseFloat(value[1]).toExponential()}</code>
                </td>
              </tr>
            ))}
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
            {data.map((value, key) => (
              <tr key={key}>
                <td>
                  <code>{parseFloat(value[0])}</code>
                </td>
                <td>
                  <code>{parseFloat(value[1]).toExponential()}</code>
                </td>
                <td>
                  <code>{parseFloat(value[2]).toExponential()}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}

export default App;
