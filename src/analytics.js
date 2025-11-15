/**
 * Google Analytics 追蹤模組
 * 提供隱私友善的使用行為追蹤功能
 */

export class Analytics {
    constructor() {
        this.isEnabled = typeof gtag !== 'undefined';
        this.sessionStartTime = Date.now();
        
        if (this.isEnabled) {
            console.log('Analytics: Google Analytics 初始化成功');
        } else {
            console.warn('Analytics: Google Analytics 未載入，追蹤功能已停用');
        }
    }

    /**
     * 安全的事件發送函數
     * @param {string} eventName 事件名稱
     * @param {Object} parameters 事件參數
     */
    trackEvent(eventName, parameters = {}) {
        if (!this.isEnabled) return;
        
        try {
            // 添加通用參數
            const eventData = {
                ...parameters,
                timestamp: Date.now(),
                session_duration: Math.round((Date.now() - this.sessionStartTime) / 1000)
            };
            
            gtag('event', eventName, eventData);
            console.log(`Analytics: 事件已發送 - ${eventName}`, eventData);
        } catch (error) {
            console.error('Analytics: 事件發送失敗', error);
        }
    }

    /**
     * 追蹤主題選擇
     * @param {string} themeName 主題名稱 (johnny-be-good/christmas)
     * @param {string} source 來源 (homepage/direct)
     */
    trackThemeSelected(themeName, source = 'homepage') {
        this.trackEvent('theme_selected', {
            theme_name: themeName,
            source: source,
            event_category: 'navigation'
        });
    }

    /**
     * 追蹤頁面訪問
     * @param {string} pageName 頁面名稱
     * @param {string} theme 當前主題
     */
    trackPageView(pageName, theme = null) {
        this.trackEvent('page_view', {
            page_name: pageName,
            theme: theme,
            event_category: 'engagement'
        });
    }

    /**
     * 追蹤照片上傳
     * @param {string} method 上傳方式 (file_select/camera/drag_drop)
     * @param {string} theme 當前主題
     * @param {number} fileSize 檔案大小 (bytes)
     */
    trackPhotoUpload(method, theme, fileSize = null) {
        this.trackEvent('photo_upload', {
            upload_method: method,
            theme: theme,
            file_size: fileSize,
            event_category: 'user_action'
        });
    }

    /**
     * 追蹤邊框風格選擇
     * @param {string} styleName 風格名稱
     * @param {string} theme 當前主題
     * @param {boolean} isPreview 是否為預覽模式
     */
    trackFrameStyleSelected(styleName, theme, isPreview = false) {
        this.trackEvent('frame_style_selected', {
            style_name: styleName,
            theme: theme,
            is_preview: isPreview,
            event_category: 'customization'
        });
    }

    /**
     * 追蹤輸出格式選擇
     * @param {string} format 格式 (square/portrait/story)
     * @param {string} theme 當前主題
     */
    trackFormatSelected(format, theme) {
        this.trackEvent('format_selected', {
            output_format: format,
            theme: theme,
            event_category: 'customization'
        });
    }

    /**
     * 追蹤照片處理完成
     * @param {string} format 輸出格式
     * @param {string} style 使用的風格
     * @param {string} theme 當前主題
     * @param {number} processingTime 處理時間 (毫秒)
     */
    trackPhotoProcessed(format, style, theme, processingTime) {
        this.trackEvent('photo_processed', {
            output_format: format,
            style_used: style,
            theme: theme,
            processing_time: Math.round(processingTime),
            event_category: 'completion'
        });
    }

    /**
     * 追蹤分享操作
     * @param {string} method 分享方式 (native_share/download/copy_link)
     * @param {string} format 分享格式
     * @param {string} theme 當前主題
     * @param {boolean} success 是否成功
     */
    trackShare(method, format, theme, success = true) {
        this.trackEvent('share_attempt', {
            share_method: method,
            output_format: format,
            theme: theme,
            success: success,
            event_category: 'sharing'
        });
    }

    /**
     * 追蹤下載操作
     * @param {string} format 下載格式
     * @param {string} theme 當前主題
     * @param {boolean} success 是否成功
     */
    trackDownload(format, theme, success = true) {
        this.trackEvent('download_attempt', {
            output_format: format,
            theme: theme,
            success: success,
            event_category: 'sharing'
        });
    }

    /**
     * 追蹤精確調整模式使用
     * @param {string} action 動作 (enter/exit/use)
     * @param {string} theme 當前主題
     * @param {number} duration 使用時長 (毫秒)
     */
    trackPrecisionMode(action, theme, duration = null) {
        this.trackEvent('precision_mode', {
            action: action,
            theme: theme,
            duration: duration ? Math.round(duration) : null,
            event_category: 'advanced_feature'
        });
    }

    /**
     * 追蹤手勢操作
     * @param {string} gestureType 手勢類型 (drag/pinch/rotate/double_tap)
     * @param {string} theme 當前主題
     * @param {boolean} isPrecisionMode 是否在精確模式
     */
    trackGesture(gestureType, theme, isPrecisionMode = false) {
        this.trackEvent('gesture_used', {
            gesture_type: gestureType,
            theme: theme,
            precision_mode: isPrecisionMode,
            event_category: 'interaction'
        });
    }

    /**
     * 追蹤手勢提示完成
     * @param {string} theme 當前主題
     * @param {number} completionRate 完成率 (0-1)
     */
    trackGestureHintsCompleted(theme, completionRate) {
        this.trackEvent('gesture_hints_completed', {
            theme: theme,
            completion_rate: completionRate,
            event_category: 'onboarding'
        });
    }

    /**
     * 追蹤錯誤事件
     * @param {string} errorType 錯誤類型
     * @param {string} errorMessage 錯誤訊息
     * @param {string} context 錯誤發生的上下文
     */
    trackError(errorType, errorMessage, context = null) {
        this.trackEvent('app_error', {
            error_type: errorType,
            error_message: errorMessage.substring(0, 150), // 限制長度保護隱私
            context: context,
            event_category: 'error'
        });
    }

    /**
     * 追蹤使用者離開時的最終狀態
     * @param {string} theme 當前主題
     * @param {boolean} hasCompletedPhoto 是否完成照片處理
     * @param {number} sessionDuration 會話時長
     */
    trackSessionEnd(theme, hasCompletedPhoto, sessionDuration) {
        this.trackEvent('session_end', {
            theme: theme,
            completed_photo: hasCompletedPhoto,
            session_duration: Math.round(sessionDuration / 1000),
            event_category: 'engagement'
        });
    }

    /**
     * 獲取當前主題名稱 (從頁面URL推斷)
     * @returns {string} 主題名稱
     */
    getCurrentTheme() {
        const pathname = window.location.pathname;
        if (pathname.includes('johnny-be-good')) return 'johnny-be-good';
        if (pathname.includes('christmas')) return 'christmas';
        return 'homepage';
    }

    /**
     * 獲取設備類型
     * @returns {string} 設備類型
     */
    getDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        const isTablet = /ipad|android.*tablet|kindle|silk/i.test(userAgent);
        
        if (isTablet) return 'tablet';
        if (isMobile) return 'mobile';
        return 'desktop';
    }
}

// 創建全域實例
export const analytics = new Analytics();

// 頁面載入時自動追蹤頁面訪問
document.addEventListener('DOMContentLoaded', () => {
    const theme = analytics.getCurrentTheme();
    const pageName = theme === 'homepage' ? 'theme_selector' : 'photo_editor';
    
    analytics.trackPageView(pageName, theme);
    
    // 追蹤設備資訊 (僅一次)
    analytics.trackEvent('device_info', {
        device_type: analytics.getDeviceType(),
        user_agent: navigator.userAgent.substring(0, 100), // 限制長度
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        event_category: 'technical'
    });
});

// 頁面離開時追蹤會話結束
window.addEventListener('beforeunload', () => {
    const theme = analytics.getCurrentTheme();
    const sessionDuration = Date.now() - analytics.sessionStartTime;
    const hasPhoto = document.querySelector('canvas') && document.querySelector('canvas').style.display !== 'none';
    
    analytics.trackSessionEnd(theme, hasPhoto, sessionDuration);
});