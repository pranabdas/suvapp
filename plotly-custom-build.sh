#!/bin/bash
# https://github.com/plotly/plotly.js/blob/master/CUSTOM_BUNDLE.md
CWD=${PWD}
npm i
git clone --branch v3.0.2 --depth 1 https://github.com/plotly/plotly.js.git
cd plotly.js
npm i
npm run custom-bundle -- --out suv --traces scatter,surface,contour --strict
cp dist/plotly-suv.min.js ../node_modules/plotly.js/dist/plotly-suv.min.js
cd ${CWD}
rm -rf plotly.js
