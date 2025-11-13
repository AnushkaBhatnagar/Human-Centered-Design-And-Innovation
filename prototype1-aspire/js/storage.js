// LocalStorage Management
const Storage = {
    // Keys
    KEYS: {
        USER: 'aspire_user',
        ASPIRATIONS: 'aspire_aspirations',
        WARDROBE: 'aspire_wardrobe',
        SETTINGS: 'aspire_settings',
        OUTFITS: 'aspire_outfits',
        INSPIRATIONS: 'aspire_inspirations',
        SHOPPING_LIST: 'aspire_shopping_list'
    },

    // Get data from localStorage
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    // Set data to localStorage
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },

    // Remove data from localStorage
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    // Clear all app data
    clearAll() {
        try {
            Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    // User Management
    getUser() {
        const user = this.get(this.KEYS.USER);
        if (user && !user.points) {
            user.points = 0;
            user.rewardsRedeemed = [];
        }
        return user;
    },

    setUser(userData) {
        return this.set(this.KEYS.USER, userData);
    },

    isUserLoggedIn() {
        return !!this.getUser();
    },

    addPoints(points) {
        const user = this.getUser();
        if (user) {
            user.points = (user.points || 0) + points;
            this.setUser(user);
            return user.points;
        }
        return 0;
    },

    redeemReward(reward) {
        const user = this.getUser();
        if (user && user.points >= reward.cost) {
            user.points -= reward.cost;
            user.rewardsRedeemed = user.rewardsRedeemed || [];
            user.rewardsRedeemed.push({
                ...reward,
                redeemedAt: new Date().toISOString()
            });
            this.setUser(user);
            return true;
        }
        return false;
    },

    // Aspirations Management
    getAspirations() {
        return this.get(this.KEYS.ASPIRATIONS) || [];
    },

    setAspirations(aspirations) {
        return this.set(this.KEYS.ASPIRATIONS, aspirations);
    },

    addAspiration(aspiration) {
        const aspirations = this.getAspirations();
        const newAspiration = {
            id: this.generateId(),
            name: aspiration.name,
            description: aspiration.description,
            keywords: aspiration.keywords || [],
            gradient: aspiration.gradient || 1,
            createdAt: new Date().toISOString(),
            styleInsights: null, // Cache for AI-generated insights
            ...aspiration
        };
        aspirations.push(newAspiration);
        this.setAspirations(aspirations);
        return newAspiration;
    },

    // Cache style insights for an aspiration
    cacheStyleInsights(aspirationId, insights) {
        const aspirations = this.getAspirations();
        const index = aspirations.findIndex(a => a.id === aspirationId);
        if (index !== -1) {
            aspirations[index].styleInsights = {
                data: insights,
                cachedAt: new Date().toISOString()
            };
            this.setAspirations(aspirations);
            return true;
        }
        return false;
    },

    // Get cached style insights
    getStyleInsights(aspirationId) {
        const aspiration = this.getAspirationById(aspirationId);
        return aspiration?.styleInsights?.data || null;
    },

    // Check if style insights need refresh (older than 7 days)
    needsStyleInsightsRefresh(aspirationId) {
        const aspiration = this.getAspirationById(aspirationId);
        if (!aspiration?.styleInsights) return true;
        
        const cachedDate = new Date(aspiration.styleInsights.cachedAt);
        const now = new Date();
        const daysDiff = (now - cachedDate) / (1000 * 60 * 60 * 24);
        
        return daysDiff > 7;
    },

    updateAspiration(id, updates) {
        const aspirations = this.getAspirations();
        const index = aspirations.findIndex(a => a.id === id);
        if (index !== -1) {
            aspirations[index] = { ...aspirations[index], ...updates };
            this.setAspirations(aspirations);
            return aspirations[index];
        }
        return null;
    },

    deleteAspiration(id) {
        const aspirations = this.getAspirations();
        const filtered = aspirations.filter(a => a.id !== id);
        this.setAspirations(filtered);
        return filtered;
    },

    getAspirationById(id) {
        const aspirations = this.getAspirations();
        return aspirations.find(a => a.id === id);
    },

    // Wardrobe Management
    getWardrobeItems() {
        return this.get(this.KEYS.WARDROBE) || [];
    },

    setWardrobeItems(items) {
        return this.set(this.KEYS.WARDROBE, items);
    },

    addWardrobeItem(item) {
        const items = this.getWardrobeItems();
        const newItem = {
            id: this.generateId(),
            type: item.type || 'other',
            name: item.name || 'Untitled Item',
            description: item.description || '',
            imageData: item.imageData || null,
            color: item.color || '',
            brand: item.brand || '',
            category: item.category || item.type,
            addedAt: new Date().toISOString(),
            analysisResults: {},
            ...item
        };
        items.push(newItem);
        this.setWardrobeItems(items);
        return newItem;
    },

    updateWardrobeItem(id, updates) {
        const items = this.getWardrobeItems();
        const index = items.findIndex(i => i.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            this.setWardrobeItems(items);
            return items[index];
        }
        return null;
    },

    deleteWardrobeItem(id) {
        const items = this.getWardrobeItems();
        const filtered = items.filter(i => i.id !== id);
        this.setWardrobeItems(filtered);
        return filtered;
    },

    getWardrobeItemById(id) {
        const items = this.getWardrobeItems();
        return items.find(i => i.id === id);
    },

    getWardrobeItemsByCategory(category) {
        const items = this.getWardrobeItems();
        return items.filter(i => i.category === category);
    },

    // Analysis Results Management
    updateItemAnalysis(itemId, aspirationId, analysis) {
        const item = this.getWardrobeItemById(itemId);
        if (item) {
            if (!item.analysisResults) {
                item.analysisResults = {};
            }
            item.analysisResults[aspirationId] = {
                matchScore: analysis.matchScore,
                reasoning: analysis.reasoning,
                updatedAt: new Date().toISOString()
            };
            return this.updateWardrobeItem(itemId, item);
        }
        return null;
    },

    getItemAnalysisForAspiration(itemId, aspirationId) {
        const item = this.getWardrobeItemById(itemId);
        if (item && item.analysisResults) {
            return item.analysisResults[aspirationId];
        }
        return null;
    },

    // Settings Management
    getSettings() {
        return this.get(this.KEYS.SETTINGS) || {
            darkMode: false,
            notifications: true,
            autoAnalysis: false
        };
    },

    updateSettings(settings) {
        const current = this.getSettings();
        return this.set(this.KEYS.SETTINGS, { ...current, ...settings });
    },

    // Utility Functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Export/Import Data
    exportData() {
        return {
            user: this.getUser(),
            aspirations: this.getAspirations(),
            wardrobe: this.getWardrobeItems(),
            settings: this.getSettings(),
            exportedAt: new Date().toISOString()
        };
    },

    importData(data) {
        try {
            if (data.user) this.setUser(data.user);
            if (data.aspirations) this.setAspirations(data.aspirations);
            if (data.wardrobe) this.setWardrobeItems(data.wardrobe);
            if (data.settings) this.updateSettings(data.settings);
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    },

    // Outfit Management
    getOutfits() {
        return this.get(this.KEYS.OUTFITS) || [];
    },

    setOutfits(outfits) {
        return this.set(this.KEYS.OUTFITS, outfits);
    },

    addOutfit(outfit) {
        const outfits = this.getOutfits();
        const newOutfit = {
            id: this.generateId(),
            name: outfit.name || 'Untitled Outfit',
            items: outfit.items || [],
            inspirationImage: outfit.inspirationImage || null,
            aspirationId: outfit.aspirationId || null,
            createdAt: new Date().toISOString(),
            ...outfit
        };
        outfits.push(newOutfit);
        this.setOutfits(outfits);
        
        // Award points for creating outfit
        this.addPoints(10);
        
        return newOutfit;
    },

    deleteOutfit(id) {
        const outfits = this.getOutfits();
        const filtered = outfits.filter(o => o.id !== id);
        this.setOutfits(filtered);
        return filtered;
    },

    getOutfitById(id) {
        const outfits = this.getOutfits();
        return outfits.find(o => o.id === id);
    },

    // Inspiration Management
    getInspirations() {
        return this.get(this.KEYS.INSPIRATIONS) || [];
    },

    setInspirations(inspirations) {
        return this.set(this.KEYS.INSPIRATIONS, inspirations);
    },

    addInspiration(inspiration) {
        const inspirations = this.getInspirations();
        const newInspiration = {
            id: this.generateId(),
            imageData: inspiration.imageData,
            description: inspiration.description || '',
            tags: inspiration.tags || [],
            createdAt: new Date().toISOString(),
            ...inspiration
        };
        inspirations.push(newInspiration);
        this.setInspirations(inspirations);
        
        // Award points for adding inspiration
        this.addPoints(5);
        
        return newInspiration;
    },

    deleteInspiration(id) {
        const inspirations = this.getInspirations();
        const filtered = inspirations.filter(i => i.id !== id);
        this.setInspirations(filtered);
        return filtered;
    },

    // Shopping List Management
    getShoppingList() {
        return this.get(this.KEYS.SHOPPING_LIST) || [];
    },

    setShoppingList(items) {
        return this.set(this.KEYS.SHOPPING_LIST, items);
    },

    addToShoppingList(item) {
        const list = this.getShoppingList();
        const newItem = {
            id: this.generateId(),
            itemType: item.itemType,
            reason: item.reason,
            suggestedBrand: item.suggestedBrand || '',
            aspirationId: item.aspirationId || null,
            price: item.price || null,
            link: item.link || null,
            createdAt: new Date().toISOString(),
            ...item
        };
        list.push(newItem);
        this.setShoppingList(list);
        return newItem;
    },

    removeFromShoppingList(id) {
        const list = this.getShoppingList();
        const filtered = list.filter(i => i.id !== id);
        this.setShoppingList(filtered);
        return filtered;
    },

    clearShoppingList() {
        this.setShoppingList([]);
    },

    // Statistics
    getStats() {
        const aspirations = this.getAspirations();
        const items = this.getWardrobeItems();
        
        const stats = {
            totalAspirations: aspirations.length,
            totalItems: items.length,
            itemsByCategory: {},
            analyzedItems: 0,
            averageMatchScore: 0
        };

        // Count items by category
        items.forEach(item => {
            const category = item.category || 'other';
            stats.itemsByCategory[category] = (stats.itemsByCategory[category] || 0) + 1;
            
            // Count analyzed items and calculate average match score
            if (item.analysisResults && Object.keys(item.analysisResults).length > 0) {
                stats.analyzedItems++;
                const scores = Object.values(item.analysisResults).map(r => r.matchScore);
                const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
                stats.averageMatchScore += avgScore;
            }
        });

        if (stats.analyzedItems > 0) {
            stats.averageMatchScore = Math.round((stats.averageMatchScore / stats.analyzedItems) * 100);
        }

        return stats;
    },

    // Populate with dummy data
    populateDummyData() {
        // Only populate if completely empty (no user, no aspirations, no wardrobe)
        if (this.getUser() || this.getAspirations().length > 0 || this.getWardrobeItems().length > 0) {
            return; // Don't overwrite existing data
        }

        // Create dummy user
        this.setUser({
            id: this.generateId(),
            name: 'Alex Morgan',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
        });

        // Create sample aspirations
        const aspirations = [
            {
                name: 'Professional Creative',
                description: 'Blending artistic expression with workplace sophistication. A style that commands respect while maintaining creative authenticity.',
                keywords: ['structured', 'artistic', 'refined', 'bold', 'confident'],
                gradient: 1
            },
            {
                name: 'Minimalist Traveler',
                description: 'Effortless elegance with practical versatility. Every piece serves multiple purposes while maintaining a cohesive aesthetic.',
                keywords: ['versatile', 'neutral', 'functional', 'clean', 'timeless'],
                gradient: 2
            },
            {
                name: 'Urban Sophisticate',
                description: 'Modern city living with elevated classics. Contemporary silhouettes meeting timeless quality and attention to detail.',
                keywords: ['sleek', 'modern', 'polished', 'urban', 'elevated'],
                gradient: 3
            }
        ];

        const addedAspirations = aspirations.map(asp => this.addAspiration(asp));

        // Create sample wardrobe items with analysis
        const wardrobeItems = [
            {
                name: 'Black Turtleneck',
                category: 'top',
                type: 'top',
                description: 'Classic merino wool turtleneck. Perfect layering piece that works across seasons.',
                color: 'Black',
                brand: 'Uniqlo',
                imageData: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect fill="%231a1a1a" width="400" height="500"/%3E%3Ctext x="50%25" y="50%25" fill="white" font-size="24" text-anchor="middle" dominant-baseline="middle"%3EBlack Turtleneck%3C/text%3E%3C/svg%3E'
            },
            {
                name: 'Slim Fit Chinos',
                category: 'bottom',
                type: 'bottom',
                description: 'Tailored chinos in navy. Versatile enough for both casual and smart-casual occasions.',
                color: 'Navy',
                brand: 'J.Crew',
                imageData: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect fill="%23001f3f" width="400" height="500"/%3E%3Ctext x="50%25" y="50%25" fill="white" font-size="24" text-anchor="middle" dominant-baseline="middle"%3ENavy Chinos%3C/text%3E%3C/svg%3E'
            },
            {
                name: 'White Oxford Shirt',
                category: 'top',
                type: 'top',
                description: 'Crisp white cotton oxford. A wardrobe essential that never goes out of style.',
                color: 'White',
                brand: 'Brooks Brothers',
                imageData: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect fill="%23ffffff" width="400" height="500"/%3E%3Ctext x="50%25" y="50%25" fill="%23333" font-size="24" text-anchor="middle" dominant-baseline="middle"%3EWhite Oxford%3C/text%3E%3C/svg%3E'
            },
            {
                name: 'Leather Chelsea Boots',
                category: 'shoes',
                type: 'shoes',
                description: 'Brown leather Chelsea boots. Sleek silhouette with timeless appeal.',
                color: 'Brown',
                brand: 'Thursday Boot Co.',
                imageData: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect fill="%238b4513" width="400" height="500"/%3E%3Ctext x="50%25" y="50%25" fill="white" font-size="24" text-anchor="middle" dominant-baseline="middle"%3EChelsea Boots%3C/text%3E%3C/svg%3E'
            },
            {
                name: 'Merino Cardigan',
                category: 'top',
                type: 'top',
                description: 'Lightweight merino cardigan in charcoal. Perfect for layering in transitional weather.',
                color: 'Charcoal',
                brand: 'Everlane',
                imageData: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect fill="%23404040" width="400" height="500"/%3E%3Ctext x="50%25" y="50%25" fill="white" font-size="24" text-anchor="middle" dominant-baseline="middle"%3EMerino Cardigan%3C/text%3E%3C/svg%3E'
            },
            {
                name: 'Slim Dark Jeans',
                category: 'bottom',
                type: 'bottom',
                description: 'Dark wash denim with slight stretch. A versatile foundation for countless outfits.',
                color: 'Dark Indigo',
                brand: "Levi's",
                imageData: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect fill="%23191970" width="400" height="500"/%3E%3Ctext x="50%25" y="50%25" fill="white" font-size="24" text-anchor="middle" dominant-baseline="middle"%3EDark Jeans%3C/text%3E%3C/svg%3E'
            },
            {
                name: 'Minimalist Watch',
                category: 'accessory',
                type: 'accessory',
                description: 'Simple leather strap watch with clean dial. Understated elegance for everyday wear.',
                color: 'Silver/Brown',
                brand: 'Skagen',
                imageData: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect fill="%23c0c0c0" width="400" height="500"/%3E%3Ctext x="50%25" y="50%25" fill="%23333" font-size="24" text-anchor="middle" dominant-baseline="middle"%3EWatch%3C/text%3E%3C/svg%3E'
            },
            {
                name: 'Canvas Backpack',
                category: 'accessory',
                type: 'accessory',
                description: 'Durable waxed canvas backpack. Functional design with vintage aesthetic.',
                color: 'Olive',
                brand: 'Filson',
                imageData: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect fill="%23808000" width="400" height="500"/%3E%3Ctext x="50%25" y="50%25" fill="white" font-size="24" text-anchor="middle" dominant-baseline="middle"%3EBackpack%3C/text%3E%3C/svg%3E'
            }
        ];

        // Add items and populate with dummy analysis
        wardrobeItems.forEach(itemData => {
            const item = this.addWardrobeItem(itemData);
            
            // Add analysis results for each aspiration
            addedAspirations.forEach((asp, index) => {
                let matchScore, reasoning;
                
                // Assign realistic match scores based on item and aspiration
                if (asp.name === 'Professional Creative') {
                    matchScore = item.name.includes('Turtleneck') ? 0.92 :
                                item.name.includes('Oxford') ? 0.88 :
                                item.name.includes('Cardigan') ? 0.85 :
                                item.name.includes('Boots') ? 0.78 :
                                item.name.includes('Chinos') ? 0.82 : 0.65;
                    reasoning = matchScore > 0.8 ? 
                        'This piece exemplifies the refined yet creative aesthetic. Its structured silhouette provides workplace credibility while maintaining artistic edge.' :
                        'Solid foundation piece that supports the professional creative identity with its versatile, polished appearance.';
                } else if (asp.name === 'Minimalist Traveler') {
                    matchScore = item.name.includes('Jeans') ? 0.90 :
                                item.name.includes('White Oxford') ? 0.85 :
                                item.name.includes('Backpack') ? 0.95 :
                                item.name.includes('Boots') ? 0.88 :
                                item.name.includes('Watch') ? 0.82 : 0.70;
                    reasoning = matchScore > 0.85 ? 
                        'Perfect for the minimalist traveler - versatile, durable, and effortlessly pairs with other pieces in your wardrobe.' :
                        'A functional piece that aligns with minimalist principles of quality over quantity.';
                } else {
                    matchScore = item.name.includes('Chinos') ? 0.89 :
                                item.name.includes('Oxford') ? 0.91 :
                                item.name.includes('Boots') ? 0.93 :
                                item.name.includes('Watch') ? 0.87 :
                                item.name.includes('Cardigan') ? 0.76 : 0.68;
                    reasoning = matchScore > 0.85 ?
                        'Embodies urban sophistication with its clean lines and elevated aesthetic. Perfect for modern city living.' :
                        'Contributes to a polished urban wardrobe with its contemporary appeal.';
                }
                
                this.updateItemAnalysis(item.id, asp.id, {
                    matchScore: matchScore,
                    reasoning: reasoning,
                    suggestions: `Pair with ${item.category === 'top' ? 'tailored trousers' : item.category === 'bottom' ? 'a structured blazer' : 'your favorite basics'} for a cohesive look.`
                });
            });
        });

        return true;
    }
};

// Make Storage globally available
window.Storage = Storage;
