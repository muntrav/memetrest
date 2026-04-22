---
name: VibeMasonry
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#4d4354'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#7e7385'
  outline-variant: '#cfc2d6'
  surface-tint: '#842bd2'
  primary: '#8127cf'
  on-primary: '#ffffff'
  primary-container: '#9c48ea'
  on-primary-container: '#fffbff'
  inverse-primary: '#ddb7ff'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#a12e70'
  on-tertiary: '#ffffff'
  tertiary-container: '#c0488a'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f0dbff'
  primary-fixed-dim: '#ddb7ff'
  on-primary-fixed: '#2c0051'
  on-primary-fixed-variant: '#6900b3'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#ffd8e7'
  tertiary-fixed-dim: '#ffafd3'
  on-tertiary-fixed: '#3d0026'
  on-tertiary-fixed-variant: '#85145a'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.5'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The brand personality of the design system is energetic, visual-centric, and high-dopamine. It is designed to cater to a demographic that communicates through visual culture and memes, requiring an interface that feels as fast and reactive as the content it hosts. 

The design style is a hybrid of **Vibrant Minimalism** and **Glassmorphism**. It prioritizes extreme clarity and whitespace to let the memes shine, while using semi-transparent layers and neon accents to provide a sense of modern depth and "digital-native" playfulness. The goal is to evoke a sense of endless discovery and effortless fun.

## Colors

The color palette is anchored by "Neon Purple" and "Electric Blue." These colors are used strategically for primary actions and highlights to maintain high energy without overwhelming the visual content.

- **Primary & Secondary:** Used for high-priority interactions like "Save," "Follow," and "Post."
- **Gradients:** Applied to progress bars, active states, and special "trending" indicators to mimic the aesthetic of viral internet culture.
- **Surface Strategy:** In light mode, surfaces are crisp white (#FFFFFF) with cool gray backgrounds (#F8FAFC). In dark mode, the design system utilizes a "Sleek Midnight" palette (#0F172A) to make neon accents pop.

## Typography

This design system uses **Plus Jakarta Sans** across all levels. This font family was selected for its contemporary, geometric look and its friendly, open apertures which maintain high legibility even at small sizes.

Headings should be set with heavy weights (700-800) and tight letter-spacing to create a "bold" editorial feel. Body text remains airy and functional. For meme captions or sticker labels, the typography transitions to medium weights to ensure it doesn't compete with the visual assets.

## Layout & Spacing

The design system utilizes a **Fluid Masonry Grid**. Content is organized in multi-column layouts where the height of each item is determined by the aspect ratio of the meme or sticker.

- **Columns:** Dynamic based on viewport width (2 columns on mobile, up to 6 on ultra-wide desktops).
- **Gutter:** A consistent 16px gutter ensures that even with dense visual content, the UI feels breathable.
- **Rhythm:** All internal padding and margins follow a strict 8px baseline grid to ensure alignment across different card heights.

## Elevation & Depth

To maintain a lightweight feel, the design system avoids heavy, muddy shadows. Instead, it uses:

1.  **Ambient Shadows:** Low-opacity, wide-dispersion shadows (Color: Primary tint at 8% opacity) that give the impression of cards floating just above the surface.
2.  **Backdrop Blurs:** Navigation bars and modal overlays use a 12px blur with 80% opacity to maintain context of the scroll-heavy feed beneath them.
3.  **Tonal Stacking:** Hover states are indicated by a subtle lift (increasing shadow spread) and a slight scale-up (1.02x) rather than just color changes, emphasizing the tactile nature of the "sticker" concept.

## Shapes

The shape language is defined by a friendly "Rounded" philosophy. This softens the high-density information of a masonry grid.

- **Content Cards:** Use `rounded-lg` (1rem) to create a approachable, collectible feel.
- **Interactive Elements:** Buttons and input fields use `rounded-xl` (1.5rem) or full pill shapes to signify touch-readiness and playfulness.
- **Media:** Memes and stickers within cards inherit the card's border radius for a unified, "die-cut" sticker appearance.

## Components

### Buttons & Interaction
Buttons use high-contrast fills with the primary neon palette. The "Primary" button features a subtle gradient and a soft glow effect on hover. Micro-interactions should be spring-based, giving a "bouncy" feedback when a user likes or saves a meme.

### Masonry Cards
The core component. Cards are borderless, relying on the background color and ambient shadows for definition. Metadata (author, likes) should appear on a subtle gradient overlay at the bottom of the card or only on hover for desktop users to maximize visual immersion.

### Chips & Tags
Tags are used for meme categories (e.g., #surreal, #trending). These should be rendered with semi-transparent backgrounds of the primary color and bold labels, encouraging quick tapping and exploration.

### Search & Discovery
The search bar is a prominent, pill-shaped element that remains persistent or easily accessible. It uses a "Glass" effect to stay visible over varying meme background colors without feeling visually heavy.

### Reaction Stickers
A custom component for the design system: floating reaction icons that appear when long-pressing a card, allowing users to quickly "react" with common meme tropes.