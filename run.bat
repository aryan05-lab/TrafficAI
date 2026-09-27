@echo off
cd /d "%~dp0"
if not exist "venv\Scripts\python.exe" (
    echo Virtual environment not found.
    echo Please follow SETUP_WINDOWS.txt first.
    pause
    exit /b 1
)
call "venv\Scripts\activate.bat"
python app.py
pause
