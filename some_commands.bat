@echo off
setlocal
set SERVER_PORT=3000
set SERVER_DIR=backend
set FRONTEND_DIR=frontend

:menu
echo.
echo 1. Install dependencies and start server
echo 2. Stop server
echo 3. Install dependencies and build frontend
echo 4. Exit
echo.
set /p choice="Choose an option: "

if "%choice%"=="1" goto install_and_start_server
if "%choice%"=="2" goto stop_server
if "%choice%"=="3" goto install_and_build_frontend
if "%choice%"=="4" goto end
goto menu

:install_and_start_server
echo Installing server dependencies...
cd %SERVER_DIR%
call npm install
echo Starting server on port %SERVER_PORT%...
start /b node server.js
timeout /t 3 >nul
cd..
goto menu

:stop_server
echo Stopping server on port %SERVER_PORT%...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr "LISTENING" ^| findstr ":%SERVER_PORT%"') do (
    taskkill /f /pid %%a
)
goto menu

:install_and_build_frontend
echo Installing frontend dependencies...
cd %FRONTEND_DIR%
call npm install
echo Building frontend...
call npm run build
pause
cd..
goto menu

:end
endlocal
