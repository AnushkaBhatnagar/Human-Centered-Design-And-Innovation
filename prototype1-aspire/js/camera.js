// Camera and Image Upload Handler
const Camera = {
    // Initialize camera/upload functionality
    init() {
        // Check if camera is available
        this.hasCamera = this.checkCameraSupport();
    },

    // Check if device has camera support
    checkCameraSupport() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    },

    // Create file input for image selection
    createFileInput(callback) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment'; // Prefer back camera on mobile
        
        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const imageData = await this.processImage(file);
                    callback(imageData, null);
                } catch (error) {
                    callback(null, error);
                }
            }
        });
        
        return input;
    },

    // Open camera or file picker
    async captureImage(callback) {
        const input = this.createFileInput(callback);
        input.click();
    },

    // Process image file
    async processImage(file) {
        return new Promise((resolve, reject) => {
            // Check file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                reject(new Error('Image size must be less than 5MB'));
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                reject(new Error('File must be an image'));
                return;
            }

            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Resize image if needed
                    const resized = this.resizeImage(img, 800);
                    resolve({
                        dataUrl: resized,
                        fileName: file.name,
                        fileType: file.type,
                        fileSize: file.size
                    });
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    },

    // Resize image to max width while maintaining aspect ratio
    resizeImage(img, maxWidth) {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        return canvas.toDataURL('image/jpeg', 0.85);
    },

    // Create image preview element
    createPreview(imageData) {
        const preview = document.createElement('div');
        preview.className = 'image-preview animate-scaleIn';
        
        const img = document.createElement('img');
        img.src = imageData.dataUrl;
        img.alt = 'Preview';
        
        preview.appendChild(img);
        return preview;
    },

    // Create upload area element
    createUploadArea(onUpload) {
        const area = document.createElement('div');
        area.className = 'upload-area';
        area.innerHTML = `
            <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
            </svg>
            <p class="upload-text">Take a photo or upload</p>
            <p class="upload-hint">Tap to add from camera or gallery</p>
        `;

        area.addEventListener('click', () => {
            this.captureImage((imageData, error) => {
                if (error) {
                    console.error('Upload error:', error);
                    Utils.showToast(error.message, 'error');
                } else {
                    onUpload(imageData);
                }
            });
        });

        return area;
    },

    // Add drag and drop support
    addDragAndDrop(element, callback) {
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            element.classList.add('active');
        });

        element.addEventListener('dragleave', () => {
            element.classList.remove('active');
        });

        element.addEventListener('drop', async (e) => {
            e.preventDefault();
            element.classList.remove('active');

            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                try {
                    const imageData = await this.processImage(file);
                    callback(imageData, null);
                } catch (error) {
                    callback(null, error);
                }
            }
        });
    },

    // Get image dimensions
    getImageDimensions(dataUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height
                });
            };
            img.src = dataUrl;
        });
    },

    // Convert data URL to blob
    dataUrlToBlob(dataUrl) {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    },

    // Compress image further if needed
    async compressImage(dataUrl, quality = 0.7) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = dataUrl;
        });
    }
};

// Initialize camera on load
Camera.init();

// Make Camera globally available
window.Camera = Camera;
