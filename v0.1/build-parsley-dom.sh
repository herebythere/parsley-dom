#!/bin/bash

# refresh depenedenices
# deno run --reload=https://raw.githubusercontent.com/taylor-vann/parsley/main/v0.1/src/parsley.ts --config ./tsconfig.json ./src/parsley-dom.ts 
# deno run --reload=https://raw.githubusercontent.com/taylor-vann/jackrabbit/main/v0.1/src/jackrabbit.ts --config ./tsconfig.json ./src/parsley-dom.ts ./esmodules/parsley-dom.js 

# deno cache --reload ./src/parsley-dom.ts ./src/parsley-dom.test.ts

deno bundle  --config ./tsconfig.json ./src/parsley-dom.ts ./esmodules/parsley-dom.js 
deno bundle --config ./tsconfig.json ./src/parsley-dom.test.ts ./esmodules/parsley-dom.test.js 
