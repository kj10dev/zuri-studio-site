# Media Setup Guide

## Implementation Complete ✓

The project now uses **background images + `<img>` elements** with gradient fallbacks. 

### Directory Structure

```
assets/
├── projects/
│   ├── jaws/                           # Jaws Family Dentistry project
│   │   ├── brand-identity.jpg         # Required: Brand Identity System
│   │   ├── typography-color.jpg       # Required: Typography & Colour
│   │   ├── onboarding-demo.mp4        # Required: Onboarding Flow Demo (video)
│   │   ├── onboarding-poster.jpg      # Required: Poster for onboarding video
│   │   └── mobile-app-ui.jpg          # Required: Mobile App UI
│   │
│   └── alpha/                          # Alpha Apparel project
│       ├── homepage-design.jpg         # Required: Homepage Design
│       ├── product-detail.jpg          # Required: Product Detail Page
│       ├── drop-experience.mp4         # Required: Drop Launch Experience (video)
│       ├── drop-poster.jpg             # Required: Poster for drop video
│       └── mobile-checkout.jpg         # Required: Mobile Checkout Flow
```

### What Was Changed

1. **Data Structure** (`projects.html`):
   - Added `src` property: Path to actual image/video file
   - Added `alt` property: Accessibility text for images
   - Added `poster` property: Thumbnail for video elements
   - Kept `g` property: Gradient class as elegant fallback

2. **Rendering Logic** (`projects.html`):
   - **Thumbnails**: Renders `<img>` elements inside `.pmed__thumb`
   - **Lightbox**: Displays actual images with `object-fit: cover`
   - **Videos**: Shows play icon overlay + fallback message

3. **Styling** (`css/projects.css`):
   - Images layer on top of gradient backgrounds
   - `background-blend-mode: overlay` creates subtle blending
   - Proper z-index stacking ensures play icons appear on top

### How It Works

**Fallback Chain:**
1. **If image loads**: Displays image with gradient as subtle overlay
2. **If image fails**: Shows gradient color swatch
3. **If video**: Shows play icon overlay on gradient/image

### Image Specifications

**Recommended Format:**
- **Images**: `.jpg` (for photos) or `.png` (for graphics)
- **Videos**: `.mp4` (H.264 codec for broad compatibility)
- **Posters**: `.jpg` 16:10 aspect ratio

**Size Guidelines:**
- **Thumbnails**: 160x110px (will scale up to fit container)
- **Lightbox**: ~880x550px (16:10 aspect ratio)
- **File Size**: Keep under 500KB per image for performance

### Quick Setup

1. Add images to the respective directories:
   ```
   assets/projects/jaws/brand-identity.jpg
   assets/projects/jaws/typography-color.jpg
   assets/projects/alpha/homepage-design.jpg
   ... etc
   ```

2. For videos, add:
   ```
   assets/projects/jaws/onboarding-demo.mp4
   assets/projects/jaws/onboarding-poster.jpg
   assets/projects/alpha/drop-experience.mp4
   assets/projects/alpha/drop-poster.jpg
   ```

3. Test locally:
   - Open `projects.html` in browser
   - Click project card to open modal
   - Verify images load in gallery thumbnails
   - Click thumbnail to open lightbox
   - Video placeholders will show with play icon

### Notes

- Gradients (`.pmed--g1`, `.pmed--g2`, etc.) remain as sophisticated fallbacks
- If an image fails to load, the gradient automatically displays
- Videos show a "Video available on the live site" note in the lightbox
- All alt text is properly set for accessibility

### Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Responsive images with `object-fit: cover`
- ✅ Graceful degradation with CSS gradients
- ✅ Touch-friendly interactions

---

**To add more projects:** Simply extend `PROJECTS_DATA` object with new entries and create corresponding asset directories.
