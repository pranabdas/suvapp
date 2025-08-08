#!/bin/bash
# https://github.com/plotly/plotly.js/blob/master/CUSTOM_BUNDLE.md
CWD=${PWD}
npm i
PLOTLY_VERSION=$( jq -r '.dependencies["plotly.js"]' package.json | sed 's/[^0-9\.]*//g' )
echo -e "\033[36m>==> Detected plotly version \033[0m\033[1m${PLOTLY_VERSION}\033[0m\033[36m from package.json\033[0m"
git clone --branch v${PLOTLY_VERSION} --depth 1 https://github.com/plotly/plotly.js.git
cd plotly.js
npm i
npm run custom-bundle -- --out suv --traces scatter,surface,contour --strict
cp dist/plotly-suv.min.js ../node_modules/plotly.js/dist/plotly-suv.min.js
cd ${CWD}
rm -rf plotly.js
