import { useModal } from "@/contexts/modal-context";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { toast } from "sonner-native";

const EditProfileContent = () => {
  const { loading, userData, updateLocalData } = useAuth();
  const { closeModal } = useModal();
  const [apiLoading, setApiLoading] = useState(false);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (!userData) return;
    setFullName(userData.fullName);
  }, [userData]);

  const handleSaveNewChanges = async () => {
    const { error } = await supabase
      .from("users")
      .update({
        full_name: fullName,
      })
      .eq("u_id", userData?.uId);

    if (error) {
      toast.error(error.message);
      return;
    }
    updateLocalData(fullName);
    closeModal();
  };

  return (
    <View className="p-6 flex-1">
      <View className="flex-1">
        <View>
          <Text className="text-secondary font-enBold text-2xl">Full name</Text>
          <View className="my-2">
            <TextInput
              mode="outlined"
              className="rounded-lg"
              cursorColor="#5b71ff"
              outlineColor="#1f3252ff"
              activeOutlineColor="#5b71ff"
              textColor="#1f3252ff"
              disabled={loading || apiLoading}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
          <Text className="font-enRegular text-secondary text-sm">
            <Text className="text-lg font-enBold text-primary">Note : </Text>
            This full name will be public in events and seen by others.
          </Text>
        </View>
      </View>
      <View className="mb-4">
        <Button
          disabled={loading || apiLoading}
          loading={apiLoading}
          mode="contained"
          buttonColor="#5b71ff"
          onPress={handleSaveNewChanges}
        >
          <Text className="font-enBold">Save changes</Text>
        </Button>
      </View>
    </View>
  );
};

export default EditProfileContent;
