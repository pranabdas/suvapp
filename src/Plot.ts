import Plotly from "plotly.js/dist/plotly-suv.min.js";
import createPlotlyComponentFactory from "react-plotly.js/factory";
import type { Config } from "plotly.js";

const Plot = createPlotlyComponentFactory(Plotly);

export const plotConfig: Partial<Config> = {
  responsive: true,
  displayModeBar: true,
};

export default Plot;
