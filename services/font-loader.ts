import * as Font from "expo-font";
export const loadFonts = async () => {
  await Font.loadAsync({
    "arabic-bold": require("../assets/fonts/Tajawal-Bold.ttf"),
    "arabic-regular": require("../assets/fonts/Tajawal-Regular.ttf"),
    "arabic-light": require("../assets/fonts/Tajawal-Light.ttf"),
    "english-bold": require("../assets/fonts/Nunito-Bold.ttf"),
    "english-regular": require("../assets/fonts/Nunito-Regular.ttf"),
  });
};
