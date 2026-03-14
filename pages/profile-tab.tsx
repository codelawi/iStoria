import EditProfileContent from "@/components/contents/edit-profile-content";
import { useModal } from "@/contexts/modal-context";
import { useActions } from "@/hooks/use-actions";
import { useAuth } from "@/hooks/use-auth";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Button, IconButton, Switch } from "react-native-paper";

const ProfileTab = () => {
  // userData {fullName , uId}
  const [fullName, setFullName] = useState("Loading...");
  const { userData, deleteAccount, loading } = useAuth();
  const { state, toggleHaptics, toggleSound } = useActions();
  const { openModal } = useModal();
  const [userStats, setUserStats] = useState({
    storiesRead: 0,
    wordsSaved: 0,
    daysActive: 0,
  });

  useEffect(() => {
    fetchUserStats();
    if (!userData) return;
    setFullName(userData.fullName);
  }, [loading]);

  const openEditNamePage = () => {
    openModal(<EditProfileContent />);
  };

  const fetchUserStats = async () => {
    // This would typically come from your backend
    // For now, using mock data
    setUserStats({
      storiesRead: 12,
      wordsSaved: 45,
      daysActive: 23,
    });
  };

  return (
    <ScrollView className="flex-1 ">
      <View className="p-6 gap-y-4">
        {/* User Info Section */}
        <View className="p-5 bg-primary/5 rounded-xl gap-y-4">
          <View className="flex flex-row items-center gap-x-4">
            <View className="w-16 h-16 bg-primary/20 rounded-full items-center justify-center">
              <Text className="text-3xl font-enBold text-primary">
                {fullName?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <View className="flex-1">
              <View className="flex flex-row items-center justify-between">
                <Text className="font-enBold text-2xl text-secondary">
                  {fullName}
                </Text>
                <IconButton onPress={openEditNamePage} icon={"account-edit"} />
              </View>
              <Text className="font-en text-gray-500 text-sm">
                Member since {new Date().getFullYear()}
              </Text>
            </View>
          </View>

          {/* Stats Row */}
          <View className="flex flex-row justify-around mt-2">
            <View className="items-center">
              <Text className="font-enBold text-xl text-primary">
                {userStats.storiesRead}
              </Text>
              <Text className="font-en text-gray-500 text-sm">Stories</Text>
            </View>
            <View className="items-center">
              <Text className="font-enBold text-xl text-primary">
                {userStats.wordsSaved}
              </Text>
              <Text className="font-en text-gray-500 text-sm">Words</Text>
            </View>
            <View className="items-center">
              <Text className="font-enBold text-xl text-primary">
                {userStats.daysActive}
              </Text>
              <Text className="font-en text-gray-500 text-sm">Days</Text>
            </View>
          </View>
        </View>

        {/* App Preferences */}
        <View className="p-5 bg-primary/5 rounded-xl gap-y-8">
          <Text className="font-enBold text-lg text-secondary mb-2">
            Preferences
          </Text>

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

        {/* App Information */}
        <View className="p-5 bg-primary/5 rounded-xl gap-y-4">
          <Text className="font-enBold text-lg text-secondary mb-2">About</Text>

          <View className="flex flex-row items-center justify-between">
            <Text className="font-en text-gray-600">App Version</Text>
            <Text className="font-enBold text-secondary">1.0.0</Text>
          </View>

          <View className="flex flex-row items-center justify-between">
            <Text className="font-en text-gray-600">Language</Text>
            <Text className="font-enBold text-secondary">English</Text>
          </View>

          <Button mode="text" className="mt-2">
            <Text className="font-enBold text-primary">Privacy Policy</Text>
          </Button>

          <Button mode="text">
            <Text className="font-enBold text-primary">Terms of Service</Text>
          </Button>
        </View>

        {/* Account Actions */}
        <View className="p-5 bg-primary/5 rounded-xl gap-y-4">
          <Text className="font-enBold text-lg text-secondary mb-2">
            Account
          </Text>

          {/* Delete account */}
          <Button mode="contained" buttonColor="red" onPress={deleteAccount}>
            <Text className="font-enBold text-white">Delete Account</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileTab;
