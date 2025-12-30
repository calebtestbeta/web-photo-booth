/**
 * Theme Configuration System
 * Manages different themes and their properties for dynamic loading
 */

export class ThemeConfig {
    constructor() {
        this.themes = {
            'johnny-be-good': {
                name: 'Johnny Be Good!',
                description: 'Warm orange theme with professional styling',
                cssFile: 'themes/johnny-be-good.css',
                primaryColor: '#f97316',
                frameStyles: [
                    {
                        value: 'modern-gallery',
                        label: '🖼️ 現代畫廊',
                        description: '專業深灰邊框配白色內框',
                        availableFormats: ['square', 'portrait', 'story']
                    },
                    {
                        value: 'gradient-glow',
                        label: '✨ 漸變光暈',
                        description: '彩虹漸變配光暈效果',
                        availableFormats: ['square', 'portrait', 'story']
                    },
                    {
                        value: 'geometric-art',
                        label: '🔶 幾何抽象',
                        description: '橙色主框配青色多層裝飾',
                        availableFormats: ['square', 'portrait', 'story']
                    },
                    {
                        value: 'minimal-lines',
                        label: '➖ 極簡線條',
                        description: '四角線條的簡約設計',
                        availableFormats: ['square', 'portrait'] // 測試：只支援正方形和直式
                    },
                    {
                        value: 'tech-modern',
                        label: '💻 科技現代',
                        description: '藍色科技風配內部線條',
                        availableFormats: ['square', 'portrait', 'story']
                    }
                ],
                shareMessage: "Farewell, Johnny! Go be good! (Like the song! 😉)",
                url: "https://calebtestbeta.github.io/web-photo-booth/johnny-be-good.html",
                favicon: {
                    svg: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIOiDjOaZryAtLT4KICA8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSIzIiBmaWxsPSIjZjhmOWZhIi8+CiAgCiAgPCEtLSDnm7jmhoYgKOmHkeiJsuaBuOWxpCkgLS0+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdvbGRHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkQ3MDAiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkE1MDAiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkY4QzAwIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICAKICA8IS0tIOWkluahhuW9tiAtLT4KICA8cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSIyIiBmaWxsPSJub25lIiBzdHJva2U9InVybCgjZ29sZEdyYWRpZW50KSIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgCiAgPCEtLSDlhaXpg6jnhafniYflnY/ln58gLS0+CiAgPHJlY3QgeD0iNiIgeT0iNiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iMSIgZmlsbD0id2hpdGUiLz4KICAKICA8IS0tIOebuOmKn+Wcluaomeq8nCAtLT4KICA8cmVjdCB4PSIxMiIgeT0iMTQiIHdpZHRoPSI4IiBoZWlnaHQ9IjUiIHJ4PSIxIiBmaWxsPSIjMzQ5OGRiIi8+CiAgPGNpcmNsZSBjeD0iMTYiIGN5PSIxNi41IiByPSIyIiBmaWxsPSIjMzQ5OGRiIi8+CiAgCiAgPCEtLSDoo4Xpo77npbkgLS0+CiAgPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjEuNSIgZmlsbD0idXJsKCNnb2xkR3JhZGllbnQpIi8+CiAgPGNpcmNsZSBjeD0iMjQiIGN5PSI4IiByPSIxLjUiIGZpbGw9InVybCgjZ29sZEdyYWRpZW50KSIvPgogIDxjaXJjbGUgY3g9IjgiIGN5PSIyNCIgcj0iMS41IiBmaWxsPSJ1cmwoI2dvbGRHcmFkaWVudCkiLz4KICA8Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIxLjUiIGZpbGw9InVybCgjZ29sZEdyYWRpZW50KSIvPgo8L3N2Zz4K'
                }
            },
            'christmas': {
                name: 'Christmas Magic',
                description: 'Festive red and green theme for holiday photos',
                cssFile: 'themes/christmas.css',
                primaryColor: '#dc2626',
                frameStyles: [
                    {
                        value: 'collage-christmas',
                        label: '🎨 拼貼聖誕',
                        description: '拼貼風格聖誕相框',
                        availableFormats: ['square', 'portrait']
                    },
                    {
                        value: 'botanical-christmas',
                        label: '🌿 聖誕植感',
                        description: '自然植物風格相框',
                        availableFormats: ['square', 'portrait']
                    },
                    {
                        value: 'joyful-christmas',
                        label: '🎉 聖誕歡樂',
                        description: '歡樂慶祝風格相框',
                        availableFormats: ['square', 'portrait']
                    },
                    {
                        value: 'joyful-stars',
                        label: '🌟 歡樂星星',
                        description: '閃耀祝福聖誕星光',
                        availableFormats: ['square', 'portrait']
                    },
                    {
                        value: 'nativity-poster',
                        label: '✝️ 耶穌降生',
                        description: '聖誕海報風格',
                        availableFormats: ['square', 'portrait']
                    },
                    {
                        value: 'heartfelt-christmas',
                        label: '❤️ 聖誕真心',
                        description: '溫馨真心聖誕祝福',
                        availableFormats: ['square', 'portrait']
                    },
                    {
                        value: 'cozy-coffee',
                        label: '☕ 聖誕咖啡',
                        description: '溫暖咖啡聖誕時光',
                        availableFormats: ['square', 'portrait']
                    },
                    {
                        value: 'polaroid',
                        label: '📸 信友拍立得',
                        description: '教會品牌拍立得風格',
                        availableFormats: ['square', 'portrait', 'story']
                    },
                    {
                        value: 'colorful-christmas',
                        label: '🎨 繽紛聖誕',
                        description: '多彩聖誕裝飾風格',
                        availableFormats: ['square', 'portrait', 'story']
                    },
                    {
                        value: 'christmas-feast',
                        label: '🍽️ 聖誕盛宴',
                        description: '溫馨聖誕餐桌風格',
                        availableFormats: ['square', 'portrait', 'story']
                    },
                    {
                        value: 'merry-christmas',
                        label: '🎅 聖誕歡樂',
                        description: '歡樂聖誕氛圍風格',
                        availableFormats: ['square', 'portrait', 'story']
                    },
                    {
                        value: 'christmas-fairy-tale',
                        label: '✨ 聖誕童話',
                        description: '夢幻童話聖誕風格',
                        availableFormats: ['square', 'portrait', 'story']
                    },
                    {
                        value: 'christmas-card',
                        label: '💌 聖誕卡片',
                        description: '卡片祝福風格',
                        availableFormats: ['square']
                    }
                ],
                shareMessage: "🎄 Merry Christmas! Sharing holiday magic ✨",
                url: "https://pse.is/8eafnd",
                favicon: {
                    svg: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSIzIiBmaWxsPSIjZmVmMmYyIi8+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImNocmlzdG1hc0dyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZGMyNjI2Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMTViOTgxIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2RjMjYyNiIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiByeD0iMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ1cmwoI2NocmlzdG1hc0dyYWQpIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8cmVjdCB4PSI2IiB5PSI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHJ4PSIxIiBmaWxsPSJ3aGl0ZSIvPgogIDx0ZXh0IHg9IjE2IiB5PSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZGMyNjI2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn44EPC90ZXh0Pgo8L3N2Zz4K'
                }
            },
            'new-year': {
                name: 'HELLO 2026',
                description: 'New Year celebration theme with festive champagne gold styling',
                cssFile: 'themes/new-year.css',
                primaryColor: '#d4af37',
                frameStyles: [
                    {
                        value: 'taipei101',
                        label: '🎆 跨年101',
                        description: '台北101煙火倒數時刻',
                        availableFormats: ['square', 'portrait']
                    },
                    {
                        value: 'morning-glow',
                        label: '🌅 跨年晨光',
                        description: '新年第一道曙光祝福',
                        availableFormats: ['square', 'portrait']
                    },
                    {
                        value: 'fireworks',
                        label: '✨ 跨年煙火',
                        description: '璀璨煙火綻放瞬間',
                        availableFormats: ['square', 'portrait']
                    },
                    {
                        value: 'playful',
                        label: '🎉 跨年童趣',
                        description: '歡樂派對童趣風格',
                        availableFormats: ['square', 'portrait']
                    },
                    {
                        value: 'minimalist',
                        label: '📅 跨年簡約',
                        description: '2025→2026極簡設計',
                        availableFormats: ['square', 'portrait']
                    }
                ],
                shareMessage: "🎊 HELLO 2026! 迎接新年的美好時刻 ✨",
                url: "https://calebtestbeta.github.io/web-photo-booth/new-year.html",
                favicon: {
                    svg: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSIzIiBmaWxsPSIjMGEwZTFhIi8+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9Im55R3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNkNGFmMzciLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmM2U1YWIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZDRhZjM3Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSIyIiBmaWxsPSJub25lIiBzdHJva2U9InVybCgjbnlHcmFkKSIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgPHJlY3QgeD0iNiIgeT0iNiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iMSIgZmlsbD0iIzBhMGUxYSIvPgogIDx0ZXh0IHg9IjE2IiB5PSIxOCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2Q0YWYzNyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+MjYnPC90ZXh0PgogIDxjaXJjbGUgY3g9IjgiIGN5PSI4IiByPSIxIiBmaWxsPSIjZjNlNWFiIi8+CiAgPGNpcmNsZSBjeD0iMjQiIGN5PSI4IiByPSIxIiBmaWxsPSIjZjNlNWFiIi8+CiAgPGNpcmNsZSBjeD0iOCIgY3k9IjI0IiByPSIxIiBmaWxsPSIjZjNlNWFiIi8+CiAgPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMSIgZmlsbD0iI2YzZTVhYiIvPgo8L3N2Zz4K'
                }
            },
            'new-year-v2': {
                name: 'HELLO 2026 V2',
                description: 'Alternative New Year theme using the same festive frames',
                cssFile: 'themes/new-year.css',
                primaryColor: '#d4af37',
                frameStyles: [
                    {
                        value: 'taipei101',
                        label: '🎆 跨年101',
                        description: '台北101煙火倒數時刻',
                        availableFormats: ['square', 'portrait']
                    },
                    {
                        value: 'morning-glow',
                        label: '🌅 跨年晨光',
                        description: '新年第一道曙光祝福',
                        availableFormats: ['square', 'portrait']
                    },
                    {
                        value: 'fireworks',
                        label: '✨ 跨年煙火',
                        description: '璀璨煙火綻放瞬間',
                        availableFormats: ['square', 'portrait']
                    },
                    {
                        value: 'playful',
                        label: '🎉 跨年童趣',
                        description: '歡樂派對童趣風格',
                        availableFormats: ['square', 'portrait']
                    },
                    {
                        value: 'minimalist',
                        label: '📅 跨年簡約',
                        description: '2025→2026極簡設計',
                        availableFormats: ['square', 'portrait']
                    }
                ],
                shareMessage: "🎊 HELLO 2026! 迎接新年的美好時刻 ✨",
                url: "https://calebtestbeta.github.io/web-photo-booth/new-year-v2.html",
                favicon: {
                    svg: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSIzIiBmaWxsPSIjMGEwZTFhIi8+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9Im55R3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNkNGFmMzciLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmM2U1YWIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZDRhZjM3Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSIyIiBmaWxsPSJub25lIiBzdHJva2U9InVybCgjbnlHcmFkKSIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgPHJlY3QgeD0iNiIgeT0iNiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iMSIgZmlsbD0iIzBhMGUxYSIvPgogIDx0ZXh0IHg9IjE2IiB5PSIxOCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2Q0YWYzNyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VjInPC90ZXh0PgogIDxjaXJjbGUgY3g9IjgiIGN5PSI4IiByPSIxIiBmaWxsPSIjZjNlNWFiIi8+CiAgPGNpcmNsZSBjeD0iMjQiIGN5PSI4IiByPSIxIiBmaWxsPSIjZjNlNWFiIi8+CiAgPGNpcmNsZSBjeD0iOCIgY3k9IjI0IiByPSIxIiBmaWxsPSIjZjNlNWFiIi8+CiAgPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMSIgZmlsbD0iI2YzZTVhYiIvPgo8L3N2Zz4K'
                }
            }
        };

        this.currentTheme = 'johnny-be-good';
        this.loadedThemes = new Set();
    }
    
    /**
     * Get available themes
     * @returns {Object} Object containing all theme configurations
     */
    getThemes() {
        return this.themes;
    }
    
    /**
     * Get specific theme configuration
     * @param {string} themeId - Theme identifier
     * @returns {Object|null} Theme configuration or null if not found
     */
    getTheme(themeId) {
        return this.themes[themeId] || null;
    }
    
    /**
     * Get current theme configuration
     * @returns {Object} Current theme configuration
     */
    getCurrentTheme() {
        return this.themes[this.currentTheme];
    }
    
    /**
     * Set current theme
     * @param {string} themeId - Theme identifier
     * @returns {boolean} Success status
     */
    setCurrentTheme(themeId) {
        if (this.themes[themeId]) {
            this.currentTheme = themeId;
            return true;
        }
        return false;
    }
    
    /**
     * Load theme CSS dynamically
     * @param {string} themeId - Theme identifier
     * @returns {Promise<boolean>} Promise resolving to success status
     */
    async loadTheme(themeId) {
        const theme = this.getTheme(themeId);
        if (!theme) {
            console.error(`Theme '${themeId}' not found`);
            return false;
        }
        
        // Check if theme is already loaded
        if (this.loadedThemes.has(themeId)) {
            console.log(`Theme '${themeId}' already loaded`);
            return true;
        }
        
        try {
            // Remove existing theme stylesheets
            this.removeLoadedThemes();
            
            // Create new link element for theme CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = theme.cssFile;
            link.id = `theme-${themeId}`;
            link.dataset.theme = themeId;
            
            // Add to document head
            document.head.appendChild(link);
            
            // Wait for CSS to load
            await new Promise((resolve, reject) => {
                link.onload = () => {
                    this.loadedThemes.add(themeId);
                    this.setCurrentTheme(themeId);
                    console.log(`Theme '${themeId}' loaded successfully`);
                    resolve();
                };
                
                link.onerror = () => {
                    console.error(`Failed to load theme '${themeId}' from ${theme.cssFile}`);
                    document.head.removeChild(link);
                    reject(new Error(`Failed to load theme CSS: ${theme.cssFile}`));
                };
                
                // Timeout after 10 seconds
                setTimeout(() => {
                    reject(new Error(`Theme loading timeout: ${themeId}`));
                }, 10000);
            });
            
            // Update favicon if provided
            if (theme.favicon) {
                this.updateFavicon(theme.favicon);
            }
            
            return true;
        } catch (error) {
            console.error(`Error loading theme '${themeId}':`, error);
            return false;
        }
    }
    
    /**
     * Remove all loaded theme stylesheets
     */
    removeLoadedThemes() {
        const themeLinks = document.querySelectorAll('link[data-theme]');
        themeLinks.forEach(link => {
            const themeId = link.dataset.theme;
            document.head.removeChild(link);
            this.loadedThemes.delete(themeId);
        });
    }
    
    /**
     * Update favicon for current theme
     * @param {Object} favicon - Favicon configuration
     */
    updateFavicon(favicon) {
        if (!favicon || !favicon.svg) return;
        
        // Remove existing favicons
        const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
        existingFavicons.forEach(link => link.remove());
        
        // Add new favicon
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/svg+xml';
        link.href = favicon.svg;
        document.head.appendChild(link);
    }
    
    /**
     * Get theme-specific share message
     * @param {string} themeId - Theme identifier (optional, uses current theme if not provided)
     * @param {string} customUrl - Custom URL to override theme default URL
     * @returns {string} Formatted share message
     */
    getShareMessage(themeId = null, customUrl = null) {
        const theme = themeId ? this.getTheme(themeId) : this.getCurrentTheme();
        if (!theme) return '';
        
        const url = customUrl || theme.url || '';
        return `${theme.shareMessage}${url ? ' ' + url : ''}`;
    }
    
    /**
     * Get available frame styles for theme
     * @param {string} themeId - Theme identifier (optional, uses current theme if not provided)
     * @returns {Array} Array of frame style objects or identifiers
     */
    getFrameStyles(themeId = null) {
        const theme = themeId ? this.getTheme(themeId) : this.getCurrentTheme();
        return theme ? theme.frameStyles : [];
    }

    /**
     * Get frame style values (for backward compatibility)
     * @param {string} themeId - Theme identifier (optional, uses current theme if not provided)
     * @returns {Array} Array of frame style value strings
     */
    getFrameStyleValues(themeId = null) {
        const styles = this.getFrameStyles(themeId);
        if (!styles || styles.length === 0) return [];

        // Support both object and string formats
        return styles.map(style =>
            typeof style === 'string' ? style : style.value
        );
    }

    /**
     * Get frame style configuration by value
     * @param {string} styleValue - Frame style value identifier
     * @param {string} themeId - Theme identifier (optional, uses current theme if not provided)
     * @returns {Object|null} Frame style configuration object or null if not found
     */
    getFrameStyleConfig(styleValue, themeId = null) {
        const styles = this.getFrameStyles(themeId);
        if (!styles || styles.length === 0) return null;

        const style = styles.find(s =>
            (typeof s === 'string' ? s : s.value) === styleValue
        );

        // If style is a string (old format), convert to object format
        if (typeof style === 'string') {
            return {
                value: style,
                label: style,
                description: '',
                availableFormats: ['square', 'portrait', 'story']
            };
        }

        return style || null;
    }
    
    /**
     * Get theme CSS custom property value
     * @param {string} propertyName - CSS custom property name (with or without --)
     * @returns {string} Property value
     */
    getThemeProperty(propertyName) {
        const prop = propertyName.startsWith('--') ? propertyName : `--${propertyName}`;
        return getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
    }
    
    /**
     * Initialize theme system
     * @param {string} defaultTheme - Default theme to load
     * @returns {Promise<boolean>} Promise resolving to success status
     */
    async initialize(defaultTheme = 'johnny-be-good') {
        try {
            console.log('Initializing theme system...');
            
            // Check if theme is already loaded via HTML
            const existingThemeLink = document.querySelector('link[href*="themes/"]');
            if (existingThemeLink) {
                const themeMatch = existingThemeLink.href.match(/themes\/(.+)\.css$/);
                if (themeMatch) {
                    const loadedThemeId = themeMatch[1];
                    this.loadedThemes.add(loadedThemeId);
                    this.setCurrentTheme(loadedThemeId);
                    console.log(`Found pre-loaded theme: ${loadedThemeId}`);
                    return true;
                }
            }
            
            // Load default theme if none found
            const success = await this.loadTheme(defaultTheme);
            if (success) {
                console.log(`Theme system initialized with theme: ${defaultTheme}`);
            }
            return success;
        } catch (error) {
            console.error('Failed to initialize theme system:', error);
            return false;
        }
    }
}

// Export singleton instance
export const themeConfig = new ThemeConfig();