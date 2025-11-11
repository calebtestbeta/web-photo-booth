export class GestureHandler {
    constructor(canvas) {
        this.canvas = canvas;
        this.isEnabled = false;
        
        this.pointers = new Map();
        this.lastTransform = { x: 0, y: 0, scale: 1, rotation: 0 };
        this.gestureState = null;
        
        this.minScale = 0.1;
        this.maxScale = 5;
        this.rotationThreshold = Math.PI / 180 * 5;
        
        this.doubleTapTimeout = null;
        this.doubleTapDelay = 300;
        
        this.eventListeners = new Map();
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.canvas.addEventListener('pointerdown', this.handlePointerDown.bind(this));
        this.canvas.addEventListener('pointermove', this.handlePointerMove.bind(this));
        this.canvas.addEventListener('pointerup', this.handlePointerUp.bind(this));
        this.canvas.addEventListener('pointercancel', this.handlePointerUp.bind(this));
        
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        this.canvas.addEventListener('touchstart', (e) => e.preventDefault());
        this.canvas.addEventListener('touchmove', (e) => e.preventDefault());
        this.canvas.addEventListener('touchend', (e) => e.preventDefault());
    }
    
    enable() {
        this.isEnabled = true;
    }
    
    disable() {
        this.isEnabled = false;
        this.pointers.clear();
        this.gestureState = null;
    }
    
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }
    
    emit(event, data) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(callback => callback(data));
        }
    }
    
    handlePointerDown(e) {
        if (!this.isEnabled) return;
        
        this.canvas.setPointerCapture(e.pointerId);
        this.pointers.set(e.pointerId, {
            x: e.clientX,
            y: e.clientY,
            startX: e.clientX,
            startY: e.clientY,
            timestamp: Date.now()
        });
        
        if (this.pointers.size === 1) {
            this.handleSinglePointerStart(e);
        } else if (this.pointers.size === 2) {
            this.handleTwoPointerStart();
        }
        
        if (this.pointers.size === 1) {
            this.emit('transformStart');
        }
    }
    
    handlePointerMove(e) {
        if (!this.isEnabled || !this.pointers.has(e.pointerId)) return;
        
        this.pointers.get(e.pointerId).x = e.clientX;
        this.pointers.get(e.pointerId).y = e.clientY;
        
        if (this.pointers.size === 1) {
            this.handleSinglePointerMove();
        } else if (this.pointers.size === 2) {
            this.handleTwoPointerMove();
        }
    }
    
    handlePointerUp(e) {
        if (!this.isEnabled || !this.pointers.has(e.pointerId)) return;
        
        const pointer = this.pointers.get(e.pointerId);
        const duration = Date.now() - pointer.timestamp;
        const distance = Math.sqrt(
            Math.pow(e.clientX - pointer.startX, 2) + 
            Math.pow(e.clientY - pointer.startY, 2)
        );
        
        if (this.pointers.size === 1 && duration < 300 && distance < 10) {
            this.handlePotentialTap(e);
        }
        
        this.pointers.delete(e.pointerId);
        
        if (this.pointers.size === 0) {
            this.gestureState = null;
            this.emit('transformEnd');
        } else if (this.pointers.size === 1) {
            this.handleTwoPointerEnd();
        }
    }
    
    handleSinglePointerStart(e) {
        this.gestureState = 'pan';
    }
    
    handleSinglePointerMove() {
        if (this.gestureState !== 'pan') return;
        
        const pointers = Array.from(this.pointers.values());
        const pointer = pointers[0];
        
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const dx = (pointer.x - (pointer.lastX || pointer.x)) * scaleX;
        const dy = (pointer.y - (pointer.lastY || pointer.y)) * scaleY;
        
        pointer.lastX = pointer.x;
        pointer.lastY = pointer.y;
        
        if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
            this.emit('transformUpdate', { dx, dy });
        }
    }
    
    handleTwoPointerStart() {
        this.gestureState = 'pinch';
        
        const pointers = Array.from(this.pointers.values());
        const [p1, p2] = pointers;
        
        this.lastTransform = {
            distance: this.getDistance(p1, p2),
            angle: this.getAngle(p1, p2),
            centerX: (p1.x + p2.x) / 2,
            centerY: (p1.y + p2.y) / 2
        };
    }
    
    handleTwoPointerMove() {
        if (this.gestureState !== 'pinch') return;
        
        const pointers = Array.from(this.pointers.values());
        const [p1, p2] = pointers;
        
        const currentDistance = this.getDistance(p1, p2);
        const currentAngle = this.getAngle(p1, p2);
        const currentCenterX = (p1.x + p2.x) / 2;
        const currentCenterY = (p1.y + p2.y) / 2;
        
        const scale = currentDistance / this.lastTransform.distance;
        let rotation = currentAngle - this.lastTransform.angle;
        
        if (Math.abs(rotation) > Math.PI) {
            rotation = rotation > 0 ? rotation - 2 * Math.PI : rotation + 2 * Math.PI;
        }
        
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const dx = (currentCenterX - this.lastTransform.centerX) * scaleX;
        const dy = (currentCenterY - this.lastTransform.centerY) * scaleY;
        
        const transform = { dx, dy, scale };
        
        if (Math.abs(rotation) > this.rotationThreshold) {
            transform.rotation = rotation;
        }
        
        this.emit('transformUpdate', transform);
        
        this.lastTransform = {
            distance: currentDistance,
            angle: currentAngle,
            centerX: currentCenterX,
            centerY: currentCenterY
        };
    }
    
    handleTwoPointerEnd() {
        this.gestureState = 'pan';
        
        const remainingPointer = Array.from(this.pointers.values())[0];
        remainingPointer.lastX = remainingPointer.x;
        remainingPointer.lastY = remainingPointer.y;
    }
    
    handlePotentialTap(e) {
        if (this.doubleTapTimeout) {
            clearTimeout(this.doubleTapTimeout);
            this.doubleTapTimeout = null;
            this.emit('doubleTap', { x: e.clientX, y: e.clientY });
        } else {
            this.doubleTapTimeout = setTimeout(() => {
                this.doubleTapTimeout = null;
            }, this.doubleTapDelay);
        }
    }
    
    handleWheel(e) {
        if (!this.isEnabled) return;
        
        e.preventDefault();
        
        const scale = e.deltaY > 0 ? 0.9 : 1.1;
        
        const rect = this.canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const dx = (e.clientX - rect.left - centerX) * scaleX * (1 - scale);
        const dy = (e.clientY - rect.top - centerY) * scaleY * (1 - scale);
        
        this.emit('transformStart');
        this.emit('transformUpdate', { dx, dy, scale });
        
        clearTimeout(this.wheelTimeout);
        this.wheelTimeout = setTimeout(() => {
            this.emit('transformEnd');
        }, 100);
    }
    
    getDistance(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }
    
    getAngle(p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    }
}