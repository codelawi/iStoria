import { Image } from "expo-image";
import React, { createContext, useContext, useState } from "react";
import { Modal, Text, View } from "react-native";
import { IconButton } from "react-native-paper";

type ModalContextType = {
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useGlobalModal must be used inside ModalProvider");
  return ctx;
};

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);

  const openModal = (node: React.ReactNode) => {
    setContent(node);
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
    setContent(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeModal}
      >
        <View style={{ flex: 1, paddingTop: 40 }}>
          <View className="flex flex-row items-center justify-between p-6">
            <IconButton icon={"close"} onPress={closeModal} />
            <View className="flex flex-row items-center gap-x-4">
              <View className="flex flex-row items-center gap-x-2">
                <Image
                  cachePolicy={"disk"}
                  source={require("@/assets/icons/fire.png")}
                  style={{ width: 25, height: 25 }}
                />
                <Text className="font-enBold text-xl">12</Text>
              </View>

              <View className="flex flex-row items-center gap-x-2">
                <Image
                  cachePolicy={"disk"}
                  source={require("@/assets/icons/bolt.png")}
                  style={{ width: 25, height: 25 }}
                />
                <Text className="font-enBold text-xl">12</Text>
              </View>
            </View>
          </View>
          {content}
        </View>
      </Modal>
    </ModalContext.Provider>
  );
};
