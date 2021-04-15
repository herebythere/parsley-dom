#!/bin/bash

# refresh depenedenices
# deno bundle --reload=https://raw.githubusercontent.com/taylor-vann/parsley/main/v0.1/src/parsley.ts --config ./tsconfig.json ./src/parsley-dom.ts ./esmodules/parsley-dom.js 

deno bundle  --config ./tsconfig.json ./src/parsley-dom.ts ./esmodules/parsley-dom.js 
deno bundle --config ./tsconfig.json ./src/parsley-dom.test.ts ./esmodules/parsley-dom.test.js 
