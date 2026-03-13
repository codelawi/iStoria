import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import Svg, { Circle } from "react-native-svg";

const Loader = () => {
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Svg width={40} height={40} viewBox="0 0 40 40">
        {/* track */}
        <Circle
          cx="20"
          cy="20"
          r="17.5"
          stroke="black"
          strokeWidth="5"
          opacity={0.1}
          fill="none"
        />

        {/* car */}
        <Circle
          cx="20"
          cy="20"
          r="17.5"
          stroke="#5b71ff"
          strokeWidth="5"
          strokeDasharray="25 75"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </Animated.View>
  );
};

export default Loader;
