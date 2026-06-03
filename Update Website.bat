@echo off
title Harsh Infotech CMS - Update Website
echo ====================================================
echo   HARSH INFOTECH CONTENT MANAGEMENT SYSTEM (CMS)
echo   Updating website content... Please wait...
echo ====================================================
echo.

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
