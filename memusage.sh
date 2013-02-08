#!/bin/bash

free -m | grep buffers/cache | tr -s ' ' | cut -d' ' -f3

cd servers
./images.js &
sleep 1

#./onlyjs.js &
#./cwrapper.js &
#./bindings.js &
./bindings.js &
sleep 1

cd ..
./speedcomp.js &
speedcompid=$!

while true; do
  free -m | grep buffers/cache | tr -s ' ' | cut -d' ' -f3
  sleep 1
  if ! [ $(ps -o pid= -p $speedcompid) ]
  then
    break
  fi
done

pkill node
pkill nodejs
