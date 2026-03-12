import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeTab = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={["top"]}
    >
      <Text className="p-2 bg-red-100">Home Tab</Text>
    </SafeAreaView>
  );
};

export default HomeTab;
