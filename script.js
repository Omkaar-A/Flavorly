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
function showLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('signupModal').classList.add('hidden');
}

function showSignupModal() {
    document.getElementById('signupModal').classList.remove('hidden');
    document.getElementById('loginModal').classList.add('hidden');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
}

function closeSignupModal() {
    document.getElementById('signupModal').classList.add('hidden');
}

function switchToSignup() {
    closeLoginModal();
    showSignupModal();
}

function switchToLogin() {
    closeSignupModal();
    showLoginModal();
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
                    <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
                    <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
                    <hr class="my-1">
                    <a href="#" onclick="logout()" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Log Out</a>
                </div>
            </div>
        `;
    }
}

// Handle login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('flavorlyUsers') || '[]');
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('flavorlyUser', JSON.stringify(user));
        updateUIForLoggedInUser();
        closeLoginModal();
        showNotification('Welcome back, ' + user.name + '!', 'success');
        
        // Reset form
        document.getElementById('loginForm').reset();
    } else {
        showNotification('Invalid email or password', 'error');
    }
});

// Handle signup
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
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
    
    users.push(newUser);
    localStorage.setItem('flavorlyUsers', JSON.stringify(users));
    
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

// AI Configuration
const AI_CONFIG = {
    claude: {
        apiKey: '', // User will need to add their API key
        endpoint: 'https://api.anthropic.com/v1/messages',
        model: 'claude-3-haiku-20240307'
    },
    gemini: {
        apiKey: '', // User will need to add their API key
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        model: 'gemini-pro'
    },
    chatgpt: {
        apiKey: '', // User will need to add their API key
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo'
    }
};

// Current AI model preference
let currentAIModel = 'claude'; // Default to Claude

// AI Recipe Generation
async function generateRecipeWithAI(ingredients, dishType, healthStatus, dietary, cuisine, flavors, aiModel) {
    const modelConfig = AI_CONFIG[aiModel];
    
    if (!modelConfig.apiKey) {
        showNotification(`Please add your ${aiModel.toUpperCase()} API key in settings`, 'error');
        return null;
    }

    const prompt = createRecipePrompt(ingredients, dishType, healthStatus, dietary, cuisine, flavors);
    
    try {
        let response;
        
        switch(aiModel) {
            case 'claude':
                response = await callClaudeAPI(modelConfig, prompt);
                break;
            case 'gemini':
                response = await callGeminiAPI(modelConfig, prompt);
                break;
            case 'chatgpt':
                response = await callChatGPTAPI(modelConfig, prompt);
                break;
            default:
                throw new Error('Unsupported AI model');
        }
        
        return parseAIResponse(response, aiModel);
    } catch (error) {
        console.error('AI API Error:', error);
        showNotification('Failed to generate recipe. Please check your API key.', 'error');
        return null;
    }
}

function createRecipePrompt(ingredients, dishType, healthStatus, dietary, cuisine, flavors) {
    return `Create a detailed recipe based on these preferences:

Ingredients available: ${ingredients.join(', ')}
Dish type requested: ${dishType || 'Any'}
Health status: ${healthStatus}
Dietary restrictions: ${dietary || 'None'}
Cuisine preference: ${cuisine || 'Any'}
Flavor preferences: ${flavors.length > 0 ? flavors.join(', ') : 'None'}

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

Make sure the recipe is practical, uses the available ingredients, and matches all preferences exactly.`;
}

async function callClaudeAPI(config, prompt) {
    const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: config.model,
            max_tokens: 1000,
            messages: [{
                role: 'user',
                content: prompt
            }]
        })
    });
    
    const data = await response.json();
    return data.content[0].text;
}

async function callGeminiAPI(config, prompt) {
    const response = await fetch(`${config.endpoint}?key=${config.apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        })
    });
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

async function callChatGPTAPI(config, prompt) {
    const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            model: config.model,
            messages: [{
                role: 'user',
                content: prompt
            }],
            max_tokens: 1000
        })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
}

function parseAIResponse(response, aiModel) {
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
    
    const ingredients = document.getElementById('ingredients').value.toLowerCase().split(',').map(i => i.trim()).filter(i => i);
    const dishType = document.getElementById('dish-type').value.toLowerCase();
    const healthStatus = document.querySelector('input[name="health-status"]:checked').value;
    const aiModel = document.getElementById('ai-model').value;
    const dietary = document.getElementById('dietary').value;
    const cuisine = document.getElementById('cuisine').value;
    const flavorCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const flavors = Array.from(flavorCheckboxes).map(cb => cb.value);
    
    // Show loading state
    showRecipeLoading();
    
    // Generate recipe with AI
    const recipe = await generateRecipeWithAI(ingredients, dishType, healthStatus, dietary, cuisine, flavors, aiModel);
    
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

// Settings and API Key Management
function showSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">AI Settings</h2>
                <button onclick="closeSettingsModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Claude API Key</label>
                    <input type="password" id="claudeApiKey" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="sk-ant-...">
                    <p class="text-xs text-gray-500 mt-1">Get your key from console.anthropic.com</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Gemini API Key</label>
                    <input type="password" id="geminiApiKey" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="AIza...">
                    <p class="text-xs text-gray-500 mt-1">Get your key from makersuite.google.com</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">ChatGPT API Key</label>
                    <input type="password" id="chatgptApiKey" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="sk-...">
                    <p class="text-xs text-gray-500 mt-1">Get your key from platform.openai.com</p>
                </div>
                
                <button onclick="saveApiKeys()" class="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                    Save API Keys
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Load existing keys
    const keys = JSON.parse(localStorage.getItem('aiApiKeys') || '{}');
    document.getElementById('claudeApiKey').value = keys.claude || '';
    document.getElementById('geminiApiKey').value = keys.gemini || '';
    document.getElementById('chatgptApiKey').value = keys.chatgpt || '';
}

function closeSettingsModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
    }
}

function saveApiKeys() {
    const keys = {
        claude: document.getElementById('claudeApiKey').value,
        gemini: document.getElementById('geminiApiKey').value,
        chatgpt: document.getElementById('chatgptApiKey').value
    };
    
    localStorage.setItem('aiApiKeys', JSON.stringify(keys));
    
    // Update AI_CONFIG
    AI_CONFIG.claude.apiKey = keys.claude;
    AI_CONFIG.gemini.apiKey = keys.gemini;
    AI_CONFIG.chatgpt.apiKey = keys.chatgpt;
    
    showNotification('API keys saved successfully!', 'success');
    closeSettingsModal();
}

// Load API keys on initialization
function loadApiKeys() {
    const keys = JSON.parse(localStorage.getItem('aiApiKeys') || '{}');
    AI_CONFIG.claude.apiKey = keys.claude || '';
    AI_CONFIG.gemini.apiKey = keys.gemini || '';
    AI_CONFIG.chatgpt.apiKey = keys.chatgpt || '';
}

function displayNoRecipe() {
    const resultDiv = document.getElementById('recipe-result');
    const contentDiv = document.getElementById('recipe-content');
    
    contentDiv.innerHTML = `
        <div class="bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-center">
            <i class="fas fa-search text-yellow-600 text-4xl mb-4"></i>
            <h4 class="text-xl font-semibold text-gray-800 mb-2">No Perfect Match Found</h4>
            <p class="text-gray-600 mb-4">
                We couldn't find a recipe that matches all your criteria. Try adjusting your preferences or ingredients.
            </p>
            <button onclick="generateNewRecipe()" class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
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
    loadApiKeys(); // Load API keys
    
    // Update navigation to include settings for non-logged-in users
    if (!currentUser) {
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
    }
    
    console.log('Flavorly website loaded successfully!');
});
