import { DefaultTheme, MD3DarkTheme } from "react-native-paper";

const lightTheme = {
  ...DefaultTheme,
  roundness: 12, // Adjust the roundness of components
  colors: {
    ...DefaultTheme.colors,
    primary: "#5b71ff", // Main color
    accent: "#f1c40f", // Optional accent color
    background: "#ffffff", // App background
    surface: "#f5f5f5", // Cards, sheets, etc.
    text: "#1a1a1a", // Default text color
    placeholder: "#a0a0a0", // Placeholder color
    notification: "#ff5252", // Badge / notifications
  },
};

const darkTheme = {
  ...MD3DarkTheme, // You can also extend DefaultTheme if you want
  roundness: 12,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#5b71ff",
    accent: "#f1c40f",
    background: "#121212",
    surface: "#1e1e1e",
    text: "#ffffff",
    placeholder: "#888888",
    notification: "#ff5252",
  },
};

export default { lightTheme, darkTheme };
