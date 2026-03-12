import { loadFonts } from "@/services/font-loader";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        await loadFonts();
        setFontsLoaded(true);
        router.replace("/(tabs)"); // Navigate once fonts are loaded
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    };

    load();
  }, []);

  if (!fontsLoaded) {
    // Optional: show a small loader instead of blank screen
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5b71ff" />
      </View>
    );
  }

  return null; // This will never be visible since we navigate on fontsLoaded
}
