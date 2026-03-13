import Loader from "@/components/loader";
import { useModal } from "@/contexts/modal-context";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { toast } from "sonner-native";

const HomeTab = () => {
  const [phases, setPhases] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [userLevel, setUserLevel] = useState<any>(null);
  const { userData, loading: authLoading } = useAuth();
  const { openModal, closeModal } = useModal();
  const [toolTipVisible, setToolTipVisible] = useState(false);

  const map = useRef(null);

  useEffect(() => {
    if (!userData) return;
    fetchPhases();
    setRefresh(false);
  }, [authLoading, refresh]);

  const fetchPhases = async () => {
    const { data, error } = await supabase
      .from("phases")
      .select("*")
      .order("id", {
        ascending: true,
      });

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
    // map?.current?.scrollToEnd({ animated: true });
  };

  const renderItem = (item: any) => {
    return (
      <View className="my-2">
        <View className="bg-slate-200 rounded-xl">
          <View className="h-56 flex justify-center items-center">
            <Text className="font-enBold text-2xl">{item.item.title}</Text>
          </View>
          <View className="p-6 bg-white rounded-xl">
            <View className="flex flex-row justify-between items-center">
              <Text className="font-enBold text-xl">
                Phase number {item.item.phase_number}
              </Text>
              {userLevel[0]?.should_phase >= item.item.phase_number ? (
                <Pressable
                  onPress={() => startPhase(item.item.id)}
                  className="p-3 bg-green-500 flex justify-center items-center rounded-full"
                >
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
                <Text className="font-enBold">+{item.item.bonus}</Text>
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
                <Text className="font-enBold">+1</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const startPhase = (phaseId: number) => {
    // openModal(<Phase phaseId={phaseId} />);
    router.push("/story/" + phaseId);
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
          onRefresh={() => setRefresh(true)}
          refreshing={refresh}
          ref={map}
        />
      )}
    </View>
  );
};

export default HomeTab;
