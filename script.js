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
                    <a href="#" onclick="showProfileModal()" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
                    <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
                    <hr class="my-1">
                    <a href="#" onclick="logout()" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Log Out</a>
                </div>
            </div>
        `;
    }
}

// Handle forgot password
function handleForgotPassword() {
    const email = document.getElementById('loginEmail').value;
    if (!email) {
        showNotification('Please enter your email address first', 'error');
        return;
    }
    
    // In a real app, you'd send a reset email. For demo, we'll show a success message
    showNotification(`Password reset link sent to ${email}. Check your inbox!`, 'success');
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

// AI Configuration - Admin keys (only you need to set these)
const AI_CONFIG = {
    claude: {
        apiKey: '', // Add your Claude API key here
        endpoint: 'https://api.anthropic.com/v1/messages',
        model: 'claude-3-haiku-20240307'
    },
    grok: {
        apiKey: '', // Add your Grok API key here
        endpoint: 'https://api.x.ai/v1/chat/completions',
        model: 'grok-beta'
    },
    mistral: {
        apiKey: '', // Add your Mistral AI API key here
        endpoint: 'https://api.mistral.ai/v1/chat/completions',
        model: 'mistral-small-latest'
    }
};

// Current AI model preference
let currentAIModel = 'claude'; // Default to Claude

// Check if API keys are configured
function areApiKeysConfigured() {
    return AI_CONFIG.claude.apiKey || AI_CONFIG.grok.apiKey || AI_CONFIG.mistral.apiKey;
}

// AI Recipe Generation
async function generateRecipeWithAI(ingredients, dishType, healthStatus, dietary, cuisine, flavors, aiModel) {
    const modelConfig = AI_CONFIG[aiModel];
    
    if (!modelConfig.apiKey) {
        showNotification(`${aiModel.charAt(0).toUpperCase() + aiModel.slice(1)} API key not configured. Contact admin to set up AI models.`, 'error');
        return null;
    }

    const prompt = createRecipePrompt(ingredients, dishType, healthStatus, dietary, cuisine, flavors);
    
    try {
        let response;
        
        switch(aiModel) {
            case 'claude':
                response = await callClaudeAPI(modelConfig, prompt);
                break;
            case 'grok':
                response = await callGrokAPI(modelConfig, prompt);
                break;
            case 'mistral':
                response = await callMistralAPI(modelConfig, prompt);
                break;
            default:
                throw new Error('Unsupported AI model');
        }
        
        return parseAIResponse(response, aiModel);
    } catch (error) {
        console.error('AI API Error:', error);
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

async function callGrokAPI(config, prompt) {
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

async function callMistralAPI(config, prompt) {
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
    
    const ingredientsInput = document.getElementById('ingredients').value;
    const ingredients = ingredientsInput ? ingredientsInput.toLowerCase().split(',').map(i => i.trim()).filter(i => i) : [];
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

// Profile management
function showProfileModal() {
    if (!currentUser) {
        showNotification('Please log in to view your profile', 'info');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
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
    const modal = document.querySelector('.fixed.inset-0');
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
                    These API keys will be used by all users. Keep them secure!
                </p>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Claude API Key</label>
                    <input type="password" id="claudeApiKey" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="sk-ant-...">
                    <p class="text-xs text-gray-500 mt-1">Get your key from console.anthropic.com</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Grok API Key</label>
                    <input type="password" id="grokApiKey" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="xai-...">
                    <p class="text-xs text-gray-500 mt-1">Get your key from console.x.ai</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Mistral AI API Key</label>
                    <input type="password" id="mistralApiKey" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="...">
                    <p class="text-xs text-gray-500 mt-1">Get your key from console.mistral.ai</p>
                </div>
                
                <button onclick="saveApiKeys()" class="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                    Save API Keys
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Load existing keys
    document.getElementById('claudeApiKey').value = AI_CONFIG.claude.apiKey || '';
    document.getElementById('grokApiKey').value = AI_CONFIG.grok.apiKey || '';
    document.getElementById('mistralApiKey').value = AI_CONFIG.mistral.apiKey || '';
}

function closeSettingsModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
    }
}

function saveApiKeys() {
    AI_CONFIG.claude.apiKey = document.getElementById('claudeApiKey').value;
    AI_CONFIG.grok.apiKey = document.getElementById('grokApiKey').value;
    AI_CONFIG.mistral.apiKey = document.getElementById('mistralApiKey').value;
    
    showNotification('API keys saved successfully! All users can now use AI models.', 'success');
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
    
    // Add event listeners for navigation buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('button')) {
            const buttonText = e.target.textContent.trim();
            if (buttonText === 'Features') {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            } else if (buttonText === 'How it Works') {
                e.preventDefault();
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            } else if (buttonText === 'My Recipes' && currentUser) {
                e.preventDefault();
                showNotification('My Recipes feature coming soon!', 'info');
            }
        }
    });
    
    console.log('Flavorly website loaded successfully!');
});
