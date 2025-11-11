export class ShareHandler {
    constructor() {
        this.supportsShare = this.checkShareSupport();
        this.supportsFileShare = this.checkFileShareSupport();
        this.isDesktop = this.checkIfDesktop();
    }
    
    checkShareSupport() {
        return 'share' in navigator;
    }
    
    checkFileShareSupport() {
        if (!this.supportsShare) return false;
        
        try {
            return navigator.canShare && navigator.canShare({ files: [] });
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
    
    async shareBlob(blob, filename, text = '') {
        console.log('ShareHandler: 嘗試分享圖片', {
            supportsShare: this.supportsShare,
            supportsFileShare: this.supportsFileShare,
            isDesktop: this.isDesktop,
            isHttps: location.protocol === 'https:'
        });
        
        // 桌面裝置或不支援檔案分享時，直接下載
        if (this.isDesktop || !this.supportsFileShare) {
            console.log('ShareHandler: 使用下載方式（桌面裝置或不支援檔案分享）');
            await this.downloadBlob(blob, filename);
            return { 
                success: true, 
                method: 'download',
                message: '圖片已下載至您的裝置'
            };
        }
        
        try {
            const file = new File([blob], filename, { type: blob.type });
            
            // 檢查是否可以分享此檔案
            const canShare = navigator.canShare({ files: [file] });
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
            await navigator.share({
                files: [file],
                title: '我的相框照片',
                text: text || '快來看看我的相框照片！'
            });
            
            return { 
                success: true, 
                method: 'share',
                message: '分享成功'
            };
        } catch (error) {
            console.warn('ShareHandler: 分享失敗，回退至下載方式:', error);
            
            // 使用者取消分享不算錯誤
            if (error.name === 'AbortError') {
                return { 
                    success: false, 
                    method: 'cancelled',
                    message: '使用者取消分享'
                };
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
        } else if (this.supportsFileShare) {
            return '支援原生分享功能';
        } else {
            return '將自動下載圖片至裝置';
        }
    }
}