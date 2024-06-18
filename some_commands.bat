@echo off
setlocal
set SERVER_PORT=3000
set SERVER_DIR=backend
set FRONTEND_DIR=frontend

:menu
echo.
echo 1. Start server
echo 2. Stop server
echo 3. Build frontend
echo 4. Exit
echo.
set /p choice="Choose an option: "

if "%choice%"=="1" goto start_server
if "%choice%"=="2" goto stop_server
if "%choice%"=="3" goto build_frontend
if "%choice%"=="4" goto end
goto menu

:start_server
echo Starting server on port %SERVER_PORT%...
cd %SERVER_DIR%
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

:build_frontend
echo Building frontend...
cd %FRONTEND_DIR%
call npm run build
pause
cd..
goto menu

:end
endlocal
