#!/bin/bash

cd servers
./images.js &
sleep 1
./onlyjs.js &
sleep 1
pid1=`ps ax | grep nodejs | sed -n 1p | cut -d' ' -f1`
pid2=`ps ax | grep nodejs | sed -n 2p | cut -d' ' -f1`
pid3=`ps ax | grep nodejs | sed -n 3p | cut -d' ' -f1`
pid4=`ps ax | grep nodejs | sed -n 4p | cut -d' ' -f1`

cd ..
sleep 1
./speedcomp.js &
speedcompid=$!

rm mem.txt

while true; do
  pmap -x $pid1 | grep "total" | tr -s ' ' | cut -d' ' -f4 >> "mem.txt"
  pmap -x $pid2 | grep "total" | tr -s ' ' | cut -d' ' -f4 >> "mem.txt"
  pmap -x $pid3 | grep "total" | tr -s ' ' | cut -d' ' -f4 >> "mem.txt"
  pmap -x $pid4 | grep "total" | tr -s ' ' | cut -d' ' -f4 >> "mem.txt"
  sleep 1
  if ! [ $(ps -o pid= -p $speedcompid) ]
  then
    break
  fi
done
