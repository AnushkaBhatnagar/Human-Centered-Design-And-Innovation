// Alignment Scoring Engine
const AlignmentScorer = {
    // Calculate full alignment
    async calculateAlignment() {
        const identity = Storage.getIdentity();
        const wardrobe = Storage.getWardrobeItems();
        const recentLogs = Storage.getRecentLogs(7);

        if (!identity.archetype) {
            throw new Error('No identity defined');
        }

        const loading = ClaudeAI.showLoading('Calculating alignment...');

        try {
            const alignment = await ClaudeAI.calculateAlignment(
                identity,
                wardrobe,
                recentLogs
            );

            Storage.updateAlignment(alignment);
            ClaudeAI.hideLoading(loading);
            return alignment;
        } catch (error) {
            ClaudeAI.hideLoading(loading);
            throw error;
        }
    },

    // Get current alignment
    getAlignment() {
        return Storage.getAlignment();
    },

    // Get alignment history
    getHistory() {
        return Storage.getAlignmentHistory();
    }
};

window.AlignmentScorer = AlignmentScorer;
