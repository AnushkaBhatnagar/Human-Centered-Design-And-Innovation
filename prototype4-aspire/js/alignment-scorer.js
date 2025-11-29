// Alignment Scoring Engine
const AlignmentScorer = {
    // Calculate full alignment (legacy + per-aspiration)
    async calculateAlignment() {
        const identity = Storage.getIdentity();
        const wardrobe = Storage.getWardrobeItems();
        const recentLogs = Storage.getRecentLogs(7);
        const aspirations = Storage.getAspirations();

        if (!identity.archetype) {
            throw new Error('No identity defined');
        }

        const loading = ClaudeAI.showLoading('Calculating alignment...');

        try {
            // Calculate legacy overall alignment
            const alignment = await ClaudeAI.calculateAlignment(
                identity,
                wardrobe,
                recentLogs
            );

            // Calculate per-aspiration alignment
            const aspirationAlignments = {};
            for (const aspiration of aspirations) {
                aspirationAlignments[aspiration.id] = this.calculateAspirationAlignment(
                    aspiration,
                    wardrobe,
                    recentLogs
                );
            }

            // Combine and save
            alignment.perAspiration = aspirationAlignments;
            Storage.updateAlignment(alignment);
            
            ClaudeAI.hideLoading(loading);
            return alignment;
        } catch (error) {
            ClaudeAI.hideLoading(loading);
            throw error;
        }
    },

    // Calculate alignment for a specific aspiration
    calculateAspirationAlignment(aspiration, wardrobe, recentLogs) {
        // 1. Wardrobe Match Score
        const matchingItems = Storage.getMatchingItems(aspiration.id, 0.5);
        const wardrobeScore = wardrobe.length > 0 
            ? Math.round((matchingItems.length / wardrobe.length) * 100)
            : 0;

        // 2. Behavior Score - how often items for this aspiration are worn
        const aspirationLogs = recentLogs.filter(log => log.aspirationId === aspiration.id);
        const behaviorScore = recentLogs.length > 0
            ? Math.round((aspirationLogs.length / recentLogs.length) * 100)
            : 0;

        // 3. Overall Score - weighted average
        const overallScore = Math.round((wardrobeScore * 0.6) + (behaviorScore * 0.4));

        return {
            aspirationId: aspiration.id,
            aspirationName: aspiration.name,
            overall: overallScore,
            wardrobe: {
                score: wardrobeScore,
                matchingItems: matchingItems.length,
                totalItems: wardrobe.length
            },
            behavior: {
                score: behaviorScore,
                logsForAspiration: aspirationLogs.length,
                totalLogs: recentLogs.length,
                recentWears: aspirationLogs.length
            }
        };
    },

    // Get current alignment
    getAlignment() {
        return Storage.getAlignment();
    },

    // Get alignment history
    getHistory() {
        return Storage.getAlignmentHistory();
    },

    // Get per-aspiration alignments
    getAspirationAlignments() {
        const alignment = Storage.getAlignment();
        return alignment.perAspiration || {};
    }
};

window.AlignmentScorer = AlignmentScorer;
