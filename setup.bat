@echo off
REM Voting System Setup Script for Windows

echo.
echo 🚀 Setting up Voting System with Node.js Backend...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Download from https://nodejs.org/
    pause
    exit /b 1
)

REM Navigate to backend
cd backend

echo ✓ Installing Node.js dependencies...
call npm install

if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 📊 Setting up database...
echo Please enter MySQL credentials when prompted.
echo.

set /p mysql_pass="Enter MySQL root password (press Enter if no password): "

if "%mysql_pass%"=="" (
    mysql -u root < db\init.sql
) else (
    mysql -u root -p%mysql_pass% < db\init.sql
)

if errorlevel 1 (
    echo ❌ Failed to initialize database
    echo Make sure MySQL is running: net start MySQL80 (or your MySQL service name)
    pause
    exit /b 1
)

echo.
echo ✅ Backend setup completed!
echo.
echo 📝 Next steps:
echo   1. Update .env file with your database credentials if needed
echo   2. Start backend: npm start
echo   3. In another terminal, go to frontend folder
echo   4. Run: npm install ^&^& npm run dev
echo.
echo 🌐 Access application at: http://localhost:5173
echo 📡 API runs on: http://localhost:5000
echo.
pause
