import { useState } from "react";

/**
 * Custom hook for toggling password visibility
 * Returns the visibility state and toggle function
 */
export const usePasswordToggle = (initialState = false) => {
  const [isVisible, setIsVisible] = useState(initialState);

  const toggle = () => setIsVisible((prev) => !prev);

  return {
    isVisible,
    toggle,
    type: isVisible ? "text" : "password",
  };
};
