@echo off
echo Starting up Harsh Infotech Website Server...
echo Please wait a few seconds!

:: Start the npm dev server in the background
start /B cmd /c "npm run dev"

:: Give the server a few seconds to boot up before opening the browser
timeout /t 3 /nobreak > NUL

:: Open the user's default web browser to the Vite dev server URL
start http://localhost:3000

echo Website should be opening in your browser now!
echo Keep this window open while you view the website. You can close this window to stop the server when you're done.
pause
