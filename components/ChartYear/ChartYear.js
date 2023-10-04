import { Animated, StyleSheet, View } from "react-native";
import * as Animatable from "react-native-animatable";
import {
  currentYear,
  heightOfScreen,
  widthOfScreen,
} from "../../constants/ConstantMain";
import {
  Column,
  HStack,
  NativeBaseProvider,
  VStack,
  Divider,
} from "native-base";
import { Text } from "react-native";

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
  console.log(value_Cal);
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
    <View style={styles.boxChart}>
      <HStack alignItems={"flex-end"} justifyContent={"center"} h={200}>
        {data.map((item, index) => {
          return (
            <VStack key={index}>
              <Text style={{ textAlign: "center" }}>
                {item.value.toLocaleString("vi-VN", {
                  maximumFractionDigits: 6,
                  style: "currency",
                  currency: "VND",
                })}
              </Text>
              <Animatable.View
                animation={fadeIn(item.value * value_Cal)}
                duration={2000}
                style={[
                  styles.columnView,
                  {
                    width: widthOfScreen * 0.2,
                    backgroundColor:
                      index === data.length - 1 ? "#F25F33" : "#009087",
                  },
                ]}
              ></Animatable.View>
              <Text
                style={{ textAlign: "center", position: "relative", bottom: 0 }}
              >
                {item.year}
              </Text>
            </VStack>
          );
        })}
        <Divider
          style={{
            width: widthOfScreen * data.length * 0.3,
            height: 3,
            position: "absolute",
            bottom: 16,
            backgroundColor: "#009087",
          }}
        ></Divider>
      </HStack>
    </View>
  );
}
const styles = StyleSheet.create({
  listColumn: {
    borderBottomWidth: 2,
    paddingHorizontal: 20,
    borderBottomColor: "#009087",
  },
  columnView: {
    marginRight: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});

export default ChartYear;