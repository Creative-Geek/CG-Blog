import { THEME_CONFIG } from "~/config/constants";

/**
 * Apply theme configuration to CSS custom properties
 * This allows users to customize accent colors through constants.ts
 */
export function applyThemeConfig() {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  
  // Apply light mode accent colors
  root.style.setProperty("--accent-primary", THEME_CONFIG.accentColor);
  root.style.setProperty("--accent-secondary", THEME_CONFIG.accentColorSecondary);
  root.style.setProperty("--accent-hover", THEME_CONFIG.accentColor.replace(/(\d+)%\)$/, (match, lightness) => 
    `${parseInt(lightness) - 10}%)`
  ));
  
  // Apply dark mode accent colors
  const darkModeRule = `[data-theme="dark"] {
    --accent-primary: ${THEME_CONFIG.accentColorDark};
    --accent-secondary: ${THEME_CONFIG.accentColorSecondaryDark};
    --accent-hover: ${THEME_CONFIG.accentColorDark.replace(/(\d+)%\)$/, (match, lightness) => 
      `${parseInt(lightness) - 10}%)`
    )};
  }`;
  
  // Check if style element already exists
  let styleElement = document.getElementById("theme-config-styles");
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = "theme-config-styles";
    document.head.appendChild(styleElement);
  }
  
  styleElement.textContent = darkModeRule;
}

/**
 * Get current accent color based on theme
 */
export function getAccentColor(variant: "primary" | "secondary" | "hover" = "primary"): string {
  if (typeof window === "undefined") {
    return variant === "primary" ? THEME_CONFIG.accentColor : THEME_CONFIG.accentColorSecondary;
  }
  
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  
  switch (variant) {
    case "primary":
      return isDark ? THEME_CONFIG.accentColorDark : THEME_CONFIG.accentColor;
    case "secondary":
      return isDark ? THEME_CONFIG.accentColorSecondaryDark : THEME_CONFIG.accentColorSecondary;
    case "hover":
      const baseColor = isDark ? THEME_CONFIG.accentColorDark : THEME_CONFIG.accentColor;
      return baseColor.replace(/(\d+)%\)$/, (match, lightness) => 
        `${parseInt(lightness) - 10}%)`
      );
    default:
      return isDark ? THEME_CONFIG.accentColorDark : THEME_CONFIG.accentColor;
  }
}
