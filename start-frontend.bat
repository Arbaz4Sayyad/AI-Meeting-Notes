@echo off
echo Starting Frontend...
echo.

cd frontend

REM Try npm first
echo Attempting npm install...
npm install --production --no-optional

if %ERRORLEVEL% NEQ 0 (
    echo npm failed, trying yarn...
    yarn install --production
)

echo Starting development server...
npm run dev

pause
