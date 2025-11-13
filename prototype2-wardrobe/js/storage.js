// Local Storage Management System
const Storage = {
    // Keys for localStorage
    KEYS: {
        ITEMS: 'wardrobe_items',
        OUTFITS: 'wardrobe_outfits',
        SETTINGS: 'wardrobe_settings',
        PURCHASES: 'wardrobe_purchases'
    },

    // Get all items
    getItems() {
        const data = localStorage.getItem(this.KEYS.ITEMS);
        return data ? JSON.parse(data) : [];
    },

    // Save items
    saveItems(items) {
        localStorage.setItem(this.KEYS.ITEMS, JSON.stringify(items));
    },

    // Add new item
    addItem(item) {
        const items = this.getItems();
        const newItem = {
            id: this.generateId(),
            name: item.name || 'Untitled Item',
            type: item.type || 'other',
            color: item.color || '',
            season: item.season || [],
            image: item.image || '',
            purchaseDate: item.purchaseDate || new Date().toISOString(),
            wearCount: 0,
            tags: item.tags || [],
            notes: item.notes || '',
            createdAt: new Date().toISOString()
        };
        items.push(newItem);
        this.saveItems(items);
        return newItem;
    },

    // Update item
    updateItem(id, updates) {
        const items = this.getItems();
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            this.saveItems(items);
            return items[index];
        }
        return null;
    },

    // Delete item
    deleteItem(id) {
        const items = this.getItems().filter(item => item.id !== id);
        this.saveItems(items);
    },

    // Increment wear count
    incrementWearCount(id) {
        const items = this.getItems();
        const item = items.find(i => i.id === id);
        if (item) {
            item.wearCount = (item.wearCount || 0) + 1;
            this.saveItems(items);
        }
    },

    // Get all outfits
    getOutfits() {
        const data = localStorage.getItem(this.KEYS.OUTFITS);
        return data ? JSON.parse(data) : [];
    },

    // Save outfits
    saveOutfits(outfits) {
        localStorage.setItem(this.KEYS.OUTFITS, JSON.stringify(outfits));
    },

    // Add new outfit
    addOutfit(outfit) {
        const outfits = this.getOutfits();
        const newOutfit = {
            id: this.generateId(),
            date: outfit.date || new Date().toISOString(),
            image: outfit.image || '',
            items: outfit.items || [],
            emotions: outfit.emotions || [],
            purposes: outfit.purposes || [],
            notes: outfit.notes || '',
            weather: outfit.weather || '',
            location: outfit.location || '',
            createdAt: new Date().toISOString()
        };
        outfits.push(newOutfit);
        this.saveOutfits(outfits);
        
        // Increment wear counts for items in outfit
        if (newOutfit.items && newOutfit.items.length > 0) {
            newOutfit.items.forEach(itemId => {
                this.incrementWearCount(itemId);
            });
        }
        
        return newOutfit;
    },

    // Update outfit
    updateOutfit(id, updates) {
        const outfits = this.getOutfits();
        const index = outfits.findIndex(outfit => outfit.id === id);
        if (index !== -1) {
            outfits[index] = { ...outfits[index], ...updates };
            this.saveOutfits(outfits);
            return outfits[index];
        }
        return null;
    },

    // Delete outfit
    deleteOutfit(id) {
        const outfits = this.getOutfits().filter(outfit => outfit.id !== id);
        this.saveOutfits(outfits);
    },

    // Get purchases
    getPurchases() {
        const data = localStorage.getItem(this.KEYS.PURCHASES);
        return data ? JSON.parse(data) : [];
    },

    // Add purchase
    addPurchase(purchase) {
        const purchases = this.getPurchases();
        const newPurchase = {
            id: this.generateId(),
            itemId: purchase.itemId || null,
            name: purchase.name || '',
            price: purchase.price || 0,
            store: purchase.store || '',
            date: purchase.date || new Date().toISOString(),
            category: purchase.category || '',
            notes: purchase.notes || ''
        };
        purchases.push(newPurchase);
        localStorage.setItem(this.KEYS.PURCHASES, JSON.stringify(purchases));
        return newPurchase;
    },

    // Get settings
    getSettings() {
        const data = localStorage.getItem(this.KEYS.SETTINGS);
        return data ? JSON.parse(data) : {
            theme: 'light',
            apiKey: '',
            notifications: true,
            autoAnalyze: true
        };
    },

    // Save settings
    saveSettings(settings) {
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Clear all data
    clearAll() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    },

    // Export data
    exportData() {
        return {
            items: this.getItems(),
            outfits: this.getOutfits(),
            purchases: this.getPurchases(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };
    },

    // Import data
    importData(data) {
        if (data.items) this.saveItems(data.items);
        if (data.outfits) this.saveOutfits(data.outfits);
        if (data.purchases) localStorage.setItem(this.KEYS.PURCHASES, JSON.stringify(data.purchases));
        if (data.settings) this.saveSettings(data.settings);
    },

    // Get analytics data
    getAnalytics(period = 'month') {
        const outfits = this.getOutfits();
        const items = this.getItems();
        const now = new Date();
        let startDate;

        switch (period) {
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case 'year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                startDate = new Date(0);
        }

        const filteredOutfits = outfits.filter(o => new Date(o.date) >= startDate);

        // Calculate emotion frequencies
        const emotionCounts = {};
        filteredOutfits.forEach(outfit => {
            outfit.emotions?.forEach(emotion => {
                emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
            });
        });

        // Calculate purpose frequencies
        const purposeCounts = {};
        filteredOutfits.forEach(outfit => {
            outfit.purposes?.forEach(purpose => {
                purposeCounts[purpose] = (purposeCounts[purpose] || 0) + 1;
            });
        });

        // Calculate color frequencies
        const colorCounts = {};
        items.forEach(item => {
            if (item.color) {
                colorCounts[item.color] = (colorCounts[item.color] || 0) + (item.wearCount || 0);
            }
        });

        // Get most and least worn items
        const sortedItems = [...items].sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0));
        const mostWorn = sortedItems.slice(0, 5);
        const leastWorn = sortedItems.filter(item => (item.wearCount || 0) === 0);

        return {
            period,
            totalOutfits: filteredOutfits.length,
            totalItems: items.length,
            emotionCounts,
            purposeCounts,
            colorCounts,
            mostWorn,
            leastWorn,
            averageWearCount: items.reduce((sum, item) => sum + (item.wearCount || 0), 0) / items.length || 0
        };
    }
};

// Initialize with sample data if empty
if (Storage.getItems().length === 0 && Storage.getOutfits().length === 0) {
    console.log('Initializing with sample data...');
    // You can add sample data here if needed
}
