/**
 * 手勢提示系統 - 為新用戶提供視覺化的操作引導
 */
export class GestureHints {
    constructor() {
        this.gestureHint = document.getElementById('gestureHint');
        this.gestureText = document.getElementById('gestureText');
        this.gestureHelp = document.getElementById('gestureHelp');
        
        this.hints = [
            { text: '拖拽移動照片', class: 'drag', duration: 3000 },
            { text: '雙指縮放照片', class: 'pinch', duration: 3000 },
            { text: '雙指旋轉照片', class: 'rotate', duration: 3000 }
        ];
        
        this.currentHintIndex = 0;
        this.hintTimer = null;
        this.isShowing = false;
        this.hasShownOnce = localStorage.getItem('gestureHintsShown') === 'true';
    }
    
    /**
     * 顯示手勢提示序列
     */
    showHints() {
        if (this.hasShownOnce || this.isShowing) return;
        
        console.log('GestureHints: 開始顯示手勢提示');
        this.isShowing = true;
        this.currentHintIndex = 0;
        
        // 顯示幫助文字
        if (this.gestureHelp) {
            this.gestureHelp.style.display = 'block';
            this.gestureHelp.classList.remove('hidden');
        }
        
        // 開始提示序列
        setTimeout(() => {
            this.showNextHint();
        }, 1000);
    }
    
    /**
     * 顯示下一個提示
     */
    showNextHint() {
        if (this.currentHintIndex >= this.hints.length) {
            this.completeHints();
            return;
        }
        
        const hint = this.hints[this.currentHintIndex];
        console.log(`GestureHints: 顯示提示 ${this.currentHintIndex + 1}: ${hint.text}`);
        
        // 設置提示文字和動畫
        if (this.gestureText) {
            this.gestureText.textContent = hint.text;
        }
        
        if (this.gestureHint) {
            // 清除之前的動畫類
            this.gestureHint.className = 'gesture-hint';
            this.gestureHint.style.display = 'block';
            
            // 添加新的動畫類
            requestAnimationFrame(() => {
                this.gestureHint.classList.add('show', hint.class);
            });
        }
        
        // 設置定時器顯示下一個提示
        this.hintTimer = setTimeout(() => {
            this.hideCurrentHint();
            this.currentHintIndex++;
            setTimeout(() => {
                this.showNextHint();
            }, 500);
        }, hint.duration);
    }
    
    /**
     * 隱藏當前提示
     */
    hideCurrentHint() {
        if (this.gestureHint) {
            this.gestureHint.classList.remove('show');
        }
    }
    
    /**
     * 完成所有提示
     */
    completeHints() {
        console.log('GestureHints: 完成所有手勢提示');
        this.isShowing = false;
        
        // 隱藏提示元素
        if (this.gestureHint) {
            this.gestureHint.style.display = 'none';
            this.gestureHint.className = 'gesture-hint';
        }
        
        // 記錄已顯示過提示
        localStorage.setItem('gestureHintsShown', 'true');
        this.hasShownOnce = true;
        
        // 延遲隱藏幫助文字
        setTimeout(() => {
            if (this.gestureHelp) {
                this.gestureHelp.style.opacity = '0';
                setTimeout(() => {
                    this.gestureHelp.style.display = 'none';
                }, 300);
            }
        }, 3000);
    }
    
    /**
     * 停止當前提示序列
     */
    stopHints() {
        if (this.hintTimer) {
            clearTimeout(this.hintTimer);
            this.hintTimer = null;
        }
        
        this.isShowing = false;
        
        if (this.gestureHint) {
            this.gestureHint.style.display = 'none';
            this.gestureHint.className = 'gesture-hint';
        }
        
        if (this.gestureHelp) {
            this.gestureHelp.style.display = 'none';
        }
    }
    
    /**
     * 重置提示狀態（用於測試）
     */
    resetHints() {
        localStorage.removeItem('gestureHintsShown');
        this.hasShownOnce = false;
        this.stopHints();
    }
    
    /**
     * 檢查是否應該顯示提示
     */
    shouldShowHints() {
        return !this.hasShownOnce && !this.isShowing;
    }
    
    /**
     * 手動觸發提示（用於重新引導）
     */
    triggerHints() {
        this.stopHints();
        this.hasShownOnce = false;
        setTimeout(() => {
            this.showHints();
        }, 500);
    }
}