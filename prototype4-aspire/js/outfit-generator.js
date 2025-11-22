// Outfit Generation Engine
const OutfitGenerator = {
    // Generate AI outfit
    async generateOutfit(occasion = 'everyday') {
        const identity = Storage.getIdentity();
        const wardrobe = Storage.getWardrobeItems();

        if (wardrobe.length < 3) {
            throw new Error('Add at least 3 items to generate outfits');
        }

        const loading = ClaudeAI.showLoading('Creating outfit...');

        try {
            const outfit = await ClaudeAI.generateOutfit(identity, wardrobe, occasion);

            const savedOutfit = Storage.addOutfit({
                name: outfit.name,
                items: outfit.itemIds,
                alignmentScore: outfit.alignmentScore,
                reason: outfit.reason,
                stylingTips: outfit.stylingTips,
                occasion: occasion
            });

            ClaudeAI.hideLoading(loading);
            return savedOutfit;
        } catch (error) {
            ClaudeAI.hideLoading(loading);
            throw error;
        }
    },

    // Get outfits
    getOutfits() {
        return Storage.getOutfits();
    },

    // Delete outfit
    deleteOutfit(id) {
        return Storage.deleteOutfit(id);
    }
};

window.OutfitGenerator = OutfitGenerator;
