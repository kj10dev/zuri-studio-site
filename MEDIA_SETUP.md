# Media Setup Guide

## Current Implementation ✓

The project modal now renders its media from the `media` arrays inside the project data object in [projects.html](projects.html). Each item uses either an image path or a video path and falls back to the gradient class defined in the modal thumbnail.

### Expected Asset Paths

```
assets/
├── projects/
│   ├── jaws/
│   │   ├── brand-identity.jpg
│   │   ├── typography-color.jpg
│   │   ├── onboarding-demo.mp4
│   │   ├── onboarding-poster.jpg
│   │   └── mobile-app-ui.jpg
│   └── alpha/
│       ├── homepage-design.jpg
│       ├── product-detail.jpg
│       ├── drop-experience.mp4
│       ├── drop-poster.jpg
│       └── mobile-checkout.jpg
```

### What the Modal Uses

1. The hero image for each project is driven by `imgClass` and the shared `.pmodal__img` styling.
2. The gallery thumbnails are generated from the `media` entries in `PROJECTS_DATA`.
3. Images render as `<img>` tags inside the gallery items.
4. Videos render with a play icon and a lightweight fallback message in the lightbox.

### Important Notes

- Paths in [projects.html](projects.html) should be relative to the site root, such as `assets/projects/jaws/brand-identity.jpg`.
- The modal uses the `caption`, `alt`, and `g` properties to create the gallery item and lightbox content.
- If a local image is missing, the gradient background still remains visible as a fallback.
- The visit link in the modal footer is controlled by the `url` field in each project object.

### Quick Setup

1. Place the required files in the directories above.
2. Ensure the `src` values in [projects.html](projects.html) match the actual filenames.
3. Open [projects.html](projects.html), click a project card, and verify:
   - the gallery shows thumbnails,
   - clicking a thumbnail opens the lightbox,
   - the footer link appears when a valid `url` is present.

### Recommended Asset Specs

- Images: `.jpg` or `.png`
- Videos: `.mp4`
- Posters: `.jpg` or `.png` with a landscape aspect ratio
- Keep file sizes reasonable for web delivery
