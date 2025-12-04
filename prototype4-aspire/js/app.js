// Aspire Loop - Main Application Controller
const App = {
    currentPage: 'dashboard',
    selectedImages: [],
    selectedItems: [],

    // Initialize app
    init() {
        // Check if user has completed onboarding
        if (!Storage.isOnboardingComplete()) {
            this.navigate('onboarding');
        } else if (!IdentityEngine.hasIdentity()) {
            this.navigate('identity-create');
        } else {
            this.navigate('dashboard');
        }

        // Setup navigation
        this.setupNavigation();
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

    // Navigate to page
    navigate(page) {
        this.currentPage = page;
        this.updateNavigation(page);
        this.render();
        
        // Scroll to top
        const appContent = document.getElementById('app');
        if (appContent) {
            appContent.scrollTop = 0;
        }
    },

    // Update navigation state
    updateNavigation(page) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });

        // Hide nav on certain pages
        const bottomNav = document.querySelector('.bottom-nav');
        const hideNavPages = ['onboarding', 'identity-create', 'tell-me-about-you', 'add-wardrobe-item', 'aspiration-detail', 'add-aspiration', 'edit-aspiration'];
        bottomNav.style.display = hideNavPages.includes(page) ? 'none' : 'flex';
    },

    // Render current page
    render() {
        const app = document.getElementById('app');
        
        switch(this.currentPage) {
            case 'onboarding':
                app.innerHTML = this.renderOnboarding();
                this.initOnboarding();
                break;
            case 'identity-create':
                app.innerHTML = this.renderIdentityCreate();
                this.initIdentityCreate();
                break;
            case 'tell-me-about-you':
                app.innerHTML = this.renderTellMeAboutYou();
                this.initTellMeAboutYou();
                break;
            case 'dashboard':
                app.innerHTML = this.renderDashboard();
                this.initDashboard();
                break;
            case 'identity':
                app.innerHTML = this.renderIdentityView();
                this.initIdentityView();
                break;
            case 'aspiration-detail':
                app.innerHTML = this.renderAspirationDetail();
                this.initAspirationDetail();
                break;
            case 'add-aspiration':
                app.innerHTML = this.renderAddAspiration();
                this.initAddAspiration();
                break;
            case 'edit-aspiration':
                app.innerHTML = this.renderEditAspiration();
                this.initEditAspiration();
                break;
            case 'daily-log':
                app.innerHTML = this.renderDailyLog();
                this.initDailyLog();
                break;
            case 'progress':
                app.innerHTML = this.renderProgress();
                break;
            case 'profile':
                app.innerHTML = this.renderProfile();
                this.initProfile();
                break;
            case 'add-wardrobe-item':
                app.innerHTML = this.renderAddWardrobeItem();
                this.initAddWardrobeItem();
                break;
            case 'wardrobe':
                app.innerHTML = this.renderWardrobe();
                this.initWardrobe();
                break;
            case 'outfits':
                app.innerHTML = this.renderOutfits();
                this.initOutfits();
                break;
            default:
                app.innerHTML = this.renderDashboard();
        }
    },

    // ONBOARDING PAGE
    renderOnboarding() {
        return `
            <div class="fade-in">
                <div class="text-center mb-2xl" style="margin-top: 80px;">
                    <h1 style="font-size: 48px; margin-bottom: 24px;">ASPIRE</h1>
                    <p style="font-size: 18px; line-height: 1.6; margin-bottom: 12px; font-weight: 500;">
                        Identity First. Wardrobe Follows.
                    </p>
                    <p style="font-size: 15px; line-height: 1.6; color: var(--text-secondary);">
                        Tell Me Who You Aspire to Be.
                    </p>
                </div>

                <div class="card mt-xl">
                    <div class="form-group">
                        <label class="form-label">Your Name</label>
                        <input type="text" id="userName" class="form-input" placeholder="Enter your name" />
                    </div>
                    
                    <button id="continueBtn" class="btn btn-primary btn-full">
                        Begin Journey
                    </button>
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
                Storage.createUser(name);
                this.navigate('identity-create');
            } else {
                alert('Please enter your name');
            }
        });
    },

    // ASPIRATION PAGE (NEW ONBOARDING STEP 2)
    renderIdentityCreate() {
        const selectedStyles = this.selectedStyles || [];
        const selectedColors = this.selectedColors || [];
        const keywords = this.aspirationKeywords || [];
        
        return `
            <div class="fade-in">
                <button class="btn btn-ghost mb-md" onclick="App.navigate('onboarding')" style="padding: 8px;">
                    ← Back
                </button>
                
                <h2 class="mb-md">Define Your Aspiration</h2>
                <p class="mb-xl">How do you want to dress? Select the styles, colors, and keywords that resonate with you</p>

                <!-- Style Selection -->
                <h4 class="mb-md">Select Your Style</h4>
                <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px;">
                    <div class="style-card ${selectedStyles.includes('minimalist') ? 'selected' : ''}" data-style="minimalist">
                        <div class="style-card-image">
                            <img src="images/minimalist.jpg" alt="Minimalist" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div class="style-card-label">Minimalist</div>
                    </div>
                    <div class="style-card ${selectedStyles.includes('artsy') ? 'selected' : ''}" data-style="artsy">
                        <div class="style-card-image">
                            <img src="images/artsy.jpeg" alt="Artsy" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div class="style-card-label">Artsy</div>
                    </div>
                    <div class="style-card ${selectedStyles.includes('casual') ? 'selected' : ''}" data-style="casual">
                        <div class="style-card-image">
                            <img src="images/casual.jpeg" alt="Casual" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div class="style-card-label">Casual</div>
                    </div>
                </div>

                <!-- Color Selection -->
                <h4 class="mb-md">Select Your Colors</h4>
                <div class="card mb-md" style="background: var(--bg-secondary);">
                    <div style="display: flex; gap: 12px; margin-bottom: 16px;">
                        <div style="flex: 1;">
                            <label style="font-size: 12px; color: var(--text-tertiary); display: block; margin-bottom: 8px;">Pick Color</label>
                            <input type="color" id="colorPicker" value="#000000" 
                                   style="width: 100%; height: 50px; border: 2px solid rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer; background: var(--bg-tertiary);" />
                        </div>
                        <div style="flex: 1;">
                            <label style="font-size: 12px; color: var(--text-tertiary); display: block; margin-bottom: 8px;">Opacity</label>
                            <input type="range" id="colorOpacity" min="0" max="100" value="100" 
                                   style="width: 100%; height: 50px; cursor: pointer;" />
                            <div style="text-align: center; font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
                                <span id="opacityValue">100</span>%
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding: 12px; background: var(--bg-tertiary); border-radius: 8px;">
                        <div id="colorPreview" style="width: 50px; height: 50px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.1);"></div>
                        <div style="flex: 1;">
                            <div style="font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Preview</div>
                            <div id="colorValue" style="font-family: monospace; font-size: 13px; color: var(--text-primary);">rgba(0, 0, 0, 1)</div>
                        </div>
                    </div>
                    
                    <button id="addColorBtn" class="btn btn-secondary btn-full">+ Add This Color</button>
                </div>
                
                <div id="selectedColorsContainer" class="mb-xl" style="display: ${selectedColors.length > 0 ? 'block' : 'none'};">
                    <label style="font-size: 12px; color: var(--text-tertiary); display: block; margin-bottom: 8px;">Selected Colors</label>
                    <div id="selectedColorsList" style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${selectedColors.map((color, index) => `
                            <div class="selected-color-chip" data-index="${index}" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--bg-tertiary); border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
                                <div style="width: 24px; height: 24px; border-radius: 50%; background: ${color}; border: 2px solid rgba(255,255,255,0.2);"></div>
                                <span style="font-size: 12px; font-family: monospace; color: var(--text-secondary);">${color}</span>
                                <button class="remove-color-btn" data-index="${index}" style="background: none; border: none; color: var(--text-tertiary); cursor: pointer; font-size: 16px; line-height: 1; padding: 0 4px;">×</button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Description -->
                <h4 class="mb-md">Describe Your Aspiration</h4>
                <div class="form-group mb-md">
                    <textarea id="aspirationDescription" class="form-input" rows="3" 
                              placeholder="e.g., I want to dress more professionally while staying comfortable for everyday work"
                              style="resize: vertical; min-height: 80px;">${this.aspirationDescription || ''}</textarea>
                    <p style="font-size: 12px; color: var(--text-tertiary); margin-top: 8px;">
                        Describe how you want to dress and present yourself
                    </p>
                </div>

                <!-- Keywords -->
                <h4 class="mb-md">Add Style Keywords (Optional)</h4>
                <div class="keyword-input-container mb-md">
                    <input type="text" id="keywordInput" class="form-input" 
                           placeholder="Type keywords and press Enter (e.g., professional, comfortable)" />
                    <p style="font-size: 12px; color: var(--text-tertiary); margin-top: 8px;">
                        Press Enter to add each keyword
                    </p>
                </div>
                
                <div id="keywordChips" class="chip-group mb-xl">
                    ${keywords.map(keyword => `
                        <span class="chip active" data-keyword="${keyword}">
                            ${keyword}
                            <span class="chip-remove">×</span>
                        </span>
                    `).join('')}
                </div>

                <button id="continueAspirationBtn" class="btn btn-primary btn-full">
                    Continue
                </button>
            </div>
        `;
    },

    initIdentityCreate() {
        // Initialize selections
        this.selectedStyles = this.selectedStyles || [];
        this.selectedColors = this.selectedColors || [];
        this.aspirationKeywords = this.aspirationKeywords || [];
        
        // Restore previous color picker state or use defaults
        this.currentColorPicker = this.currentColorPicker || { hex: '#000000', opacity: 100 };
        
        // Style card selection
        const styleCards = document.querySelectorAll('.style-card');
        styleCards.forEach(card => {
            card.addEventListener('click', () => {
                const style = card.dataset.style;
                const index = this.selectedStyles.indexOf(style);
                
                if (index > -1) {
                    this.selectedStyles.splice(index, 1);
                    card.classList.remove('selected');
                } else {
                    this.selectedStyles.push(style);
                    card.classList.add('selected');
                }
            });
        });
        
        // Color picker functionality
        const colorPicker = document.getElementById('colorPicker');
        const colorOpacity = document.getElementById('colorOpacity');
        const opacityValue = document.getElementById('opacityValue');
        const colorPreview = document.getElementById('colorPreview');
        const colorValue = document.getElementById('colorValue');
        const addColorBtn = document.getElementById('addColorBtn');
        const selectedColorsContainer = document.getElementById('selectedColorsContainer');
        
        // Set initial values from stored state
        colorPicker.value = this.currentColorPicker.hex;
        colorOpacity.value = this.currentColorPicker.opacity;
        opacityValue.textContent = this.currentColorPicker.opacity;
        
        const updateColorPreview = () => {
            const hex = colorPicker.value;
            const opacity = colorOpacity.value / 100;
            
            // Save current state
            this.currentColorPicker = { hex, opacity: colorOpacity.value };
            
            // Convert hex to RGB
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            
            const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            colorPreview.style.backgroundColor = rgba;
            colorValue.textContent = rgba;
        };
        
        // Initial preview update
        updateColorPreview();
        
        colorPicker.addEventListener('input', updateColorPreview);
        colorOpacity.addEventListener('input', () => {
            opacityValue.textContent = colorOpacity.value;
            updateColorPreview();
        });
        
        addColorBtn.addEventListener('click', () => {
            const hex = colorPicker.value;
            const opacity = colorOpacity.value / 100;
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            
            if (!this.selectedColors.includes(rgba)) {
                this.selectedColors.push(rgba);
                // Reset to transparent for next selection
                this.currentColorPicker = {
                    hex: '#000000',
                    opacity: 100
                };
                this.render(); // Re-render to show new color
            }
        });
        
        // Color removal
        document.querySelectorAll('.remove-color-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                this.selectedColors.splice(index, 1);
                this.render();
            });
        });
        
        // Keyword input
        const keywordInput = document.getElementById('keywordInput');
        
        keywordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const keyword = keywordInput.value.trim().toLowerCase();
                if (keyword && !this.aspirationKeywords.includes(keyword)) {
                    this.aspirationKeywords.push(keyword);
                    keywordInput.value = '';
                    this.render(); // Re-render to show new chip
                }
            }
        });
        
        // Keyword chip removal
        document.querySelectorAll('.chip-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const keyword = e.target.parentElement.dataset.keyword;
                this.aspirationKeywords = this.aspirationKeywords.filter(k => k !== keyword);
                this.render();
            });
        });
        
        // Continue button - triggers AI analysis or saves directly if coming back from preview
        const continueBtn = document.getElementById('continueAspirationBtn');
        continueBtn.addEventListener('click', async () => {
            const description = document.getElementById('aspirationDescription').value.trim();
            
            if (this.selectedStyles.length === 0 && this.selectedColors.length === 0 && this.aspirationKeywords.length === 0 && !description) {
                alert('Please add a description or select at least one style, color, or keyword');
                return;
            }
            
            // Check if we should skip AI (user came back from preview)
            if (this.skipOnboardingAI) {
                // Save directly without AI analysis
                const name = this.generateAspirationName(this.selectedStyles, this.aspirationKeywords);
                Storage.addAspiration({
                    name: name,
                    description: description,
                    styles: this.selectedStyles,
                    colors: this.selectedColors,
                    keywords: this.aspirationKeywords
                });
                
                this.skipOnboardingAI = false;
                this.navigate('tell-me-about-you');
                return;
            }
            
            // Show loading and call AI
            const loading = ClaudeAI.showLoading('✨ AI is analyzing your aspiration...');
            
            try {
                const aiAnalysis = await ClaudeAI.analyzeAspiration(
                    description,
                    this.selectedStyles,
                    this.selectedColors,
                    this.aspirationKeywords
                );
                
                ClaudeAI.hideLoading(loading);
                
                // Store description and AI analysis for onboarding
                this.aspirationDescription = description;
                this.onboardingAspirationAnalysis = aiAnalysis;
                this.showOnboardingAspirationPreview();
                
            } catch (error) {
                ClaudeAI.hideLoading(loading);
                alert('Error analyzing aspiration: ' + error.message);
            }
        });
    },

    // Show onboarding aspiration preview
    showOnboardingAspirationPreview() {
        const analysis = this.onboardingAspirationAnalysis;
        
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="fade-in">
                <h2 class="mb-md">✨ AI Analysis Complete</h2>
                <p class="mb-xl" style="color: var(--text-secondary);">
                    We've created your first aspiration profile
                </p>

                <div class="card mb-md" style="background: linear-gradient(135deg, rgba(229, 221, 213, 0.1) 0%, rgba(196, 181, 160, 0.05) 100%); border: 1px solid rgba(229, 221, 213, 0.2);">
                    <h4 class="mb-sm">Your Aspiration</h4>
                    <div style="font-size: 24px; font-weight: 600; margin-top: 8px; color: var(--accent-primary);">
                        "${analysis.name}"
                    </div>
                </div>

                <div class="card mb-md">
                    <h4 class="mb-sm">Style Insight</h4>
                    <p style="font-size: 15px; line-height: 1.6; color: var(--text-primary); font-style: italic;">
                        "${analysis.styleInsight}"
                    </p>
                </div>

                ${this.selectedColors.length > 0 ? `
                    <div class="card mb-md">
                        <h4 class="mb-sm">Color Harmony</h4>
                        <p style="font-size: 14px; color: var(--text-secondary);">
                            ${analysis.colorHarmony}
                        </p>
                    </div>
                ` : ''}

                <div class="card mb-md">
                    <h4 class="mb-sm">Enhanced Keywords</h4>
                    <div class="chip-group">
                        ${analysis.enhancedKeywords.map(k => {
                            const isOriginal = this.aspirationKeywords.includes(k.toLowerCase());
                            return `<span class="chip ${isOriginal ? '' : 'active'}" 
                                         style="${!isOriginal ? 'background: var(--gradient-accent); color: var(--bg-primary);' : ''}">
                                ${k}
                            </span>`;
                        }).join('')}
                    </div>
                </div>

                <div class="flex gap-md mt-xl">
                    <button class="btn btn-ghost" onclick="App.backToOnboardingEdit()" style="flex: 1;">
                        ← Edit Choices
                    </button>
                    <button class="btn btn-primary" onclick="App.confirmOnboardingAspiration()" style="flex: 2;">
                        Continue →
                    </button>
                </div>
            </div>
        `;
    },

    backToOnboardingEdit() {
        // Set flag to skip AI on next submit
        this.skipOnboardingAI = true;
        // Go back to identity-create form (description and selections are preserved)
        this.navigate('identity-create');
    },

    async confirmOnboardingAspiration() {
        const analysis = this.onboardingAspirationAnalysis;
        
        // Save aspiration with AI-enhanced data
        const created = Storage.addAspiration({
            name: analysis.name,
            styles: this.selectedStyles,
            colors: this.selectedColors,
            keywords: analysis.enhancedKeywords,
            styleInsight: analysis.styleInsight,
            colorHarmony: analysis.colorHarmony
        });
        
        // Analyze wardrobe items for this aspiration (if any exist)
        await this.analyzeWardrobeForAspiration(created.id);
        
        // Clean up temp data
        this.onboardingAspirationAnalysis = null;
        
        // Continue to next onboarding step
        this.navigate('tell-me-about-you');
    },

    generateAspirationName(styles, keywords) {
        // Generate a descriptive name based on user selections
        if (styles.length > 0) {
            return styles.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' & ');
        } else if (keywords && keywords.length > 0) {
            return keywords.slice(0, 2).map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(' ');
        }
        return 'My Style';
    },

    getColorHex(colorName) {
        // If it's already an rgba string, return it as-is
        if (typeof colorName === 'string' && colorName.startsWith('rgba(')) {
            return colorName;
        }
        
        // Otherwise, look up the hex color
        const colors = {
            'Black': '#000000',
            'White': '#FFFFFF',
            'Navy': '#001F3F',
            'Beige': '#F5F5DC',
            'Gray': '#808080',
            'Brown': '#8B4513',
            'Burgundy': '#800020',
            'Olive': '#808000',
            'Cream': '#FFFDD0'
        };
        return colors[colorName] || '#CCCCCC';
    },

    updatePreviewGrid() {
        const previewGrid = document.getElementById('previewGrid');
        previewGrid.innerHTML = this.selectedImages.map((img, index) => `
            <div class="preview-item">
                <img src="${img}" class="preview-image" />
                <div class="preview-remove" onclick="App.removeImage(${index})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
            </div>
        `).join('');
    },

    removeImage(index) {
        this.selectedImages.splice(index, 1);
        this.updatePreviewGrid();
    },

    // TELL ME ABOUT YOU PAGE (NEW ONBOARDING STEP 3)
    renderTellMeAboutYou() {
        return `
            <div class="fade-in">
                <button class="btn btn-ghost mb-md" onclick="App.backFromTellMeAboutYou()" style="padding: 8px;">
                    ← Back
                </button>
                
                <h2 class="mb-md">Tell Me About Yourself</h2>
                <p class="mb-xl">Upload photos of yourself to help us understand your current style</p>

                <div class="upload-area mb-lg" id="selfieUploadArea">
                    <div class="upload-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </div>
                    <div class="upload-text">Select Photos from Camera Roll</div>
                    <div class="upload-hint">AI will identify your clothing items</div>
                </div>

                <div id="selfiePreviewGrid" class="preview-grid"></div>

                <div id="detectedCurrentItems" style="display: none;">
                    <h3 class="mb-md mt-xl">Detected Items</h3>
                    <p class="mb-md" style="color: var(--text-secondary);">Confirm the items you're wearing</p>
                    <div id="detectedCurrentItemsList"></div>
                    <button id="confirmItemsBtn" class="btn btn-primary btn-full mt-lg">
                        Add to Wardrobe & Complete Setup
                    </button>
                </div>

                <button id="analyzePhotosBtn" class="btn btn-primary btn-full mt-lg" style="display: none;">
                    Analyze Photos
                </button>
            </div>
        `;
    },

    initTellMeAboutYou() {
        this.selectedImages = [];
        this.detectedItems = [];

        const uploadArea = document.getElementById('selfieUploadArea');
        const previewGrid = document.getElementById('selfiePreviewGrid');
        const analyzeBtn = document.getElementById('analyzePhotosBtn');

        uploadArea.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.multiple = true;
            input.onchange = (e) => {
                Array.from(e.target.files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.selectedImages.push(event.target.result);
                        this.updateSelfiePreviewGrid();
                        analyzeBtn.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                });
            };
            input.click();
        });

        analyzeBtn.addEventListener('click', async () => {
            if (this.selectedImages.length === 0) {
                alert('Please upload at least one photo');
                return;
            }

            try {
                await this.analyzeCurrentStyle();
            } catch (error) {
                alert('Error analyzing photos: ' + error.message);
            }
        });
    },

    updateSelfiePreviewGrid() {
        const preview = document.getElementById('selfiePreviewGrid');
        preview.innerHTML = this.selectedImages.map((img, index) => `
            <div class="preview-item">
                <img src="${img}" class="preview-image" />
                <div class="preview-remove" onclick="App.removeSelfieImage(${index})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
            </div>
        `).join('');
    },

    removeSelfieImage(index) {
        this.selectedImages.splice(index, 1);
        this.updateSelfiePreviewGrid();
        if (this.selectedImages.length === 0) {
            document.getElementById('analyzePhotosBtn').style.display = 'none';
        }
    },

    backFromTellMeAboutYou() {
        // Go back to identity-create page
        // The selections are preserved in the App object
        this.navigate('identity-create');
    },

    async analyzeCurrentStyle() {
        const loading = ClaudeAI.showLoading(`Analyzing your style...`);
        this.detectedItems = [];

        try {
            // Process each image
            for (let i = 0; i < this.selectedImages.length; i++) {
                const items = await ClaudeAI.detectMultipleItems(this.selectedImages[i]);
                const itemsWithSource = items.map(item => ({
                    ...item,
                    sourceImage: this.selectedImages[i]
                }));
                this.detectedItems.push(...itemsWithSource);
            }

            ClaudeAI.hideLoading(loading);
            this.showDetectedCurrentItems();
        } catch (error) {
            ClaudeAI.hideLoading(loading);
            throw error;
        }
    },

    showDetectedCurrentItems() {
        const detectedSection = document.getElementById('detectedCurrentItems');
        const itemsList = document.getElementById('detectedCurrentItemsList');

        itemsList.innerHTML = this.detectedItems.map((item, index) => `
            <div class="card mb-sm" style="display: flex; align-items: center; gap: 12px;">
                <input type="checkbox" checked class="current-item-checkbox" data-index="${index}" 
                       style="width: 20px; height: 20px;" />
                <div style="flex: 1;">
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="font-size: 12px; color: var(--text-tertiary);">
                        ${item.category} • ${item.color} • ${item.formality}
                    </div>
                </div>
            </div>
        `).join('');

        detectedSection.style.display = 'block';
        document.getElementById('analyzePhotosBtn').style.display = 'none';

        // Setup confirm button
        document.getElementById('confirmItemsBtn').onclick = () => this.completeOnboardingWithItems();
    },

    async completeOnboardingWithItems() {
        const checkboxes = document.querySelectorAll('.current-item-checkbox:checked');
        const selectedIndexes = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
        
        // Store unique images
        const imageMap = new Map();
        selectedIndexes.forEach(index => {
            const item = this.detectedItems[index];
            if (item.sourceImage && !imageMap.has(item.sourceImage)) {
                const imageId = Storage.addImage(item.sourceImage);
                if (imageId) imageMap.set(item.sourceImage, imageId);
            }
        });
        
        // Add items to wardrobe
        selectedIndexes.forEach(index => {
            const item = this.detectedItems[index];
            const imageId = imageMap.get(item.sourceImage);
            
            Storage.addWardrobeItem({
                name: item.name,
                category: item.category,
                color: item.color,
                formality: item.formality,
                style: item.style,
                season: item.season,
                imageId: imageId,
                source: 'onboarding',
                confirmed: true
            });
        });

        // Generate identity from aspiration data
        const aspiration = Storage.getAspiration();
        await IdentityEngine.createIdentity([], aspiration.keywords);
        
        // Complete onboarding
        Storage.completeOnboarding();
        
        alert(`Welcome! ${selectedIndexes.length} items added to your wardrobe.`);
        this.navigate('dashboard');
    },

    // DASHBOARD PAGE
    renderDashboard() {
        const identity = Storage.getIdentity();
        const alignment = Storage.getAlignment();
        const stats = Storage.getStats();
        const user = Storage.getUser();

        // Calculate actual values from storage for display
        const wardrobe = Storage.getWardrobeItems();
        const aspirations = Storage.getAspirations();
        const recentLogs = Storage.getRecentLogs(7);
        
        // Calculate wardrobe alignment details
        let wardrobeAlignedItems = 0;
        if (aspirations.length > 0 && wardrobe.length > 0) {
            aspirations.forEach(asp => {
                const matchingItems = Storage.getMatchingItems(asp.id, 0.5);
                wardrobeAlignedItems = Math.max(wardrobeAlignedItems, matchingItems.length);
            });
        }
        
        // Calculate behavior alignment details
        const behaviorAlignedDays = recentLogs.filter(log => {
            // A day is "aligned" if it has items worn
            return log.itemsWorn && log.itemsWorn.length > 0;
        }).length;

        if (!identity.archetype) {
            return `<div class="empty-state mt-xl">
                <h3>Define your identity first</h3>
                <button class="btn btn-primary mt-md" onclick="App.navigate('identity-create')">
                    Get Started
                </button>
            </div>`;
        }

        return `
            <div class="fade-in">
                <h2 class="mb-sm">Hello, ${user.name}</h2>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                    <p class="mb-0" style="color: var(--text-secondary); flex: 1;">
                        ${identity.archetype.name}
                    </p>
                    <button class="btn btn-ghost" onclick="App.editArchetype()" style="padding: 6px 8px; font-size: 12px;" title="Edit archetype">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                </div>

                <!-- Quick Actions - Streamlined -->
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;">
                    <button class="btn btn-secondary" onclick="App.navigate('wardrobe')"
                            style="padding: 20px; font-size: 15px; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                        <span style="font-size: 28px;">👗</span>
                        <span>Wardrobe</span>
                    </button>
                    <button class="btn btn-secondary" onclick="App.navigate('outfits')"
                            style="padding: 20px; font-size: 15px; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                        <span style="font-size: 28px;">✨</span>
                        <span>Outfits</span>
                    </button>
                </div>

                ${stats.wardrobeItems === 0 || stats.dailyLogs === 0 ? `
                    <!-- Empty State Guide -->
                    <div class="card mt-lg" style="background: linear-gradient(135deg, rgba(229, 221, 213, 0.1) 0%, rgba(196, 181, 160, 0.05) 100%); 
                                                   border: 1px solid rgba(229, 221, 213, 0.2); text-align: center; padding: 32px 24px;">
                        <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                        <h3 style="margin-bottom: 12px; color: var(--text-primary);">Ready to See Your Alignment Score?</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 24px; line-height: 1.6;">
                            ${stats.wardrobeItems === 0 && stats.dailyLogs === 0 
                                ? 'To view your alignment score and insights, complete these steps:'
                                : stats.wardrobeItems === 0 
                                    ? 'Add items to your wardrobe to calculate your alignment score'
                                    : 'Log your first outfit to see your alignment score'}
                        </p>
                        
                        ${stats.wardrobeItems === 0 && stats.dailyLogs === 0 ? `
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
                                <div style="background: var(--bg-secondary); padding: 20px; border-radius: 12px;">
                                    <div style="font-size: 36px; margin-bottom: 12px;">👗</div>
                                    <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--text-primary);">Step 1</div>
                                    <div style="font-size: 13px; color: var(--text-secondary);">Add wardrobe items</div>
                                </div>
                                <div style="background: var(--bg-secondary); padding: 20px; border-radius: 12px;">
                                    <div style="font-size: 36px; margin-bottom: 12px;">📷</div>
                                    <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--text-primary);">Step 2</div>
                                    <div style="font-size: 13px; color: var(--text-secondary);">Log an outfit</div>
                                </div>
                            </div>
                            <div style="display: flex; gap: 12px;">
                                <button class="btn btn-primary" onclick="App.navigate('add-wardrobe-item')" style="flex: 1;">
                                    Add Items
                                </button>
                                <button class="btn btn-secondary" onclick="App.navigate('daily-log')" style="flex: 1;">
                                    Log Outfit
                                </button>
                            </div>
                        ` : stats.wardrobeItems === 0 ? `
                            <button class="btn btn-primary" onclick="App.navigate('add-wardrobe-item')">
                                Add Your First Item
                            </button>
                        ` : `
                            <button class="btn btn-primary" onclick="App.navigate('daily-log')">
                                Log Your First Outfit
                            </button>
                        `}
                    </div>
                ` : ''}

                ${stats.wardrobeItems > 0 && stats.dailyLogs > 0 ? `
                    <!-- Elegant Score Display -->
                    <div style="text-align: center; margin-bottom: 32px;">
                        <div style="font-size: 72px; font-weight: 300; line-height: 1; margin-bottom: 8px; 
                                    background: var(--gradient-accent); -webkit-background-clip: text; 
                                    -webkit-text-fill-color: transparent; background-clip: text;">
                            ${alignment.overall}%
                        </div>
                        <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 2px; 
                                    color: var(--text-tertiary);">
                            Alignment Score
                        </div>
                    </div>

                    <!-- Three Circles -->
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px;">
                        <div style="text-align: center;">
                            <div style="width: 80px; height: 80px; margin: 0 auto 12px; position: relative;">
                                <svg width="80" height="80" style="transform: rotate(-90deg);">
                                    <circle cx="40" cy="40" r="35" fill="none" stroke="var(--bg-tertiary)" stroke-width="6"/>
                                    <circle cx="40" cy="40" r="35" fill="none" stroke="var(--accent-primary)" stroke-width="6"
                                            stroke-dasharray="${2 * Math.PI * 35}" 
                                            stroke-dashoffset="${2 * Math.PI * 35 * (1 - alignment.identity.score / 100)}"
                                            stroke-linecap="round"/>
                                </svg>
                                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                                            font-size: 20px; font-weight: 600;">
                                    ${alignment.identity.score}%
                                </div>
                            </div>
                            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; 
                                        color: var(--text-tertiary); display: flex; align-items: center; justify-content: center; gap: 4px;">
                                Identity
                                <span onclick="App.toggleScoreInfo('identity')" style="cursor: pointer; font-size: 14px; opacity: 0.6;">ⓘ</span>
                            </div>
                        </div>

                        <div style="text-align: center;">
                            <div style="width: 80px; height: 80px; margin: 0 auto 12px; position: relative;">
                                <svg width="80" height="80" style="transform: rotate(-90deg);">
                                    <circle cx="40" cy="40" r="35" fill="none" stroke="var(--bg-tertiary)" stroke-width="6"/>
                                    <circle cx="40" cy="40" r="35" fill="none" stroke="var(--accent-primary)" stroke-width="6"
                                            stroke-dasharray="${2 * Math.PI * 35}" 
                                            stroke-dashoffset="${2 * Math.PI * 35 * (1 - alignment.wardrobe.score / 100)}"
                                            stroke-linecap="round"/>
                                </svg>
                                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                                            font-size: 20px; font-weight: 600;">
                                    ${alignment.wardrobe.score}%
                                </div>
                            </div>
                            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; 
                                        color: var(--text-tertiary); display: flex; align-items: center; justify-content: center; gap: 4px;">
                                Wardrobe
                                <span onclick="App.toggleScoreInfo('wardrobe')" style="cursor: pointer; font-size: 14px; opacity: 0.6;">ⓘ</span>
                            </div>
                        </div>

                        <div style="text-align: center;">
                            <div style="width: 80px; height: 80px; margin: 0 auto 12px; position: relative;">
                                <svg width="80" height="80" style="transform: rotate(-90deg);">
                                    <circle cx="40" cy="40" r="35" fill="none" stroke="var(--bg-tertiary)" stroke-width="6"/>
                                    <circle cx="40" cy="40" r="35" fill="none" stroke="var(--accent-primary)" stroke-width="6"
                                            stroke-dasharray="${2 * Math.PI * 35}" 
                                            stroke-dashoffset="${2 * Math.PI * 35 * (1 - alignment.behavior.score / 100)}"
                                            stroke-linecap="round"/>
                                </svg>
                                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                                            font-size: 20px; font-weight: 600;">
                                    ${alignment.behavior.score}%
                                </div>
                            </div>
                            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; 
                                        color: var(--text-tertiary); display: flex; align-items: center; justify-content: center; gap: 4px;">
                                Behavior
                                <span onclick="App.toggleScoreInfo('behavior')" style="cursor: pointer; font-size: 14px; opacity: 0.6;">ⓘ</span>
                            </div>
                        </div>
                    </div>

                    <!-- Score Explanations (collapsible) -->
                    <div id="identityInfo" class="score-info" style="display: none;">
                        <div class="card" style="background: rgba(229, 221, 213, 0.05); border: 1px solid rgba(229, 221, 213, 0.2);">
                            <h4 style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                                <span>💭</span> Identity Score Breakdown
                            </h4>
                            <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.6;">
                                Measures how well-defined your style aspirations are. Based on the clarity and depth of your identity profile.
                            </p>
                            <div style="font-size: 13px; color: var(--text-primary); margin-bottom: 8px;">
                                <strong>Why ${alignment.identity.score}%?</strong>
                            </div>
                            <ul style="font-size: 13px; color: var(--text-secondary); margin: 0; padding-left: 20px; line-height: 1.8;">
                                <li>You have <strong>${Storage.getAspirations().length} ${Storage.getAspirations().length === 1 ? 'aspiration' : 'aspirations'}</strong> defined</li>
                                <li>Your archetype: <strong>${Storage.getIdentity().archetype?.name || 'Not set'}</strong></li>
                                <li>Total keywords across aspirations: <strong>${Storage.getAspirations().reduce((sum, a) => sum + (a.keywords?.length || 0), 0)}</strong></li>
                            </ul>
                            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
                                <div style="font-size: 12px; color: var(--text-tertiary); margin-bottom: 8px;">💡 HOW TO IMPROVE</div>
                                <p style="font-size: 13px; color: var(--text-secondary); margin: 0;">
                                    ${alignment.identity.score < 80 ? 'Add more aspirations or refine existing ones with specific keywords and colors' : 'Your identity is well-defined! Keep refining as your style evolves'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div id="wardrobeInfo" class="score-info" style="display: none;">
                        <div class="card" style="background: rgba(229, 221, 213, 0.05); border: 1px solid rgba(229, 221, 213, 0.2);">
                            <h4 style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                                <span>👗</span> Wardrobe Score Breakdown
                            </h4>
                            <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.6;">
                                Measures what percentage of your wardrobe aligns with your aspirations.
                            </p>
                            <div style="font-size: 13px; color: var(--text-primary); margin-bottom: 8px;">
                                <strong>Why ${alignment.wardrobe.score}%?</strong>
                            </div>
                            <ul style="font-size: 13px; color: var(--text-secondary); margin: 0; padding-left: 20px; line-height: 1.8;">
                                <li><strong>${wardrobeAlignedItems} out of ${wardrobe.length} items</strong> match your aspirations ${wardrobe.length > 0 ? `(${Math.round((wardrobeAlignedItems/wardrobe.length)*100)}%)` : ''}</li>
                                <li>Match threshold: Items scoring 50%+ with any aspiration</li>
                                <li>${wardrobe.length - wardrobeAlignedItems} items don't strongly align with your current aspirations</li>
                            </ul>
                            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
                                <div style="font-size: 12px; color: var(--text-tertiary); margin-bottom: 8px;">💡 HOW TO IMPROVE</div>
                                <p style="font-size: 13px; color: var(--text-secondary); margin: 0;">
                                    ${alignment.wardrobe.score < 60 ? 'Add items that match your aspirations, or consider donating items that no longer serve your style goals' : alignment.wardrobe.score < 80 ? 'Good progress! Continue curating with intention' : 'Excellent wardrobe alignment! Maintain by only adding items that serve your aspirations'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div id="behaviorInfo" class="score-info" style="display: none;">
                        <div class="card" style="background: rgba(229, 221, 213, 0.05); border: 1px solid rgba(229, 221, 213, 0.2);">
                            <h4 style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                                <span>📊</span> Behavior Score Breakdown
                            </h4>
                            <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.6;">
                                Measures how consistently you wear aligned items. Based on your daily outfit logs.
                            </p>
                            <div style="font-size: 13px; color: var(--text-primary); margin-bottom: 8px;">
                                <strong>Why ${alignment.behavior.score}%?</strong>
                            </div>
                            <ul style="font-size: 13px; color: var(--text-secondary); margin: 0; padding-left: 20px; line-height: 1.8;">
                                <li>You've logged <strong>${recentLogs.length} ${recentLogs.length === 1 ? 'outfit' : 'outfits'}</strong> in the past week</li>
                                <li><strong>${behaviorAlignedDays} ${behaviorAlignedDays === 1 ? 'day' : 'days'}</strong> wore mostly aligned items</li>
                                <li>Consistency rate: <strong>${recentLogs.length > 0 ? Math.round((behaviorAlignedDays/recentLogs.length)*100) : 0}%</strong></li>
                            </ul>
                            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
                                <div style="font-size: 12px; color: var(--text-tertiary); margin-bottom: 8px;">💡 HOW TO IMPROVE</div>
                                <p style="font-size: 13px; color: var(--text-secondary); margin: 0;">
                                    ${alignment.behavior.score < 60 ? 'Log your outfits daily and intentionally choose aligned items more often' : alignment.behavior.score < 80 ? 'Great consistency! Keep logging to maintain momentum' : 'Excellent! You\'re living your aspirations consistently'}
                                </p>
                            </div>
                        </div>
                    </div>

                    ${alignment.behavior.insights.length > 0 ? `
                        <div class="card" style="background: linear-gradient(135deg, rgba(229, 221, 213, 0.1) 0%, rgba(196, 181, 160, 0.05) 100%);
                                               border: 1px solid rgba(229, 221, 213, 0.2);">
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                                <div style="font-size: 20px;">💡</div>
                                <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; 
                                            color: var(--accent-primary); font-weight: 600;">
                                    Today's Insight
                                </div>
                            </div>
                            <p style="font-size: 15px; line-height: 1.6; color: var(--text-primary);">
                                ${alignment.behavior.insights[0]}
                            </p>
                        </div>
                    ` : ''}
                ` : ''}

                <!-- Get Recommendations Button and Display Area -->
                <button class="btn btn-secondary btn-full mt-xl" onclick="App.getRecommendations()" id="getRecsBtn">
                    Get Recommendations
                </button>

                <!-- Recommendations Display Area (Initially Hidden) -->
                <div id="recommendationsContainer" style="display: none;" class="mt-lg"></div>

                <!-- Refresh Alignment Button -->
                <button class="btn btn-secondary btn-full mt-lg" onclick="App.recalculateAlignment()">
                    🔄 Refresh Alignment
                </button>
            </div>
        `;
    },

    initDashboard() {
        // Dashboard loaded
    },

    // Render Aspiration Alignment Map
    renderAspirationAlignmentMap(alignment) {
        const aspirations = Storage.getAspirations();
        const perAspirationData = alignment.perAspiration || {};
        
        if (aspirations.length === 0) {
            return '';
        }

        // Get actual data from storage for accurate display
        const wardrobe = Storage.getWardrobeItems();
        const allLogs = Storage.getDailyLogs();
        const recentLogs = Storage.getRecentLogs(7);

        return `
            <div class="mt-xl">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; gap: 16px;">
                    <h3 style="margin: 0;">Identity Alignment Map</h3>
                    <span style="font-size: 12px; color: var(--text-tertiary); white-space: nowrap;">${aspirations.length} ${aspirations.length === 1 ? 'Aspiration' : 'Aspirations'}</span>
                </div>
                
                ${aspirations.map(asp => {
                    // Calculate real data directly from storage
                    const matchingItems = Storage.getMatchingItems(asp.id, 0.5);
                    const totalItems = wardrobe.length;
                    
                    // Calculate recent wears for this aspiration
                    let recentWears = 0;
                    recentLogs.forEach(log => {
                        if (log.aspirationId === asp.id || (!log.aspirationId && log.itemsWorn)) {
                            // Count if log was for this aspiration or if items worn match this aspiration
                            if (log.itemsWorn && log.itemsWorn.length > 0) {
                                const wornMatchingItems = log.itemsWorn.filter(itemId => {
                                    return matchingItems.some(mi => mi.id === itemId);
                                });
                                if (wornMatchingItems.length > 0) {
                                    recentWears++;
                                }
                            }
                        }
                    });
                    
                    // Calculate overall score
                    const wardrobeScore = totalItems > 0 ? Math.round((matchingItems.length / totalItems) * 100) : 0;
                    const behaviorScore = recentLogs.length > 0 ? Math.round((recentWears / recentLogs.length) * 100) : 0;
                    const overall = Math.round((wardrobeScore + behaviorScore) / 2);
                    
                    // Use stored data if available, otherwise use calculated
                    const aspData = perAspirationData[asp.id] || {
                        overall: overall,
                        wardrobe: { score: wardrobeScore, matchingItems: matchingItems.length, totalItems: totalItems },
                        behavior: { score: behaviorScore, recentWears: recentWears }
                    };
                    
                    // Override with real data for items count (always use current data)
                    aspData.wardrobe.matchingItems = matchingItems.length;
                    aspData.wardrobe.totalItems = totalItems;
                    aspData.behavior.recentWears = recentWears;
                    
                    return `
                        <div class="card mb-md" onclick="App.navigateToAspiration('${asp.id}')" 
                             style="cursor: pointer; transition: all 0.2s; border-left: 4px solid ${this.getAspirationColor(aspData.overall)};">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <h4 style="margin: 0; font-size: 16px;">${asp.name}</h4>
                                <div style="font-size: 20px; font-weight: 600; color: ${this.getAspirationColor(aspData.overall)};">
                                    ${aspData.overall}%
                                </div>
                            </div>
                            
                            <!-- Progress Bar -->
                            <div style="width: 100%; height: 8px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden; margin-bottom: 12px;">
                                <div style="width: ${aspData.overall}%; height: 100%; background: ${this.getAspirationColor(aspData.overall)}; transition: width 0.3s ease;"></div>
                            </div>
                            
                            <!-- Stats Row -->
                            <div style="display: flex; gap: 24px; font-size: 12px; color: var(--text-secondary);">
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <span>👗</span>
                                    <span>${aspData.wardrobe.matchingItems}/${aspData.wardrobe.totalItems} items match</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <span>📅</span>
                                    <span>Worn ${aspData.behavior.recentWears}× this week</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
                
                <button class="btn btn-secondary btn-full mt-sm" onclick="App.navigate('identity')">
                    View All Aspirations →
                </button>
            </div>
        `;
    },

    // Toggle score info visibility
    toggleScoreInfo(type) {
        const infoDiv = document.getElementById(`${type}Info`);
        const allInfoDivs = document.querySelectorAll('.score-info');
        
        // Hide all other info divs
        allInfoDivs.forEach(div => {
            if (div.id !== `${type}Info`) {
                div.style.display = 'none';
            }
        });
        
        // Toggle this one
        if (infoDiv.style.display === 'none' || !infoDiv.style.display) {
            infoDiv.style.display = 'block';
            // Smooth scroll to the info
            setTimeout(() => {
                infoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        } else {
            infoDiv.style.display = 'none';
        }
    },

    // Get color based on alignment score
    getAspirationColor(score) {
        if (score >= 70) return '#4CAF50'; // Green
        if (score >= 40) return '#8BC34A'; // Light Green
        return '#FFC107'; // Amber (no red - warmer, less harsh)
    },

    renderSparkline(history) {
        if (history.length === 0) return '';
        const max = Math.max(...history.map(h => h.overall));
        return history.slice(-8).map(h => {
            const height = (h.overall / max) * 100;
            return `<div class="sparkline-bar" style="height: ${height}%"></div>`;
        }).join('');
    },

    async recalculateAlignment() {
        try {
            await AlignmentScorer.calculateAlignment();
            this.render();
        } catch (error) {
            alert('Error calculating alignment: ' + error.message);
        }
    },

    // IDENTITY VIEW PAGE - Show Aspiration Cards
    renderIdentityView() {
        const aspirations = Storage.getAspirations();
        
        return `
            <div class="fade-in">
                <h2 class="mb-md">Your Aspirations</h2>
                <p class="mb-xl" style="color: var(--text-secondary);">
                    Manage your style identities and see matching wardrobe items
                </p>

                ${aspirations.length > 0 ? aspirations.map((asp, index) => `
                    <div class="card mb-md aspiration-card" onclick="App.navigateToAspiration('${asp.id}')" 
                         style="cursor: pointer; transition: transform 0.2s; border-left: 4px solid var(--accent-primary);">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                            <h3 style="margin: 0;">${asp.name}</h3>
                            <div style="display: flex; gap: 8px;">
                                <button class="btn btn-ghost" onclick="event.stopPropagation(); App.editAspiration('${asp.id}')"
                                        style="padding: 8px;" title="Edit aspiration">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <button class="btn btn-ghost" onclick="event.stopPropagation(); App.deleteAspirationConfirm('${asp.id}')"
                                        style="padding: 8px; color: var(--text-tertiary);" title="Delete aspiration">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        ${asp.styles && asp.styles.length > 0 ? `
                            <div style="margin-bottom: 8px;">
                                <span style="font-size: 12px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px;">Styles:</span>
                                ${asp.styles.map(s => `<span class="chip" style="margin: 4px;">${s}</span>`).join('')}
                            </div>
                        ` : ''}
                        
                        ${asp.colors && asp.colors.length > 0 ? `
                            <div style="margin-bottom: 8px;">
                                <span style="font-size: 12px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px;">Colors:</span>
                                <div style="display: flex; gap: 6px; margin-top: 4px;">
                                    ${asp.colors.slice(0, 6).map(color => `
                                        <div style="width: 24px; height: 24px; border-radius: 50%; background: ${this.getColorHex(color)}; 
                                                    border: 2px solid var(--bg-secondary);"></div>
                                    `).join('')}
                                    ${asp.colors.length > 6 ? `<span style="font-size: 12px; color: var(--text-tertiary); align-self: center;">+${asp.colors.length - 6}</span>` : ''}
                                </div>
                            </div>
                        ` : ''}
                        
                        ${asp.keywords && asp.keywords.length > 0 ? `
                            <div style="margin-bottom: 8px;">
                                <span style="font-size: 12px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px;">Keywords:</span>
                                <div class="chip-group" style="margin-top: 4px;">
                                    ${asp.keywords.map(k => `<span class="chip">${k}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--bg-secondary);">
                            <span style="font-size: 13px; color: var(--text-secondary);">
                                ${Storage.getMatchingItems(asp.id).length} matching items
                            </span>
                            <span style="font-size: 13px; color: var(--accent-primary);">View Details →</span>
                        </div>
                    </div>
                `).join('') : `
                    <div class="empty-state">
                        <h3>No Aspirations Yet</h3>
                        <p class="text-muted">Define who you aspire to become</p>
                    </div>
                `}

                <button class="btn btn-primary btn-full mt-lg" onclick="App.navigate('add-aspiration')">
                    + Add New Aspiration
                </button>
            </div>
        `;
    },

    initIdentityView() {
        // Identity view loaded
    },

    navigateToAspiration(aspirationId) {
        this.currentAspirationId = aspirationId;
        this.navigate('aspiration-detail');
    },

    editAspiration(aspirationId) {
        this.currentAspirationId = aspirationId;
        this.navigate('edit-aspiration');
    },

    showOutfitGenerationDialog() {
        const aspirations = Storage.getAspirations();
        const wardrobe = Storage.getWardrobeItems();
        
        if (wardrobe.length < 3) {
            alert('Add at least 3 items to your wardrobe to generate outfits');
            return;
        }
        
        // Create dialog overlay
        const dialog = document.createElement('div');
        dialog.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px;';
        
        dialog.innerHTML = `
            <div class="card" style="max-width: 400px; width: 100%; max-height: 80vh; overflow-y: auto;">
                <h3 class="mb-md">Generate Outfit</h3>
                <p class="mb-lg" style="color: var(--text-secondary); font-size: 14px;">
                    Select an aspiration to generate an outfit for, or choose "All Aspirations" for a general outfit.
                </p>
                
                <div class="form-group">
                    <label class="form-label">Select Aspiration</label>
                    <select id="dialogAspirationSelector" class="form-input">
                        <option value="">All Aspirations</option>
                        ${aspirations.map(asp => `
                            <option value="${asp.id}">${asp.name}</option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="flex gap-md mt-lg">
                    <button class="btn btn-ghost" onclick="this.closest('div[style*=fixed]').remove()" style="flex: 1;">
                        Cancel
                    </button>
                    <button class="btn btn-primary" id="generateOutfitBtn" style="flex: 1;">
                        Generate
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Setup generate button
        document.getElementById('generateOutfitBtn').onclick = async () => {
            const selector = document.getElementById('dialogAspirationSelector');
            const aspirationId = selector.value || null;
            dialog.remove();
            await this.generateOutfitWithAspiration(aspirationId);
        };
        
        // Close on background click
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
    },
    
    async generateOutfitWithAspiration(aspirationId) {
        try {
            await OutfitGenerator.generateOutfit('everyday', aspirationId);
            // Navigate to outfits page to show the new outfit
            this.navigate('outfits');
        } catch (error) {
            alert(error.message);
        }
    },
    
    async generateOutfit() {
        // Legacy function - redirect to dialog
        this.showOutfitGenerationDialog();
    },

    // DAILY LOG PAGE
    renderDailyLog() {
        const wardrobe = Storage.getWardrobeItems();
        const aspirations = Storage.getAspirations();

        return `
            <div class="fade-in">
                <h2 class="mb-md">Today's Outfit</h2>
                <p class="mb-xl">Log what you're wearing to track alignment</p>

                ${aspirations.length > 0 ? `
                    <div class="form-group mb-lg">
                        <label class="form-label">Which aspiration are you aiming for today?</label>
                        <select id="aspirationSelector" class="form-input">
                            <option value="">General / All Aspirations</option>
                            ${aspirations.map(asp => `
                                <option value="${asp.id}">${asp.name}</option>
                            `).join('')}
                        </select>
                        <p style="font-size: 12px; color: var(--text-secondary); margin-top: 8px;">
                            Optional - helps track progress toward specific style goals
                        </p>
                    </div>
                ` : ''}

                <div class="upload-area mb-lg" id="selfieArea">
                    <div class="upload-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </div>
                    <div class="upload-text">Take a selfie</div>
                    <div class="upload-hint">Optional but recommended</div>
                </div>

                <div id="selfiePreview"></div>

                <!-- Detect Items Button -->
                <button id="detectOutfitBtn" class="btn btn-secondary btn-full mt-md" style="display: none;">
                    🔍 Detect Items in Photo
                </button>

                <!-- Detected Items Section -->
                <div id="detectedOutfitItems" style="display: none; margin-top: 24px;">
                    <h4 class="mb-md">Detected Items</h4>
                    <p class="mb-sm" style="color: var(--text-secondary); font-size: 13px;">
                        Add these to your wardrobe and include in today's log
                    </p>
                    <div id="detectedOutfitItemsList"></div>
                </div>

                <h4 class="mb-md mt-lg">Select from Existing Wardrobe</h4>
                <p class="mb-sm" style="color: var(--text-secondary); font-size: 13px;">
                    Optional - select items you're wearing that are already in your wardrobe
                </p>
                
                ${wardrobe.length > 0 ? `
                    <div style="max-height: 300px; overflow-y: auto;">
                        ${wardrobe.map(item => `
                            <label class="card mb-sm" style="cursor: pointer; display: flex; align-items: center; gap: 12px;">
                                <input type="checkbox" value="${item.id}" class="wardrobe-checkbox" 
                                       style="width: 20px; height: 20px;" />
                                <div style="flex: 1;">
                                    <div style="font-weight: 600;">${item.name}</div>
                                    <div style="font-size: 12px; color: var(--text-tertiary);">
                                        ${item.category} • ${item.color}
                                    </div>
                                </div>
                            </label>
                        `).join('')}
                    </div>
                ` : `
                    <div class="card" style="text-align: center; padding: 16px; background: var(--bg-secondary);">
                        <p style="font-size: 13px; color: var(--text-secondary);">No wardrobe items yet</p>
                    </div>
                `}
                
                <button id="logBtn" class="btn btn-primary btn-full mt-xl">
                    Save Log
                </button>
            </div>
        `;
    },

    initDailyLog() {
        // Initialize or preserve selfie data
        if (!this.dailyLogSelfieData) {
            this.dailyLogSelfieData = null;
        }
        
        this.dailyLogDetectedItems = this.dailyLogDetectedItems || [];
        this.dailyLogNewItemIds = this.dailyLogNewItemIds || [];

        const selfieArea = document.getElementById('selfieArea');
        const selfiePreview = document.getElementById('selfiePreview');
        const detectBtn = document.getElementById('detectOutfitBtn');
        const logBtn = document.getElementById('logBtn');

        // Restore selfie preview if it exists
        if (this.dailyLogSelfieData && selfiePreview) {
            selfiePreview.innerHTML = `
                <img src="${this.dailyLogSelfieData}" style="width: 100%; border-radius: 16px; margin-top: 16px;" />
            `;
            if (detectBtn) {
                detectBtn.style.display = 'block';
            }
        }

        if (selfieArea) {
            selfieArea.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.capture = 'user';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.dailyLogSelfieData = event.target.result;
                        selfiePreview.innerHTML = `
                            <img src="${this.dailyLogSelfieData}" style="width: 100%; border-radius: 16px; margin-top: 16px;" />
                        `;
                        // Show detect button when photo is uploaded
                        if (detectBtn) {
                            detectBtn.style.display = 'block';
                        }
                    };
                    reader.readAsDataURL(file);
                };
                input.click();
            });
        }

        // Detect items in photo
        if (detectBtn) {
            detectBtn.addEventListener('click', async () => {
                if (!this.dailyLogSelfieData) {
                    alert('Please upload a photo first');
                    return;
                }

                try {
                    await this.detectOutfitItems(this.dailyLogSelfieData);
                } catch (error) {
                    alert('Error detecting items: ' + error.message);
                }
            });
        }

        if (logBtn) {
            logBtn.addEventListener('click', async () => {
                const checkboxes = document.querySelectorAll('.wardrobe-checkbox:checked');
                const existingItemIds = Array.from(checkboxes).map(cb => cb.value);

                // Combine existing wardrobe items with newly added items
                const allItemIds = [...existingItemIds, ...this.dailyLogNewItemIds];

                // Allow logging with no items selected (flexible logging)
                if (allItemIds.length === 0 && !this.dailyLogSelfieData) {
                    alert('Please upload a photo or select at least one item');
                    return;
                }

                // Get selected aspiration (if any)
                const aspirationSelector = document.getElementById('aspirationSelector');
                const aspirationId = aspirationSelector ? aspirationSelector.value || null : null;

                try {
                    await BehaviorTracker.addLog(this.dailyLogSelfieData, allItemIds, aspirationId);
                    await AlignmentScorer.calculateAlignment();
                    
                    // Clean up
                    this.dailyLogSelfieData = null;
                    this.dailyLogDetectedItems = [];
                    this.dailyLogNewItemIds = [];
                    
                    this.navigate('dashboard');
                } catch (error) {
                    alert('Error saving log: ' + error.message);
                }
            });
        }
    },

    async detectOutfitItems(imageData) {
        const loading = ClaudeAI.showLoading('🔍 Detecting items in your photo...');
        this.dailyLogDetectedItems = [];

        try {
            const items = await ClaudeAI.detectMultipleItems(imageData);
            const itemsWithSource = items.map(item => ({
                ...item,
                sourceImage: imageData
            }));
            this.dailyLogDetectedItems = itemsWithSource;

            ClaudeAI.hideLoading(loading);
            this.showDailyLogDetectedItems();
        } catch (error) {
            ClaudeAI.hideLoading(loading);
            throw error;
        }
    },

    showDailyLogDetectedItems() {
        const detectedSection = document.getElementById('detectedOutfitItems');
        const itemsList = document.getElementById('detectedOutfitItemsList');

        if (!detectedSection || !itemsList) return;

        itemsList.innerHTML = this.dailyLogDetectedItems.map((item, index) => `
            <div class="card mb-sm" style="display: flex; align-items: center; gap: 12px;">
                <input type="checkbox" checked class="detected-item-checkbox" data-index="${index}" 
                       style="width: 20px; height: 20px;" />
                <div style="flex: 1;">
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="font-size: 12px; color: var(--text-tertiary);">
                        ${item.category} • ${item.color} • ${item.formality}
                    </div>
                </div>
            </div>
        `).join('');

        // Add button to add selected items to wardrobe
        itemsList.innerHTML += `
            <button id="addDetectedToWardrobe" class="btn btn-secondary btn-full mt-md">
                Add Selected Items to Wardrobe
            </button>
        `;

        detectedSection.style.display = 'block';

        // Setup add to wardrobe button
        document.getElementById('addDetectedToWardrobe').onclick = () => this.addDetectedItemsToWardrobe();
    },

    addDetectedItemsToWardrobe() {
        const checkboxes = document.querySelectorAll('.detected-item-checkbox:checked');
        const selectedIndexes = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
        
        if (selectedIndexes.length === 0) {
            alert('Please select at least one item to add');
            return;
        }

        let successCount = 0;
        let failCount = 0;
        const newItemIds = [];

        // Store unique image (same for all detected items from this selfie)
        const imageData = this.dailyLogDetectedItems[0]?.sourceImage;
        console.log('📸 Storing image for detected items...', imageData ? 'Image data present' : 'No image data');
        
        const imageId = imageData ? Storage.addImage(imageData) : null;
        console.log('📸 Image stored with ID:', imageId);

        // Add selected items to wardrobe
        selectedIndexes.forEach(index => {
            const item = this.dailyLogDetectedItems[index];
            console.log(`➕ Adding item to wardrobe: ${item.name} with imageId: ${imageId}`);
            
            const result = Storage.addWardrobeItem({
                name: item.name,
                category: item.category,
                color: item.color,
                formality: item.formality,
                style: item.style,
                season: item.season,
                imageId: imageId,
                source: 'daily-log',
                confirmed: true
            });
            
            if (result) {
                successCount++;
                newItemIds.push(result.id);
                console.log(`✅ Successfully added: ${item.name} (ID: ${result.id})`);
            } else {
                failCount++;
                console.error(`❌ Failed to add: ${item.name}`);
            }
        });

        // Store the new item IDs so they can be included in the log
        this.dailyLogNewItemIds = newItemIds;

        console.log(`📊 Summary: ${successCount} added, ${failCount} failed. New item IDs:`, newItemIds);

        if (failCount > 0) {
            alert(`Added ${successCount} items to your wardrobe! ${failCount} failed (possibly storage limits). They'll be included in today's log.`);
        } else {
            alert(`Added ${successCount} items to your wardrobe! They'll be included in today's log.`);
        }
        
        // Re-render the page to show the new items in the wardrobe list
        // The render() will preserve the selfie since it's stored in the closure
        this.render();
    },

    // PROGRESS/TRACKER PAGE
    renderProgress() {
        const alignment = Storage.getAlignment();
        const wardrobe = Storage.getWardrobeItems();
        const allLogs = Storage.getDailyLogs();
        const recentLogs = Storage.getRecentLogs(30);
        const aspirations = Storage.getAspirations();

        // Calculate wear frequencies
        const wearCounts = {};
        allLogs.forEach(log => {
            if (log.itemsWorn) {
                log.itemsWorn.forEach(itemId => {
                    wearCounts[itemId] = (wearCounts[itemId] || 0) + 1;
                });
            }
        });

        // Most worn items
        const mostWorn = wardrobe
            .map(item => ({ ...item, wearCount: wearCounts[item.id] || 0 }))
            .filter(item => item.wearCount > 0)
            .sort((a, b) => b.wearCount - a.wearCount)
            .slice(0, 5);

        // Never worn items (all items with 0 wears, regardless of age)
        const neverWorn = wardrobe.filter(item => !wearCounts[item.id]);

        // Forgotten items (not worn in last 60 days)
        const sixtyDaysAgo = Date.now() - (60 * 24 * 60 * 60 * 1000);
        const forgotten = wardrobe.filter(item => {
            const lastWorn = item.lastWorn || item.addedAt;
            return lastWorn < sixtyDaysAgo && wearCounts[item.id] > 0;
        });

        // Aspiration consistency
        const aspirationCounts = {};
        recentLogs.forEach(log => {
            if (log.aspirationId) {
                aspirationCounts[log.aspirationId] = (aspirationCounts[log.aspirationId] || 0) + 1;
            }
        });

        // Calculate streak
        const sortedLogs = [...allLogs].sort((a, b) => b.timestamp - a.timestamp);
        let currentStreak = 0;
        let lastDate = null;
        for (const log of sortedLogs) {
            const logDate = new Date(log.timestamp).toDateString();
            if (!lastDate) {
                lastDate = logDate;
                currentStreak = 1;
            } else {
                const daysDiff = Math.floor((new Date(lastDate) - new Date(logDate)) / (24 * 60 * 60 * 1000));
                if (daysDiff === 1) {
                    currentStreak++;
                    lastDate = logDate;
                } else {
                    break;
                }
            }
        }

        // Wardrobe utilization
        const itemsWorn = Object.keys(wearCounts).length;
        const utilizationRate = wardrobe.length > 0 ? Math.round((itemsWorn / wardrobe.length) * 100) : 0;

        return `
            <div class="fade-in">
                <h2 class="mb-md">Tracker</h2>
                <p class="mb-xl" style="color: var(--text-secondary);">Monitor your style journey and wardrobe utilization</p>

                <!-- Identity Alignment Map -->
                ${this.renderAspirationAlignmentMap(alignment)}

                <!-- Logging Stats -->
                <div class="card mt-xl" style="background: linear-gradient(135deg, rgba(229, 221, 213, 0.1) 0%, rgba(196, 181, 160, 0.05) 100%); border: 1px solid rgba(229, 221, 213, 0.2);">
                    <h3 class="mb-md">Logging Activity</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                        <div style="text-align: center;">
                            <div style="font-size: 32px; font-weight: 600; color: var(--accent-primary);">${allLogs.length}</div>
                            <div style="font-size: 12px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px;">Total Logs</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 32px; font-weight: 600; color: var(--accent-primary);">${recentLogs.length}</div>
                            <div style="font-size: 12px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px;">This Month</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 32px; font-weight: 600; color: var(--accent-primary);">${currentStreak}</div>
                            <div style="font-size: 12px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px;">Day Streak</div>
                        </div>
                    </div>
                </div>

                <!-- Calendar View -->
                ${this.renderCalendar(allLogs)}

                <!-- Wardrobe Utilization -->
                <h3 class="mt-xl mb-md">Wardrobe Utilization</h3>
                <div class="card mb-md">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <span style="font-size: 14px; color: var(--text-secondary);">Items Used</span>
                        <span style="font-size: 20px; font-weight: 600;">${utilizationRate}%</span>
                    </div>
                    <div style="width: 100%; height: 8px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden;">
                        <div style="width: ${utilizationRate}%; height: 100%; background: var(--accent-primary); transition: width 0.3s ease;"></div>
                    </div>
                    <p style="font-size: 12px; color: var(--text-tertiary); margin-top: 8px;">
                        ${itemsWorn} out of ${wardrobe.length} items worn
                    </p>
                </div>

                ${mostWorn.length > 0 ? `
                    <div class="card mb-md">
                        <h4 class="mb-sm">Most Worn Items</h4>
                        ${mostWorn.map(item => {
                            const imageData = item.imageId ? Storage.getImage(item.imageId) : item.imageData;
                            return `
                            <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--bg-tertiary);">
                                ${imageData ? `
                                    <img src="${imageData}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" />
                                ` : ''}
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; font-size: 14px;">${item.name}</div>
                                    <div style="font-size: 12px; color: var(--text-tertiary);">${item.category} • ${item.color}</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-size: 18px; font-weight: 600; color: var(--accent-primary);">${item.wearCount}×</div>
                                    <div style="font-size: 11px; color: var(--text-tertiary);">worn</div>
                                </div>
                            </div>
                        `;
                        }).join('')}
                    </div>
                ` : ''}

                ${neverWorn.length > 0 ? `
                    <div class="card mb-md">
                        <h4 class="mb-sm">Unworn Items (${neverWorn.length})</h4>
                        <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
                            Items that have never been logged in any outfit
                        </p>
                        <div id="unwornItemsList">
                        ${neverWorn.slice(0, 3).map(item => {
                            const imageData = item.imageId ? Storage.getImage(item.imageId) : item.imageData;
                            return `
                            <div style="display: flex; gap: 12px; align-items: center; padding: 8px; background: var(--bg-tertiary); border-radius: 8px; margin-bottom: 8px;">
                                ${imageData ? `
                                    <img src="${imageData}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 8px; flex-shrink: 0;" />
                                ` : `
                                    <div style="width: 40px; height: 40px; background: var(--bg-secondary); border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 20px;">👕</div>
                                `}
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; font-size: 14px;">${item.name}</div>
                                    <div style="font-size: 12px; color: var(--text-tertiary);">${item.category}</div>
                                </div>
                            </div>
                        `;
                        }).join('')}
                        </div>
                        ${neverWorn.length > 3 ? `
                            <button id="viewMoreUnworn" class="btn btn-ghost btn-full mt-md" 
                                    style="font-size: 13px; padding: 8px;"
                                    onclick="App.toggleUnwornItems()">
                                View All ${neverWorn.length} Items →
                            </button>
                        ` : ''}
                    </div>
                ` : ''}

                ${forgotten.length > 0 ? `
                    <div class="card mb-md" style="border-left: 3px solid #FFC107;">
                        <h4 class="mb-sm">Forgotten Items (${forgotten.length})</h4>
                        <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
                            Not worn in the last 60 days
                        </p>
                        ${forgotten.slice(0, 5).map(item => {
                            const imageData = item.imageId ? Storage.getImage(item.imageId) : item.imageData;
                            return `
                            <div style="display: flex; gap: 12px; align-items: center; padding: 8px; background: var(--bg-tertiary); border-radius: 8px; margin-bottom: 8px;">
                                ${imageData ? `
                                    <img src="${imageData}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 8px; flex-shrink: 0;" />
                                ` : `
                                    <div style="width: 40px; height: 40px; background: var(--bg-secondary); border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 20px;">👕</div>
                                `}
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; font-size: 14px;">${item.name}</div>
                                    <div style="font-size: 12px; color: var(--text-tertiary);">${item.category}</div>
                                </div>
                            </div>
                        `;
                        }).join('')}
                ${forgotten.length > 5 ? `<p style="font-size: 12px; color: var(--text-tertiary); margin-top: 8px;">+${forgotten.length - 5} more items</p>` : ''}
                    </div>
                ` : ''}

                <button class="btn btn-primary btn-full mt-lg" onclick="App.navigate('daily-log')">
                    Log Today's Outfit
                </button>
            </div>
        `;
    },

    // Render calendar view of logging activity
    renderCalendar(allLogs) {
        // Always show calendar, even with no logs
        // Get current date and calculate calendar range (last 30 days)
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 29); // 30 days including today
        
        // Create a map of dates to log counts
        const logsByDate = {};
        allLogs.forEach(log => {
            const logDate = new Date(log.timestamp).toDateString();
            logsByDate[logDate] = (logsByDate[logDate] || 0) + 1;
        });

        // Generate calendar grid
        const days = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateStr = date.toDateString();
            const count = logsByDate[dateStr] || 0;
            
            days.push({
                date: date,
                count: count,
                isToday: dateStr === today.toDateString(),
                dayOfMonth: date.getDate()
            });
        }

        return `
            <div class="card mt-xl">
                <h3 class="mb-md">Activity Calendar</h3>
                <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">
                    Last 30 days of outfit logging
                </p>
                <div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 4px;">
                    ${days.map(day => {
                        const intensity = day.count === 0 ? 0 : day.count === 1 ? 1 : day.count === 2 ? 2 : 3;
                        const bgColor = intensity === 0 ? 'var(--bg-tertiary)' : 
                                      intensity === 1 ? 'rgba(229, 221, 213, 0.3)' :
                                      intensity === 2 ? 'rgba(229, 221, 213, 0.6)' :
                                      'var(--accent-primary)';
                        return `
                            <div style="aspect-ratio: 1; background: ${bgColor}; border-radius: 4px; 
                                        ${day.isToday ? 'border: 2px solid var(--accent-primary);' : ''}
                                        position: relative; display: flex; align-items: center; justify-content: center;"
                                 title="${day.date.toLocaleDateString()}: ${day.count} ${day.count === 1 ? 'log' : 'logs'}">
                                <span style="font-size: 10px; font-weight: 500; color: ${intensity > 0 ? 'var(--text-primary)' : 'var(--text-tertiary)'}; opacity: 0.7;">
                                    ${day.dayOfMonth}
                                </span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; font-size: 11px; color: var(--text-tertiary);">
                    <span>Less</span>
                    <div style="display: flex; gap: 4px;">
                        <div style="width: 12px; height: 12px; background: var(--bg-tertiary); border-radius: 2px;"></div>
                        <div style="width: 12px; height: 12px; background: rgba(229, 221, 213, 0.3); border-radius: 2px;"></div>
                        <div style="width: 12px; height: 12px; background: rgba(229, 221, 213, 0.6); border-radius: 2px;"></div>
                        <div style="width: 12px; height: 12px; background: var(--accent-primary); border-radius: 2px;"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>
        `;
    },

    async getRecommendations() {
        const btn = document.getElementById('getRecsBtn');
        const container = document.getElementById('recommendationsContainer');
        
        if (!btn || !container) return;
        
        // Show loading state
        btn.disabled = true;
        btn.textContent = 'Generating...';
        
        try {
            await GapAnalyzer.generateRecommendations();
            const recommendations = Storage.getRecommendations();
            
            // Display recommendations
            if (recommendations.length > 0) {
                container.innerHTML = `
                    <div class="section-header mb-md">
                        <h3 class="section-title">Recommendations for You</h3>
                    </div>
                    ${recommendations.map(rec => `
                        <div class="card mb-sm">
                            <div class="flex justify-between items-center mb-xs">
                                <span class="badge ${rec.type === 'wear-existing' ? 'badge-success' : 'badge-warning'}">
                                    ${rec.type === 'wear-existing' ? '👕 Use Existing' : '🛍️ Consider Adding'}
                                </span>
                                <span class="badge badge-${rec.priority === 'high' ? 'high' : rec.priority === 'medium' ? 'medium' : 'low'}">
                                    ${rec.priority}
                                </span>
                            </div>
                            <div style="font-weight: 600; margin-bottom: 4px;">${rec.item}</div>
                            <div style="font-size: 13px; color: var(--text-secondary);">${rec.reason}</div>
                        </div>
                    `).join('')}
                `;
                container.style.display = 'block';
            } else {
                container.innerHTML = `
                    <div class="card" style="text-align: center; padding: 24px;">
                        <p style="color: var(--text-secondary);">No recommendations available at this time. Keep logging your outfits to get personalized suggestions!</p>
                    </div>
                `;
                container.style.display = 'block';
            }
            
            // Update button
            btn.textContent = 'Refresh Recommendations';
            btn.disabled = false;
            
        } catch (error) {
            container.innerHTML = `
                <div class="card" style="text-align: center; padding: 24px; background: rgba(255, 0, 0, 0.1);">
                    <p style="color: var(--text-secondary);">Error generating recommendations: ${error.message}</p>
                </div>
            `;
            container.style.display = 'block';
            btn.textContent = 'Try Again';
            btn.disabled = false;
        }
    },

    // PROFILE PAGE
    renderProfile() {
        const user = Storage.getUser();
        const stats = Storage.getStats();
        const identity = Storage.getIdentity();
        const aspirations = Storage.getAspirations();
        const alignment = Storage.getAlignment();
        const allLogs = Storage.getDailyLogs();
        
        // Calculate streak
        const sortedLogs = [...allLogs].sort((a, b) => b.timestamp - a.timestamp);
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        let lastDate = null;
        
        for (const log of sortedLogs) {
            const logDate = new Date(log.timestamp).toDateString();
            if (!lastDate) {
                lastDate = logDate;
                currentStreak = 1;
                tempStreak = 1;
            } else {
                const daysDiff = Math.floor((new Date(lastDate) - new Date(logDate)) / (24 * 60 * 60 * 1000));
                if (daysDiff === 1) {
                    tempStreak++;
                    if (currentStreak > 0) currentStreak++;
                    longestStreak = Math.max(longestStreak, tempStreak);
                    lastDate = logDate;
                } else if (daysDiff === 0) {
                    // Same day, skip
                    continue;
                } else {
                    // Streak broken
                    if (currentStreak > 0) currentStreak = 0; // Only break current streak once
                    longestStreak = Math.max(longestStreak, tempStreak);
                    tempStreak = 1;
                    lastDate = logDate;
                }
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
        
        // Calculate alignment trend (last 7 days vs previous 7 days)
        const recentLogs = Storage.getRecentLogs(7);
        const olderLogs = allLogs.filter(log => {
            const logDate = new Date(log.timestamp);
            const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            const fourteenDaysAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
            return logDate.getTime() < sevenDaysAgo && logDate.getTime() >= fourteenDaysAgo;
        });
        
        let alignmentTrend = 'stable';
        let trendIcon = '→';
        let trendColor = 'var(--text-secondary)';
        
        if (recentLogs.length >= 3 && olderLogs.length >= 3) {
            const recentAvg = recentLogs.reduce((sum, log) => {
                return sum + (log.itemsWorn?.length || 0);
            }, 0) / recentLogs.length;
            
            const olderAvg = olderLogs.reduce((sum, log) => {
                return sum + (log.itemsWorn?.length || 0);
            }, 0) / olderLogs.length;
            
            if (recentAvg > olderAvg * 1.2) {
                alignmentTrend = 'improving';
                trendIcon = '↗';
                trendColor = '#4CAF50';
            } else if (recentAvg < olderAvg * 0.8) {
                alignmentTrend = 'declining';
                trendIcon = '↘';
                trendColor = '#FFC107';
            }
        }
        
        // Find most aligned aspiration
        let mostAlignedAsp = null;
        let highestScore = 0;
        if (aspirations.length > 0 && alignment.perAspiration) {
            aspirations.forEach(asp => {
                const aspData = alignment.perAspiration[asp.id];
                if (aspData && aspData.overall > highestScore) {
                    highestScore = aspData.overall;
                    mostAlignedAsp = asp;
                }
            });
        }

        return `
            <div class="fade-in">
                <!-- User Identity Section -->
                <div class="text-center mb-xl">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--gradient-accent); 
                                margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;
                                font-size: 32px; font-weight: 700; color: var(--bg-primary);">
                        ${user.name.charAt(0).toUpperCase()}
                    </div>
                    <h2>${user.name}</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 8px;">
                        ${identity.archetype?.name || 'Style Explorer'}
                    </p>
                    <p style="color: var(--text-tertiary); font-size: 13px;">
                        ${aspirations.length} ${aspirations.length === 1 ? 'aspiration' : 'aspirations'} • Member since ${new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                </div>

                <!-- Journey Overview -->
                <div class="card mb-md" style="background: linear-gradient(135deg, rgba(229, 221, 213, 0.1) 0%, rgba(196, 181, 160, 0.05) 100%); border: 1px solid rgba(229, 221, 213, 0.2);">
                    <h4 class="mb-md">Your Journey</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                        <div style="text-align: center; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
                            <div style="font-size: 28px; font-weight: 600; color: var(--accent-primary);">${currentStreak}</div>
                            <div style="font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">Current Streak</div>
                        </div>
                        <div style="text-align: center; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
                            <div style="font-size: 28px; font-weight: 600; color: var(--accent-primary);">${longestStreak}</div>
                            <div style="font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">Longest Streak</div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 13px; color: var(--text-secondary);">Alignment Trend</span>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 20px; color: ${trendColor};">${trendIcon}</span>
                                <span style="font-size: 14px; font-weight: 600; color: ${trendColor}; text-transform: capitalize;">${alignmentTrend}</span>
                            </div>
                        </div>
                    </div>
                    
                    ${mostAlignedAsp ? `
                        <div style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
                            <div style="font-size: 12px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Most Aligned</div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 14px; font-weight: 600; color: var(--text-primary);">${mostAlignedAsp.name}</span>
                                <span style="font-size: 16px; font-weight: 600; color: var(--accent-primary);">${highestScore}%</span>
                            </div>
                        </div>
                    ` : ''}
                </div>

                <!-- Aspiration Summary -->
                ${aspirations.length > 0 ? `
                    <div class="card mb-md">
                        <h4 class="mb-md">Your Aspirations</h4>
                        <div style="display: grid; gap: 8px;">
                            ${aspirations.map(asp => {
                                // Calculate score directly from storage data
                                const wardrobe = Storage.getWardrobeItems();
                                const recentLogs = Storage.getRecentLogs(7);
                                const matchingItems = Storage.getMatchingItems(asp.id, 0.5);
                                const totalItems = wardrobe.length;
                                
                                // Calculate recent wears for this aspiration
                                let recentWears = 0;
                                recentLogs.forEach(log => {
                                    if (log.aspirationId === asp.id || (!log.aspirationId && log.itemsWorn)) {
                                        if (log.itemsWorn && log.itemsWorn.length > 0) {
                                            const wornMatchingItems = log.itemsWorn.filter(itemId => {
                                                return matchingItems.some(mi => mi.id === itemId);
                                            });
                                            if (wornMatchingItems.length > 0) {
                                                recentWears++;
                                            }
                                        }
                                    }
                                });
                                
                                // Calculate overall score
                                const wardrobeScore = totalItems > 0 ? Math.round((matchingItems.length / totalItems) * 100) : 0;
                                const behaviorScore = recentLogs.length > 0 ? Math.round((recentWears / recentLogs.length) * 100) : 0;
                                const aspScore = Math.round((wardrobeScore + behaviorScore) / 2);
                                
                                return `
                                    <div onclick="App.navigateToAspiration('${asp.id}')" 
                                         style="cursor: pointer; padding: 12px; background: var(--bg-secondary); border-radius: 8px; 
                                                display: flex; justify-content: space-between; align-items: center; 
                                                transition: background 0.2s;"
                                         onmouseover="this.style.background='var(--bg-tertiary)'" 
                                         onmouseout="this.style.background='var(--bg-secondary)'">
                                        <span style="font-size: 14px; color: var(--text-primary);">${asp.name}</span>
                                        <span style="font-size: 14px; font-weight: 600; color: var(--accent-primary);">${aspScore}%</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Data Management -->
                <div class="card mb-md">
                    <h4 class="mb-md">Data Management</h4>
                    <button class="btn btn-secondary btn-full mb-sm" onclick="App.exportData()">
                        📥 Export Data
                    </button>
                    <button class="btn btn-ghost btn-full" onclick="App.clearData()" 
                            style="color: var(--text-tertiary);">
                        🗑️ Clear All Data
                    </button>
                </div>
            </div>
        `;
    },

    initProfile() {
        // Profile page loaded
    },

    exportData() {
        const data = Storage.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aspire-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        alert('Data exported!');
    },

    clearData() {
        if (confirm('This will delete all your data. Are you sure?')) {
            Storage.clearAll();
            location.reload();
        }
    },

    // Edit archetype
    editArchetype() {
        const identity = Storage.getIdentity();
        const currentArchetype = identity.archetype?.name || '';
        
        // Create dialog overlay
        const dialog = document.createElement('div');
        dialog.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px;';
        
        dialog.innerHTML = `
            <div class="card" style="max-width: 400px; width: 100%; max-height: 80vh; overflow-y: auto;">
                <h3 class="mb-md">Edit Your Archetype</h3>
                <p class="mb-lg" style="color: var(--text-secondary); font-size: 14px;">
                    This is your personal style identity shown on your dashboard.
                </p>
                
                <div class="form-group">
                    <label class="form-label">Archetype Name</label>
                    <input type="text" id="archetypeNameInput" class="form-input" 
                           value="${currentArchetype}" 
                           placeholder="e.g., Creative Professional, Urban Minimalist" />
                    <p style="font-size: 12px; color: var(--text-tertiary); margin-top: 8px;">
                        A few words that capture your style identity
                    </p>
                </div>
                
                <div class="flex gap-md mt-lg">
                    <button class="btn btn-ghost" onclick="this.closest('div[style*=fixed]').remove()" style="flex: 1;">
                        Cancel
                    </button>
                    <button class="btn btn-primary" id="saveArchetypeBtn" style="flex: 1;">
                        Save
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Setup save button
        document.getElementById('saveArchetypeBtn').onclick = () => {
            const input = document.getElementById('archetypeNameInput');
            const newName = input.value.trim();
            
            if (newName) {
                Storage.updateArchetype(newName);
                dialog.remove();
                this.render(); // Refresh to show new archetype
            } else {
                alert('Please enter an archetype name');
            }
        };
        
        // Close on background click
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
        
        // Focus input
        setTimeout(() => {
            const input = document.getElementById('archetypeNameInput');
            if (input) {
                input.focus();
                input.select();
            }
        }, 100);
    },

    // ADD WARDROBE ITEM PAGE
    renderAddWardrobeItem() {
        return `
            <div class="fade-in">
                <div class="flex justify-between items-center mb-lg">
                    <h2>Add to Wardrobe</h2>
                    <button class="btn btn-ghost" onclick="App.navigate('dashboard')">Cancel</button>
                </div>

                <div class="upload-area mb-lg" id="itemImageArea">
                    <div class="upload-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                    </div>
                    <div class="upload-text">Upload Photos</div>
                    <div class="upload-hint">AI will detect all clothing items</div>
                </div>

                <div id="itemImagePreview" class="preview-grid"></div>

                <div id="detectedItems" style="display: none;">
                    <h3 class="mb-md mt-xl">Detected Items</h3>
                    <div id="detectedItemsList"></div>
                    <div class="flex gap-md mt-lg">
                        <button id="addAllBtn" class="btn btn-primary" style="flex: 1;">
                            Add All to Wardrobe
                        </button>
                        <button class="btn btn-secondary" onclick="App.navigate('wardrobe')">
                            View Wardrobe
                        </button>
                    </div>
                </div>

                <button id="detectBtn" class="btn btn-primary btn-full mt-lg" style="display: none;">
                    Detect Items
                </button>
            </div>
        `;
    },

    initAddWardrobeItem() {
        this.selectedImages = [];
        this.detectedItems = [];

        const imageArea = document.getElementById('itemImageArea');
        const imagePreview = document.getElementById('itemImagePreview');
        const detectBtn = document.getElementById('detectBtn');

        imageArea.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.multiple = true;
            input.onchange = (e) => {
                Array.from(e.target.files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.selectedImages.push(event.target.result);
                        this.updateImagePreview();
                        detectBtn.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                });
            };
            input.click();
        });

        detectBtn.addEventListener('click', async () => {
            if (this.selectedImages.length === 0) {
                alert('Please upload at least one image');
                return;
            }

            try {
                await this.detectItemsFromImages();
            } catch (error) {
                alert('Error detecting items: ' + error.message);
            }
        });
    },

    updateImagePreview() {
        const preview = document.getElementById('itemImagePreview');
        preview.innerHTML = this.selectedImages.map((img, index) => `
            <div class="preview-item">
                <img src="${img}" class="preview-image" />
                <div class="preview-remove" onclick="App.removeUploadImage(${index})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
            </div>
        `).join('');
    },

    removeUploadImage(index) {
        this.selectedImages.splice(index, 1);
        this.updateImagePreview();
        if (this.selectedImages.length === 0) {
            document.getElementById('detectBtn').style.display = 'none';
        }
    },

    async detectItemsFromImages() {
        const loading = ClaudeAI.showLoading(`Analyzing ${this.selectedImages.length} image(s)...`);
        this.detectedItems = [];

        try {
            // Process each image and store source image with items
            for (let i = 0; i < this.selectedImages.length; i++) {
                const items = await ClaudeAI.detectMultipleItems(this.selectedImages[i]);
                // Create new objects with source image for each detected item
                const itemsWithSource = items.map(item => ({
                    ...item,
                    sourceImage: this.selectedImages[i]
                }));
                this.detectedItems.push(...itemsWithSource);
            }

            ClaudeAI.hideLoading(loading);
            this.showDetectedItems();
        } catch (error) {
            ClaudeAI.hideLoading(loading);
            throw error;
        }
    },

    showDetectedItems() {
        const detectedSection = document.getElementById('detectedItems');
        const itemsList = document.getElementById('detectedItemsList');

        itemsList.innerHTML = this.detectedItems.map((item, index) => `
            <div class="card mb-sm" style="display: flex; align-items: center; gap: 12px;">
                <input type="checkbox" checked class="item-checkbox" data-index="${index}" 
                       style="width: 20px; height: 20px;" />
                <div style="flex: 1;">
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="font-size: 12px; color: var(--text-tertiary);">
                        ${item.category} • ${item.color} • ${item.formality}
                    </div>
                </div>
            </div>
        `).join('');

        detectedSection.style.display = 'block';
        document.getElementById('detectBtn').style.display = 'none';

        // Setup add all button
        document.getElementById('addAllBtn').onclick = () => this.addSelectedItems();
    },

    addSelectedItems() {
        const checkboxes = document.querySelectorAll('.item-checkbox:checked');
        const selectedIndexes = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
        
        let successCount = 0;
        let failCount = 0;
        
        // Store unique images first and create a mapping
        const imageMap = new Map(); // sourceImage -> imageId
        
        selectedIndexes.forEach(index => {
            const item = this.detectedItems[index];
            const sourceImage = item.sourceImage;
            
            // Only store image if we haven't seen it before
            if (sourceImage && !imageMap.has(sourceImage)) {
                console.log(`Storing unique image for items...`);
                const imageId = Storage.addImage(sourceImage);
                if (imageId) {
                    imageMap.set(sourceImage, imageId);
                } else {
                    console.error('Failed to store image');
                }
            }
        });
        
        // Now add items with imageId references
        selectedIndexes.forEach(index => {
            const item = this.detectedItems[index];
            console.log(`Attempting to add item ${index + 1}:`, item.name);
            
            const imageId = imageMap.get(item.sourceImage);
            
            // Create clean object with imageId reference instead of full image
            const result = Storage.addWardrobeItem({
                name: item.name,
                category: item.category,
                color: item.color,
                formality: item.formality,
                style: item.style,
                season: item.season,
                imageId: imageId, // Reference to stored image
                source: 'ai-detected',
                confirmed: true
            });
            
            if (result) {
                successCount++;
                console.log(`✓ Successfully added: ${item.name}`);
            } else {
                failCount++;
                console.error(`✗ Failed to add: ${item.name}`);
            }
        });

        console.log(`Summary: ${successCount} succeeded, ${failCount} failed out of ${selectedIndexes.length}`);
        
        if (failCount > 0) {
            alert(`Added ${successCount} items. ${failCount} failed due to storage limits.`);
        } else {
            alert(`Added ${successCount} items to your wardrobe!`);
        }
        
        this.navigate('wardrobe');
    },

    // WARDROBE VIEW PAGE
    renderWardrobe() {
        const wardrobe = Storage.getWardrobeItems();
        const categories = ['all', 'top', 'bottom', 'shoes', 'accessory', 'outerwear'];

        return `
            <div class="fade-in">
                <div class="flex justify-between items-center mb-lg">
                    <h2>Your Wardrobe</h2>
                    <button class="btn btn-primary" onclick="App.navigate('add-wardrobe-item')">
                        + Add
                    </button>
                </div>

                <p class="mb-lg" style="color: var(--text-secondary);">
                    ${wardrobe.length} ${wardrobe.length === 1 ? 'item' : 'items'}
                </p>

                <div class="chip-group mb-lg">
                    ${categories.map(cat => `
                        <button class="chip ${cat === 'all' ? 'active' : ''}" data-category="${cat}">
                            ${cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    `).join('')}
                </div>

                <div id="wardrobeGrid">
                    ${wardrobe.length > 0 ? `
                        ${wardrobe.map(item => {
                            const imageData = item.imageId ? Storage.getImage(item.imageId) : item.imageData;
                            return `
                            <div class="card mb-sm wardrobe-item" data-category="${item.category}">
                                <div style="display: flex; gap: 12px; align-items: center;">
                                    ${imageData ? `
                                        <img src="${imageData}" 
                                             style="width: 80px; height: 80px; object-fit: cover; border-radius: 12px; flex-shrink: 0;" />
                                    ` : `
                                        <div style="width: 80px; height: 80px; background: var(--bg-tertiary); border-radius: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 32px;">
                                            👕
                                        </div>
                                    `}
                                    <div style="flex: 1; min-width: 0;">
                                        <div style="font-weight: 600; margin-bottom: 4px;">${item.name}</div>
                                        <div style="font-size: 12px; color: var(--text-tertiary); margin-bottom: 8px;">
                                            ${item.category} • ${item.color} • ${item.formality}
                                        </div>
                                        ${item.style ? `
                                            <div style="font-size: 13px; color: var(--text-secondary);">
                                                ${item.style}
                                            </div>
                                        ` : ''}
                                    </div>
                                    <button class="btn btn-ghost" onclick="App.deleteWardrobeItem('${item.id}')"
                                            style="padding: 8px; height: fit-content; flex-shrink: 0;">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        `;
                        }).join('')}
                    ` : `
                        <div class="empty-state mt-xl">
                            <div class="empty-state-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <h3 class="empty-state-title">No items yet</h3>
                            <p class="empty-state-text">Start building your wardrobe by adding items</p>
                            <button class="btn btn-primary" onclick="App.navigate('add-wardrobe-item')">
                                Add First Item
                            </button>
                        </div>
                    `}
                </div>
            </div>
        `;
    },

    initWardrobe() {
        const filterBtns = document.querySelectorAll('.chip[data-category]');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter items
                const category = btn.dataset.category;
                const items = document.querySelectorAll('.wardrobe-item');
                items.forEach(item => {
                    if (category === 'all' || item.dataset.category === category) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    },

    deleteWardrobeItem(id) {
        if (confirm('Remove this item from your wardrobe?')) {
            Storage.deleteWardrobeItem(id);
            this.render();
        }
    },

    // OUTFITS VIEW PAGE
    renderOutfits() {
        const outfits = Storage.getOutfits();
        const wardrobe = Storage.getWardrobeItems();
        const aspirations = Storage.getAspirations();

        return `
            <div class="fade-in">
                <div class="flex justify-between items-center mb-lg">
                    <h2>Your Outfits</h2>
                    <button class="btn btn-primary" onclick="App.showOutfitGenerationDialog()">
                        + Generate
                    </button>
                </div>

                <p class="mb-lg" style="color: var(--text-secondary);">
                    ${outfits.length} ${outfits.length === 1 ? 'outfit' : 'outfits'} created
                </p>

                ${outfits.length > 0 ? `
                    ${outfits.map(outfit => {
                        const items = outfit.itemIds?.map(id => wardrobe.find(w => w.id === id)).filter(i => i) || [];
                        const aspiration = outfit.aspirationId ? aspirations.find(a => a.id === outfit.aspirationId) : null;
                        return `
                            <div class="card mb-md">
                                <div class="flex justify-between items-start mb-md">
                                    <div style="flex: 1;">
                                        <h4 style="margin-bottom: 8px;">${outfit.name}</h4>
                                        ${aspiration ? `
                                            <div style="font-size: 13px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px;">
                                                <span style="color: var(--accent-primary);">✨</span>
                                                <span>For: ${aspiration.name}</span>
                                            </div>
                                        ` : ''}
                                    </div>
                                    <div style="text-align: right;">
                                        <div class="badge badge-gold" style="font-size: 16px; padding: 8px 12px;">${outfit.alignmentScore}%</div>
                                        <div style="font-size: 11px; color: var(--text-tertiary); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Style Match</div>
                                    </div>
                                </div>
                                
                                ${items.length > 0 ? `
                                    <div class="mb-md">
                                        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; 
                                                    color: var(--text-tertiary); margin-bottom: 8px;">Items</div>
                                        ${items.map(item => {
                                            const imageData = item.imageId ? Storage.getImage(item.imageId) : item.imageData;
                                            return `
                                            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                                                ${imageData ? `
                                                    <img src="${imageData}" 
                                                         style="width: 40px; height: 40px; object-fit: cover; border-radius: 8px;" />
                                                ` : ''}
                                                <div>
                                                    <div style="font-size: 14px; font-weight: 600;">${item.name}</div>
                                                    <div style="font-size: 11px; color: var(--text-tertiary);">
                                                        ${item.category} • ${item.color}
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                        }).join('')}
                                    </div>
                                ` : ''}
                                
                                ${outfit.reason ? `
                                    <div class="mb-md">
                                        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; 
                                                    color: var(--text-tertiary); margin-bottom: 8px;">Why it works</div>
                                        <p style="font-size: 14px; line-height: 1.6;">${outfit.reason}</p>
                                    </div>
                                ` : ''}
                                
                                ${outfit.stylingTips ? `
                                    <div class="mb-md">
                                        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; 
                                                    color: var(--text-tertiary); margin-bottom: 8px;">Styling Tips</div>
                                        <p style="font-size: 14px; line-height: 1.6;">${outfit.stylingTips}</p>
                                    </div>
                                ` : ''}
                                
                                <button class="btn btn-ghost btn-full" onclick="App.deleteOutfit('${outfit.id}')">
                                    Delete Outfit
                                </button>
                            </div>
                        `;
                    }).join('')}
                ` : `
                    <div class="empty-state mt-xl">
                        <div class="empty-state-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <h3 class="empty-state-title">No outfits yet</h3>
                        <p class="empty-state-text">Generate AI-curated outfits from your wardrobe</p>
                        ${wardrobe.length > 0 ? `
                            <button class="btn btn-primary" onclick="App.generateOutfit()">
                                Generate First Outfit
                            </button>
                        ` : `
                            <button class="btn btn-primary" onclick="App.navigate('add-wardrobe-item')">
                                Add Wardrobe Items First
                            </button>
                        `}
                    </div>
                `}
            </div>
        `;
    },

    initOutfits() {
        // Outfits page loaded
    },

    deleteOutfit(id) {
        if (confirm('Delete this outfit?')) {
            Storage.deleteOutfit(id);
            this.render();
        }
    },

    // Toggle unworn items display
    toggleUnwornItems() {
        const wardrobe = Storage.getWardrobeItems();
        const allLogs = Storage.getDailyLogs();
        
        // Calculate wear frequencies
        const wearCounts = {};
        allLogs.forEach(log => {
            if (log.itemsWorn) {
                log.itemsWorn.forEach(itemId => {
                    wearCounts[itemId] = (wearCounts[itemId] || 0) + 1;
                });
            }
        });
        
        // Get all unworn items
        const neverWorn = wardrobe.filter(item => !wearCounts[item.id]);
        
        const itemsList = document.getElementById('unwornItemsList');
        const btn = document.getElementById('viewMoreUnworn');
        
        if (!itemsList || !btn) return;
        
        // Check current state
        const isExpanded = btn.textContent.includes('Show Less');
        
        if (isExpanded) {
            // Collapse - show only first 3
            itemsList.innerHTML = neverWorn.slice(0, 3).map(item => {
                const imageData = item.imageId ? Storage.getImage(item.imageId) : item.imageData;
                return `
                    <div style="display: flex; gap: 12px; align-items: center; padding: 8px; background: var(--bg-tertiary); border-radius: 8px; margin-bottom: 8px;">
                        ${imageData ? `
                            <img src="${imageData}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 8px; flex-shrink: 0;" />
                        ` : `
                            <div style="width: 40px; height: 40px; background: var(--bg-secondary); border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 20px;">👕</div>
                        `}
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 14px;">${item.name}</div>
                            <div style="font-size: 12px; color: var(--text-tertiary);">${item.category}</div>
                        </div>
                    </div>
                `;
            }).join('');
            btn.textContent = `View All ${neverWorn.length} Items →`;
        } else {
            // Expand - show all items
            itemsList.innerHTML = neverWorn.map(item => {
                const imageData = item.imageId ? Storage.getImage(item.imageId) : item.imageData;
                return `
                    <div style="display: flex; gap: 12px; align-items: center; padding: 8px; background: var(--bg-tertiary); border-radius: 8px; margin-bottom: 8px;">
                        ${imageData ? `
                            <img src="${imageData}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 8px; flex-shrink: 0;" />
                        ` : `
                            <div style="width: 40px; height: 40px; background: var(--bg-secondary); border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 20px;">👕</div>
                        `}
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 14px;">${item.name}</div>
                            <div style="font-size: 12px; color: var(--text-tertiary);">${item.category}</div>
                        </div>
                    </div>
                `;
            }).join('');
            btn.textContent = '← Show Less';
        }
    },

    // ASPIRATION DETAIL PAGE
    renderAspirationDetail() {
        const aspiration = Storage.getAspirationById(this.currentAspirationId);
        if (!aspiration) {
            return '<div class="empty-state"><h3>Aspiration not found</h3></div>';
        }

        const matchingItems = Storage.getMatchingItems(this.currentAspirationId);
        
        return `
            <div class="fade-in">
                <button class="btn btn-ghost mb-md" onclick="App.navigate('identity')" style="padding: 8px;">
                    ← Back to Aspirations
                </button>

                <h1 class="mb-md">${aspiration.name}</h1>
                
                ${aspiration.styles && aspiration.styles.length > 0 ? `
                    <div class="card mb-md">
                        <h4 class="mb-sm">Styles</h4>
                        <div class="chip-group">
                            ${aspiration.styles.map(s => `<span class="chip active">${s}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${aspiration.colors && aspiration.colors.length > 0 ? `
                    <div class="card mb-md">
                        <h4 class="mb-sm">Colors</h4>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            ${aspiration.colors.map(color => `
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: 28px; height: 28px; border-radius: 50%; background: ${this.getColorHex(color)}; 
                                                border: 2px solid var(--bg-secondary);"></div>
                                    <span style="font-size: 14px;">${color}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${aspiration.keywords && aspiration.keywords.length > 0 ? `
                    <div class="card mb-md">
                        <h4 class="mb-sm">Keywords</h4>
                        <div class="chip-group">
                            ${aspiration.keywords.map(k => `<span class="chip">${k}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}

                <h3 class="mb-md mt-xl">Matching Items (${matchingItems.length})</h3>
                
                ${matchingItems.length > 0 ? `
                    <div>
                        ${matchingItems.map(item => {
                            const imageData = item.imageId ? Storage.getImage(item.imageId) : item.imageData;
                            const analysis = Storage.getItemAnalysis(item.id, this.currentAspirationId);
                            return `
                            <div class="card mb-sm">
                                <div style="display: flex; gap: 12px; align-items: center;">
                                    ${imageData ? `
                                        <img src="${imageData}" 
                                             style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; flex-shrink: 0;" />
                                    ` : ''}
                                    <div style="flex: 1;">
                                        <div style="font-weight: 600;">${item.name}</div>
                                        <div style="font-size: 12px; color: var(--text-tertiary);">
                                            ${item.category} • ${item.color}
                                        </div>
                                        ${analysis ? `
                                            <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
                                                Match: ${Math.round(analysis.matchScore * 100)}%
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `;
                        }).join('')}
                    </div>
                ` : `
                    <div class="empty-state">
                        <p class="text-muted">No matching items yet. Add items to your wardrobe that align with this aspiration.</p>
                        <button class="btn btn-primary mt-md" onclick="App.navigate('add-wardrobe-item')">
                            Add Items
                        </button>
                    </div>
                `}

                <div class="flex gap-md mt-xl">
                    <button class="btn btn-secondary" style="flex: 1;" onclick="App.editAspiration('${aspiration.id}')">
                        Edit Aspiration
                    </button>
                    <button class="btn btn-ghost" onclick="App.deleteAspirationConfirm('${aspiration.id}')">
                        Delete
                    </button>
                </div>
            </div>
        `;
    },

    initAspirationDetail() {
        // Aspiration detail loaded
    },

    deleteAspirationConfirm(aspirationId) {
        if (confirm('Delete this aspiration? This cannot be undone.')) {
            Storage.deleteAspiration(aspirationId);
            this.navigate('identity');
        }
    },

    // ADD ASPIRATION PAGE
    renderAddAspiration() {
        return this.renderAspirationForm('Add New Aspiration', null);
    },

    initAddAspiration() {
        this.initAspirationForm(null);
    },

    // EDIT ASPIRATION PAGE
    renderEditAspiration() {
        const aspiration = Storage.getAspirationById(this.currentAspirationId);
        if (!aspiration) {
            return '<div class="empty-state"><h3>Aspiration not found</h3></div>';
        }
        return this.renderAspirationForm('Edit Aspiration', aspiration);
    },

    initEditAspiration() {
        const aspiration = Storage.getAspirationById(this.currentAspirationId);
        if (aspiration) {
            this.initAspirationForm(aspiration);
        }
    },

    // ASPIRATION FORM (shared for add/edit)
    renderAspirationForm(title, aspiration) {
        // Use editing arrays if they exist (during editing), otherwise use aspiration data
        const selectedStyles = this.editingStyles || aspiration?.styles || [];
        const selectedColors = this.editingColors || aspiration?.colors || [];
        const keywords = this.editingKeywords || aspiration?.keywords || [];
        
        return `
            <div class="fade-in">
                <button class="btn btn-ghost mb-md" onclick="App.navigate('identity')" style="padding: 8px;">
                    ← Cancel
                </button>

                <h2 class="mb-xl">${title}</h2>

                <!-- Name Input -->
                <div class="form-group">
                    <label class="form-label">Aspiration Name</label>
                    <input type="text" id="aspirationName" class="form-input" 
                           placeholder="e.g., Professional Creative" value="${aspiration?.name || ''}" />
                </div>

                <!-- Style Selection -->
                <h4 class="mb-md">Select Your Style</h4>
                <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px;">
                    <div class="style-card ${selectedStyles.includes('minimalist') ? 'selected' : ''}" data-style="minimalist">
                        <div class="style-card-image">
                            <img src="images/minimalist.jpg" alt="Minimalist" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div class="style-card-label">Minimalist</div>
                    </div>
                    <div class="style-card ${selectedStyles.includes('artsy') ? 'selected' : ''}" data-style="artsy">
                        <div class="style-card-image">
                            <img src="images/artsy.jpeg" alt="Artsy" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div class="style-card-label">Artsy</div>
                    </div>
                    <div class="style-card ${selectedStyles.includes('casual') ? 'selected' : ''}" data-style="casual">
                        <div class="style-card-image">
                            <img src="images/casual.jpeg" alt="Casual" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div class="style-card-label">Casual</div>
                    </div>
                </div>

                <!-- Color Selection -->
                <h4 class="mb-md">Select Your Colors</h4>
                <div class="card mb-md" style="background: var(--bg-secondary);">
                    <div style="display: flex; gap: 12px; margin-bottom: 16px;">
                        <div style="flex: 1;">
                            <label style="font-size: 12px; color: var(--text-tertiary); display: block; margin-bottom: 8px;">Pick Color</label>
                            <input type="color" id="aspirationColorPicker" value="#000000" 
                                   style="width: 100%; height: 50px; border: 2px solid rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer; background: var(--bg-tertiary);" />
                        </div>
                        <div style="flex: 1;">
                            <label style="font-size: 12px; color: var(--text-tertiary); display: block; margin-bottom: 8px;">Opacity</label>
                            <input type="range" id="aspirationColorOpacity" min="0" max="100" value="100" 
                                   style="width: 100%; height: 50px; cursor: pointer;" />
                            <div style="text-align: center; font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
                                <span id="aspirationOpacityValue">100</span>%
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding: 12px; background: var(--bg-tertiary); border-radius: 8px;">
                        <div id="aspirationColorPreview" style="width: 50px; height: 50px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.1);"></div>
                        <div style="flex: 1;">
                            <div style="font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Preview</div>
                            <div id="aspirationColorValue" style="font-family: monospace; font-size: 13px; color: var(--text-primary);">rgba(0, 0, 0, 1)</div>
                        </div>
                    </div>
                    
                    <button id="aspirationAddColorBtn" class="btn btn-secondary btn-full">+ Add This Color</button>
                </div>
                
                <div id="aspirationSelectedColorsContainer" class="mb-xl" style="display: ${selectedColors.length > 0 ? 'block' : 'none'};">
                    <label style="font-size: 12px; color: var(--text-tertiary); display: block; margin-bottom: 8px;">Selected Colors</label>
                    <div id="aspirationSelectedColorsList" style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${selectedColors.map((color, index) => `
                            <div class="aspiration-selected-color-chip" data-index="${index}" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--bg-tertiary); border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
                                <div style="width: 24px; height: 24px; border-radius: 50%; background: ${color}; border: 2px solid rgba(255,255,255,0.2);"></div>
                                <span style="font-size: 12px; font-family: monospace; color: var(--text-secondary);">${color}</span>
                                <button class="aspiration-remove-color-btn" data-index="${index}" style="background: none; border: none; color: var(--text-tertiary); cursor: pointer; font-size: 16px; line-height: 1; padding: 0 4px;">×</button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Keywords -->
                <h4 class="mb-md">Describe Your Style</h4>
                <div class="keyword-input-container mb-md">
                    <input type="text" id="aspirationKeywordInput" class="form-input" 
                           placeholder="Type keywords and press Enter" />
                </div>
                
                <div id="aspirationKeywordChips" class="chip-group mb-xl">
                    ${keywords.map(keyword => `
                        <span class="chip active" data-keyword="${keyword}">
                            ${keyword}
                            <span class="chip-remove">×</span>
                        </span>
                    `).join('')}
                </div>

                <button id="saveAspirationBtn" class="btn btn-primary btn-full">
                    ${aspiration ? 'Update Aspiration' : 'Create Aspiration'}
                </button>
            </div>
        `;
    },

    initAspirationForm(aspiration) {
        // Make deep copies to avoid modifying original aspiration object
        // Only initialize if not already set (to preserve state across re-renders)
        if (!this.editingStyles) {
            this.editingStyles = aspiration?.styles ? [...aspiration.styles] : [];
        }
        if (!this.editingColors) {
            this.editingColors = aspiration?.colors ? [...aspiration.colors] : [];
        }
        if (!this.editingKeywords) {
            this.editingKeywords = aspiration?.keywords ? [...aspiration.keywords] : [];
        }
        this.editingAspiration = aspiration; // Store for later
        
        // Initialize separate color picker state for edit forms
        this.editingColorPicker = this.editingColorPicker || { hex: '#000000', opacity: 100 };
        
        // Style selection
        const styleCards = document.querySelectorAll('.style-card');
        styleCards.forEach(card => {
            card.addEventListener('click', () => {
                const style = card.dataset.style;
                const index = this.editingStyles.indexOf(style);
                
                if (index > -1) {
                    this.editingStyles.splice(index, 1);
                    card.classList.remove('selected');
                } else {
                    this.editingStyles.push(style);
                    card.classList.add('selected');
                }
            });
        });
        
        // Color picker functionality for aspiration forms
        const colorPicker = document.getElementById('aspirationColorPicker');
        const colorOpacity = document.getElementById('aspirationColorOpacity');
        const opacityValue = document.getElementById('aspirationOpacityValue');
        const colorPreview = document.getElementById('aspirationColorPreview');
        const colorValue = document.getElementById('aspirationColorValue');
        const addColorBtn = document.getElementById('aspirationAddColorBtn');
        const selectedColorsContainer = document.getElementById('aspirationSelectedColorsContainer');
        
        // Set initial values from stored state
        colorPicker.value = this.editingColorPicker.hex;
        colorOpacity.value = this.editingColorPicker.opacity;
        opacityValue.textContent = this.editingColorPicker.opacity;
        
        const updateColorPreview = () => {
            const hex = colorPicker.value;
            const opacity = colorOpacity.value / 100;
            
            // Save current state
            this.editingColorPicker = { hex, opacity: colorOpacity.value };
            
            // Convert hex to RGB
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            
            const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            colorPreview.style.background = rgba;
            colorValue.textContent = rgba;
        };
        
        // Initial preview update
        updateColorPreview();
        
        colorPicker.addEventListener('input', updateColorPreview);
        colorOpacity.addEventListener('input', () => {
            opacityValue.textContent = colorOpacity.value;
            updateColorPreview();
        });
        
        addColorBtn.addEventListener('click', () => {
            const hex = colorPicker.value;
            const opacity = colorOpacity.value / 100;
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            
            if (!this.editingColors.includes(rgba)) {
                this.editingColors.push(rgba);
                // Keep the same color in the picker (don't generate random)
                this.render(); // Re-render to show new color
            }
        });
        
        // Color removal
        document.querySelectorAll('.aspiration-remove-color-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                this.editingColors.splice(index, 1);
                this.render();
            });
        });
        
        // Keyword input
        const keywordInput = document.getElementById('aspirationKeywordInput');
        
        keywordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const keyword = keywordInput.value.trim().toLowerCase();
                if (keyword && !this.editingKeywords.includes(keyword)) {
                    this.editingKeywords.push(keyword);
                    keywordInput.value = '';
                    this.render();
                }
            }
        });
        
        // Keyword removal
        document.querySelectorAll('.chip-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const keyword = e.target.parentElement.dataset.keyword;
                this.editingKeywords = this.editingKeywords.filter(k => k !== keyword);
                this.render();
            });
        });
        
        // Save button - direct save for editing, AI analysis for new aspirations
        document.getElementById('saveAspirationBtn').addEventListener('click', async () => {
            const manualName = document.getElementById('aspirationName').value.trim();
            
            if (this.editingStyles.length === 0 && this.editingColors.length === 0 && this.editingKeywords.length === 0) {
                alert('Please select at least one style, color, or keyword');
                return;
            }
            
            // Check if we're editing an existing aspiration
            if (this.editingAspiration) {
                // EDITING MODE: Save directly without AI
                const aspirationData = {
                    name: manualName || this.editingAspiration.name,
                    styles: this.editingStyles,
                    colors: this.editingColors,
                    keywords: this.editingKeywords
                };
                
                Storage.updateAspiration(this.editingAspiration.id, aspirationData);
                alert('Aspiration updated successfully!');
                
                // Clean up temp data
                this.editingAspiration = null;
                this.editingStyles = null;
                this.editingColors = null;
                this.editingKeywords = null;
                
                this.navigate('identity');
            } else {
                // NEW ASPIRATION MODE: Call AI for analysis
                const loading = ClaudeAI.showLoading('✨ AI is analyzing your aspiration...');
                
                try {
                    const aiAnalysis = await ClaudeAI.analyzeAspiration(
                        '',  // Empty description for add/edit forms (only onboarding has description)
                        this.editingStyles,
                        this.editingColors,
                        this.editingKeywords
                    );
                    
                    ClaudeAI.hideLoading(loading);
                    
                    // Store AI analysis and show preview
                    this.aiAspirationAnalysis = aiAnalysis;
                    this.manualAspirationName = manualName;
                    this.showAspirationPreview();
                    
                } catch (error) {
                    ClaudeAI.hideLoading(loading);
                    alert('Error analyzing aspiration: ' + error.message);
                }
            }
        });
    },

    // Show AI analysis preview
    showAspirationPreview() {
        const analysis = this.aiAspirationAnalysis;
        const manualName = this.manualAspirationName;
        
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="fade-in">
                <h2 class="mb-md">✨ AI Analysis Complete</h2>
                <p class="mb-xl" style="color: var(--text-secondary);">
                    Review the AI-enhanced aspiration profile
                </p>

                <div class="card mb-md" style="background: linear-gradient(135deg, rgba(229, 221, 213, 0.1) 0%, rgba(196, 181, 160, 0.05) 100%); border: 1px solid rgba(229, 221, 213, 0.2);">
                    <h4 class="mb-sm">Aspiration Name</h4>
                    ${manualName ? `
                        <div style="margin-bottom: 12px;">
                            <span style="font-size: 13px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px;">Your Name:</span>
                            <div style="font-size: 16px; margin-top: 4px; color: var(--text-secondary);">"${manualName}"</div>
                        </div>
                    ` : ''}
                    <div>
                        <span style="font-size: 13px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px;">✨ AI Suggestion:</span>
                        <div style="font-size: 20px; font-weight: 600; margin-top: 4px; color: var(--accent-primary);">
                            "${analysis.name}"
                        </div>
                    </div>
                </div>

                <div class="card mb-md">
                    <h4 class="mb-sm">Style Insight</h4>
                    <p style="font-size: 15px; line-height: 1.6; color: var(--text-primary); font-style: italic;">
                        "${analysis.styleInsight}"
                    </p>
                </div>

                ${this.editingColors.length > 0 ? `
                    <div class="card mb-md">
                        <h4 class="mb-sm">Color Harmony</h4>
                        <p style="font-size: 14px; color: var(--text-secondary);">
                            ${analysis.colorHarmony}
                        </p>
                    </div>
                ` : ''}

                <div class="card mb-md">
                    <h4 class="mb-sm">Keywords</h4>
                    <div style="margin-bottom: 8px;">
                        <span style="font-size: 12px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px;">Your keywords:</span>
                        <div class="chip-group" style="margin-top: 4px;">
                            ${this.editingKeywords.map(k => `<span class="chip">${k}</span>`).join('')}
                        </div>
                    </div>
                    ${analysis.enhancedKeywords.length > this.editingKeywords.length ? `
                        <div>
                            <span style="font-size: 12px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px;">+ AI suggestions:</span>
                            <div class="chip-group" style="margin-top: 4px;">
                                ${analysis.enhancedKeywords.filter(k => !this.editingKeywords.includes(k.toLowerCase())).map(k => 
                                    `<span class="chip" style="background: var(--gradient-accent); color: var(--bg-primary);">${k}</span>`
                                ).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>

                <div class="flex gap-md mt-xl">
                    <button class="btn btn-ghost" onclick="App.backToAspirationEdit()" style="flex: 1;">
                        ← Edit My Choices
                    </button>
                    <button class="btn btn-primary" onclick="App.confirmAspirationSave()" style="flex: 2;">
                        Looks Great, Continue →
                    </button>
                </div>
            </div>
        `;
    },

    backToAspirationEdit() {
        // Go back to edit form
        if (this.editingAspiration) {
            this.navigate('edit-aspiration');
        } else {
            this.navigate('add-aspiration');
        }
    },

    async confirmAspirationSave() {
        const analysis = this.aiAspirationAnalysis;
        
        const aspirationData = {
            name: analysis.name, // Use AI-generated name
            styles: this.editingStyles,
            colors: this.editingColors,
            keywords: analysis.enhancedKeywords, // Use AI-enhanced keywords
            styleInsight: analysis.styleInsight,
            colorHarmony: analysis.colorHarmony
        };
        
        let aspirationId;
        if (this.editingAspiration) {
            // Update existing
            const updated = Storage.updateAspiration(this.editingAspiration.id, aspirationData);
            aspirationId = updated.id;
            alert('Aspiration updated with AI insights!');
        } else {
            // Create new
            const created = Storage.addAspiration(aspirationData);
            aspirationId = created.id;
            alert('Aspiration created with AI insights!');
        }
        
        // Analyze wardrobe items for this aspiration
        await this.analyzeWardrobeForAspiration(aspirationId);
        
        // Clean up temp data
        this.aiAspirationAnalysis = null;
        this.manualAspirationName = null;
        this.editingAspiration = null;
        
        this.navigate('identity');
    },

    // Helper: Analyze all wardrobe items against an aspiration
    async analyzeWardrobeForAspiration(aspirationId) {
        const aspiration = Storage.getAspirationById(aspirationId);
        const wardrobe = Storage.getWardrobeItems();
        
        console.log('🔍 Starting wardrobe analysis:', {
            aspirationId,
            aspirationName: aspiration?.name,
            wardrobeItemCount: wardrobe.length
        });
        
        if (!aspiration) {
            console.error('❌ Aspiration not found:', aspirationId);
            return;
        }
        
        if (wardrobe.length === 0) {
            console.log('⚠️ No wardrobe items to analyze');
            return;
        }
        
        const loading = ClaudeAI.showLoading(`Analyzing ${wardrobe.length} wardrobe items...`);
        
        try {
            let matchCount = 0;
            let analyzedCount = 0;
            const allScores = [];
            
            // Analyze each item
            for (let i = 0; i < wardrobe.length; i++) {
                const item = wardrobe[i];
                try {
                    console.log(`📊 Analyzing item ${i + 1}/${wardrobe.length}: ${item.name}`);
                    
                    const analysis = await ClaudeAI.analyzeItemAspirationMatch(item, aspiration);
                    console.log(`  Score: ${(analysis.matchScore * 100).toFixed(0)}% - ${analysis.reasoning}`);
                    
                    const saved = Storage.updateItemAnalysis(item.id, aspirationId, analysis);
                    console.log(`  Saved to storage: ${saved ? '✓' : '✗'}`);
                    
                    analyzedCount++;
                    allScores.push(analysis.matchScore);
                    
                    if (analysis.matchScore >= 0.5) {
                        matchCount++;
                    }
                } catch (error) {
                    console.error(`❌ Failed to analyze item ${item.name}:`, error);
                }
            }
            
            ClaudeAI.hideLoading(loading);
            
            console.log('✅ Analysis complete:', {
                analyzed: analyzedCount,
                totalItems: wardrobe.length,
                matchingItems: matchCount,
                averageScore: (allScores.reduce((a, b) => a + b, 0) / allScores.length * 100).toFixed(1) + '%',
                allScores: allScores.map(s => (s * 100).toFixed(0) + '%')
            });
            
            // Verify data was saved
            const matchingItemsFromStorage = Storage.getMatchingItems(aspirationId);
            console.log(`📦 Storage verification: ${matchingItemsFromStorage.length} matching items found`);
            
            if (matchCount > 0) {
                alert(`Found ${matchCount} matching items in your wardrobe!`);
            }
        } catch (error) {
            ClaudeAI.hideLoading(loading);
            console.error('❌ Error analyzing wardrobe:', error);
            alert('Error analyzing wardrobe items. Check console for details.');
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Make App globally available
window.App = App;
