import { useActions } from "@/hooks/use-actions";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { Button, Switch } from "react-native-paper";

const ProfileTab = () => {
  const { loading, userData, isAuthenticated, deleteAccount } = useAuth();
  const { state, toggleHaptics, toggleSound } = useActions();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      console.log(error);
      return;
    }

    console.log(data);
  };
  return (
    <View className="p-6 gap-y-4">
      <View className="p-5 bg-primary/5 rounded-xl gap-y-8">
        {/* HAPTICS */}
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-x-4">
            <Image
              cachePolicy="disk"
              source={require("@/assets/icons/wave.png")}
              style={{ width: 25, height: 25 }}
            />

            <Text className="font-enBold text-secondary text-xl">
              Vibrations
            </Text>
          </View>

          <Switch
            value={state.hapticsState}
            onValueChange={toggleHaptics}
            className="border border-secondary rounded-full"
          />
        </View>

        {/* SOUND */}
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-x-4">
            <Image
              cachePolicy="disk"
              source={require("@/assets/icons/sound.png")}
              style={{ width: 25, height: 25 }}
            />

            <Text className="font-enBold text-secondary text-xl">Sounds</Text>
          </View>

          <Switch
            value={state.soundState}
            onValueChange={toggleSound}
            className="border border-secondary rounded-full"
          />
        </View>
      </View>
      <View className="p-5 bg-primary/5 rounded-xl gap-y-8">
        {/* Delete account */}
        <View>
          <Button
            mode="contained"
            buttonColor="red"
            onPress={() => {
              deleteAccount();
            }}
          >
            <Text className="font-enBold">Delete account</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default ProfileTab;
