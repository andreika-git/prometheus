@echo off
SET mapFile="../prometheus-map.html"
echo Creating %mapFile%...
type test0-header.html > %mapFile%
type test1-generated.html >> %mapFile%
type test2-footer.html >> %mapFile%
