@echo off
chcp 65001 >nul
cls
echo =====================================================
echo   Crown ^& Cross - Windows Local Launcher
echo =====================================================
echo Starting Admin Portal and Public Storefront...
echo.
node "%~dp0start.js"
pause
