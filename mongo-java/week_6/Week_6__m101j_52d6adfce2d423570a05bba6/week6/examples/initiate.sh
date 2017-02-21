#!/usr/bin/env bash

echo 'cfg = { _id: "mySet", members:[ { _id : 0, host : "localhost:27017"} ] }; rs.initiate(cfg); ' | mongo
wait
echo 'rs.add("localhost:27018")' | mongo
wait
echo 'rs.add("localhost:27019")' | mongo
