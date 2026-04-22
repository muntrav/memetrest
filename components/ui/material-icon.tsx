import React, { type CSSProperties, type ReactNode } from "react";

type MaterialIconProps = {
  children: ReactNode;
  className?: string;
  filled?: boolean;
  weight?: number;
  style?: CSSProperties;
};

export function MaterialIcon({
  children,
  className,
  filled = false,
  weight = 400,
  style
}: MaterialIconProps) {
  return (
    <span
      className={["material-symbols-outlined", className].filter(Boolean).join(" ")}
      style={
        {
          ...style,
          "--ms-fill": filled ? 1 : 0,
          "--ms-wght": weight
        } as CSSProperties
      }
    >
      {children}
    </span>
  );
}
