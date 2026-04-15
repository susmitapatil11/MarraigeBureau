export const pageVariants = {
  initial: { opacity: 0, y: 10, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -8, filter: "blur(6px)" }
};

export const pageTransition = {
  type: "spring",
  stiffness: 110,
  damping: 18,
  mass: 0.7
};

