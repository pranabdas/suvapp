import { useMemo } from "react";
import { Data, Layout, SurfaceData } from "plotly.js";
import Plot, { plotConfig } from "./Plot";

function Plot3dSurface({
  data,
  selectedCol,
  isYScaleLog,
}: {
  data: number[][];
  selectedCol: { [key: string]: string };
  isYScaleLog: boolean;
}): React.JSX.Element {
  const { trace, contour } = useMemo(() => {
    const xData: number[] = [];
    const yData: number[] = [];
    const zData: number[] = [];

    // extract raw columns
    data.forEach((row) => {
      xData.push(row[0]);
      yData.push(row[1]);
      zData.push(isYScaleLog ? Math.log10(row[2]) : row[2]);
    });

    // fast O(N) unique array generation using Set
    const xDataUniq = Array.from(new Set(xData));
    const yDataUniq = Array.from(new Set(yData));

    // create O(1) lookup maps for the indices to avoid .indexOf() in loops
    const xIndexMap = new Map(xDataUniq.map((val, idx) => [val, idx]));
    const yIndexMap = new Map(yDataUniq.map((val, idx) => [val, idx]));

    // pre-allocate the 2D Z-matrix
    const zDataFinal: number[][] = Array(yDataUniq.length)
      .fill(0)
      .map(() => Array(xDataUniq.length).fill(0));

    // fast O(N) matrix population
    for (let ii = 0; ii < data.length; ii++) {
      // instant lookup using the Maps instead of array.indexOf()
      const xIndex = xIndexMap.get(xData[ii])!;
      const yIndex = yIndexMap.get(yData[ii])!;
      zDataFinal[yIndex][xIndex] = zData[ii];
    }

    const trace: Partial<SurfaceData>[] = [
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

    return { trace, contour };
  }, [data, isYScaleLog]);

  const { xCol, yCol, zCol } = selectedCol;

  const layout = useMemo<Partial<Layout>>(
    () => ({
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
    }),
    [xCol, yCol, zCol]
  );

  const layoutContour = useMemo<Partial<Layout>>(
    () => ({
      title: { text: "Contour plot" },
      xaxis: { title: { text: xCol } },
      yaxis: { title: { text: yCol } },
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
    }),
    [xCol, yCol]
  );

  return (
    <>
      <Plot data={trace} config={plotConfig} layout={layout} />

      <br />
      <Plot data={contour} config={plotConfig} layout={layoutContour} />
    </>
  );
}

export default Plot3dSurface;
