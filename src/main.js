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
        this.rotateBtn = document.getElementById('rotateBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.shareBtn = document.getElementById('shareBtn');
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
            this.shareHandler = await new ShareHandler().init();
            
            await this.loadFrame();
            this.setupEventListeners();
            this.updateUI();
            
            // 顯示分享方法說明
            const shareMethod = this.shareHandler.getShareMethodDescription();
            console.log('分享功能初始化：', shareMethod);
            
            this.showStatus('準備就緒！上傳照片開始使用。', 'success');
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
        
        this.rotateBtn.addEventListener('click', () => {
            this.rotateImage();
        });
        
        this.downloadBtn.addEventListener('click', () => {
            this.downloadImage();
        });
        
        this.shareBtn.addEventListener('click', () => {
            this.shareImage();
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
        // 強化檔案驗證
        const validationResult = this.validateImageFile(file);
        if (!validationResult.isValid) {
            this.showStatus(validationResult.message, 'error');
            return;
        }
        
        this.showLoading(true);
        this.showStatus('Processing image...');
        
        try {
            console.log('開始處理圖片：', {
                name: file.name,
                type: file.type,
                size: file.size,
                lastModified: new Date(file.lastModified)
            });
            
            this.currentImage = await this.imageHandler.processImage(file);
            this.resetTransform();
            this.updateUI();
            this.scheduleRender();
            
            console.log('圖片處理成功');
            this.showStatus('圖片載入成功！可使用手勢調整位置，或點擊旋轉按鈕調整方向。', 'success');
        } catch (error) {
            console.error('圖片上傳失敗，詳細錯誤：', error);
            
            // 提供更具體的錯誤訊息
            let errorMessage = '圖片處理失敗。';
            
            if (error.message.includes('Failed to load image')) {
                errorMessage = '無法載入圖片檔案，請確認檔案格式正確。';
            } else if (error.message.includes('Failed to read file')) {
                errorMessage = '無法讀取檔案，請重新選擇圖片。';
            } else if (error.message.includes('EXIF')) {
                errorMessage = '圖片方向資訊處理失敗，但仍可繼續使用。';
            } else if (error.message.includes('Canvas')) {
                errorMessage = '圖片處理失敗，可能檔案過大或格式不支援。';
            }
            
            // 如果是 HEIC 格式問題
            if (file.name.toLowerCase().includes('.heic') || file.name.toLowerCase().includes('.heif')) {
                errorMessage = 'HEIC 格式不被支援，請在 iPhone 設定中改為 JPEG 格式拍攝，或使用其他圖片。';
            }
            
            this.showStatus(errorMessage, 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    validateImageFile(file) {
        if (!file) {
            return { isValid: false, message: '請選擇圖片檔案。' };
        }
        
        // 檢查檔案大小
        if (file.size > 50 * 1024 * 1024) {
            return { isValid: false, message: '圖片檔案過大，請選擇小於 50MB 的檔案。' };
        }
        
        // 檢查檔案類型
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        const fileExtension = file.name.toLowerCase().split('.').pop();
        const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        
        // HEIC/HEIF 格式特殊處理
        if (fileExtension === 'heic' || fileExtension === 'heif' || file.type === 'image/heic' || file.type === 'image/heif') {
            return { 
                isValid: false, 
                message: 'HEIC 格式不被支援。請在 iPhone 相機設定中選擇「最兼容」格式，或使用其他 JPEG/PNG 圖片。' 
            };
        }
        
        // 基本類型檢查
        if (!file.type.startsWith('image/') && !validExtensions.includes(fileExtension)) {
            return { isValid: false, message: '請選擇有效的圖片檔案（支援 JPEG、PNG、WebP、GIF）。' };
        }
        
        // 進一步驗證 MIME type
        if (!validTypes.includes(file.type) && file.type !== '') {
            console.warn('未知的 MIME type：', file.type, '檔案名稱：', file.name);
            // 如果副檔名正確，仍然允許處理
            if (!validExtensions.includes(fileExtension)) {
                return { isValid: false, message: '不支援的圖片格式，請使用 JPEG、PNG、WebP 或 GIF。' };
            }
        }
        
        return { isValid: true };
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
    
    rotateImage() {
        if (!this.currentImage) return;
        
        // 順時針旋轉 90 度
        this.transform.rotation += Math.PI / 2;
        
        // 保持旋轉值在 0-2π 範圍內
        if (this.transform.rotation >= Math.PI * 2) {
            this.transform.rotation -= Math.PI * 2;
        }
        
        this.scheduleRender();
        this.showStatus('照片已旋轉 90 度', 'success');
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
        this.rotateBtn.disabled = !hasImage;
        this.downloadBtn.disabled = !hasImage;
        this.shareBtn.disabled = !hasImage;
        
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
            this.showStatus('準備分享...');
            
            const blob = await this.renderEngine.exportImage(
                this.currentImage, 
                this.transform, 
                this.frameImage
            );
            
            const formatInfo = this.renderEngine.getCurrentFormat();
            const filename = `framed-photo-${formatInfo.key}-${formatInfo.width}x${formatInfo.height}.png`;
            const platforms = this.shareHandler.getPlatformRecommendation(formatInfo.key);
            const shareText = `我的${formatInfo.name}相框照片！適合 ${platforms.join('、')} #相框工具`;
            
            console.log('開始分享圖片：', {
                filename,
                platforms,
                shareCapabilities: this.shareHandler.getShareCapabilities()
            });
            
            const result = await this.shareHandler.shareBlob(
                blob, 
                filename,
                shareText
            );
            
            if (result.success) {
                switch (result.method) {
                    case 'share':
                        this.showStatus('分享成功！', 'success');
                        break;
                    case 'download':
                        this.showStatus(`${result.message}。適合分享至：${platforms.join('、')}`, 'success');
                        break;
                }
            } else if (result.method === 'cancelled') {
                this.showStatus('分享已取消', '');
            } else {
                this.showStatus('分享遇到問題，請重試或使用下載功能', 'error');
            }
        } catch (error) {
            console.error('分享失敗:', error);
            this.showStatus('分享失敗，請重試或使用下載功能', 'error');
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