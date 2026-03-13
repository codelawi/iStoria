import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import * as React from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import EventsTab from "@/pages/events-tab";
import HomeTab from "@/pages/home-tab";
import ProfileTab from "@/pages/profile-tab";
import WordsTab from "@/pages/words-tab";

const homeIcon = require("@/assets/icons/list.png");
const eventsIcon = require("@/assets/icons/rank.png");
const wordsIcon = require("@/assets/icons/words.png");
const profileIcon = require("@/assets/icons/user.png");

const routes = [
  { key: "home", title: "Home", icon: "list" },
  { key: "events", title: "Events", icon: "rank" },
  { key: "words", title: "Words", icon: "words" },
  { key: "profile", title: "Profile", icon: "user" },
];

const iconMap = {
  home: homeIcon,
  events: eventsIcon,
  words: wordsIcon,
  profile: profileIcon,
};

const TabScreens: Record<string, React.ComponentType> = {
  home: HomeTab,
  events: EventsTab,
  words: WordsTab,
  profile: ProfileTab,
};

const CustomBottomTabs = () => {
  const [index, setIndex] = React.useState(0);

  const { width } = Dimensions.get("window");
  const tabWidth = width / routes.length;

  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  const soundRef = React.useRef(null);

  // Load sound once
  React.useEffect(() => {
    let sound;
    const loadSound = async () => {
      const { sound: loadedSound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/click.mp3"),
      );
      sound = loadedSound;
      soundRef.current = loadedSound;
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync(); // fast replay
      }
    } catch (e) {
      console.warn("Sound play error:", e);
    }
  };

  const animateToTab = (newIndex) => {
    // Slide indicator
    translateX.value = withTiming(newIndex * tabWidth, {
      duration: 210,
      easing: Easing.inOut(Easing.ease),
    });

    // Pop animation
    scale.value = withTiming(1.2, { duration: 100 }, () => {
      scale.value = withTiming(1, { duration: 100 });
    });

    setIndex(newIndex);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      {/* Header */}
      <View className="p-4 flex flex-row items-center gap-x-3 justify-between">
        <View className="flex flex-row items-center gap-x-4">
          <Image
            cachePolicy={"disk"}
            source={require("@/assets/icons/fire.png")}
            style={{ width: 35, height: 35 }}
          />
          <Text className="font-enBold text-2xl">12</Text>
        </View>

        <View className="flex flex-row items-center gap-x-4">
          <Image
            cachePolicy={"disk"}
            source={require("@/assets/icons/bolt.png")}
            style={{ width: 35, height: 35 }}
          />
          <Text className="font-enBold text-2xl">12</Text>
        </View>
      </View>

      {/* All Screens Mounted */}
      <View style={{ flex: 1 }}>
        {routes.map((route, idx) => {
          const Screen = TabScreens[route.key];
          return (
            <View
              key={route.key}
              style={{ flex: 1, display: index === idx ? "flex" : "none" }}
            >
              <Screen />
            </View>
          );
        })}
      </View>

      {/* Bottom Tab Bar */}
      <View
        style={{
          height: 120,
          flexDirection: "row",
          backgroundColor: "#fff",
          position: "relative",
        }}
      >
        {routes.map((route, idx) => (
          <Pressable
            key={route.key}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={async () => {
              Haptics.impactAsync();
              playSound();
              animateToTab(idx);
            }}
          >
            <Image
              cachePolicy="disk"
              source={iconMap[route.key]}
              style={{
                width: 28,
                height: 28,
                marginBottom: 10,
                tintColor: index === idx ? "#5b71ff" : "#1f3252ff",
              }}
            />
            <Text
              style={{
                color: index === idx ? "#5b71ff" : "#1f3252ff",
                fontWeight: "bold",
                fontFamily: "english-bold",
                zIndex: 2,
              }}
            >
              {route.title}
            </Text>
          </Pressable>
        ))}

        {/* Sliding + Pop Indicator */}
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: 0,
              width: tabWidth,
              height: 100,
              justifyContent: "center",
              alignItems: "center",
            },
            animatedStyle,
          ]}
        >
          <View
            style={{
              backgroundColor: "#5b71ff48",
              width: 70,
              height: 40,
              borderRadius: 100,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 50,
            }}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default CustomBottomTabs;
