export class ImageHandler {
    constructor() {
        this.maxDimension = 3000;
        this.jpegQuality = 0.92;
    }
    
    async processImage(file) {
        const imageData = await this.readFileAsArrayBuffer(file);
        const orientation = this.getExifOrientation(imageData);
        
        const img = await this.loadImageFromFile(file);
        
        const correctedImage = this.applyOrientationCorrection(img, orientation);
        
        const resizedImage = this.resizeIfNeeded(correctedImage);
        
        return resizedImage;
    }
    
    async loadImageFromFile(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            
            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(img);
            };
            
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Failed to load image'));
            };
            
            img.src = url;
        });
    }
    
    async loadImageFromUrl(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image from ${url}`));
            
            img.src = url;
        });
    }
    
    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            
            reader.readAsArrayBuffer(file);
        });
    }
    
    getExifOrientation(buffer) {
        const view = new DataView(buffer);
        
        if (view.getUint16(0, false) !== 0xFFD8) {
            return 1;
        }
        
        let offset = 2;
        let marker;
        
        while (offset < view.byteLength) {
            marker = view.getUint16(offset, false);
            
            if (marker === 0xFFE1) {
                const exifLength = view.getUint16(offset + 2, false);
                const exifStart = offset + 4;
                const tiffStart = exifStart + 6;
                
                if (view.getUint32(exifStart, false) !== 0x45786966) {
                    return 1;
                }
                
                const little = view.getUint16(tiffStart, false) === 0x4949;
                
                if (view.getUint16(tiffStart + 2, little) !== 0x002A) {
                    return 1;
                }
                
                const firstIFDOffset = view.getUint32(tiffStart + 4, little);
                const ifdStart = tiffStart + firstIFDOffset;
                
                if (ifdStart + 2 > view.byteLength) return 1;
                
                const entries = view.getUint16(ifdStart, little);
                
                for (let i = 0; i < entries; i++) {
                    const entryOffset = ifdStart + 2 + (i * 12);
                    
                    if (entryOffset + 12 > view.byteLength) break;
                    
                    const tag = view.getUint16(entryOffset, little);
                    
                    if (tag === 0x0112) {
                        return view.getUint16(entryOffset + 8, little);
                    }
                }
                
                break;
            }
            
            if (marker === 0xFFDA) break;
            
            offset += 2 + view.getUint16(offset + 2, false);
        }
        
        return 1;
    }
    
    applyOrientationCorrection(img, orientation) {
        if (orientation === 1) {
            return img;
        }
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        let { width, height } = img;
        
        switch (orientation) {
            case 2:
                canvas.width = width;
                canvas.height = height;
                ctx.transform(-1, 0, 0, 1, width, 0);
                break;
            case 3:
                canvas.width = width;
                canvas.height = height;
                ctx.transform(-1, 0, 0, -1, width, height);
                break;
            case 4:
                canvas.width = width;
                canvas.height = height;
                ctx.transform(1, 0, 0, -1, 0, height);
                break;
            case 5:
                canvas.width = height;
                canvas.height = width;
                ctx.transform(0, 1, 1, 0, 0, 0);
                break;
            case 6:
                canvas.width = height;
                canvas.height = width;
                ctx.transform(0, 1, -1, 0, height, 0);
                break;
            case 7:
                canvas.width = height;
                canvas.height = width;
                ctx.transform(0, -1, -1, 0, height, width);
                break;
            case 8:
                canvas.width = height;
                canvas.height = width;
                ctx.transform(0, -1, 1, 0, 0, width);
                break;
            default:
                canvas.width = width;
                canvas.height = height;
        }
        
        ctx.drawImage(img, 0, 0);
        
        const correctedImg = new Image();
        correctedImg.src = canvas.toDataURL('image/jpeg', this.jpegQuality);
        
        return new Promise((resolve) => {
            correctedImg.onload = () => resolve(correctedImg);
        });
    }
    
    resizeIfNeeded(img) {
        const maxDim = Math.max(img.width, img.height);
        
        if (maxDim <= this.maxDimension) {
            return Promise.resolve(img);
        }
        
        const scale = this.maxDimension / maxDim;
        const newWidth = Math.round(img.width * scale);
        const newHeight = Math.round(img.height * scale);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        const resizedImg = new Image();
        resizedImg.src = canvas.toDataURL('image/jpeg', this.jpegQuality);
        
        return new Promise((resolve) => {
            resizedImg.onload = () => resolve(resizedImg);
        });
    }
}