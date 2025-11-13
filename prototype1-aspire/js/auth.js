// Simple Authentication System
const Auth = {
    // Initialize auth
    init() {
        this.checkAuth();
    },

    // Check if user is authenticated
    checkAuth() {
        const user = Storage.getUser();
        return !!user;
    },

    // Create new user (onboarding)
    createUser(name, preferences = {}) {
        const user = {
            id: Storage.generateId(),
            name: name,
            preferences: preferences,
            createdAt: new Date().toISOString()
        };
        
        Storage.setUser(user);
        return user;
    },

    // Get current user
    getCurrentUser() {
        return Storage.getUser();
    },

    // Update user profile
    updateUser(updates) {
        const user = this.getCurrentUser();
        if (user) {
            const updated = { ...user, ...updates };
            Storage.setUser(updated);
            return updated;
        }
        return null;
    },

    // Logout (clear user data)
    logout() {
        Storage.remove(Storage.KEYS.USER);
        return true;
    },

    // Check if onboarding is complete
    isOnboardingComplete() {
        const user = this.getCurrentUser();
        if (!user) return false;
        
        // Check if user has at least one aspiration
        const aspirations = Storage.getAspirations();
        return aspirations.length > 0;
    },

    // Get user initials for avatar
    getUserInitials() {
        const user = this.getCurrentUser();
        if (!user || !user.name) return '?';
        
        const names = user.name.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        }
        return names[0][0].toUpperCase();
    }
};

// Make Auth globally available
window.Auth = Auth;
