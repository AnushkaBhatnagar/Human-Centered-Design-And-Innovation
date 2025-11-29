// Behavior Tracking Engine
const BehaviorTracker = {
    // Add daily log
    async addLog(selfieData, itemIds, aspirationId = null) {
        const identity = Storage.getIdentity();
        const items = itemIds.map(id => Storage.getWardrobeItemById(id)).filter(i => i);

        const loading = ClaudeAI.showLoading('Analyzing today\'s outfit...');

        try {
            const analysis = await ClaudeAI.analyzeDailyLog(items, identity);

            const log = {
                selfieData: selfieData,
                itemsWorn: itemIds,
                aspirationId: aspirationId, // Track which aspiration user was aiming for
                extractedData: {
                    colors: analysis.colors,
                    silhouette: analysis.silhouette,
                    formality: analysis.formality
                },
                aiAnalysis: analysis.insight,
                alignmentScore: analysis.alignmentScore
            };

            const savedLog = Storage.addDailyLog(log);
            ClaudeAI.hideLoading(loading);
            return savedLog;
        } catch (error) {
            ClaudeAI.hideLoading(loading);
            throw error;
        }
    },

    // Get logs
    getLogs() {
        return Storage.getDailyLogs();
    },

    getRecentLogs(days = 7) {
        return Storage.getRecentLogs(days);
    }
};

window.BehaviorTracker = BehaviorTracker;
