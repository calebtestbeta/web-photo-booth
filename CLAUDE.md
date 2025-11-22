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
- `src/gesture-hints.js`: 手勢提示系統
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

### 2025年11月22日 - 自定義相框生成器完整實現

#### 🎨 Johnny Be Good 相框生成器革命性升級
**重大更新**: 將固定文字的相框生成器完全重構為自定義內容創作工具

#### 📝 移除固定文字限制
**解決問題**: 移除所有硬編碼的 "Johnny Be Good!" 文字
- ✅ 完全清理 `drawCursiveText` 函數中的固定文字邏輯
- ✅ 移除 130+ 行舊的文字繪製代碼
- ✅ 將文字顯示改為完全由用戶控制

#### ✏️ 文字自定義功能完整實現
**核心功能**: 全方位的文字個人化控制系統
- **文字輸入**: 多行文字輸入框，支援換行顯示
- **字體選擇**: 草寫體、標楷體、微軟正黑體、等寬字體、藝術字體
- **尺寸控制**: 16px-200px 精確滑桿控制
- **顏色系統**: 
  - 顏色選擇器配預設調色盤 (金色、橙色、白色、黑色、藍色、綠色)
  - 陰影顏色獨立控制
- **文字效果**:
  - 陰影模糊度: 0-20px 可調
  - 文字角度: -45° 到 45° 旋轉
  - 垂直位置: 10%-90% 精確定位
- **開關控制**: 可完全關閉文字功能，純邊框輸出

#### 🖼️ 圖片上傳和組合功能
**革命性新功能**: 完整的圖片處理和合成系統
- **檔案支援**: PNG、JPG、JPEG 格式上傳
- **上傳方式**: 
  - 點擊上傳按鈕
  - 拖拽檔案到上傳區域
  - 即時預覽縮圖顯示
- **圖片控制**:
  - **尺寸調整**: 10%-200% 滑桿控制
  - **透明度**: 0%-100% 精確調整
  - **旋轉角度**: -180° 到 180° 全方位旋轉
  - **位置控制**: X/Y 軸 0%-100% 精確定位
- **圖層管理**: 圖片可置於文字前方或後方
- **智能處理**: 自動圖片壓縮和尺寸優化

#### 🎨 現代化 UI/UX 設計系統
**全新設計語言**: 專業級使用者介面重構
- **視覺系統**: 
  - 漸層背景 (#f5f7fa → #c3cfe2)
  - 溫暖色調主題 (#007bff 主色)
  - 現代卡片式設計語言
- **響應式佈局**:
  - 桌面版: 1200px 最大寬度，左右分欄式佈局
  - 移動版: 單欄式佈局，完全適配小螢幕
- **互動設計**:
  - 懸停效果和微動畫
  - 即時數值顯示和回饋
  - 直觀的圖標和色彩編碼

#### 🛠️ 技術架構完全重構
**新增檔案結構**:
```html
<!-- 控制面板區域 -->
├── 📐 輸出格式選擇 (正方形/直式/限時動態)
├── 🎨 邊框風格選擇 (5種藝術風格)
├── ✏️ 文字設定區塊
│   ├── 啟用開關
│   ├── 文字輸入框 (多行支援)
│   ├── 字體/大小/角度控制
│   └── 顏色/陰影/位置設定
└── 🖼️ 圖片設定區塊
    ├── 啟用開關和上傳區域
    ├── 尺寸/透明度/旋轉控制
    ├── 位置精確調整
    └── 圖層順序設定
```

**JavaScript 架構優化**:
- **事件驅動系統**: 完整的事件監聽器管理
- **狀態管理**: 統一的全域狀態控制
- **模組化設計**: 功能分離的函數結構
- **記憶體管理**: 自動 Blob URL 清理

#### 🎯 邊框繪製系統保留
**完整保留**: 所有原有邊框風格和繪製邏輯
- 🖼️ 現代畫廊: 專業深灰邊框配白色內框
- ✨ 漸變光暈: 彩虹漸變配光暈效果
- 🔶 幾何抽象: 橙色主框配青色多層裝飾
- ➖ 極簡線條: 四角線條的簡約設計
- 💻 科技現代: 藍色科技風配內部線條

#### 📥 下載系統完整升級
**增強功能**: 批次下載和智能命名
- **單一下載**: `custom_frame_[format]_[width]x[height].png`
- **批次下載**: 自動生成所有三種格式
- **智能恢復**: 批次下載後自動恢復原始格式預覽

#### 🔄 重置和管理功能
**用戶體驗**: 完整的設定管理系統
- **全局重置**: 一鍵恢復所有設定到預設值
- **分類重置**: 文字和圖片設定可獨立管理
- **即時預覽**: 所有調整即時反映在 Canvas 上

#### 📈 實現成果統計
**代碼變更**:
- `create_multi_frames.html`: 完全重寫 (1,269 行)
- 新增功能: 600+ 行 HTML/CSS + 400+ 行 JavaScript
- 移除舊代碼: 清理 200+ 行固定文字邏輯

**功能完整性**:
- ✅ 完全移除固定文字限制
- ✅ 實現文字完全自定義 (8 個控制維度)
- ✅ 實現圖片上傳和合成 (7 個控制維度)
- ✅ 現代化 UI/UX 完全重構
- ✅ 保持所有原有邊框風格
- ✅ 批次下載和管理功能

**用戶體驗提升**:
- 🎯 **靈活性**: 從固定文字變為無限創意可能
- 🎨 **專業性**: 企業級 UI 設計和互動體驗
- 📱 **通用性**: 完美支援各種設備和使用情境
- ⚡ **效率性**: 批次生成和一鍵重置功能
- 🖼️ **多元性**: 純文字、純圖片、混合內容皆可創建

### 2025年11月15日 - Google Analytics 4 追蹤系統完整實現與清理

#### 🎯 隱私友善的使用行為追蹤系統
**實現目的**: 了解用戶使用模式和操作狀況，避免搜集過多個人資訊

#### 📊 追蹤功能實現
**基本頁面追蹤**:
- 主題選擇器頁面訪問
- Johnny Be Good / Christmas Magic 主題頁面
- 隱私政策頁面訪問

**核心功能追蹤**:
- **照片上傳**: 上傳方式 (檔案選擇/相機)、檔案大小、成功率
- **邊框風格選擇**: 風格名稱、主題、預覽模式
- **輸出格式切換**: 格式偏好 (正方形/直式/限時動態)
- **分享和下載**: 分享方式、成功率、輸出格式
- **主題選擇**: 用戶主題偏好統計

**錯誤監控追蹤**:
- 照片上傳失敗、分享錯誤、下載問題
- 技術錯誤上下文和訊息

#### 🛡️ 隱私保護措施
**Google Analytics 4 隱私設定**:
```javascript
gtag('config', 'G-GPLJLSF9S0', {
  anonymize_ip: true,                    // IP 地址匿名化
  allow_google_signals: false,           // 關閉跨設備追蹤
  allow_ad_personalization_signals: false // 關閉廣告個人化
});
```

**數據收集原則**:
- ✅ 僅收集匿名化的使用行為數據
- ✅ 不追蹤照片內容或個人身份資訊
- ✅ 不收集精確位置或通訊內容
- ✅ 數據保留期限設為 14 個月

#### 🔧 技術實現架構
**新增檔案**:
- `src/analytics.js`: 追蹤邏輯封裝模組，提供統一的事件追蹤接口
- `privacy.html`: 完整的隱私政策頁面，說明數據收集和使用方式

**修改檔案**:
- `index.html`: 添加 GA4 基本代碼、主題選擇追蹤、隱私政策連結
- `johnny-be-good.html`: 添加 GA4 基本追蹤代碼
- `christmas.html`: 添加 GA4 基本追蹤代碼
- `src/main.js`: 整合照片上傳、格式切換、風格選擇、下載追蹤
- `src/share.js`: 添加分享功能成功/失敗追蹤

#### 📈 預期數據洞察
**使用行為分析**:
- 最受歡迎的主題和邊框風格
- 用戶操作流程和完成率分析
- 功能使用頻率排序
- 移動端 vs 桌面端使用差異

**技術效能監控**:
- 錯誤率和失敗原因分析
- 跨瀏覽器相容性表現
- 分享功能在不同平台的成功率

#### 🧪 測試驗證
- ✅ 本地服務器測試所有追蹤事件正常發送
- ✅ GA4 代碼正確載入和配置
- ✅ 隱私友善設定正確啟用
- ✅ 模組化架構便於維護和擴展

#### 🔗 GitHub 連結修正
**修正內容**:
- `privacy.html`: GitHub Issues 連結從 `claude-code/issues` 改為 `calebtestbeta/web-photo-booth/issues`
- `index.html`: Footer 連結從 `Built with Claude Code` 改為 `GitHub Repository`，指向正確的專案 repository

**用戶體驗提升**:
- ✅ 提供透明的隱私政策說明
- ✅ 用戶可直接通過 GitHub Issues 提供回饋
- ✅ 保持隱私友善的追蹤方式
- ✅ 不影響現有功能的正常使用

#### 🗑️ 開發檔案清理
**清理內容**:
- 移除 `test-analytics.html`: 開發測試頁面，正式版本不需要
- 移除 `GA-IMPLEMENTATION.md`: 重複文檔，相關內容已整合到 CLAUDE.md
- 保持代碼庫整潔，只保留必要的生產檔案

### 2025年11月15日 - 信友拍立得風格完整實現

#### 🎯 聖誕主題邊框風格重大更新
**修改內容**: 將「冬青邊框 (Holly Border)」完全重新設計為「信友拍立得 (HFP Polaroid)」風格，並保留已有的「聖誕飾品 (Christmas Ornaments)」風格

#### 📸 信友拍立得設計特色 (holly-border → hfp_polaroid)
**完全重寫的拍立得美學**:
- **經典白色厚邊框**: 底部加寬 40%，符合真實拍立得比例
- **立體陰影效果**: 營造真實相片厚度感和質感
- **圓角照片區域**: 保持拍立得經典美學
- **移除聖誕元素**: 適用於各種場合，非節慶限定

#### 🏛️ 信友堂品牌整合
**教堂建築圖標設計**:
- **圓框基礎**: 簡潔的圓形邊框
- **建築主體**: 教堂建築輪廓
- **尖塔設計**: 經典教堂尖塔造型
- **十字架標識**: 頂部十字架元素
- **門窗細節**: 完整的建築細節

**雙語品牌標識**:
- **中文標識**: 「台北信友堂」
- **英文標識**: "HFPC CHURCH"
- **定位策略**: 底部左側，符合原始設計

#### 🛠️ 技術實現重點
**新增專用函數**:
```javascript
// 新增 4 個專用繪製函數
drawHfpPolaroidFrame()    // 拍立得邊框主體
drawHfpcLogo()           // 信友堂 LOGO 整合
drawChurchLogo()         // 教堂建築圖標
drawHfpcText()           // 雙語文字渲染
```

**條件式內容控制**:
- 信友拍立得風格不顯示 "Merry Christmas" 文字
- 適用於非節慶場合的通用設計

#### 📁 完整邊框檔案生成
**新增 PNG 檔案**:
- `frame_square_hfp_polaroid_1080x1080.png`
- `frame_portrait_hfp_polaroid_1080x1350.png`
- `frame_story_hfp_polaroid_1080x1920.png`

#### 🔄 系統整合更新
**檔案修改清單**:
- `christmas.html`: 更新選擇器和圖示 (📸)
- `create_christmas_frames.html`: 新增生成邏輯
- `src/main.js`: 更新風格對照表 (holly-border → hfp_polaroid)
- `src/theme-config.js`: 更新框架樣式配置
- `README.md`: 更新風格描述和順序

#### 🎨 風格共存設計
**聖誕主題現有 5 種風格**:
1. **📸 信友拍立得**: 教會品牌拍立得風格 (新)
2. **❄️ 雪花邊框**: 冬日雪花動畫風格
3. **🎄 聖誕飾品**: 透明聖誕球裝飾風格 (已修復透明度)
4. **✨ 冬日光暈**: 魔幻光點效果風格
5. **🎄 節慶燈飾**: 閃爍彩燈動畫風格

**用戶體驗提升**:
- ✅ 提供教會專屬的品牌相框選擇
- ✅ 融合經典拍立得美學與教會品牌元素
- ✅ 適用於非節慶場合的通用設計
- ✅ 完整的雙語品牌識別系統
- ✅ 保持原有聖誕風格的完整性

### 2025年11月12日 - 聖誕飾品邊框透明度修復

#### 🎯 問題分析：禮物包裝風格透明度問題
**用戶反映問題**: "聖誕風格的 png 中，禮物風格似乎沒有製作成透明檔，但是這個風格的設定似乎也有問題，因為沒辦法透視看到使用者上傳的照片"

**根本原因**:
- `drawGiftWrapperFrame` 函數使用 `ctx.fillRect(0, 0, config.width, config.height)` 填滿整個畫布
- 創建不透明背景，完全遮蔽用戶上傳的照片
- 違背了邊框應為透明裝飾的設計原則

#### 🛠️ 解決方案：聖誕飾品邊框重設計
**全新透明邊框設計**:
- **完全移除背景填充**: 不再使用 `fillRect` 填滿畫布
- **邊框裝飾設計**: 僅在邊框區域繪製裝飾元素
- **保持中央透明**: 確保用戶照片完全可見

**新「聖誕飾品」風格特色**:
- 🎄 **角落聖誕球**: 四角各配置紅、綠、金色聖誕球飾品，帶立體光澤效果
- 🌿 **裝飾花環**: 邊框四邊的動態花環，綠色葉子配紅色果實和金色點綴
- 🔔 **搖擺鈴鐺**: 四個方向的金色鈴鐺，帶動態搖動效果和紅色蝴蝶結
- ✨ **漸變邊框**: 聖誕紅綠漸變主邊框配金色內框
- 🌟 **閃亮星星**: 角落裝飾小星星增加節慶感

#### 📝 完整更新內容
**檔案修改**:
- `create_christmas_frames.html`: 替換 `drawGiftWrapperFrame` 為 `drawChristmasOrnamentsFrame`
- `christmas.html`: 更新按鈕和圖示使用新的聖誕飾品風格
- `src/theme-config.js`: 更新框架樣式列表 (`gift-wrapper` → `christmas-ornaments`)
- `src/main.js`: 更新顯示名稱對照表 (「禮物包裝」→「聖誕飾品」)
- `CLAUDE.md`: 完整記錄問題分析和解決方案

**技術實現**:
- **透明邊框設計**: 完全移除 `ctx.fillRect()` 背景填充
- **新繪製函數**: `drawChristmasOrnamentsFrame()` 專注邊框區域裝飾
- **動畫支援**: 繼承所有動畫系統，包含音樂元素
- **響應式圖示**: SVG 圖示從禮物盒改為聖誕球設計

**功能測試**:
- ✅ 透明度完全正常，用戶照片清晰可見
- ✅ 裝飾元素僅在邊框區域，不干擾照片
- ✅ 動畫效果正常運作 (花環、鈴鐺搖擺)
- ✅ 下載 PNG 檔案透明背景正確
- ✅ Christmas.html 和邊框生成器樣式統一

### 2025年11月12日 - 聖誕邊框生成器歡樂增強版

#### 🎄 用戶需求：更歡樂的聖誕氛圍邊框
**需求**: 用戶希望聖誕邊框"可以再更歡樂，充滿聖誕氛圍的元素"
**解決方案**: 全面增強五種聖誕風格邊框，加入動畫效果、音樂元素和豐富裝飾

#### 🌟 五大聖誕風格全面升級

**🌿 冬青邊框增強版**:
- **漸變邊框**: 深綠到亮綠的豐富漸變效果
- **立體冬青葉**: 更大更豐富的冬青葉設計，帶光澤漸變
- **漿果群升級**: 多層次紅色漿果，立體光澤效果
- **金色聖誕鈴鐺**: 四個方向的立體鈴鐺裝飾，帶高光效果
- **閃亮星星**: 金色星星點綴，增加夢幻感

**🎁 禮物包裝豪華版**:
- **漸變背景**: 多層次紅色漸變配歡樂圓點圖案
- **豪華金色緞帶**: 五彩漸變緞帶配邊緣裝飾線
- **立體蝴蝶結**: 陰影、高光、條紋裝飾的豪華蝴蝶結
- **多彩禮物盒**: 綠、紅、藍、紫四色禮物盒配小蝴蝶結
- **聖誕襪裝飾**: 可愛的聖誕襪配雪花圖案
- **隨機星星**: 背景星星圖案增加節慶感

**❄️ 雪花邊框動畫版**:
- **旋轉雪花**: 每片雪花都有獨特旋轉動畫
- **豐富雪花群**: 20+隨機大小雪花，增加層次感
- **精美六角設計**: 多層分支和中心水晶的精美雪花
- **飄落雪花**: 30個小雪花持續飄落動畫
- **漸變冰藍**: 白到藍的雪花漸變色彩

**🎄 節慶燈飾閃爍版**:
- **閃爍彩燈**: 8種顏色LED燈泡帶閃爍動畫
- **燈串線條**: 視覺化的燈串連接線
- **立體燈泡**: 帶金屬頂部和高光效果的立體燈泡
- **閃亮星星**: 背景星星配光暈效果
- **動態亮度**: 每個燈泡獨立的亮度變化

**✨ 冬日光暈魔幻版**:
- **動態光點**: 25+隨機彩色光點配脈衝動畫
- **多層光暈**: 外層、主體、核心三層光暈效果
- **光線放射**: 大光點配8條光線放射效果
- **魔法粒子**: 15個彩色粒子浮動動畫
- **彩虹光點**: 七彩光點動態變化

#### 🎵 音樂主題視覺元素
- **彩色音符**: 四分、八分、二分音符和高音譜號
- **跳動動畫**: 音符配合節拍跳動效果
- **流動五線譜**: 波浪形五線譜線條流動
- **音符光暈**: 每個音符都有彩色光暈效果

#### 🌈 文字效果大升級
- **動態跳動**: "Merry Christmas!" 文字配合節拍跳動
- **風格漸變**: 每種風格都有專屬的漸變色彩效果
- **彩虹光暈**: 冬日光暈風格配彩虹色文字動畫
- **文字星星**: 文字周圍的閃爍星星裝飾
- **動畫陰影**: 陰影配合文字跳動變化

#### 🎬 動畫系統架構
```javascript
// 實時動畫循環系統
function startChristmasAnimation() {
    function animate() {
        if (currentStyle === 'festive-lights' || currentStyle === 'winter-glow' || 
            currentStyle === 'snow-frame' || currentStyle === 'gift-wrapper') {
            createFrame(currentFormat);  // 實時重繪
        }
        requestAnimationFrame(animate);   // 60fps循環
    }
    animate();
}
```

**動畫效果統計**:
- **雪花旋轉**: 每片雪花獨立旋轉速度
- **燈泡閃爍**: 基於時間和位置的閃爍規律
- **光點脈衝**: 25個光點的獨立脈衝頻率
- **粒子浮動**: 魔法粒子的正弦波浮動
- **音符跳躍**: 音符配合正弦波跳動
- **文字彈跳**: 聖誕祝福文字動態跳動
- **星星閃爍**: 背景星星的閃爍變化

#### 📊 實現成果統計
**檔案更新**:
- `create_christmas_frames.html`: +800 行 (動畫系統和增強裝飾)
- 新增函式: 15+ 新的繪製和動畫函式
- 視覺元素: 100+ 新的視覺裝飾元素

**技術特色**:
- ✅ 實時動畫系統 (60fps)
- ✅ 五種風格各有獨特動畫
- ✅ 音樂主題視覺元素
- ✅ 動態文字效果系統
- ✅ 豐富的節慶裝飾元素
- ✅ 立體光影效果
- ✅ 多層次視覺設計

**歡樂氛圍提升**:
- 🎪 **動畫豐富度**: 從靜態變為動態，生動活潑
- 🎨 **色彩飽和度**: 增加更多鮮艷色彩和漸變效果
- ✨ **裝飾密度**: 大幅增加裝飾元素數量和種類
- 🎵 **音樂元素**: 加入音符和五線譜增加節慶感
- 🌟 **光效系統**: 多種發光、閃爍、光暈效果
- 🎭 **互動性**: 每次刷新都有不同的動畫狀態

### 2025年11月12日 - 浮動精確調整面板設計優化

#### 🎯 用戶體驗痛點解決：精確調整面板距離問題

**問題**: 用戶反映"上傳照片後，精確調整的功能，在非常下方，距離圖片檢視很遠"，影響操作效率
**解決方案**: 實現浮動精確調整面板，將控制項移至更接近圖片檢視區域的位置

#### 🔄 雙重精確調整系統架構

**設計原則**: 向下相容 + 體驗增強
- **保留原始面板**: 確保既有功能不受影響，作為後備系統
- **新增浮動面板**: 提供更貼近圖片的操作體驗
- **完全同步**: 兩個面板的數值即時雙向同步

**HTML 結構重組**:
```html
<!-- 浮動面板位於 canvas-container 內，靠近圖片 -->
<div class="canvas-container">
    <canvas id="mainCanvas"></canvas>
    <!-- 浮動精確調整面板 -->
    <div class="precision-panel-floating" id="precisionPanelFloating">
        <!-- 完整的控制項複製 -->
    </div>
</div>
```

#### 📱 響應式浮動面板設計

**桌面版設計** (≥768px):
```css
.precision-panel-floating {
    position: fixed;
    top: 50%;                          /* 垂直置中 */
    right: var(--space-4);             /* 右側浮動 */
    transform: translateY(-50%);       /* 精確置中 */
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);       /* 毛玻璃效果 */
    animation: slideInRight 0.3s ease-out;
}
```

**移動版適配** (≤767px):
```css
.precision-panel-floating {
    position: fixed;
    bottom: calc(var(--space-16) + var(--space-8)); /* 避開浮動工具列 */
    left: var(--space-4);
    right: var(--space-4);
    animation: slideInUp 0.3s ease-out;
}
```

#### ⚡ JavaScript 雙向同步邏輯

**完整事件監聽系統**:
```javascript
// 原始面板更新時同步浮動面板
this.scaleSlider.addEventListener('input', (e) => {
    const scale = parseFloat(e.target.value) / 100;
    this.setAbsoluteScale(scale);
    this.scaleValue.textContent = `${e.target.value}%`;
    // 同步更新浮動面板
    if (this.scaleSliderFloating) {
        this.scaleSliderFloating.value = e.target.value;
        this.scaleValueFloating.textContent = `${e.target.value}%`;
    }
});

// 浮動面板更新時同步原始面板
this.scaleSliderFloating.addEventListener('input', (e) => {
    const scale = parseFloat(e.target.value) / 100;
    this.setAbsoluteScale(scale);
    this.scaleValueFloating.textContent = `${e.target.value}%`;
    // 同步更新原始面板
    this.scaleSlider.value = e.target.value;
    this.scaleValue.textContent = `${e.target.value}%`;
});
```

**智能顯示/隱藏控制**:
```javascript
updateUI() {
    const hasImage = !!this.currentImage;
    
    if (hasImage) {
        // 有圖片時同時顯示兩個面板
        this.precisionPanel.style.display = 'block';
        if (this.precisionPanelFloating) {
            this.precisionPanelFloating.style.display = 'block';
        }
    } else {
        // 無圖片時同時隱藏
        this.precisionPanel.style.display = 'none';
        if (this.precisionPanelFloating) {
            this.precisionPanelFloating.style.display = 'none';
        }
    }
}
```

#### 🎨 視覺設計系統整合

**溫暖色調一致性**:
- 面板背景: `rgba(255, 255, 255, 0.95)` 與整體淺色主題一致
- 邊框顏色: `rgba(251, 146, 60, 0.2)` 使用主題橙色
- 懸停效果: `rgba(251, 146, 60, 0.05)` 溫和橙色背景

**優雅動畫系統**:
```css
@keyframes slideInRight {
    0% {
        opacity: 0;
        transform: translateY(-50%) translateX(100%);
    }
    100% {
        opacity: 1;
        transform: translateY(-50%) translateX(0);
    }
}

@keyframes slideInUp {
    0% {
        opacity: 0;
        transform: translateY(100%);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
```

#### 📊 實現成果統計

**檔案變更統計**:
- `index.html`: +44 行 (浮動面板 HTML 結構)
- `src/main.js`: +88 行 (雙重事件系統和同步邏輯)
- `styles/app.css`: +75 行 (響應式浮動面板樣式)

**功能完整性保證**:
- ✅ 原有精確調整功能完全保留
- ✅ 新浮動面板與原面板完全同步
- ✅ 響應式設計適配所有裝置
- ✅ 溫暖色調主題完美整合
- ✅ 優雅動畫提升使用體驗

**用戶體驗改善成果**:
- 🎯 **距離優化**: 浮動面板緊貼圖片檢視區域，操作距離大幅縮短
- 🔄 **零學習成本**: 保留原有操作邏輯，使用者無需重新學習
- 📱 **跨裝置一致**: 桌面和移動版都有最佳定位策略
- ⚡ **即時回饋**: 任一面板操作立即反映到另一面板
- 🎨 **視覺優化**: 修復控制項區域背景透明問題，確保最佳可讀性
- 🖱️ **觸控拖曳**: 支援觸控和滑鼠拖曳移動面板，自由定位功能

#### 🚀 技術架構亮點

**可維護性設計**:
- 模組化元素引用：所有浮動面板元素都有獨立 ID
- 條件安全檢查：所有浮動面板操作都有存在性檢查
- 事件監聽分離：原始和浮動面板事件完全獨立，互不干擾

**效能考量**:
- 最小 DOM 影響：只在需要時顯示浮動面板
- 事件優化：避免重複觸發，智能同步更新
- CSS 動畫：使用 transform 而非 position 變更，確保流暢動畫

#### 🖱️ 觸控拖曳功能實現

**設計理念**: 讓用戶能自由移動精確調整面板到最舒適的操作位置

**視覺設計**:
```html
<!-- 直觀的拖曳手柄 -->
<div class="drag-handle" id="dragHandle">
    <div class="drag-indicator"></div>
</div>
```

**拖曳手柄 CSS 設計**:
```css
.drag-handle {
    cursor: grab;  /* 提示可拖曳 */
    padding: var(--space-2);
}

.drag-indicator {
    width: 32px;
    height: 4px;
    background: rgba(251, 146, 60, 0.4);
    border-radius: var(--rounded-full);
}

/* 懸停和拖曳狀態變化 */
.drag-handle:hover .drag-indicator {
    background: rgba(251, 146, 60, 0.6);
    width: 40px;  /* 視覺回饋 */
}

.drag-handle:active .drag-indicator {
    background: var(--primary-500);
    width: 48px;  /* 主動狀態 */
}
```

**拖曳邏輯實現**:
```javascript
// 跨平台事件支援
setupDragEvents() {
    // 觸控事件 (移動裝置)
    this.dragHandle.addEventListener('touchstart', (e) => {
        this.handleDragStart(e.touches[0]);
    }, { passive: false });
    
    // 滑鼠事件 (桌面裝置)
    this.dragHandle.addEventListener('mousedown', (e) => {
        this.handleDragStart(e);
    });
}

// 邊界限制和磁吸效果
handleDragMove(event) {
    // 確保面板不會超出螢幕
    newX = Math.max(0, Math.min(newX, viewportWidth - panelRect.width));
    newY = Math.max(0, Math.min(newY, viewportHeight - panelRect.height));
}

snapToEdge() {
    // 50px 內自動貼邊
    if (rect.left < 50) snapX = 16;  // 貼左邊
    if (viewportWidth - rect.right < 50) snapX = viewportWidth - rect.width - 16;  // 貼右邊
}
```

**拖曳體驗優化**:
- **視覺回饋**: 拖曳時面板放大 1.02 倍，增強陰影效果
- **邊界限制**: 防止面板移出螢幕可視範圍
- **磁吸效果**: 接近邊緣時自動貼邊，提供整齊的定位
- **觸覺回饋**: 拖曳手柄有明確的視覺狀態變化
- **跨平台**: 同時支援觸控和滑鼠操作

**技術亮點**:
- 使用 `{ passive: false }` 確保觸控事件可以 preventDefault
- 智能座標計算避免面板跳躍
- 優雅的動畫過渡效果
- 完整的事件清理防止記憶體洩漏

### 2025年11月12日 - 溫暖淺色主題完整實現

#### 🎨 設計系統重大更新：從深色到溫暖淺色主題

**問題**: 原有深色主題在某些使用情境下缺乏親和力，需要更溫暖現代的視覺體驗
**解決方案**: 完整實現溫暖淺色主題系統，保持專業性的同時增加溫暖感

**核心配色系統變更**:
```css
/* 從冷色系統改為溫暖系統 */
--primary-500: #f97316;        /* 溫暖橙色取代藍色 */
--bg-primary: #faf8f3;         /* 溫暖米白色背景 */
--bg-secondary: #f4f1ea;       /* 淺色面板背景 */
--text-primary: var(--neutral-900); /* 深色文字確保對比度 */
```

**視覺系統全面重構**:
- **背景系統**: 溫暖漸層從米白到淺橙 (#faf8f3 → #ede8e0)
- **強調色**: 統一使用溫暖橙色系 (#f97316) 作為主要互動色
- **陰影效果**: 從深黑陰影改為溫和橙色光暈效果
- **透明度**: 調整半透明元素適應淺色背景

#### 📱 響應式淺色主題適配

**移動版 Header 完整重設計**:
```css
/* 行動版 Header 溫暖化處理 */
.header {
    background: rgba(244, 241, 234, 0.95);  /* 溫暖半透明 */
    backdrop-filter: blur(8px);             /* 毛玻璃保持 */
    border-bottom: 1px solid rgba(251, 146, 60, 0.12); /* 橙色邊框 */
}
```

**桌面版容器系統**:
- app-container: 從深灰 `#3a3a3a` 改為淺色變數系統
- 工具列: 統一使用 `--bg-secondary` 背景

### 2025年11月12日 - UI/UX 體驗優化與手勢提示系統完善

#### 🔄 Placeholder 文字置中問題修復
**問題**: 空相框狀態下的提示文字和圖標一直偏移到左上角或右下角，無法正確居中顯示
**根本原因**: Gesture Hint 系統修改時造成的 CSS 定位衝突

**修復策略**:
```css
/* 1. 分離定位責任 */
.canvas-overlay {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
}

.placeholder-text {
    position: absolute !important;
    top: 50% !important; left: 50% !important;
    transform: translate(-50%, -50%) !important;
}

/* 2. Gesture 元素獨立定位 */
.gesture-hint, .gesture-help {
    position: fixed; /* 相對於視窗，不干擾 canvas-overlay */
}
```

#### 🎯 手勢提示系統時序優化
**改進目標**: 解決 gesture hint 和 gesture help 重疊顯示問題

**時序設計**:
1. **圖片上傳後**: 延遲 1.5 秒開始中央提示序列
2. **中央提示**: 依序顯示拖拽→縮放→旋轉 (每個 3 秒)
3. **序列完成**: 隱藏中央提示，延遲 0.5 秒顯示底部說明
4. **底部說明**: 顯示 3 秒後自動淡出

**視覺優化**:
```css
.gesture-hint {
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid var(--primary-400);
    box-shadow: var(--shadow-lg);
    z-index: 15; /* 確保層級正確 */
}
```

#### 📤 分享功能個人化
**更新**: 分享訊息改為個人化內容
```javascript
// 從: "我的${formatInfo.name}相框照片！適合 ${platforms.join('、')} #相框工具"
// 改為: "Farewell, Johnny! Go be good! (Like the song! 😉) https://calebtestbeta.github.io/web-photo-booth/johnny-be-good.html"
```

#### 🗑️ 代碼清理
- **移除**: `src/render.js` 中的「安全區域」和「您的照片將放置在此處」多餘提示文字
- **優化**: CSS 中移除未使用的樣式規則
- **強化**: 使用 `!important` 確保關鍵定位規則不被覆蓋

**總結**: 這次更新重點解決了 UI 定位問題和用戶體驗細節，確保應用界面的專業性和易用性。
- 陰影: 調整為溫和的橙色光暈效果

#### 🎛️ 組件系統色彩統一

**按鈕系統重構**:
```css
/* 統一的按鈕色彩規範 */
.format-btn, .toolbar-btn, .position-btn {
    background: var(--bg-primary);           /* 淺色背景 */
    border: 1px solid var(--border-secondary); /* 統一邊框 */
    color: var(--text-secondary);           /* 適應性文字色 */
}

.format-btn:hover, .toolbar-btn:hover {
    background: rgba(251, 146, 60, 0.05);   /* 溫和橙色懸停 */
    color: var(--primary-600);              /* 橙色文字 */
}

.format-btn.active, .toolbar-btn.primary {
    background: var(--primary-500);         /* 橙色主要按鈕 */
    color: white;                           /* 白色文字 */
}
```

**面板系統更新**:
- Format Selector: 統一淺色背景系統
- Precision Panel: 滑桿和控制項適配淺色主題
- Loading Overlay: 從深色改為淺色半透明覆蓋

#### 🚫 Dark Mode 干擾消除

**完全移除自動深色模式**:
```css
/* 註釋掉自動深色模式以確保一致的淺色體驗 */
/* @media (prefers-color-scheme: dark) { ... } */
```

**跨斷點一致性確保**:
- 移動版 (≤767px): 統一淺色主題
- 平板版 (768px-1023px): 統一淺色主題  
- 桌面版 (≥1024px): 統一淺色主題

#### 🎯 用戶體驗提升成果

**視覺感受改善**:
- **溫暖感**: 橙色系統營造友好親和的使用體驗
- **清晰度**: 深色文字在淺色背景上提供優秀對比度
- **現代感**: 半透明元素和毛玻璃效果保持時尚感
- **專業度**: 統一的設計語言維持專業印象

**可訪問性提升**:
- 更好的色彩對比度符合 WCAG 標準
- 溫暖色調減少眼部疲勞
- 清晰的視覺層次便於操作識別

#### 🔧 技術實現重點

**CSS 變數系統擴展**:
```css
/* 新增語意化背景變數 */
--bg-primary: #faf8f3;      /* 主要背景 */
--bg-secondary: #f4f1ea;    /* 次要背景 */
--bg-tertiary: #ede8e0;     /* 三級背景 */
--border-primary: #e5ddd2;  /* 主要邊框 */
--border-secondary: #d6cdc0; /* 次要邊框 */
```

**漸層系統重構**:
- 背景漸層: 溫暖米白色系
- 光暈效果: 橙色 rgba 透明度控制
- 陰影系統: 適配淺色背景的陰影深度

#### 📊 實現成果統計

**檔案影響範圍**:
- 主要更新: `styles/app.css` (300+ 行色彩相關修改)
- 支援文檔: `README.md`, `CLAUDE.md` 更新記錄
- 測試驗證: 跨設備/瀏覽器淺色主題一致性

**功能完整性保證**:
- ✅ 所有互動功能正常運作
- ✅ 響應式設計完全適配
- ✅ 手勢操作體驗無變化
- ✅ 精確調整模式視覺和諧
- ✅ 分享功能正常運作

### 2025年11月12日 - 雙指精確調整模式與現代化UI設計系統

#### 🎯 核心設計理念重大更新
**問題**: 原有UI設計過時，缺乏現代感和專業級精確控制
**解決方案**: 全面實現設計系統和雙指精確調整模式

**設計哲學**:
- **Mobile-First**: 針對手機使用者最佳化，桌面版為增強體驗
- **簡約而不簡單**: 介面保持清潔，但在需要時提供專業級控制
- **漸進式揭露**: 新手友善，專家高效

#### 🎛️ 精確調整模式核心設計

**觸發方式**: 雙指長按 500ms (符合 Instagram/VSCO 慣例)
```javascript
// 精確模式靈敏度調整 (gesture.js:295-300)
if (this.precisionMode) {
    const scaleChange = scale - 1;
    scale = 1 + (scaleChange * this.precisionScaleSensitivity); // 30%
    rotation = rotation * this.precisionRotationSensitivity;   // 20%
}
```

**視覺回饋系統**:
- 金色邊框效果 (`--warning-500`)
- 觸覺震動回饋 (`navigator.vibrate(50)`)
- 即時數值顯示 (右側浮動)

**完整控制面板**:
- 縮放滑桿: 10%-500% (1% 精度)
- 旋轉滑桿: 0°-360° (1° 精度)
- 位置微調按鈕 + 居中功能

#### ⌨️ 桌面版專業快捷鍵系統
```javascript
// 鍵盤快捷鍵設計邏輯 (main.js:714-792)
- 方向鍵：1px 移動 (Shift = 10px)
- +/- 鍵：5% 縮放增量
- R 鍵：90° 旋轉 (Ctrl+R = 重置)
- P 鍵：切換精確調整面板
- Ctrl+滾輪：2% 精確縮放
```

#### 🎨 設計系統架構完整重構

**CSS 設計代幣系統**:
```css
/* 語意化顏色系統 */
--primary-500: #3b82f6;    /* 主要動作色 */
--neutral-800: #1e293b;    /* 深色背景 */
--warning-500: #f59e0b;    /* 精確模式提示色 */

/* 8px 網格系統 */
--space-4: 1rem;      /* 16px - 基礎間距單位 */
--space-8: 2rem;      /* 32px - 大型間距 */
```

**現代化元件系統**:
- 卡片設計: 使用 `backdrop-filter: blur()` 建立層次感
- 按鈕規範: 最小觸控目標 44px，桌面版 80x80px
- 微互動: 所有元素都有 150-300ms 流暢過渡

#### 📱 響應式設計策略

**工具列適應性設計**:
```css
/* Mobile: 浮動式工具列 */
@media (max-width: 767px) {
    .toolbar { position: fixed; bottom: 1rem; }
}

/* Desktop: 整合式設計 */
@media (min-width: 768px) {
    .toolbar { position: static; }
    .toolbar-btn { min-width: 80px; min-height: 80px; }
}
```

**智能互動設計**:
- 空白畫布點擊觸發上傳/拍照
- 相機整合: `capture="environment"` 屬性
- 格式選擇按鈕: 80x80px (桌面) / 70x70px (行動)

#### ⚡ 效能最佳化系統

**事件驅動渲染**:
```javascript
// 智能渲染控制 (main.js:396-410)
startContinuousRender() {
    const render = () => {
        if (!this.isInteracting) return;  // 節能停止
        this.render();
        requestAnimationFrame(render);     // 60fps 同步
    };
}
```

**記憶體管理**:
- 自動 Blob URL 清理
- Canvas 參考釋放
- 事件監聽器移除
- 內嵌 SVG 系統避免網路請求

#### 🔧 技術架構改進

**檔案結構優化**:
```
/src/
├── main.js          # 應用程式協調器 (+精確調整控制)
├── gesture.js       # 手勢識別 (+精確模式)
├── render.js        # Canvas 渲染引擎
├── image.js         # 圖片處理和 EXIF 修正
├── share.js         # 分享功能跨平台處理
└── resource-manager.js # 記憶體管理
```

**狀態管理模式**:
- 中央狀態: `main.js` 的 `transform` 物件
- 事件驅動: 各模組透過事件通訊
- 單向資料流: 狀態變更 → 渲染更新

**跨平台相容性**:
```javascript
// Feature Detection 增強
if (navigator.share) {
    // 使用原生分享
} else {
    // 降級為下載
}

// CSS 漸進增強
@supports (backdrop-filter: blur(8px)) {
    .toolbar { background: rgba(30, 41, 59, 0.8); }
}
```

#### 📐 設計系統約定建立

**間距系統**: 基礎單位 16px，比例 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4  
**字型系統**: 系統字型優先，等寬字型用於數值顯示  
**動畫原則**: 回饋性、持續性(150-300ms)、目的性引導注意力

#### 🚀 實作成果統計
- **檔案變更**: 5個核心檔案大幅更新
- **新增功能**: 雙指精確模式、完整調整面板、鍵盤快捷鍵
- **UI/UX改進**: 現代化設計系統、響應式工具列、智能互動
- **效能優化**: 事件驅動渲染、記憶體管理、內嵌SVG系統
- **技術債務**: 大幅減少，建立可維護的架構基礎

### 2024年11月 - Web Share API 優化和移動端體驗提升

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
- [x] ~~UI 現代化和設計系統建立~~
- [x] ~~雙指精確調整模式實現~~
- [x] ~~桌面版鍵盤快捷鍵系統~~
- [x] ~~響應式工具列設計~~
- [x] ~~溫暖淺色主題完整實現~~
- [x] ~~多風格邊框系統 (5種藝術風格)~~
- [x] ~~邊框預覽功能 (無需上傳照片)~~
- [ ] 可考慮添加 PWA 功能以提供更原生的體驗
- [ ] 分享功能可考慮整合更多社交平台
- [ ] 濾鏡系統實現 (CSS filters 或 WebGL)
- [ ] 批次處理功能 (多張照片同時處理)
- [ ] 雲端儲存整合

## 🧠 關鍵設計決策記錄

### 精確調整模式的設計邏輯
**為什麼選擇雙指長按而非按鈕切換？**
1. **符合用戶習慣**: Instagram、VSCO 等主流照片應用都使用類似手勢
2. **情境感知**: 當用戶需要精確調整時，通常已經在使用雙指手勢
3. **減少介面複雜度**: 避免增加額外的 UI 元素
4. **自然過渡**: 從一般調整到精確調整的流程更順暢

### 響應式工具列策略
**為什麼不使用統一的浮動設計？**
- **Mobile**: 螢幕空間珍貴，浮動設計最大化內容區域
- **Desktop**: 空間充裕，整合式設計更穩定專業
- **實用性**: 桌面用戶更需要大尺寸按鈕配合滑鼠操作

### CSS 設計代幣系統建立
**為什麼採用 8px 網格系統？**
1. **數學簡潔**: 8 的倍數易於計算和記憶
2. **裝置適配**: 符合常見螢幕解析度的像素對齊
3. **設計一致性**: 業界標準，設計師和開發者都熟悉
4. **可維護性**: 統一的間距規則減少決策疲勞

## 🔮 未來擴展架構準備

### 預留的技術擴展點

#### 1. 濾鏡系統架構
```javascript
// 預留濾鏡系統接口
class FilterEngine {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.filters = new Map(); // 濾鏡註冊系統
    }
    
    // 可擴展的濾鏡應用接口
    applyFilter(filterName, params) {
        // CSS filter 或 WebGL 實現
    }
}
```

#### 2. 狀態管理擴展準備
```javascript
// 當前狀態結構已支援未來擴展
const appState = {
    transform: { x, y, scale, rotation },
    image: { data, metadata, history },
    ui: { precisionMode, selectedTool },
    // 預留: filters, batch, cloud
};
```

#### 3. 模組系統擴展
```
/src/
├── core/           # 核心功能 (已實現)
├── filters/        # 濾鏡系統 (預留)
├── batch/          # 批次處理 (預留)
├── cloud/          # 雲端整合 (預留)
└── plugins/        # 外掛系統 (預留)
```

### 效能監控點位
```javascript
// 預留效能監控接口
const PerformanceMonitor = {
    // Canvas 渲染效能
    trackRenderTime: (duration) => {},
    
    // 記憶體使用追蹤
    trackMemoryUsage: () => {},
    
    // 手勢響應延遲
    trackGestureLatency: (latency) => {},
    
    // 使用者行為分析
    trackUserAction: (action, context) => {}
};
```

## 📱 裝置相容性備忘

### iOS Safari 特殊處理要點
```javascript
// 必要的 iOS 特殊處理
const iOSWorkarounds = {
    // 防止雙擊縮放
    touchAction: 'manipulation',
    
    // 長按另存圖片
    allowImageSaving: true,
    
    // Web Share API 檢測
    shareCapabilities: 'files' | 'dataUrl' | 'fallback'
};
```

### Android Chrome 優化要點
```javascript
const androidOptimizations = {
    // 觸控延遲優化
    touchDelay: false,
    
    // 記憶體管理
    aggressiveCleanup: true,
    
    // 相機整合
    cameraCapture: 'environment'
};
```

## 🛠️ 維護指南

### 程式碼風格約定
1. **ES6+ 模組**: 使用 import/export，避免全域變數
2. **事件驅動**: 模組間透過事件通訊，減少直接依賴
3. **資源管理**: 所有 Blob、Canvas、EventListener 都要有清理機制
4. **錯誤處理**: 提供有意義的錯誤訊息，優雅降級

### 測試流程
```bash
# 基本功能測試
1. 上傳圖片 (檔案選擇 + 相機拍攝)
2. 手勢操作 (拖拽、縮放、旋轉)
3. 精確調整 (雙指長按觸發)
4. 格式切換 (三種尺寸格式)
5. 分享功能 (iOS/Android 原生分享)

# 跨瀏覽器測試
- iOS Safari 15+
- Android Chrome 100+
- Desktop Chrome/Edge/Safari

# 效能測試
- 大尺寸圖片處理 (>5MB)
- 連續手勢操作流暢度
- 記憶體洩漏檢測
```

## 注意事項
- 保持代碼簡潔和可維護性
- 確保移動端體驗優先
- 遵循無障礙設計原則
- 維護跨瀏覽器相容性
- **重點關注 iPhone Safari 的特殊需求和限制**
- **精確調整模式的手勢邏輯是核心功能，修改時要特別謹慎**
- **設計系統的 CSS 代幣是全局依賴，變更前需評估影響範圍**