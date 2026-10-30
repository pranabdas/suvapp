import { useMemo } from "react";
import { Data, Layout } from "plotly.js";
import Plot, { plotConfig } from "./Plot";

// with `responsive` and autosize, Plotly sizes the graph to 100% of this div
// on updates, so the div needs its own width and height
const plotStyle = { width: "100%", height: "450px" };

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
  const yLabel =
    selectedCol.zCol !== "" && isYbyZ
      ? `${selectedCol.yCol} / ${selectedCol.zCol}`
      : selectedCol.yCol;

  const trace = useMemo<Data[]>(() => {
    const x: number[] = [];
    const y: number[] = [];
    data.forEach((row) => {
      x.push(row[0]);
      y.push(row[1]);
    });
    return [
      {
        x,
        y,
        mode: "lines",
        type: "scatter",
        marker: { color: "teal" },
      },
    ];
  }, [data]);

  const layout = useMemo<Partial<Layout>>(
    () => ({
      xaxis: { title: { text: selectedCol.xCol } },
      yaxis: isYScaleLog
        ? { title: { text: yLabel }, type: "log" }
        : { title: { text: yLabel } },
      font: { size: 14 },
    }),
    [selectedCol.xCol, yLabel, isYScaleLog]
  );

  return (
    <Plot data={trace} config={plotConfig} layout={layout} style={plotStyle} />
  );
}

export default PlotComponent;
