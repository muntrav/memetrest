"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type NavigationContextType = {
  isNavigating: boolean;
};

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false
});

export function useNavigation() {
  return useContext(NavigationContext);
}

export function NavigationProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsNavigating(true);
    const handleStop = () => setIsNavigating(false);

    // Listen for navigation start
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = function (...args) {
      setIsNavigating(true);
      return originalPush.apply(router, args);
    };

    router.replace = function (...args) {
      setIsNavigating(true);
      return originalReplace.apply(router, args);
    };

    // The loading state will be cleared when the page renders
    return () => {
      // Cleanup is not needed as router methods are reassigned
    };
  }, [router]);

  return (
    <NavigationContext.Provider value={{ isNavigating }}>
      {children}
    </NavigationContext.Provider>
  );
}
