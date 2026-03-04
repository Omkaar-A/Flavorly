@echo off
echo 🍳 Flavorly App Installer
echo ==========================
echo.

REM Check if running on Windows
ver | findstr /i "windows" >nul
if %errorlevel% neq 0 (
    echo ❌ This installer is for Windows only
    pause
    exit /b 1
)

echo ✅ Detected Windows system

REM Set installation directory
set INSTALL_DIR=%USERPROFILE%\AppData\Local\Programs\Flavorly
set APP_NAME=Flavorly

REM Create installation directory
echo 📁 Creating installation directory...
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

REM Extract app files
echo 📦 Extracting app files...
xcopy /E /I /Y app-files "%INSTALL_DIR%\%APP_NAME%"

REM Create desktop shortcut
echo 🖥️  Creating desktop shortcut...
echo @echo off > "%USERPROFILE%\Desktop\%APP_NAME%.bat"
echo start "" "%INSTALL_DIR%\%APP_NAME%\app.html" >> "%USERPROFILE%\Desktop\%APP_NAME%.bat"

REM Create Start Menu shortcut
echo 📋 Creating Start Menu shortcut...
if not exist "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Flavorly" mkdir "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Flavorly"
echo @echo off > "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Flavorly\%APP_NAME%.bat"
echo start "" "%INSTALL_DIR%\%APP_NAME%\app.html" >> "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Flavorly\%APP_NAME%.bat"

REM Create uninstaller
echo 🗑️  Creating uninstaller...
echo @echo off > "%INSTALL_DIR%\%APP_NAME%\uninstall.bat"
echo echo 🗑️  Uninstalling Flavorly App... >> "%INSTALL_DIR%\%APP_NAME%\uninstall.bat"
echo rmdir /S /Q "%INSTALL_DIR%\%APP_NAME%" >> "%INSTALL_DIR%\%APP_NAME%\uninstall.bat"
echo del "%USERPROFILE%\Desktop\%APP_NAME%.bat" 2>nul >> "%INSTALL_DIR%\%APP_NAME%\uninstall.bat"
echo rmdir /S /Q "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Flavorly" 2>nul >> "%INSTALL_DIR%\%APP_NAME%\uninstall.bat"
echo echo ✅ Flavorly App uninstalled successfully! >> "%INSTALL_DIR%\%APP_NAME%\uninstall.bat"
echo pause >> "%INSTALL_DIR%\%APP_NAME%\uninstall.bat"

echo.
echo 🎉 Installation completed successfully!
echo.
echo 📱 How to use Flavorly:
echo    • Double-click the desktop shortcut
echo    • Or find it in your Start Menu
echo    • Or run: %INSTALL_DIR%\%APP_NAME%\app.html
echo.
echo 🗑️  To uninstall: Run %INSTALL_DIR%\%APP_NAME%\uninstall.bat
echo.
echo 🍳 Enjoy cooking with AI-powered recipes!
echo.
pause
