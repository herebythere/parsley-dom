#!/bin/bash

curr_dir=`dirname $0`

treeshaker=$curr_dir/mod.ts
treeshaker_test=$curr_dir/mod.test.ts

es_dir=$curr_dir/../../../es/v0.1
es_treeshaker=$es_dir/treeshaker.js
es_treeshaker_test=$es_dir/treeshaker.test.js

deno bundle $treeshaker $es_treeshaker 
# deno bundle $treeshaker_test $es_treeshaker_test

