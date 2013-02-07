#!/bin/bash

cd servers
./images.js &
sleep 1
./onlyjs.js &
#./cwrapper.js &
sleep 1

cd ..
sleep 1
./speedcomp.js &
speedcompid=$!

rm mem.txt

while true; do
  pmap -x $(pidof nodejs) | grep total | tr -s ' ' | cut -d' ' -f4 >> "mem.txt"
  pmap -x $(pidof Gray) | grep total | tr -s ' ' | cut -d' ' -f4 2> /dev/null
  echo "" >> "mem.txt" &
  sleep 1
  if ! [ $(ps -o pid= -p $speedcompid) ]
  then
    break
  fi
done
