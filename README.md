# Photo Frame Tool

A mobile-first web application for adding decorative frames to photos with touch gestures support.

## Features

- **Upload & Process**: Automatic EXIF orientation correction and image optimization
- **Touch Gestures**: Drag, pinch-zoom, rotate, and double-tap to center
- **Multiple Output Formats**: Square (1080×1080), Portrait (1080×1350), Story (1080×1920)
- **Social Media Optimized**: Format recommendations for Instagram, TikTok, Facebook
- **Native Sharing**: Web Share API support with clipboard copy and download fallback
- **Mobile Optimized**: Responsive design with touch-friendly controls and IG-fit button
- **Cross-Platform**: Works on iOS Safari 15+, Android Chrome 100+, and desktop browsers

## File Structure

```
/
├── index.html              # Main application HTML
├── styles/app.css          # Mobile-first responsive styles  
├── src/
│   ├── main.js            # App initialization and coordination
│   ├── image.js           # Image upload and EXIF processing
│   ├── gesture.js         # Touch gesture handling
│   ├── render.js          # Canvas rendering engine
│   └── share.js           # Download and sharing functionality
├── assets/frames/
│   ├── frame_square_1080x1080.png   # Square format frame
│   ├── frame_portrait_1080x1350.png # Portrait format frame  
│   ├── frame_story_1080x1920.png    # Story format frame
│   ├── frame_1080.png               # Fallback frame
│   └── frame_1080.svg               # Alternative SVG frame
├── create_frame_canvas.html          # Single frame generator
└── create_multi_frames.html          # Multi-format frame generator
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

### 📱 Multiple Output Formats
- **正方形 (Square)**: 1080×1080 - Perfect for Instagram posts, Facebook, Twitter
- **直式 (Portrait)**: 1080×1350 - Ideal for Instagram portrait posts
- **限時動態 (Story)**: 1080×1920 - Great for Instagram Stories, TikTok, Facebook Stories

### 🎯 Smart Controls
- **Format Selector**: Choose your target social media platform
- **適合IG Button**: One-click optimization for Instagram posting
- **Copy to Clipboard**: Instantly copy image for easy sharing (supported browsers)
- **Platform Recommendations**: Get suggestions for best sharing platforms

### 🖼️ Optimized Frames
- **Reduced Border Width**: 5% safe area (was 8%) for more photo space
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

### Frame Requirements  
- **Format**: Transparent PNG with optimized border width
- **Safe Area**: Central area kept clear for photos (95% of canvas)
- **Naming**: Follow `frame_[format]_[width]x[height].png` convention

## Technical Implementation

### Image Processing
- **EXIF Orientation**: Automatic correction for rotated photos
- **Compression**: Long edge limited to 3000px for performance
- **Quality**: JPEG quality 92% for processing

### Gesture Controls
- **Single Touch**: Pan/drag the photo
- **Two Finger Pinch**: Scale (0.1× to 5×)
- **Two Finger Rotate**: Rotate the photo
- **Double Tap**: Center the photo
- **Mouse Wheel**: Zoom (desktop)

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