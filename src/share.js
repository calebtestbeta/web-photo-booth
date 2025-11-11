export class ShareHandler {
    constructor() {
        this.supportsShare = this.checkShareSupport();
        this.isDesktop = this.checkIfDesktop();
        this.isIOS = this.checkIfIOS();
        this.isIOSSafari = this.checkIfIOSSafari();
        this.iOSVersion = this.getIOSVersion();
        this.supportsFileShare = null; // 將在 init() 中初始化
    }
    
    async init() {
        this.supportsFileShare = await this.checkFileShareSupport();
        return this;
    }
    
    checkShareSupport() {
        return 'share' in navigator;
    }
    
    async checkFileShareSupport() {
        if (!this.supportsShare) return false;
        
        try {
            // 基本檢查
            if (!navigator.canShare) return false;
            
            // iOS Safari 特定檢查
            if (this.isIOSSafari) {
                // iOS 12.2+ 才支援 Web Share API
                if (this.iOSVersion && this.iOSVersion.major < 12) {
                    return false;
                }
                if (this.iOSVersion && this.iOSVersion.major === 12 && this.iOSVersion.minor < 2) {
                    return false;
                }
            }
            
            // 使用空檔案陣列測試
            const canShareFiles = navigator.canShare({ files: [] });
            
            // 為 iOS Safari 做進一步測試
            if (this.isIOSSafari && canShareFiles) {
                // 創建一個測試用的小 PNG 檔案
                const testCanvas = document.createElement('canvas');
                testCanvas.width = 1;
                testCanvas.height = 1;
                
                try {
                    const blob = await new Promise((resolve, reject) => {
                        testCanvas.toBlob((blob) => {
                            if (blob) resolve(blob);
                            else reject(new Error('Failed to create test blob'));
                        }, 'image/png');
                    });
                    
                    const testFile = new File([blob], 'test.png', { type: 'image/png' });
                    return navigator.canShare({ files: [testFile] });
                } catch (error) {
                    return false;
                }
            }
            
            return canShareFiles;
        } catch (error) {
            return false;
        }
    }
    
    checkIfDesktop() {
        // 檢測是否為桌面裝置
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        return !isMobile;
    }
    
    checkIfIOS() {
        // 檢測是否為 iOS 裝置
        const userAgent = navigator.userAgent;
        return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    }
    
    getIOSVersion() {
        // 取得 iOS 版本號
        if (!this.checkIfIOS()) return null;
        
        const match = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
        if (match) {
            return {
                major: parseInt(match[1], 10),
                minor: parseInt(match[2], 10),
                patch: match[3] ? parseInt(match[3], 10) : 0
            };
        }
        return null;
    }
    
    checkIfIOSSafari() {
        // 檢測是否為 iOS Safari（非第三方瀏覽器）
        if (!this.checkIfIOS()) return false;
        
        const userAgent = navigator.userAgent;
        // iOS Safari 不會包含 Chrome, CriOS, FxiOS 等標識
        return !/CriOS|FxiOS|OPiOS|mercury/i.test(userAgent) && /Safari/i.test(userAgent);
    }
    
    async shareBlob(blob, filename, text = '') {
        console.log('ShareHandler: 嘗試分享圖片', {
            supportsShare: this.supportsShare,
            supportsFileShare: this.supportsFileShare,
            isDesktop: this.isDesktop,
            isIOS: this.isIOS,
            isIOSSafari: this.isIOSSafari,
            iOSVersion: this.iOSVersion,
            isHttps: location.protocol === 'https:',
            userAgent: navigator.userAgent.substring(0, 100) + '...'
        });
        
        // 桌面裝置直接下載
        if (this.isDesktop) {
            console.log('ShareHandler: 使用下載方式（桌面裝置）');
            await this.downloadBlob(blob, filename);
            return { 
                success: true, 
                method: 'download',
                message: '圖片已下載至您的裝置'
            };
        }
        
        // 不支援檔案分享時直接下載
        if (!this.supportsFileShare) {
            console.log('ShareHandler: 使用下載方式（不支援檔案分享）');
            await this.downloadBlob(blob, filename);
            return { 
                success: true, 
                method: 'download',
                message: '裝置不支援檔案分享，圖片已下載'
            };
        }
        
        try {
            const file = new File([blob], filename, { type: blob.type });
            
            // iOS Safari 特殊處理
            if (this.isIOSSafari) {
                console.log('ShareHandler: iOS Safari 特殊處理模式');
                
                // 驗證 HTTPS 環境
                if (location.protocol !== 'https:') {
                    console.log('ShareHandler: iOS Safari 需要 HTTPS 環境，使用下載方式');
                    await this.downloadBlob(blob, filename);
                    return { 
                        success: true, 
                        method: 'download',
                        message: '需要 HTTPS 環境才能使用分享功能，圖片已下載'
                    };
                }
                
                // 檢查檔案大小（iOS 可能有限制）
                if (blob.size > 10 * 1024 * 1024) { // 10MB 限制
                    console.log('ShareHandler: 檔案過大，使用下載方式');
                    await this.downloadBlob(blob, filename);
                    return { 
                        success: true, 
                        method: 'download',
                        message: '檔案過大，圖片已下載'
                    };
                }
            }
            
            // 檢查是否可以分享此檔案
            const canShare = navigator.canShare({ files: [file] });
            console.log('ShareHandler: canShare 結果:', canShare);
            
            if (!canShare) {
                console.log('ShareHandler: 無法分享檔案，使用下載方式');
                await this.downloadBlob(blob, filename);
                return { 
                    success: true, 
                    method: 'download',
                    message: '裝置不支援檔案分享，圖片已下載'
                };
            }
            
            console.log('ShareHandler: 使用原生分享 API');
            
            // iOS Safari 可能需要特殊的分享參數
            const shareData = {
                files: [file],
                title: '我的相框照片'
            };
            
            // 為 iOS Safari 添加 text 參數
            if (this.isIOSSafari && text) {
                shareData.text = text;
            }
            
            console.log('ShareHandler: 分享參數:', shareData);
            await navigator.share(shareData);
            
            return { 
                success: true, 
                method: 'share',
                message: '分享成功'
            };
        } catch (error) {
            console.warn('ShareHandler: 分享失敗，錯誤類型:', error.name, '錯誤訊息:', error.message);
            
            // 使用者取消分享不算錯誤
            if (error.name === 'AbortError') {
                console.log('ShareHandler: 使用者取消分享');
                return { 
                    success: false, 
                    method: 'cancelled',
                    message: '使用者取消分享'
                };
            }
            
            // iOS Safari 特殊錯誤處理
            if (this.isIOSSafari) {
                if (error.name === 'NotAllowedError') {
                    console.log('ShareHandler: iOS Safari 不允許分享，可能是裝置限制');
                } else if (error.name === 'DataError') {
                    console.log('ShareHandler: iOS Safari 檔案格式或大小問題');
                }
            }
            
            // 其他錯誤則回退到下載
            await this.downloadBlob(blob, filename);
            return { 
                success: true, 
                method: 'download',
                message: '分享失敗，圖片已下載至您的裝置'
            };
        }
    }
    
    async downloadBlob(blob, filename) {
        return new Promise((resolve, reject) => {
            try {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                
                link.href = url;
                link.download = filename;
                link.style.display = 'none';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                    resolve();
                }, 100);
            } catch (error) {
                reject(error);
            }
        });
    }
    
    getShareCapabilities() {
        return {
            supportsShare: this.supportsShare,
            supportsFileShare: this.supportsFileShare,
            isDesktop: this.isDesktop,
            isIOS: this.isIOS,
            isIOSSafari: this.isIOSSafari,
            iOSVersion: this.iOSVersion,
            isHttps: location.protocol === 'https:',
            userAgent: navigator.userAgent
        };
    }
    
    getPlatformRecommendation(format) {
        const recommendations = {
            square: ['Instagram 貼文', 'Facebook 貼文', 'Twitter 貼文'],
            portrait: ['Instagram 直式貼文', 'Facebook 貼文'],
            story: ['Instagram 限時動態', 'TikTok', 'Facebook 限時動態']
        };
        
        return recommendations[format] || ['社群媒體分享'];
    }
    
    getShareMethodDescription() {
        if (this.isDesktop) {
            return '電腦裝置將自動下載圖片';
        } else if (this.isIOSSafari) {
            if (this.supportsFileShare) {
                return 'iOS Safari 支援原生分享功能';
            } else {
                return 'iOS Safari - 將自動下載圖片至裝置';
            }
        } else if (this.supportsFileShare) {
            return '支援原生分享功能';
        } else {
            return '將自動下載圖片至裝置';
        }
    }
}