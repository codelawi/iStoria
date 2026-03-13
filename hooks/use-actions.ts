import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const useActions = () => {
  const [soundState, setSoundState] = useState(false);
  const [hapticsState, setHapticsState] = useState(false);

  useEffect(() => {
    fetchLocalData();
  }, []);

  const fetchLocalData = async () => {
    try {
      const currentSoundState = await AsyncStorage.getItem(
        "bottomNavigation-sound-state",
      );

      const currentHapticsState = await AsyncStorage.getItem(
        "bottomNavigation-haptics-state",
      );

      setSoundState(currentSoundState === "on");
      setHapticsState(currentHapticsState === "on");
    } catch (error) {
      console.log("Storage read error:", error);
    }
  };

  const toggleSound = async () => {
    try {
      const next = !soundState;

      await AsyncStorage.setItem(
        "bottomNavigation-sound-state",
        next ? "on" : "off",
      );

      setSoundState(next);
    } catch (error) {
      console.log("Storage write error:", error);
    }
  };

  const toggleHaptics = async () => {
    try {
      const next = !hapticsState;

      await AsyncStorage.setItem(
        "bottomNavigation-haptics-state",
        next ? "on" : "off",
      );

      setHapticsState(next);
    } catch (error) {
      console.log("Storage write error:", error);
    }
  };

  return {
    state: {
      soundState,
      hapticsState,
    },
    toggleSound,
    toggleHaptics,
  };
};
