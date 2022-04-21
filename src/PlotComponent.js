import Plotly from "plotly.js-basic-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";

const Plot = createPlotlyComponent(Plotly);

function PlotComponent({ data }) {
  let xdata = [],
    ydata = [];
  for (let ii = 0; ii < data.length; ii++) {
    xdata.push(data[ii][0]);
    ydata.push(data[ii][1]);
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

  return (
    <Plot
      data={trace}
      config={{ responsive: true }}
      layout={{
        xaxis: { title: { text: "X-data" } },
        yaxis: { title: { text: "Y-data" } },
      }}
    />
  );
}

export default PlotComponent;
