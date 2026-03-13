import Loader from "@/components/loader";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { toast } from "sonner-native";

const HomeTab = () => {
  const [phases, setPhases] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [userLevel, setUserLevel] = useState<any>(null);
  const { userData, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!userData) return;
    fetchPhases();
  }, [authLoading]);

  const fetchPhases = async () => {
    const { data, error } = await supabase.from("phases").select("*");

    const { data: userLevel, error: userError } = await supabase
      .from("users")
      .select("should_phase")
      .eq("u_id", userData.uId);

    if (error) {
      toast.error("fetching phases error", {
        description: error.message,
      });
      return;
    }

    if (userError) {
      toast.error("fetching user level error", {
        description: userError.message,
      });
    }

    setPhases(data);
    setUserLevel(userLevel);
    setLoading(false);
  };

  const renderItem = (item: any) => {
    return (
      <View className="bg-slate-200 my-2 rounded-xl">
        <View className="h-56 flex justify-center items-center">
          <Text className="font-enBold text-2xl">{item.item.title}</Text>
        </View>
        <View className="p-6 bg-white rounded-xl">
          <View className="flex flex-row justify-between items-center">
            <Text className="font-enBold text-xl">
              Phase number {item.item.phase_number}
            </Text>
            {userLevel[0].should_phase >= item.item.phase_number ? (
              <Pressable className="p-3 bg-green-500 flex justify-center items-center rounded-full">
                <Image
                  cachePolicy={"disk"}
                  source={require("@/assets/icons/play.png")}
                  style={{
                    height: 25,
                    width: 25,
                  }}
                />
              </Pressable>
            ) : (
              <Pressable className="p-3 bg-zinc-100 flex justify-center items-center rounded-full">
                <Image
                  cachePolicy={"disk"}
                  source={require("@/assets/icons/lock.png")}
                  style={{
                    height: 25,
                    width: 25,
                  }}
                />
              </Pressable>
            )}
          </View>
          <View className="flex flex-row gap-x-2">
            <View className="flex flex-row items-center gap-x-1 p-1 px-2 bg-slate-100 rounded-full">
              <Image
                cachePolicy={"disk"}
                source={require("@/assets/icons/fire.png")}
                style={{
                  height: 15,
                  width: 15,
                }}
              />
              <Text className="font-enBold">+5</Text>
            </View>
            <View className="flex flex-row items-center gap-x-1 p-1 px-2 bg-slate-100 rounded-full">
              <Image
                cachePolicy={"disk"}
                source={require("@/assets/icons/bolt.png")}
                style={{
                  height: 15,
                  width: 15,
                }}
              />
              <Text className="font-enBold">+5</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        paddingHorizontal: 20,
      }}
    >
      {loading ? (
        <View className="h-full justify-center items-center">
          <Loader />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={phases}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default HomeTab;
