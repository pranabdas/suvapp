# https://github.com/plotly/plotly.js/blob/master/CUSTOM_BUNDLE.md
npm i plotly.js
cd node_modules/plotly.js
npm i
npm run custom-bundle -- --out suv --traces scatter,surface,contour --transforms none
# scatter is included by default
# npm run custom-bundle -- --out scatter --traces scatter --transforms none
cd ../..
