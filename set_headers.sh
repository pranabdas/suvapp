#!/bin/bash
# set HTTP headers for assets

if [ -d dist ]; then
  cd dist
else
  npm run build
fi

if [ -f _headers ]; then rm _headers; fi

for file in $(find assets -type f -name '*.js'); do
  echo "/$file" >> _headers
  cat >> _headers << EOF
  Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options: nosniff
  Content-type: text/javascript; charset=utf-8
EOF
done

for file in $(find assets -type f -name '*.css'); do
  echo "/$file" >> _headers
  cat >> _headers << EOF
  Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options: nosniff
  Content-type: text/css
EOF
done
