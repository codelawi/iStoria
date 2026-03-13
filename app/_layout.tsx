// RootLayout.jsx
import { ModalProvider } from "@/contexts/modal-context";
import {
  ThemeProviderContext,
  useThemeContext,
} from "@/contexts/theme-context";
import "@/theme/global.css";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "react-native-paper";
import { Toaster } from "sonner-native";

function AppContent() {
  const { theme } = useThemeContext(); // get current theme from context

  return (
    <ThemeProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProviderContext>
        <ModalProvider>
          <AppContent />
          <Toaster />
        </ModalProvider>
      </ThemeProviderContext>
    </GestureHandlerRootView>
  );
}
