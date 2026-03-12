import { Image } from "expo-image";
import * as React from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";

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

  const animateToTab = (newIndex: number) => {
    // Slide indicator
    translateX.value = withTiming(newIndex * tabWidth, {
      duration: 210,
      easing: Easing.inOut(Easing.ease),
    });

    // Pop animation
    scale.value = withTiming(1.2, { duration: 100 }, () => {
      scale.value = withTiming(1, { duration: 100 });
    });

    // Update index state
    setIndex(newIndex);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  const ActiveScreen = TabScreens[routes[index].key];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ActiveScreen />
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
            onPress={() => animateToTab(idx)}
          >
            <Image
              cachePolicy="disk"
              source={iconMap[route.key]}
              style={{
                width: 28,
                height: 28,
                marginBottom: 10,
                tintColor: index === idx ? "#5b71ff" : "#888",
              }}
            />
            <Text
              style={{
                color: index === idx ? "#5b71ff" : "#888",
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
    </View>
  );
};

export default CustomBottomTabs;
