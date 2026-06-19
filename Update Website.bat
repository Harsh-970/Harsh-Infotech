@echo off
title Harsh Infotech CMS - Update Website
echo ====================================================
echo   HARSH INFOTECH CONTENT MANAGEMENT SYSTEM (CMS)
echo   Updating website content... Please wait...
echo ====================================================
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

:: Run sync-content script
call npm run sync-content

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERROR: Content synchronization failed!
    echo.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ====================================================
echo   🎉 Website Content Updated Successfully!
echo ====================================================
echo.

:: Parse and show the report summaries using a simple PowerShell script inline
powershell -Command "if (Test-Path 'REPORTS/CMS_SUMMARY_REPORT.md') { Get-Content 'REPORTS/CMS_SUMMARY_REPORT.md' | Select-Object -First 14 } else { Write-Host 'Summary report not found.' }"

echo.
echo Press any key to exit...
pause > nul
