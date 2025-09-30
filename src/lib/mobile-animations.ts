// Mobile-optimized animation configurations for Framer Motion

export const mobileAnimations = {
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },

  // Slide in from bottom (for modals, sheets)
  slideUp: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
    transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
  },

  // Slide in from right (for side panels)
  slideInRight: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
  },

  // Fade in/out
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },

  // Scale animation (for buttons, cards)
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { duration: 0.2 },
  },

  // Bounce animation (for notifications)
  bounce: {
    initial: { y: -100, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
    exit: { y: -100, opacity: 0 },
  },

  // Swipe animation (for cards)
  swipe: {
    initial: { x: 0 },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'left' ? -300 : 300,
      opacity: 0,
      transition: { duration: 0.2 },
    }),
  },

  // List item stagger
  listContainer: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  },

  listItem: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  },
}

// Tap animation for interactive elements
export const tapAnimation = {
  scale: 0.95,
  transition: { duration: 0.1 },
}

// Hover animation (for devices that support hover)
export const hoverAnimation = {
  scale: 1.02,
  transition: { duration: 0.2 },
}

// Pull to refresh animation
export const pullToRefresh = {
  initial: { y: -50, opacity: 0 },
  pulling: { y: 0, opacity: 1 },
  refreshing: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

// Skeleton loading animation
export const skeletonPulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Toast notification animation
export const toastAnimation = {
  initial: { y: -100, opacity: 0, scale: 0.8 },
  animate: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
  exit: { 
    y: -100, 
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

// Bottom sheet animation
export const bottomSheet = {
  initial: { y: '100%' },
  animate: { 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: { 
    y: '100%',
    transition: { duration: 0.2 },
  },
}

// Backdrop animation
export const backdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

// Check if device prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Get animation config based on reduced motion preference
export function getAnimation(animation: any) {
  if (prefersReducedMotion()) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.1 },
    }
  }
  return animation
}

// Spring configuration for smooth mobile animations
export const springConfig = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

// Drag constraints for swipeable elements
export const dragConstraints = {
  left: -100,
  right: 100,
  top: 0,
  bottom: 0,
}

