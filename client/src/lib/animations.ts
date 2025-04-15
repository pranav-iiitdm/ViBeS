import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

export const staggerChildren: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const slideIn: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  },
  exit: { 
    x: 20, 
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

export const scaleUp: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  },
  exit: { 
    scale: 0.95, 
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};