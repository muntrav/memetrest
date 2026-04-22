"use client";

const navigationProgressStartEvent = "memetrest:navigation-progress-start";

export function emitNavigationProgressStart() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(navigationProgressStartEvent));
}

export function getNavigationProgressStartEvent() {
  return navigationProgressStartEvent;
}
