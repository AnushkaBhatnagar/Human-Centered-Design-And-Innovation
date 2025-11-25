// Aspire Loop - Local Storage Management
const Storage = {
    STORAGE_KEY: 'aspire_loop_data',

    // Initialize default data structure
    getDefaultData() {
        return {
            user: {
                name: '',
                onboardingComplete: false,
                createdAt: Date.now()
            },
            identity: {
                inspirationImages: [],
                keywords: [],
                archetype: null
            },
            images: {}, // Store unique images with IDs
            wardrobe: {
                items: []
            },
            behavior: {
                dailyLogs: []
            },
            alignment: {
                overall: 0,
                identity: { score: 0, insights: [] },
                wardrobe: { score: 0, insights: [] },
                behavior: { score: 0, insights: [] },
                history: []
            },
            outfits: [],
            recommendations: []
        };
    },

    // Get all data
    getData() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error parsing stored data:', e);
                return this.getDefaultData();
            }
        }
        return this.getDefaultData();
    },

    // Save all data
    saveData(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving data:', e);
            return false;
        }
    },

    // User methods
    createUser(name) {
        const data = this.getData();
        data.user.name = name;
        data.user.onboardingComplete = false;
        this.saveData(data);
        return data.user;
    },

    getUser() {
        return this.getData().user;
    },

    completeOnboarding() {
        const data = this.getData();
        data.user.onboardingComplete = true;
        this.saveData(data);
    },

    isOnboardingComplete() {
        return this.getData().user.onboardingComplete;
    },

    // Identity methods
    saveIdentityImages(images) {
        const data = this.getData();
        data.identity.inspirationImages = images;
        this.saveData(data);
    },

    saveIdentityKeywords(keywords) {
        const data = this.getData();
        data.identity.keywords = keywords;
        this.saveData(data);
    },

    saveIdentityArchetype(archetype) {
        const data = this.getData();
        data.identity.archetype = archetype;
        this.saveData(data);
    },

    getIdentity() {
        return this.getData().identity;
    },

    // Image methods
    addImage(imageData) {
        const data = this.getData();
        if (!data.images) data.images = {};
        
        const imageId = this.generateId();
        data.images[imageId] = imageData;
        const saved = this.saveData(data);
        return saved ? imageId : null;
    },

    getImage(imageId) {
        const data = this.getData();
        return data.images?.[imageId] || null;
    },

    deleteUnusedImages() {
        const data = this.getData();
        if (!data.images) return;
        
        // Collect all imageIds in use
        const usedImageIds = new Set();
        data.wardrobe.items.forEach(item => {
            if (item.imageId) usedImageIds.add(item.imageId);
        });
        
        // Delete unused images
        Object.keys(data.images).forEach(imageId => {
            if (!usedImageIds.has(imageId)) {
                delete data.images[imageId];
            }
        });
        
        this.saveData(data);
    },

    // Wardrobe methods
    addWardrobeItem(item) {
        const data = this.getData();
        const newItem = {
            id: this.generateId(),
            ...item,
            addedAt: Date.now(),
            lastWorn: null
        };
        data.wardrobe.items.push(newItem);
        const saved = this.saveData(data);
        return saved ? newItem : null;
    },

    getWardrobeItems() {
        return this.getData().wardrobe.items;
    },

    getWardrobeItemById(id) {
        const items = this.getWardrobeItems();
        return items.find(item => item.id === id);
    },

    deleteWardrobeItem(id) {
        const data = this.getData();
        data.wardrobe.items = data.wardrobe.items.filter(item => item.id !== id);
        this.saveData(data);
    },

    updateWardrobeItem(id, updates) {
        const data = this.getData();
        const index = data.wardrobe.items.findIndex(item => item.id === id);
        if (index !== -1) {
            data.wardrobe.items[index] = {
                ...data.wardrobe.items[index],
                ...updates
            };
            this.saveData(data);
            return data.wardrobe.items[index];
        }
        return null;
    },

    // Daily log methods
    addDailyLog(log) {
        const data = this.getData();
        const newLog = {
            id: this.generateId(),
            ...log,
            timestamp: Date.now()
        };
        data.behavior.dailyLogs.push(newLog);
        
        // Update lastWorn for items
        if (log.itemsWorn) {
            log.itemsWorn.forEach(itemId => {
                this.updateWardrobeItem(itemId, { lastWorn: Date.now() });
            });
        }
        
        this.saveData(data);
        return newLog;
    },

    getDailyLogs() {
        return this.getData().behavior.dailyLogs;
    },

    getRecentLogs(days = 7) {
        const logs = this.getDailyLogs();
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        return logs.filter(log => log.timestamp > cutoff);
    },

    // Alignment methods
    updateAlignment(alignmentData) {
        const data = this.getData();
        data.alignment = {
            ...data.alignment,
            ...alignmentData,
            updatedAt: Date.now()
        };
        
        // Add to history
        data.alignment.history.push({
            timestamp: Date.now(),
            overall: alignmentData.overall,
            identity: alignmentData.identity.score,
            wardrobe: alignmentData.wardrobe.score,
            behavior: alignmentData.behavior.score
        });
        
        // Keep only last 30 entries
        if (data.alignment.history.length > 30) {
            data.alignment.history = data.alignment.history.slice(-30);
        }
        
        this.saveData(data);
    },

    getAlignment() {
        return this.getData().alignment;
    },

    getAlignmentHistory() {
        return this.getData().alignment.history;
    },

    // Outfit methods
    addOutfit(outfit) {
        const data = this.getData();
        const newOutfit = {
            id: this.generateId(),
            ...outfit,
            createdAt: Date.now()
        };
        data.outfits.push(newOutfit);
        this.saveData(data);
        return newOutfit;
    },

    getOutfits() {
        return this.getData().outfits;
    },

    deleteOutfit(id) {
        const data = this.getData();
        data.outfits = data.outfits.filter(outfit => outfit.id !== id);
        this.saveData(data);
    },

    // Recommendations methods
    setRecommendations(recommendations) {
        const data = this.getData();
        data.recommendations = recommendations.map(rec => ({
            id: this.generateId(),
            ...rec,
            createdAt: Date.now()
        }));
        this.saveData(data);
    },

    getRecommendations() {
        return this.getData().recommendations;
    },

    clearRecommendations() {
        const data = this.getData();
        data.recommendations = [];
        this.saveData(data);
    },

    // Utility methods
    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    clearAll() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    exportData() {
        return this.getData();
    },

    importData(importedData) {
        try {
            this.saveData(importedData);
            return true;
        } catch (e) {
            console.error('Error importing data:', e);
            return false;
        }
    },

    // Stats
    getStats() {
        const data = this.getData();
        return {
            wardrobeItems: data.wardrobe.items.length,
            dailyLogs: data.behavior.dailyLogs.length,
            outfits: data.outfits.length,
            alignmentScore: data.alignment.overall
        };
    }
};

// Make globally available
window.Storage = Storage;
