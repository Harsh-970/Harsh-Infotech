@echo off
echo Starting up Harsh Infotech Website Servers...
echo.

:: Detect Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    if exist "E:\Dashboard for Harsh Infotech\dashboard\node-v20.14.0-win-x64" (
        set "PATH=E:\Dashboard for Harsh Infotech\dashboard\node-v20.14.0-win-x64;%PATH%"
    ) else if exist "D:\Dashboard for Harsh Infotech\dashboard\node-v20.14.0-win-x64" (
        set "PATH=D:\Dashboard for Harsh Infotech\dashboard\node-v20.14.0-win-x64;%PATH%"
    ) else (
        echo ❌ ERROR: Node.js was not found globally or in the local Dashboard project folder.
        echo Please make sure Node.js is installed.
        pause
        exit /b 1
    )
)

:: Start the npm dev server in the background
echo 1. Launching main website server on port 3000...
start /B cmd /c "npm run dev"

:: Start the dedicated CMS admin server in the background
echo 2. Launching CMS Control Center server on port 3001...
start /B cmd /c "node admin-tools/server.js"

:: Give the servers a few seconds to boot up before opening the browser
timeout /t 3 /nobreak > NUL

:: Open the user's default web browser to the website and the CMS control center
echo.
echo Opening browser tabs...
start http://localhost:3000
start http://localhost:3001/CMS-Control.html

echo.
echo =======================================================================
echo   Servers started successfully!
echo   - Website Preview: http://localhost:3000
echo   - CMS Control Center: http://localhost:3001/CMS-Control.html
echo =======================================================================
echo.
echo Keep this terminal window open while working. 
echo You can close this window to shut down both servers.
pause

