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
        dietary: "",
        cuisine: "mediterranean",
        flavor: ["savory"],
        time: "30 mins",
        difficulty: "Easy",
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
        dietary: "vegan",
        cuisine: "asian",
        flavor: ["spicy", "savory"],
        time: "20 mins",
        difficulty: "Easy",
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
        dietary: "vegetarian",
        cuisine: "italian",
        flavor: ["savory", "tangy"],
        time: "45 mins",
        difficulty: "Medium",
        description: "A traditional Italian pizza with fresh tomatoes, mozzarella, and basil on a crispy crust.",
        instructions: [
            "Prepare pizza dough and let it rise",
            "Roll out dough to desired thickness",
            "Spread tomato sauce evenly",
            "Add fresh mozzarella and tomatoes",
            "Bake at 475°F for 12-15 minutes",
            "Top with fresh basil before serving"
        ]
    }
];

// Handle recipe form submission
document.getElementById('recipe-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const ingredients = document.getElementById('ingredients').value.toLowerCase().split(',').map(i => i.trim());
    const dietary = document.getElementById('dietary').value;
    const cuisine = document.getElementById('cuisine').value;
    const flavorCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const flavors = Array.from(flavorCheckboxes).map(cb => cb.value);
    
    // Find matching recipe
    const recipe = findBestRecipe(ingredients, dietary, cuisine, flavors);
    
    if (recipe) {
        displayRecipe(recipe);
    } else {
        displayNoRecipe();
    }
});

function findBestRecipe(ingredients, dietary, cuisine, flavors) {
    let bestMatch = null;
    let bestScore = 0;
    
    recipeDatabase.forEach(recipe => {
        let score = 0;
        
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
                    <i class="fas fa-globe mr-1"></i> ${recipe.cuisine}
                </span>
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
    // Get existing saved recipes or create new array
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    
    if (!savedRecipes.includes(recipeName)) {
        savedRecipes.push(recipeName);
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
        
        // Show success message
        showNotification('Recipe saved successfully!', 'success');
    } else {
        showNotification('Recipe already saved!', 'info');
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
    // Add any initialization code here
    console.log('Flavorly website loaded successfully!');
});
