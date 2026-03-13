import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import Loader from "@/components/loader";
import WordTooltip from "@/components/word-tooltip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const Phase = () => {
  const [loading, setLoading] = useState(true);
  const [chapters, setChapters] = useState<any>([]);
  const phaseId = useLocalSearchParams().id;
  const [wordIconStyle, setWordIconStyle] = useState({
    width: 30,
    height: 30,
  });
  const [totalWords, setTotalWords] = useState(0);

  useEffect(() => {
    fetchStory();
  }, []);

  const generateRandomId = (): string => {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const length = 6; // ce352s is 6 characters

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }

    return result;
  };

  const fetchStory = async () => {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("phase_id", phaseId)
      .order("chapter_number", { ascending: true });

    if (error) {
      toast.error("Error fetching story", { description: error.message });
      return;
    }

    setChapters(data || []);
    setLoading(false);
  };

  const saveWordAnimation = () => {
    Haptics.notificationAsync();
    setWordIconStyle({
      width: 40,
      height: 40,
    });

    setTimeout(() => {
      setWordIconStyle({
        width: 30,
        height: 30,
      });
      setTotalWords(totalWords + 1);
    }, 200);
  };

  const saveWord = (payload: string) => {
    saveWordAnimation();
    AsyncStorage.setItem(`words-${generateRandomId()}`, payload).then(() => {
      //toast.success("word saved to word list!");
    });
  };

  if (loading) {
    return (
      <View className="flex-1 flex justify-center items-center gap-y-4">
        <Loader />
        <Text className="text-primary font-enBold">Loading story</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top"]}>
      <View className="flex flex-row pl-4 pr-6 items-center justify-between">
        <IconButton
          icon={"arrow-left"}
          size={30}
          onPress={() => router.back()}
        />

        <View className="flex flex-row items-center gap-x-2">
          <Image
            style={{
              width: wordIconStyle.width,
              height: wordIconStyle.height,
            }}
            source={require("@/assets/icons/book-primary.png")}
          />
          <Text className="font-enBold text-lg">{totalWords}</Text>
        </View>
      </View>
      <ScrollView className="p-8">
        {chapters.map((chapter: any) => {
          // Split chapter text into words
          const words = chapter.text.split(/\s+/);

          return (
            <View key={chapter.id} className="mb-24">
              <Text className="font-enBold text-4xl mb-2">
                Chapter {chapter.chapter_number}
              </Text>
              <Text>
                {words.map((word: any, index: any) => (
                  <WordTooltip saveWord={saveWord} text={word} key={index} />
                ))}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Phase;
