#!/bin/bash

# Flavorly App Installer - Enhanced Version
# Professional app installation with PWA support

echo "🍳 Flavorly App Installer"
echo "=========================="
echo ""

# Check if running on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "✅ Detected macOS system"
    INSTALL_DIR="$HOME/Applications"
    APP_NAME="Flavorly"
    PLATFORM="macos"
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "✅ Detected Linux system"
    INSTALL_DIR="$HOME/.local/share/applications"
    APP_NAME="Flavorly"
    PLATFORM="linux"
    
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    echo "✅ Detected Windows system"
    INSTALL_DIR="$HOME/AppData/Local/Programs"
    APP_NAME="Flavorly"
    PLATFORM="windows"
    
else
    echo "❌ Unsupported operating system"
    exit 1
fi

# Create installation directory
echo "📁 Creating installation directory..."
mkdir -p "$INSTALL_DIR"

# Get current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"

# Copy app files
echo "📦 Installing app files..."
if [ -d "$SCRIPT_DIR/app-files" ]; then
    cp -r "$SCRIPT_DIR/app-files" "$INSTALL_DIR/$APP_NAME"
else
    # Install from current directory
    mkdir -p "$INSTALL_DIR/$APP_NAME"
    cp -r "$SCRIPT_DIR"/*.html "$SCRIPT_DIR"/*.js "$SCRIPT_DIR"/*.css "$SCRIPT_DIR"/*.json "$SCRIPT_DIR"/*.svg "$SCRIPT_DIR"/*.xml "$INSTALL_DIR/$APP_NAME/" 2>/dev/null
fi

# Create desktop shortcut with PWA support
echo "🖥️  Creating desktop shortcut..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - Create .command file and .app bundle
    cat > "$HOME/Desktop/$APP_NAME.command" << EOF
#!/bin/bash
echo "🍳 Launching Flavorly..."
open "$INSTALL_DIR/$APP_NAME/index.html"
EOF
    chmod +x "$HOME/Desktop/$APP_NAME.command"
    
    # Create macOS app bundle
    APP_BUNDLE_DIR="$INSTALL_DIR/$APP_NAME.app"
    mkdir -p "$APP_BUNDLE_DIR/Contents/MacOS"
    mkdir -p "$APP_BUNDLE_DIR/Contents/Resources"
    
    cat > "$APP_BUNDLE_DIR/Contents/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>Flavorly</string>
    <key>CFBundleExecutable</key>
    <string>launch.sh</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon.icns</string>
    <key>CFBundleIdentifier</key>
    <string>com.flavorly.app</string>
    <key>CFBundleName</key>
    <string>Flavorly</string>
    <key>CFBundleVersion</key>
    <string>1.0</string>
    <key>LSUIElement</key>
    <false/>
</dict>
</plist>
EOF
    
    cat > "$APP_BUNDLE_DIR/Contents/MacOS/launch.sh" << EOF
#!/bin/bash
open "$INSTALL_DIR/$APP_NAME/index.html"
EOF
    chmod +x "$APP_BUNDLE_DIR/Contents/MacOS/launch.sh"
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux - Create .desktop file with PWA support
    cat > "$HOME/.local/share/applications/$APP_NAME.desktop" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Flavorly
Comment=AI-Powered Recipe Generator - Generate delicious recipes with AI
Exec=xdg-open "$INSTALL_DIR/$APP_NAME/index.html"
Icon=$INSTALL_DIR/$APP_NAME/favicon.svg
Terminal=false
Categories=Food;Cooking;Utility;
Keywords=recipe;cooking;ai;food;kitchen;
StartupWMClass=Flavorly
MimeType=text/html;
Actions=NewRecipe;MyRecipes;

[Desktop Action NewRecipe]
Name=Generate Recipe
Exec=xdg-open "$INSTALL_DIR/$APP_NAME/index.html?action=generate"

[Desktop Action MyRecipes]
Name=My Recipes
Exec=xdg-open "$INSTALL_DIR/$APP_NAME/index.html?action=recipes"
EOF
    
    # Make desktop file executable
    chmod +x "$HOME/.local/share/applications/$APP_NAME.desktop"
    
    # Create desktop shortcut
    cp "$HOME/.local/share/applications/$APP_NAME.desktop" "$HOME/Desktop/" 2>/dev/null
    
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    # Windows - Create .bat file and shortcut
    cat > "$HOME/Desktop/$APP_NAME.bat" << EOF
@echo off
echo 🍳 Launching Flavorly...
start "" "$INSTALL_DIR/$APP_NAME/index.html"
EOF
    
    # Create Start Menu shortcut
    START_MENU_DIR="$APPDATA/Microsoft/Windows/Start Menu/Programs/Flavorly"
    mkdir -p "$START_MENU_DIR"
    cat > "$START_MENU_DIR/$APP_NAME.bat" << EOF
@echo off
start "" "$INSTALL_DIR/$APP_NAME/index.html"
EOF
fi

# Set permissions
echo "🔐 Setting permissions..."
chmod -R 755 "$INSTALL_DIR/$APP_NAME" 2>/dev/null

# Create enhanced uninstaller
echo "🗑️  Creating uninstaller..."
cat > "$INSTALL_DIR/$APP_NAME/uninstall.sh" << EOF
#!/bin/bash
echo "🗑️  Uninstalling Flavorly App..."
rm -rf "$INSTALL_DIR/$APP_NAME"
rm -rf "$INSTALL_DIR/$APP_NAME.app" 2>/dev/null
rm -f "$HOME/Desktop/$APP_NAME.command" 2>/dev/null
rm -f "$HOME/Desktop/$APP_NAME.bat" 2>/dev/null
rm -f "$HOME/Desktop/$APP_NAME.desktop" 2>/dev/null
rm -f "$HOME/.local/share/applications/$APP_NAME.desktop" 2>/dev/null
rm -rf "$APPDATA/Microsoft/Windows/Start Menu/Programs/Flavorly" 2>/dev/null
echo "✅ Flavorly App uninstalled successfully!"
EOF
chmod +x "$INSTALL_DIR/$APP_NAME/uninstall.sh"

# Create launcher script for easy access
echo "🚀 Creating launcher..."
cat > "$INSTALL_DIR/$APP_NAME/launch.sh" << EOF
#!/bin/bash
echo "🍳 Launching Flavorly..."
if command -v open >/dev/null 2>&1; then
    open "$INSTALL_DIR/$APP_NAME/index.html"
elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$INSTALL_DIR/$APP_NAME/index.html"
else
    python -m webbrowser "$INSTALL_DIR/$APP_NAME/index.html"
fi
EOF
chmod +x "$INSTALL_DIR/$APP_NAME/launch.sh"

# Ask about auto-launch (for desktop apps)
echo ""
read -p "🚀 Would you like Flavorly to auto-launch on startup? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔧 Setting up auto-launch..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS auto-launch
        osascript -e "tell application \"System Events\" to make login item at end with properties {path:\"$INSTALL_DIR/$APP_NAME/Contents/MacOS/launch.sh\", hidden:false}" 2>/dev/null
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux auto-launch
        AUTOSTART_DIR="$HOME/.config/autostart"
        mkdir -p "$AUTOSTART_DIR"
        cat > "$AUTOSTART_DIR/$APP_NAME.desktop" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Flavorly
Comment=AI-Powered Recipe Generator
Exec=xdg-open "$INSTALL_DIR/$APP_NAME/index.html"
Hidden=false
X-GNOME-Autostart-enabled=true
EOF
    fi
    echo "✅ Auto-launch enabled!"
fi

# Create system integration
echo "🔗 Creating system integration..."

# Add to PATH (optional)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "export PATH=\"\$PATH:$INSTALL_DIR/$APP_NAME\"" >> "$HOME/.bashrc" 2>/dev/null
    echo "export PATH=\"\$PATH:$INSTALL_DIR/$APP_NAME\"" >> "$HOME/.zshrc" 2>/dev/null
fi

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📱 How to use Flavorly:"
echo "   • Double-click the desktop shortcut"
echo "   • Or run: $INSTALL_DIR/$APP_NAME/launch.sh"
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "   • Or find it in Applications folder"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "   • Or find it in your applications menu"
fi
echo ""
echo "⚡ Quick Access:"
echo "   • Keyboard shortcut: Ctrl+Shift+F (when app is open)"
echo "   • Right-click desktop shortcut for quick actions"
echo "   • Use app shortcuts: Generate Recipe, My Recipes"
echo ""
echo "🌐 PWA Features:"
echo "   • Install as web app from browser for best experience"
echo "   • Works offline with cached recipes"
echo "   • Native app-like experience"
echo ""
echo "🗑️  To uninstall: Run $INSTALL_DIR/$APP_NAME/uninstall.sh"
echo ""
echo "🍳 Enjoy cooking with AI-powered recipes!"
