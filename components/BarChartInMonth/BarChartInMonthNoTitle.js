import { HStack, Text, VStack, View } from "native-base";
import { memo, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import { primaryColor } from "../../constants/ConstantStyle";
import NoData from "../NoData/NoData";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { useRenderCount } from "@uidotdev/usehooks";
import { formatMoneyToVN } from "../../constants/ConstantFunc";
import { MainContext } from "../../screens/MainContext";
function BarChartInMonthNoTitle({
  dataOrigin,
  data,
  titleUnit = "Triệu",
  showTitleUnit = false,
  colorInteger,
  colorNegative,
  sizeIcon = 150,
}) {
  const maxValue = Math.max(...dataOrigin);
  const minValue = Math.min(...dataOrigin);
  const totalValue = Math.abs(maxValue) + Math.abs(minValue);
  const [objShowChart, setObjShowChart] = useState();
  const [lineHeight, setLineHeight] = useState();
  const [heightInforChart, setHeightInforChart] = useState(0);
  const animateHeight = (height) => {
    return {
      from: {
        height: "0%",
      },
      to: {
        height: `${height}%`,
      },
    };
  };
  useEffect(() => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const totalValue = Math.abs(maxValue) + Math.abs(minValue);
    const coordinateAxisY =
      Math.abs(maxValue <= 0 ? minValue : maxValue) / totalValue;
    const heightIntegerPercent = coordinateAxisY * 100;
    setObjShowChart({ maxValue, minValue, heightIntegerPercent, data });
  }, [data]);
  const handleShowMoney = (lineHeight) => {
    const value =
      minValue < 0 ? (maxValue < 0 ? minValue : totalValue) : maxValue;
    const a = value / heightInforChart;
    const currentMoney = a * lineHeight;
    if (lineHeight == undefined) {
      return maxValue;
    }
    if (minValue < 0) {
      const absMin = Math.abs(minValue);
      if (maxValue < 0) {
        if (lineHeight === 0) {
          return minValue;
        }
        if (lineHeight === heightInforChart) {
          return 0;
        }
        return minValue - currentMoney;
      } else {
        if (lineHeight === 0) {
          return minValue;
        }
        if (lineHeight === heightInforChart) {
          return maxValue;
        }
        if (currentMoney < absMin) {
          return minValue + currentMoney;
        } else {
          return currentMoney - absMin;
        }
      }
    }
    return currentMoney;
  };
  const position = useSharedValue(heightInforChart);
  const arrayNumberAsc = Array.from({ length: 12 }, (_, index) => index + 1);
  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = position.value;
    },
    onActive: (event, ctx) => {
      position.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      if (position.value > heightInforChart) {
        position.value = withTiming(heightInforChart, { duration: 100 });
        runOnJS(setLineHeight)(0);
      } else if (position.value <= 0) {
        position.value = withTiming(0, { duration: 100 });
        runOnJS(setLineHeight)(heightInforChart);
      } else {
        runOnJS(setLineHeight)(heightInforChart - position.value);
      }
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(position.value) }],
    };
  });
  return (
    objShowChart && (
      <VStack alignItems={"center"} justifyContent={"space-between"} flex={1}>
        {showTitleUnit && (
          <Text
            position={"absolute"}
            fontSize="sm"
            right={0}
            italic
            fontWeight={500}
          >
            Đơn vị ({titleUnit})
          </Text>
        )}

        {/* hiển thị các thông tin của sơ đồ */}
        <VStack justifyContent={"flex-start"} flex={1} width={"100%"}>
          <View
            position={"absolute"}
            width={"100%"}
            height={"100%"}
            left={0}
            zIndex={1000}
            onLayout={(e) => {
              setHeightInforChart(e.nativeEvent.layout.height);
            }}
          >
            {data.reduce((prev, current) => {
              return prev + current;
            }, 0) != 0 && (
              <PanGestureHandler onHandlerStateChange={panGestureHandler}>
                <Animated.View style={[animatedStyle]}>
                  <VStack top={-25}>
                    <Text
                      fontSize="xs"
                      textAlign={"right"}
                      lineHeight={30}
                      height={25}
                    >
                      {formatMoneyToVN(handleShowMoney(lineHeight), "đ")}
                    </Text>
                    <View
                      style={{
                        borderWidth: 1,
                        width: "100%",
                        borderStyle: "dashed",
                      }}
                      zIndex={100}
                    />
                  </VStack>
                </Animated.View>
              </PanGestureHandler>
            )}
          </View>
          {/* Giá trị tăng */}
          {objShowChart.maxValue > 0 && (
            <HStack
              alignItems={"flex-end"}
              space={0.5}
              style={{
                height: `${
                  (objShowChart.maxValue > 0 && objShowChart.minValue > 0) ||
                  objShowChart.maxValue === objShowChart.minValue
                    ? 100
                    : objShowChart.heightIntegerPercent
                }%`,
              }}
              width={"100%"}
              borderBottomWidth={1}
              borderColor={primaryColor}
            >
              {arrayNumberAsc.map((item, index) => {
                const height =
                  (objShowChart.data[index] / objShowChart.maxValue) * 100;
                return (
                  <VStack
                    key={index}
                    alignItems={"center"}
                    // width={`${100 / 12.8}%`}
                    maxHeight={"100%"}
                    flex={1}
                  >
                    {/* {height > 0 && (
                      <Text
                        textAlign={"center"}
                        fontSize="xs"
                        width={16}
                        top={-20}
                        position={"absolute"}
                        zIndex={10}
                      >
                        {objShowChart.data[index]}
                      </Text>
                    )} */}
                    <Animatable.View
                      animation={animateHeight(height)}
                      style={{
                        zIndex: 1,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        width: `100%`,
                        height: `${height}%`,
                        backgroundColor: colorInteger
                          ? Array.isArray(colorInteger)
                            ? colorInteger[index % colorInteger.length]
                            : colorInteger
                          : primaryColor,
                        minHeight: objShowChart.maxValue <= 0 ? 0 : 0.3,
                        opacity: objShowChart.data[index] === 0 ? 0.2 : 1,
                      }}
                    ></Animatable.View>
                  </VStack>
                );
              })}
            </HStack>
          )}
          {/* Giá trị giảm */}
          {objShowChart.minValue != 0 && (
            <HStack
              alignItems={"flex-start"}
              space={0.5}
              style={{
                width: "100%",
                height:
                  objShowChart.maxValue <= 0
                    ? "100%"
                    : `${100 - objShowChart.heightIntegerPercent}%`,
              }}
              borderTopWidth={1}
              borderColor={"#dc2626"}
            >
              {arrayNumberAsc.map((item, index) => {
                const height =
                  (objShowChart.data[index] / Math.abs(objShowChart.minValue)) *
                  100;

                return (
                  <VStack
                    key={index}
                    alignItems={"center"}
                    width={`${100 / 12.8}%`}
                    maxHeight={"100%"}
                    flex={1}
                  >
                    <Animatable.View
                      animation={animateHeight(-height)}
                      style={{
                        borderBottomLeftRadius: 5,
                        borderBottomRightRadius: 5,
                        height: `${-height}%`,
                        width: `100%`,
                        backgroundColor: colorNegative
                          ? Array.isArray(colorNegative)
                            ? colorNegative[index % colorNegative.length]
                            : colorNegative
                          : "#dc2626",
                        zIndex: 100,
                        minHeight: objShowChart.minValue >= 0 ? 0 : 0.5,
                        opacity: objShowChart.data[index] === 0 ? 0.2 : 1,
                      }}
                    ></Animatable.View>
                    {/* {height < 0 && (
                      <Text
                        textAlign={"center"}
                        fontSize="xs"
                        width={16}
                        bottom={-20}
                        position={"absolute"}
                        zIndex={10}
                      >
                        {-objShowChart.data[index]}
                      </Text>
                    )} */}
                  </VStack>
                );
              })}
            </HStack>
          )}
          {/* tất cả giá trị bằng 0 */}
          {objShowChart.minValue === 0 && objShowChart.maxValue === 0 && (
            <HStack
              alignItems={"center"}
              space={0.5}
              style={{
                height: `100%`,
                width: "100%",
              }}
              borderBottomWidth={1}
              borderColor={primaryColor}
            >
              <NoData sizeIcon={sizeIcon} />
            </HStack>
          )}
        </VStack>
        {/* hiển thi label 12 tháng  */}
        <View w={"100%"}>
          <HStack
            alignItems={"center"}
            justifyContent={"flex-start"}
            space={0.5}
            width={"100%"}
            // borderColor={objShowChart.minValue >= 0 && primaryColor}
            style={
              objShowChart.minValue >= 0
                ? styles.integerBox
                : styles.negativeIntegersBox
            }
          >
            {arrayNumberAsc.map((item, index) => {
              return (
                <View flex={1} key={index} paddingY={1}>
                  <Text fontSize={"sm"} bold textAlign={"center"}>
                    {item}
                  </Text>
                </View>
              );
            })}
          </HStack>
        </View>
      </VStack>
    )
  );
}
const styles = StyleSheet.create({
  integerBox: {
    borderTopWidth: 0,
    borderColor: primaryColor,
  },
  negativeIntegersBox: {
    borderTopWidth: 1,
  },
});
export default memo(BarChartInMonthNoTitle);
