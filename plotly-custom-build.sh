#!/bin/bash
# https://github.com/plotly/plotly.js/blob/master/CUSTOM_BUNDLE.md
npm i
PLOTLY_VERSION=$( jq -r '.dependencies["plotly.js"]' package.json | sed 's/[^0-9\.]*//g' )
echo -e "\033[36m==> Bundling plotly version \033[0m\033[1m${PLOTLY_VERSION}\033[0m"
git clone --branch v${PLOTLY_VERSION} --depth 1 https://github.com/plotly/plotly.js.git
cd plotly.js
npm i

# Scatter, contour, and surface register a calendar attribute, so the custom
# bundle otherwise includes every world-calendars implementation. This app
# only plots numbers. Keep Gregorian (dist/main and dist/plus) and drop the rest.
CALENDARS=src/components/calendars/calendars.js
if ! grep -q "world-calendars/dist/calendars/" "$CALENDARS"; then
  echo "expected non-Gregorian calendar requires in $CALENDARS" >&2
  exit 1
fi
sed -i.bak "/world-calendars\/dist\/calendars\//d" "$CALENDARS"

# registry.js requires the MapLibre stylesheet inside a map-only branch, but
# the bundler still inlines that CSS. This bundle has no map traces.
REGISTRY=src/registry.js
if ! grep -q "maplibre-gl/dist/maplibre-gl.css" "$REGISTRY"; then
  echo "expected MapLibre CSS require in $REGISTRY" >&2
  exit 1
fi
sed -i.bak "/maplibre-gl\/dist\/maplibre-gl.css/d" "$REGISTRY"

npm run custom-bundle -- --out suv --traces scatter,surface,contour --strict
sed -i.bak '/^[[:space:]]*\/\//d' dist/plotly-suv.min.js
sed -i.bak '/^[[:space:]]*$/d' dist/plotly-suv.min.js
cp dist/plotly-suv.min.js ../node_modules/plotly.js/dist/plotly-suv.min.js
cd ..
rm -rf plotly.js
