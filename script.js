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
            <button class="text-gray-600 hover:text-purple-600 transition-colors">Features</button>
            <button class="text-gray-600 hover:text-purple-600 transition-colors">How it Works</button>
            <button class="text-gray-600 hover:text-purple-600 transition-colors">My Recipes</button>
            <div class="relative group">
                <button class="flex items-center text-gray-600 hover:text-purple-600 transition-colors">
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
            <button class="text-gray-600 hover:text-purple-600 transition-colors">Features</button>
            <button class="text-gray-600 hover:text-purple-600 transition-colors">How it Works</button>
            <button onclick="showLoginModal()" class="text-gray-600 hover:text-purple-600 transition-colors">Log In</button>
            <button onclick="showSignupModal()" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
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

// Sample recipe database
const recipeDatabase = [
    {
        name: "Mediterranean Chicken Bowl",
        ingredients: ["chicken", "tomatoes", "rice"],
        dishTypes: ["bowl", "chicken", "healthy"],
        dietary: "",
        cuisine: "mediterranean",
        flavor: ["savory"],
        time: "30 mins",
        difficulty: "Easy",
        healthStatus: "healthy",
        description: "A healthy and flavorful Mediterranean-inspired bowl with grilled chicken, fresh vegetables, and aromatic rice.",
        instructions: [
            "Season chicken with olive oil, lemon juice, garlic, and herbs",
            "Grill chicken for 6-8 minutes per side until cooked through",
            "Cook rice according to package directions",
            "Dice tomatoes and other vegetables",
            "Assemble bowl with rice, chicken, and fresh vegetables",
            "Drizzle with tahini dressing"
        ]
    },
    {
        name: "Spicy Vegetable Stir-Fry",
        ingredients: ["vegetables", "rice"],
        dishTypes: ["stir-fry", "asian", "vegetables"],
        dietary: "vegan",
        cuisine: "asian",
        flavor: ["spicy", "savory"],
        time: "20 mins",
        difficulty: "Easy",
        healthStatus: "healthy",
        description: "A quick and spicy Asian-inspired stir-fry packed with colorful vegetables and bold flavors.",
        instructions: [
            "Heat wok or large pan over high heat",
            "Add vegetables and stir-fry for 3-4 minutes",
            "Add soy sauce, ginger, garlic, and chili flakes",
            "Toss everything together for 2 more minutes",
            "Serve over steamed rice",
            "Garnish with sesame seeds and green onions"
        ]
    },
    {
        name: "Classic Margherita Pizza",
        ingredients: ["tomatoes", "cheese"],
        dishTypes: ["pizza", "italian", "cheese"],
        dietary: "vegetarian",
        cuisine: "italian",
        flavor: ["savory", "tangy"],
        time: "45 mins",
        difficulty: "Medium",
        healthStatus: "healthy",
        description: "A traditional Italian pizza with fresh tomatoes, mozzarella, and basil on a crispy crust.",
        instructions: [
            "Prepare pizza dough and let it rise",
            "Roll out dough to desired thickness",
            "Spread tomato sauce evenly",
            "Add fresh mozzarella and tomatoes",
            "Bake at 475°F for 12-15 minutes",
            "Top with fresh basil before serving"
        ]
    },
    {
        name: "Healing Chicken Soup",
        ingredients: ["chicken", "vegetables"],
        dishTypes: ["soup", "chicken", "comfort"],
        dietary: "",
        cuisine: "",
        flavor: ["savory"],
        time: "60 mins",
        difficulty: "Easy",
        healthStatus: "sick",
        description: "A nourishing chicken soup packed with vegetables and herbs to help you feel better when you're under the weather.",
        instructions: [
            "Bring chicken broth to a simmer in a large pot",
            "Add chicken pieces and cook for 20 minutes",
            "Add chopped vegetables like carrots, celery, and onions",
            "Simmer for 30 minutes until vegetables are tender",
            "Add garlic, ginger, and herbs for immune support",
            "Season with salt and pepper and serve hot"
        ]
    },
    {
        name: "Ginger Tea with Honey",
        ingredients: ["ginger", "honey", "lemon"],
        dishTypes: ["tea", "drink", "remedy"],
        dietary: "vegan",
        cuisine: "",
        flavor: ["tangy", "sweet"],
        time: "10 mins",
        difficulty: "Easy",
        healthStatus: "sick",
        description: "A soothing ginger tea with honey and lemon to relieve cold symptoms and boost your immune system.",
        instructions: [
            "Boil water in a small pot",
            "Add fresh ginger slices and simmer for 5 minutes",
            "Remove from heat and add lemon juice",
            "Stir in honey to taste",
            "Pour into a mug and sip while warm",
            "Rest and enjoy the soothing effects"
        ]
    },
    {
        name: "Simple Pasta Aglio e Olio",
        ingredients: ["pasta", "garlic", "olive oil"],
        dishTypes: ["pasta", "italian", "simple"],
        dietary: "vegan",
        cuisine: "italian",
        flavor: ["savory"],
        time: "25 mins",
        difficulty: "Easy",
        healthStatus: "healthy",
        description: "Classic Italian pasta with garlic and olive oil - simple, elegant, and delicious.",
        instructions: [
            "Cook pasta according to package directions",
            "Heat olive oil in a pan over medium heat",
            "Add sliced garlic and cook until fragrant",
            "Add red pepper flakes for a little heat",
            "Toss cooked pasta with garlic oil",
            "Season with salt and parsley"
        ]
    },
    {
        name: "Fresh Garden Salad",
        ingredients: ["vegetables", "lettuce"],
        dishTypes: ["salad", "fresh", "healthy"],
        dietary: "vegan",
        cuisine: "",
        flavor: ["fresh", "tangy"],
        time: "15 mins",
        difficulty: "Easy",
        healthStatus: "healthy",
        description: "A crisp, refreshing salad with mixed greens and fresh vegetables.",
        instructions: [
            "Wash and dry mixed greens",
            "Chop fresh vegetables like tomatoes, cucumbers, and bell peppers",
            "Toss greens and vegetables in a large bowl",
            "Drizzle with olive oil and lemon juice",
            "Season with salt and pepper",
            "Top with fresh herbs if desired"
        ]
    }
];

// Handle recipe form submission
document.getElementById('recipe-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const ingredients = document.getElementById('ingredients').value.toLowerCase().split(',').map(i => i.trim());
    const dishType = document.getElementById('dish-type').value.toLowerCase();
    const healthStatus = document.querySelector('input[name="health-status"]:checked').value;
    const dietary = document.getElementById('dietary').value;
    const cuisine = document.getElementById('cuisine').value;
    const flavorCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const flavors = Array.from(flavorCheckboxes).map(cb => cb.value);
    
    // Find matching recipe
    const recipe = findBestRecipe(ingredients, dishType, healthStatus, dietary, cuisine, flavors);
    
    if (recipe) {
        displayRecipe(recipe);
    } else {
        displayNoRecipe();
    }
});

function findBestRecipe(ingredients, dishType, healthStatus, dietary, cuisine, flavors) {
    let bestMatch = null;
    let bestScore = 0;
    
    recipeDatabase.forEach(recipe => {
        let score = 0;
        
        // Health status is most important - if sick, prioritize sick-friendly recipes
        if (healthStatus === 'sick' && recipe.healthStatus === 'sick') {
            score += 10;
        } else if (healthStatus === 'healthy' && recipe.healthStatus === 'healthy') {
            score += 5;
        }
        
        // Check dish type match
        if (dishType) {
            const matchingDishType = recipe.dishTypes.some(type => 
                type.includes(dishType) || dishType.includes(type)
            );
            if (matchingDishType) {
                score += 8;
            }
        }
        
        // Check ingredients match
        const matchingIngredients = ingredients.filter(ing => 
            recipe.ingredients.some(recipeIng => recipeIng.includes(ing) || ing.includes(recipeIng))
        );
        score += matchingIngredients.length * 3;
        
        // Check dietary preference
        if (dietary && recipe.dietary === dietary) {
            score += 2;
        }
        
        // Check cuisine preference
        if (cuisine && recipe.cuisine === cuisine) {
            score += 2;
        }
        
        // Check flavor preferences
        flavors.forEach(flavor => {
            if (recipe.flavor.includes(flavor)) {
                score += 1;
            }
        });
        
        if (score > bestScore && score > 0) {
            bestScore = score;
            bestMatch = recipe;
        }
    });
    
    return bestMatch;
}

function displayRecipe(recipe) {
    const resultDiv = document.getElementById('recipe-result');
    const contentDiv = document.getElementById('recipe-content');
    
    const healthBadge = recipe.healthStatus === 'sick' ? 
        '<span class="bg-red-100 text-red-800 px-3 py-1 rounded-full"><i class="fas fa-heartbeat mr-1"></i>Comfort Food</span>' : 
        '<span class="bg-green-100 text-green-800 px-3 py-1 rounded-full"><i class="fas fa-heart mr-1"></i>Healthy</span>';
    
    contentDiv.innerHTML = `
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg mb-6">
            <h4 class="text-2xl font-bold text-gray-800 mb-2">${recipe.name}</h4>
            <p class="text-gray-600 mb-4">${recipe.description}</p>
            <div class="flex flex-wrap gap-4 text-sm">
                <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    <i class="fas fa-clock mr-1"></i> ${recipe.time}
                </span>
                <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    <i class="fas fa-signal mr-1"></i> ${recipe.difficulty}
                </span>
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    <i class="fas fa-globe mr-1"></i> ${recipe.cuisine || 'Universal'}
                </span>
                ${healthBadge}
                ${recipe.dietary ? `<span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    <i class="fas fa-leaf mr-1"></i> ${recipe.dietary}
                </span>` : ''}
            </div>
        </div>
        
        <div class="mb-6">
            <h5 class="text-lg font-semibold mb-3 text-gray-800">
                <i class="fas fa-list-ol mr-2 text-purple-600"></i>Instructions
            </h5>
            <ol class="space-y-3">
                ${recipe.instructions.map((instruction, index) => `
                    <li class="flex items-start">
                        <span class="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                            ${index + 1}
                        </span>
                        <span class="text-gray-700">${instruction}</span>
                    </li>
                `).join('')}
            </ol>
        </div>
        
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
            <button onclick="saveRecipe('${recipe.name}')" class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                <i class="fas fa-bookmark mr-2"></i>Save Recipe
            </button>
            <button onclick="shareRecipe('${recipe.name}')" class="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                <i class="fas fa-share mr-2"></i>Share
            </button>
            <button onclick="generateNewRecipe()" class="border border-purple-600 text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50 transition-colors">
                <i class="fas fa-redo mr-2"></i>Generate Another
            </button>
        </div>
    `;
    
    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth' });
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
    console.log('Flavorly website loaded successfully!');
});
