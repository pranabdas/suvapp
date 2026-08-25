import { useMemo } from "react";
import Plotly from "plotly.js/dist/plotly-suv.min.js";
import createPlotlyComponentFactory from "react-plotly.js/factory";
import { Data, Layout, Font } from "plotly.js";

type BaseTrace = Extract<Data, { type?: string }>;

interface SurfacePlotData extends BaseTrace {
  type: "surface";
  // https://plotly.com/javascript/reference/surface/#surface-contours
  // https://github.com/DefinitelyTyped/DefinitelyTyped/commit/f8f22d2d8d29bd896ff3e632262b84fb5fedd6e4
  contours?: Partial<{
    coloring: "fill" | "heatmap" | "lines" | "none";
    end: number;
    labelfont: Partial<Font>;
    labelformat: string;
    operation:
    | "="
    | "<"
    | ">="
    | ">"
    | "<="
    | "[]"
    | "()"
    | "[)"
    | "(]"
    | "]["
    | ")("
    | "]("
    | ")[";
    showlabels: boolean;
    showlines: boolean;
    size: number;
    start: number;
    type: "levels" | "constraint";
    value: number | [lowerBound: number, upperBound: number];
    // https://plotly.com/javascript/reference/surface/#surface-contours-z
    z: Partial<{
      show: boolean;
      usecolormap: boolean;
      project: Partial<{ z: boolean }>;
    }>;
  }>;
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
}): React.JSX.Element {
  const Plot = createPlotlyComponentFactory(Plotly);
  const { xDataUniq, yDataUniq, zDataFinal } = useMemo(() => {
    const xData: number[] = [];
    const yData: number[] = [];
    const zData: number[] = [];

    // 1. Extract raw columns
    data.forEach((row) => {
      xData.push(row[0]);
      yData.push(row[1]);
      zData.push(isYScaleLog ? Math.log10(row[2]) : row[2]);
    });

    // 2. Fast O(N) unique array generation using Set
    const xDataUniq = Array.from(new Set(xData));
    const yDataUniq = Array.from(new Set(yData));

    // 3. Create O(1) lookup maps for the indices to avoid .indexOf() in loops
    const xIndexMap = new Map(xDataUniq.map((val, idx) => [val, idx]));
    const yIndexMap = new Map(yDataUniq.map((val, idx) => [val, idx]));

    // 4. Pre-allocate the 2D Z-matrix
    const zDataFinal: number[][] = Array(yDataUniq.length)
      .fill(0)
      .map(() => Array(xDataUniq.length).fill(0));

    // 5. Fast O(N) matrix population
    for (let ii = 0; ii < data.length; ii++) {
      // Instant lookup using the Maps instead of array.indexOf()
      const xIndex = xIndexMap.get(xData[ii])!;
      const yIndex = yIndexMap.get(yData[ii])!;
      zDataFinal[yIndex][xIndex] = zData[ii];
    }

    return { xDataUniq, yDataUniq, zDataFinal };
  }, [data, isYScaleLog]);

  const { xCol, yCol, zCol } = selectedCol;

  const trace: Data[] = [
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
    } as SurfacePlotData,
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
    title: { text: "3D surface plot" },
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
    title: { text: "Contour plot" },
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
