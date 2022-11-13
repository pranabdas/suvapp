/// <reference types="react-scripts" />

// https://github.com/plotly/react-plotly.js/issues/226
// https://github.com/plotly/react-plotly.js/issues/80
declare module "plotly.js/dist/plotly-suv.min.js" {
    export { Plotly as default } from "plotly.js";
}
