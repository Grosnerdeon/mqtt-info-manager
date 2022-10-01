cd server
start cmd.exe /k buildAndStart.bat
cd ..\
cd clientPart
start cmd.exe /k npm run serve
cd ..\