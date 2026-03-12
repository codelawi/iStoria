import { DefaultTheme } from "react-native-paper";

const theme = {
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

export default theme;
