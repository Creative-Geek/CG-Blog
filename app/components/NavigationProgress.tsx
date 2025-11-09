import { useEffect, useState } from "react";
import { useNavigation } from "react-router";

export function NavigationProgress() {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (navigation.state === "loading") {
      setIsVisible(true);
      setProgress(0);

      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev; // Stop at 90%
          return prev + Math.random() * 10;
        });
      }, 300);

      return () => clearInterval(interval);
    } else if (navigation.state === "idle") {
      // Complete the progress
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 300);
    }
  }, [navigation.state]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-opacity duration-300 ease-out"
      style={{
        width: `${progress}%`,
        opacity: progress === 100 ? 0 : 1,
        transition:
          "width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out",
      }}
    />
  );
}
