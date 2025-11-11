import { ImageHandler } from './image.js';
import { GestureHandler } from './gesture.js';
import { RenderEngine } from './render.js';
import { ShareHandler } from './share.js';

class PhotoFrameApp {
    constructor() {
        this.canvas = document.getElementById('mainCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.statusMessage = document.getElementById('statusMessage');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.placeholderText = document.getElementById('placeholderText');
        
        this.fileInput = document.getElementById('fileInput');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.igFitBtn = document.getElementById('igFitBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.shareBtn = document.getElementById('shareBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.formatButtons = document.querySelectorAll('.format-btn');
        
        this.currentImage = null;
        this.frameImage = null;
        this.transform = {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0
        };
        
        this.isInteracting = false;
        this.renderTimeout = null;
        
        this.init();
    }
    
    async init() {
        try {
            this.imageHandler = new ImageHandler();
            this.gestureHandler = new GestureHandler(this.canvas);
            this.renderEngine = new RenderEngine(this.canvas, this.ctx);
            this.shareHandler = new ShareHandler();
            
            await this.loadFrame();
            this.setupEventListeners();
            this.checkClipboardSupport();
            this.updateUI();
            
            this.showStatus('Ready! Upload a photo to get started.', 'success');
        } catch (error) {
            console.error('App initialization failed:', error);
            this.showStatus('Failed to initialize app. Please refresh the page.', 'error');
        }
    }
    
    async loadFrame() {
        await this.loadFrameForCurrentFormat();
    }
    
    async loadFrameForCurrentFormat() {
        try {
            const formatInfo = this.renderEngine.getCurrentFormat();
            const framePath = `assets/frames/frame_${formatInfo.key}_${formatInfo.width}x${formatInfo.height}.png`;
            
            try {
                this.frameImage = await this.imageHandler.loadImageFromUrl(framePath);
            } catch {
                // Fallback to default frame
                try {
                    this.frameImage = await this.imageHandler.loadImageFromUrl('assets/frames/frame_1080.png');
                } catch {
                    this.frameImage = await this.imageHandler.loadImageFromUrl('assets/frames/frame_1080.svg');
                }
            }
        } catch (error) {
            console.warn('Could not load frame image:', error);
            this.frameImage = null;
        }
    }
    
    setupEventListeners() {
        this.uploadBtn.addEventListener('click', () => {
            this.fileInput.click();
        });
        
        this.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleImageUpload(e.target.files[0]);
            }
        });
        
        this.resetBtn.addEventListener('click', () => {
            this.resetTransform();
        });
        
        this.igFitBtn.addEventListener('click', () => {
            this.fitForInstagram();
        });
        
        this.downloadBtn.addEventListener('click', () => {
            this.downloadImage();
        });
        
        this.shareBtn.addEventListener('click', () => {
            this.shareImage();
        });
        
        this.copyBtn.addEventListener('click', () => {
            this.copyImage();
        });
        
        this.formatButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.currentTarget.dataset.format;
                this.changeOutputFormat(format);
            });
        });
        
        this.gestureHandler.on('transformStart', () => {
            this.isInteracting = true;
            this.startContinuousRender();
        });
        
        this.gestureHandler.on('transformUpdate', (transform) => {
            this.updateTransform(transform);
        });
        
        this.gestureHandler.on('transformEnd', () => {
            this.isInteracting = false;
            this.scheduleRenderStop();
        });
        
        this.gestureHandler.on('doubleTap', () => {
            this.centerImage();
        });
        
        window.addEventListener('resize', () => {
            this.scheduleRender();
        });
    }
    
    async handleImageUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            this.showStatus('Please select a valid image file.', 'error');
            return;
        }
        
        if (file.size > 50 * 1024 * 1024) {
            this.showStatus('Image file is too large. Please choose a file under 50MB.', 'error');
            return;
        }
        
        this.showLoading(true);
        this.showStatus('Processing image...');
        
        try {
            this.currentImage = await this.imageHandler.processImage(file);
            this.resetTransform();
            this.updateUI();
            this.scheduleRender();
            
            this.showStatus('Image loaded successfully! Use gestures to adjust position.', 'success');
        } catch (error) {
            console.error('Image upload failed:', error);
            this.showStatus('Failed to process image. Please try a different file.', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    updateTransform(deltaTransform) {
        if (!this.currentImage) return;
        
        const { dx, dy, scale, rotation } = deltaTransform;
        
        this.transform.x += dx || 0;
        this.transform.y += dy || 0;
        this.transform.scale = Math.max(0.1, Math.min(5, this.transform.scale * (scale || 1)));
        this.transform.rotation += rotation || 0;
        
        this.scheduleRender();
    }
    
    resetTransform() {
        if (!this.currentImage) return;
        
        const safeArea = this.renderEngine.getSafeArea();
        const imageAspect = this.currentImage.width / this.currentImage.height;
        const safeAspect = safeArea.width / safeArea.height;
        
        let scale;
        if (imageAspect > safeAspect) {
            scale = safeArea.width / this.currentImage.width;
        } else {
            scale = safeArea.height / this.currentImage.height;
        }
        
        this.transform = {
            x: 0,
            y: 0,
            scale: scale,
            rotation: 0
        };
        
        this.scheduleRender();
        this.showStatus('照片位置已重置', 'success');
    }
    
    centerImage() {
        if (!this.currentImage) return;
        
        this.transform.x = 0;
        this.transform.y = 0;
        
        this.scheduleRender();
        this.showStatus('Photo centered.', 'success');
    }
    
    fitForInstagram() {
        if (!this.currentImage) return;
        
        // Switch to square format if not already
        if (this.renderEngine.currentFormat !== 'square') {
            this.changeOutputFormat('square');
        }
        
        // Calculate optimal positioning for Instagram
        const safeArea = this.renderEngine.getSafeArea();
        const imageAspect = this.currentImage.width / this.currentImage.height;
        
        let scale;
        if (imageAspect > 1) {
            // Landscape image - fit width to safe area
            scale = safeArea.width / this.currentImage.width;
        } else {
            // Portrait or square image - fit height to safe area
            scale = safeArea.height / this.currentImage.height;
        }
        
        // Apply slightly smaller scale for better framing
        scale *= 0.95;
        
        this.transform = {
            x: 0,
            y: 0,
            scale: scale,
            rotation: 0
        };
        
        this.scheduleRender();
        this.showStatus('照片已最佳化為 Instagram 格式！', 'success');
    }
    
    async changeOutputFormat(format) {
        const success = this.renderEngine.setOutputFormat(format);
        if (!success) return;
        
        this.formatButtons.forEach(btn => {
            const isActive = btn.dataset.format === format;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-checked', isActive);
        });
        
        // Load frame for new format
        await this.loadFrameForCurrentFormat();
        
        if (this.currentImage) {
            this.resetTransform();
        }
        
        this.scheduleRender();
        
        const formatInfo = this.renderEngine.getCurrentFormat();
        this.showStatus(`已切換至${formatInfo.name}`, 'success');
    }
    
    checkClipboardSupport() {
        const supportsClipboard = navigator.clipboard && navigator.clipboard.write;
        if (supportsClipboard) {
            this.copyBtn.style.display = 'flex';
        }
    }
    
    async copyImage() {
        if (!this.currentImage) return;
        
        try {
            this.showStatus('Preparing to copy...');
            
            const blob = await this.renderEngine.exportImage(
                this.currentImage, 
                this.transform, 
                this.frameImage
            );
            
            const success = await this.shareHandler.copyImageToClipboard(blob);
            
            if (success) {
                this.showStatus('Image copied to clipboard!', 'success');
            } else {
                this.showStatus('Failed to copy. Try download instead.', 'error');
            }
        } catch (error) {
            console.error('Copy failed:', error);
            this.showStatus('Failed to copy image. Please try downloading instead.', 'error');
        }
    }
    
    startContinuousRender() {
        if (this.renderTimeout) {
            clearTimeout(this.renderTimeout);
            this.renderTimeout = null;
        }
        
        const render = () => {
            if (!this.isInteracting) return;
            
            this.render();
            requestAnimationFrame(render);
        };
        
        render();
    }
    
    scheduleRender() {
        if (this.renderTimeout) {
            clearTimeout(this.renderTimeout);
        }
        
        requestAnimationFrame(() => this.render());
    }
    
    scheduleRenderStop() {
        if (this.renderTimeout) {
            clearTimeout(this.renderTimeout);
        }
        
        this.renderTimeout = setTimeout(() => {
            this.render();
        }, 200);
    }
    
    render() {
        this.renderEngine.render(this.currentImage, this.transform, this.frameImage);
    }
    
    updateUI() {
        const hasImage = !!this.currentImage;
        
        this.resetBtn.disabled = !hasImage;
        this.igFitBtn.disabled = !hasImage;
        this.downloadBtn.disabled = !hasImage;
        this.shareBtn.disabled = !hasImage;
        this.copyBtn.disabled = !hasImage;
        
        this.canvas.classList.toggle('has-image', hasImage);
        this.placeholderText.classList.toggle('hidden', hasImage);
        
        if (hasImage) {
            this.gestureHandler.enable();
        } else {
            this.gestureHandler.disable();
        }
    }
    
    async downloadImage() {
        if (!this.currentImage) return;
        
        try {
            this.showStatus('Preparing download...');
            
            const blob = await this.renderEngine.exportImage(
                this.currentImage, 
                this.transform, 
                this.frameImage
            );
            
            const formatInfo = this.renderEngine.getCurrentFormat();
            const filename = `framed-photo-${formatInfo.key}-${formatInfo.width}x${formatInfo.height}.png`;
            
            await this.shareHandler.downloadBlob(blob, filename);
            this.showStatus('Image downloaded successfully!', 'success');
        } catch (error) {
            console.error('Download failed:', error);
            this.showStatus('Failed to download image. Please try again.', 'error');
        }
    }
    
    async shareImage() {
        if (!this.currentImage) return;
        
        try {
            this.showStatus('Preparing to share...');
            
            const blob = await this.renderEngine.exportImage(
                this.currentImage, 
                this.transform, 
                this.frameImage
            );
            
            const formatInfo = this.renderEngine.getCurrentFormat();
            const filename = `framed-photo-${formatInfo.key}-${formatInfo.width}x${formatInfo.height}.png`;
            const platforms = this.shareHandler.getPlatformRecommendation(formatInfo.key);
            const shareText = `我的${formatInfo.name}相框照片！適合 ${platforms.join('、')} #相框工具`;
            
            const success = await this.shareHandler.shareBlob(
                blob, 
                filename,
                shareText
            );
            
            if (success) {
                this.showStatus('Sharing...', 'success');
            } else {
                this.showStatus(`適合分享至：${platforms.join('、')}。圖片已下載。`, 'success');
            }
        } catch (error) {
            console.error('Share failed:', error);
            this.showStatus('Failed to share image. Please try downloading instead.', 'error');
        }
    }
    
    showStatus(message, type = '') {
        this.statusMessage.textContent = message;
        this.statusMessage.className = 'status-message' + (type ? ' ' + type : '');
        
        if (type && type !== 'error') {
            setTimeout(() => {
                if (this.statusMessage.textContent === message) {
                    this.statusMessage.textContent = '';
                    this.statusMessage.className = 'status-message';
                }
            }, 3000);
        }
    }
    
    showLoading(show) {
        this.loadingOverlay.classList.toggle('show', show);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PhotoFrameApp();
});