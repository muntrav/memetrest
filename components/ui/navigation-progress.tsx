"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    // Start progress bar when pathname changes
    setIsVisible(true);
    setProgress(10);

    intervalId = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 30;
      });
    }, 500);

    // Complete progress bar after a delay
    timeoutId = setTimeout(() => {
      setProgress(100);

      const hideTimeoutId = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 300);

      return () => {
        clearTimeout(hideTimeoutId);
      };
    }, 800);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-1 bg-gradient-to-r from-primary via-primary-container to-secondary transition-all duration-300"
      style={{
        width: `${progress}%`
      }}
    />
  );
}
