@echo off
echo ================================================================
echo   TuitionHub - 1-Click Application Launcher
echo ================================================================
echo.
echo Starting Frontend (Port 3000) and Backend API (Port 5000)...
echo.

:: Automatically launch default browser after 3 seconds in the background
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

:: Start both client and server concurrently
call npm run dev

pause
