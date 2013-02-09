#!/bin/bash

# limit = 200

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, grayjs/g' speedcomp.js
sed -i 's/commandplease/onlyjs.js/g' memusage.sh

./memusage.sh >> results/grayjs200.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, grayc/g' speedcomp.js
sed -i 's/commandplease/cwrapper.js/g' memusage.sh

./memusage.sh >> results/grayc200.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, grayb/g' speedcomp.js
sed -i 's/commandplease/bindings.js/g' memusage.sh

./memusage.sh >> results/grayb200.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, gaussjs/g' speedcomp.js
sed -i 's/commandplease/onlyjs.js/g' memusage.sh

./memusage.sh >> results/gaussjs200.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, gaussc/g' speedcomp.js
sed -i 's/commandplease/cwrapper.js/g' memusage.sh

./memusage.sh >> results/gaussc200.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, gaussb/g' speedcomp.js
sed -i 's/commandplease/bindings.js/g' memusage.sh

./memusage.sh >> results/gaussb200.txt

# limit = 1

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/limit   = 200/limit   = 1/g' speedcomp.js
sed -i 's/commandsplease/createlist, grayjs/g' speedcomp.js
sed -i 's/commandplease/onlyjs.js/g' memusage.sh

./memusage.sh >> results/grayjs1.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/limit   = 200/limit   = 1/g' speedcomp.js
sed -i 's/commandsplease/createlist, grayc/g' speedcomp.js
sed -i 's/commandplease/cwrapper.js/g' memusage.sh

./memusage.sh >> results/grayc1.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/limit   = 200/limit   = 1/g' speedcomp.js
sed -i 's/commandsplease/createlist, grayb/g' speedcomp.js
sed -i 's/commandplease/bindings.js/g' memusage.sh

./memusage.sh >> results/grayb1.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/limit   = 200/limit   = 1/g' speedcomp.js
sed -i 's/commandsplease/createlist, gaussjs/g' speedcomp.js
sed -i 's/commandplease/onlyjs.js/g' memusage.sh

./memusage.sh >> results/gaussjs1.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/limit   = 200/limit   = 1/g' speedcomp.js
sed -i 's/commandsplease/createlist, gaussc/g' speedcomp.js
sed -i 's/commandplease/cwrapper.js/g' memusage.sh

./memusage.sh >> results/gaussc1.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/limit   = 200/limit   = 1/g' speedcomp.js
sed -i 's/commandsplease/createlist, gaussb/g' speedcomp.js
sed -i 's/commandplease/bindings.js/g' memusage.sh

./memusage.sh >> results/gaussb1.txt

# gc

# limit = 200

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, grayb/g' speedcomp.js
sed -i 's/.\/commandplease/node --expose_gc bindings_mem.js/g' memusage.sh

./memusage.sh >> results/gc_grayb200.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, gaussb/g' speedcomp.js
sed -i 's/.\/commandplease/node --expose_gc bindings_mem.js/g' memusage.sh

./memusage.sh >> results/gc_gaussb200.txt

# limit = 1

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/limit   = 200/limit   = 1/g' speedcomp.js
sed -i 's/commandsplease/createlist, grayb/g' speedcomp.js
sed -i 's/.\/commandplease/node --expose_gc bindings_mem.js/g' memusage.sh

./memusage.sh >> results/gc_grayb1.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/limit   = 200/limit   = 1/g' speedcomp.js
sed -i 's/commandsplease/createlist, gaussb/g' speedcomp.js
sed -i 's/.\/commandplease/node --expose_gc bindings_mem.js/g' memusage.sh

./memusage.sh >> results/gc_gaussb1.txt
