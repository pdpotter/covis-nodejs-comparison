#!/bin/bash

# limit = 200

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, graypj/g' speedcomp.js
sed -i 's/commandplease/pure_javascript.js/g' memusage.sh

./memusage.sh >> results/graypj200.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, grayepc/g' speedcomp.js
sed -i 's/commandplease/external_program_call.js/g' memusage.sh

./memusage.sh >> results/grayepc200.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, graynao/g' speedcomp.js
sed -i 's/commandplease/native_add-on.js/g' memusage.sh

./memusage.sh >> results/graynao200.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, gausspj/g' speedcomp.js
sed -i 's/commandplease/pure_javascript.js/g' memusage.sh

./memusage.sh >> results/gausspj200.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, gaussepc/g' speedcomp.js
sed -i 's/commandplease/external_program_call.js/g' memusage.sh

./memusage.sh >> results/gaussepc200.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, gaussnao/g' speedcomp.js
sed -i 's/commandplease/native_add-on.js/g' memusage.sh

./memusage.sh >> results/gaussnao200.txt

# limit = 1

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/limit   = 200/limit   = 1/g' speedcomp.js
sed -i 's/commandsplease/createlist, graypj/g' speedcomp.js
sed -i 's/commandplease/pure_javascript.js/g' memusage.sh

./memusage.sh >> results/graypj1.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/limit   = 200/limit   = 1/g' speedcomp.js
sed -i 's/commandsplease/createlist, grayepc/g' speedcomp.js
sed -i 's/commandplease/external_program_call.js/g' memusage.sh

./memusage.sh >> results/grayepc1.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/limit   = 200/limit   = 1/g' speedcomp.js
sed -i 's/commandsplease/createlist, graynao/g' speedcomp.js
sed -i 's/commandplease/native_add-on.js/g' memusage.sh

./memusage.sh >> results/graynao1.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/limit   = 200/limit   = 1/g' speedcomp.js
sed -i 's/commandsplease/createlist, gausspj/g' speedcomp.js
sed -i 's/commandplease/pure_javascript.js/g' memusage.sh

./memusage.sh >> results/gausspj1.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/limit   = 200/limit   = 1/g' speedcomp.js
sed -i 's/commandsplease/createlist, gaussepc/g' speedcomp.js
sed -i 's/commandplease/external_program_call.js/g' memusage.sh

./memusage.sh >> results/gaussepc1.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/limit   = 200/limit   = 1/g' speedcomp.js
sed -i 's/commandsplease/createlist, gaussnao/g' speedcomp.js
sed -i 's/commandplease/native_add-on.js/g' memusage.sh

./memusage.sh >> results/gaussnao1.txt

# gc

# limit = 200

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, graynao/g' speedcomp.js
sed -i 's/.\/commandplease/node --expose_gc native_add-on.js gc/g' memusage.sh

./memusage.sh >> results/gc_graynao200.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, graypj/g' speedcomp.js
sed -i 's/.\/commandplease/node --expose_gc pure_javascript.js gc/g' memusage.sh

./memusage.sh >> results/gc_graypj200.txt

cp memusageclean.sh memusage.sh
cp speedcompclean.js speedcomp.js

sed -i 's/commandsplease/createlist, grayepc/g' speedcomp.js
sed -i 's/.\/commandplease/node --expose_gc external_program_call.js gc/g' memusage.sh

./memusage.sh >> results/gc_grayepc200.txt
