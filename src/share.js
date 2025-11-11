export class ShareHandler {
    constructor() {
        this.supportsShare = this.checkShareSupport();
        this.supportsFileShare = this.checkFileShareSupport();
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
    
    async shareBlob(blob, filename, text = '') {
        if (!this.supportsFileShare) {
            await this.downloadBlob(blob, filename);
            return false;
        }
        
        try {
            const file = new File([blob], filename, { type: blob.type });
            
            const canShare = navigator.canShare({ files: [file] });
            if (!canShare) {
                await this.downloadBlob(blob, filename);
                return false;
            }
            
            await navigator.share({
                files: [file],
                title: 'My Framed Photo',
                text: text || 'Check out my framed photo!'
            });
            
            return true;
        } catch (error) {
            console.warn('Share failed, falling back to download:', error);
            await this.downloadBlob(blob, filename);
            return false;
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
    
    async copyImageToClipboard(blob) {
        if (!navigator.clipboard || !navigator.clipboard.write) {
            return false;
        }
        
        try {
            const clipboardItem = new ClipboardItem({
                [blob.type]: blob
            });
            
            await navigator.clipboard.write([clipboardItem]);
            return true;
        } catch (error) {
            console.warn('Failed to copy to clipboard:', error);
            return false;
        }
    }
}