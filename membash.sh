#!/bin/bash

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, grayjs/g' speedcomp.js
sed -i 's/commandplease/onlyjs.js/g' memusage.sh

for i in 1 2 3 4 5 6 7 8 9 10
do
  ./memusage.sh >> results2/grayjs$i.txt
done

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, grayc/g' speedcomp.js
sed -i 's/commandplease/cwrapper.js/g' memusage.sh

for i in 1 2 3 4 5 6 7 8 9 10
do
  ./memusage.sh >> results2/grayc$i.txt
done

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, grayb/g' speedcomp.js
sed -i 's/commandplease/bindings.js/g' memusage.sh

for i in 1 2 3 4 5 6 7 8 9 10
do
  ./memusage.sh >> results2/grayb$i.txt
done

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, gaussjs/g' speedcomp.js
sed -i 's/commandplease/onlyjs.js/g' memusage.sh

for i in 1 2 3 4 5 6 7 8 9 10
do
  ./memusage.sh >> results2/gaussjs$i.txt
done

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, gaussc/g' speedcomp.js
sed -i 's/commandplease/cwrapper.js/g' memusage.sh

for i in 1 2 3 4 5 6 7 8 9 10
do
  ./memusage.sh >> results2/gaussc$i.txt
done

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, gaussb/g' speedcomp.js
sed -i 's/commandplease/bindings.js/g' memusage.sh

for i in 1 2 3 4 5 6 7 8 9 10
do
  ./memusage.sh >> results2/gaussb$i.txt
done
