# Claude Code 開發指引

## 開發流程要求

### 修改後的標準流程
每次進行代碼修改後，必須執行以下步驟：

1. **整理必要資訊**
   - 記錄修改的檔案和具體變更內容
   - 說明修改的原因和目的
   - 確認修改是否達到預期效果

2. **測試驗證**
   - 在本地測試修改的功能
   - 確保沒有破壞現有功能
   - 驗證跨瀏覽器相容性（如適用）

3. **代碼提交**
   - 使用 git add 添加變更的檔案
   - 撰寫清晰的 commit 訊息，說明變更內容
   - 執行 git commit 提交變更

## 項目資訊

### 技術架構
- **框架**: Vanilla HTML/CSS/JavaScript (ES6 Modules)
- **主要功能**: 照片相框疊圖工具
- **目標平台**: 移動端優先的響應式設計
- **部署**: GitHub Pages

### 核心模組
- `src/main.js`: 主應用程式協調器
- `src/render.js`: Canvas 渲染引擎
- `src/gesture.js`: 觸控手勢處理
- `src/image.js`: 圖像處理和 EXIF 處理
- `src/share.js`: 分享和下載功能

### 開發環境
```bash
# 啟動本地伺服器
python3 -m http.server 8000
# 或
npx serve . -p 8000
```

### 測試流程
1. 啟動本地伺服器
2. 打開 http://localhost:8000
3. 測試上傳、手勢操作、格式切換、分享功能
4. 檢查控制台是否有錯誤

## 提交訊息格式
使用清晰描述性的提交訊息：
- `feat: 新增功能描述`
- `fix: 修復問題描述`
- `update: 更新內容描述`
- `style: 樣式調整描述`

## 溝通語言要求
- **必須使用繁體中文**：所有回覆、討論、文件說明都必須使用繁體中文
- **台灣慣用詞語**：使用台灣在地的用詞習慣和表達方式
- **技術術語**：優先使用台灣常用的技術詞彙，如「網頁」而非「網站」、「手機」而非「移動設備」等

## 最新開發進度

### 2024年11月更新 - Web Share API 優化和移動端體驗提升

#### 1. iPhone Safari 分享功能完整修復
**問題**: iPhone Safari 分享按鈕觸發下載而非原生分享
**解決方案**: 實現多重分享策略系統
- **策略1**: 直接檔案分享 (`shareWithFile`)
- **策略2**: Data URL 分享 (`shareWithDataUrl`)
- **策略3**: 圖片預覽回退 (`fallbackToDownload`)

**技術細節**:
```javascript
// 簡化分享檢測，移除複雜異步邏輯
checkFileShareSupport() {
    // 基本檢測 + iOS 版本檢查 + 即時 canShare 測試
}

// 多重策略自動回退
async tryMultipleShareStrategies(blob, filename, text) {
    const strategies = [檔案分享, DataURL分享, 圖片預覽];
    // 依序嘗試直到成功
}
```

#### 2. 移動端圖片預覽和保存優化
**問題**: 下載按鈕在移動端只下載檔案，無法直接保存到相簿
**解決方案**: 全屏圖片預覽 + 長按另存功能

**核心改進**:
- **全屏預覽模式**: 專業的圖片展示界面
- **長按另存功能**: 覆蓋全域 CSS 限制，啟用原生長按保存
- **智能操作指引**: iOS/Android 分別提供專門的使用說明
- **多重保存方案**: 長按另存 + 下載按鈕雙重保障

**技術實現**:
```css
.preview-image {
    -webkit-touch-callout: default !important;  /* 啟用長按選單 */
    -webkit-user-select: auto !important;       /* 啟用選取功能 */
    pointer-events: auto !important;
}
```

#### 3. iPhone 雙擊縮放問題修復
**問題**: 快速點擊旋轉按鈕觸發頁面縮放
**解決方案**: 三層防護機制
- **CSS**: `touch-action: manipulation` 禁用雙擊縮放
- **Viewport**: `user-scalable=no` 全域禁用縮放
- **JavaScript**: 300ms 防抖動邏輯

#### 4. 用戶體驗全面提升
**調試功能**:
```javascript
// 詳細的控制台日誌輸出
console.log('ShareHandler 初始化完成:', this.getShareCapabilities());
console.log('嘗試策略 1: 檔案分享');
console.log('即時 canShare 檢測:', canShare);
```

**智能提示系統**:
- iOS: "🔄 **長按上方圖片** 🔄 然後選擇「**儲存至相片**」"
- Android: "🔄 **長按上方圖片** 🔄 並選擇「**保存圖片**」"
- 備用方案: "ℹ️ 如果長按沒有反應，請使用下方下載按鈕"

#### 5. 架構優化成果
- **檔案變更統計**: +279 行, -145 行
- **主要模組更新**: `src/share.js`, `src/main.js`, `styles/app.css`
- **新增功能**: 圖片預覽模式、多重分享策略、防抖動處理
- **修復問題**: iPhone 分享、雙擊縮放、長按另存

### 技術債務和改進方向
- [x] ~~iPhone Safari 分享功能問題~~
- [x] ~~移動端圖片保存體驗~~
- [x] ~~雙擊縮放干擾問題~~
- [x] ~~長按另存功能缺失~~
- [ ] 可考慮添加 PWA 功能以提供更原生的體驗
- [ ] 分享功能可考慮整合更多社交平台

## 注意事項
- 保持代碼簡潔和可維護性
- 確保移動端體驗優先
- 遵循無障礙設計原則
- 維護跨瀏覽器相容性
- **重點關注 iPhone Safari 的特殊需求和限制**