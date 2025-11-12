import { resourceManager } from './resource-manager.js';

export class ImageHandler {
    constructor() {
        this.maxDimension = 3000;
        this.jpegQuality = 0.92;
        this.autoCorrectOrientation = true; // 可設定是否自動校正方向
    }
    
    async processImage(file, options = {}) {
        console.log('ImageHandler: 開始處理圖片');
        console.log('ImageHandler: 檔案資訊:', {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: new Date(file.lastModified).toLocaleString()
        });
        
        try {
            // 讀取檔案為 ArrayBuffer
            console.log('ImageHandler: 讀取檔案資料');
            const imageData = await this.readFileAsArrayBuffer(file);
            
            // 安全地取得 EXIF 方向資訊
            console.log('ImageHandler: 解析 EXIF 方向資訊');
            const orientation = this.getExifOrientation(imageData);
            console.log('ImageHandler: EXIF 方向值:', orientation, this.getOrientationDescription(orientation));
            
            // 載入圖片
            console.log('ImageHandler: 載入圖片');
            const img = await this.loadImageFromFile(file);
            console.log('ImageHandler: 原始圖片尺寸:', img.width, 'x', img.height);
            
            // 決定是否套用方向校正
            const shouldCorrect = options.skipOrientation ? false : this.autoCorrectOrientation;
            let correctedImage = img;
            
            if (shouldCorrect && orientation !== 1) {
                console.log('ImageHandler: 套用 EXIF 方向校正');
                correctedImage = await this.applyOrientationCorrection(img, orientation);
                console.log('ImageHandler: 校正後圖片尺寸:', correctedImage.width, 'x', correctedImage.height);
            } else {
                console.log('ImageHandler: 跳過方向校正 (EXIF:', orientation, ', shouldCorrect:', shouldCorrect, ')');
            }
            
            // 調整大小（如果需要）
            console.log('ImageHandler: 檢查是否需要調整大小');
            const resizedImage = await this.resizeIfNeeded(correctedImage);
            
            console.log('ImageHandler: 圖片處理完成，最終尺寸:', resizedImage.width, 'x', resizedImage.height);
            return resizedImage;
        } catch (error) {
            console.error('ImageHandler: 圖片處理失敗:', error);
            throw error;
        }
    }
    
    getOrientationDescription(orientation) {
        const descriptions = {
            1: '正常 (0°)',
            2: '水平翻轉',
            3: '旋轉 180°',
            4: '垂直翻轉',
            5: '順時針 90° + 水平翻轉',
            6: '順時針 90°',
            7: '逆時針 90° + 水平翻轉',
            8: '逆時針 90°'
        };
        return descriptions[orientation] || '未知';
    }
    
    async loadImageFromFile(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = resourceManager.createBlobUrl(file, 'image-loading');
            
            img.onload = () => {
                resourceManager.revokeBlobUrl(url);
                resolve(img);
            };
            
            img.onerror = () => {
                resourceManager.revokeBlobUrl(url);
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
        try {
            // 檢查 buffer 是否有效
            if (!buffer || buffer.byteLength < 4) {
                console.log('EXIF: Buffer 無效或過小，使用預設方向');
                return 1;
            }
            
            const view = new DataView(buffer);
            
            // 檢查 JPEG 檔頭
            if (view.getUint16(0, false) !== 0xFFD8) {
                console.log('EXIF: 非 JPEG 格式，使用預設方向');
                return 1;
            }
            
            let offset = 2;
            let marker;
            
            // 限制迴圈次數避免無限迴圈
            let iterations = 0;
            const maxIterations = 100;
            
            while (offset < view.byteLength && iterations < maxIterations) {
                iterations++;
                
                // 邊界檢查
                if (offset + 4 > view.byteLength) {
                    console.log('EXIF: 到達檔案結尾，使用預設方向');
                    break;
                }
                
                marker = view.getUint16(offset, false);
                
                if (marker === 0xFFE1) {
                    // 找到 EXIF 區段
                    const exifLength = view.getUint16(offset + 2, false);
                    const exifStart = offset + 4;
                    const tiffStart = exifStart + 6;
                    
                    // 邊界檢查
                    if (tiffStart + 8 > view.byteLength) {
                        console.log('EXIF: EXIF 資料不完整');
                        break;
                    }
                    
                    // 檢查 EXIF 標頭
                    if (view.getUint32(exifStart, false) !== 0x45786966) {
                        console.log('EXIF: 無效的 EXIF 標頭');
                        return 1;
                    }
                    
                    // 檢查字節順序
                    const little = view.getUint16(tiffStart, false) === 0x4949;
                    
                    // 檢查 TIFF 魔術數字
                    if (view.getUint16(tiffStart + 2, little) !== 0x002A) {
                        console.log('EXIF: 無效的 TIFF 標頭');
                        return 1;
                    }
                    
                    const firstIFDOffset = view.getUint32(tiffStart + 4, little);
                    const ifdStart = tiffStart + firstIFDOffset;
                    
                    // 邊界檢查
                    if (ifdStart + 2 > view.byteLength) {
                        console.log('EXIF: IFD 位置超出範圍');
                        return 1;
                    }
                    
                    const entries = view.getUint16(ifdStart, little);
                    
                    // 檢查合理的條目數量
                    if (entries > 1000) {
                        console.log('EXIF: 異常的條目數量:', entries);
                        return 1;
                    }
                    
                    for (let i = 0; i < entries; i++) {
                        const entryOffset = ifdStart + 2 + (i * 12);
                        
                        // 邊界檢查
                        if (entryOffset + 12 > view.byteLength) {
                            console.log('EXIF: 條目超出範圍');
                            break;
                        }
                        
                        const tag = view.getUint16(entryOffset, little);
                        
                        // 找到方向標籤 (0x0112)
                        if (tag === 0x0112) {
                            const orientation = view.getUint16(entryOffset + 8, little);
                            console.log('EXIF: 找到方向值:', orientation);
                            
                            // 驗證方向值是否在有效範圍內
                            if (orientation >= 1 && orientation <= 8) {
                                return orientation;
                            } else {
                                console.log('EXIF: 無效的方向值:', orientation);
                                return 1;
                            }
                        }
                    }
                    
                    break;
                }
                
                // 如果遇到圖片資料開始，停止搜尋
                if (marker === 0xFFDA) {
                    console.log('EXIF: 到達圖片資料區段，未找到方向資訊');
                    break;
                }
                
                // 移動到下一個標記
                const segmentSize = view.getUint16(offset + 2, false);
                if (segmentSize < 2) {
                    console.log('EXIF: 無效的區段大小');
                    break;
                }
                
                offset += 2 + segmentSize;
            }
            
            if (iterations >= maxIterations) {
                console.log('EXIF: 達到最大迭代次數，可能有損壞的檔案結構');
            }
            
            console.log('EXIF: 未找到方向資訊，使用預設方向');
            return 1;
            
        } catch (error) {
            console.error('EXIF: 解析過程出錯:', error);
            return 1;
        }
    }
    
    async applyOrientationCorrection(img, orientation) {
        if (orientation === 1) {
            console.log('Canvas: 無需方向校正');
            return img;
        }
        
        console.log('Canvas: 開始方向校正，方向值:', orientation);
        
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                throw new Error('無法建立 Canvas 2D 繪圖環境');
            }
            
            let { width, height } = img;
            
            // 檢查圖片尺寸是否合理
            if (width <= 0 || height <= 0 || width > 32767 || height > 32767) {
                throw new Error(`無效的圖片尺寸: ${width} x ${height}`);
            }
            
            // 設定 Canvas 尺寸和變換
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
                    console.log('Canvas: 未知的方向值，使用預設');
                    canvas.width = width;
                    canvas.height = height;
            }
            
            // 設定繪圖品質
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // 繪製圖片
            ctx.drawImage(img, 0, 0);
            
            // 使用 toBlob 而非 toDataURL 以提升效能
            console.log('Canvas: 轉換為 Blob');
            const blob = await new Promise((resolve, reject) => {
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Canvas toBlob 失敗'));
                        }
                    },
                    'image/jpeg',
                    this.jpegQuality
                );
            });
            
            // 建立新的 Image 物件
            const correctedImg = new Image();
            const url = resourceManager.createBlobUrl(blob, 'orientation-correction');
            
            return new Promise((resolve, reject) => {
                correctedImg.onload = () => {
                    resourceManager.revokeBlobUrl(url);
                    console.log('Canvas: 方向校正完成');
                    resolve(correctedImg);
                };
                
                correctedImg.onerror = () => {
                    resourceManager.revokeBlobUrl(url);
                    reject(new Error('校正後的圖片載入失敗'));
                };
                
                correctedImg.src = url;
            });
            
        } catch (error) {
            console.error('Canvas: 方向校正失敗:', error);
            throw new Error(`方向校正失敗: ${error.message}`);
        }
    }
    
    async resizeIfNeeded(img) {
        const maxDim = Math.max(img.width, img.height);
        
        if (maxDim <= this.maxDimension) {
            console.log('Canvas: 圖片尺寸符合要求，無需調整');
            return img;
        }
        
        console.log('Canvas: 開始調整圖片大小，從', img.width, 'x', img.height);
        
        try {
            const scale = this.maxDimension / maxDim;
            const newWidth = Math.round(img.width * scale);
            const newHeight = Math.round(img.height * scale);
            
            console.log('Canvas: 調整至', newWidth, 'x', newHeight, '縮放比例:', scale.toFixed(3));
            
            // 檢查新尺寸是否合理
            if (newWidth <= 0 || newHeight <= 0 || newWidth > 32767 || newHeight > 32767) {
                throw new Error(`計算後的尺寸無效: ${newWidth} x ${newHeight}`);
            }
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                throw new Error('無法建立 Canvas 2D 繪圖環境');
            }
            
            canvas.width = newWidth;
            canvas.height = newHeight;
            
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            
            // 使用 toBlob 而非 toDataURL
            console.log('Canvas: 轉換調整後的圖片為 Blob');
            const blob = await new Promise((resolve, reject) => {
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Canvas toBlob 失敗'));
                        }
                    },
                    'image/jpeg',
                    this.jpegQuality
                );
            });
            
            const resizedImg = new Image();
            const url = resourceManager.createBlobUrl(blob, 'image-resize');
            
            return new Promise((resolve, reject) => {
                resizedImg.onload = () => {
                    resourceManager.revokeBlobUrl(url);
                    console.log('Canvas: 圖片大小調整完成');
                    resolve(resizedImg);
                };
                
                resizedImg.onerror = () => {
                    resourceManager.revokeBlobUrl(url);
                    reject(new Error('調整後的圖片載入失敗'));
                };
                
                resizedImg.src = url;
            });
            
        } catch (error) {
            console.error('Canvas: 圖片大小調整失敗:', error);
            throw new Error(`圖片大小調整失敗: ${error.message}`);
        }
    }
}