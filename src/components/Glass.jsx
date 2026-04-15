import React from "react";

export function Glass({ as: As = "div", className = "", children, ...props }) {
  return (
    <As className={`glass glassSubtle ${className}`} {...props}>
      {children}
    </As>
  );
}

