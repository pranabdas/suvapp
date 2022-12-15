# https://github.com/plotly/plotly.js/blob/master/CUSTOM_BUNDLE.md
CWD=${PWD}
npm i
cd node_modules/plotly.js
npm i
npm run custom-bundle -- --out suv --traces scatter,surface,contour --transforms none
cd ${CWD}
