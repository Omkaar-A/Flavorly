// Authentication System
let currentUser = null;

// Initialize auth state
function initAuth() {
    const savedUser = localStorage.getItem('flavorlyUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
}

// Modal functions
// Modern Authentication System
function showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    modal.id = 'auth-modal';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
            <button onclick="closeAuthModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <i class="fas fa-times text-xl"></i>
            </button>
            
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-utensils text-white text-2xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                <p class="text-gray-600">Sign in to your Flavorly account</p>
            </div>
            
            <form id="loginForm" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div class="relative">
                        <input type="email" id="loginEmail" required class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="you@example.com">
                        <i class="fas fa-envelope absolute left-3 top-3.5 text-gray-400"></i>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div class="relative">
                        <input type="password" id="loginPassword" required class="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Enter your password">
                        <i class="fas fa-lock absolute left-3 top-3.5 text-gray-400"></i>
                        <button type="button" onclick="togglePassword('loginPassword')" class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="flex items-center justify-between">
                    <label class="flex items-center">
                        <input type="checkbox" id="rememberMe" class="form-checkbox text-orange-600 mr-2">
                        <span class="text-sm text-gray-600">Remember me</span>
                    </label>
                    <button type="button" onclick="showForgotPassword()" class="text-sm text-orange-600 hover:text-orange-700">
                        Forgot password?
                    </button>
                </div>
                
                <button type="submit" class="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                    Sign In
                </button>
                
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-3">
                    <button type="button" onclick="socialLogin('google')" class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <i class="fab fa-google text-red-500 mr-2"></i>
                        Google
                    </button>
                    <button type="button" onclick="socialLogin('facebook')" class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <i class="fab fa-facebook text-blue-600 mr-2"></i>
                        Facebook
                    </button>
                </div>
                
                <div class="text-center">
                    <p class="text-sm text-gray-600">
                        Don't have an account? 
                        <button type="button" onclick="switchToSignup()" class="text-orange-600 hover:text-orange-700 font-semibold">
                            Sign up
                        </button>
                    </p>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

function showSignupModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    modal.id = 'auth-modal';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
            <button onclick="closeAuthModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <i class="fas fa-times text-xl"></i>
            </button>
            
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-user-plus text-white text-2xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
                <p class="text-gray-600">Join Flavorly and start creating amazing recipes</p>
            </div>
            
            <form id="signupForm" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div class="relative">
                        <input type="text" id="signupName" required class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="John Doe">
                        <i class="fas fa-user absolute left-3 top-3.5 text-gray-400"></i>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div class="relative">
                        <input type="email" id="signupEmail" required class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="you@example.com">
                        <i class="fas fa-envelope absolute left-3 top-3.5 text-gray-400"></i>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div class="relative">
                        <input type="password" id="signupPassword" required minlength="6" class="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Create a strong password">
                        <i class="fas fa-lock absolute left-3 top-3.5 text-gray-400"></i>
                        <button type="button" onclick="togglePassword('signupPassword')" class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div class="mt-2">
                        <div class="flex items-center text-xs text-gray-500">
                            <i class="fas fa-info-circle mr-1"></i>
                            Password must be at least 6 characters
                        </div>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div class="relative">
                        <input type="password" id="confirmPassword" required minlength="6" class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Confirm your password">
                        <i class="fas fa-lock absolute left-3 top-3.5 text-gray-400"></i>
                    </div>
                </div>
                
                <div class="flex items-center">
                    <input type="checkbox" id="agreeTerms" required class="form-checkbox text-orange-600 mr-2">
                    <label for="agreeTerms" class="text-sm text-gray-600">
                        I agree to the <a href="terms.html" target="_blank" class="text-orange-600 hover:text-orange-700">Terms of Service</a> and <a href="privacy.html" target="_blank" class="text-orange-600 hover:text-orange-700">Privacy Policy</a>
                    </label>
                </div>
                
                <button type="submit" class="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                    Create Account
                </button>
                
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">Or sign up with</span>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-3">
                    <button type="button" onclick="socialSignup('google')" class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <i class="fab fa-google text-red-500 mr-2"></i>
                        Google
                    </button>
                    <button type="button" onclick="socialSignup('facebook')" class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <i class="fab fa-facebook text-blue-600 mr-2"></i>
                        Facebook
                    </button>
                </div>
                
                <div class="text-center">
                    <p class="text-sm text-gray-600">
                        Already have an account? 
                        <button type="button" onclick="switchToLogin()" class="text-orange-600 hover:text-orange-700 font-semibold">
                            Sign in
                        </button>
                    </p>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.remove();
    }
}

function switchToSignup() {
    closeAuthModal();
    showSignupModal();
}

function switchToLogin() {
    closeAuthModal();
    showLoginModal();
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = event.target;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function socialLogin(provider) {
    showNotification(`${provider} login coming soon!`, 'info');
}

function socialSignup(provider) {
    showNotification(`${provider} signup coming soon!`, 'info');
}

function showForgotPassword() {
    const email = document.getElementById('loginEmail').value;
    if (!email) {
        showNotification('Please enter your email address first', 'error');
        return;
    }
    
    // Generate reset token
    const resetToken = generateResetToken();
    const resetLink = `${window.location.origin}${window.location.pathname}?reset=${resetToken}&email=${encodeURIComponent(email)}`;
    
    // Store reset token
    const resetTokens = JSON.parse(localStorage.getItem('passwordResetTokens') || '{}');
    resetTokens[resetToken] = {
        email: email,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour expiry
    };
    localStorage.setItem('passwordResetTokens', JSON.stringify(resetTokens));
    
    showNotification(`Password reset link sent to ${email}! (Demo mode)`, 'success');
    closeAuthModal();
}

// Authentication Handlers
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('flavorlyUsers') || '[]');
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Login successful
        currentUser = user;
        
        // Save to localStorage if remember me is checked
        if (rememberMe) {
            localStorage.setItem('flavorlyUser', JSON.stringify(user));
        } else {
            sessionStorage.setItem('flavorlyUser', JSON.stringify(user));
        }
        
        showNotification(`Welcome back, ${user.name}!`, 'success');
        closeAuthModal();
        updateUIForLoggedInUser();
        
        // Redirect to recipe generator or dashboard
        setTimeout(() => {
            showRecipeGenerator();
        }, 1000);
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
        return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('flavorlyUsers') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showNotification('An account with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString(),
        preferences: {
            dietary: '',
            cuisine: '',
            flavors: []
        },
        savedRecipes: []
    };
    
    // Save user
    users.push(newUser);
    localStorage.setItem('flavorlyUsers', JSON.stringify(users));
    
    // Auto login
    currentUser = newUser;
    localStorage.setItem('flavorlyUser', JSON.stringify(newUser));
    
    showNotification(`Welcome to Flavorly, ${name}!`, 'success');
    closeAuthModal();
    updateUIForLoggedInUser();
    
    // Redirect to recipe generator
    setTimeout(() => {
        showRecipeGenerator();
    }, 1000);
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    const navButtons = document.querySelector('nav .flex.space-x-4');
    if (currentUser && navButtons) {
        navButtons.innerHTML = `
            <button class="text-gray-600 hover:text-orange-600 transition-colors">Features</button>
            <button class="text-gray-600 hover:text-orange-600 transition-colors">How it Works</button>
            <button class="text-gray-600 hover:text-orange-600 transition-colors">My Recipes</button>
            <button onclick="showSettingsModal()" class="text-gray-600 hover:text-orange-600 transition-colors">
                <i class="fas fa-cog"></i>
            </button>
            <div class="relative group">
                <button class="flex items-center text-gray-600 hover:text-orange-600 transition-colors">
                    <i class="fas fa-user-circle mr-2"></i>${currentUser.name}
                    <i class="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
                <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <a href="#" onclick="showProfileModal()" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
                    <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
                    <hr class="my-1">
                    <a href="#" onclick="logout()" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Log Out</a>
                </div>
            </div>
        `;
    }
}

// EmailJS Configuration - You need to set these up
const EMAILJS_CONFIG = {
    PUBLIC_KEY: '', // Add your EmailJS public key here
    SERVICE_ID: '', // Add your EmailJS service ID here
    TEMPLATE_ID: '' // Add your EmailJS template ID here
};

// Initialize EmailJS
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual public key
})();

// Handle forgot password with real email
function handleForgotPassword() {
    const email = document.getElementById('loginEmail').value;
    if (!email) {
        showNotification('Please enter your email address first', 'error');
        return;
    }
    
    // Check if EmailJS is configured
    if (!EMAILJS_CONFIG.PUBLIC_KEY || !EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.TEMPLATE_ID) {
        showNotification('EmailJS not configured. Please see setup instructions.', 'error');
        showEmailSetupInstructions();
        return;
    }
    
    // Generate reset token
    const resetToken = generateResetToken();
    const resetLink = `${window.location.origin}${window.location.pathname}?reset=${resetToken}&email=${encodeURIComponent(email)}`;
    
    // Store reset token
    const resetTokens = JSON.parse(localStorage.getItem('passwordResetTokens') || '{}');
    resetTokens[resetToken] = {
        email: email,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour expiry
    };
    localStorage.setItem('passwordResetTokens', JSON.stringify(resetTokens));
    
    // Send real email using EmailJS
    sendPasswordResetEmail(email, resetLink);
}

function sendPasswordResetEmail(email, resetLink) {
    showNotification('Sending password reset email...', 'info');
    
    const templateParams = {
        to_email: email,
        reset_link: resetLink,
        from_name: 'Flavorly',
        reply_to: 'noreply@flavorly.com'
    };
    
    emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('Email sent successfully!', response.status, response.text);
            showNotification(`Password reset email sent to ${email}. Check your inbox!`, 'success');
            showEmailSuccessMessage(email, resetLink);
        }, function(error) {
            console.log('Email failed to send...', error);
            showNotification('Failed to send email. Please try again or contact support.', 'error');
            // Fallback to simulated email
            showEmailSentModal(email, resetLink);
        });
}

function showEmailSetupInstructions() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">EmailJS Setup Required</h2>
                <button onclick="closeEmailSetupModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="space-y-6">
                <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p class="text-sm text-yellow-800">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        To send real emails, you need to set up EmailJS. Follow these steps:
                    </p>
                </div>
                
                <div class="space-y-4">
                    <div class="border-l-4 border-orange-500 pl-4">
                        <h3 class="font-semibold text-gray-800 mb-2">Step 1: Create EmailJS Account</h3>
                        <p class="text-gray-600 mb-2">Go to <a href="https://www.emailjs.com/" target="_blank" class="text-orange-600 hover:underline">emailjs.com</a> and sign up for a free account.</p>
                    </div>
                    
                    <div class="border-l-4 border-orange-500 pl-4">
                        <h3 class="font-semibold text-gray-800 mb-2">Step 2: Create Email Service</h3>
                        <p class="text-gray-600 mb-2">Add an email service (Gmail, Outlook, etc.) in EmailJS dashboard.</p>
                    </div>
                    
                    <div class="border-l-4 border-orange-500 pl-4">
                        <h3 class="font-semibold text-gray-800 mb-2">Step 3: Create Email Template</h3>
                        <p class="text-gray-600 mb-2">Create a template with these variables:</p>
                        <code class="block bg-gray-100 p-2 rounded text-sm mt-2">
                            {{to_email}}, {{reset_link}}, {{from_name}}, {{reply_to}}
                        </code>
                    </div>
                    
                    <div class="border-l-4 border-orange-500 pl-4">
                        <h3 class="font-semibold text-gray-800 mb-2">Step 4: Get Your Keys</h3>
                        <p class="text-gray-600 mb-2">Copy your Public Key, Service ID, and Template ID.</p>
                    </div>
                    
                    <div class="border-l-4 border-orange-500 pl-4">
                        <h3 class="font-semibold text-gray-800 mb-2">Step 5: Update Code</h3>
                        <p class="text-gray-600 mb-2">Open script.js and update EMAILJS_CONFIG with your keys.</p>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-gray-800 mb-2">Sample Email Template:</h3>
                    <pre class="text-sm text-gray-700 whitespace-pre-wrap">
Hello,

Click here to reset your password: {{reset_link}}

This link expires in 1 hour.

Best regards,
{{from_name}} Team
                    </pre>
                </div>
            </div>
            
            <div class="mt-6 flex justify-end">
                <button onclick="closeEmailSetupModal()" class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                    I Understand
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeEmailSetupModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
    }
}

function showEmailSuccessMessage(email, resetLink) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div class="text-center">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-check text-green-600 text-2xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-4">Email Sent Successfully!</h2>
                <p class="text-gray-600 mb-6">
                    We've sent a password reset link to:<br>
                    <strong>${email}</strong>
                </p>
                <p class="text-gray-600 mb-6">
                    Please check your inbox and spam folder. The link expires in 1 hour.
                </p>
                <div class="space-y-3">
                    <button onclick="closeEmailSuccessModal()" class="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                        Got it!
                    </button>
                    <button onclick="copyResetLink('${resetLink}')" class="w-full border border-orange-600 text-orange-600 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                        Copy Reset Link
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeEmailSuccessModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
    }
}

function generateResetToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function showEmailSentModal(email, resetLink) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Password Reset Email Sent</h2>
                <button onclick="closeEmailModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="mb-6">
                <div class="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                    <p class="text-sm text-blue-800">
                        <i class="fas fa-info-circle mr-2"></i>
                        This is a simulated email system. In a real application, this email would be sent to your inbox.
                    </p>
                </div>
            </div>
            
            <div class="border border-gray-200 rounded-lg overflow-hidden">
                <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                            <i class="fas fa-utensils text-white text-sm"></i>
                        </div>
                        <div>
                            <p class="font-semibold text-gray-800">Flavorly</p>
                            <p class="text-xs text-gray-500">noreply@flavorly.com</p>
                        </div>
                    </div>
                </div>
                
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">Password Reset Request</h3>
                    <p class="text-gray-600 mb-4">Hello,</p>
                    <p class="text-gray-600 mb-4">
                        We received a request to reset the password for your Flavorly account associated with this email address.
                    </p>
                    <p class="text-gray-600 mb-4">
                        Click the button below to reset your password. This link will expire in 1 hour.
                    </p>
                    
                    <div class="my-6">
                        <a href="${resetLink}" class="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                            Reset Password
                        </a>
                    </div>
                    
                    <p class="text-gray-600 mb-4">
                        Or copy and paste this link into your browser:
                    </p>
                    <div class="bg-gray-100 p-3 rounded-lg break-all">
                        <code class="text-sm text-gray-700">${resetLink}</code>
                    </div>
                    
                    <p class="text-gray-600 mb-4">
                        If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
                    </p>
                    
                    <p class="text-gray-600">
                        Best regards,<br>
                        The Flavorly Team
                    </p>
                </div>
                
                <div class="bg-gray-50 px-4 py-3 border-t border-gray-200">
                    <p class="text-xs text-gray-500 text-center">
                        This is an automated message. Please do not reply to this email.
                    </p>
                </div>
            </div>
            
            <div class="mt-6 flex justify-end space-x-3">
                <button onclick="closeEmailModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">
                    Close
                </button>
                <button onclick="copyResetLink('${resetLink}')" class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                    Copy Link
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeEmailModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
    }
}

function copyResetLink(link) {
    navigator.clipboard.writeText(link).then(() => {
        showNotification('Reset link copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy link', 'error');
    });
}

// Check for password reset on page load
function checkPasswordReset() {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('reset');
    const email = urlParams.get('email');
    
    if (resetToken && email) {
        const resetTokens = JSON.parse(localStorage.getItem('passwordResetTokens') || '{}');
        const tokenData = resetTokens[resetToken];
        
        if (tokenData && tokenData.email === email && new Date(tokenData.expiresAt) > new Date()) {
            showPasswordResetModal(email, resetToken);
        } else {
            showNotification('Invalid or expired reset link', 'error');
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
}

function showPasswordResetModal(email, resetToken) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Reset Password</h2>
                <button onclick="closePasswordResetModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <form id="resetPasswordForm" class="space-y-4">
                <input type="hidden" id="resetEmail" value="${email}">
                <input type="hidden" id="resetToken" value="${resetToken}">
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" value="${email}" disabled class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input type="password" id="newPassword" required minlength="6" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="Enter new password">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input type="password" id="confirmNewPassword" required minlength="6" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="Confirm new password">
                </div>
                
                <button type="submit" class="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                    Reset Password
                </button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add form submit handler
    document.getElementById('resetPasswordForm').addEventListener('submit', handlePasswordReset);
}

function closePasswordResetModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
    }
}

function handlePasswordReset(e) {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail').value;
    const token = document.getElementById('resetToken').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    // Get users and update password
    const users = JSON.parse(localStorage.getItem('flavorlyUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('flavorlyUsers', JSON.stringify(users));
        
        // Clean up reset token
        const resetTokens = JSON.parse(localStorage.getItem('passwordResetTokens') || '{}');
        delete resetTokens[token];
        localStorage.setItem('passwordResetTokens', JSON.stringify(resetTokens));
        
        showNotification('Password reset successfully! You can now log in with your new password.', 'success');
        closePasswordResetModal();
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else {
        showNotification('User not found', 'error');
    }
}

// Handle login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    console.log('=== LOGIN DEBUG ===');
    console.log('Login attempt:', { email, password });
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('flavorlyUsers') || '[]');
    console.log('All users in storage:', users);
    console.log('Number of users:', users.length);
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    console.log('Found user:', user);
    
    if (user) {
        console.log('✅ Login successful!');
        currentUser = user;
        localStorage.setItem('flavorlyUser', JSON.stringify(user));
        updateUIForLoggedInUser();
        closeLoginModal();
        showNotification('Welcome back, ' + user.name + '!', 'success');
        
        // Reset form
        document.getElementById('loginForm').reset();
    } else {
        console.log('❌ Login failed. Checking for email match only...');
        const emailMatch = users.find(u => u.email === email);
        console.log('Email match found:', emailMatch);
        
        if (!emailMatch) {
            console.log('❌ No user found with this email. You may need to sign up first.');
            showNotification('No account found with this email. Please sign up first.', 'error');
        } else {
            console.log('❌ Email found but password incorrect.');
            showNotification('Incorrect password. Try again or use "Forgot password".', 'error');
        }
    }
    console.log('=== END LOGIN DEBUG ===');
});

// Handle signup
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
    console.log('Signup attempt:', { name, email, password, confirmPassword, terms });
    
    // Validation
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (!terms) {
        showNotification('Please accept the terms and conditions', 'error');
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('flavorlyUsers') || '[]');
    console.log('Existing users before signup:', users);
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showNotification('An account with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
        savedRecipes: []
    };
    
    console.log('Creating new user:', newUser);
    
    users.push(newUser);
    localStorage.setItem('flavorlyUsers', JSON.stringify(users));
    
    console.log('Users after signup:', JSON.parse(localStorage.getItem('flavorlyUsers')));
    
    // Auto login
    currentUser = newUser;
    localStorage.setItem('flavorlyUser', JSON.stringify(newUser));
    updateUIForLoggedInUser();
    closeSignupModal();
    showNotification('Account created successfully! Welcome to Flavorly!', 'success');
    
    // Reset form
    document.getElementById('signupForm').reset();
});

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('flavorlyUser');
    
    // Reset navigation
    const navButtons = document.querySelector('nav .flex.space-x-4');
    if (navButtons) {
        navButtons.innerHTML = `
            <button class="text-gray-600 hover:text-orange-600 transition-colors">Features</button>
            <button class="text-gray-600 hover:text-orange-600 transition-colors">How it Works</button>
            <button onclick="showSettingsModal()" class="text-gray-600 hover:text-orange-600 transition-colors">
                <i class="fas fa-cog"></i>
            </button>
            <button onclick="showLoginModal()" class="text-gray-600 hover:text-orange-600 transition-colors">Log In</button>
            <button onclick="showSignupModal()" class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                Sign Up
            </button>
        `;
    }
    
    showNotification('Logged out successfully', 'success');
}

// Show recipe generator section
function showRecipeGenerator() {
    const generator = document.getElementById('recipe-generator');
    generator.classList.remove('hidden');
    generator.scrollIntoView({ behavior: 'smooth' });
}

// AI Configuration - Admin keys (only you need to set these)
const AI_CONFIG = {
    gemma: {
        apiKey: '', // GitHub secret: GEMMA_API_KEY - will be injected by GitHub Actions
        endpoint: 'https://generativelanguage.googleapis.com/v1/models/gemma-1.1-7b-it:generateContent',
        model: 'gemma-1.1-7b-it'
    }
};

// Current AI model preference
let currentAIModel = 'gemma'; // Default to Gemma

// Check if API keys are configured
function areApiKeysConfigured() {
    return AI_CONFIG.gemma.apiKey;
}

// AI Recipe Generation
async function generateRecipeWithAI(ingredients, dishType, healthStatus, dietary, cuisine, flavors, aiModel) {
    console.log('=== RECIPE GENERATION DEBUG ===');
    console.log('Ingredients:', ingredients);
    console.log('Dish Type:', dishType);
    console.log('Health Status:', healthStatus);
    console.log('Dietary:', dietary);
    console.log('Cuisine:', cuisine);
    console.log('Flavors:', flavors);
    console.log('AI Model:', aiModel);
    
    const modelConfig = AI_CONFIG.gemma;
    
    if (!modelConfig.apiKey) {
        console.error('❌ Gemma API key not configured');
        showNotification('Gemma API key not configured. Contact admin to set up AI models.', 'error');
        return null;
    }
    
    console.log('✅ API Key found, proceeding...');
    const prompt = createRecipePrompt(ingredients, dishType, healthStatus, dietary, cuisine, flavors);
    console.log('Generated prompt length:', prompt.length);
    
    try {
        console.log('🚀 Calling Gemma API...');
        const response = await callGemmaAPI(modelConfig, prompt);
        console.log('✅ API call successful, parsing response...');
        
        const recipe = parseAIResponse(response, 'gemma', healthStatus, dietary, cuisine, flavors);
        console.log('✅ Recipe parsed:', recipe);
        
        return recipe;
    } catch (error) {
        console.error('❌ AI API Error:', error);
        console.error('Error details:', error.message);
        showNotification('Failed to generate recipe. Please try again or contact admin.', 'error');
        return null;
    }
}

function createRecipePrompt(ingredients, dishType, healthStatus, dietary, cuisine, flavors) {
    const hasIngredients = ingredients && ingredients.length > 0 && ingredients[0] !== '';
    
    return `Create a detailed recipe based on these preferences:

${hasIngredients ? `Ingredients available: ${ingredients.join(', ')}` : 'No specific ingredients provided - suggest common ingredients'}
Dish type requested: ${dishType || 'Any'}
Health status: ${healthStatus}
Dietary restrictions: ${dietary || 'None'}
Cuisine preference: ${cuisine || 'Any'}
Flavor preferences: ${flavors.length > 0 ? flavors.join(', ') : 'None'}

${!hasIngredients ? 'Please suggest a complete ingredient list for this recipe.' : 'Use the provided ingredients and suggest additional ones if needed.'}

Please respond with a JSON object in this exact format:
{
    "name": "Recipe Name",
    "description": "Brief description of the dish",
    "time": "Total time in minutes",
    "difficulty": "Easy/Medium/Hard",
    "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
    "instructions": ["Step 1", "Step 2", "Step 3"],
    "tips": "Optional cooking tips"
}

Make sure the recipe is practical, matches all preferences exactly, and provides clear cooking instructions.`;
}

async function callGemmaAPI(config, prompt) {
    console.log('=== GEMMA API DEBUG ===');
    console.log('Endpoint:', config.endpoint);
    console.log('API Key:', config.apiKey ? 'Set' : 'Not set');
    console.log('Prompt:', prompt);
    
    try {
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000
            }
        };
        
        console.log('Request body:', JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': config.apiKey
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.error) {
            console.error('API Error:', data.error);
            throw new Error(data.error.message || 'API Error');
        }
        
        if (!data.candidates || data.candidates.length === 0) {
            console.error('No candidates in response');
            throw new Error('No recipe generated');
        }
        
        const result = data.candidates[0].content.parts[0].text;
        console.log('Generated text:', result);
        
        return result;
    } catch (error) {
        console.error('Gemma API call failed:', error);
        console.error('Error stack:', error.stack);
        throw error;
    }
}

function parseAIResponse(response, aiModel, healthStatus, dietary, cuisine, flavors) {
    try {
        // Extract JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON found in response');
        }
        
        const recipeData = JSON.parse(jsonMatch[0]);
        
        // Convert to our recipe format
        return {
            name: recipeData.name || 'Generated Recipe',
            description: recipeData.description || 'AI-generated recipe based on your preferences',
            time: recipeData.time || '30 mins',
            difficulty: recipeData.difficulty || 'Medium',
            ingredients: recipeData.ingredients || [],
            instructions: recipeData.instructions || [],
            tips: recipeData.tips || '',
            healthStatus: healthStatus || 'healthy',
            dietary: dietary || '',
            cuisine: cuisine || '',
            flavor: flavors || [],
            aiGenerated: true,
            aiModel: aiModel
        };
    } catch (error) {
        console.error('Failed to parse AI response:', error);
        throw new Error('Invalid AI response format');
    }
}

// Handle recipe form submission with AI
document.getElementById('recipe-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const ingredientsInput = document.getElementById('ingredients').value;
    const ingredients = ingredientsInput ? ingredientsInput.toLowerCase().split(',').map(i => i.trim()).filter(i => i) : [];
    const dishType = document.getElementById('dish-type').value.toLowerCase();
    const healthStatus = document.querySelector('input[name="health-status"]:checked').value;
    const dietary = document.getElementById('dietary').value;
    const cuisine = document.getElementById('cuisine').value;
    const flavorCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const flavors = Array.from(flavorCheckboxes).map(cb => cb.value);
    
    // Show loading state
    showRecipeLoading();
    
    // Generate recipe with AI (always use Gemma)
    const recipe = await generateRecipeWithAI(ingredients, dishType, healthStatus, dietary, cuisine, flavors, 'gemma');
    
    if (recipe) {
        displayRecipe(recipe);
    } else {
        displayNoRecipe();
    }
});

function showRecipeLoading() {
    const resultDiv = document.getElementById('recipe-result');
    const contentDiv = document.getElementById('recipe-content');
    
    contentDiv.innerHTML = `
        <div class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <p class="mt-4 text-gray-600">AI is creating your perfect recipe...</p>
        </div>
    `;
    
    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function displayRecipe(recipe) {
    const resultDiv = document.getElementById('recipe-result');
    const contentDiv = document.getElementById('recipe-content');
    
    const healthBadge = recipe.healthStatus === 'sick' ? 
        '<span class="bg-red-100 text-red-800 px-3 py-1 rounded-full"><i class="fas fa-heartbeat mr-1"></i>Comfort Food</span>' : 
        '<span class="bg-green-100 text-green-800 px-3 py-1 rounded-full"><i class="fas fa-heart mr-1"></i>Healthy</span>';
    
    const aiBadge = recipe.aiGenerated ? 
        `<span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"><i class="fas fa-robot mr-1"></i>${recipe.aiModel.toUpperCase()}</span>` : '';
    
    contentDiv.innerHTML = `
        <div class="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg mb-6">
            <h4 class="text-2xl font-bold text-gray-800 mb-2">${recipe.name}</h4>
            <p class="text-gray-600 mb-4">${recipe.description}</p>
            <div class="flex flex-wrap gap-4 text-sm">
                <span class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                    <i class="fas fa-clock mr-1"></i> ${recipe.time}
                </span>
                <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    <i class="fas fa-signal mr-1"></i> ${recipe.difficulty}
                </span>
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    <i class="fas fa-globe mr-1"></i> ${recipe.cuisine || 'Universal'}
                </span>
                ${healthBadge}
                ${aiBadge}
                ${recipe.dietary ? `<span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    <i class="fas fa-leaf mr-1"></i> ${recipe.dietary}
                </span>` : ''}
            </div>
        </div>
        
        <div class="mb-6">
            <h5 class="text-lg font-semibold mb-3 text-gray-800">
                <i class="fas fa-list-ol mr-2 text-orange-600"></i>Ingredients
            </h5>
            <ul class="grid md:grid-cols-2 gap-2">
                ${recipe.ingredients.map(ingredient => `
                    <li class="flex items-center text-gray-700">
                        <i class="fas fa-check text-green-500 mr-2"></i>
                        ${ingredient}
                    </li>
                `).join('')}
            </ul>
        </div>
        
        <div class="mb-6">
            <h5 class="text-lg font-semibold mb-3 text-gray-800">
                <i class="fas fa-list-ol mr-2 text-orange-600"></i>Instructions
            </h5>
            <ol class="space-y-3">
                ${recipe.instructions.map((instruction, index) => `
                    <li class="flex items-start">
                        <span class="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                            ${index + 1}
                        </span>
                        <span class="text-gray-700">${instruction}</span>
                    </li>
                `).join('')}
            </ol>
        </div>
        
        ${recipe.tips ? `
        <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
            <h5 class="font-semibold text-yellow-800 mb-2">
                <i class="fas fa-lightbulb mr-2"></i>Pro Tips
            </h5>
            <p class="text-yellow-700 text-sm">${recipe.tips}</p>
        </div>
        ` : ''}
        
        ${recipe.healthStatus === 'sick' ? `
        <div class="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <h5 class="font-semibold text-blue-800 mb-2">
                <i class="fas fa-medical-kit mr-2"></i>Health Benefits
            </h5>
            <p class="text-blue-700 text-sm">
                This recipe is designed to be gentle on your system and may help with recovery. 
                The ingredients provide essential nutrients and soothing properties to help you feel better.
            </p>
        </div>
        ` : ''}
        
        <div class="flex gap-4">
            <button onclick="saveRecipe('${recipe.name}')" class="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                <i class="fas fa-bookmark mr-2"></i>Save Recipe
            </button>
            <button onclick="shareRecipe('${recipe.name}')" class="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                <i class="fas fa-share mr-2"></i>Share
            </button>
            <button onclick="generateNewRecipe()" class="border border-orange-600 text-orange-600 px-6 py-2 rounded-lg hover:bg-orange-50 transition-colors">
                <i class="fas fa-redo mr-2"></i>Generate Another
            </button>
        </div>
    `;
    
    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// Profile management
function showProfileModal() {
    if (!currentUser) {
        showNotification('Please log in to view your profile', 'info');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    modal.id = 'profile-modal';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Profile Settings</h2>
                <button onclick="closeProfileModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" id="profileName" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" value="${currentUser.name}">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" id="profileEmail" class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" value="${currentUser.email}" disabled>
                    <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                    <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" value="${new Date(currentUser.createdAt).toLocaleDateString()}" disabled>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Saved Recipes</label>
                    <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" value="${currentUser.savedRecipes?.length || 0} recipes" disabled>
                </div>
                
                <button onclick="updateProfile()" class="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                    Update Profile
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.remove();
    }
}

function updateProfile() {
    const newName = document.getElementById('profileName').value;
    
    if (!newName.trim()) {
        showNotification('Name cannot be empty', 'error');
        return;
    }
    
    // Update user data
    const users = JSON.parse(localStorage.getItem('flavorlyUsers') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex].name = newName;
        localStorage.setItem('flavorlyUsers', JSON.stringify(users));
        
        // Update current user
        currentUser.name = newName;
        localStorage.setItem('flavorlyUser', JSON.stringify(currentUser));
        
        // Update UI
        updateUIForLoggedInUser();
        showNotification('Profile updated successfully!', 'success');
        closeProfileModal();
    }
}
function showSettingsModal() {
    // Debug: Show current user email
    console.log('Current user:', currentUser);
    console.log('Current user email:', currentUser?.email);
    
    // Check if user is admin - you can modify this to match your email
    const adminEmails = ['admin@flavorly.com', 'omkaar@example.com', 'omkaar.anand@gmail.com']; // Add your email here
    const isAdmin = currentUser && adminEmails.includes(currentUser.email);
    
    console.log('Is admin:', isAdmin);
    
    if (!isAdmin) {
        showNotification(`Only administrators can access AI settings. Current email: ${currentUser?.email || 'Not logged in'}`, 'info');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Admin AI Settings</h2>
                <button onclick="closeSettingsModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p class="text-sm text-blue-800">
                    <i class="fas fa-info-circle mr-2"></i>
                    This API key will be used by all users. Keep it secure!
                </p>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Gemma 2 27B API Key</label>
                    <input type="password" id="gemmaApiKey" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="AIza...">
                    <p class="text-xs text-gray-500 mt-1">Get your key from <a href="https://aistudio.google.com" target="_blank" class="text-orange-600 hover:underline">Google AI Studio</a></p>
                </div>
                
                <button onclick="saveApiKeys()" class="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                    Save API Key
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Load existing key
    document.getElementById('gemmaApiKey').value = AI_CONFIG.gemma.apiKey || '';
}

function closeSettingsModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
    }
}

function saveApiKeys() {
    AI_CONFIG.gemma.apiKey = document.getElementById('gemmaApiKey').value;
    
    showNotification('Gemma API key saved successfully! All users can now use AI recipe generation.', 'success');
    closeSettingsModal();
}

function displayNoRecipe() {
    const resultDiv = document.getElementById('recipe-result');
    const contentDiv = document.getElementById('recipe-content');
    
    contentDiv.innerHTML = `
        <div class="bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-center">
            <i class="fas fa-search text-yellow-600 text-4xl mb-4"></i>
            <h4 class="text-xl font-semibold text-gray-800 mb-2">No Recipe Generated</h4>
            <p class="text-gray-600 mb-4">
                ${!areApiKeysConfigured() ? 
                    'AI models are not configured yet. Contact admin to set up API keys.' :
                    'Failed to generate recipe. Please try again with different preferences.'
                }
            </p>
            <button onclick="generateNewRecipe()" class="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                Try Again
            </button>
        </div>
    `;
    
    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function saveRecipe(recipeName) {
    if (!currentUser) {
        showNotification('Please log in to save recipes', 'info');
        showLoginModal();
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('flavorlyUsers') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        if (!users[userIndex].savedRecipes.includes(recipeName)) {
            users[userIndex].savedRecipes.push(recipeName);
            localStorage.setItem('flavorlyUsers', JSON.stringify(users));
            
            // Update current user
            currentUser = users[userIndex];
            localStorage.setItem('flavorlyUser', JSON.stringify(currentUser));
            
            showNotification('Recipe saved successfully!', 'success');
        } else {
            showNotification('Recipe already saved!', 'info');
        }
    }
}

function shareRecipe(recipeName) {
    // Create shareable text
    const shareText = `Check out this amazing recipe: ${recipeName} from Flavorly!`;
    
    // Try to use Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: recipeName,
            text: shareText,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText + ' ' + window.location.href);
        showNotification('Recipe link copied to clipboard!', 'success');
    }
}

function generateNewRecipe() {
    document.getElementById('recipe-form').reset();
    document.getElementById('recipe-result').classList.add('hidden');
    document.getElementById('ingredients').focus();
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 fade-in ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 
                'fa-info-circle'
            } mr-2"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll animations
window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const menu = document.querySelector('nav .hidden');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initAuth(); // Initialize authentication system
    checkPasswordReset(); // Check for password reset requests
    
    // Add specific event listeners for navigation buttons without onclick
    document.querySelectorAll('button').forEach(button => {
        const buttonText = button.textContent.trim();
        
        // Only add listeners for buttons without onclick attributes
        if (!button.getAttribute('onclick')) {
            button.addEventListener('click', function(e) {
                // Handle navigation buttons (case-insensitive)
                if (buttonText.toLowerCase() === 'features') {
                    e.preventDefault();
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                } else if (buttonText.toLowerCase() === 'how it works') {
                    e.preventDefault();
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                } else if (buttonText.toLowerCase() === 'my recipes' && currentUser) {
                    e.preventDefault();
                    showNotification('My Recipes feature coming soon!', 'info');
                } else if (buttonText.toLowerCase() === 'get app') {
                    e.preventDefault();
                    showNotification('Mobile app coming soon! Sign up for updates.', 'info');
                }
            });
        }
    });
    
    console.log('Flavorly website loaded successfully!');
});
