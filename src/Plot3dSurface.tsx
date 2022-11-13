import Plotly from "plotly.js/dist/plotly-suv.min.js";
import createPlotlyComponent from "react-plotly.js/factory";
import { Data, PlotData, Layout } from "plotly.js";

interface SurfacePlotData extends PlotData {
  contours: {
    z: {
      show: boolean;
      usecolormap: boolean;
      project: { z: boolean };
    };
  };
}

interface LayoutContour extends Layout {
  zaxis: { title: { text: string } };
}

function Plot3dSurface({
  data,
  selectedCol,
  isYScaleLog,
}: {
  data: number[][];
  selectedCol: { [key: string]: string };
  isYScaleLog: boolean;
}): JSX.Element {
  const Plot = createPlotlyComponent(Plotly);
  let xData: number[] = [];
  let yData: number[] = [];
  let zData: number[] = [];

  data.forEach((row) => {
    xData.push(row[0]);
    yData.push(row[1]);
    if (isYScaleLog) {
      zData.push(Math.log10(row[2]));
    } else {
      zData.push(row[2]);
    }
  });

  let xDataUniq = xData.filter(
    (value, index, self) => self.indexOf(value) === index
  );
  let yDataUniq = yData.filter(
    (value, index, self) => self.indexOf(value) === index
  );

  let zDataFinal: number[][] = [];
  let zeros: number[] = Array(xDataUniq.length).fill(0);

  for (let ii = 0; ii < yDataUniq.length; ii++) {
    zDataFinal.push([...zeros]); // make deep copies instead of mutating
  }

  for (let ii = 0; ii < data.length; ii++) {
    let xIndex = xDataUniq.indexOf(xData[ii]);
    let yIndex = yDataUniq.indexOf(yData[ii]);
    zDataFinal[yIndex][xIndex] = zData[ii];
  }

  const { xCol, yCol, zCol } = selectedCol;

  const trace: Partial<SurfacePlotData>[] = [
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

  const contour: Data[] = [
    {
      x: xDataUniq,
      y: yDataUniq,
      z: zDataFinal,
      type: "contour",
      colorscale: "Jet",
    },
  ];

  const layout: Partial<Layout> = {
    title: "3D surface plot",
    scene: {
      xaxis: { title: { text: xCol } },
      yaxis: { title: { text: yCol } },
      zaxis: { title: { text: zCol } },
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

  const layoutContour: Partial<LayoutContour> = {
    title: "Contour plot",
    xaxis: { title: { text: xCol } },
    yaxis: { title: { text: yCol } },
    zaxis: { title: { text: zCol } },
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
