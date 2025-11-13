// Add Item/Outfit Page JavaScript
let currentImage = null;
let selectedEmotions = [];
let selectedPurposes = [];
let selectedSeasons = [];
let selectedColor = '#000000';

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeUpload('outfit');
    initializeUpload('item');
    initializeTagSelectors();
    initializeColorPicker();
});

// Tab switching
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            switchTab(tab);
        });
    });
}

function switchTab(tab) {
    // Update buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tab}Tab`);
    });
}

// Initialize upload areas
function initializeUpload(type) {
    const uploadArea = document.getElementById(`${type}Upload`);
    const fileInput = document.getElementById(`${type}File`);
    const preview = document.getElementById(`${type}Preview`);
    const previewImg = document.getElementById(`${type}PreviewImg`);

    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());

    // File input change
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            await handleImageUpload(file, type, preview, previewImg);
        }
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', async (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            await handleImageUpload(file, type, preview, previewImg);
        }
    });
}

async function handleImageUpload(file, type, preview, previewImg) {
    try {
        const imageData = await App.handleImageUpload(file);
        const compressed = await App.compressImage(imageData);
        
        currentImage = compressed;
        previewImg.src = compressed;
        preview.classList.add('active');

        // Show analyze button for items
        if (type === 'item') {
            document.getElementById('analyzeBtn').style.display = 'inline-flex';
        }

        App.showToast('Image uploaded successfully!', 'success');
    } catch (error) {
        App.showToast('Error uploading image', 'error');
        console.error(error);
    }
}

// Initialize tag selectors
function initializeTagSelectors() {
    // Emotion tags
    const emotionTags = document.getElementById('emotionTags');
    emotionTags.addEventListener('click', (e) => {
        const tag = e.target.closest('.tag-option');
        if (tag) {
            tag.classList.toggle('selected');
            const tagValue = tag.dataset.tag;
            if (tag.classList.contains('selected')) {
                selectedEmotions.push(tagValue);
            } else {
                selectedEmotions = selectedEmotions.filter(t => t !== tagValue);
            }
        }
    });

    // Purpose tags
    const purposeTags = document.getElementById('purposeTags');
    purposeTags.addEventListener('click', (e) => {
        const tag = e.target.closest('.tag-option');
        if (tag) {
            tag.classList.toggle('selected');
            const tagValue = tag.dataset.tag;
            if (tag.classList.contains('selected')) {
                selectedPurposes.push(tagValue);
            } else {
                selectedPurposes = selectedPurposes.filter(t => t !== tagValue);
            }
        }
    });

    // Season tags
    const seasonTags = document.getElementById('seasonTags');
    seasonTags.addEventListener('click', (e) => {
        const tag = e.target.closest('.tag-option');
        if (tag) {
            tag.classList.toggle('selected');
            const tagValue = tag.dataset.tag;
            if (tag.classList.contains('selected')) {
                selectedSeasons.push(tagValue);
            } else {
                selectedSeasons = selectedSeasons.filter(t => t !== tagValue);
            }
        }
    });
}

// Initialize color picker
function initializeColorPicker() {
    const colorPicker = document.getElementById('colorPicker');
    const colorInput = document.getElementById('itemColor');

    // Set first color as selected by default
    colorPicker.querySelector('.color-option').classList.add('selected');

    colorPicker.addEventListener('click', (e) => {
        const colorOption = e.target.closest('.color-option');
        if (colorOption) {
            // Remove selected from all
            colorPicker.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected to clicked
            colorOption.classList.add('selected');
            selectedColor = colorOption.dataset.color;
            colorInput.value = selectedColor;
        }
    });
}

// AI Analysis
document.getElementById('analyzeBtn')?.addEventListener('click', async function() {
    if (!currentImage) {
        App.showToast('Please upload an image first', 'error');
        return;
    }

    App.showLoading(this);

    try {
        const analysis = await OpenAI.analyzeClothing(currentImage);
        
        if (analysis) {
            displayAIAnalysis(analysis);
            
            // Auto-fill form fields
            if (analysis.type) {
                const typeSelect = document.getElementById('itemType');
                const typeMap = {
                    'shirt': 'top',
                    'blouse': 'top',
                    't-shirt': 'top',
                    'sweater': 'top',
                    'pants': 'bottom',
                    'jeans': 'bottom',
                    'skirt': 'bottom',
                    'shorts': 'bottom',
                    'dress': 'dress',
                    'jacket': 'outerwear',
                    'coat': 'outerwear',
                    'blazer': 'outerwear',
                    'shoes': 'shoes',
                    'sneakers': 'shoes',
                    'boots': 'shoes'
                };
                
                const mappedType = typeMap[analysis.type.toLowerCase()] || 'other';
                typeSelect.value = mappedType;
            }

            App.showToast('Analysis complete!', 'success');
        } else {
            App.showToast('Could not analyze image', 'error');
        }
    } catch (error) {
        console.error('Analysis error:', error);
        App.showToast('Analysis failed', 'error');
    } finally {
        App.showLoading(this, false);
    }
});

function displayAIAnalysis(analysis) {
    const container = document.getElementById('aiAnalysis');
    container.innerHTML = `
        <div class="ai-analysis">
            <h4>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 3L12 8L17 8.5L13.5 12L14.5 17L10 14.5L5.5 17L6.5 12L3 8.5L8 8L10 3Z" fill="white"/>
                </svg>
                AI Analysis
            </h4>
            <p><strong>Type:</strong> ${analysis.type}</p>
            ${analysis.colors ? `<p><strong>Colors:</strong> ${analysis.colors.join(', ')}</p>` : ''}
            ${analysis.style ? `<p><strong>Style:</strong> ${analysis.style}</p>` : ''}
            ${analysis.occasions ? `<p><strong>Best for:</strong> ${analysis.occasions.join(', ')}</p>` : ''}
        </div>
    `;
}

// Form submissions
document.getElementById('outfitForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentImage) {
        App.showToast('Please upload an image', 'error');
        return;
    }

    if (selectedEmotions.length === 0 && selectedPurposes.length === 0) {
        App.showToast('Please select at least one emotion or purpose', 'error');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    App.showLoading(submitBtn);

    try {
        const outfit = {
            image: currentImage,
            emotions: selectedEmotions,
            purposes: selectedPurposes,
            notes: document.getElementById('outfitNotes').value,
            date: new Date().toISOString()
        };

        Storage.addOutfit(outfit);
        App.showToast('Outfit logged successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } catch (error) {
        console.error('Error saving outfit:', error);
        App.showToast('Error saving outfit', 'error');
        App.showLoading(submitBtn, false);
    }
});

document.getElementById('itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentImage) {
        App.showToast('Please upload an image', 'error');
        return;
    }

    const name = document.getElementById('itemName').value;
    if (!name.trim()) {
        App.showToast('Please enter an item name', 'error');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    App.showLoading(submitBtn);

    try {
        const item = {
            name: name.trim(),
            type: document.getElementById('itemType').value,
            color: selectedColor,
            season: selectedSeasons,
            image: currentImage,
            purchaseDate: new Date().toISOString()
        };

        Storage.addItem(item);
        App.showToast('Item added to closet!', 'success');
        
        setTimeout(() => {
            window.location.href = 'closet.html';
        }, 1000);
    } catch (error) {
        console.error('Error saving item:', error);
        App.showToast('Error saving item', 'error');
        App.showLoading(submitBtn, false);
    }
});
