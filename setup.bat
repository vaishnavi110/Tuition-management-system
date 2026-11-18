@echo off
setlocal enabledelayedexpansion

echo ================================================================
echo   TuitionHub - Automated Environment & Dependency Installer
echo ================================================================
echo.

:: 1. Check Node.js
echo [1/5] Checking Node.js installation...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is NOT installed!
    echo Please install Node.js LTS (v18.x or v20.x) from https://nodejs.org/
    echo Once installed, restart your command prompt and run setup.bat again.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo  -- Found Node.js %NODE_VER% (OK)
echo.

:: 2. Check Git
echo [2/5] Checking Git installation...
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is NOT installed!
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('git --version') do set GIT_VER=%%i
echo  -- Found %GIT_VER% (OK)
echo.

:: 3. Install Monorepo Dependencies
echo [3/5] Installing root, client, and server dependencies...
echo This may take 1-2 minutes depending on internet connection...
call npm run install:all
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Dependency installation failed! Check your internet connection.
    pause
    exit /b 1
)
echo  -- All dependencies installed successfully! (OK)
echo.

:: 4. Configure Environment Variables
echo [4/5] Checking server environment variables...
if not exist server\.env (
    echo  -- server\.env not found. Copying from server\.env.example...
    copy server\.env.example server\.env >nul
    echo  -- Created server\.env with default configuration! (OK)
) else (
    echo  -- server\.env already exists! (OK)
)
echo.

:: 5. Generate Prisma Client
echo [5/5] Generating Prisma Database Client...
call npm --prefix server run prisma:generate
echo.

echo ================================================================
echo   [SUCCESS] TuitionHub Setup Complete!
echo ================================================================
echo.
echo To start the application, simply run:
echo    start-demo.bat
echo or:
echo    npm run dev
echo.
echo Client URL:  http://localhost:3000
echo Backend API: http://localhost:5000
echo.
pause
