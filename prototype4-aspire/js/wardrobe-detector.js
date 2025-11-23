// Wardrobe Auto-Detection Engine
const WardrobeDetector = {
    // Add item with AI detection
    async addItemWithDetection(description, imageData = null) {
        const loading = ClaudeAI.showLoading('Analyzing item...');
        
        try {
            const detected = await ClaudeAI.detectWardrobeItem(description, imageData);
            
            const item = {
                name: detected.name,
                category: detected.category,
                color: detected.color,
                style: detected.style,
                formality: detected.formality,
                season: detected.season,
                imageData: imageData,
                source: 'manual',
                confirmed: true
            };
            
            const savedItem = Storage.addWardrobeItem(item);
            ClaudeAI.hideLoading(loading);
            return savedItem;
        } catch (error) {
            ClaudeAI.hideLoading(loading);
            throw error;
        }
    },

    // Quick add without AI (for confirmed items)
    addItem(itemData) {
        return Storage.addWardrobeItem({
            ...itemData,
            source: 'manual',
            confirmed: true
        });
    },

    // Get all items
    getItems() {
        return Storage.getWardrobeItems();
    },

    // Delete item
    deleteItem(id) {
        return Storage.deleteWardrobeItem(id);
    }
};

window.WardrobeDetector = WardrobeDetector;
