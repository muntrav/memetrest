import React from "react";
import Image from "next/image";

type AppImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

export function AppImage({
  src,
  alt,
  className,
  sizes = "100vw",
  width = 1200,
  height = 1600,
  priority = false
}: AppImageProps) {
  return (
    <Image
      alt={alt}
      className={className}
      height={height}
      priority={priority}
      sizes={sizes}
      src={src}
      width={width}
    />
  );
}
