import Plotly from "plotly.js/dist/plotly-suv.min.js";
import createPlotlyComponent from "react-plotly.js/factory";

function PlotComponent({ data, selectedCol, isYbyZ, isYscaleLog }) {
  // this is certainly a bad practice to define a component inside another
  // component, however Plotly itself does not follow all the react best
  // practices. At the moment defining Plot compoent outside of Plot3dSurface
  // creates some UI glitch. Defining it inside means Plot is a new component on
  // every re-render, this avoids the problem but sacrifices react optimizations.
  const Plot = createPlotlyComponent(Plotly);
  let xData = [];
  let yData = [];

  data.forEach((row) => {
    xData.push(row[0]);
    yData.push(row[1]);
  });

  const xLabel = selectedCol.xCol;
  let yLabel = "Y-data";

  if (selectedCol.zCol !== "") {
    if (isYbyZ) {
      yLabel = selectedCol.yCol + " / " + selectedCol.zCol;
    } else {
      yLabel = selectedCol.yCol;
    }
  } else {
    yLabel = selectedCol.yCol;
  }

  const trace = [
    {
      x: xData,
      y: yData,
      mode: "lines",
      type: "scatter",
      marker: { color: "teal" },
    },
  ];

  let layout = {
    xaxis: { title: { text: xLabel } },
    yaxis: { title: { text: yLabel } },
    font: { size: 14 },
  };

  if (isYscaleLog) {
    layout = {
      ...layout,
      yaxis: { title: { text: yLabel }, type: "log" },
    };
  }

  return (
    <Plot
      data={trace}
      config={{ responsive: true, displayModeBar: true }}
      layout={layout}
    />
  );
}

export default PlotComponent;
