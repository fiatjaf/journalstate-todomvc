export PATH := "./node_modules/.bin:" + env_var('PATH')

build:
  esbuild --bundle --outfile=bundle.js app.js
