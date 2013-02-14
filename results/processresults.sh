#!/bin/bash

# processing times

# clean file

cat "$1" | grep "Executed" | cut -d" " -f3 > "/tmp/calcproc"

procnum=0
procsum=0
procmax=0
while read line
do
  procnum=$(expr $procnum + 1)
  procsum=$(expr $procsum + $line)
  if [ $line -gt $procmax ]
  then
    procmax=$line
  fi
done < "/tmp/calcproc"
rm "/tmp/calcproc"

procavg=$(expr $procsum / $procnum)

# memory

# get start mem

startmem=$(head -1 "$1")

# clean file

more +2 "$1" | grep -v "Executed" | grep -v "server" | grep -v "url" | grep -v "Executing" | grep -v "Longest"> "/tmp/calcmem"

# calculate avg and mem

memnum=0
memsum=0
memmax=0
while read line
do
  memnum=$(expr $memnum + 1)
  memsum=$(expr $memsum + $(expr $line - $startmem))
  if [ $(expr $line - $startmem) -gt $memmax ]
  then
    memmax=$(expr $line - $startmem)
  fi
done < "/tmp/calcmem"
rm "/tmp/calcmem"

memavg=$(expr $memsum / $memnum)


echo "Average processing time: $procavg"
echo "Maximum processing time: $procmax"
echo "Average memory usage: $memavg"
echo "Maximum memory usage: $memmax"
