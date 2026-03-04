#!/bin/bash

# Flavorly App Package Creator
# This script creates a downloadable app package

echo "🍳 Creating Flavorly App Package..."

# Create app directory
mkdir -p Flavorly-App

# Copy essential files
cp index.html Flavorly-App/
cp script.js Flavorly-App/
cp favicon.svg Flavorly-App/
cp privacy.html Flavorly-App/
cp terms.html Flavorly-App/
cp Flavorly-App-README.md Flavorly-App/

# Create app manifest
cat > Flavorly-App/manifest.json << 'EOF'
{
  "name": "Flavorly - AI Recipe Generator",
  "short_name": "Flavorly",
  "description": "Transform your ingredients into extraordinary meals with AI-powered recipes",
  "start_url": "index.html",
  "display": "standalone",
  "background_color": "#FF6B35",
  "theme_color": "#FF6B35",
  "orientation": "portrait",
  "icons": [
    {
      "src": "favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ],
  "categories": ["food", "lifestyle", "productivity"],
  "lang": "en",
  "dir": "ltr"
}
EOF

# Create app icon in different sizes
echo "📱 Creating app icons..."

# Create a simple app launcher script
cat > Flavorly-App/launch.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Launching Flavorly App...</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
            color: white;
            text-align: center;
            padding: 2rem;
            margin: 0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .loader {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .logo {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="logo">🍳</div>
    <h1>Flavorly</h1>
    <div class="loader"></div>
    <p>Launching your AI Recipe Generator...</p>
    <p><small>This will open in 3 seconds...</small></p>
    
    <script>
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    </script>
</body>
</html>
EOF

echo "✅ App package created successfully!"
echo "📁 Location: Flavorly-App/"
echo "🚀 Ready for distribution!"
