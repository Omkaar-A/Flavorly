# Flavorly

Flavorly is an AI-powered recipe platform that creates personalized meals based on your tastes, dietary needs, and available ingredients. Instead of searching through endless recipes, Flavorly generates custom dishes instantly, helping you cook smarter, eat better, and enjoy every meal.

## 🚀 Features

- **AI Recipe Generation** - Powered by Gemma 3 27B from Google AI Studio
- **Personalized Recommendations** - Based on dietary preferences, health status, and cuisine
- **Optional Ingredients** - Generate recipes with or without specific ingredients
- **User Authentication** - Sign up, login, and profile management
- **Password Reset** - Real email system with EmailJS integration
- **Legal Compliance** - Terms of Service and Privacy Policy
- **Responsive Design** - Works on all devices

## 🛠️ Setup Instructions

### 1. AI Model Configuration (Admin Only)

Only administrators need to configure AI API keys. All users share these keys.

#### Step 1: Get API Key

**Gemma 3 27B AI:**
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign up and create an API key
3. Copy your key (starts with `AIza`)

#### Step 2: Add API Key to Code

Open `script.js` and find the `AI_CONFIG` object (around line 610):

```javascript
const AI_CONFIG = {
    gemma: {
        apiKey: 'YOUR_GEMMA_API_KEY_HERE', // Add your Gemma API key
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b:generateContent',
        model: 'gemma-3-27b'
    }
};
```

Replace the placeholder text with your actual API key.

#### Step 3: Access Admin Settings

1. Sign up/login with your admin email (`omkaar.anand@gmail.com`)
2. Click the ⚙️ settings button in the navigation
3. Enter your API keys and save

### 2. EmailJS Setup (For Real Emails)

To send real password reset emails:

#### Step 1: Create EmailJS Account
1. Go to [emailjs.com](https://www.emailjs.com)
2. Sign up for a free account
3. Choose the Free Plan (200 emails/month)

#### Step 2: Add Email Service
1. Click "Email Services" → "Add New Service"
2. Choose your email provider (Gmail, Outlook, etc.)
3. Connect your email account
4. Copy the Service ID

#### Step 3: Create Email Template
1. Click "Email Templates" → "Create New Template"
2. **Template Name:** `Password Reset`
3. **Subject:** `Reset your Flavorly password`
4. **Email Content:**
```
Hello {{to_email}},

Click here to reset your password: {{reset_link}}

This link expires in 1 hour.

If you didn't request this password reset, please ignore this email.

Best regards,
The {{from_name}} Team
```
5. Click "Save" and copy the Template ID

#### Step 4: Get Public Key
1. Click "Account" in the left menu
2. Copy your Public Key

#### Step 5: Update Code
Open `script.js` and find the `EMAILJS_CONFIG` (around line 70):

```javascript
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY_HERE',
    SERVICE_ID: 'YOUR_SERVICE_ID_HERE',
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID_HERE'
};

// Initialize EmailJS
(function() {
    emailjs.init("YOUR_PUBLIC_KEY_HERE");
})();
```

Replace the placeholders with your actual EmailJS credentials.

### 3. Admin Access

Default admin email: `omkaar.anand@gmail.com`

To add more admins, update the `adminEmails` array in the `showSettingsModal()` function:

```javascript
const adminEmails = ['admin@flavorly.com', 'omkaar.anand@gmail.com', 'another_admin@example.com'];
```

## 🎯 Usage

### For Users:
1. **Sign up** for an account
2. **Generate recipes** by entering your preferences
3. **Save recipes** to your profile
4. **Reset password** if needed (real emails sent)

### For Admins:
1. **Configure AI keys** in settings
2. **Manage user access** through admin controls
3. **Monitor API usage** and costs

## 🔧 Technical Details

- **Frontend:** HTML, CSS, JavaScript (TailwindCSS)
- **AI Model:** Gemma 3 27B (Google AI Studio)
- **Email Service:** EmailJS
- **Storage:** Browser localStorage
- **Authentication:** Frontend-only with localStorage

## 📄 Legal

- **Terms of Service:** Available in footer
- **Privacy Policy:** Available in footer
- **GDPR Compliant:** User data handling and rights

## 🌐 Deployment

This is a frontend-only application. To deploy:
1. Host on any static hosting service (Netlify, Vercel, GitHub Pages)
2. No backend required
3. All functionality works in the browser

## 📞 Support

For issues or questions:
- **Email:** support@flavorly.com
- **GitHub:** [Issues](https://github.com/Omkaar-A/Flavorly/issues)

## 📄 License

© 2024 Flavorly. All rights reserved.
