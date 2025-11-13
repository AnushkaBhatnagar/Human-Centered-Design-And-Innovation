// ===============================================
// THRIFT & SWAP - MAIN APPLICATION LOGIC
// ===============================================

// State Management
const state = {
    currentUser: null,
    currentScreen: 'login',
    currentPage: 'dashboard',
    marketplaceItems: [],
    userOwnedItems: [],
    userListedItems: [],
    sentimentTracking: [],
    demoDataLoaded: false,
    currentItemImage: null
};

// Brand Points Mapping (base points)
const brandTiers = {
    luxury: ['Gucci', 'Prada', 'Louis Vuitton', 'Chanel', 'Dior', 'Versace'],
    premium: ['Levi\'s', 'Nike', 'Adidas', 'Ralph Lauren', 'Calvin Klein', 'Tommy Hilfiger'],
    standard: ['H&M', 'Zara', 'Uniqlo', 'Gap', 'Forever 21', 'Urban Outfitters']
};

const pointsCalculator = {
    luxury: { base: 600, good: 1.0, 'very-good': 1.3, excellent: 1.6 },
    premium: { base: 200, good: 1.0, 'very-good': 1.3, excellent: 1.6 },
    standard: { base: 80, good: 1.0, 'very-good': 1.3, excellent: 1.6 },
    unknown: { base: 100, good: 1.0, 'very-good': 1.3, excellent: 1.6 }
};

// ===============================================
// INITIALIZATION
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    initializeEventListeners();
    checkOnboardingStatus();
});

// ===============================================
// USER DATA MANAGEMENT
// ===============================================

function loadUserData() {
    const savedUser = localStorage.getItem('thriftSwapUser');
    if (savedUser) {
        state.currentUser = JSON.parse(savedUser);
        loadMarketplaceItems();
        loadUserItems();
    }
}

function saveUserData() {
    if (state.currentUser) {
        localStorage.setItem('thriftSwapUser', JSON.stringify(state.currentUser));
    }
}

function loadMarketplaceItems() {
    const saved = localStorage.getItem('marketplaceItems');
    if (saved) {
        state.marketplaceItems = JSON.parse(saved);
    }
}

function saveMarketplaceItems() {
    localStorage.setItem('marketplaceItems', JSON.stringify(state.marketplaceItems));
}

function loadUserItems() {
    if (!state.currentUser) return;
    
    const ownedKey = `userOwned_${state.currentUser.name}`;
    const listedKey = `userListed_${state.currentUser.name}`;
    
    const owned = localStorage.getItem(ownedKey);
    const listed = localStorage.getItem(listedKey);
    
    if (owned) state.userOwnedItems = JSON.parse(owned);
    if (listed) state.userListedItems = JSON.parse(listed);
}

function saveUserItems() {
    if (!state.currentUser) return;
    
    const ownedKey = `userOwned_${state.currentUser.name}`;
    const listedKey = `userListed_${state.currentUser.name}`;
    
    localStorage.setItem(ownedKey, JSON.stringify(state.userOwnedItems));
    localStorage.setItem(listedKey, JSON.stringify(state.userListedItems));
}

// ===============================================
// EVENT LISTENERS
// ===============================================

function initializeEventListeners() {
    // Login
    const loginBtn = document.getElementById('login-btn');
    const usernameInput = document.getElementById('username-input');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    
    if (usernameInput) {
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }
    
    // Onboarding
    document.querySelectorAll('.onboarding-next').forEach(btn => {
        btn.addEventListener('click', handleOnboardingNext);
    });
    
    document.querySelectorAll('.style-option').forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
    });
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Dashboard Quick Actions
    document.querySelectorAll('.action-card').forEach(card => {
        card.addEventListener('click', function() {
            const action = this.dataset.action;
            navigateToPage(action);
        });
    });
    
    // Browse Page
    const loadDemoBtn = document.getElementById('load-demo-data-btn');
    if (loadDemoBtn) {
        loadDemoBtn.addEventListener('click', loadDemoData);
    }
    
    const categoryFilter = document.getElementById('category-filter');
    const pointsFilter = document.getElementById('points-filter');
    
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (pointsFilter) pointsFilter.addEventListener('change', applyFilters);
    
    // Sell Page
    const uploadTrigger = document.getElementById('upload-trigger');
    const itemImage = document.getElementById('item-image');
    
    if (uploadTrigger) {
        uploadTrigger.addEventListener('click', () => itemImage.click());
    }
    
    if (itemImage) {
        itemImage.addEventListener('change', handleImageUpload);
    }
    
    // Form inputs for points estimation
    ['item-brand', 'item-condition', 'item-category'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updatePointsEstimate);
            element.addEventListener('change', updatePointsEstimate);
        }
    });
    
    const listItemBtn = document.getElementById('list-item-btn');
    if (listItemBtn) {
        listItemBtn.addEventListener('click', handleListItem);
    }
    
    // Closet Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', handleClosetTab);
    });
    
    // Subscription
    document.querySelectorAll('.subscribe-btn').forEach(btn => {
        btn.addEventListener('click', handleSubscription);
    });
    
    // Modals
    const closeItemModal = document.getElementById('close-item-modal');
    if (closeItemModal) {
        closeItemModal.addEventListener('click', () => {
            document.getElementById('item-modal').classList.remove('active');
        });
    }
    
    const swapItemBtn = document.getElementById('swap-item-btn');
    if (swapItemBtn) {
        swapItemBtn.addEventListener('click', handleSwapItem);
    }
    
    // Sentiment Modal
    const sentimentSkip = document.getElementById('sentiment-skip');
    const sentimentSubmit = document.getElementById('sentiment-submit');
    
    if (sentimentSkip) {
        sentimentSkip.addEventListener('click', () => {
            document.getElementById('sentiment-modal').classList.remove('active');
        });
    }
    
    if (sentimentSubmit) {
        sentimentSubmit.addEventListener('click', handleSentimentSubmit);
    }
    
    // Star Rating
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.dataset.rating;
            document.querySelectorAll('.star').forEach(s => {
                s.classList.remove('active');
                if (parseInt(s.dataset.rating) <= parseInt(rating)) {
                    s.classList.add('active');
                }
            });
        });
    });
    
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// ===============================================
// LOGIN & ONBOARDING
// ===============================================

function handleLogin() {
    const username = document.getElementById('username-input').value.trim();
    
    if (!username) {
        alert('Please enter your name');
        return;
    }
    
    // Check if user exists
    const savedUser = localStorage.getItem('thriftSwapUser');
    
    if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.name === username && user.onboardingComplete) {
            // Existing user with completed onboarding
            state.currentUser = user;
            loadMarketplaceItems();
            loadUserItems();
            showScreen('main-app');
            updateDashboard();
            return;
        }
    }
    
    // New user or incomplete onboarding
    state.currentUser = {
        name: username,
        points: 500, // Starting points
        onboardingComplete: false,
        preferences: {
            styles: [],
            sizes: {}
        },
        subscription: 'free',
        stats: {
            itemsSold: 0,
            itemsSwapped: 0
        }
    };
    
    saveUserData();
    showScreen('onboarding-screen');
}

function checkOnboardingStatus() {
    if (state.currentUser && !state.currentUser.onboardingComplete) {
        showScreen('onboarding-screen');
    }
}

function handleOnboardingNext() {
    const activeStep = document.querySelector('.onboarding-step.active');
    const stepNumber = parseInt(activeStep.dataset.step);
    
    if (stepNumber === 1) {
        // Move to style preferences
        activeStep.classList.remove('active');
        document.querySelector('[data-step="2"]').classList.add('active');
    } else if (stepNumber === 2) {
        // Save style preferences
        const selectedStyles = [];
        document.querySelectorAll('.style-option.selected').forEach(option => {
            selectedStyles.push(option.dataset.style);
        });
        state.currentUser.preferences.styles = selectedStyles;
        
        activeStep.classList.remove('active');
        document.querySelector('[data-step="3"]').classList.add('active');
    } else if (stepNumber === 3) {
        // Save size preferences and complete onboarding
        state.currentUser.preferences.sizes = {
            top: document.getElementById('top-size').value,
            bottom: document.getElementById('bottom-size').value,
            shoe: document.getElementById('shoe-size').value
        };
        
        state.currentUser.onboardingComplete = true;
        saveUserData();
        
        showScreen('main-app');
        updateDashboard();
    }
}

// ===============================================
// SCREEN & NAVIGATION
// ===============================================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    state.currentScreen = screenId;
}

function handleNavigation(e) {
    e.preventDefault();
    const page = this.dataset.page;
    navigateToPage(page);
}

function navigateToPage(page) {
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });
    
    // Update pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(`${page}-page`).classList.add('active');
    
    state.currentPage = page;
    
    // Load page-specific content
    if (page === 'dashboard') {
        updateDashboard();
    } else if (page === 'browse') {
        renderBrowseItems();
    } else if (page === 'closet') {
        renderClosetItems();
    }
}

// ===============================================
// DASHBOARD
// ===============================================

function updateDashboard() {
    if (!state.currentUser) return;
    
    // Update username displays
    document.getElementById('dashboard-username').textContent = state.currentUser.name;
    document.getElementById('nav-username').textContent = state.currentUser.name;
    
    // Update points displays
    document.getElementById('user-points').textContent = state.currentUser.points;
    document.getElementById('dashboard-points').textContent = state.currentUser.points;
    
    // Update stats
    document.getElementById('items-sold').textContent = state.currentUser.stats.itemsSold;
    document.getElementById('items-swapped').textContent = state.currentUser.stats.itemsSwapped;
    document.getElementById('subscription-tier').textContent = 
        state.currentUser.subscription.charAt(0).toUpperCase() + state.currentUser.subscription.slice(1);
}

// ===============================================
// BROWSE & MARKETPLACE
// ===============================================

function loadDemoData() {
    if (state.demoDataLoaded) {
        alert('Demo data already loaded!');
        return;
    }
    
    const demoItems = [
        { name: 'Vintage Denim Jacket', brand: 'Levi\'s', category: 'outerwear', size: 'M', condition: 'very-good', points: 260, description: 'Classic denim jacket in excellent condition', image: null },
        { name: 'White Sneakers', brand: 'Nike', category: 'shoes', size: '9', condition: 'good', points: 200, description: 'Clean white sneakers, gently used', image: null },
        { name: 'Black Midi Dress', brand: 'Zara', category: 'dresses', size: 'S', condition: 'excellent', points: 128, description: 'Elegant midi dress, perfect for any occasion', image: null },
        { name: 'Wool Coat', brand: 'Ralph Lauren', category: 'outerwear', size: 'L', condition: 'excellent', points: 320, description: 'Luxurious wool coat, warm and stylish', image: null },
        { name: 'Silk Scarf', brand: 'Gucci', category: 'accessories', size: 'One Size', condition: 'good', points: 600, description: 'Authentic Gucci silk scarf with iconic pattern', image: null },
        { name: 'Graphic T-Shirt', brand: 'Urban Outfitters', category: 'tops', size: 'M', condition: 'good', points: 80, description: 'Cool graphic tee with vintage print', image: null },
        { name: 'High-Waisted Jeans', brand: 'H&M', category: 'bottoms', size: '28', condition: 'very-good', points: 104, description: 'Trendy high-waisted jeans in great condition', image: null },
        { name: 'Leather Boots', brand: 'Calvin Klein', category: 'shoes', size: '8', condition: 'excellent', points: 320, description: 'Premium leather boots, barely worn', image: null },
        { name: 'Cotton Blouse', brand: 'Uniqlo', category: 'tops', size: 'S', condition: 'good', points: 80, description: 'Simple and elegant cotton blouse', image: null },
        { name: 'Designer Sunglasses', brand: 'Prada', category: 'accessories', size: 'One Size', condition: 'excellent', points: 960, description: 'Authentic Prada sunglasses with case', image: null },
        { name: 'Cashmere Sweater', brand: 'Tommy Hilfiger', category: 'tops', size: 'L', condition: 'very-good', points: 260, description: 'Soft cashmere sweater, luxurious feel', image: null },
        { name: 'Floral Skirt', brand: 'Forever 21', category: 'bottoms', size: '26', condition: 'good', points: 80, description: 'Cute floral pattern skirt for summer', image: null }
    ];
    
    state.marketplaceItems = [...state.marketplaceItems, ...demoItems];
    saveMarketplaceItems();
    state.demoDataLoaded = true;
    
    renderBrowseItems();
    alert('Demo data loaded successfully!');
}

function renderBrowseItems() {
    const grid = document.getElementById('items-grid');
    
    if (state.marketplaceItems.length === 0) {
        grid.innerHTML = '<p class="empty-state">No items available. Load demo data or wait for other users to list items!</p>';
        return;
    }
    
    // Apply filters
    const categoryFilter = document.getElementById('category-filter').value;
    const pointsFilter = document.getElementById('points-filter').value;
    
    let filteredItems = state.marketplaceItems;
    
    if (categoryFilter !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === categoryFilter);
    }
    
    if (pointsFilter !== 'all') {
        const [min, max] = pointsFilter.split('-');
        if (max === '+') {
            filteredItems = filteredItems.filter(item => item.points >= parseInt(min));
        } else {
            filteredItems = filteredItems.filter(item => 
                item.points >= parseInt(min) && item.points <= parseInt(max)
            );
        }
    }
    
    if (filteredItems.length === 0) {
        grid.innerHTML = '<p class="empty-state">No items match your filters. Try adjusting them!</p>';
        return;
    }
    
    grid.innerHTML = filteredItems.map((item, index) => createItemCard(item, index)).join('');
    
    // Add click handlers
    grid.querySelectorAll('.item-card').forEach((card, index) => {
        card.addEventListener('click', () => showItemDetail(filteredItems[index], index));
    });
}

function applyFilters() {
    renderBrowseItems();
}

function createItemCard(item, index) {
    const imageContent = item.image 
        ? `<img src="${item.image}" alt="${item.name}">`
        : `<div class="item-image">👕</div>`;
    
    return `
        <div class="item-card" data-index="${index}">
            ${imageContent}
            <div class="item-info">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-brand">${item.brand}</p>
                <div class="item-tags">
                    <span class="tag">${item.category}</span>
                    <span class="tag">${item.size}</span>
                    <span class="tag">${item.condition}</span>
                </div>
                <div class="item-footer">
                    <div class="item-points">
                        ${item.points} <span class="points-label">pts</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function showItemDetail(item, index) {
    const modal = document.getElementById('item-modal');
    
    document.getElementById('modal-item-name').textContent = item.name;
    document.getElementById('modal-item-brand').textContent = item.brand;
    document.getElementById('modal-item-category').textContent = item.category;
    document.getElementById('modal-item-size').textContent = item.size;
    document.getElementById('modal-item-condition').textContent = item.condition;
    document.getElementById('modal-item-description').textContent = item.description;
    document.getElementById('modal-item-points').textContent = item.points;
    
    const modalImage = document.getElementById('modal-item-image');
    if (item.image) {
        modalImage.src = item.image;
        modalImage.style.display = 'block';
    } else {
        modalImage.style.display = 'none';
    }
    
    const swapBtn = document.getElementById('swap-item-btn');
    swapBtn.dataset.itemIndex = index;
    
    modal.classList.add('active');
}

function handleSwapItem() {
    const itemIndex = parseInt(this.dataset.itemIndex);
    const item = state.marketplaceItems[itemIndex];
    
    if (!state.currentUser) {
        alert('Please log in first');
        return;
    }
    
    if (state.currentUser.points < item.points) {
        alert(`Not enough points! You need ${item.points} points but only have ${state.currentUser.points}`);
        return;
    }
    
    // Deduct points
    state.currentUser.points -= item.points;
    state.currentUser.stats.itemsSwapped += 1;
    
    // Add to owned items
    state.userOwnedItems.push({
        ...item,
        swappedDate: new Date().toISOString(),
        needsSentiment: true
    });
    
    // Remove from marketplace
    state.marketplaceItems.splice(itemIndex, 1);
    
    // Save everything
    saveUserData();
    saveUserItems();
    saveMarketplaceItems();
    
    // Update UI
    updateDashboard();
    document.getElementById('item-modal').classList.remove('active');
    renderBrowseItems();
    
    alert(`Successfully swapped for ${item.name}!`);
    
    // Schedule sentiment check (simulate 2 weeks later)
    setTimeout(() => {
        showSentimentModal(item);
    }, 2000);
}

// ===============================================
// SELL FUNCTIONALITY
// ===============================================

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        state.currentItemImage = event.target.result;
        
        const preview = document.getElementById('image-preview');
        preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
}

function calculatePoints(brand, condition) {
    let tier = 'unknown';
    
    if (brandTiers.luxury.some(b => brand.toLowerCase().includes(b.toLowerCase()))) {
        tier = 'luxury';
    } else if (brandTiers.premium.some(b => brand.toLowerCase().includes(b.toLowerCase()))) {
        tier = 'premium';
    } else if (brandTiers.standard.some(b => brand.toLowerCase().includes(b.toLowerCase()))) {
        tier = 'standard';
    }
    
    const calculator = pointsCalculator[tier];
    const multiplier = calculator[condition] || 1.0;
    return Math.round(calculator.base * multiplier);
}

function updatePointsEstimate() {
    const brand = document.getElementById('item-brand').value;
    const condition = document.getElementById('item-condition').value;
    
    if (brand && condition) {
        const points = calculatePoints(brand, condition);
        document.getElementById('points-estimate').textContent = points;
    }
}

function handleListItem() {
    const name = document.getElementById('item-name').value.trim();
    const category = document.getElementById('item-category').value;
    const brand = document.getElementById('item-brand').value.trim();
    const size = document.getElementById('item-size').value.trim();
    const condition = document.getElementById('item-condition').value;
    const description = document.getElementById('item-description').value.trim();
    
    if (!name || !category || !brand || !size || !condition) {
        alert('Please fill in all required fields');
        return;
    }
    
    const points = calculatePoints(brand, condition);
    
    // Apply subscription bonus
    let bonus = 1.0;
    if (state.currentUser.subscription === 'premium') bonus = 1.1;
    if (state.currentUser.subscription === 'unlimited') bonus = 1.2;
    
    const finalPoints = Math.round(points * bonus);
    
    const newItem = {
        name,
        brand,
        category,
        size,
        condition,
        points: finalPoints,
        description,
        image: state.currentItemImage,
        seller: state.currentUser.name,
        listedDate: new Date().toISOString()
    };
    
    // Add to marketplace
    state.marketplaceItems.push(newItem);
    
    // Add to user's listed items
    state.userListedItems.push(newItem);
    
    // Award points to user
    state.currentUser.points += finalPoints;
    state.currentUser.stats.itemsSold += 1;
    
    // Save everything
    saveUserData();
    saveUserItems();
    saveMarketplaceItems();
    
    // Clear form
    document.getElementById('item-name').value = '';
    document.getElementById('item-category').value = '';
    document.getElementById('item-brand').value = '';
    document.getElementById('item-size').value = '';
    document.getElementById('item-condition').value = '';
    document.getElementById('item-description').value = '';
    document.getElementById('points-estimate').textContent = '0';
    document.getElementById('image-preview').innerHTML = `
        <button type="button" class="upload-btn" id="upload-trigger">
            <span class="upload-icon">📷</span>
            <span>Click to upload photo</span>
        </button>
    `;
    state.currentItemImage = null;
    
    // Re-add event listener to new upload button
    document.getElementById('upload-trigger').addEventListener('click', () => {
        document.getElementById('item-image').click();
    });
    
    // Update UI
    updateDashboard();
    
    alert(`Item listed successfully! You earned ${finalPoints} points!`);
}

// ===============================================
// CLOSET
// ===============================================

function handleClosetTab(e) {
    const tab = this.dataset.tab;
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    this.classList.add('active');
    
    document.querySelectorAll('.closet-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}-items`).classList.add('active');
    
    renderClosetItems();
}

function renderClosetItems() {
    const activeTab = document.querySelector('.tab-btn.active');
    const tab = activeTab ? activeTab.dataset.tab : 'owned';
    
    if (tab === 'owned') {
        const grid = document.getElementById('owned-items-grid');
        
        if (state.userOwnedItems.length === 0) {
            grid.innerHTML = '<p class="empty-state">You haven\'t swapped for any items yet. Browse available items to start building your closet!</p>';
            return;
        }
        
        grid.innerHTML = state.userOwnedItems.map((item, index) => createItemCard(item, index)).join('');
    } else {
        const grid = document.getElementById('listed-items-grid');
        
        if (state.userListedItems.length === 0) {
            grid.innerHTML = '<p class="empty-state">You haven\'t listed any items for sale yet. Upload items to earn points!</p>';
            return;
        }
        
        grid.innerHTML = state.userListedItems.map((item, index) => createItemCard(item, index)).join('');
    }
}

// ===============================================
// SUBSCRIPTION
// ===============================================

function handleSubscription() {
    const tier = this.dataset.tier;
    
    if (tier === 'free') {
        return;
    }
    
    if (state.currentUser.subscription === tier) {
        alert('You already have this subscription!');
        return;
    }
    
    const confirmMsg = tier === 'premium' 
        ? 'Upgrade to Premium for $9.99/month?' 
        : 'Upgrade to Unlimited for $19.99/month?';
    
    if (confirm(confirmMsg)) {
        state.currentUser.subscription = tier;
        saveUserData();
        updateDashboard();
        
        // Update subscription buttons
        document.querySelectorAll('.subscribe-btn').forEach(btn => {
            const btnTier = btn.closest('.subscription-card').dataset.tier;
            if (btnTier === tier) {
                btn.textContent = 'Current Plan';
                btn.style.cursor = 'default';
            } else if (btnTier === 'free') {
                btn.textContent = 'Downgrade';
            } else {
                btn.textContent = 'Upgrade';
            }
        });
        
        alert(`Successfully upgraded to ${tier.charAt(0).toUpperCase() + tier.slice(1)}!`);
    }
}

// ===============================================
// SENTIMENT TRACKING
// ===============================================

function showSentimentModal(item) {
    const modal = document.getElementById('sentiment-modal');
    document.getElementById('sentiment-item-name').textContent = item.name;
    
    // Reset form
    document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
    document.getElementById('sentiment-feedback').value = '';
    
    modal.classList.add('active');
    modal.dataset.itemName = item.name;
}

function handleSentimentSubmit() {
    const itemName = document.getElementById('sentiment-modal').dataset.itemName;
    
    const rating = document.querySelectorAll('.star.active').length;
    const alignment = document.querySelector('input[name="alignment"]:checked')?.value;
    const likelihood = document.querySelector('input[name="likelihood"]:checked')?.value;
    const feedback = document.getElementById('sentiment-feedback').value;
    
    if (!rating || !alignment || !likelihood) {
        alert('Please complete all questions');
        return;
    }
    
    // Save sentiment data
    const sentimentData = {
        itemName,
        rating,
        alignment,
        likelihood,
        feedback,
        date: new Date().toISOString()
    };
    
    // Store in localStorage
    const key = `sentiment_${state.currentUser.name}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(sentimentData);
    localStorage.setItem(key, JSON.stringify(existing));
    
    document.getElementById('sentiment-modal').classList.remove('active');
    alert('Thank you for your feedback! We\'ll use this to recommend better items for you.');
}

// ===============================================
// LOGOUT
// ===============================================

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear current user state
        state.currentUser = null;
        state.userOwnedItems = [];
        state.userListedItems = [];
        state.currentPage = 'dashboard';
        
        // Show login screen
        showScreen('login-screen');
        
        // Clear login input
        document.getElementById('username-input').value = '';
    }
}

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
