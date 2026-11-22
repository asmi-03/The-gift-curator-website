@echo off
title The Gift Curator - Full Stack (Frontend + Backend)
cd /d "c:\didi website"
echo ==============================================================
echo       THE GIFT CURATOR DUBAI - LOCAL DEVELOPMENT SERVERS
echo ==============================================================
echo.
echo [1/2] Starting Backend API Server (Port 5000)...
start "TGC Backend API (:5000)" cmd /k "cd /d "c:\didi website\backend" && npm.cmd start"

echo [2/2] Starting Frontend App (Port 3000)...
echo Opening http://localhost:3000 in your browser...
start /b cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

echo.
echo KEEP THIS WINDOW OPEN while using the website.
echo To stop servers, close the windows or press Ctrl+C.
echo ==============================================================
echo.
cd /d "c:\didi website\frontend"
call npm.cmd run dev
pause
