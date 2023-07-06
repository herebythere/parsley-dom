#!/bin/bash

curr_dir=`dirname $0`

tsconfig=$curr_dir/tsconfig.json

treeshaker_dom=$curr_dir/mod.ts
# parsley_dom_test=$curr_dir/mod.test.ts

es_dir=$curr_dir/../../../es/v0.1
es_pathname=$es_dir/treeshaker_dom-utils.js
# es_test_parsley=$es_dir/parsley-dom.test.js

deno bundle --config $tsconfig $treeshaker_dom $es_pathname 
# deno bundle --config $tsconfig $parsley_dom_test $es_test_parsley

# deno fmt $current_dir
# deno fmt $es_dir
