#!/bin/bash

deno bundle --config ./tsconfig.json ./src/parsley-dom.ts ./esmodules/parsley-dom.js 
deno bundle --config ./tsconfig.json ./src/parsley-dom.test.ts ./esmodules/parsley-dom.test.js 
deno bundle --config ./tsconfig.json ./docs/demo.ts ./docs/bundle/demo.js 