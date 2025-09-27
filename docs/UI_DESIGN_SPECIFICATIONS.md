# Talky UI Design Specifications

## Design System

### Color Palette
```css
:root {
  /* Primary Colors */
  --electric-blue: #0066FF;
  --electric-blue-hover: #0052CC;
  --electric-blue-light: #E6F2FF;
  
  /* Secondary Colors */
  --white: #FFFFFF;
  --off-white: #FAFAFA;
  
  /* Text Colors */
  --forest-green: #0D2818;
  --forest-green-light: #1A3D2E;
  --text-secondary: #4A5568;
  --text-muted: #718096;
  
  /* Background Colors */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F7FAFC;
  --bg-accent: #E6F2FF;
  
  /* Border Colors */
  --border-light: #E2E8F0;
  --border-medium: #CBD5E0;
  
  /* Status Colors */
  --success: #48BB78;
  --warning: #ED8936;
  --error: #F56565;
  --info: #4299E1;
}
```

### Typography System
```css
/* Font Families */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System
```css
/* Spacing Scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Border Radius
```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
--radius-full: 9999px;  /* Full circle */
```

## Component Specifications

### Logo Component
```typescript
// components/ui/Logo.tsx
interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'white'
}

// Sizes:
// sm: text-xl (20px)
// md: text-2xl (24px) - default
// lg: text-3xl (30px)
// xl: text-4xl (36px)
```

**Logo Design**:
- Text: "Talky" in forest green (`--forest-green`)
- Full stop: "." in electric blue (`--electric-blue`)
- Font: Inter, bold weight
- Usage: Always maintain color contrast

### Button System

#### Primary Button
```css
.btn-primary {
  background: var(--electric-blue);
  color: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-6);
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--electric-blue-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: var(--white);
  color: var(--forest-green);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-6);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
  border-color: var(--electric-blue);
}
```

### Chat Interface Design

#### Message Bubbles
```css
/* Sent Messages */
.message-sent {
  background: var(--electric-blue);
  color: var(--white);
  border-radius: var(--radius-xl) var(--radius-xl) var(--radius-sm) var(--radius-xl);
  margin-left: auto;
  max-width: 70%;
}

/* Received Messages */
.message-received {
  background: var(--bg-secondary);
  color: var(--forest-green);
  border-radius: var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm);
  margin-right: auto;
  max-width: 70%;
}

/* Translation Indicator */
.translation-badge {
  background: var(--electric-blue-light);
  color: var(--electric-blue);
  font-size: var(--text-xs);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
}
```

#### Chat Input
```css
.chat-input {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-2xl);
  padding: var(--space-3) var(--space-4);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chat-input:focus {
  border-color: var(--electric-blue);
  box-shadow: 0 0 0 3px var(--electric-blue-light);
}
```

### Navigation Design

#### Chat/Call Toggle Bar (ShadCN Tabs)
```css
.toggle-bar {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-1);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-1);
}

.toggle-item {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.toggle-item.active {
  background: var(--white);
  color: var(--electric-blue);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

#### Mobile Bottom Navigation
```css
.mobile-nav {
  background: var(--white);
  border-top: 1px solid var(--border-light);
  padding: var(--space-2) 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-2);
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-2);
  border-radius: var(--radius-md);
}

.mobile-nav-item.active {
  color: var(--electric-blue);
  background: var(--electric-blue-light);
}
```

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Layout Specifications

#### Desktop Layout
```css
.desktop-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  grid-template-rows: 64px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  height: 100vh;
}

.sidebar {
  grid-area: sidebar;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-light);
}

.header {
  grid-area: header;
  background: var(--white);
  border-bottom: 1px solid var(--border-light);
}

.main {
  grid-area: main;
  overflow: auto;
}
```

#### Mobile Layout
```css
.mobile-layout {
  display: grid;
  grid-template-rows: 1fr 64px;
  grid-template-areas:
    "main"
    "nav";
  height: 100vh;
}

.mobile-main {
  grid-area: main;
  overflow: auto;
}

.mobile-nav {
  grid-area: nav;
}
```

## Animation & Transitions

### Micro-Interactions
```css
/* Button Hover Effects */
.interactive-element {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive-element:hover {
  transform: translateY(-1px);
}

.interactive-element:active {
  transform: translateY(0);
}

/* Loading Animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Slide Animations */
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.slide-in-right {
  animation: slideInRight 0.3s ease-out;
}
```

### Page Transitions
```css
.page-transition-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-transition-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 300ms, transform 300ms;
}

.page-transition-exit {
  opacity: 1;
  transform: translateY(0);
}

.page-transition-exit-active {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 300ms, transform 300ms;
}
```

## Component Library Integration

### ShadCN UI Components
- **Button**: Primary and secondary variants
- **Input**: Chat input, search fields
- **Tabs**: Chat/Call toggle
- **Dialog**: Modals and overlays
- **Avatar**: User profile images
- **Badge**: Status indicators
- **Card**: Content containers
- **Separator**: Visual dividers

### Aceternity UI Components
- **Background Beams**: Landing page hero
- **Floating Navbar**: Mobile navigation
- **Text Generate Effect**: Loading states
- **Spotlight**: Feature highlights
- **Meteors**: Decorative elements

### HeroUI Components
- **Navbar**: Main navigation
- **Modal**: Full-screen overlays
- **Dropdown**: Language selectors
- **Progress**: Loading indicators
- **Tooltip**: Help text
- **Chip**: Tags and labels

## Accessibility Specifications

### Color Contrast
- Text on white background: 4.5:1 minimum ratio
- Interactive elements: 3:1 minimum ratio
- Focus indicators: High contrast borders

### Focus Management
```css
.focus-visible {
  outline: 2px solid var(--electric-blue);
  outline-offset: 2px;
  border-radius: var(--radius-md);
}
```

### Screen Reader Support
- Semantic HTML structure
- ARIA labels for interactive elements
- Alt text for images
- Skip navigation links

## Mobile-Specific Design

### Touch Targets
- Minimum 44px × 44px touch targets
- Adequate spacing between interactive elements
- Thumb-friendly navigation placement

### Gestures
- Swipe to navigate between chats
- Pull to refresh chat lists
- Long press for context menus
- Pinch to zoom in video calls

### Performance Optimizations
- Lazy loading for images and videos
- Virtualized lists for large datasets
- Optimized animations for 60fps
- Reduced motion preferences support

## Dark Mode Support (Future Enhancement)
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1A202C;
    --bg-secondary: #2D3748;
    --text-primary: #F7FAFC;
    --text-secondary: #E2E8F0;
    --border-light: #4A5568;
  }
}
```
