import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    findNodeHandle,
    Pressable,
    Text,
    UIManager,
    View,
} from "react-native";
import { Button } from "react-native-paper";
import Tooltip, { Placement } from "react-native-tooltip-2";

const WordTooltip = ({
  text,
  saveWord,
}: {
  text: string;
  saveWord: (text: string) => void;
}) => {
  const [toolTipVisible, setToolTipVisible] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [placement, setPlacement] = useState<Placement>(Placement.TOP);
  const [buttonLoading, setButtonLoading] = useState(false);

  const pressableRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation;

    if (isLoading) {
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseAnimation.start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }

    return () => {
      if (pulseAnimation) {
        pulseAnimation.stop();
      }
    };
  }, [isLoading]);

  const translateText = async (text: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(text)}`,
      );
      const data = await res.json();
      const translation = data[0][0][0];
      setTranslatedText(translation);
    } catch (error) {
      console.error("Translation error:", error);
      setTranslatedText("Translation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateOptimalPlacement = () => {
    return new Promise<void>((resolve) => {
      if (pressableRef.current) {
        const handle = findNodeHandle(pressableRef.current);
        if (handle) {
          UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
            const screenHeight = Dimensions.get("window").height;
            const screenWidth = Dimensions.get("window").width;

            const tooltipHeight = 200;
            const tooltipWidth = 250;
            const margin = 10;

            const spaceAbove = pageY - margin;
            const spaceBelow = screenHeight - (pageY + height) - margin;
            const spaceLeft = pageX - margin;
            const spaceRight = screenWidth - (pageX + width) - margin;

            if (spaceAbove >= tooltipHeight) {
              setPlacement(Placement.TOP);
            } else if (spaceBelow >= tooltipHeight) {
              setPlacement(Placement.BOTTOM);
            } else if (spaceLeft >= tooltipWidth) {
              setPlacement(Placement.LEFT);
            } else if (spaceRight >= tooltipWidth) {
              setPlacement(Placement.RIGHT);
            } else {
              setPlacement(Placement.TOP);
            }

            resolve();
          });
        } else {
          resolve();
        }
      } else {
        resolve();
      }
    });
  };

  const handlePress = async () => {
    if (!toolTipVisible) {
      await calculateOptimalPlacement();

      if (!translatedText) {
        await translateText(text);
      }
      setToolTipVisible(true);
    }
  };

  const handleClose = () => {
    setButtonLoading(false);
    setToolTipVisible(false);
  };

  return (
    <View>
      <Tooltip
        isVisible={toolTipVisible}
        content={
          <View style={{ padding: 16, width: 250 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 22,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "english-bold",
                  color: "#1f3252ff",
                }}
              >
                {text}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "arabic-bold",
                  color: "#5b71ff",
                  textAlign: "right",
                }}
              >
                {translatedText}
              </Text>
            </View>

            <Button
              onPress={() => {
                setButtonLoading(true);
                const savePayload = {
                  englishText: text,
                  arabicText: translatedText,
                };
                saveWord(JSON.stringify(savePayload));
                handleClose();
              }}
              mode="contained"
              loading={buttonLoading}
              disabled={buttonLoading}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "english-bold",
                  fontSize: 12,
                }}
              >
                Save to List
              </Text>
            </Button>
          </View>
        }
        placement={placement}
        onClose={handleClose}
        backgroundColor="rgba(0,0,0,0.5)"
        contentStyle={{
          borderRadius: 12,
          backgroundColor: "white",
          padding: 0,
        }}
        displayInsets={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Pressable
          ref={pressableRef}
          onPress={handlePress}
          disabled={isLoading}
        >
          <Animated.Text
            style={[
              {
                fontSize: 27,
                fontFamily: "english-regular",
              },
              isLoading && {
                opacity: pulseAnim,
                color: "#5b71ff",
              },
            ]}
          >
            {text}{" "}
          </Animated.Text>
        </Pressable>
      </Tooltip>
    </View>
  );
};

export default WordTooltip;
