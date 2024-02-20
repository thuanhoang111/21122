import { HStack, Text, VStack, View, Divider } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import { primaryColor } from "../../constants/ConstantStyle";
import NoData from "../NoData/NoData";
function BarChartInMonth({
  data,
  titleUnit = "Triệu",
  showTitleUnit = false,
  colorInteger,
  colorNegative,
  sizeIcon = 150,
}) {
  const [objShowChart, setObjShowChart] = useState();

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
  const arrayNumberAsc = Array.from({ length: 12 }, (_, index) => index + 1);
  return (
    objShowChart && (
      <VStack alignItems={"center"} justifyContent={"space-between"} flex={1}>
        {showTitleUnit && (
          <Text
            position={"absolute"}
            fontSize="sm"
            bottom={-20}
            right={0}
            italic
            fontWeight={500}
          >
            Đơn vị ({titleUnit})
          </Text>
        )}
        <View style={{ height: 20 }}></View>
        {/* hiển thị các thông tin của sơ đồ */}
        <VStack justifyContent={"flex-start"} flex={1}>
          {/* Giá trị tăng */}
          {objShowChart.maxValue > 0 && (
            <HStack
              alignItems={"flex-end"}
              space={0.5}
              style={{
                height: `${
                  (objShowChart.maxValue > 0 && objShowChart.minValue > 0) ||
                  objShowChart.maxValue === objShowChart.minValue
                    ? "100%"
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
                    {height > 0 && (
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
                    )}
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
                    {height < 0 && (
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
                    )}
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
        <HStack
          alignItems={"center"}
          space={0.5}
          width={"100%"}
          // borderColor={objShowChart.minValue >= 0 && primaryColor}
          marginTop={objShowChart.minValue >= 0 ? 0 : 6}
          style={
            objShowChart.minValue >= 0
              ? styles.integerBox
              : styles.negativeIntegersBox
          }
        >
          {arrayNumberAsc.map((item, index) => {
            return (
              <View flex={1} key={index}>
                <Text fontSize={"sm"} bold textAlign={"center"}>
                  {item}
                </Text>
              </View>
            );
          })}
        </HStack>
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
export default BarChartInMonth;
