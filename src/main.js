import { ImageHandler } from './image.js';
import { GestureHandler } from './gesture.js';
import { RenderEngine } from './render.js';
import { ShareHandler } from './share.js';
import { resourceManager } from './resource-manager.js';
import { GestureHints } from './gesture-hints.js';

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
        this.formatButtons = document.querySelectorAll('.format-btn[data-format]');
        this.styleButtons = document.querySelectorAll('.format-btn[data-style]');
        
        // 精確調整面板元素 (原始版本 - 保留作為後備)
        this.precisionPanel = document.getElementById('precisionPanel');
        this.precisionToggle = document.getElementById('precisionToggle');
        this.precisionControls = document.getElementById('precisionControls');
        this.scaleSlider = document.getElementById('scaleSlider');
        this.rotationSlider = document.getElementById('rotationSlider');
        this.scaleValue = document.getElementById('scaleValue');
        this.rotationValue = document.getElementById('rotationValue');
        
        // 位置微調按鈕
        this.moveUpBtn = document.getElementById('moveUp');
        this.moveDownBtn = document.getElementById('moveDown');
        this.moveLeftBtn = document.getElementById('moveLeft');
        this.moveRightBtn = document.getElementById('moveRight');
        this.centerPositionBtn = document.getElementById('centerPosition');
        
        this.currentImage = null;
        this.frameImage = null;
        this.currentFrameStyle = 'modern-gallery'; // 預設風格
        this.transform = {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0
        };
        
        this.isInteracting = false;
        this.renderTimeout = null;
        
        // 防抖動相關
        this.lastClickTime = 0;
        this.clickDebounceDelay = 300; // 300ms 防抖延遲
        
        this.init();
    }
    
    async init() {
        try {
            this.imageHandler = new ImageHandler();
            this.gestureHandler = new GestureHandler(this.canvas);
            this.renderEngine = new RenderEngine(this.canvas, this.ctx);
            this.shareHandler = new ShareHandler();
            this.gestureHints = new GestureHints();
            
            await this.loadFrame();
            this.setupEventListeners();
            this.updateUI();
            
            // 初始渲染邊框以供預覽
            this.scheduleRender();
            
            // 顯示分享方法說明
            const shareMethod = this.shareHandler.getShareMethodDescription();
            console.log('分享功能初始化：', shareMethod);
            
            // 環境檢測資訊
            console.log('PhotoFrameApp: 環境檢測資訊');
            console.log('- iOS Safari:', this.isIOSSafari());
            console.log('- User Agent:', navigator.userAgent);
            console.log('- 支援相機:', !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
            
            const statusMessage = this.isIOSSafari() ? 
                '準備就緒！點擊空白區域或上傳按鈕開始使用。' : 
                '準備就緒！上傳照片開始使用。';
            this.showStatus(statusMessage, 'success');
        } catch (error) {
            console.error('App initialization failed:', error);
            this.showStatus('Failed to initialize app. Please refresh the page.', 'error');
        }
    }
    
    // iOS Safari 檢測
    isIOSSafari() {
        const userAgent = navigator.userAgent;
        const isIOS = /iPad|iPhone|iPod/.test(userAgent);
        const isSafari = /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS/.test(userAgent);
        return isIOS && isSafari;
    }
    
    // 觸發檔案輸入的方法，包含 iOS Safari 特殊處理
    triggerFileInput() {
        console.log('PhotoFrameApp: triggerFileInput 被呼叫');
        console.log('PhotoFrameApp: 檢測環境 - iOS Safari:', this.isIOSSafari());
        
        if (this.isIOSSafari()) {
            // iOS Safari 特殊處理
            console.log('PhotoFrameApp: 使用 iOS Safari 特殊處理邏輯');
            
            // 為 iOS Safari 動態設定 capture 屬性
            this.setupiOSFileInput();
        }
        
        // 確保有使用者互動的情況下觸發
        try {
            console.log('PhotoFrameApp: 嘗試觸發 fileInput.click()');
            this.fileInput.click();
            console.log('PhotoFrameApp: fileInput.click() 執行完成');
        } catch (error) {
            console.error('PhotoFrameApp: 觸發檔案選擇器失敗:', error);
            this.showStatus('無法開啟檔案選擇器，請點擊上傳按鈕', 'error');
        }
    }
    
    // iOS Safari 檔案輸入設定
    setupiOSFileInput() {
        // 移除可能干擾的屬性，確保用戶可以選擇拍照或上傳
        this.fileInput.removeAttribute('capture');
        
        // 為 iOS Safari 優化 accept 屬性
        this.fileInput.setAttribute('accept', 'image/*');
        
        // 不再自動加入 capture 屬性，讓用戶自由選擇拍照或上傳
        console.log('PhotoFrameApp: iOS Safari 檔案輸入已設定完成 - 支援拍照和上傳');
    }
    
    async loadFrame() {
        await this.loadFrameForCurrentFormat();
    }
    
    async loadFrameForCurrentFormat() {
        try {
            const formatInfo = this.renderEngine.getCurrentFormat();
            const framePath = `assets/frames/frame_${formatInfo.key}_${this.currentFrameStyle}_${formatInfo.width}x${formatInfo.height}.png`;
            
            try {
                this.frameImage = await this.imageHandler.loadImageFromUrl(framePath);
                console.log(`載入邊框成功: ${framePath}`);
            } catch {
                // Fallback to default frame
                try {
                    this.frameImage = await this.imageHandler.loadImageFromUrl('assets/frames/frame_1080.png');
                    console.log('使用預設邊框: frame_1080.png');
                } catch {
                    this.frameImage = await this.imageHandler.loadImageFromUrl('assets/frames/frame_1080.svg');
                    console.log('使用預設邊框: frame_1080.svg');
                }
            }
        } catch (error) {
            console.warn('Could not load frame image:', error);
            this.frameImage = null;
        }
    }
    
    setupEventListeners() {
        this.uploadBtn.addEventListener('click', () => {
            console.log('PhotoFrameApp: 上傳按鈕被點擊');
            this.triggerFileInput();
        });
        
        this.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleImageUpload(e.target.files[0]);
            }
        });
        
        this.resetBtn.addEventListener('click', () => {
            this.resetTransform();
        });
        
        this.rotateBtn.addEventListener('click', (e) => {
            this.handleRotateClick(e);
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
        
        this.styleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const style = e.currentTarget.dataset.style;
                this.changeFrameStyle(style);
            });
        });
        
        // 畫布區域智能點擊事件 - 加強 iOS Safari 支援
        this.canvas.addEventListener('click', (e) => {
            console.log('PhotoFrameApp: 畫布點擊事件觸發');
            console.log('PhotoFrameApp: currentImage:', !!this.currentImage);
            console.log('PhotoFrameApp: isInteracting:', this.isInteracting);
            
            // 只有在沒有圖片且沒有正在進行手勢操作時才觸發上傳
            if (!this.currentImage && !this.isInteracting) {
                console.log('PhotoFrameApp: 條件符合，準備開啟檔案選擇器');
                e.preventDefault();
                e.stopPropagation();
                this.triggerFileInput();
            } else {
                console.log('PhotoFrameApp: 條件不符合，忽略點擊事件');
            }
        });
        
        // 加入觸控事件支援 (iOS Safari 有時對 touch 事件響應更好)
        this.canvas.addEventListener('touchend', (e) => {
            console.log('PhotoFrameApp: 畫布 touchend 事件觸發');
            
            // 避免與手勢操作衝突
            if (!this.currentImage && !this.isInteracting && e.touches.length === 0) {
                console.log('PhotoFrameApp: touchend 條件符合，準備開啟檔案選擇器');
                e.preventDefault();
                e.stopPropagation();
                
                // 短暫延遲避免與 click 事件重複
                setTimeout(() => {
                    if (!this.currentImage && !this.isInteracting) {
                        this.triggerFileInput();
                    }
                }, 100);
            }
        });
        
        this.gestureHandler.on('transformStart', () => {
            this.isInteracting = true;
            this.startContinuousRender();
            
            // 用戶開始交互時隱藏提示
            if (this.gestureHints && this.gestureHints.isShowing) {
                this.gestureHints.stopHints();
            }
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
        
        // 精確模式事件監聽
        this.gestureHandler.on('precisionModeEnter', () => {
            this.enterPrecisionMode();
        });
        
        this.gestureHandler.on('precisionModeExit', () => {
            this.exitPrecisionMode();
        });
        
        // 精確調整面板事件
        this.setupPrecisionPanelEvents();
        
        // 鍵盤快捷鍵事件
        this.setupKeyboardShortcuts();
        
        window.addEventListener('resize', () => {
            this.scheduleRender();
            // 當螢幕大小改變時，重新調整面板顯示
            if (this.currentImage) {
                this.updateUI();
            }
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
            
            // 顯示手勢提示
            if (this.gestureHints && this.gestureHints.shouldShowHints()) {
                setTimeout(() => {
                    this.gestureHints.showHints();
                }, 1500);
            }
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
    
    handleRotateClick(e) {
        e.preventDefault();
        
        const currentTime = Date.now();
        
        // 防抖動：如果距離上次點擊時間太短，忽略此次點擊
        if (currentTime - this.lastClickTime < this.clickDebounceDelay) {
            console.log('PhotoFrameApp: 忽略快速重複點擊');
            return;
        }
        
        this.lastClickTime = currentTime;
        this.rotateImage();
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
        
        // Always render to show frame preview
        this.scheduleRender();
        
        const formatInfo = this.renderEngine.getCurrentFormat();
        this.showStatus(`已切換至${formatInfo.name}`, 'success');
    }
    
    async changeFrameStyle(style) {
        this.currentFrameStyle = style;
        
        // Update button states
        this.styleButtons.forEach(btn => {
            const isActive = btn.dataset.style === style;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-checked', isActive);
        });
        
        // Load frame for new style
        await this.loadFrameForCurrentFormat();
        
        // Always re-render to show frame preview (with or without image)
        this.scheduleRender();
        
        // Show style change message
        const styleNames = {
            'modern-gallery': '現代畫廊',
            'gradient-glow': '漸變光暈',
            'geometric-art': '幾何抽象',
            'minimal-lines': '極簡線條',
            'tech-modern': '科技現代'
        };
        
        this.showStatus(`已切換至${styleNames[style]}風格`, 'success');
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
        // 即使沒有圖片也渲染邊框以供預覽
        this.renderEngine.render(this.currentImage, this.transform, this.frameImage);
    }
    
    updateUI() {
        const hasImage = !!this.currentImage;
        
        this.resetBtn.disabled = !hasImage;
        this.rotateBtn.disabled = !hasImage;
        this.downloadBtn.disabled = !hasImage;
        this.shareBtn.disabled = !hasImage;
        
        // 精確調整面板啟用狀態
        this.precisionToggle.disabled = !hasImage;
        this.scaleSlider.disabled = !hasImage;
        this.rotationSlider.disabled = !hasImage;
        this.moveUpBtn.disabled = !hasImage;
        this.moveDownBtn.disabled = !hasImage;
        this.moveLeftBtn.disabled = !hasImage;
        this.moveRightBtn.disabled = !hasImage;
        this.centerPositionBtn.disabled = !hasImage;
        
        this.canvas.classList.toggle('has-image', hasImage);
        this.placeholderText.classList.toggle('hidden', hasImage);
        
        if (hasImage) {
            this.gestureHandler.enable();
            // 顯示精確調整面板
            this.precisionPanel.style.display = 'block';
        } else {
            this.gestureHandler.disable();
            // 隱藏精確調整面板
            this.precisionPanel.style.display = 'none';
            this.precisionPanel.classList.remove('expanded');
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
            const filename = `framed-photo-${formatInfo.key}-${this.currentFrameStyle}-${formatInfo.width}x${formatInfo.height}.png`;
            
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
            const filename = `framed-photo-${formatInfo.key}-${this.currentFrameStyle}-${formatInfo.width}x${formatInfo.height}.png`;
            const platforms = this.shareHandler.getPlatformRecommendation(formatInfo.key);
            const shareText = "Farewell, Johnny! Go be good! (Like the song! 😉) https://calebtestbeta.github.io/web-photo-booth/johnny-be-good.html";
            
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
    
    // 精確模式相關方法
    enterPrecisionMode() {
        console.log('PhotoFrameApp: 進入精確調整模式');
        this.showStatus('精確調整模式 - 更精確的縮放和旋轉', 'success');
        
        // 顯示即時數值
        this.showTransformValues();
        
        // 視覺提示
        this.canvas.classList.add('precision-mode');
    }
    
    exitPrecisionMode() {
        console.log('PhotoFrameApp: 退出精確調整模式');
        this.showStatus('', '');
        
        // 隱藏即時數值
        this.hideTransformValues();
        
        // 移除視覺提示
        this.canvas.classList.remove('precision-mode');
    }
    
    showTransformValues() {
        if (!this.currentImage) return;
        
        const scalePercent = Math.round(this.transform.scale * 100);
        const rotationDegree = Math.round((this.transform.rotation * 180 / Math.PI) % 360);
        
        // 創建或更新數值顯示元素
        let valueDisplay = document.getElementById('transformValues');
        if (!valueDisplay) {
            valueDisplay = document.createElement('div');
            valueDisplay.id = 'transformValues';
            valueDisplay.className = 'transform-values';
            document.body.appendChild(valueDisplay);
        }
        
        valueDisplay.innerHTML = `
            <div class="value-item">
                <span class="value-label">縮放</span>
                <span class="value-number">${scalePercent}%</span>
            </div>
            <div class="value-item">
                <span class="value-label">旋轉</span>
                <span class="value-number">${rotationDegree}°</span>
            </div>
        `;
        
        valueDisplay.style.display = 'flex';
    }
    
    hideTransformValues() {
        const valueDisplay = document.getElementById('transformValues');
        if (valueDisplay) {
            valueDisplay.style.display = 'none';
        }
    }
    
    // 重載 updateTransform 以支援即時數值更新
    updateTransform(deltaTransform) {
        if (!this.currentImage) return;
        
        const { dx, dy, scale, rotation } = deltaTransform;
        
        this.transform.x += dx || 0;
        this.transform.y += dy || 0;
        this.transform.scale = Math.max(0.1, Math.min(5, this.transform.scale * (scale || 1)));
        this.transform.rotation += rotation || 0;
        
        // 精確模式下即時更新數值顯示
        if (this.gestureHandler.isPrecisionMode()) {
            this.showTransformValues();
        }
        
        this.scheduleRender();
    }
    
    // 精確調整面板相關方法
    setupPrecisionPanelEvents() {
        // 面板展開/收合
        this.precisionToggle.addEventListener('click', () => {
            this.togglePrecisionPanel();
        });
        
        // 縮放滑桿
        this.scaleSlider.addEventListener('input', (e) => {
            const scale = parseFloat(e.target.value) / 100;
            this.setAbsoluteScale(scale);
            this.scaleValue.textContent = `${e.target.value}%`;
        });
        
        // 旋轉滑桿
        this.rotationSlider.addEventListener('input', (e) => {
            const rotation = parseFloat(e.target.value) * Math.PI / 180;
            this.setAbsoluteRotation(rotation);
            this.rotationValue.textContent = `${e.target.value}°`;
        });
        
        // 位置微調按鈕
        this.moveUpBtn.addEventListener('click', () => this.movePosition(0, -5));
        this.moveDownBtn.addEventListener('click', () => this.movePosition(0, 5));
        this.moveLeftBtn.addEventListener('click', () => this.movePosition(-5, 0));
        this.moveRightBtn.addEventListener('click', () => this.movePosition(5, 0));
        this.centerPositionBtn.addEventListener('click', () => this.centerImage());
    }
    
    togglePrecisionPanel() {
        const isExpanded = this.precisionPanel.classList.contains('expanded');
        
        if (isExpanded) {
            this.precisionPanel.classList.remove('expanded');
            this.precisionToggle.setAttribute('aria-label', '展開精確調整控制項');
        } else {
            this.precisionPanel.classList.add('expanded');
            this.precisionToggle.setAttribute('aria-label', '收合精確調整控制項');
            this.updatePrecisionControls();
        }
    }
    
    
    updatePrecisionControls() {
        if (!this.currentImage) return;
        
        // 更新滑桿值
        const scalePercent = Math.round(this.transform.scale * 100);
        const rotationDegree = Math.round((this.transform.rotation * 180 / Math.PI) % 360);
        
        // 更新面板
        this.scaleSlider.value = scalePercent;
        this.scaleValue.textContent = `${scalePercent}%`;
        this.rotationSlider.value = rotationDegree;
        this.rotationValue.textContent = `${rotationDegree}°`;
    }
    
    setAbsoluteScale(scale) {
        if (!this.currentImage) return;
        
        this.transform.scale = Math.max(0.1, Math.min(5, scale));
        this.scheduleRender();
    }
    
    setAbsoluteRotation(rotation) {
        if (!this.currentImage) return;
        
        this.transform.rotation = rotation;
        this.scheduleRender();
    }
    
    movePosition(dx, dy) {
        if (!this.currentImage) return;
        
        this.transform.x += dx;
        this.transform.y += dy;
        this.scheduleRender();
    }
    
    // 鍵盤快捷鍵相關方法
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // 只在有圖片且沒有聚焦在輸入元素時響應
            if (!this.currentImage || this.isInputFocused()) return;
            
            const moveStep = e.shiftKey ? 10 : 1; // Shift + 方向鍵 = 快速移動
            
            switch(e.code) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.movePosition(0, -moveStep);
                    break;
                    
                case 'ArrowDown':
                    e.preventDefault();
                    this.movePosition(0, moveStep);
                    break;
                    
                case 'ArrowLeft':
                    e.preventDefault();
                    this.movePosition(-moveStep, 0);
                    break;
                    
                case 'ArrowRight':
                    e.preventDefault();
                    this.movePosition(moveStep, 0);
                    break;
                    
                case 'Equal': // + 鍵
                case 'NumpadAdd':
                    e.preventDefault();
                    this.adjustScale(0.05);
                    break;
                    
                case 'Minus': // - 鍵
                case 'NumpadSubtract':
                    e.preventDefault();
                    this.adjustScale(-0.05);
                    break;
                    
                case 'KeyR':
                    e.preventDefault();
                    if (e.ctrlKey || e.metaKey) {
                        // Ctrl/Cmd + R: 重置
                        this.resetTransform();
                    } else {
                        // R: 旋轉 90 度
                        this.rotateImage();
                    }
                    break;
                    
                case 'Space':
                    e.preventDefault();
                    this.resetTransform();
                    break;
                    
                case 'Escape':
                    e.preventDefault();
                    if (this.precisionPanel.classList.contains('expanded')) {
                        this.togglePrecisionPanel();
                    }
                    break;
                    
                case 'KeyP':
                    e.preventDefault();
                    this.togglePrecisionPanel();
                    break;
            }
        });
        
        // 滾輪精確縮放（按住 Ctrl）
        document.addEventListener('wheel', (e) => {
            if (!this.currentImage || !e.ctrlKey) return;
            
            e.preventDefault();
            const scaleDelta = e.deltaY > 0 ? -0.02 : 0.02;
            this.adjustScale(scaleDelta);
        }, { passive: false });
    }
    
    isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.contentEditable === 'true'
        );
    }
    
    adjustScale(delta) {
        if (!this.currentImage) return;
        
        const newScale = Math.max(0.1, Math.min(5, this.transform.scale + delta));
        this.transform.scale = newScale;
        
        // 更新精確調整面板的滑桿
        if (this.precisionPanel.classList.contains('expanded')) {
            this.updatePrecisionControls();
        }
        
        this.scheduleRender();
    }
    
}

document.addEventListener('DOMContentLoaded', () => {
    new PhotoFrameApp();
});