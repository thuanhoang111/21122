import { HStack, Pressable, Text, View } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ScrollView } from "react-native";
import { widthOfScreen } from "../../constants/ConstantMain";
import { useState, useEffect, useContext } from "react";
import { AntDesign } from "@expo/vector-icons";
function Pagination({ currentValue, lengthData, callBack, quantityItem }) {
  const maxPage = Math.ceil(lengthData / quantityItem);
  // Initialize the array incrementally with the previously calculated number of maxPage
  const listNumber = Array.from({ length: maxPage }, (_, index) => index + 1);
  const [ref, setRef] = useState(null);
  const [dataSourceCords, setDataSourceCords] = useState([]);
  // the function will be called then the value changes and scroll to the appropriate position
  const onChangeValue = () => {
    ref &&
      ref.scrollTo({
        x: dataSourceCords[currentValue - 3],
        y: 0,
      });
  };
  useEffect(() => {
    onChangeValue();
  }, [currentValue]);

  const handleChangePage = (numberPage) => {
    callBack(numberPage);
  };
  return (
    <HStack
      alignItems={"center"}
      justifyContent={"flex-end"}
      maxW={widthOfScreen * 0.61}
      minW={200}
    >
      {/* Button choice first Page */}
      <Pressable
        Pressable
        onPress={() => handleChangePage(1)}
        overflow="hidden"
        opacity={0.5}
        disabled={currentValue - 1 > 0 ? false : true}
      >
        {({ isHovered, isFocused, isPressed }) => {
          return (
            <View
              p={1}
              bg={isPressed ? "#d1d5db" : isHovered ? "#d1d5db" : "#f2f2f2"}
            >
              <AntDesign
                name="doubleleft"
                size={16}
                color={currentValue - 1 > 0 ? "#333335" : "#d4d4d5"}
              />
            </View>
          );
        }}
      </Pressable>
      {/* Button choice previous Page */}
      <Pressable
        Pressable
        onPress={() => handleChangePage(currentValue - 1)}
        overflow="hidden"
        opacity={0.5}
        disabled={currentValue - 1 > 0 ? false : true}
      >
        {({ isHovered, isFocused, isPressed }) => {
          return (
            <View
              bg={isPressed ? "#d1d5db" : isHovered ? "#d1d5db" : "#f2f2f2"}
            >
              <MaterialIcons
                name="keyboard-arrow-left"
                size={25}
                color={currentValue - 1 > 0 ? "#333335" : "#d4d4d5"}
              />
            </View>
          );
        }}
      </Pressable>
      {/* Button number pagez */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={(ref) => setRef(ref)}
      >
        {listNumber.map((item) => {
          return (
            <Pressable
              onPress={() => handleChangePage(item)}
              overflow="visible"
              key={item}
              onLayout={(event) => {
                const layout = event.nativeEvent.layout;
                dataSourceCords[item - 1] = layout.x;
                setDataSourceCords(dataSourceCords);
              }}
            >
              {({ isHovered, isFocused, isPressed }) => {
                return (
                  <View
                    paddingX={2}
                    paddingY={1}
                    bg={
                      currentValue != item
                        ? isPressed
                          ? "#d1d5db"
                          : isHovered
                          ? "#d1d5db"
                          : "#f2f2f2"
                        : "#e5e5e6"
                    }
                  >
                    <Text
                      color={
                        currentValue !== item
                          ? isPressed
                            ? "#ffffff"
                            : isHovered
                            ? "#ffffff"
                            : "#171717"
                          : "#ea1a15"
                      }
                    >
                      {item}
                    </Text>
                  </View>
                );
              }}
            </Pressable>
          );
        })}
      </ScrollView>
      {/* Button choice next Page */}
      <Pressable
        Pressable
        onPress={() => handleChangePage(currentValue + 1)}
        overflow="hidden"
        opacity={0.5}
        disabled={currentValue + 1 <= maxPage ? false : true}
      >
        {({ isHovered, isFocused, isPressed }) => {
          return (
            <View
              bg={isPressed ? "#d1d5db" : isHovered ? "#d1d5db" : "#f2f2f2"}
            >
              <MaterialIcons
                name="keyboard-arrow-right"
                size={25}
                color={currentValue + 1 <= maxPage ? "#333335" : "#d4d4d5"}
              />
            </View>
          );
        }}
      </Pressable>
      {/* Button choice last Page */}
      <Pressable
        Pressable
        onPress={() => handleChangePage(maxPage)}
        overflow="hidden"
        opacity={0.5}
        disabled={currentValue + 1 <= maxPage ? false : true}
      >
        {({ isHovered, isFocused, isPressed }) => {
          return (
            <View
              p={1}
              bg={isPressed ? "#d1d5db" : isHovered ? "#d1d5db" : "#f2f2f2"}
            >
              <AntDesign
                name="doubleright"
                size={16}
                color={currentValue + 1 <= maxPage ? "#333335" : "#d4d4d5"}
              />
            </View>
          );
        }}
      </Pressable>
    </HStack>
  );
}

export default Pagination;
