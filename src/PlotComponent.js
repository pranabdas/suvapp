import Plotly from "plotly.js-basic-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";

const Plot = createPlotlyComponent(Plotly);

function PlotComponent({ data, selectedCol, IbyI0 }) {
  let xdata = [],
    ydata = [];
  for (let ii = 0; ii < data.length; ii++) {
    xdata.push(data[ii][0]);
    ydata.push(data[ii][1]);
  }

  const xlabel = selectedCol.xCol;
  let ylabel = "Y-data";

  if (selectedCol.I0Col) {
    if (IbyI0) {
      ylabel = selectedCol.ICol + " / " + selectedCol.I0Col;
    } else {
      ylabel = selectedCol.ICol;
    }
  } else {
    ylabel = selectedCol.ICol;
  }

  const trace = [
    {
      x: xdata,
      y: ydata,
      mode: "lines",
      type: "scatter",
      marker: { color: "teal" },
    },
  ];

  const layout = {
    xaxis: { title: { text: xlabel } },
    yaxis: { title: { text: ylabel } },
  };

  return <Plot data={trace} config={{ responsive: true }} layout={layout} />;
}

export default PlotComponent;
