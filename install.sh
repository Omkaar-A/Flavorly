#!/bin/bash

# Flavorly App Installer
# Professional app installation script

echo "🍳 Flavorly App Installer"
echo "=========================="
echo ""

# Check if running on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "✅ Detected macOS system"
    INSTALL_DIR="$HOME/Applications"
    APP_NAME="Flavorly"
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "✅ Detected Linux system"
    INSTALL_DIR="$HOME/.local/share/applications"
    APP_NAME="Flavorly"
    
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    echo "✅ Detected Windows system"
    INSTALL_DIR="$HOME/AppData/Local/Programs"
    APP_NAME="Flavorly"
    
else
    echo "❌ Unsupported operating system"
    exit 1
fi

# Create installation directory
echo "📁 Creating installation directory..."
mkdir -p "$INSTALL_DIR"

# Extract app files
echo "📦 Extracting app files..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
cp -r "$SCRIPT_DIR/app-files" "$INSTALL_DIR/$APP_NAME"

# Create desktop shortcut
echo "🖥️  Creating desktop shortcut..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    cat > "$HOME/Desktop/$APP_NAME.command" << EOF
#!/bin/bash
open "$INSTALL_DIR/$APP_NAME/app.html"
EOF
    chmod +x "$HOME/Desktop/$APP_NAME.command"
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    cat > "$HOME/.local/share/applications/$APP_NAME.desktop" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Flavorly
Comment=AI-Powered Recipe Generator
Exec=xdg-open "$INSTALL_DIR/$APP_NAME/app.html"
Icon=$INSTALL_DIR/$APP_NAME/favicon.svg
Terminal=false
Categories=Food;Cooking;
EOF
    
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    # Windows
    cat > "$HOME/Desktop/$APP_NAME.bat" << EOF
@echo off
start "" "$INSTALL_DIR/$APP_NAME/app.html"
EOF
fi

# Set permissions
echo "🔐 Setting permissions..."
chmod -R 755 "$INSTALL_DIR/$APP_NAME"

# Create uninstaller
echo "🗑️  Creating uninstaller..."
cat > "$INSTALL_DIR/$APP_NAME/uninstall.sh" << EOF
#!/bin/bash
echo "🗑️  Uninstalling Flavorly App..."
rm -rf "$INSTALL_DIR/$APP_NAME"
rm -f "$HOME/Desktop/$APP_NAME.command" 2>/dev/null
rm -f "$HOME/Desktop/$APP_NAME.bat" 2>/dev/null
rm -f "$HOME/.local/share/applications/$APP_NAME.desktop" 2>/dev/null
echo "✅ Flavorly App uninstalled successfully!"
EOF
chmod +x "$INSTALL_DIR/$APP_NAME/uninstall.sh"

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📱 How to use Flavorly:"
echo "   • Double-click the desktop shortcut"
echo "   • Or open: $INSTALL_DIR/$APP_NAME/app.html"
echo ""
echo "🗑️  To uninstall: Run $INSTALL_DIR/$APP_NAME/uninstall.sh"
echo ""
echo "🍳 Enjoy cooking with AI-powered recipes!"
