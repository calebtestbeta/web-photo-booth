# Photo Frame Tool

A mobile-first web application for adding decorative frames to photos with touch gestures support.

## Features

### 🎨 **Modern UI/UX Design**
- **Warm Light Theme**: Modern, warm color scheme with orange accent system (#f97316)
- **Professional Design System**: Comprehensive CSS custom properties and design tokens
- **SVG Icon Library**: Professional vector icons replacing emoji for better consistency
- **Card-based Layout**: Modern glassmorphism effects with backdrop blur
- **Responsive Toolbar**: Mobile floating design, desktop integrated layout
- **Format Selector**: Large touch-friendly buttons (80x80px) for better usability

### 📱 **Smart Upload & Processing**
- **Automatic EXIF Correction**: Proper image orientation handling
- **Intelligent Canvas Interaction**: Click empty canvas to upload/capture photos
- **Camera Integration**: Direct camera capture on mobile devices
- **Multiple Input Methods**: File selection, camera capture, drag & drop
- **Gesture Hints System**: Sequential visual tutorials for new users
- **Perfect Placeholder Centering**: Professional empty state with centered prompts

### 🎛️ **Advanced Photo Adjustment**
- **Precision Mode**: Double-finger long-press (500ms) for ultra-precise adjustments
- **Real-time Feedback**: Live scale percentage and rotation degree display
- **Collapsible Controls**: Professional adjustment panel with sliders and micro-controls
- **Pixel-perfect Positioning**: Direction buttons for precise photo placement

### ⌨️ **Keyboard Shortcuts** (Desktop)
- **Arrow Keys**: Pixel-level positioning (Shift + Arrow = fast movement)
- **+/- Keys**: Scale adjustment (5% increments)  
- **R Key**: 90° rotation (Ctrl+R = reset)
- **Space**: Reset to fit
- **P Key**: Toggle precision panel
- **Ctrl+Wheel**: Precise zoom control

### 🖱️ **Enhanced Touch Gestures**
- **Single Touch**: Pan/drag photo positioning
- **Two-finger Gestures**: Simultaneous scale, rotate, and position
- **Precision Mode**: Reduced sensitivity for fine-tuning (30% scale, 20% rotation)
- **Double Tap**: Auto-center photo
- **Visual Feedback**: Golden border during precision mode

### 📐 **Multiple Output Formats**
- **Square (1080×1080)**: Perfect for Instagram posts, Facebook, Twitter
- **Portrait (1080×1350)**: Ideal for Instagram portrait posts  
- **Story (1080×1920)**: Great for Instagram Stories, TikTok, Facebook Stories
- **Smart Recommendations**: Platform-specific sharing suggestions

### 🔗 **Advanced Sharing**
- **Native Web Share API**: Seamless mobile sharing experience
- **Multi-platform Support**: Instagram, TikTok, Facebook optimized
- **Download Fallback**: Automatic download when sharing unavailable
- **Smart File Naming**: Format and dimension-aware filenames

### 🛡️ **Resource Management**
- **Memory Optimization**: Automatic cleanup of blob URLs and canvases
- **Performance Monitoring**: Efficient rendering with minimal resource usage
- **Error Handling**: Comprehensive validation and user feedback

## File Structure

```
/
├── index.html              # Main application HTML
├── styles/app.css          # Mobile-first responsive styles  
├── src/
│   ├── main.js            # App initialization and coordination
│   ├── image.js           # Image upload and EXIF processing
│   ├── gesture.js         # Advanced touch gesture handling with precision mode
│   ├── render.js          # Canvas rendering engine
│   ├── share.js           # Download and sharing functionality
│   ├── gesture-hints.js   # Tutorial system for first-time users
│   └── resource-manager.js # Memory and resource management system
├── assets/
│   ├── icons.svg          # Professional SVG icon library
│   └── frames/            # Frame assets for different formats
│       ├── frame_square_1080x1080.png   # Square format frame
│       ├── frame_portrait_1080x1350.png # Portrait format frame  
│       ├── frame_story_1080x1920.png    # Story format frame
│       ├── frame_1080.png               # Fallback frame
│       └── frame_1080.svg               # Alternative SVG frame
├── johnny-be-good.html               # Johnny Be Good theme photo tool
├── christmas.html                    # Christmas Magic theme photo tool  
├── create_frame_canvas.html          # Single frame generator
├── create_multi_frames.html          # Multi-format frame generator
└── create_christmas_frames.html      # Christmas frame generator
```

## Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd web-photo-booth
   ```

2. **Start a local HTTP server** (required for ES6 modules)
   ```bash
   # Python
   python3 -m http.server 8000
   
   # Node.js
   npx serve . -p 8000
   
   # VS Code Live Server extension
   Right-click index.html → "Open with Live Server"
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## Quick Start Guide

### 📱 **Mobile Usage**
1. **Upload Photo**: Tap "上傳/拍照" button or click the empty canvas area
2. **Basic Adjustments**: Use single finger to drag, two fingers to scale/rotate
3. **Precision Mode**: Long-press with two fingers (500ms) for fine-tuning
4. **Format Selection**: Choose from Square/Portrait/Story formats
5. **Advanced Controls**: Tap "精確調整" to expand precision panel
6. **Share**: Use "分享" button for native sharing or "Download" for manual saving

### 💻 **Desktop Usage**
1. **Upload Photo**: Click "上傳/拍照" button or click the empty canvas
2. **Mouse Controls**: Drag to move, scroll wheel to zoom, Ctrl+scroll for precision
3. **Keyboard Shortcuts**: 
   - Arrow keys for positioning
   - +/- for scaling  
   - R for rotation
   - P for precision panel
   - Space to reset
4. **Precision Panel**: Use sliders and micro-adjustment buttons for exact control

### 🎯 **Pro Tips**
- **First Time**: Follow the gesture hints that appear after uploading
- **Precision Work**: Use the collapsible precision panel for exact adjustments
- **Quick Reset**: Double-tap or press Space to center and fit photo
- **Optimal Quality**: Upload high-resolution photos for best results
- **Social Media**: Each format is optimized for specific platforms

## GitHub Pages Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial photo frame tool"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "main" / "/ (root)"
   - Save

3. **Access the app**
   ```
   https://yourusername.github.io/repository-name
   ```

## New Features (Social Media Optimized)

### 🎨 **Modern Warm Light Theme**
- **Warm Color Palette**: Beautiful warm orange (#f97316) accent system with light backgrounds
- **Consistent Design**: Unified warm theme across all screen sizes and components
- **Better Accessibility**: Improved contrast and readability with warm neutral colors
- **Professional Look**: Clean, modern aesthetic suitable for professional use

### 🖼️ **Multiple Frame Styles**

#### Johnny Be Good Theme (Orange Warm)
- **現代畫廊 (Modern Gallery)**: Clean, professional design with simple borders
- **漸變光暈 (Gradient Glow)**: Colorful rainbow gradient effects
- **幾何抽象 (Geometric Art)**: Multi-layered geometric patterns
- **極簡線條 (Minimal Lines)**: Refined line-based designs
- **科技現代 (Tech Modern)**: Futuristic design with "Johnny Be Good!" text

#### Christmas Magic Theme (Red/Green Festive)
- **🌿 冬青邊框 (Holly Border)**: Classic Christmas with holly leaves, berries, and golden bells
- **❄️ 雪花邊框 (Snow Frame)**: Winter wonderland with animated snowflakes and falling snow
- **🎁 禮物包裝 (Gift Wrapper)**: Festive gift box style with luxury ribbons and stockings
- **✨ 冬日光暈 (Winter Glow)**: Magical glow effects with colorful light particles
- **🎄 節慶燈飾 (Festive Lights)**: Twinkling Christmas lights with sparkling stars

### 📱 Multiple Output Formats
- **正方形 (Square)**: 1080×1080 - Perfect for Instagram posts, Facebook, Twitter
- **直式 (Portrait)**: 1080×1350 - Ideal for Instagram portrait posts
- **限時動態 (Story)**: 1080×1920 - Great for Instagram Stories, TikTok, Facebook Stories

### 🎯 Smart Controls
- **Format Selector**: Choose your target social media platform
- **Style Selector**: Preview and switch between different frame styles
- **Frame Preview**: See frame styles without uploading photos first
- **Platform Recommendations**: Get suggestions for best sharing platforms

### 🖼️ Optimized Frames
- **Custom Frame Assets**: Multiple artistic styles with consistent "Johnny Be Good!" branding
- **Adaptive Sizing**: Frame thickness adjusts automatically per format
- **Mobile-First Design**: Touch-optimized interface for smartphones

## Custom Frame Creation

### Single Frame Generator
1. Open `create_frame_canvas.html` in your browser
2. The frame will be generated automatically  
3. Click "Download Frame PNG"
4. Replace `assets/frames/frame_1080.png` with your custom frame

### Multi-Format Frame Generator  
1. Open `create_multi_frames.html` in your browser
2. Select desired format (Square/Portrait/Story)
3. Click "Download Current Frame" or "Download All Formats"
4. Place files in `assets/frames/` with naming convention:
   - `frame_square_1080x1080.png`
   - `frame_portrait_1080x1350.png` 
   - `frame_story_1080x1920.png`

### Christmas Frame Generator (Enhanced)
1. Open `create_christmas_frames.html` in your browser
2. Select output format (Square/Portrait/Story)
3. Choose Christmas style (Holly Border/Snow Frame/Gift Wrapper/Winter Glow/Festive Lights)
4. Enjoy animated effects: twinkling lights, falling snow, glowing particles, musical notes
5. Download single frame or batch download all format/style combinations
6. Features dynamic animations, gradient text effects, and festive decorations

### Frame Requirements  
- **Format**: Transparent PNG with optimized border width
- **Safe Area**: Central area kept clear for photos (95% of canvas)
- **Naming**: Follow `frame_[format]_[width]x[height].png` convention

## Technical Implementation

### Image Processing
- **EXIF Orientation**: Automatic correction for rotated photos
- **Compression**: Long edge limited to 3000px for performance
- **Quality**: JPEG quality 92% for processing

### Advanced Gesture Controls
- **Single Touch**: Pan/drag photo positioning
- **Two-finger Pinch**: Scale (0.1× to 5×) with precision mode support
- **Two-finger Rotate**: Continuous rotation with precision mode
- **Precision Mode**: Long-press (500ms) for ultra-fine adjustments
  - Scale sensitivity: 30% of normal
  - Rotation sensitivity: 20% of normal
  - Visual feedback: Golden border + haptic vibration
- **Double Tap**: Auto-center photo
- **Mouse Wheel**: Zoom (desktop)
- **Ctrl+Wheel**: Precision zoom (desktop)

### Performance Optimizations
- **Event-Driven Rendering**: Only renders during interactions
- **Render Throttling**: Stops rendering 200ms after interaction ends
- **Canvas Scaling**: 1080×1080 canvas scaled down for preview
- **Memory Management**: Proper cleanup of blob URLs and event listeners

### Browser Compatibility
- **iOS Safari**: 15.0+
- **Android Chrome**: 100.0+
- **Desktop Chrome**: 100.0+
- **Desktop Edge**: 100.0+
- **Desktop Safari**: 15.0+

### Sharing Features
- **Web Share API**: Native sharing on supported mobile browsers
- **Download Fallback**: Automatic download when sharing unavailable
- **HTTPS Required**: Sharing requires secure context

## Adjustable Parameters

Key configurable values in the codebase:

### Image Processing (`src/image.js`)
```javascript
this.maxDimension = 3000;  // Max image dimension
this.jpegQuality = 0.92;   // JPEG compression quality
```

### Gesture Controls (`src/gesture.js`)
```javascript
this.minScale = 0.1;       // Minimum zoom level
this.maxScale = 5;         // Maximum zoom level
this.rotationThreshold = Math.PI / 180 * 5; // 5 degree rotation sensitivity

// Precision Mode Settings
this.longPressDelay = 500; // 500ms to trigger precision mode
this.precisionScaleSensitivity = 0.3;  // 30% scale sensitivity
this.precisionRotationSensitivity = 0.2; // 20% rotation sensitivity
```

### Canvas Rendering (`src/render.js`)
```javascript
this.safeAreaMargin = 0.08; // 8% margin for photo safe area
this.outputWidth = 1080;    // Output image width
this.outputHeight = 1080;   // Output image height
```

## Troubleshooting

### Common Issues

1. **Modules not loading**
   - Ensure you're serving via HTTP server, not file:// protocol
   - Check browser console for CORS errors

2. **Sharing not working**
   - Requires HTTPS in production
   - Check if `navigator.share` is supported in browser

3. **Images not processing**
   - Check file size (50MB limit)
   - Verify image format (JPEG, PNG, WebP supported)

4. **Gestures not responsive**
   - Ensure touch-action: none is applied to canvas
   - Check for pointer capture in gesture handlers

### Performance Tips

- **Large Images**: Tool automatically compresses, but smaller uploads perform better
- **Multiple Frames**: Consider lazy-loading additional frame assets
- **Mobile Performance**: Test on actual devices, not just browser dev tools

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here]