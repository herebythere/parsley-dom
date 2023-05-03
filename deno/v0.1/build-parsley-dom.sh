#!/bin/bash

curr_dir=`dirname $0`

parsley_dom=$curr_dir/mod.ts
parsley_dom_test=$curr_dir/mod.test.ts

es_dir=$curr_dir/../../es/v0.1
es_pathname=$es_dir/parsley-dom.js
es_test_parsley=$es_dir/parsley-dom.test.js

deno bundle $parsley_dom $es_pathname 
# deno bundle --config $tsconfig $parsley_dom_test $es_test_parsley

