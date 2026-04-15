import React from "react";
import { motion } from "framer-motion";

const base = "fmsBtn";
const styles = {
  primary: "fmsBtnPrimary",
  secondary: "fmsBtnSecondary",
  ghost: "fmsBtnGhost"
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
      className={`${base} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function IconButton({ className = "", children, ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
      className={`fmsIconBtn ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

