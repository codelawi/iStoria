import theme from "@/theme/public-theme";
import { Stack } from "expo-router";
import { ThemeProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <ThemeProvider theme={theme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ThemeProvider>
  );
}
