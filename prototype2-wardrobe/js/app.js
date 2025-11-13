// Utility functions and helpers
const App = {
    // Image handling
    handleImageUpload(file) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('Please select an image file'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(file);
        });
    },

    // Compress image for storage
    compressImage(base64Image, maxWidth = 800) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = base64Image;
        });
    },

    // Format date helpers
    formatDate(dateStr, format = 'short') {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (format === 'relative') {
            if (date.toDateString() === today.toDateString()) {
                return 'Today';
            } else if (date.toDateString() === yesterday.toDateString()) {
                return 'Yesterday';
            }
        }

        if (format === 'short') {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        if (format === 'long') {
            return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }

        return date.toLocaleDateString();
    },

    // Color utilities
    getColorName(hexColor) {
        const colors = {
            '#000000': 'Black',
            '#FFFFFF': 'White',
            '#FF0000': 'Red',
            '#00FF00': 'Green',
            '#0000FF': 'Blue',
            '#FFFF00': 'Yellow',
            '#FFA500': 'Orange',
            '#800080': 'Purple',
            '#FFC0CB': 'Pink',
            '#A52A2A': 'Brown',
            '#808080': 'Gray',
            '#000080': 'Navy',
            '#F5F5DC': 'Beige'
        };

        // Find closest color
        let closestColor = 'Unknown';
        let minDistance = Infinity;

        for (const [hex, name] of Object.entries(colors)) {
            const distance = this.colorDistance(hexColor, hex);
            if (distance < minDistance) {
                minDistance = distance;
                closestColor = name;
            }
        }

        return closestColor;
    },

    colorDistance(color1, color2) {
        const r1 = parseInt(color1.slice(1, 3), 16);
        const g1 = parseInt(color1.slice(3, 5), 16);
        const b1 = parseInt(color1.slice(5, 7), 16);
        const r2 = parseInt(color2.slice(1, 3), 16);
        const g2 = parseInt(color2.slice(3, 5), 16);
        const b2 = parseInt(color2.slice(5, 7), 16);

        return Math.sqrt(
            Math.pow(r1 - r2, 2) +
            Math.pow(g1 - g2, 2) +
            Math.pow(b1 - b2, 2)
        );
    },

    // Show toast notification
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            animation: 'slideIn 0.3s ease',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        });

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Loading state
    showLoading(element, show = true) {
        if (show) {
            element.classList.add('loading');
            element.disabled = true;
            const originalText = element.textContent;
            element.dataset.originalText = originalText;
            element.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="animation: spin 1s linear infinite;">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" opacity="0.25"/>
                    <path d="M10 2C6 2 2.5 5.5 2 9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>Processing...</span>
            `;
        } else {
            element.classList.remove('loading');
            element.disabled = false;
            element.textContent = element.dataset.originalText || 'Submit';
        }
    },

    // Modal helpers
    createModal(content, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                ${options.title ? `<h2 class="modal-title">${options.title}</h2>` : ''}
                <div class="modal-body">${content}</div>
                ${options.showClose !== false ? '<button class="modal-close">&times;</button>' : ''}
            </div>
        `;

        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => modal.remove(), 200);
        };

        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-close')) {
                closeModal();
            }
        });

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.2s ease;
            }
            .modal-content {
                background: white;
                border-radius: 1rem;
                padding: 2rem;
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            }
            .modal-title {
                margin-bottom: 1rem;
                font-size: 1.5rem;
                font-weight: 700;
            }
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: #a8a29e;
                line-height: 1;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            @keyframes slideIn {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(100%); opacity: 0; }
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(modal);
        return { modal, close: closeModal };
    },

    // Filter items
    filterItems(items, filters) {
        return items.filter(item => {
            if (filters.type && item.type !== filters.type) return false;
            if (filters.color && item.color !== filters.color) return false;
            if (filters.season && !item.season?.includes(filters.season)) return false;
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                return item.name.toLowerCase().includes(searchLower) ||
                       item.tags?.some(tag => tag.toLowerCase().includes(searchLower));
            }
            return true;
        });
    },

    // Sort items
    sortItems(items, sortBy) {
        const sorted = [...items];
        switch (sortBy) {
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'mostWorn':
                return sorted.sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0));
            case 'leastWorn':
                return sorted.sort((a, b) => (a.wearCount || 0) - (b.wearCount || 0));
            default:
                return sorted;
        }
    },

    // Generate recommendations based on weather/mood
    generateRecommendations(items, criteria) {
        // Simple rule-based recommendations
        let filtered = [...items];

        if (criteria.weather === 'cold') {
            filtered = filtered.filter(item => 
                item.season?.includes('winter') || item.season?.includes('fall')
            );
        } else if (criteria.weather === 'hot') {
            filtered = filtered.filter(item => 
                item.season?.includes('summer') || item.season?.includes('spring')
            );
        }

        if (criteria.formality === 'formal') {
            filtered = filtered.filter(item => 
                item.tags?.includes('formal') || item.type === 'suit'
            );
        } else if (criteria.formality === 'casual') {
            filtered = filtered.filter(item => 
                item.tags?.includes('casual')
            );
        }

        // Return random selection
        return this.shuffleArray(filtered).slice(0, 6);
    },

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
};

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .loading {
        opacity: 0.6;
        pointer-events: none;
    }
`;
document.head.appendChild(animationStyles);
