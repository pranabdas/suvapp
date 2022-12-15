import * as React from "react";
import { useState, useCallback, useRef, Suspense, lazy } from "react";
import { useDropzone } from "react-dropzone";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import { sha256 } from "crypto-hash";
import RenderTable from "./RenderTable";
import Footer from "./Footer";
import ConsoleTests from "./ConsoleTests";

const PlotComponent = lazy(() => import("./PlotComponent"));
const Plot3dSurface = lazy(() => import("./Plot3dSurface"));

function App(): JSX.Element {
  const [filename, setFilename] = useState("");
  const [content, setContent] = useState<string[]>([]);
  const [scan, setScan] = useState<number[]>([]);
  const [scanLine, setScanLine] = useState<number[]>([]);
  const [selectedScan, setSelectedScan] = useState<number | null>(null);
  const [colNames, setColNames] = useState<string[]>([]);
  const [selectedCol, setSelectedCol] = useState<{ [key: string]: string }>({
    xCol: "",
    yCol: "",
    zCol: "",
  });
  const [data, setData] = useState<number[][]>([]);
  const [isYbyZ, setIsYbyZ] = useState(false);
  const [showPlot, setShowPlot] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [isYScaleLog, setYScaleLog] = useState(false);
  const [is3dSurface, set3dSurface] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [SHA256, setSHA256] = useState("");
  const plotRef = useRef<null | HTMLElement>(null);
  const demoRef = useRef<null | HTMLElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.readAsText(file);

      let content: string[];
      reader.onload = async () => {
        const text = reader.result?.toString();
        if (text !== undefined) {
          // crypto-hash has issues on older firefox, use only in development
          if (process.env.NODE_ENV === "development") {
            setSHA256(await sha256(text));
          }
          content = splitByLineBreaks(text);
          setContent(content);
        }

        let tmpScan: number[] = [];
        let scanLine: number[] = [];

        for (let ii = 0; ii < content.length; ii++) {
          if (splitByWhiteSpaces(content[ii])[0] === "#S") {
            let tmpContent = splitByWhiteSpaces(content[ii]);
            tmpContent.filter((x: string) => x);
            let scanNumber = parseInt(tmpContent[1]);
            if (!isNaN(scanNumber)) {
              tmpScan.push(scanNumber);
              scanLine.push(ii + 1);
            }
          }
        }

        setFilename(file.name);
        setScan(tmpScan);
        setScanLine(scanLine);
      };
    });

    setData([]);
    setScan([]);
    setSelectedScan(null);
    setColNames([]);
    setSelectedCol({
      xCol: "",
      yCol: "",
      zCol: "",
    });

    setShowPlot(false);
    setShowData(false);
    set3dSurface(false);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, maxFiles: 1 });

  const handleSelectScan = (e: SelectChangeEvent) => {
    const selectedScan = parseInt(e.target.value);
    const selectedScanIndex = scan.indexOf(selectedScan);
    const lineStart = scanLine[selectedScanIndex];

    let lineEnd: number;
    if (selectedScanIndex === scan.length - 1) {
      lineEnd = content.length;
    } else {
      lineEnd = scanLine[selectedScanIndex + 1];
    }

    let tmpColNames: string[] = [];
    for (let ii = lineStart; ii < lineEnd; ii++) {
      if (content[ii].trim().slice(0, 2) === "#L") {
        tmpColNames = splitByWhiteSpaces(content[ii]);
        tmpColNames = tmpColNames.filter((x) => x); // not necessary as
        // splitByWhiteSpaces would eliminate any empty values
        tmpColNames.shift();
        break;
      }
    }

    // if column header is missing, assign numerical labels
    if (!(tmpColNames.length > 0)) {
      let singleDataRow: string[] = [];

      for (let ii = lineStart; ii < lineEnd; ii++) {
        if (content[ii].trim()[0] !== "#" && content[ii].trim()) {
          singleDataRow = splitByWhiteSpaces(content[ii]);
          singleDataRow = singleDataRow.filter((x) => x);
          break;
        }
      }

      for (let ii = 0; ii < singleDataRow.length; ii++) {
        tmpColNames.push("Col." + (ii + 1).toString());
      }
    }

    setColNames(tmpColNames);
    setSelectedScan(selectedScan);
    setShowPlot(false);
    setShowData(false);
    setData([]);
    set3dSurface(false);

    // reset col selection if not in current scan
    for (const key in selectedCol) {
      if (selectedCol[key] && !tmpColNames.includes(selectedCol[key])) {
        setSelectedCol({ ...selectedCol, [key]: "" });
      }
    }
  };

  const handleSelectCol = (e: SelectChangeEvent) => {
    const { name, value } = e.target;

    setSelectedCol({ ...selectedCol, [name]: value });
    setData([]);
    setShowPlot(false);
    setShowData(false);
  };

  const processData = () => {
    if (selectedScan !== null && isFinite(selectedScan)) {
      let selectedScanIndex: number;
      selectedScanIndex = scan.indexOf(selectedScan);
      const lineStart = scanLine[selectedScanIndex];

      let lineEnd: number;
      if (selectedScanIndex === scan.length - 1) {
        lineEnd = content.length;
      } else {
        lineEnd = scanLine[selectedScanIndex + 1] - 1;
      }

      let lineData: string[] = [];
      let fullData: string[][] = [];
      let tmpData: number[][] = [];

      for (let ii = lineStart; ii < lineEnd; ii++) {
        if (content[ii].trim()[0] !== "#" && content[ii].trim()) {
          lineData = splitByWhiteSpaces(content[ii]);
          lineData = lineData.filter((x) => x);
          fullData.push(lineData);
        }
      }
      const xColIndex = colNames.indexOf(selectedCol.xCol);
      const yColIndex = colNames.indexOf(selectedCol.yCol);

      if (selectedCol.zCol === "") {
        for (let ii = 0; ii < fullData.length; ii++) {
          tmpData.push([
            parseFloat(fullData[ii][xColIndex]),
            parseFloat(fullData[ii][yColIndex]),
          ]);
        }
      } else if (isYbyZ) {
        const zColIndex = colNames.indexOf(selectedCol.zCol);
        for (let ii = 0; ii < fullData.length; ii++) {
          tmpData.push([
            parseFloat(fullData[ii][xColIndex]),
            parseFloat(fullData[ii][yColIndex]) /
              parseFloat(fullData[ii][zColIndex]),
          ]);
        }
      } else if (!isYbyZ && selectedCol.zCol !== "") {
        const zColIndex = colNames.indexOf(selectedCol.zCol);
        for (let ii = 0; ii < fullData.length; ii++) {
          tmpData.push([
            parseFloat(fullData[ii][xColIndex]),
            parseFloat(fullData[ii][yColIndex]),
            parseFloat(fullData[ii][zColIndex]),
          ]);
        }
      }

      // detect 2D map data pattern
      if (
        selectedCol.xCol !== "" &&
        selectedCol.yCol !== "" &&
        selectedCol.zCol !== "" &&
        !isYbyZ
      ) {
        let xCol: number[] = [];
        let yCol: number[] = [];
        let zCol: number[] = [];

        tmpData.forEach((row) => {
          xCol.push(row[0]);
          yCol.push(row[1]);
          zCol.push(row[2]);
        });

        const xColUniq = xCol.filter(
          (value, index, self) => self.indexOf(value) === index
        );
        const yColUniq = yCol.filter(
          (value, index, self) => self.indexOf(value) === index
        );

        if (xColUniq.length * yColUniq.length === zCol.length) {
          set3dSurface(true);
        } else {
          set3dSurface(false);
        }
      } else {
        set3dSurface(false);
      }

      setData(tmpData);
      setShowPlot(false);
      setShowData(true);

      // console tests
      if (process.env.NODE_ENV === "development") {
        console.log("Debug mode: ON");

        if (
          SHA256 !==
          "f131a6ca6c57d8e57f6282c6d8ec36d765a3d40929f0a783184f795efbde8dcd"
        ) {
          console.warn(
            "Warning: File hash mismatch. Tests are based on the data file `Data.txt` included in the project under `public`."
          );
        }

        ConsoleTests(tmpData, selectedScan);
      }
    }
  };

  const handleYbyZ = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData([]);
    setShowPlot(false);
    setShowData(false);
    setIsYbyZ(e.target.checked);
  };

  const handleIsYScaleLog = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYScaleLog(e.target.checked);

    // setting showPlot to false and then immediately to true in order to force
    // rerender the PlotComponent, otherwise sometimes the footer is hidden
    // behind the plot.
    setShowPlot(false);
    setTimeout(() => {
      setShowPlot(true);
    }, 10);

    // without setTimeout scrollIntoView seems not working
    setTimeout(() => {
      plotRef.current!.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const handleShowPlot = () => {
    setShowPlot(!showPlot);
    if (showData) {
      setShowData(false);
    }

    setTimeout(() => {
      plotRef.current!.scrollIntoView({ behavior: "smooth" });
    }, 10);
  };

  const handleShowData = () => {
    setShowData(!showData);
    setShowPlot(false);
  };

  const saveData = () => {
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

  const copyData = () => {
    // every component under App will re-render upon any state changes
    // consider disabling Plot component while click copy button
    // setShowPlot(false);
    setTimeout(() => {
      setShowCopied(false);
    }, 1500);

    const dim = data[0].length;
    if (data.length > 0) {
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
        <h3
          style={{
            color: "#15847b",
            textAlign: "center",
            paddingBottom: "0.5em",
          }}
        >
          Explore SPEC-FOURC Data
        </h3>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {filename ? (
            <div className="dropzone">
              <p>
                Selected file: <b>{filename}</b>
                <br />
              </p>
              <p style={{ color: "grey", fontSize: "0.9em" }}>
                <i>
                  (If required, you can drop a new file in this box again, or
                  click to browse)
                </i>
              </p>
            </div>
          ) : (
            <div
              className="dropzone"
              style={{ paddingTop: "5em", paddingBottom: "5em" }}
            >
              <p>
                <b>Drop</b> your data file in this box, or <b>click</b> here to
                select.
              </p>
              <p style={{ color: "grey", fontSize: "0.9em" }}>
                <i>(Please drop or select a single file)</i>
              </p>
            </div>
          )}
        </div>

        {filename === "" && (
          <div
            ref={demoRef as React.RefObject<HTMLDivElement>}
            style={{ textAlign: "center" }}
          >
            <button
              onClick={() => {
                setShowDemo(!showDemo);
              }}
              className="btn"
            >
              {showDemo ? "Hide Demo" : "Watch Demo"}
            </button>
            <br />
            {showDemo && (
              <img
                src="./demo.gif"
                alt="Demo"
                width={"100%"}
                onLoad={() => {
                  demoRef.current!.scrollIntoView({ behavior: "smooth" });
                }}
              />
            )}
          </div>
        )}

        {filename !== "" &&
          (scan.length > 0 ? (
            <Alert severity="success">
              <b>{scan.length}</b> {scan.length > 1 ? "scans" : "scan"} found in
              the file <b>{filename}</b>.
            </Alert>
          ) : (
            <Alert severity="error">
              <b>No</b> scans found in the file <b>{filename}</b>. Please ensure
              SPEC/FOURC data format. A reference data file can be found{" "}
              <a href="https://suv.netlify.app/data.txt">here</a>. If you think
              it could be a bug, please file an issue via{" "}
              <a href="https://github.com/pranabdas/suvapp/issues">GitHub</a>.
            </Alert>
          ))}

        <br />

        {scan.length > 0 && (
          <>
            <p>Please select scan number:</p>
            <Box sx={{ m: 1, minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="scan">Scan</InputLabel>
                <Select
                  labelId="scan"
                  id="scan"
                  value={selectedScan?.toString() || ""}
                  label="Scan"
                  onChange={handleSelectScan}
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
        )}

        <br />

        {selectedScan !== null &&
          isFinite(selectedScan) &&
          (colNames.length > 0 ? (
            <>
              <p>
                Select data columns (<code>X</code> and <code>Y</code> columns
                are required, <code>Z</code> column is optional):
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
                <InputLabel id="yCol">Y-col</InputLabel>
                <Select
                  name="yCol"
                  id="yCol"
                  value={selectedCol.yCol || ""}
                  label="Y-Col"
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
                <InputLabel id="zCol">Z-col</InputLabel>
                <Select
                  name="zCol"
                  id="zCol"
                  value={selectedCol.zCol || ""}
                  label="Z-Col"
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
            <Alert severity="error">
              Sorry could not resolve columns! If you think it could be a bug,
              please file an issue via{" "}
              <a href="https://github.com/pranabdas/suvapp/issues">GitHub</a>.
            </Alert>
          ))}

        <br />

        {selectedCol.yCol !== "" && selectedCol.zCol !== "" && (
          <p>
            <Checkbox
              checked={isYbyZ}
              onChange={handleYbyZ}
              inputProps={{ "aria-label": "controlled" }}
            />
            I want to export <code>Y/Z</code>, instead of <code>Y</code> and{" "}
            <code>Z</code> columns separately.
          </p>
        )}

        {selectedCol.xCol !== "" &&
          selectedCol.yCol !== "" &&
          !(data.length > 0) && (
            <button onClick={processData} className="btn">
              Process data
            </button>
          )}

        {data.length > 0 && (
          <>
            <button onClick={saveData} className="btn">
              Save data
            </button>
            <button onClick={copyData} className="btn">
              {showCopied ? "Data copied" : "Copy data"}
            </button>

            {showData ? (
              <button onClick={handleShowData} className="btn">
                Hide table
              </button>
            ) : (
              <button onClick={handleShowData} className="btn">
                Show table
              </button>
            )}

            {showPlot ? (
              <button onClick={handleShowPlot} className="btn">
                Hide plot
              </button>
            ) : (
              <button onClick={handleShowPlot} className="btn">
                Show plot
              </button>
            )}
          </>
        )}

        <div ref={plotRef as React.RefObject<HTMLDivElement>}>
          {showPlot &&
            (is3dSurface ? (
              <Suspense fallback={<ShowLoading />}>
                <p>
                  <Checkbox
                    checked={isYScaleLog}
                    onChange={handleIsYScaleLog}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                  Plot Z-axis in logarithmic scale.
                </p>
                <Plot3dSurface
                  data={data}
                  selectedCol={selectedCol}
                  isYScaleLog={isYScaleLog}
                />
              </Suspense>
            ) : (
              <Suspense fallback={<ShowLoading />}>
                <p>
                  <Checkbox
                    checked={isYScaleLog}
                    onChange={handleIsYScaleLog}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                  Plot Y-axis in logarithmic scale.
                </p>
                <PlotComponent
                  data={data}
                  selectedCol={selectedCol}
                  isYbyZ={isYbyZ}
                  isYScaleLog={isYScaleLog}
                />
              </Suspense>
            ))}
        </div>

        <br />
        <br />

        {showData &&
          (data.length > 0 ? (
            selectedCol.zCol !== "" ? (
              isYbyZ ? (
                <table>
                  <tbody>
                    <tr>
                      <th>{selectedCol.xCol || "X-col"}</th>
                      <th>
                        {selectedCol.yCol + " / " + selectedCol.zCol ||
                          "Y-col / Z-col"}
                      </th>
                    </tr>
                    <RenderTable data={data} />
                  </tbody>
                </table>
              ) : (
                <table>
                  <tbody>
                    <tr>
                      <th>{selectedCol.xCol || "X-col"}</th>
                      <th>{selectedCol.yCol || "Y-col"}</th>
                      <th>{selectedCol.zCol || "Z-Col"}</th>
                    </tr>
                    <RenderTable data={data} />
                  </tbody>
                </table>
              )
            ) : (
              <table>
                <tbody>
                  <tr>
                    <th>{selectedCol.xCol || "X-col"}</th>
                    <th>{selectedCol.yCol || "Y-col"}</th>
                  </tr>
                  <RenderTable data={data} />
                </tbody>
              </table>
            )
          ) : (
            <Alert severity="error">
              No data to show! If you think it could be a bug, please file an
              issue via{" "}
              <a href="https://github.com/pranabdas/suvapp/issues">GitHub</a>.
            </Alert>
          ))}
      </div>
      <Footer />
    </div>
  );
}

// Do not define a React component inside another, React would create such
// components as new on each re-render hindering optimizations
const ShowLoading = (): JSX.Element => {
  return (
    <>
      <Box style={{ fontSize: "1.1em", color: "grey" }}>
        <CircularProgress size={16} /> Loading plot modules. Please wait...
      </Box>
    </>
  );
};

const splitByLineBreaks = (content: string) => {
  return content
    .replace(/\r/g, "\n") // convert carriage return `\r` to `\n`
    .replace(/[\n]+/g, "\n") // replace multiple consecutive `\n` by single `\n`
    .replace(/^\n/, "") // remove any new line character at the beginning
    .replace(/\n$/, "") // trim any new line character at the end
    .split("\n");
};

const splitByWhiteSpaces = (line: string) => {
  return line
    .replace(/\t/g, " ") // replace tab character by space
    .replace(/[\s]+/g, " ") // replace multiple space characters by single one
    .trim() // trim any beginning or trailing spaces
    .split(/\s/);
};

export default App;
