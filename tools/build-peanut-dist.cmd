@echo off
set root=\dev\twoquakers\peanut\pnut-core
set pnut=%root%\pnut.root\modules\pnut
echo Building Peanut Distribution
echo Cleaning distribution directory
if exist %pnut%\dist\Peanut.ts  del  %pnut%\dist\Peanut.ts
if exist %pnut%\dist\Peanut.js  del  %pnut%\dist\Peanut.js
if exist %pnut%\dist\Peanut.min.js  del  %pnut%\dist\Peanut.min.js
if exist %pnut%\dist\loader.min.js  del  %pnut%\dist\loader.min.js
echo Merging Code Source Files
php  %root%\tools\bundle-peanut.php
echo Compiling Peanut.js
call tsc --removeComments --preserveConstEnums %pnut%\dist\Peanut.ts
echo Minimizing peanut core scripts for distribution
call uglifyjs %pnut%\dist\Peanut.js -c -m -o %pnut%\dist\peanut.min.js
call uglifyjs %pnut%\core\PeanutLoader.js -c -m -o %pnut%\dist\loader.min.js
del %pnut%\dist\Peanut.ts
del %pnut%\dist\Peanut.js
echo Peanut distribution build completed.
rem dir %pnut%\dist
