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
        const hideNavPages = ['onboarding', 'identity-create', 'add-wardrobe-item'];
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
            case 'dashboard':
                app.innerHTML = this.renderDashboard();
                this.initDashboard();
                break;
            case 'identity':
                app.innerHTML = this.renderIdentityView();
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
                        Identity first. Wardrobe follows.
                    </p>
                    <p style="font-size: 15px; line-height: 1.6; color: var(--text-secondary);">
                        Tell us who you aspire to be.
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

    // IDENTITY CREATE PAGE
    renderIdentityCreate() {
        return `
            <div class="fade-in">
                <h2 class="mb-md">Define Your Identity</h2>
                <p class="mb-xl">Upload inspiration images and describe your aspirational style</p>

                <div class="upload-area mb-lg" id="uploadArea">
                    <div class="upload-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                    </div>
                    <div class="upload-text">Upload inspiration images</div>
                    <div class="upload-hint">Tap to select from camera roll</div>
                </div>

                <div id="previewGrid" class="preview-grid"></div>

                <div class="form-group mt-lg">
                    <label class="form-label">Style Keywords</label>
                    <input type="text" id="keywords" class="form-input" 
                           placeholder="e.g., minimal, structured, confident" />
                    <p style="font-size: 12px; color: var(--text-tertiary); margin-top: 8px;">
                        Separate with commas
                    </p>
                </div>

                <button id="analyzeBtn" class="btn btn-primary btn-full mt-xl">
                    Create My Identity
                </button>
            </div>
        `;
    },

    initIdentityCreate() {
        this.selectedImages = [];
        
        const uploadArea = document.getElementById('uploadArea');
        const previewGrid = document.getElementById('previewGrid');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const keywordsInput = document.getElementById('keywords');

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
                        this.updatePreviewGrid();
                    };
                    reader.readAsDataURL(file);
                });
            };
            input.click();
        });

        analyzeBtn.addEventListener('click', async () => {
            const keywords = keywordsInput.value.split(',').map(k => k.trim()).filter(k => k);
            
            if (this.selectedImages.length === 0 && keywords.length === 0) {
                alert('Add at least some images or keywords');
                return;
            }

            try {
                await IdentityEngine.createIdentity(this.selectedImages, keywords);
                Storage.completeOnboarding();
                this.navigate('dashboard');
            } catch (error) {
                alert('Error creating identity: ' + error.message);
            }
        });
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

    // DASHBOARD PAGE
    renderDashboard() {
        const identity = Storage.getIdentity();
        const alignment = Storage.getAlignment();
        const stats = Storage.getStats();
        const user = Storage.getUser();
        const recentLogs = Storage.getRecentLogs(7);
        const recommendations = Storage.getRecommendations();
        const wardrobe = Storage.getWardrobeItems();

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
                <p class="mb-md" style="color: var(--text-secondary);">
                    ${identity.archetype.name}
                </p>

                <!-- Quick Actions -->
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;">
                    <button class="btn btn-primary" onclick="App.navigate('daily-log')" 
                            style="padding: 16px; font-size: 14px;">
                        📷 Log Today
                    </button>
                    <button class="btn btn-secondary" onclick="App.navigate('add-wardrobe-item')"
                            style="padding: 16px; font-size: 14px;">
                        👕 Add Item
                    </button>
                    <button class="btn btn-secondary" onclick="App.navigate('wardrobe')"
                            style="padding: 16px; font-size: 14px;">
                        👗 Wardrobe
                    </button>
                    <button class="btn btn-secondary" onclick="App.navigate('outfits')"
                            style="padding: 16px; font-size: 14px;">
                        ✨ Outfits
                    </button>
                </div>

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
                                        color: var(--text-tertiary);">
                                Identity
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
                                        color: var(--text-tertiary);">
                                Wardrobe
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
                                        color: var(--text-tertiary);">
                                Behavior
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
                ` : `
                    <!-- Motivational Card When No Data -->
                    <div class="card" style="background: var(--gradient-accent); color: var(--bg-primary); text-align: center; padding: 32px 24px;">
                        <div style="font-size: 48px; margin-bottom: 16px;">✨</div>
                        <h3 style="color: var(--bg-primary); margin-bottom: 12px;">Start Your Journey</h3>
                        <p style="color: rgba(10,10,10,0.8); margin-bottom: 20px;">
                            Add wardrobe items and log your first outfit to see your alignment score
                        </p>
                        <div style="display: flex; gap: 12px; justify-content: center;">
                            <button class="btn btn-secondary" onclick="App.navigate('add-wardrobe-item')"
                                    style="background: white; color: var(--bg-primary);">
                                Add Items
                            </button>
                            <button class="btn btn-secondary" onclick="App.navigate('daily-log')"
                                    style="background: rgba(255,255,255,0.2); color: var(--bg-primary); border: 1px solid rgba(255,255,255,0.3);">
                                Log Outfit
                            </button>
                        </div>
                    </div>
                `}

                <div class="section-header mt-xl">
                    <h3 class="section-title">Recent Outfits</h3>
                </div>

                <div class="outfit-grid">
                    ${recentLogs.slice(0, 3).map(log => `
                        <div class="outfit-card">
                            ${log.selfieData ? `
                                <img src="${log.selfieData}" class="outfit-card-image" />
                                <div class="outfit-card-score">${log.alignmentScore}%</div>
                            ` : `
                                <div class="outfit-card-placeholder">📷</div>
                            `}
                        </div>
                    `).join('')}
                    <div class="outfit-card outfit-add" onclick="App.navigate('daily-log')">
                        <div class="outfit-card-placeholder">+</div>
                    </div>
                </div>

                <!-- Recommendations Section -->
                ${recommendations.length > 0 ? `
                    <div class="section-header mt-xl">
                        <h3 class="section-title">Recommendations for You</h3>
                    </div>
                    ${recommendations.slice(0, 3).map(rec => `
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
                ` : ''}

                <div class="stats-grid mt-lg">
                    <div class="stat-card" onclick="App.navigate('profile')">
                        <div class="stat-value">${stats.wardrobeItems}</div>
                        <div class="stat-label">Wardrobe Items</div>
                    </div>
                    <div class="stat-card" onclick="App.navigate('progress')">
                        <div class="stat-value">${stats.dailyLogs}</div>
                        <div class="stat-label">Days Logged</div>
                    </div>
                </div>

                ${stats.wardrobeItems === 0 ? `
                    <div class="card mt-lg" style="background: var(--gradient-accent); color: var(--bg-primary);">
                        <h4 style="margin-bottom: 8px; color: var(--bg-primary);">Next Step: Build Your Wardrobe</h4>
                        <p style="color: rgba(10,10,10,0.8); margin-bottom: 16px;">
                            Add items so Aspire can calculate your alignment and provide personalized recommendations.
                        </p>
                        <button class="btn btn-secondary btn-full" onclick="App.navigate('add-wardrobe-item')">
                            Add First Item
                        </button>
                    </div>
                ` : `
                    <button class="btn btn-secondary btn-full mt-lg" onclick="App.recalculateAlignment()">
                        🔄 Refresh Alignment
                    </button>
                `}
            </div>
        `;
    },

    initDashboard() {
        // Dashboard loaded
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

    // IDENTITY VIEW PAGE
    renderIdentityView() {
        const identity = Storage.getIdentity();
        
        if (!identity.archetype) {
            return `<div class="empty-state">
                <h3>No identity defined</h3>
                <button class="btn btn-primary mt-md" onclick="App.navigate('identity-create')">
                    Create Identity
                </button>
            </div>`;
        }

        const arch = identity.archetype;

        return `
            <div class="fade-in">
                <h1 class="mb-sm">${arch.name}</h1>
                <p class="mb-xl">${arch.description}</p>

                <div class="card mb-md">
                    <h4 class="mb-md">Style Statement</h4>
                    <p style="font-size: 16px; font-style: italic; color: var(--accent-gold);">
                        "${arch.styleStatement}"
                    </p>
                </div>

                <div class="card mb-md">
                    <h4 class="mb-md">Color Palette</h4>
                    <div class="chip-group">
                        ${arch.colorPalette.map(color => `
                            <span class="chip active">${color}</span>
                        `).join('')}
                    </div>
                </div>

                <div class="card mb-md">
                    <h4 class="mb-md">Silhouettes</h4>
                    <div class="chip-group">
                        ${arch.silhouettes.map(s => `
                            <span class="chip">${s}</span>
                        `).join('')}
                    </div>
                </div>

                <div class="card mb-md">
                    <h4 class="mb-md">Behavioral Cues</h4>
                    ${arch.behavioralCues.map(cue => `
                        <p class="mb-sm" style="display: flex; align-items: center; gap: 8px;">
                            <span style="color: var(--accent-gold);">→</span> ${cue}
                        </p>
                    `).join('')}
                </div>

                <button class="btn btn-secondary btn-full mt-lg" onclick="App.generateOutfit()">
                    Generate Outfit
                </button>
            </div>
        `;
    },

    async generateOutfit() {
        try {
            await OutfitGenerator.generateOutfit();
            alert('Outfit created! Check your wardrobe.');
        } catch (error) {
            alert(error.message);
        }
    },

    // DAILY LOG PAGE
    renderDailyLog() {
        const wardrobe = Storage.getWardrobeItems();

        return `
            <div class="fade-in">
                <h2 class="mb-md">Today's Outfit</h2>
                <p class="mb-xl">Log what you're wearing to track alignment</p>

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

                <h4 class="mb-md mt-lg">What are you wearing?</h4>
                
                ${wardrobe.length > 0 ? `
                    <div style="max-height: 400px; overflow-y: auto;">
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
                    
                    <button id="logBtn" class="btn btn-primary btn-full mt-xl">
                        Save Log
                    </button>
                ` : `
                    <div class="empty-state">
                        <p>Add wardrobe items first</p>
                        <button class="btn btn-primary mt-md" onclick="App.navigate('add-wardrobe-item')">
                            Add Items
                        </button>
                    </div>
                `}
            </div>
        `;
    },

    initDailyLog() {
        let selfieData = null;

        const selfieArea = document.getElementById('selfieArea');
        const selfiePreview = document.getElementById('selfiePreview');
        const logBtn = document.getElementById('logBtn');

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
                        selfieData = event.target.result;
                        selfiePreview.innerHTML = `
                            <img src="${selfieData}" style="width: 100%; border-radius: 16px; margin-top: 16px;" />
                        `;
                    };
                    reader.readAsDataURL(file);
                };
                input.click();
            });
        }

        if (logBtn) {
            logBtn.addEventListener('click', async () => {
                const checkboxes = document.querySelectorAll('.wardrobe-checkbox:checked');
                const itemIds = Array.from(checkboxes).map(cb => cb.value);

                if (itemIds.length === 0) {
                    alert('Select at least one item');
                    return;
                }

                try {
                    await BehaviorTracker.addLog(selfieData, itemIds);
                    await AlignmentScorer.calculateAlignment();
                    this.navigate('dashboard');
                } catch (error) {
                    alert('Error saving log: ' + error.message);
                }
            });
        }
    },

    // PROGRESS PAGE
    renderProgress() {
        const progress = ProgressTracker.getProgress();
        const summary = ProgressTracker.getWeeklySummary();

        return `
            <div class="fade-in">
                <h2 class="mb-md">Your Evolution</h2>
                <p class="mb-xl">Track your identity alignment over time</p>

                <div class="timeline-graph">
                    <div class="timeline-title">Alignment Over Time</div>
                    <div class="timeline-chart">
                        ${progress.history.slice(-7).map(h => {
                            const height = h.overall;
                            return `
                                <div class="timeline-bar" style="height: ${height}%">
                                    <div class="timeline-bar-tooltip">${h.overall}%</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="timeline-labels">
                        ${progress.history.slice(-7).map((h, i) => `
                            <div class="timeline-label">Day ${i + 1}</div>
                        `).join('')}
                    </div>
                </div>

                <h4 class="mb-md mt-xl">This Week</h4>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${summary.daysLogged}</div>
                        <div class="stat-label">Days Logged</div>
                        <div class="stat-change ${summary.change >= 0 ? 'positive' : 'negative'}">
                            ${summary.change >= 0 ? '↑' : '↓'} ${Math.abs(summary.change)}% change
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${summary.averageScore}%</div>
                        <div class="stat-label">Avg Score</div>
                    </div>
                </div>

                <div class="card mt-lg">
                    <h4 class="mb-sm">Top Insight</h4>
                    <p>${summary.topInsight}</p>
                </div>

                <button class="btn btn-secondary btn-full mt-xl" onclick="App.getRecommendations()">
                    Get Recommendations
                </button>
            </div>
        `;
    },

    async getRecommendations() {
        try {
            await GapAnalyzer.generateRecommendations();
            alert('Recommendations generated! Check your profile.');
        } catch (error) {
            alert(error.message);
        }
    },

    // PROFILE PAGE
    renderProfile() {
        const user = Storage.getUser();
        const stats = Storage.getStats();
        const recommendations = Storage.getRecommendations();

        return `
            <div class="fade-in">
                <div class="text-center mb-xl">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--gradient-accent); 
                                margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;
                                font-size: 32px; font-weight: 700; color: var(--bg-primary);">
                        ${user.name.charAt(0).toUpperCase()}
                    </div>
                    <h2>${user.name}</h2>
                    <p style="color: var(--text-tertiary);">
                        Member since ${new Date(user.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div class="card mb-md">
                    <h4 class="mb-md">Statistics</h4>
                    <div class="flex justify-between mb-sm">
                        <span>Wardrobe Items</span>
                        <span class="badge-gold badge">${stats.wardrobeItems}</span>
                    </div>
                    <div class="flex justify-between mb-sm">
                        <span>Daily Logs</span>
                        <span class="badge-gold badge">${stats.dailyLogs}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Outfits Created</span>
                        <span class="badge-gold badge">${stats.outfits}</span>
                    </div>
                </div>

                ${recommendations.length > 0 ? `
                    <div class="card mb-md">
                        <h4 class="mb-md">Recommendations</h4>
                        ${recommendations.slice(0, 3).map(rec => `
                            <div class="mb-md">
                                <div class="flex justify-between items-center mb-xs">
                                    <span class="badge ${rec.type === 'wear-existing' ? 'badge-success' : 'badge-warning'}">
                                        ${rec.type === 'wear-existing' ? 'Use Existing' : 'Add New'}
                                    </span>
                                    <span class="badge">${rec.priority}</span>
                                </div>
                                <div style="font-weight: 600; margin-bottom: 4px;">${rec.item}</div>
                                <div style="font-size: 13px; color: var(--text-tertiary);">${rec.reason}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <button class="btn btn-secondary btn-full mb-md" onclick="App.exportData()">
                    Export Data
                </button>

                <button class="btn btn-ghost btn-full" onclick="App.clearData()" 
                        style="color: var(--text-tertiary);">
                    Clear All Data
                </button>
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

        return `
            <div class="fade-in">
                <div class="flex justify-between items-center mb-lg">
                    <h2>Your Outfits</h2>
                    <button class="btn btn-primary" onclick="App.generateOutfit()">
                        + Generate
                    </button>
                </div>

                <p class="mb-lg" style="color: var(--text-secondary);">
                    ${outfits.length} ${outfits.length === 1 ? 'outfit' : 'outfits'} created
                </p>

                ${outfits.length > 0 ? `
                    ${outfits.map(outfit => {
                        const items = outfit.itemIds?.map(id => wardrobe.find(w => w.id === id)).filter(i => i) || [];
                        return `
                            <div class="card mb-md">
                                <div class="flex justify-between items-center mb-md">
                                    <h4>${outfit.name}</h4>
                                    <div class="badge badge-gold">${outfit.alignmentScore}%</div>
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
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Make App globally available
window.App = App;
