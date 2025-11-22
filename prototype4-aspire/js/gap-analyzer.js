// Gap Analysis & Recommendations Engine
const GapAnalyzer = {
    // Generate recommendations
    async generateRecommendations() {
        const identity = Storage.getIdentity();
        const wardrobe = Storage.getWardrobeItems();
        const alignment = Storage.getAlignment();

        if (!identity.archetype) {
            throw new Error('Define your identity first');
        }

        const loading = ClaudeAI.showLoading('Analyzing gaps...');

        try {
            const recommendations = await ClaudeAI.generateRecommendations(
                identity,
                wardrobe,
                alignment
            );

            Storage.setRecommendations(recommendations);
            ClaudeAI.hideLoading(loading);
            return recommendations;
        } catch (error) {
            ClaudeAI.hideLoading(loading);
            throw error;
        }
    },

    // Get recommendations
    getRecommendations() {
        return Storage.getRecommendations();
    },

    // Clear recommendations
    clearRecommendations() {
        return Storage.clearRecommendations();
    }
};

window.GapAnalyzer = GapAnalyzer;
