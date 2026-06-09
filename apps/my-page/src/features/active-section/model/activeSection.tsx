"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type ScrollFn = (id: string) => void;

type ActiveSectionContextType = {
  activeSection: string;
  setActiveSection: (id: string) => void;
  scrollToSection: ScrollFn;
  registerScrollToSection: (fn: ScrollFn) => void;
};

const ActiveSectionContext = createContext<ActiveSectionContextType>({
  activeSection: "hero",
  setActiveSection: () => {},
  scrollToSection: () => {},
  registerScrollToSection: () => {},
});

export function ActiveSectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSection] = useState("hero");
  const scrollFnRef = useRef<ScrollFn | null>(null);

  const registerScrollToSection = useCallback((fn: ScrollFn) => {
    scrollFnRef.current = fn;
  }, []);

  const scrollToSection = useCallback((id: string) => {
    scrollFnRef.current?.(id);
  }, []);

  return (
    <ActiveSectionContext.Provider
      value={{
        activeSection,
        setActiveSection,
        scrollToSection,
        registerScrollToSection,
      }}
    >
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSection() {
  return useContext(ActiveSectionContext);
}
