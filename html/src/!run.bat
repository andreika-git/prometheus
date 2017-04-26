@set PATH=%PATH%;C:\WAMP\bin\php\php5.3.13
php.exe -q component.php "../data/prometheus-pick-and-place.csv" "../data/prometheus-footprints.csv" "../data/prometheus-bom.csv" > test1-generated.html
@call combine.bat
