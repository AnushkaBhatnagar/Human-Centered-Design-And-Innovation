// Progress Tracking Engine
const ProgressTracker = {
    // Get progress data
    getProgress() {
        const alignment = Storage.getAlignment();
        const history = Storage.getAlignmentHistory();
        const logs = Storage.getRecentLogs(7);
        const wardrobe = Storage.getWardrobeItems();

        return {
            currentAlignment: alignment,
            history: history,
            weeklyLogs: logs,
            wardrobeSize: wardrobe.length,
            trend: this.calculateTrend(history)
        };
    },

    // Calculate trend
    calculateTrend(history) {
        if (history.length < 2) return 0;
        
        const recent = history.slice(-7);
        const first = recent[0].overall;
        const last = recent[recent.length - 1].overall;
        
        return last - first;
    },

    // Get weekly summary
    getWeeklySummary() {
        const logs = Storage.getRecentLogs(7);
        const alignment = Storage.getAlignment();

        return {
            daysLogged: logs.length,
            averageScore: logs.length > 0 
                ? Math.round(logs.reduce((sum, log) => sum + log.alignmentScore, 0) / logs.length)
                : 0,
            topInsight: alignment.behavior.insights[0] || 'Keep logging daily outfits',
            change: this.calculateTrend(Storage.getAlignmentHistory())
        };
    }
};

window.ProgressTracker = ProgressTracker;
