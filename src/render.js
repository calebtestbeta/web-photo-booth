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
    
    render(image, transform, frameImage) {
        this.ctx.clearRect(0, 0, this.outputWidth, this.outputHeight);
        
        this.drawBackground();
        
        if (image) {
            this.drawImage(image, transform);
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
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.font = '24px -apple-system, BlinkMacSystemFont, sans-serif';
        
        this.ctx.fillText(
            'Safe Area',
            this.outputWidth / 2,
            this.outputHeight / 2 + 100
        );
        
        this.ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
        this.ctx.fillText(
            'Your photo will be positioned here',
            this.outputWidth / 2,
            this.outputHeight / 2 + 130
        );
        
        this.ctx.restore();
    }
    
    async exportImage(image, transform, frameImage) {
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        
        exportCanvas.width = this.outputWidth;
        exportCanvas.height = this.outputHeight;
        
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
            exportCanvas.toBlob(resolve, 'image/png', 1.0);
        });
    }
}