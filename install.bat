@echo off
echo 🍳 Flavorly App Installer - Enhanced Version
echo ==============================================
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

REM Install app files
echo 📦 Installing app files...
if exist "app-files" (
    xcopy /E /I /Y app-files "%INSTALL_DIR%\%APP_NAME%"
) else (
    if not exist "%INSTALL_DIR%\%APP_NAME%" mkdir "%INSTALL_DIR%\%APP_NAME%"
    copy *.html "%INSTALL_DIR%\%APP_NAME%\" >nul 2>&1
    copy *.js "%INSTALL_DIR%\%APP_NAME%\" >nul 2>&1
    copy *.css "%INSTALL_DIR%\%APP_NAME%\" >nul 2>&1
    copy *.json "%INSTALL_DIR%\%APP_NAME%\" >nul 2>&1
    copy *.svg "%INSTALL_DIR%\%APP_NAME%\" >nul 2>&1
    copy *.xml "%INSTALL_DIR%\%APP_NAME%\" >nul 2>&1
)

REM Create desktop shortcut with PWA support
echo 🖥️  Creating desktop shortcut...
echo @echo off > "%USERPROFILE%\Desktop\%APP_NAME%.bat"
echo echo 🍳 Launching Flavorly... >> "%USERPROFILE%\Desktop\%APP_NAME%.bat"
echo start "" "%INSTALL_DIR%\%APP_NAME%\index.html" >> "%USERPROFILE%\Desktop\%APP_NAME%.bat"

REM Create Start Menu shortcut with quick actions
echo 📋 Creating Start Menu shortcut...
if not exist "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Flavorly" mkdir "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Flavorly"

REM Main app shortcut
echo @echo off > "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Flavorly\%APP_NAME%.bat"
echo start "" "%INSTALL_DIR%\%APP_NAME%\index.html" >> "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Flavorly\%APP_NAME%.bat"

REM Quick action shortcuts
echo @echo off > "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Flavorly\Generate Recipe.bat"
echo start "" "%INSTALL_DIR%\%APP_NAME%\index.html?action=generate" >> "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Flavorly\Generate Recipe.bat"

echo @echo off > "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Flavorly\My Recipes.bat"
echo start "" "%INSTALL_DIR%\%APP_NAME%\index.html?action=recipes" >> "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Flavorly\My Recipes.bat"

REM Create launcher script
echo 🚀 Creating launcher...
echo @echo off > "%INSTALL_DIR%\%APP_NAME%\launch.bat"
echo echo 🍳 Launching Flavorly... >> "%INSTALL_DIR%\%APP_NAME%\launch.bat"
echo start "" "%INSTALL_DIR%\%APP_NAME%\index.html" >> "%INSTALL_DIR%\%APP_NAME%\launch.bat"

REM Create enhanced uninstaller
echo 🗑️  Creating uninstaller...
echo @echo off > "%INSTALL_DIR%\%APP_NAME%\uninstall.bat"
echo echo 🗑️  Uninstalling Flavorly App... >> "%INSTALL_DIR%\%APP_NAME%\uninstall.bat"
echo rmdir /S /Q "%INSTALL_DIR%\%APP_NAME%" >> "%INSTALL_DIR%\%APP_NAME%\uninstall.bat"
echo del "%USERPROFILE%\Desktop\%APP_NAME%.bat" 2>nul >> "%INSTALL_DIR%\%APP_NAME%\uninstall.bat"
echo rmdir /S /Q "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Flavorly" 2>nul >> "%INSTALL_DIR%\%APP_NAME%\uninstall.bat"
echo echo ✅ Flavorly App uninstalled successfully! >> "%INSTALL_DIR%\%APP_NAME%\uninstall.bat"
echo pause >> "%INSTALL_DIR%\%APP_NAME%\uninstall.bat"

REM Ask about auto-launch
set /p AUTO_LAUNCH="🚀 Would you like Flavorly to auto-launch on startup? (y/N): "
if /i "%AUTO_LAUNCH%"=="y" (
    echo 🔧 Setting up auto-launch...
    
    REM Create startup shortcut
    if not exist "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup" mkdir "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
    echo @echo off > "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\%APP_NAME%.bat"
echo start "" /min "%INSTALL_DIR%\%APP_NAME%\index.html" >> "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\%APP_NAME%.bat"
    
    echo ✅ Auto-launch enabled!
)

REM Create registry entries for file associations (optional)
echo 🔗 Creating system integration...
reg add "HKCU\Software\Classes\.flavorly" /ve /t REG_SZ /d "FlavorlyRecipe" /f >nul 2>&1
reg add "HKCU\Software\Classes\FlavorlyRecipe" /ve /t REG_SZ /d "Flavorly Recipe" /f >nul 2>&1
reg add "HKCU\Software\Classes\FlavorlyRecipe\DefaultIcon" /ve /t REG_SZ /d "%INSTALL_DIR%\%APP_NAME%\favicon.svg" /f >nul 2>&1
reg add "HKCU\Software\Classes\FlavorlyRecipe\shell\open\command" /ve /t REG_SZ /d "\"%INSTALL_DIR%\%APP_NAME%\index.html\" \"%%1\"" /f >nul 2>&1

echo.
echo 🎉 Installation completed successfully!
echo.
echo 📱 How to use Flavorly:
echo    • Double-click the desktop shortcut
echo    • Find it in your Start Menu under "Flavorly"
echo    • Quick actions: Generate Recipe, My Recipes
echo    • Or run: %INSTALL_DIR%\%APP_NAME%\launch.bat
echo.
echo ⚡ Quick Access:
echo    • Keyboard shortcut: Ctrl+Shift+F (when app is open)
echo    • Right-click Start Menu shortcuts for quick actions
echo    • Use app shortcuts for instant access
echo.
echo 🌐 PWA Features:
echo    • Install as web app from browser for best experience
echo    • Works offline with cached recipes
echo    • Native app-like experience
echo.
echo 🗑️  To uninstall: Run %INSTALL_DIR%\%APP_NAME%\uninstall.bat
echo.
echo 🍳 Enjoy cooking with AI-powered recipes!
echo.
pause
