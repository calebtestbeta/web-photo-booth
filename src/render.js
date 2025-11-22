import { resourceManager } from './resource-manager.js';

export class RenderEngine {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        
        this.outputFormats = {
            square: { width: 1080, height: 1080, name: '正方形 (IG 貼文)' },
            portrait: { width: 1080, height: 1350, name: '直式 (IG 貼文)' },
            story: { width: 1080, height: 1920, name: '限時動態 (IG/TikTok)' }
        };
        
        this.currentFormat = 'square';
        this.outputWidth = this.outputFormats[this.currentFormat].width;
        this.outputHeight = this.outputFormats[this.currentFormat].height;
        
        this.safeAreaMargin = 0.05;
        
        this.canvas.width = this.outputWidth;
        this.canvas.height = this.outputHeight;
        
        this.setupCanvas();
    }
    
    setupCanvas() {
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
    }
    
    setOutputFormat(format) {
        if (this.outputFormats[format]) {
            this.currentFormat = format;
            this.outputWidth = this.outputFormats[format].width;
            this.outputHeight = this.outputFormats[format].height;
            
            this.canvas.width = this.outputWidth;
            this.canvas.height = this.outputHeight;
            
            this.setupCanvas();
            return true;
        }
        return false;
    }
    
    getCurrentFormat() {
        return {
            key: this.currentFormat,
            ...this.outputFormats[this.currentFormat]
        };
    }
    
    getAvailableFormats() {
        return Object.entries(this.outputFormats).map(([key, format]) => ({
            key,
            ...format
        }));
    }
    
    getSafeArea() {
        const margin = this.safeAreaMargin;
        const safeWidth = this.outputWidth * (1 - 2 * margin);
        const safeHeight = this.outputHeight * (1 - 2 * margin);
        
        return {
            x: this.outputWidth * margin,
            y: this.outputHeight * margin,
            width: safeWidth,
            height: safeHeight
        };
    }
    
    render(image, transform, frameImage, customState = null) {
        this.ctx.clearRect(0, 0, this.outputWidth, this.outputHeight);
        
        this.drawBackground();
        
        if (image) {
            this.drawImage(image, transform);
        }
        
        // 繪製自定義圖片（如果置於文字後方）
        if (customState && customState.image.enabled && customState.image.visible && 
            customState.image.data && customState.image.behindText) {
            this.drawCustomImage(customState.image);
        }
        
        // 繪製自定義文字
        if (customState && customState.text.enabled && customState.text.visible && 
            customState.text.content.trim()) {
            this.drawCustomText(customState.text);
        }
        
        // 繪製自定義圖片（如果置於文字前方）
        if (customState && customState.image.enabled && customState.image.visible && 
            customState.image.data && !customState.image.behindText) {
            this.drawCustomImage(customState.image);
        }
        
        if (frameImage) {
            this.drawFrame(frameImage);
        }
        
        if (!image) {
            this.drawPlaceholder();
        }
    }
    
    drawBackground() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.outputWidth, this.outputHeight);
    }
    
    drawImage(image, transform) {
        this.ctx.save();
        
        const centerX = this.outputWidth / 2;
        const centerY = this.outputHeight / 2;
        
        this.ctx.translate(centerX + transform.x, centerY + transform.y);
        
        if (transform.rotation) {
            this.ctx.rotate(transform.rotation);
        }
        
        this.ctx.scale(transform.scale, transform.scale);
        
        const drawWidth = image.width;
        const drawHeight = image.height;
        
        this.ctx.drawImage(
            image,
            -drawWidth / 2,
            -drawHeight / 2,
            drawWidth,
            drawHeight
        );
        
        this.ctx.restore();
    }
    
    drawFrame(frameImage) {
        this.ctx.drawImage(
            frameImage,
            0, 0,
            frameImage.width, frameImage.height,
            0, 0,
            this.outputWidth, this.outputHeight
        );
    }
    
    drawPlaceholder() {
        this.ctx.save();
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 5]);
        
        const safeArea = this.getSafeArea();
        
        this.ctx.strokeRect(
            safeArea.x,
            safeArea.y,
            safeArea.width,
            safeArea.height
        );
        
        
        this.ctx.restore();
    }
    
    drawCustomText(textState) {
        const text = textState.content.trim();
        if (!text) return;
        
        this.ctx.save();
        
        // 計算文字位置
        const textX = this.outputWidth * (textState.positionX / 100);
        const textY = this.outputHeight * (textState.positionY / 100);
        
        // 設定字體
        this.ctx.font = `${textState.fontSize}px "PingFang TC", "Microsoft JhengHei", "Noto Sans CJK TC", sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // 文字旋轉
        if (textState.rotation !== 0) {
            this.ctx.translate(textX, textY);
            this.ctx.rotate((textState.rotation * Math.PI) / 180);
            this.ctx.translate(-textX, -textY);
        }
        
        // 繪製文字陰影
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        
        // 繪製文字
        this.ctx.fillStyle = textState.color;
        
        // 處理多行文字
        const lines = text.split('\n');
        const lineHeight = textState.fontSize * 1.2;
        const startY = textY - ((lines.length - 1) * lineHeight) / 2;
        
        lines.forEach((line, index) => {
            this.ctx.fillText(line, textX, startY + (index * lineHeight));
        });
        
        this.ctx.restore();
    }
    
    drawCustomImage(imageState) {
        if (!imageState.data) return;
        
        this.ctx.save();
        
        // 計算圖片位置和尺寸
        const size = imageState.size / 100;
        const opacity = imageState.opacity / 100;
        const posX = (imageState.positionX / 100) * this.outputWidth;
        const posY = (imageState.positionY / 100) * this.outputHeight;
        
        // 計算縮放尺寸
        const maxSize = Math.min(this.outputWidth, this.outputHeight) * 0.6;
        const scale = (maxSize * size) / Math.max(imageState.data.width, imageState.data.height);
        const drawWidth = imageState.data.width * scale;
        const drawHeight = imageState.data.height * scale;
        
        // 設定透明度
        this.ctx.globalAlpha = opacity;
        
        // 移動到圖片中心
        this.ctx.translate(posX, posY);
        
        // 繪製圖片
        this.ctx.drawImage(
            imageState.data,
            -drawWidth / 2,
            -drawHeight / 2,
            drawWidth,
            drawHeight
        );
        
        this.ctx.restore();
    }
    
    async exportImage(image, transform, frameImage, customState = null) {
        const exportCanvas = resourceManager.createCanvas(this.outputWidth, this.outputHeight, 'image-export');
        const exportCtx = exportCanvas.getContext('2d');
        
        exportCtx.imageSmoothingEnabled = true;
        exportCtx.imageSmoothingQuality = 'high';
        
        exportCtx.fillStyle = '#ffffff';
        exportCtx.fillRect(0, 0, this.outputWidth, this.outputHeight);
        
        if (image) {
            exportCtx.save();
            
            const centerX = this.outputWidth / 2;
            const centerY = this.outputHeight / 2;
            
            exportCtx.translate(centerX + transform.x, centerY + transform.y);
            
            if (transform.rotation) {
                exportCtx.rotate(transform.rotation);
            }
            
            exportCtx.scale(transform.scale, transform.scale);
            
            const drawWidth = image.width;
            const drawHeight = image.height;
            
            exportCtx.drawImage(
                image,
                -drawWidth / 2,
                -drawHeight / 2,
                drawWidth,
                drawHeight
            );
            
            exportCtx.restore();
        }
        
        // 導出時也需要渲染自定義元素
        if (customState) {
            // 暫時保存原始 ctx
            const originalCtx = this.ctx;
            this.ctx = exportCtx;
            
            // 繪製自定義圖片（如果置於文字後方）
            if (customState.image.enabled && customState.image.visible && 
                customState.image.data && customState.image.behindText) {
                this.drawCustomImage(customState.image);
            }
            
            // 繪製自定義文字
            if (customState.text.enabled && customState.text.visible && 
                customState.text.content.trim()) {
                this.drawCustomText(customState.text);
            }
            
            // 繪製自定義圖片（如果置於文字前方）
            if (customState.image.enabled && customState.image.visible && 
                customState.image.data && !customState.image.behindText) {
                this.drawCustomImage(customState.image);
            }
            
            // 恢復原始 ctx
            this.ctx = originalCtx;
        }
        
        if (frameImage) {
            exportCtx.drawImage(
                frameImage,
                0, 0,
                frameImage.width, frameImage.height,
                0, 0,
                this.outputWidth, this.outputHeight
            );
        }
        
        return new Promise((resolve) => {
            exportCanvas.toBlob((blob) => {
                // 清理 export canvas
                resourceManager.releaseCanvas(exportCanvas);
                resolve(blob);
            }, 'image/png', 1.0);
        });
    }
}