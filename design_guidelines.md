# Project Skyline - Cleveland: Design Guidelines

## Design Approach
**Cinematic Interactive Experience** - Inspired by modern interactive storytelling websites (e.g., Apple product launches, Stripe interactive demos) with a specific Cleveland skyline night aesthetic. This is an experience-focused application where visual impact and emotion drive engagement.

## Core Design Principles
1. **Cinematic Presence**: Bold, immersive experience that feels like a movement
2. **Purposeful Interaction**: Every click, hover, and submission feels meaningful
3. **Cleveland Identity**: Authentic representation of the city's iconic skyline
4. **Symbolic Weight**: Each illuminated building represents real ambition

---

## Typography System

**Primary Font**: Inter or DM Sans (Google Fonts)
- Hero Title: 64px (mobile: 36px), weight 700, tight letter-spacing (-0.02em)
- Subtitle: 24px (mobile: 18px), weight 400, lighter opacity (0.8)
- Section Headers: 32px (mobile: 24px), weight 600
- Body/Form Labels: 16px, weight 400
- Tooltips: 14px, weight 500

**Hierarchy**: Use size and weight contrast rather than color variations to maintain night aesthetic

---

## Layout & Spacing System

**Tailwind Units**: Use 4, 8, 12, 16, 24, 32 for consistent rhythm (p-4, h-8, mb-12, etc.)

**Container Structure**:
- Full viewport sections with internal max-w-6xl centering
- Hero: 90vh minimum height
- Skyline section: 60vh viewport, allowing buildings to feel monumental
- Form section: Natural height with py-24

**Vertical Flow**:
1. Hero section (centered, full viewport)
2. Skyline visualization (immersive, dark background)
3. Form section (grounded, accessible)

---

## Component Library

### Hero Section
- Centered vertical layout with title, subtitle, and primary CTA
- Title: "Project Skyline – Cleveland"
- Subtitle: "Light your mark on the skyline"
- Primary button: "Add Your Light" (purple glow effect)
- Smooth scroll behavior to form on click

### Skyline Visualization
**Building Components** (15-20 total buildings):
- Key Tower: Tallest (~500px), centered prominence
- Terminal Tower: Second tallest (~420px), distinctive crown detail
- 200 Public Square: Modern rectangular (~380px)
- Supporting buildings: Varying heights 200-350px

**Building Design**:
- Base width: 40-80px depending on building
- Smooth rounded corners (2-4px border-radius)
- Default state: Dark charcoal (#1a1f2e) with subtle gradient
- Lit state: Purple (#a970ff) with multi-layer box-shadow glow
- Transition: 0.8s ease-in-out for lighting effect

**Layout**: Align buildings at bottom baseline, create realistic skyline silhouette with slight perspective depth (darker/smaller buildings in back)

### Interactive Form
**Form Fields**:
- Name input (required, text field)
- Goal/Ambition input (required, textarea, 2-3 rows)
- Submit button: "Illuminate Your Building"

**Form Container**:
- Centered card with subtle border (#a970ff at 0.2 opacity)
- Semi-transparent background for depth
- Maximum width: 500px
- Padding: p-8
- Input styling: Dark backgrounds with purple focus states

### Tooltip System
**Appearance**:
- Dark background (#0f1419) with purple border
- Drop shadow for elevation
- Arrow pointing to building
- Max-width: 200px
- Padding: p-3

**Content**:
- Name: Bold, 14px
- Goal: Regular, 13px, slight opacity reduction

---

## Animation Specifications

**Building Illumination Sequence**:
1. Fade-in from bottom to top (0.4s)
2. Glow intensity increase (0.6s)
3. Final pulse (0.2s)

**Glow Effect Layers**:
- Inner glow: 0 0 20px rgba(169, 112, 255, 0.6)
- Middle glow: 0 0 40px rgba(169, 112, 255, 0.4)
- Outer glow: 0 0 60px rgba(169, 112, 255, 0.2)

**Button Hover**: Subtle scale (1.02) with increased glow, 0.2s transition

**Scroll Behavior**: Smooth scroll with 60px offset for visual comfort

---

## Visual Treatment

**Background**: Deep navy gradient from #070b14 to #0a0f1a (top to bottom)

**Accent Colors**:
- Primary purple: #a970ff
- Hover purple: #bb88ff
- Dark charcoal: #1a1f2e
- Text white: #ffffff with varying opacity (1.0, 0.9, 0.7)

**Depth & Atmosphere**:
- Subtle stars/dots in background (0.3 opacity, scattered)
- Building shadows for depth
- Atmospheric glow around lit buildings

---

## Responsive Behavior

**Desktop (1024px+)**: Full skyline spread, side-by-side elements where appropriate
**Tablet (768px-1023px)**: Maintained skyline, stacked form
**Mobile (<768px)**: 
- Simplified skyline (10-12 buildings)
- Single column layout
- Reduced building heights proportionally
- Maintained visual impact with focused composition

---

## Accessibility

- Focus states: Purple outline (2px) on all interactive elements
- Keyboard navigation: Full support for form and button interactions
- ARIA labels for skyline buildings and tooltips
- High contrast maintained between text and backgrounds
- Minimum touch target: 44x44px for mobile

---

## Images
**No hero image required** - The skyline visualization itself serves as the visual hero element. The CSS-rendered building skyline is the centerpiece of the experience.