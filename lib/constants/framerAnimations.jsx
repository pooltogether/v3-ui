export const ANIM_BANNER_VARIANTS = (shouldReduceMotion) => ({
  enter: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: shouldReduceMotion ? 0 : 0.2
    }
  },
  exit: {
    scale: 0,
    opacity: 1,
    transition: {
      duration: shouldReduceMotion ? 0 : 0.2
    }
  }
})

export const ANIM_LIST_VARIANTS = (shouldReduceMotion) => ({
  enter: {
    scale: 1,
    y: 0,
    opacity: 1,
    transition: {
      duration: shouldReduceMotion ? 0 : 0.2
    }
  },
  exit: {
    scale: 0,
    y: -100,
    opacity: 0,
    transition: {
      duration: shouldReduceMotion ? 0 : 0.6
    }
  }
})
