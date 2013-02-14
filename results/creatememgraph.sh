#!/bin/bash

# get start mem

startmem=$(head -1 "$1")

# clean file

more +2 "$1" | grep -v "Executed" | grep -v "server" | grep -v "url" | grep -v "Executing" | grep -v "Longest"> "/tmp/cleanmem"

# calculate avg and mem

counter=0
out=""

while read line
do
  counter=$(expr $counter + 1)
  value=$(expr $line - $startmem)
	out="$out""(""$counter"",""$value"")";
done < "/tmp/cleanmem"
rm "/tmp/cleanmem"

echo "$out" > "$2"
