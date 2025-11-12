/**
 * 資源管理器 - 統一管理 Canvas、Blob URL 和其他資源
 * 防止記憶體洩漏，提供自動清理機制
 */
export class ResourceManager {
    constructor() {
        // 追蹤所有活躍的資源
        this.blobUrls = new Set();
        this.canvases = new Map(); // 儲存 canvas 和其用途
        this.timers = new Set();
        
        // 記憶體監控相關
        this.memoryWarningThreshold = 50 * 1024 * 1024; // 50MB 警告閾值
        this.lastMemoryCheck = 0;
        this.memoryCheckInterval = 30000; // 30秒檢查一次
        
        // 自動清理設定
        this.autoCleanupEnabled = true;
        this.cleanupInterval = 60000; // 1分鐘清理一次
        this.maxBlobAge = 300000; // 5分鐘後自動清理未使用的 Blob
        
        // 資源使用統計
        this.stats = {
            blobsCreated: 0,
            blobsDestroyed: 0,
            canvasesCreated: 0,
            canvasesDestroyed: 0,
            memoryWarnings: 0
        };
        
        this.init();
    }
    
    init() {
        console.log('ResourceManager: 初始化資源管理器');
        
        if (this.autoCleanupEnabled) {
            this.startAutoCleanup();
        }
        
        // 頁面卸載時清理所有資源
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
        
        // 定期記憶體檢查
        this.startMemoryMonitoring();
    }
    
    /**
     * 創建並追蹤 Blob URL
     */
    createBlobUrl(blob, purpose = 'unknown') {
        const url = URL.createObjectURL(blob);
        const resource = {
            url,
            blob,
            purpose,
            createdAt: Date.now(),
            size: blob.size
        };
        
        this.blobUrls.add(resource);
        this.stats.blobsCreated++;
        
        console.log(`ResourceManager: 創建 Blob URL (${purpose}):`, {
            url: url.substring(0, 50) + '...',
            size: this.formatBytes(blob.size),
            total: this.blobUrls.size
        });
        
        return url;
    }
    
    /**
     * 撤銷並移除 Blob URL
     */
    revokeBlobUrl(url) {
        if (!url) return false;
        
        // 從追蹤集合中找到並移除
        for (const resource of this.blobUrls) {
            if (resource.url === url) {
                URL.revokeObjectURL(url);
                this.blobUrls.delete(resource);
                this.stats.blobsDestroyed++;
                
                console.log(`ResourceManager: 撤銷 Blob URL (${resource.purpose}):`, {
                    size: this.formatBytes(resource.size),
                    age: Date.now() - resource.createdAt + 'ms',
                    remaining: this.blobUrls.size
                });
                return true;
            }
        }
        
        // 如果找不到追蹤記錄，仍然嘗試撤銷
        try {
            URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            console.warn('ResourceManager: 撤銷 Blob URL 失敗:', error);
            return false;
        }
    }
    
    /**
     * 創建並追蹤 Canvas
     */
    createCanvas(width, height, purpose = 'unknown') {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const resource = {
            canvas,
            purpose,
            createdAt: Date.now(),
            width,
            height
        };
        
        const id = `canvas_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.canvases.set(id, resource);
        this.stats.canvasesCreated++;
        
        console.log(`ResourceManager: 創建 Canvas (${purpose}):`, {
            id,
            size: `${width}x${height}`,
            total: this.canvases.size
        });
        
        // 為 canvas 添加標識以便後續清理
        canvas.resourceId = id;
        return canvas;
    }
    
    /**
     * 釋放 Canvas 資源
     */
    releaseCanvas(canvas) {
        if (!canvas || !canvas.resourceId) {
            console.warn('ResourceManager: 嘗試釋放未追蹤的 Canvas');
            return false;
        }
        
        const resource = this.canvases.get(canvas.resourceId);
        if (resource) {
            // 清理 Canvas 內容
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            
            this.canvases.delete(canvas.resourceId);
            this.stats.canvasesDestroyed++;
            
            console.log(`ResourceManager: 釋放 Canvas (${resource.purpose}):`, {
                id: canvas.resourceId,
                age: Date.now() - resource.createdAt + 'ms',
                remaining: this.canvases.size
            });
            return true;
        }
        
        return false;
    }
    
    /**
     * 創建可追蹤的 Timer
     */
    createTimer(callback, delay, type = 'timeout') {
        const timerId = type === 'interval' 
            ? setInterval(callback, delay)
            : setTimeout(callback, delay);
        
        this.timers.add(timerId);
        
        // 自動清理 setTimeout
        if (type === 'timeout') {
            setTimeout(() => {
                this.timers.delete(timerId);
            }, delay + 100);
        }
        
        return timerId;
    }
    
    /**
     * 清除 Timer
     */
    clearTimer(timerId) {
        if (this.timers.has(timerId)) {
            clearTimeout(timerId);
            clearInterval(timerId);
            this.timers.delete(timerId);
            return true;
        }
        return false;
    }
    
    /**
     * 自動清理過期資源
     */
    startAutoCleanup() {
        const cleanupTimer = setInterval(() => {
            this.performCleanup();
        }, this.cleanupInterval);
        
        this.timers.add(cleanupTimer);
        console.log('ResourceManager: 啟動自動清理機制');
    }
    
    /**
     * 執行清理操作
     */
    performCleanup() {
        const now = Date.now();
        let cleanedBlobs = 0;
        
        // 清理過期的 Blob URLs
        for (const resource of this.blobUrls) {
            if (now - resource.createdAt > this.maxBlobAge) {
                this.revokeBlobUrl(resource.url);
                cleanedBlobs++;
            }
        }
        
        if (cleanedBlobs > 0) {
            console.log(`ResourceManager: 自動清理了 ${cleanedBlobs} 個過期 Blob URL`);
        }
        
        // 觸發垃圾回收建議（僅在支援的瀏覽器中）
        if (window.gc && typeof window.gc === 'function') {
            window.gc();
        }
    }
    
    /**
     * 開始記憶體監控
     */
    startMemoryMonitoring() {
        const monitorTimer = setInterval(() => {
            this.checkMemoryUsage();
        }, this.memoryCheckInterval);
        
        this.timers.add(monitorTimer);
    }
    
    /**
     * 檢查記憶體使用狀況
     */
    checkMemoryUsage() {
        if (!performance.memory) {
            return; // 瀏覽器不支援記憶體 API
        }
        
        const memInfo = performance.memory;
        const usedMemory = memInfo.usedJSHeapSize;
        const totalMemory = memInfo.totalJSHeapSize;
        const memoryLimit = memInfo.jsHeapSizeLimit;
        
        // 檢查是否超過警告閾值
        if (usedMemory > this.memoryWarningThreshold) {
            this.stats.memoryWarnings++;
            console.warn('ResourceManager: 記憶體使用量警告', {
                used: this.formatBytes(usedMemory),
                total: this.formatBytes(totalMemory),
                limit: this.formatBytes(memoryLimit),
                percentage: ((usedMemory / memoryLimit) * 100).toFixed(1) + '%'
            });
            
            // 執行緊急清理
            this.performEmergencyCleanup();
        }
        
        this.lastMemoryCheck = Date.now();
    }
    
    /**
     * 緊急清理
     */
    performEmergencyCleanup() {
        console.log('ResourceManager: 執行緊急清理');
        
        // 清理所有 Blob URLs
        const blobCount = this.blobUrls.size;
        for (const resource of this.blobUrls) {
            this.revokeBlobUrl(resource.url);
        }
        
        // 觸發垃圾回收
        if (window.gc && typeof window.gc === 'function') {
            window.gc();
        }
        
        console.log(`ResourceManager: 緊急清理完成，釋放了 ${blobCount} 個 Blob URL`);
    }
    
    /**
     * 取得資源使用統計
     */
    getStats() {
        const memInfo = performance.memory || {};
        
        return {
            ...this.stats,
            activeBlobUrls: this.blobUrls.size,
            activeCanvases: this.canvases.size,
            activeTimers: this.timers.size,
            memory: {
                used: memInfo.usedJSHeapSize || 0,
                total: memInfo.totalJSHeapSize || 0,
                limit: memInfo.jsHeapSizeLimit || 0
            }
        };
    }
    
    /**
     * 清理所有資源
     */
    cleanup() {
        console.log('ResourceManager: 開始清理所有資源');
        
        // 清理所有 Blob URLs
        for (const resource of this.blobUrls) {
            URL.revokeObjectURL(resource.url);
        }
        this.blobUrls.clear();
        
        // 清理所有 Canvas
        for (const [id, resource] of this.canvases) {
            const ctx = resource.canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, resource.canvas.width, resource.canvas.height);
            }
        }
        this.canvases.clear();
        
        // 清理所有 Timers
        for (const timerId of this.timers) {
            clearTimeout(timerId);
            clearInterval(timerId);
        }
        this.timers.clear();
        
        console.log('ResourceManager: 資源清理完成');
    }
    
    /**
     * 格式化位元組大小
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// 全域資源管理器實例
export const resourceManager = new ResourceManager();