import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { toast } from "sonner-native";

const WordsTab = () => {
  const [words, setWords] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const wordsKeys = allKeys.filter((keys) => keys.includes("words"));
      const wordsPairs = await AsyncStorage.multiGet(wordsKeys);

      // Convert the key-value pairs to a more usable format
      const words = wordsPairs.map(([key, value]) => ({
        id: key.replace("words-", ""), // Extract the ID from the key
        word: value ? JSON.parse(value) : null, // Parse the JSON string
      }));

      setWords(words.filter((item) => item.word !== null)); // Remove any null items
    } catch (e) {
      toast.error("Error fetching words");
      console.log(e);
    } finally {
      setLoading(false);
      setRefreshing(false); // Always set refreshing to false when done
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWords();
  };

  const renderItem = ({ item }: any) => {
    return (
      <View className="bg-white p-6 rounded-xl my-2">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-2xl font-enBold">{item.word.englishText}</Text>
          <Text className="text-2xl font-arBold text-primary">
            {item.word.arabicText}
          </Text>
        </View>
        <View className="flex flex-row items-center justify-between mt-6">
          <Button mode="outlined">
            <Text className="font-enBold">Remove</Text>
          </Button>
          <Button mode="contained">
            <Text className="font-enBold">Learned</Text>
          </Button>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <FlatList
        data={words}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-gray-500 font-enBold">
              No words saved yet
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default WordsTab;
