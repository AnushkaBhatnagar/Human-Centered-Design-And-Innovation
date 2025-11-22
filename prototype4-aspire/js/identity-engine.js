// Identity Definition Engine
const IdentityEngine = {
    // Process identity creation
    async createIdentity(images, keywords) {
        const loading = ClaudeAI.showLoading('Analyzing your identity...');
        
        try {
            const archetype = await ClaudeAI.analyzeIdentity(images, keywords);
            
            Storage.saveIdentityImages(images);
            Storage.saveIdentityKeywords(keywords);
            Storage.saveIdentityArchetype(archetype);
            
            ClaudeAI.hideLoading(loading);
            return archetype;
        } catch (error) {
            ClaudeAI.hideLoading(loading);
            throw error;
        }
    },

    // Get current identity
    getIdentity() {
        return Storage.getIdentity();
    },

    // Check if identity exists
    hasIdentity() {
        const identity = Storage.getIdentity();
        return identity.archetype !== null;
    }
};

window.IdentityEngine = IdentityEngine;
