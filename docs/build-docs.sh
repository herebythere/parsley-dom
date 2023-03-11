#!/bin/bash

curr_dir=`dirname $0`

tsconfig=$curr_dir/tsconfig.json

demo=$curr_dir/scripts/demo.ts

bundle_dir=$curr_dir/bundle
bundle_docs=$bundle_dir/demo.js


# deno cache --reload ./scripts/demo.ts
deno bundle --config $tsconfig $demo $bundle_docs
