import { Animated, StyleSheet, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { widthOfScreen } from "../../constants/ConstantMain";
import { HStack, VStack, Divider } from "native-base";
import { Text } from "react-native";
import { formatMoneyToVN } from "../../constants/ConstantFunc";
import { currentTimeColor, primaryColor } from "../../constants/ConstantStyle";

/**
 * Author:ThuanHoang 20/06/2023
 * Component handle and show data of each year
 * @param {Array} data
 */
function ChartYear({ data }) {
  //cal value max in list data to handle view chart
  let max_val = data.reduce(function (accumulator, element) {
    return accumulator.value > element.value ? accumulator : element;
  });

  let value_Cal = max_val.value == 0 ? 0 : 200 / max_val.value;
  const fadeIn = (maxHeight) => {
    return {
      from: {
        height: 0,
      },
      to: {
        height: maxHeight,
      },
    };
  };
  return (
    <HStack
      alignItems={"flex-end"}
      justifyContent={"center"}
      minHeight={250}
      flex={1}
    >
      {data.map((item, index) => {
        return (
          <VStack key={index} alignItems={"center"}>
            <Text style={{ textAlign: "center", paddingBottom: 5 }}>
              {formatMoneyToVN(item.value, "đ")}
            </Text>
            <Animatable.View
              animation={fadeIn(item.value * value_Cal)}
              duration={2000}
              style={[
                styles.columnView,
                {
                  width: widthOfScreen * 0.2,
                  backgroundColor:
                    index === data.length - 1 ? currentTimeColor : primaryColor,
                },
              ]}
            ></Animatable.View>
            <Text
              style={{
                textAlign: "center",
                position: "relative",
                bottom: 0,
                height: 20,
              }}
            >
              {item.year}
            </Text>
          </VStack>
        );
      })}
      <Divider
        style={{
          width: "80%",
          height: 3,
          position: "absolute",
          bottom: 20,
          backgroundColor: primaryColor,
        }}
      ></Divider>
    </HStack>
  );
}
const styles = StyleSheet.create({
  listColumn: {
    borderBottomWidth: 2,
    paddingHorizontal: 20,
    borderBottomColor: primaryColor,
  },
  columnView: {
    marginRight: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});

export default ChartYear;
