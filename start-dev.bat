@echo off
echo Starting TMDB Movie Browser Development Environment...
echo.

echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo Installing client dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo Failed to install client dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Failed to install server dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Starting development servers...
echo Client will be available at: http://localhost:3000
echo Server will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop both servers
echo.

call npm run dev
