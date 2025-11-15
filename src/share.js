import { resourceManager } from './resource-manager.js';
import { analytics } from './analytics.js';

export class ShareHandler {
    constructor() {
        this.supportsShare = this.checkShareSupport();
        this.isDesktop = this.checkIfDesktop();
        this.isIOS = this.checkIfIOS();
        this.isIOSSafari = this.checkIfIOSSafari();
        this.iOSVersion = this.getIOSVersion();
        this.supportsFileShare = this.checkFileShareSupport();
        
        // 輸出初始化資訊
        console.log('ShareHandler 初始化完成:', this.getShareCapabilities());
    }
    
    checkShareSupport() {
        return 'share' in navigator;
    }
    
    checkFileShareSupport() {
        if (!this.supportsShare) {
            console.log('ShareHandler: 不支援基本分享功能');
            return false;
        }
        
        try {
            // 基本檢查
            if (!navigator.canShare) {
                console.log('ShareHandler: navigator.canShare 不存在');
                return false;
            }
            
            // iOS Safari 版本檢查
            if (this.isIOSSafari) {
                if (this.iOSVersion && this.iOSVersion.major < 12) {
                    console.log('ShareHandler: iOS 版本太舊，不支援 Web Share API');
                    return false;
                }
                if (this.iOSVersion && this.iOSVersion.major === 12 && this.iOSVersion.minor < 2) {
                    console.log('ShareHandler: iOS 12.2 以下不支援檔案分享');
                    return false;
                }
                console.log('ShareHandler: iOS Safari 版本檢查通過');
            }
            
            // 簡單測試檔案分享能力
            const canShareFiles = navigator.canShare({ files: [] });
            console.log('ShareHandler: 基本檔案分享檢測結果:', canShareFiles);
            
            return canShareFiles;
        } catch (error) {
            console.log('ShareHandler: 檔案分享檢測錯誤:', error);
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
            blobSize: blob.size,
            filename: filename
        });
        
        // 桌面裝置直接下載
        if (this.isDesktop) {
            console.log('ShareHandler: 桌面裝置使用下載方式');
            await this.downloadBlob(blob, filename);
            return { 
                success: true, 
                method: 'download',
                message: '圖片已下載至您的裝置'
            };
        }
        
        // 嘗試多重分享策略
        return await this.tryMultipleShareStrategies(blob, filename, text);
    }
    
    async tryMultipleShareStrategies(blob, filename, text = '') {
        const strategies = [
            () => this.shareWithFile(blob, filename, text),
            () => this.shareWithDataUrl(blob, filename, text),
            () => this.fallbackToDownload(blob, filename)
        ];
        
        for (let i = 0; i < strategies.length; i++) {
            try {
                console.log(`ShareHandler: 嘗試策略 ${i + 1}`);
                const result = await strategies[i]();
                if (result.success || result.method === 'cancelled') {
                    // 追蹤分享成功
                    if (result.success) {
                        analytics.trackShare(result.method, 'unknown', analytics.getCurrentTheme(), true);
                    }
                    return result;
                }
            } catch (error) {
                console.log(`ShareHandler: 策略 ${i + 1} 失敗:`, error.name, error.message);
                // 繼續下一個策略
            }
        }
        
        // 所有策略都失敗
        analytics.trackShare('all_strategies_failed', 'unknown', analytics.getCurrentTheme(), false);
        analytics.trackError('share_all_failed', '所有分享策略都失敗', 'tryMultipleShareStrategies');
        
        return {
            success: false,
            method: 'failed',
            message: '所有分享方式都失敗了'
        };
    }
    
    async shareWithFile(blob, filename, text) {
        console.log('ShareHandler: 嘗試檔案分享');
        
        if (!this.supportsShare) {
            throw new Error('不支援基本分享功能');
        }
        
        const file = new File([blob], filename, { type: blob.type });
        
        // 在嘗試分享前即時檢查
        const canShare = navigator.canShare({ files: [file] });
        console.log('ShareHandler: 即時 canShare 檢測:', canShare);
        
        if (!canShare) {
            throw new Error('無法分享此檔案');
        }
        
        const shareData = {
            files: [file],
            title: '我的相框照片'
        };
        
        if (text) {
            shareData.text = text;
        }
        
        console.log('ShareHandler: 分享參數:', shareData);
        await navigator.share(shareData);
        
        return {
            success: true,
            method: 'share',
            message: '分享成功'
        };
    }
    
    async shareWithDataUrl(blob, filename, text) {
        console.log('ShareHandler: 嘗試 Data URL 分享');
        
        if (!this.supportsShare) {
            throw new Error('不支援基本分享功能');
        }
        
        // 創建 data URL
        const dataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
        
        const shareData = {
            title: '我的相框照片',
            text: text || '快來看看我的相框照片！',
            url: dataUrl
        };
        
        const canShare = navigator.canShare(shareData);
        console.log('ShareHandler: Data URL canShare 檢測:', canShare);
        
        if (!canShare) {
            throw new Error('無法分享 Data URL');
        }
        
        await navigator.share(shareData);
        
        return {
            success: true,
            method: 'share_dataurl',
            message: '分享成功（Data URL）'
        };
    }
    
    async fallbackToDownload(blob, filename) {
        console.log('ShareHandler: 回退到下載方式');
        await this.downloadBlob(blob, filename);
        return {
            success: true,
            method: 'download',
            message: '分享功能不可用，圖片已下載'
        };
    }
    
    async downloadBlob(blob, filename) {
        // 為行動裝置提供圖片預覽和操作指引
        if (!this.isDesktop) {
            return this.showImagePreviewForMobile(blob, filename);
        }
        
        // 桌面裝置使用傳統下載
        return new Promise((resolve, reject) => {
            try {
                const url = resourceManager.createBlobUrl(blob, 'download');
                const link = document.createElement('a');
                
                link.href = url;
                link.download = filename;
                link.style.display = 'none';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                setTimeout(() => {
                    resourceManager.revokeBlobUrl(url);
                    resolve();
                }, 100);
            } catch (error) {
                reject(error);
            }
        });
    }
    
    async showImagePreviewForMobile(blob, filename) {
        return new Promise((resolve) => {
            // 創建彈窗容器
            const modal = document.createElement('div');
            modal.className = 'image-preview-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 20px;
                box-sizing: border-box;
            `;
            
            // 創庺圖片元素
            const img = document.createElement('img');
            const imageUrl = resourceManager.createBlobUrl(blob, 'mobile-preview');
            img.src = imageUrl;
            img.className = 'preview-image';
            img.alt = '預覽圖片 - 長按可儲存';
            img.crossOrigin = 'anonymous'; // 支援跨域圖片
            img.style.cssText = `
                max-width: 90%;
                max-height: 60%;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            `;
            
            // 創建指引文字
            const instructions = document.createElement('div');
            instructions.style.cssText = `
                color: white;
                text-align: center;
                margin-top: 20px;
                font-size: 16px;
                line-height: 1.5;
            `;
            
            if (this.isIOS) {
                instructions.innerHTML = `
                    <p style="margin: 10px 0; font-weight: bold; color: #3498db;">圖片已準備好！</p>
                    <p style="margin: 10px 0; font-size: 18px;">🔄 <strong>長按上方圖片</strong> 🔄</p>
                    <p style="margin: 10px 0; font-size: 16px;">然後選擇「<strong>儲存影像</strong>」或「<strong>儲存至相片</strong>」</p>
                    <p style="margin: 15px 0 5px 0; font-size: 14px; opacity: 0.7;">ℹ️ 如果長按沒有反應，請使用下方下載按鈕</p>
                `;
            } else {
                instructions.innerHTML = `
                    <p style="margin: 10px 0; font-weight: bold; color: #3498db;">圖片已準備好！</p>
                    <p style="margin: 10px 0; font-size: 18px;">🔄 <strong>長按上方圖片</strong> 🔄</p>
                    <p style="margin: 10px 0; font-size: 16px;">並選擇「<strong>保存圖片</strong>」或「<strong>下載</strong>」</p>
                    <p style="margin: 15px 0 5px 0; font-size: 14px; opacity: 0.7;">ℹ️ 如果長按沒有反應，請使用下方下載按鈕</p>
                `;
            }
            
            // 創建按鈕容器
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'preview-buttons';
            buttonContainer.style.cssText = `
                display: flex;
                gap: 15px;
                margin-top: 20px;
            `;
            
            // 下載按鈕
            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = '下載';
            downloadBtn.style.cssText = `
                padding: 12px 24px;
                background: #3498db;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 16px;
                cursor: pointer;
                transition: background 0.2s;
            `;
            
            downloadBtn.onclick = () => {
                // 傳統下載方式
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = filename;
                link.click();
            };
            
            // 關閉按鈕
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '關閉';
            closeBtn.style.cssText = `
                padding: 12px 24px;
                background: #666;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 16px;
                cursor: pointer;
                transition: background 0.2s;
            `;
            
            const cleanup = () => {
                resourceManager.revokeBlobUrl(imageUrl);
                document.body.removeChild(modal);
                resolve();
            };
            
            closeBtn.onclick = cleanup;
            
            // 優化事件處理，避免干擾圖片的長按事件
            modal.onclick = (e) => {
                // 只有點擊 modal 背景時才關閉，不包括圖片區域
                if (e.target === modal) {
                    cleanup();
                }
            };
            
            // 阻止圖片點擊事件冒泡到 modal
            img.onclick = (e) => {
                e.stopPropagation();
            };
            
            // 為圖片添加提示事件
            img.ontouchstart = (e) => {
                // 不阻止預設事件，讓長按正常運作
                console.log('長按圖片可儲存至相簿');
            };
            
            // 組裝元素
            buttonContainer.appendChild(downloadBtn);
            buttonContainer.appendChild(closeBtn);
            
            modal.appendChild(img);
            modal.appendChild(instructions);
            modal.appendChild(buttonContainer);
            
            document.body.appendChild(modal);
            
            // 防止背景滾動
            document.body.style.overflow = 'hidden';
            
            // 清理時恢復滾動
            const originalCleanup = cleanup;
            const newCleanup = () => {
                document.body.style.overflow = '';
                originalCleanup();
            };
            
            closeBtn.onclick = newCleanup;
            modal.onclick = (e) => {
                if (e.target === modal) newCleanup();
            };
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
            return 'iOS Safari - 將嘗試多種分享方式，如失敗則提供圖片預覽';
        } else if (this.isIOS) {
            return 'iOS 裝置 - 將嘗試原生分享或提供圖片預覽';
        } else if (this.supportsFileShare) {
            return '支援原生分享功能';
        } else {
            return '將提供圖片預覽和下載選項';
        }
    }
}