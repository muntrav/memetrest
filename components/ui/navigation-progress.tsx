"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getNavigationProgressStartEvent } from "@/lib/navigation-progress";

export function NavigationProgress() {
  const pathname = usePathname();
  const routeKey = pathname;
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRouteRef = useRef(routeKey);
  const currentRouteRef = useRef(routeKey);

  useEffect(() => {
    currentRouteRef.current = routeKey;
  }, [routeKey]);

  useEffect(() => {
    function clearTimers() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      if (startTimeoutRef.current) {
        clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }
    }

    function startProgress() {
      clearTimers();
      pendingRouteRef.current = currentRouteRef.current;
      setIsVisible(true);
      setProgress(14);

      intervalRef.current = setInterval(() => {
        setProgress((current) => {
          if (current >= 88) {
            return current;
          }

          return Math.min(current + 12, 88);
        });
      }, 120);
    }

    function handleHistoryNavigation() {
      startTimeoutRef.current = setTimeout(startProgress, 0);
    }

    const startEvent = getNavigationProgressStartEvent();

    window.addEventListener(startEvent, startProgress);
    window.addEventListener("popstate", handleHistoryNavigation);

    return () => {
      clearTimers();
      window.removeEventListener(startEvent, startProgress);
      window.removeEventListener("popstate", handleHistoryNavigation);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    if (pendingRouteRef.current === routeKey) {
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setProgress(100);

    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      hideTimeoutRef.current = null;
      setProgress(0);
    }, 180);

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [isVisible, routeKey]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[9999] h-1 bg-gradient-to-r from-primary via-primary-container to-secondary transition-[width,opacity] duration-200"
      style={{
        opacity: isVisible ? 1 : 0,
        width: `${progress}%`
      }}
    />
  );
}
