// Main Application Logic
const App = {
    currentPage: 'home',
    currentData: null,

    // Initialize the app
    init() {
        // Check authentication
        if (!Auth.checkAuth() || !Auth.isOnboardingComplete()) {
            this.navigate('onboarding');
        } else {
            this.navigate('home');
        }

        // Setup navigation
        this.setupNavigation();
        
        // Setup FAB
        this.setupFAB();
    },

    // Setup bottom navigation
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                this.navigate(page);
            });
        });
    },

    // Setup Floating Action Button
    setupFAB() {
        const fab = document.getElementById('fab');
        if (fab) {
            fab.addEventListener('click', () => {
                this.navigate('add-item');
            });
        }
    },

    // Navigate to a page
    navigate(page, data = null) {
        this.currentPage = page;
        this.currentData = data;
        
        // Update navigation state
        this.updateNavigation(page);
        
        // Render page
        this.render();
        
        // Scroll to top
        const appContent = document.getElementById('app');
        if (appContent) {
            appContent.scrollTop = 0;
        }
    },

    // Update navigation active state
    updateNavigation(page) {
        const navItems = document.querySelectorAll('.nav-item');
        const bottomNav = document.querySelector('.bottom-nav');
        const fab = document.getElementById('fab');
        
        // Remove active class from all
        navItems.forEach(item => item.classList.remove('active'));
        
        // Add active to current
        const currentNav = document.querySelector(`[data-page="${page}"]`);
        if (currentNav) {
            currentNav.classList.add('active');
        }
        
        // Show/hide navigation based on page
        const hideNavPages = ['onboarding', 'add-item', 'item-detail', 'aspiration-detail'];
        if (hideNavPages.includes(page)) {
            bottomNav.style.display = 'none';
            fab.style.display = 'none';
        } else {
            bottomNav.style.display = 'flex';
            // Show FAB on home and wardrobe pages
            fab.style.display = (page === 'home' || page === 'wardrobe') ? 'flex' : 'none';
        }
    },

    // Render current page
    render() {
        const app = document.getElementById('app');
        
        switch(this.currentPage) {
            case 'onboarding':
                app.innerHTML = this.renderOnboarding();
                this.initOnboarding();
                break;
            case 'home':
                app.innerHTML = this.renderHome();
                this.initHome();
                break;
            case 'aspirations':
                app.innerHTML = this.renderAspirations();
                this.initAspirations();
                break;
            case 'wardrobe':
                app.innerHTML = this.renderWardrobe();
                this.initWardrobe();
                break;
            case 'profile':
                app.innerHTML = this.renderProfile();
                this.initProfile();
                break;
            case 'add-item':
                app.innerHTML = this.renderAddItem();
                this.initAddItem();
                break;
            case 'item-detail':
                app.innerHTML = this.renderItemDetail(this.currentData);
                this.initItemDetail();
                break;
            case 'add-aspiration':
                app.innerHTML = this.renderAddAspiration();
                this.initAddAspiration();
                break;
            case 'aspiration-detail':
                app.innerHTML = this.renderAspirationDetail(this.currentData);
                this.initAspirationDetail();
                break;
            case 'analysis':
                app.innerHTML = this.renderAnalysis();
                this.initAnalysis();
                break;
            case 'style':
                app.innerHTML = this.renderStyle();
                this.initStyle();
                break;
            case 'shop':
                app.innerHTML = this.renderShop();
                this.initShop();
                break;
            case 'outfit-builder':
                app.innerHTML = this.renderOutfitBuilder();
                this.initOutfitBuilder();
                break;
            case 'add-inspiration':
                app.innerHTML = this.renderAddInspiration();
                this.initAddInspiration();
                break;
            default:
                app.innerHTML = this.renderHome();
        }
    },

    // Render Onboarding
    renderOnboarding() {
        return `
            <div class="info-icon-container-fixed">
                <div class="info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                </div>
                <div class="info-tooltip">
                    <p style="margin-bottom: 12px; font-weight: 500;">your identity evolves, but your wardrobe stays stuck. aspire fixes that.</p>
                    <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
                        <div>🎯 <strong>define who you want to become</strong> - create aspirational identities</div>
                        <div>🤖 <strong>ai matches your clothes</strong> - see what already works</div>
                        <div>✨ <strong>magic match</strong> - ai creates outfits from what you own</div>
                        <div>🎨 <strong>style guides</strong> - personalized fashion insights</div>
                        <div>💡 <strong>save inspiration</strong> - build your mood board</div>
                        <div>🛍️ <strong>smart shopping</strong> - only buy what fills gaps</div>
                    </div>
                </div>
            </div>
            <div class="page dark-bg" style="padding-top: 80px;">
                <div class="text-center mb-2xl">
                    <h1 class="display-title" style="color: white; margin-bottom: 16px;">Aspire</h1>
                    <p style="color: rgba(255,255,255,0.8); font-size: 16px;">
                        Bridge the gap between who you are and who you aspire to be
                    </p>
                </div>
                
                <div class="card" style="margin-top: 60px;">
                    <h2 class="mb-md">Welcome</h2>
                    <p class="text-muted mb-lg">Let's start by creating your profile</p>
                    
                    <div class="form-group">
                        <label class="form-label">Your Name</label>
                        <input type="text" id="userName" class="form-input" placeholder="Enter your name" />
                    </div>
                    
                    <button id="continueBtn" class="btn btn-primary btn-full">Continue</button>
                </div>
            </div>
        `;
    },

    initOnboarding() {
        const continueBtn = document.getElementById('continueBtn');
        const nameInput = document.getElementById('userName');
        
        continueBtn.addEventListener('click', () => {
            const name = nameInput.value.trim();
            if (name) {
                Auth.createUser(name);
                this.navigate('add-aspiration');
            } else {
                Utils.showToast('Please enter your name', 'warning');
            }
        });
        
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                continueBtn.click();
            }
        });
    },

    // Render Home Page
    renderHome() {
        const user = Auth.getCurrentUser();
        const aspirations = Storage.getAspirations();
        const stats = Storage.getStats();
        
        const aspirationsHTML = aspirations.length > 0 ? aspirations.map((asp, index) => `
            <div class="card aspiration-card card-gradient-${(index % 5) + 1} stagger-item hover-lift" 
                 onclick="App.navigate('aspiration-detail', '${asp.id}')">
                <h3 class="aspiration-name">${asp.name}</h3>
                <p class="aspiration-description">${asp.description}</p>
                <div class="aspiration-stats">
                    <div class="stat-item">
                        <span class="stat-label">Items</span>
                        <span class="stat-value">${this.getMatchingItemsCount(asp.id)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Match</span>
                        <span class="stat-value">${this.getAspirationMatchScore(asp.id)}%</span>
                    </div>
                </div>
            </div>
        `).join('') : `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                </div>
                <h3 class="empty-state-title">No Aspirations Yet</h3>
                <p class="empty-state-text">Start by defining who you aspire to become</p>
                <button class="btn btn-primary" onclick="App.navigate('add-aspiration')">Add Your First Aspiration</button>
            </div>
        `;
        
        return `
            <div class="page">
                <div class="page-header">
                    <h1 class="page-title">Hello, ${user.name} 👋</h1>
                    <p class="page-subtitle">Your style evolution journey</p>
                </div>
                
                <div class="card mb-lg" style="background: linear-gradient(135deg, #F0EBE3 0%, #E8DED2 100%);">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="text-xs text-muted mb-xs">Wardrobe Items</p>
                            <h2 style="margin-bottom: 0;">${stats.totalItems}</h2>
                        </div>
                        <div>
                            <p class="text-xs text-muted mb-xs">Aspirations</p>
                            <h2 style="margin-bottom: 0;">${stats.totalAspirations}</h2>
                        </div>
                        <div>
                            <p class="text-xs text-muted mb-xs">Analyzed</p>
                            <h2 style="margin-bottom: 0;">${stats.analyzedItems}</h2>
                        </div>
                    </div>
                </div>
                
                <div class="section-header">
                    <h3 class="section-title">Your Aspirations</h3>
                    ${aspirations.length > 0 ? `<a href="#" class="see-all" onclick="event.preventDefault(); App.navigate('aspirations')">See all</a>` : ''}
                </div>
                
                ${aspirationsHTML}
                
                ${stats.totalItems > 0 && aspirations.length > 0 ? `
                    <button class="btn btn-primary btn-full mt-xl" onclick="App.startAnalysis()">
                        Analyze Wardrobe
                    </button>
                ` : ''}
            </div>
        `;
    },

    initHome() {
        // Add any interactive elements here
    },

    // Render Aspirations Page
    renderAspirations() {
        const aspirations = Storage.getAspirations();
        
        return `
            <div class="page">
                <div class="page-header">
                    <h1 class="page-title">Aspirations</h1>
                    <p class="page-subtitle">Define who you want to become</p>
                </div>
                
                ${aspirations.map((asp, index) => `
                    <div class="card aspiration-card card-gradient-${(index % 5) + 1} stagger-item hover-lift mb-md" 
                         onclick="App.navigate('aspiration-detail', '${asp.id}')">
                        <h3 class="aspiration-name">${asp.name}</h3>
                        <p class="aspiration-description">${asp.description}</p>
                        ${asp.keywords && asp.keywords.length > 0 ? `
                            <div class="chip-group mt-md">
                                ${asp.keywords.map(k => `<span class="chip">${k}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
                
                <button class="btn btn-outline btn-full mt-lg" onclick="App.navigate('add-aspiration')">
                    Add New Aspiration
                </button>
            </div>
        `;
    },

    initAspirations() {
        // Add interactivity
    },

    // Render Wardrobe Page
    renderWardrobe() {
        const items = Storage.getWardrobeItems();
        const categories = ['all', 'top', 'bottom', 'shoes', 'accessory', 'other'];
        
        return `
            <div class="page">
                <div class="page-header">
                    <h1 class="page-title">Wardrobe</h1>
                    <p class="page-subtitle">${items.length} items</p>
                </div>
                
                <div class="chip-group mb-lg" style="overflow-x: auto; flex-wrap: nowrap;">
                    ${categories.map(cat => `
                        <span class="chip ${cat === 'all' ? 'active' : ''}" 
                              data-category="${cat}" 
                              onclick="App.filterWardrobe('${cat}')">
                            ${cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </span>
                    `).join('')}
                </div>
                
                ${items.length > 0 ? `
                    <div class="wardrobe-grid" id="wardrobeGrid">
                        ${items.map(item => this.renderWardrobeItem(item)).join('')}
                    </div>
                ` : `
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                        </div>
                        <h3 class="empty-state-title">No Items Yet</h3>
                        <p class="empty-state-text">Start building your wardrobe by adding items</p>
                        <button class="btn btn-primary" onclick="App.navigate('add-item')">Add First Item</button>
                    </div>
                `}
            </div>
        `;
    },

    initWardrobe() {
        // Already handled by onclick attributes
    },

    renderWardrobeItem(item) {
        const bestMatch = this.getBestMatch(item);
        
        return `
            <div class="wardrobe-item" onclick="App.navigate('item-detail', '${item.id}')">
                <div class="item-image-container">
                    ${item.imageData ? `
                        <img src="${item.imageData}" alt="${item.name}" class="item-image">
                    ` : `
                        <div class="item-image-placeholder">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                        </div>
                    `}
                    ${bestMatch ? `
                        <div class="item-match-badge match-badge-${bestMatch.level}">
                            ${bestMatch.score}%
                        </div>
                    ` : ''}
                </div>
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-category">${item.category}</div>
                </div>
            </div>
        `;
    },

    // Render Profile Page
    renderProfile() {
        const user = Auth.getCurrentUser();
        const stats = Storage.getStats();
        const outfits = Storage.getOutfits();
        const inspirations = Storage.getInspirations();
        
        return `
            <div class="page">
                <div class="flex flex-col items-center mb-xl">
                    <div class="avatar avatar-lg mb-md">${Auth.getUserInitials()}</div>
                    <h2>${user.name}</h2>
                    <p class="text-muted text-sm">Member since ${new Date(user.createdAt).toLocaleDateString()}</p>
                </div>

                <div class="card mb-md" style="background: linear-gradient(135deg, #D9A75A 0%, #C4B5A0 100%);">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="text-xs" style="color: rgba(255,255,255,0.9); margin-bottom: 4px;">Reward Points</p>
                            <h1 style="color: white; margin-bottom: 0; font-size: 48px;">${user.points || 0}</h1>
                        </div>
                        <button class="btn" style="background: rgba(255,255,255,0.2); color: white; border: none;" 
                                onclick="App.redeemReward()">
                            Redeem
                        </button>
                    </div>
                    <div class="mt-md" style="padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.2);">
                        <p class="text-xs" style="color: rgba(255,255,255,0.8);">
                            💎 ${outfits.length} outfits • ✨ ${inspirations.length} inspirations
                        </p>
                    </div>
                </div>
                
                <div class="card mb-md">
                    <h3 class="mb-md">Statistics</h3>
                    <div class="flex justify-between mb-sm">
                        <span class="text-muted">Total Items</span>
                        <span class="font-weight-600">${stats.totalItems}</span>
                    </div>
                    <div class="flex justify-between mb-sm">
                        <span class="text-muted">Aspirations</span>
                        <span class="font-weight-600">${stats.totalAspirations}</span>
                    </div>
                    <div class="flex justify-between mb-sm">
                        <span class="text-muted">Outfits Created</span>
                        <span class="font-weight-600">${outfits.length}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted">Analyzed Items</span>
                        <span class="font-weight-600">${stats.analyzedItems}</span>
                    </div>
                </div>

                <div class="card mb-md">
                    <h3 class="mb-sm">Earn Points</h3>
                    <p class="text-sm text-muted mb-md">Complete actions to earn rewards</p>
                    <div class="flex justify-between mb-sm">
                        <span class="text-sm">Create an outfit</span>
                        <span class="chip">+10 pts</span>
                    </div>
                    <div class="flex justify-between mb-sm">
                        <span class="text-sm">Add inspiration</span>
                        <span class="chip">+5 pts</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-sm">Analyze wardrobe</span>
                        <span class="chip">+15 pts</span>
                    </div>
                </div>
                
                <button class="btn btn-secondary btn-full mb-md" onclick="App.exportData()">
                    Export Data
                </button>
                
                <button class="btn btn-outline btn-full mb-md" onclick="App.importData()">
                    Import Data
                </button>
                
                <button class="btn btn-secondary btn-full mb-md" onclick="App.loadDemoData()">
                    Load Demo Data
                </button>
                
                <button class="btn btn-ghost btn-full" onclick="App.handleLogout()" style="color: var(--error);">
                    Clear All Data
                </button>
            </div>
        `;
    },

    redeemReward() {
        const user = Auth.getCurrentUser();
        const points = user.points || 0;

        if (points < 100) {
            Utils.showToast(`Need ${100 - points} more points to redeem Virtual Stylist Session`, 'warning');
            return;
        }

        if (confirm('Redeem 100 points for a Virtual Stylist Session?')) {
            const success = Storage.redeemReward({
                name: 'Virtual Stylist Session',
                cost: 100
            });

            if (success) {
                Utils.showToast('Reward redeemed! Check your email for details.', 'success');
                this.navigate('profile');
            }
        }
    },

    initProfile() {
        // Already handled
    },

    // Render Add Item Page
    renderAddItem() {
        return `
            <div class="page">
                <div class="flex justify-between items-center mb-lg">
                    <h2>Add Item</h2>
                    <button class="icon-btn" onclick="App.navigate('wardrobe')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <div id="imageContainer" class="mb-lg"></div>
                
                <form id="addItemForm">
                    <div class="form-group">
                        <label class="form-label">Item Name</label>
                        <input type="text" id="itemName" class="form-input" placeholder="e.g., Black Turtleneck" required />
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Category</label>
                        <select id="itemCategory" class="form-select" required>
                            <option value="top">Top</option>
                            <option value="bottom">Bottom</option>
                            <option value="shoes">Shoes</option>
                            <option value="accessory">Accessory</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea id="itemDescription" class="form-textarea" placeholder="Describe this item..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Color</label>
                        <input type="text" id="itemColor" class="form-input" placeholder="e.g., Black" />
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Brand (optional)</label>
                        <input type="text" id="itemBrand" class="form-input" placeholder="e.g., Uniqlo" />
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-full">Save Item</button>
                </form>
            </div>
        `;
    },

    initAddItem() {
        const imageContainer = document.getElementById('imageContainer');
        let currentImage = null;
        
        // Add upload area
        const uploadArea = Camera.createUploadArea((imageData) => {
            currentImage = imageData.dataUrl;
            imageContainer.innerHTML = '';
            const preview = Camera.createPreview(imageData);
            imageContainer.appendChild(preview);
        });
        imageContainer.appendChild(uploadArea);
        
        // Handle form submission
        const form = document.getElementById('addItemForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const item = {
                name: document.getElementById('itemName').value,
                category: document.getElementById('itemCategory').value,
                description: document.getElementById('itemDescription').value,
                color: document.getElementById('itemColor').value,
                brand: document.getElementById('itemBrand').value,
                imageData: currentImage
            };
            
            Storage.addWardrobeItem(item);
            Utils.showToast('Item added successfully!', 'success');
            this.navigate('wardrobe');
        });
    },

    // Render Add Aspiration Page
    renderAddAspiration() {
        return `
            <div class="page">
                <div class="flex justify-between items-center mb-lg">
                    <h2>Add Aspiration</h2>
                    <button class="icon-btn" onclick="App.navigate('aspirations')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <p class="text-muted mb-xl">Define an aspirational identity that represents who you want to become</p>
                
                <form id="addAspirationForm">
                    <div class="form-group">
                        <label class="form-label">Identity Name</label>
                        <input type="text" id="aspName" class="form-input" 
                               placeholder="e.g., Professional Creative" required />
                        <p class="form-hint">A short, memorable name for this aspiration</p>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea id="aspDescription" class="form-textarea" 
                                  placeholder="Describe this identity and what it means to you..." required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Keywords (comma-separated)</label>
                        <input type="text" id="aspKeywords" class="form-input" 
                               placeholder="e.g., structured, artistic, refined" />
                        <p class="form-hint">Style keywords that define this aspiration</p>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-full">Create Aspiration</button>
                </form>
            </div>
        `;
    },

    initAddAspiration() {
        const form = document.getElementById('addAspirationForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const keywords = document.getElementById('aspKeywords').value
                .split(',')
                .map(k => k.trim())
                .filter(k => k);
            
            const aspiration = {
                name: document.getElementById('aspName').value,
                description: document.getElementById('aspDescription').value,
                keywords: keywords,
                gradient: (Storage.getAspirations().length % 5) + 1
            };
            
            Storage.addAspiration(aspiration);
            Utils.showToast('Aspiration created!', 'success');
            
            // If this is first aspiration (onboarding), go to home
            if (Storage.getAspirations().length === 1) {
                this.navigate('home');
            } else {
                this.navigate('aspirations');
            }
        });
    },

    // Item Detail Page
    renderItemDetail(itemId) {
        const item = Storage.getWardrobeItemById(itemId);
        if (!item) return '<div class="page"><p>Item not found</p></div>';
        
        const aspirations = Storage.getAspirations();
        
        return `
            <div class="page" style="padding-top: 0;">
                <div style="position: relative; margin: -20px -20px 24px; height: 300px; background: var(--secondary);">
                    ${item.imageData ? `
                        <img src="${item.imageData}" alt="${item.name}" 
                             style="width: 100%; height: 100%; object-fit: cover;">
                    ` : `
                        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                                 style="width: 80px; height: 80px; opacity: 0.3;">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            </svg>
                        </div>
                    `}
                    <button class="icon-btn" onclick="App.navigate('wardrobe')" 
                            style="position: absolute; top: 16px; left: 16px; background: rgba(255,255,255,0.95);">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>
                </div>
                
                <h1 class="mb-sm">${item.name}</h1>
                <p class="text-muted mb-lg">${item.category} • ${item.color || 'No color specified'}</p>
                
                ${item.description ? `
                    <div class="card mb-lg">
                        <h3 class="mb-sm">Description</h3>
                        <p class="text-sm">${item.description}</p>
                    </div>
                ` : ''}
                
                ${aspirations.length > 0 && item.analysisResults && Object.keys(item.analysisResults).length > 0 ? `
                    <h3 class="mb-md">Aspiration Matches</h3>
                    ${aspirations.map(asp => {
                        const analysis = item.analysisResults[asp.id];
                        if (!analysis) return '';
                        
                        return `
                            <div class="card mb-md">
                                <div class="flex justify-between items-center mb-sm">
                                    <h4>${asp.name}</h4>
                                    <span class="badge badge-${AI.getMatchLevel(analysis.matchScore)}">
                                        ${AI.formatMatchScore(analysis.matchScore)}
                                    </span>
                                </div>
                                <p class="text-sm text-muted">${analysis.reasoning}</p>
                            </div>
                        `;
                    }).join('')}
                ` : `
                    <div class="empty-state">
                        <p class="text-muted">No analysis yet</p>
                        <button class="btn btn-primary mt-md" onclick="App.analyzeItem('${itemId}')">
                            Analyze This Item
                        </button>
                    </div>
                `}
                
                <button class="btn btn-outline btn-full mt-xl" onclick="App.deleteItem('${itemId}')">
                    Delete Item
                </button>
            </div>
        `;
    },

    initItemDetail() {
        // Already handled
    },

    // Aspiration Detail Page
    renderAspirationDetail(aspirationId) {
        const aspiration = Storage.getAspirationById(aspirationId);
        if (!aspiration) return '<div class="page"><p>Aspiration not found</p></div>';
        
        const allItems = Storage.getWardrobeItems();
        const matchingItems = allItems.filter(item => {
            const analysis = item.analysisResults?.[aspirationId];
            return analysis && analysis.matchScore >= 0.5;
        });
        
        return `
            <div class="page">
                <button class="icon-btn mb-lg" onclick="App.navigate('aspirations')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                
                <h1 class="display-title mb-md">${aspiration.name}</h1>
                <p class="mb-lg" style="font-size: 16px; line-height: 1.6;">${aspiration.description}</p>
                
                ${aspiration.keywords && aspiration.keywords.length > 0 ? `
                    <div class="chip-group mb-xl">
                        ${aspiration.keywords.map(k => `<span class="chip active">${k}</span>`).join('')}
                    </div>
                ` : ''}

                <button class="btn btn-primary btn-full mb-xl" onclick="App.showStyleInsights('${aspirationId}')">
                    ✨ Get Style Guide
                </button>

                <div id="styleInsightsContainer"></div>
                
                <h3 class="mb-md">Matching Items (${matchingItems.length})</h3>
                
                ${matchingItems.length > 0 ? `
                    <div class="wardrobe-grid">
                        ${matchingItems.map(item => this.renderWardrobeItem(item)).join('')}
                    </div>
                ` : `
                    <div class="empty-state">
                        <p class="text-muted">No matching items yet</p>
                        <button class="btn btn-primary mt-md" onclick="App.navigate('add-item')">
                            Add Items
                        </button>
                    </div>
                `}
            </div>
        `;
    },

    initAspirationDetail() {
        // Check if insights already cached and display them
        const insights = Storage.getStyleInsights(this.currentData);
        if (insights) {
            this.displayStyleInsights(insights);
        }
    },

    async showStyleInsights(aspirationId) {
        const insights = await this.loadStyleInsights(aspirationId);
        if (insights) {
            this.displayStyleInsights(insights);
        }
    },

    displayStyleInsights(insights) {
        const container = document.getElementById('styleInsightsContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="card mb-xl" style="background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%);">
                <h3 class="mb-md">Style Guide</h3>
                
                <div class="mb-lg">
                    <h4 class="mb-sm">🎨 Key Elements</h4>
                    <div class="mb-sm">
                        <p class="text-xs text-muted mb-xs">Colors</p>
                        <div class="chip-group">
                            ${insights.styleElements.colors.map(c => `<span class="chip">${c}</span>`).join('')}
                        </div>
                    </div>
                    <div class="mb-sm">
                        <p class="text-xs text-muted mb-xs">Silhouettes</p>
                        <div class="chip-group">
                            ${insights.styleElements.silhouettes.map(s => `<span class="chip">${s}</span>`).join('')}
                        </div>
                    </div>
                    <div>
                        <p class="text-xs text-muted mb-xs">Fabrics</p>
                        <div class="chip-group">
                            ${insights.styleElements.fabrics.map(f => `<span class="chip">${f}</span>`).join('')}
                        </div>
                    </div>
                </div>

                <div class="mb-lg">
                    <h4 class="mb-sm">✅ Essential Pieces</h4>
                    ${insights.essentialPieces.map(piece => `
                        <div style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                            <p class="text-sm">☐ ${piece}</p>
                        </div>
                    `).join('')}
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;" class="mb-lg">
                    <div>
                        <h4 class="mb-sm">👍 Do's</h4>
                        ${insights.dos.map(item => `
                            <p class="text-sm mb-sm" style="color: #059669;">• ${item}</p>
                        `).join('')}
                    </div>
                    <div>
                        <h4 class="mb-sm">👎 Don'ts</h4>
                        ${insights.donts.map(item => `
                            <p class="text-sm mb-sm" style="color: #DC2626;">• ${item}</p>
                        `).join('')}
                    </div>
                </div>

                <div>
                    <h4 class="mb-sm">🚀 Transition Tips</h4>
                    ${insights.transitionTips.map((tip, i) => `
                        <p class="text-sm mb-sm"><strong>${i + 1}.</strong> ${tip}</p>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // Analysis Page
    renderAnalysis() {
        return `
            <div class="page">
                <h1 class="page-title mb-lg">Analyzing Wardrobe</h1>
                <div class="text-center">
                    <div class="loading-spinner" style="width: 48px; height: 48px; margin: 40px auto;"></div>
                    <p class="text-muted" id="analysisStatus">Preparing analysis...</p>
                </div>
            </div>
        `;
    },

    initAnalysis() {
        // Analysis is handled by startAnalysis()
    },

    // Utility Methods
    getMatchingItemsCount(aspirationId) {
        const items = Storage.getWardrobeItems();
        return items.filter(item => {
            const analysis = item.analysisResults?.[aspirationId];
            return analysis && analysis.matchScore >= 0.5;
        }).length;
    },

    getAspirationMatchScore(aspirationId) {
        const items = Storage.getWardrobeItems();
        const matchingItems = items.filter(item => item.analysisResults?.[aspirationId]);
        
        if (matchingItems.length === 0) return 0;
        
        const totalScore = matchingItems.reduce((sum, item) => {
            return sum + (item.analysisResults[aspirationId].matchScore || 0);
        }, 0);
        
        return Math.round((totalScore / matchingItems.length) * 100);
    },

    getBestMatch(item) {
        if (!item.analysisResults || Object.keys(item.analysisResults).length === 0) {
            return null;
        }
        
        let bestScore = 0;
        let bestAspiration = null;
        
        Object.entries(item.analysisResults).forEach(([aspId, analysis]) => {
            if (analysis.matchScore > bestScore) {
                bestScore = analysis.matchScore;
                bestAspiration = aspId;
            }
        });
        
        return {
            aspirationId: bestAspiration,
            score: Math.round(bestScore * 100),
            level: AI.getMatchLevel(bestScore)
        };
    },

    filterWardrobe(category) {
        const items = category === 'all' 
            ? Storage.getWardrobeItems() 
            : Storage.getWardrobeItemsByCategory(category);
        
        const grid = document.getElementById('wardrobeGrid');
        if (grid) {
            grid.innerHTML = items.map(item => this.renderWardrobeItem(item)).join('');
        }
        
        // Update active chip
        document.querySelectorAll('.chip[data-category]').forEach(chip => {
            chip.classList.toggle('active', chip.dataset.category === category);
        });
    },

    // Action Methods
    async startAnalysis() {
        const items = Storage.getWardrobeItems();
        const aspirations = Storage.getAspirations();
        
        if (items.length === 0) {
            Utils.showToast('Add some items first!', 'warning');
            return;
        }
        
        if (aspirations.length === 0) {
            Utils.showToast('Add aspirations first!', 'warning');
            return;
        }
        
        this.navigate('analysis');
        
        try {
            const results = await AI.analyzeBatchWithProgress(items, aspirations, (progress) => {
                const statusEl = document.getElementById('analysisStatus');
                if (statusEl) {
                    statusEl.textContent = `Analyzing item ${progress.current} of ${progress.total}...`;
                }
            });
            
            // Save results
            results.forEach(result => {
                if (result.success) {
                    Object.entries(result.analysis).forEach(([aspId, analysis]) => {
                        Storage.updateItemAnalysis(result.itemId, aspId, analysis);
                    });
                }
            });
            
            Utils.showToast('Analysis complete!', 'success');
            this.navigate('home');
        } catch (error) {
            console.error('Analysis error:', error);
            Utils.showToast('Analysis failed. Please try again.', 'error');
            this.navigate('home');
        }
    },

    async analyzeItem(itemId) {
        const item = Storage.getWardrobeItemById(itemId);
        const aspirations = Storage.getAspirations();
        
        if (!item || aspirations.length === 0) return;
        
        Utils.showToast('Analyzing item...', 'info');
        
        try {
            const analysis = await AI.analyzeItem(item, aspirations);
            
            Object.entries(analysis).forEach(([aspId, result]) => {
                Storage.updateItemAnalysis(itemId, aspId, result);
            });
            
            Utils.showToast('Analysis complete!', 'success');
            this.navigate('item-detail', itemId);
        } catch (error) {
            console.error('Analysis error:', error);
            Utils.showToast('Analysis failed. Please try again.', 'error');
        }
    },

    deleteItem(itemId) {
        if (confirm('Are you sure you want to delete this item?')) {
            Storage.deleteWardrobeItem(itemId);
            Utils.showToast('Item deleted', 'success');
            this.navigate('wardrobe');
        }
    },

    handleLogout() {
        if (confirm('This will clear all your data. Are you sure?')) {
            Storage.clearAll();
            Utils.showToast('Data cleared', 'success');
            this.navigate('onboarding');
        }
    },

    exportData() {
        const data = Storage.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aspire-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        Utils.showToast('Data exported!', 'success');
    },

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        Storage.importData(data);
                        Utils.showToast('Data imported successfully!', 'success');
                        this.navigate('home');
                    } catch (error) {
                        Utils.showToast('Failed to import data', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    },

    loadDemoData() {
        if (confirm('This will replace all your current data with demo data. Continue?')) {
            // Clear all existing data
            Storage.clearAll();
            
            // Load dummy data (will work since we just cleared everything)
            Storage.populateDummyData();
            
            Utils.showToast('Demo data loaded successfully!', 'success');
            this.navigate('home');
        }
    },

    // Style Page - Outfit Builder & Inspirations
    renderStyle() {
        const outfits = Storage.getOutfits();
        const inspirations = Storage.getInspirations();
        
        return `
            <div class="page">
                <div class="page-header">
                    <h1 class="page-title">Style</h1>
                    <p class="page-subtitle">Create & discover outfits</p>
                </div>

                <div class="card mb-lg" style="background: linear-gradient(135deg, #A8A29E 0%, #9B8B7E 100%);">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="text-xs" style="color: rgba(255,255,255,0.95); margin-bottom: 4px;">My Outfits</p>
                            <h2 style="color: white; margin-bottom: 0;">${outfits.length}</h2>
                        </div>
                        <div>
                            <p class="text-xs" style="color: rgba(255,255,255,0.95); margin-bottom: 4px;">Inspirations</p>
                            <h2 style="color: white; margin-bottom: 0;">${inspirations.length}</h2>
                        </div>
                        <button class="btn" style="background: rgba(255,255,255,0.2); color: white; border: none;" 
                                onclick="App.navigate('outfit-builder')">
                            Create Outfit
                        </button>
                    </div>
                </div>

                <div class="section-header">
                    <h3 class="section-title">My Outfits</h3>
                    ${outfits.length > 0 ? `<button class="btn btn-sm btn-outline" onclick="App.navigate('outfit-builder')">+ New</button>` : ''}
                </div>

                ${outfits.length > 0 ? `
                    <div class="wardrobe-grid mb-xl">
                        ${outfits.map(outfit => `
                            <div class="card hover-lift" style="cursor: pointer;">
                                <div style="aspect-ratio: 1; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 8px; margin-bottom: 12px; display: flex; align-items: center; justify-content: center;">
                                    ${outfit.inspirationImage ? `
                                        <img src="${outfit.inspirationImage}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                                    ` : `
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 48px; height: 48px; opacity: 0.3;">
                                            <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                                            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                                        </svg>
                                    `}
                                </div>
                                <h4 style="margin-bottom: 4px;">${outfit.name}</h4>
                                <p class="text-xs text-muted">${outfit.items.length} items</p>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                            </svg>
                        </div>
                        <h3 class="empty-state-title">No Outfits Yet</h3>
                        <p class="empty-state-text">Start creating outfits from your wardrobe</p>
                        <button class="btn btn-primary" onclick="App.navigate('outfit-builder')">Create First Outfit</button>
                    </div>
                `}

                <div class="section-header">
                    <h3 class="section-title">Inspiration Board</h3>
                    ${inspirations.length > 0 ? `<button class="btn btn-sm btn-outline" onclick="App.navigate('add-inspiration')">+ Add</button>` : ''}
                </div>

                ${inspirations.length > 0 ? `
                    <div class="wardrobe-grid">
                        ${inspirations.map(insp => `
                            <div class="card hover-lift" style="cursor: pointer; padding: 0; overflow: hidden;">
                                <img src="${insp.imageData}" style="width: 100%; aspect-ratio: 1; object-fit: cover;">
                                ${insp.description ? `
                                    <div style="padding: 12px;">
                                        <p class="text-sm">${insp.description}</p>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                        </div>
                        <h3 class="empty-state-title">No Inspirations Yet</h3>
                        <p class="empty-state-text">Add photos for style inspiration</p>
                        <button class="btn btn-primary" onclick="App.navigate('add-inspiration')">Add Inspiration</button>
                    </div>
                `}
            </div>
        `;
    },

    initStyle() {
        // Handled by onclick events
    },

    renderOutfitBuilder() {
        const items = Storage.getWardrobeItems();
        const aspirations = Storage.getAspirations();
        
        return `
            <div class="page">
                <div class="flex justify-between items-center mb-lg">
                    <h2>Create Outfit</h2>
                    <button class="icon-btn" onclick="App.navigate('style')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <p class="text-muted mb-lg">Select items from your wardrobe to create an outfit</p>

                ${aspirations.length > 0 ? `
                    <div class="card mb-lg" style="background: linear-gradient(135deg, #C4B5A0 0%, #A8A29E 100%);">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-xs" style="color: rgba(255,255,255,0.9); margin-bottom: 4px;">AI Outfit Suggestion</p>
                                <p class="text-sm" style="color: rgba(255,255,255,0.8);">Let AI create an outfit for you</p>
                            </div>
                            <button class="btn" style="background: rgba(255,255,255,0.2); color: white; border: none;" 
                                    onclick="App.showAIOutfitSuggestions()">
                                ✨ Magic Match
                            </button>
                        </div>
                    </div>
                ` : ''}

                <div class="form-group">
                    <label class="form-label">Outfit Name</label>
                    <input type="text" id="outfitName" class="form-input" placeholder="e.g., Weekend Casual" />
                </div>

                <div id="selectedItems" class="mb-lg" style="min-height: 100px; border: 2px dashed #E5E7EB; border-radius: 12px; padding: 16px; display: flex; flex-wrap: gap: 12px; align-items: center; justify-content: center;">
                    <p class="text-muted text-sm">Select items below to add to outfit</p>
                </div>

                <h3 class="mb-md">Your Wardrobe</h3>
                <div class="wardrobe-grid">
                    ${items.map(item => `
                        <div class="wardrobe-item" onclick="App.toggleOutfitItem('${item.id}')" id="outfit-item-${item.id}">
                            <div class="item-image-container">
                                ${item.imageData ? `
                                    <img src="${item.imageData}" alt="${item.name}" class="item-image">
                                ` : `
                                    <div class="item-image-placeholder">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        </svg>
                                    </div>
                                `}
                            </div>
                            <div class="item-info">
                                <div class="item-name">${item.name}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <button class="btn btn-primary btn-full mt-xl" onclick="App.saveOutfit()">Save Outfit</button>
            </div>
        `;
    },

    initOutfitBuilder() {
        this.selectedOutfitItems = [];
    },

    toggleOutfitItem(itemId) {
        const item = Storage.getWardrobeItemById(itemId);
        if (!item) return;

        const index = this.selectedOutfitItems.findIndex(id => id === itemId);
        const itemEl = document.getElementById(`outfit-item-${itemId}`);
        
        if (index > -1) {
            this.selectedOutfitItems.splice(index, 1);
            itemEl.style.opacity = '1';
            itemEl.style.border = 'none';
        } else {
            this.selectedOutfitItems.push(itemId);
            itemEl.style.opacity = '0.5';
            itemEl.style.border = '2px solid #4F46E5';
        }

        this.updateSelectedItemsDisplay();
    },

    updateSelectedItemsDisplay() {
        const container = document.getElementById('selectedItems');
        if (this.selectedOutfitItems.length === 0) {
            container.innerHTML = '<p class="text-muted text-sm">Select items below to add to outfit</p>';
        } else {
            container.innerHTML = this.selectedOutfitItems.map(id => {
                const item = Storage.getWardrobeItemById(id);
                return `<span class="chip">${item.name}</span>`;
            }).join('');
        }
    },

    saveOutfit() {
        const name = document.getElementById('outfitName').value.trim();
        
        if (!name) {
            Utils.showToast('Please enter an outfit name', 'warning');
            return;
        }

        if (this.selectedOutfitItems.length === 0) {
            Utils.showToast('Please select at least one item', 'warning');
            return;
        }

        Storage.addOutfit({
            name: name,
            items: this.selectedOutfitItems
        });

        Utils.showToast(`Outfit created! +10 points`, 'success');
        this.navigate('style');
    },

    renderAddInspiration() {
        return `
            <div class="page">
                <div class="flex justify-between items-center mb-lg">
                    <h2>Add Inspiration</h2>
                    <button class="icon-btn" onclick="App.navigate('style')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <p class="text-muted mb-lg">Upload a photo for style inspiration</p>

                <div id="inspirationImageContainer" class="mb-lg"></div>

                <div class="form-group">
                    <label class="form-label">Description (optional)</label>
                    <textarea id="inspirationDescription" class="form-textarea" placeholder="What inspires you about this look?"></textarea>
                </div>

                <button id="saveInspirationBtn" class="btn btn-primary btn-full">Save Inspiration</button>
            </div>
        `;
    },

    initAddInspiration() {
        const imageContainer = document.getElementById('inspirationImageContainer');
        let currentImage = null;

        const uploadArea = Camera.createUploadArea((imageData) => {
            currentImage = imageData.dataUrl;
            imageContainer.innerHTML = '';
            const preview = Camera.createPreview(imageData);
            imageContainer.appendChild(preview);
        });
        imageContainer.appendChild(uploadArea);

        document.getElementById('saveInspirationBtn').addEventListener('click', () => {
            if (!currentImage) {
                Utils.showToast('Please upload an image', 'warning');
                return;
            }

            Storage.addInspiration({
                imageData: currentImage,
                description: document.getElementById('inspirationDescription').value.trim()
            });

            Utils.showToast('Inspiration added! +5 points', 'success');
            this.navigate('style');
        });
    },

    // Shop Page - Smart Recommendations
    renderShop() {
        const shoppingList = Storage.getShoppingList();
        const aspirations = Storage.getAspirations();

        return `
            <div class="page">
                <div class="page-header">
                    <h1 class="page-title">Shop</h1>
                    <p class="page-subtitle">Curated recommendations</p>
                </div>

                <div class="card mb-lg" style="background: linear-gradient(135deg, #C4B5A0 0%, #A8A29E 100%);">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="text-xs" style="color: rgba(255,255,255,0.9); margin-bottom: 4px;">Shopping List</p>
                            <h2 style="color: white; margin-bottom: 0;">${shoppingList.length} items</h2>
                        </div>
                        <button class="btn" style="background: rgba(255,255,255,0.2); color: white; border: none;" 
                                onclick="App.generateRecommendations()">
                            Get Suggestions
                        </button>
                    </div>
                </div>

                ${shoppingList.length > 0 ? `
                    <h3 class="mb-md">Recommended Items</h3>
                    ${shoppingList.map(item => `
                        <div class="card mb-md hover-lift">
                            <div class="flex justify-between items-start mb-sm">
                                <div>
                                    <h4>${item.itemType}</h4>
                                    <p class="text-sm text-muted">${item.reason}</p>
                                </div>
                                <button class="icon-btn" onclick="Storage.removeFromShoppingList('${item.id}'); App.navigate('shop');">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                            ${item.suggestedBrand ? `
                                <div class="chip-group">
                                    <span class="chip">${item.suggestedBrand}</span>
                                    ${item.isEthical ? '<span class="chip" style="background: #10B981; color: white;">Ethical Brand</span>' : ''}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                    <button class="btn btn-outline btn-full mt-md" onclick="Storage.clearShoppingList(); App.navigate('shop');">
                        Clear List
                    </button>
                ` : `
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                        </div>
                        <h3 class="empty-state-title">No Recommendations Yet</h3>
                        <p class="empty-state-text">Generate smart suggestions based on your wardrobe gaps</p>
                        <button class="btn btn-primary" onclick="App.generateRecommendations()">Get Recommendations</button>
                    </div>
                `}
            </div>
        `;
    },

    initShop() {
        // Handled by onclick events
    },

    generateRecommendations() {
        const items = Storage.getWardrobeItems();
        const aspirations = Storage.getAspirations();

        if (items.length === 0 || aspirations.length === 0) {
            Utils.showToast('Add wardrobe items and aspirations first', 'warning');
            return;
        }

        // Simple gap analysis
        const categories = {
            top: items.filter(i => i.category === 'top').length,
            bottom: items.filter(i => i.category === 'bottom').length,
            shoes: items.filter(i => i.category === 'shoes').length,
            accessory: items.filter(i => i.category === 'accessory').length
        };

        // Find gaps
        const suggestions = [
            { category: 'top', min: 5, brands: ['Everlane', 'Uniqlo', 'Patagonia'] },
            { category: 'bottom', min: 3, brands: ['Levi\'s', 'J.Crew', 'Nudie Jeans'] },
            { category: 'shoes', min: 3, brands: ['Allbirds', 'Thursday Boot Co.', 'Veja'] },
            { category: 'accessory', min: 2, brands: ['Filson', 'Bellroy', 'Skagen'] }
        ];

        suggestions.forEach(sug => {
            if (categories[sug.category] < sug.min) {
                const brand = sug.brands[Math.floor(Math.random() * sug.brands.length)];
                Storage.addToShoppingList({
                    itemType: `${sug.category.charAt(0).toUpperCase() + sug.category.slice(1)} Piece`,
                    reason: `Build out your ${sug.category} collection`,
                    suggestedBrand: brand,
                    isEthical: true
                });
            }
        });

        Utils.showToast('Recommendations generated!', 'success');
        this.navigate('shop');
    },

    // AI-powered outfit suggestions
    async showAIOutfitSuggestions() {
        const aspirations = Storage.getAspirations();
        const items = Storage.getWardrobeItems();

        if (items.length < 3) {
            Utils.showToast('Add at least 3 items to your wardrobe first', 'warning');
            return;
        }

        // Show aspiration selection modal
        const aspirationId = await this.selectAspiration(aspirations);
        if (!aspirationId) return;

        const aspiration = Storage.getAspirationById(aspirationId);
        Utils.showToast('AI is creating your outfit...', 'info');

        try {
            const suggestion = await AI.suggestOutfitForAspiration(aspiration, items);
            
            // Auto-fill the outfit builder
            document.getElementById('outfitName').value = suggestion.outfitName;
            
            // Clear current selection
            this.selectedOutfitItems = [];
            
            // Select suggested items
            suggestion.selectedItemIds.forEach(itemId => {
                this.toggleOutfitItem(itemId);
            });

            Utils.showToast(`✨ ${suggestion.outfitName} created!`, 'success');
            
            // Show reasoning
            setTimeout(() => {
                alert(`Why this works:\n\n${suggestion.reasoning}\n\n${suggestion.stylingTips}`);
            }, 500);
        } catch (error) {
            console.error('AI suggestion error:', error);
            Utils.showToast('Failed to generate outfit. Try again.', 'error');
        }
    },

    async selectAspiration(aspirations) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;';
            
            modal.innerHTML = `
                <div class="card" style="width: 90%; max-width: 400px; max-height: 80vh; overflow-y: auto;">
                    <h3 class="mb-md">Select Aspiration</h3>
                    <p class="text-sm text-muted mb-lg">Choose which aspiration to create an outfit for</p>
                    ${aspirations.map(asp => `
                        <button class="btn btn-outline btn-full mb-sm" onclick="document.dispatchEvent(new CustomEvent('aspiration-selected', {detail: '${asp.id}'}))">
                            ${asp.name}
                        </button>
                    `).join('')}
                    <button class="btn btn-ghost btn-full mt-md" onclick="document.dispatchEvent(new CustomEvent('aspiration-selected', {detail: null}))">
                        Cancel
                    </button>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            document.addEventListener('aspiration-selected', (e) => {
                modal.remove();
                resolve(e.detail);
            }, { once: true });
        });
    },

    // Load or generate style insights for aspiration
    async loadStyleInsights(aspirationId) {
        let insights = Storage.getStyleInsights(aspirationId);
        
        if (!insights || Storage.needsStyleInsightsRefresh(aspirationId)) {
            Utils.showToast('Loading style insights...', 'info');
            
            try {
                const aspiration = Storage.getAspirationById(aspirationId);
                insights = await AI.getStyleInsights(aspiration);
                Storage.cacheStyleInsights(aspirationId, insights);
                return insights;
            } catch (error) {
                console.error('Error loading insights:', error);
                Utils.showToast('Failed to load insights', 'error');
                return null;
            }
        }
        
        return insights;
    }
};

// Utility functions
const Utils = {
    showToast(message, type = 'info') {
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Don't auto-populate data - user can load demo data from profile if needed
    App.init();
});

// Make App globally available
window.App = App;
window.Utils = Utils;
