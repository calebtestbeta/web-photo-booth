import { ImageHandler } from './image.js';
import { GestureHandler } from './gesture.js';
import { RenderEngine } from './render.js';
import { ShareHandler } from './share.js';
import { resourceManager } from './resource-manager.js';
import { GestureHints } from './gesture-hints.js';
import { themeConfig } from './theme-config.js';
import { analytics } from './analytics.js';

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
        this.customBtn = document.getElementById('customBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.shareBtn = document.getElementById('shareBtn');
        this.formatButtons = document.querySelectorAll('.format-btn[data-format]');
        this.styleButtons = document.querySelectorAll('.format-btn[data-style]');
        
        // 自定義面板元素
        this.customPanel = document.getElementById('customPanel');
        this.customPanelClose = document.getElementById('customPanelClose');
        this.appContainer = document.querySelector('.app-container');
        
        // 文字控制元素
        this.enableCustomText = document.getElementById('enableCustomText');
        this.textVisibilityBtn = document.getElementById('textVisibilityBtn');
        this.customTextInput = document.getElementById('customTextInput');
        this.textFontSize = document.getElementById('textFontSize');
        this.textFontSizeValue = document.getElementById('textFontSizeValue');
        this.textColor = document.getElementById('textColor');
        this.textRotation = document.getElementById('textRotation');
        this.textRotationValue = document.getElementById('textRotationValue');
        this.textPositionX = document.getElementById('textPositionX');
        this.textPositionXValue = document.getElementById('textPositionXValue');
        this.textPositionY = document.getElementById('textPositionY');
        this.textPositionYValue = document.getElementById('textPositionYValue');
        
        // 圖片控制元素
        this.enableCustomImage = document.getElementById('enableCustomImage');
        this.imageVisibilityBtn = document.getElementById('imageVisibilityBtn');
        this.customImageUpload = document.getElementById('customImageUpload');
        this.customImageInput = document.getElementById('customImageInput');
        this.customImagePreview = document.getElementById('customImagePreview');
        this.imageSize = document.getElementById('imageSize');
        this.imageSizeValue = document.getElementById('imageSizeValue');
        this.imageOpacity = document.getElementById('imageOpacity');
        this.imageOpacityValue = document.getElementById('imageOpacityValue');
        this.imagePositionX = document.getElementById('imagePositionX');
        this.imagePositionXValue = document.getElementById('imagePositionXValue');
        this.imagePositionY = document.getElementById('imagePositionY');
        this.imagePositionYValue = document.getElementById('imagePositionYValue');
        this.imageBehindText = document.getElementById('imageBehindText');
        
        // 面板動作按鈕
        this.resetCustom = document.getElementById('resetCustom');
        this.applyCustom = document.getElementById('applyCustom');
        
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
        
        // 自定義元素狀態
        this.customImage = null;
        this.customState = {
            // 文字狀態
            text: {
                enabled: false,
                visible: true,
                content: '',
                fontSize: 72,
                color: '#FFD700',
                rotation: 0,
                positionX: 50,
                positionY: 85
            },
            // 圖片狀態  
            image: {
                enabled: false,
                visible: true,
                data: null,
                size: 100,
                opacity: 100,
                positionX: 50,
                positionY: 20,
                behindText: false
            }
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
            // Initialize theme system first
            await themeConfig.initialize();
            
            this.imageHandler = new ImageHandler();
            this.gestureHandler = new GestureHandler(this.canvas);
            this.renderEngine = new RenderEngine(this.canvas, this.ctx);
            this.shareHandler = new ShareHandler();
            this.gestureHints = new GestureHints();
            
            // Update frame styles based on current theme
            this.updateFrameStylesForTheme();
            
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
            console.log('- 當前主題:', themeConfig.getCurrentTheme().name);
            
            const statusMessage = this.isIOSSafari() ? 
                '準備就緒！點擊空白區域或上傳按鈕開始使用。' : 
                '準備就緒！上傳照片開始使用。';
            this.showStatus(statusMessage, 'success');
        } catch (error) {
            console.error('App initialization failed:', error);
            this.showStatus('Failed to initialize app. Please refresh the page.', 'error');
        }
    }
    
    // Update frame styles based on current theme
    updateFrameStylesForTheme() {
        const currentTheme = themeConfig.getCurrentTheme();
        const availableStyles = currentTheme.frameStyles;
        
        // If current frame style is not available in theme, use first available
        if (!availableStyles.includes(this.currentFrameStyle)) {
            this.currentFrameStyle = availableStyles[0] || 'modern-gallery';
            console.log(`Updated frame style to ${this.currentFrameStyle} for theme ${currentTheme.name}`);
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
        
        // 自定義面板事件
        this.setupCustomPanelEvents();
        
        // 畫布拖拽功能 (針對自定義元素)
        this.setupCanvasDragging();
        
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
            
            // 追蹤照片上傳成功
            analytics.trackPhotoUpload('file_select', analytics.getCurrentTheme(), file.size);
            
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
            
            // 追蹤照片上傳錯誤
            analytics.trackError('photo_upload_failed', error.message, 'handleImageUpload');
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
        
        // 追蹤格式選擇
        analytics.trackFormatSelected(format, analytics.getCurrentTheme());
        
        // Always render to show frame preview
        this.scheduleRender();
        
        const formatInfo = this.renderEngine.getCurrentFormat();
        this.showStatus(`已切換至${formatInfo.name}`, 'success');
    }
    
    async changeFrameStyle(style) {
        // Validate style is available in current theme
        const currentTheme = themeConfig.getCurrentTheme();
        if (!currentTheme.frameStyles.includes(style)) {
            console.warn(`Frame style '${style}' not available in theme '${currentTheme.name}'`);
            return;
        }
        
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
        
        // Show style change message with theme-aware style names
        const styleNames = this.getStyleDisplayNames();
        const displayName = styleNames[style] || style;
        
        this.showStatus(`已切換至${displayName}風格`, 'success');
        
        // 追蹤邊框風格選擇
        analytics.trackFrameStyleSelected(style, analytics.getCurrentTheme(), !this.currentImage);
    }
    
    // Get style display names based on current theme
    getStyleDisplayNames() {
        const currentTheme = themeConfig.getCurrentTheme();
        
        // Johnny Be Good theme style names
        const johnnyStyles = {
            'modern-gallery': '現代畫廊',
            'gradient-glow': '漸變光暈',
            'geometric-art': '幾何抽象',
            'minimal-lines': '極簡線條',
            'tech-modern': '科技現代'
        };
        
        // Christmas theme style names
        const christmasStyles = {
            'hfp_polaroid': '信友拍立得',
            'snow-frame': '雪花邊框',
            'christmas-ornaments': '聖誕飾品',
            'winter-glow': '冬日光暈',
            'festive-lights': '節慶燈飾'
        };
        
        if (currentTheme.name === 'Christmas Magic') {
            return christmasStyles;
        }
        
        return johnnyStyles;
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
        this.renderEngine.render(this.currentImage, this.transform, this.frameImage, this.customState);
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
                this.frameImage,
                this.customState
            );
            
            const formatInfo = this.renderEngine.getCurrentFormat();
            const filename = `framed-photo-${formatInfo.key}-${this.currentFrameStyle}-${formatInfo.width}x${formatInfo.height}.png`;
            
            await this.shareHandler.downloadBlob(blob, filename);
            this.showStatus('Image downloaded successfully!', 'success');
            
            // 追蹤下載成功
            analytics.trackDownload(formatInfo.key, analytics.getCurrentTheme(), true);
        } catch (error) {
            console.error('Download failed:', error);
            this.showStatus('Failed to download image. Please try again.', 'error');
            
            // 追蹤下載失敗
            analytics.trackDownload(formatInfo.key, analytics.getCurrentTheme(), false);
            analytics.trackError('download_failed', error.message, 'downloadImage');
        }
    }
    
    async shareImage() {
        if (!this.currentImage) return;
        
        try {
            this.showStatus('準備分享...');
            
            const blob = await this.renderEngine.exportImage(
                this.currentImage, 
                this.transform, 
                this.frameImage,
                this.customState
            );
            
            const formatInfo = this.renderEngine.getCurrentFormat();
            const filename = `framed-photo-${formatInfo.key}-${this.currentFrameStyle}-${formatInfo.width}x${formatInfo.height}.png`;
            const platforms = this.shareHandler.getPlatformRecommendation(formatInfo.key);
            const shareText = themeConfig.getShareMessage();
            
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
    
    // 自定義面板事件設定
    setupCustomPanelEvents() {
        // 自定義面板開關
        if (this.customBtn) {
            this.customBtn.addEventListener('click', () => {
                this.toggleCustomPanel();
            });
        }
        
        if (this.customPanelClose) {
            this.customPanelClose.addEventListener('click', () => {
                this.closeCustomPanel();
            });
        }
        
        // 文字控制事件
        if (this.enableCustomText) {
            this.enableCustomText.addEventListener('change', (e) => {
                this.customState.text.enabled = e.target.checked;
                this.updateTextControls();
                this.scheduleRender();
            });
        }
        
        if (this.textVisibilityBtn) {
            this.textVisibilityBtn.addEventListener('click', () => {
                this.toggleTextVisibility();
            });
        }
        
        if (this.customTextInput) {
            this.customTextInput.addEventListener('input', (e) => {
                this.customState.text.content = e.target.value;
                this.scheduleRender();
            });
        }
        
        // 文字大小控制
        if (this.textFontSize) {
            this.textFontSize.addEventListener('input', (e) => {
                this.customState.text.fontSize = parseInt(e.target.value);
                if (this.textFontSizeValue) {
                    this.textFontSizeValue.textContent = e.target.value;
                }
                this.scheduleRender();
            });
        }
        
        // 文字顏色控制
        if (this.textColor) {
            this.textColor.addEventListener('change', (e) => {
                this.customState.text.color = e.target.value;
                this.scheduleRender();
            });
        }
        
        // 文字旋轉控制
        if (this.textRotation) {
            this.textRotation.addEventListener('input', (e) => {
                this.customState.text.rotation = parseInt(e.target.value);
                if (this.textRotationValue) {
                    this.textRotationValue.textContent = e.target.value + '°';
                }
                this.scheduleRender();
            });
        }
        
        // 文字位置控制
        if (this.textPositionX) {
            this.textPositionX.addEventListener('input', (e) => {
                this.customState.text.positionX = parseInt(e.target.value);
                if (this.textPositionXValue) {
                    this.textPositionXValue.textContent = e.target.value + '%';
                }
                this.scheduleRender();
            });
        }
        
        if (this.textPositionY) {
            this.textPositionY.addEventListener('input', (e) => {
                this.customState.text.positionY = parseInt(e.target.value);
                if (this.textPositionYValue) {
                    this.textPositionYValue.textContent = e.target.value + '%';
                }
                this.scheduleRender();
            });
        }
        
        // 圖片控制事件
        if (this.enableCustomImage) {
            this.enableCustomImage.addEventListener('change', (e) => {
                this.customState.image.enabled = e.target.checked;
                this.updateImageControls();
                this.scheduleRender();
            });
        }
        
        if (this.imageVisibilityBtn) {
            this.imageVisibilityBtn.addEventListener('click', () => {
                this.toggleImageVisibility();
            });
        }
        
        // 圖片上傳處理
        if (this.customImageUpload) {
            this.customImageUpload.addEventListener('click', () => {
                if (this.customImageInput) {
                    this.customImageInput.click();
                }
            });
        }
        
        if (this.customImageInput) {
            this.customImageInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleCustomImageUpload(e.target.files[0]);
                }
            });
        }
        
        // 圖片大小控制
        if (this.imageSize) {
            this.imageSize.addEventListener('input', (e) => {
                this.customState.image.size = parseInt(e.target.value);
                if (this.imageSizeValue) {
                    this.imageSizeValue.textContent = e.target.value + '%';
                }
                this.scheduleRender();
            });
        }
        
        // 圖片透明度控制
        if (this.imageOpacity) {
            this.imageOpacity.addEventListener('input', (e) => {
                this.customState.image.opacity = parseInt(e.target.value);
                if (this.imageOpacityValue) {
                    this.imageOpacityValue.textContent = e.target.value + '%';
                }
                this.scheduleRender();
            });
        }
        
        // 圖片位置控制
        if (this.imagePositionX) {
            this.imagePositionX.addEventListener('input', (e) => {
                this.customState.image.positionX = parseInt(e.target.value);
                if (this.imagePositionXValue) {
                    this.imagePositionXValue.textContent = e.target.value + '%';
                }
                this.scheduleRender();
            });
        }
        
        if (this.imagePositionY) {
            this.imagePositionY.addEventListener('input', (e) => {
                this.customState.image.positionY = parseInt(e.target.value);
                if (this.imagePositionYValue) {
                    this.imagePositionYValue.textContent = e.target.value + '%';
                }
                this.scheduleRender();
            });
        }
        
        if (this.imageBehindText) {
            this.imageBehindText.addEventListener('change', (e) => {
                this.customState.image.behindText = e.target.checked;
                this.scheduleRender();
            });
        }
        
        // 面板動作按鈕
        if (this.resetCustom) {
            this.resetCustom.addEventListener('click', () => {
                this.resetCustomElements();
            });
        }
        
        if (this.applyCustom) {
            this.applyCustom.addEventListener('click', () => {
                this.closeCustomPanel();
            });
        }
    }
    
    // 自定義面板控制方法
    toggleCustomPanel() {
        if (this.customPanel && this.appContainer) {
            const isActive = this.customPanel.classList.contains('active');
            if (isActive) {
                this.closeCustomPanel();
            } else {
                this.openCustomPanel();
            }
        }
    }
    
    openCustomPanel() {
        if (this.customPanel && this.appContainer) {
            this.customPanel.classList.add('active');
            this.appContainer.classList.add('with-custom-panel');
            this.updateCustomPanelControls();
        }
    }
    
    closeCustomPanel() {
        if (this.customPanel && this.appContainer) {
            this.customPanel.classList.remove('active');
            this.appContainer.classList.remove('with-custom-panel');
        }
    }
    
    // 更新自定義面板控制項顯示
    updateCustomPanelControls() {
        this.updateTextControls();
        this.updateImageControls();
    }
    
    updateTextControls() {
        if (!this.enableCustomText) return;
        
        const textControlsSection = document.getElementById('textSection');
        const textControls = document.getElementById('textControls');
        
        if (textControlsSection && textControls) {
            if (this.customState.text.enabled) {
                textControls.style.display = 'block';
                this.textVisibilityBtn.style.display = 'block';
            } else {
                textControls.style.display = 'none';
                this.textVisibilityBtn.style.display = 'none';
            }
        }
        
        // 同步控制項值
        if (this.customTextInput) this.customTextInput.value = this.customState.text.content;
        if (this.textFontSize) this.textFontSize.value = this.customState.text.fontSize;
        if (this.textFontSizeValue) this.textFontSizeValue.textContent = this.customState.text.fontSize;
        if (this.textColor) this.textColor.value = this.customState.text.color;
        if (this.textRotation) this.textRotation.value = this.customState.text.rotation;
        if (this.textRotationValue) this.textRotationValue.textContent = this.customState.text.rotation + '°';
        if (this.textPositionX) this.textPositionX.value = this.customState.text.positionX;
        if (this.textPositionXValue) this.textPositionXValue.textContent = this.customState.text.positionX + '%';
        if (this.textPositionY) this.textPositionY.value = this.customState.text.positionY;
        if (this.textPositionYValue) this.textPositionYValue.textContent = this.customState.text.positionY + '%';
    }
    
    updateImageControls() {
        if (!this.enableCustomImage) return;
        
        const imageControlsSection = document.getElementById('imageSection');
        const imageControls = document.getElementById('imageControls');
        
        if (imageControlsSection && imageControls) {
            if (this.customState.image.enabled) {
                imageControls.style.display = 'block';
                this.imageVisibilityBtn.style.display = 'block';
            } else {
                imageControls.style.display = 'none';
                this.imageVisibilityBtn.style.display = 'none';
            }
        }
        
        // 同步控制項值
        if (this.imageSize) this.imageSize.value = this.customState.image.size;
        if (this.imageSizeValue) this.imageSizeValue.textContent = this.customState.image.size + '%';
        if (this.imageOpacity) this.imageOpacity.value = this.customState.image.opacity;
        if (this.imageOpacityValue) this.imageOpacityValue.textContent = this.customState.image.opacity + '%';
        if (this.imagePositionX) this.imagePositionX.value = this.customState.image.positionX;
        if (this.imagePositionXValue) this.imagePositionXValue.textContent = this.customState.image.positionX + '%';
        if (this.imagePositionY) this.imagePositionY.value = this.customState.image.positionY;
        if (this.imagePositionYValue) this.imagePositionYValue.textContent = this.customState.image.positionY + '%';
        if (this.imageBehindText) this.imageBehindText.checked = this.customState.image.behindText;
    }
    
    // 隱藏/顯示控制
    toggleTextVisibility() {
        this.customState.text.visible = !this.customState.text.visible;
        this.updateVisibilityButton(this.textVisibilityBtn, this.customState.text.visible);
        this.scheduleRender();
    }
    
    toggleImageVisibility() {
        this.customState.image.visible = !this.customState.image.visible;
        this.updateVisibilityButton(this.imageVisibilityBtn, this.customState.image.visible);
        this.scheduleRender();
    }
    
    updateVisibilityButton(button, isVisible) {
        if (!button) return;
        
        if (isVisible) {
            button.classList.remove('hidden');
            button.title = '隱藏';
        } else {
            button.classList.add('hidden');
            button.title = '顯示';
        }
    }
    
    // 自定義圖片上傳處理
    async handleCustomImageUpload(file) {
        try {
            const validationResult = this.validateImageFile(file);
            if (!validationResult.isValid) {
                this.showStatus(validationResult.message, 'error');
                return;
            }
            
            this.showLoading(true);
            this.customImage = await this.imageHandler.processImage(file);
            this.customState.image.data = this.customImage;
            
            // 顯示預覽
            if (this.customImagePreview) {
                this.customImagePreview.src = URL.createObjectURL(file);
                this.customImagePreview.style.display = 'block';
            }
            
            this.scheduleRender();
            this.showStatus('自定義圖片上傳成功', 'success');
            
        } catch (error) {
            console.error('自定義圖片上傳失敗:', error);
            this.showStatus('圖片上傳失敗，請重試', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    // 重置自定義元素
    resetCustomElements() {
        // 重置文字狀態
        this.customState.text = {
            enabled: false,
            visible: true,
            content: '',
            fontSize: 72,
            color: '#FFD700',
            rotation: 0,
            positionX: 50,
            positionY: 85
        };
        
        // 重置圖片狀態
        this.customState.image = {
            enabled: false,
            visible: true,
            data: null,
            size: 100,
            opacity: 100,
            positionX: 50,
            positionY: 20,
            behindText: false
        };
        
        this.customImage = null;
        
        // 更新UI
        if (this.enableCustomText) this.enableCustomText.checked = false;
        if (this.enableCustomImage) this.enableCustomImage.checked = false;
        if (this.customImagePreview) this.customImagePreview.style.display = 'none';
        
        this.updateCustomPanelControls();
        this.scheduleRender();
        this.showStatus('自定義設定已重置', 'success');
    }
    
    // 畫布拖拽功能設定 (針對自定義元素)
    setupCanvasDragging() {
        let isDragging = false;
        let dragTarget = null; // 'text' 或 'image'
        let dragStartX, dragStartY;
        let initialValues = {};
        
        // 取得滑鼠/觸控位置相對於畫布的座標
        const getCanvasPosition = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            
            return {
                x: (clientX - rect.left) * (this.canvas.width / rect.width),
                y: (clientY - rect.top) * (this.canvas.height / rect.height)
            };
        };
        
        // 檢測點擊位置是否在自定義元素範圍內
        const detectDragTarget = (canvasX, canvasY) => {
            // 檢測圖片區域 (優先檢測圖片，因為通常在上層)
            if (this.customState.image.enabled && this.customState.image.visible && 
                this.customState.image.data) {
                const imageX = this.canvas.width * (this.customState.image.positionX / 100);
                const imageY = this.canvas.height * (this.customState.image.positionY / 100);
                
                const maxSize = Math.min(this.canvas.width, this.canvas.height) * 0.6;
                const scale = (maxSize * (this.customState.image.size / 100)) / 
                             Math.max(this.customState.image.data.width, this.customState.image.data.height);
                const drawWidth = this.customState.image.data.width * scale;
                const drawHeight = this.customState.image.data.height * scale;
                
                if (canvasX >= imageX - drawWidth/2 && canvasX <= imageX + drawWidth/2 &&
                    canvasY >= imageY - drawHeight/2 && canvasY <= imageY + drawHeight/2) {
                    return 'image';
                }
            }
            
            // 檢測文字區域
            if (this.customState.text.enabled && this.customState.text.visible && 
                this.customState.text.content.trim()) {
                const textX = this.canvas.width * (this.customState.text.positionX / 100);
                const textY = this.canvas.height * (this.customState.text.positionY / 100);
                const fontSize = this.customState.text.fontSize;
                
                // 簡單的矩形區域檢測 (實際應該更精確)
                const textWidth = this.customState.text.content.length * fontSize * 0.6;
                const textHeight = fontSize * 1.2;
                
                if (canvasX >= textX - textWidth/2 && canvasX <= textX + textWidth/2 &&
                    canvasY >= textY - textHeight/2 && canvasY <= textY + textHeight/2) {
                    return 'text';
                }
            }
            
            return null;
        };
        
        // 開始拖拽
        const startDragging = (e) => {
            // 只有在自定義面板關閉時才允許拖拽
            if (this.customPanel && this.customPanel.classList.contains('active')) {
                return;
            }
            
            const pos = getCanvasPosition(e);
            const target = detectDragTarget(pos.x, pos.y);
            
            if (target) {
                e.preventDefault();
                e.stopPropagation(); // 阻止事件冒泡到手勢處理器
                e.stopImmediatePropagation(); // 阻止同級事件監聽器
                
                isDragging = true;
                dragTarget = target;
                dragStartX = pos.x;
                dragStartY = pos.y;
                
                // 暫時禁用手勢處理器以避免衝突
                if (this.gestureHandler) {
                    this.gestureHandler.disable();
                }
                
                // 保存初始值
                if (target === 'text') {
                    initialValues = {
                        positionX: this.customState.text.positionX,
                        positionY: this.customState.text.positionY
                    };
                } else if (target === 'image') {
                    initialValues = {
                        positionX: this.customState.image.positionX,
                        positionY: this.customState.image.positionY
                    };
                }
                
                this.canvas.style.cursor = 'grabbing';
                return true; // 表示已處理事件
            }
            return false; // 表示未處理事件，可讓其他處理器處理
        };
        
        // 拖拽中
        const doDragging = (e) => {
            if (!isDragging || !dragTarget) return;
            
            e.preventDefault();
            const pos = getCanvasPosition(e);
            
            const deltaX = pos.x - dragStartX;
            const deltaY = pos.y - dragStartY;
            
            if (dragTarget === 'text') {
                const newX = Math.max(10, Math.min(90,
                    initialValues.positionX + (deltaX / this.canvas.width) * 100
                ));
                const newY = Math.max(10, Math.min(90,
                    initialValues.positionY + (deltaY / this.canvas.height) * 100
                ));
                
                this.customState.text.positionX = newX;
                this.customState.text.positionY = newY;
                
                // 同步更新面板控制項
                if (this.textPositionX) {
                    this.textPositionX.value = newX;
                    this.textPositionXValue.textContent = Math.round(newX) + '%';
                }
                if (this.textPositionY) {
                    this.textPositionY.value = newY;
                    this.textPositionYValue.textContent = Math.round(newY) + '%';
                }
                
            } else if (dragTarget === 'image') {
                const newX = Math.max(0, Math.min(100,
                    initialValues.positionX + (deltaX / this.canvas.width) * 100
                ));
                const newY = Math.max(0, Math.min(100,
                    initialValues.positionY + (deltaY / this.canvas.height) * 100
                ));
                
                this.customState.image.positionX = newX;
                this.customState.image.positionY = newY;
                
                // 同步更新面板控制項
                if (this.imagePositionX) {
                    this.imagePositionX.value = newX;
                    this.imagePositionXValue.textContent = Math.round(newX) + '%';
                }
                if (this.imagePositionY) {
                    this.imagePositionY.value = newY;
                    this.imagePositionYValue.textContent = Math.round(newY) + '%';
                }
            }
            
            this.scheduleRender();
        };
        
        // 結束拖拽
        const stopDragging = () => {
            if (isDragging) {
                isDragging = false;
                dragTarget = null;
                this.canvas.style.cursor = 'default';
                
                // 重新啟用手勢處理器
                if (this.gestureHandler && this.currentImage) {
                    this.gestureHandler.enable();
                }
            }
        };
        
        // 滑鼠懸停效果
        const handleMouseMove = (e) => {
            if (!isDragging && !this.customPanel.classList.contains('active')) {
                const pos = getCanvasPosition(e);
                const target = detectDragTarget(pos.x, pos.y);
                this.canvas.style.cursor = target ? 'grab' : 'default';
            }
        };
        
        // 事件監聽器 - 使用 capture: true 確保優先處理自定義元素
        this.canvas.addEventListener('mousedown', startDragging, { capture: true });
        this.canvas.addEventListener('touchstart', startDragging, { passive: false, capture: true });
        this.canvas.addEventListener('mousemove', handleMouseMove);
        
        document.addEventListener('mousemove', doDragging);
        document.addEventListener('touchmove', doDragging, { passive: false });
        document.addEventListener('mouseup', stopDragging);
        document.addEventListener('touchend', stopDragging);
    }
    
}

document.addEventListener('DOMContentLoaded', () => {
    new PhotoFrameApp();
});