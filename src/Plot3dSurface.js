// requires full version of Plotly
// npm i plotly.js
// build size becomes ~24MB
import Plot from "react-plotly.js";

function Plot3dSurface({ data, selectedCol, isYscaleLog }) {
  let xData = [],
    yData = [],
    zData = [];

  for (let ii = 0; ii < data.length; ii++) {
    xData.push(data[ii][0]);
    yData.push(data[ii][1]);
    zData.push(data[ii][2]);
  }

  if (isYscaleLog) {
    for (let ii = 0; ii < zData.length; ii++) {
      zData[ii] = Math.log10(zData[ii]);
    }
  }

  let xDataUniq = xData.filter(
    (value, index, self) => self.indexOf(value) === index
  );
  let yDataUniq = yData.filter(
    (value, index, self) => self.indexOf(value) === index
  );

  for (let ii = 0; ii < xDataUniq.length; ii++) {
    xDataUniq[ii] = parseFloat(xDataUniq[ii]);
  }

  for (let ii = 0; ii < yDataUniq.length; ii++) {
    yDataUniq[ii] = parseFloat(yDataUniq[ii]);
  }

  let zDataFinal = [];

  for (let ii = 0; ii < yDataUniq.length; ii++) {
    let row = [];
    for (let jj = 0; jj < xDataUniq.length; jj++) {
      row.push(0);
    }
    zDataFinal.push(row);
  }

  for (let ii = 0; ii < data.length; ii++) {
    let xIndex = xDataUniq.indexOf(xData[ii]);
    let yIndex = yDataUniq.indexOf(yData[ii]);
    zDataFinal[yIndex][xIndex] = zData[ii];
  }

  const xLabel = selectedCol.xCol,
    yLabel = selectedCol.yCol,
    zLabel = selectedCol.zCol;

  const trace = [
    {
      x: xDataUniq,
      y: yDataUniq,
      z: zDataFinal,
      type: "surface",
      colorscale: "Jet",
      contours: {
        z: {
          show: true,
          usecolormap: true,
          project: { z: true },
        },
      },
    },
  ];

  const contour = [
    {
      x: xDataUniq,
      y: yDataUniq,
      z: zDataFinal,
      type: "contour",
      colorscale: "Jet",
    },
  ];

  const layout = {
    title: "3D surface plot",
    scene: {
      xaxis: { title: { text: xLabel } },
      yaxis: { title: { text: yLabel } },
      zaxis: { title: { text: zLabel } },
    },
    font: { size: 14 },
    autosize: false,
    width: 600,
    height: 600,
    margin: {
      l: 65,
      r: 50,
      b: 65,
      t: 90,
    },
  };

  const layoutContour = {
    title: "Contour plot",
    xaxis: { title: { text: xLabel } },
    yaxis: { title: { text: yLabel } },
    zaxis: { title: { text: zLabel } },
    font: { size: 14 },
    autosize: false,
    width: 600,
    height: 600,
    margin: {
      l: 65,
      r: 50,
      b: 65,
      t: 90,
    },
  };

  return (
    <>
      <Plot
        data={trace}
        config={{ responsive: true, displayModeBar: true }}
        layout={layout}
      />

      <br />
      <Plot
        data={contour}
        config={{ responsive: true, displayModeBar: true }}
        layout={layoutContour}
      />
    </>
  );
}

export default Plot3dSurface;
