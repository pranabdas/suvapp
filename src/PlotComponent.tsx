import Plotly from "plotly.js/dist/plotly-suv.min.js";
import createPlotlyComponent from "react-plotly.js/factory";
import { Data, Layout } from "plotly.js";

function PlotComponent({
  data,
  selectedCol,
  isYbyZ,
  isYScaleLog,
}: {
  data: number[][];
  selectedCol: { [key: string]: string };
  isYbyZ: boolean;
  isYScaleLog: boolean;
}): React.JSX.Element {
  // this is certainly a bad practice to define a component inside another
  // component, however Plotly itself does not follow all the react best
  // practices. At the moment defining Plot component outside of Plot3dSurface
  // creates some UI glitch. Defining it inside means Plot is a new component on
  // every re-render, this avoids the problem but sacrifices react optimizations.
  const Plot = createPlotlyComponent(Plotly);
  let xData: number[] = [];
  let yData: number[] = [];

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

  const trace: Data[] = [
    {
      x: xData,
      y: yData,
      mode: "lines",
      type: "scatter",
      marker: { color: "teal" },
    },
  ];

  let layout: Partial<Layout> = {
    xaxis: { title: { text: xLabel } },
    yaxis: { title: { text: yLabel } },
    font: { size: 14 },
  };

  if (isYScaleLog) {
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
