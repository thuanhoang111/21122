import { useContext, useState } from "react";
import {
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Controller, useForm } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import {
  HStack,
  Heading,
  Pressable,
  Switch,
  Text,
  VStack,
  View,
} from "native-base";
import { MainContext } from "../../screens/MainContext";
import {
  primaryColor,
  primaryColorLight,
  grey,
} from "../../constants/ConstantStyle";
function FinancialReportFilter({ inforPermission, onSearch }) {
  // Initialize the array of increasing numbers
  const arrayNumberAsc = Array.from({ length: 12 }, (_, index) => index + 1);
  // Displays month or quarter selection
  const [isSelectMonth, setIsSelectMonth] = useState(true);
  const mainContext = useContext(MainContext);
  const isIos = mainContext.isIos;
  const inforFilter = mainContext.inforFilter;
  const lastPermissionYear = mainContext.lastPermissionYear;
  const { control, reset, getValues } = useForm({
    defaultValues: {
      year: inforFilter.year || lastPermissionYear,
      startMonth: inforFilter.startMonth || 1,
      endMonth: inforFilter.endMonth || 12,
    },
  });
  /**
   * handle Submit When click button "Xác nhận"
   * Call function (onSearch) is passed from parent Component
   */
  const onSubmit = async () => {
    mainContext.onChangeLoading(true);
    let data = getValues();
    await onSearch(data.year, data.startMonth, data.endMonth);
    mainContext.onChangeLoading(false);
  };
  return (
    <VStack
      height={"100%"}
      justifyContent={"space-between"}
      backgroundColor={"#fff"}
    >
      <VStack safeAreaTop={8} backgroundColor={"#f1f1f1"}>
        <Heading px={2} textAlign={"left"} size={"md"} fontWeight={500} py={4}>
          Bộ lọc thông tin
        </Heading>
        <KeyboardAvoidingView behavior="position">
          <VStack px={2} py={3} backgroundColor={"#fff"}>
            {/* year */}
            <HStack
              marginTop={2}
              alignItems={"center"}
              justifyContent={"space-between"}
              paddingLeft={2}
              space={2}
            >
              <Text fontSize={16}>Năm:</Text>
              <HStack
                flex={1}
                style={styles.pickBox}
                borderWidth={!isIos && 1}
                rounded={"2xl"}
              >
                <View width={"100%"}>
                  <Controller
                    control={control}
                    rules={{
                      maxLength: 100,
                    }}
                    render={({ field: { onChange, value } }) => {
                      const currentIndex = inforPermission.findIndex((item) => {
                        return item.year === value;
                      });
                      return (
                        <HStack alignItems={"center"}>
                          <Picker
                            itemStyle={{ height: 50, fontSize: 15 }}
                            style={{ flex: 1 }}
                            shouldRasterizeIOS
                            selectedValue={value}
                            onValueChange={(itemValue) => onChange(itemValue)}
                            dropdownIconColor={"#fff"}
                            dropdownIconRippleColor={"#fff"}
                          >
                            {inforPermission &&
                              inforPermission.map((item, index) => {
                                return (
                                  <Picker.Item
                                    key={index}
                                    label={item.year.toString()}
                                    value={item.year}
                                  />
                                );
                              })}
                          </Picker>
                          <VStack position={"absolute"} right={"10%"}>
                            <TouchableOpacity
                              disabled={currentIndex == 0 || false}
                              onPress={({}) => {
                                onChange(
                                  inforPermission[currentIndex - 1].year
                                );
                              }}
                            >
                              <AntDesign
                                name="caretup"
                                size={15}
                                style={{
                                  opacity: currentIndex == 0 ? 0.1 : 1,
                                }}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              disabled={
                                currentIndex == inforPermission.length - 1 ||
                                false
                              }
                              onPress={({}) => {
                                onChange(
                                  inforPermission[currentIndex + 1].year
                                );
                              }}
                            >
                              <AntDesign
                                name="caretdown"
                                size={15}
                                style={{
                                  opacity:
                                    currentIndex == inforPermission.length - 1
                                      ? 0.1
                                      : 1,
                                }}
                              />
                            </TouchableOpacity>
                          </VStack>
                        </HStack>
                      );
                    }}
                    name="year"
                  ></Controller>
                </View>
              </HStack>
            </HStack>
            {/* //month or quarter */}
            <VStack justifyContent={"center"}>
              <HStack alignItems={"center"}>
                <Text fontSize={16} paddingX={2}>
                  Quý
                </Text>
                <Switch
                  size={"sm"}
                  offTrackColor={"#0ea5e9"}
                  onTrackColor={"#22c55e"}
                  isChecked={isSelectMonth}
                  colorScheme="primary"
                  onToggle={() => {
                    reset();
                    setIsSelectMonth(!isSelectMonth);
                  }}
                />
                <Text fontSize={16} paddingX={2}>
                  Tháng
                </Text>
              </HStack>

              <HStack
                marginTop={2}
                alignItems={"center"}
                justifyContent={"space-around"}
              >
                {isSelectMonth ? (
                  <>
                    <HStack
                      width={"48%"}
                      borderWidth={!isIos && 1}
                      rounded={"2xl"}
                      style={styles.pickBox}
                    >
                      <View width={"100%"}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <HStack alignItems={"center"}>
                                <Picker
                                  itemStyle={{
                                    height: 50,
                                    fontSize: 15,
                                  }}
                                  dropdownIconColor={"#fff"}
                                  dropdownIconRippleColor={"#fff"}
                                  style={{ flex: 1 }}
                                  shouldRasterizeIOS
                                  selectedValue={value}
                                  onValueChange={(itemValue) =>
                                    onChange(itemValue)
                                  }
                                  dropdownIconColor={"#fff"}
                                  dropdownIconRippleColor={"#fff"}
                                  // enabled={isIos}
                                >
                                  {arrayNumberAsc.map((item, index) => {
                                    return (
                                      <Picker.Item
                                        style={{ fontSize: 15 }}
                                        key={index}
                                        label={`Tháng ${item}`}
                                        value={item}
                                      />
                                    );
                                  })}
                                </Picker>
                                <VStack position={"absolute"} right={"10%"}>
                                  <TouchableOpacity
                                    disabled={
                                      value <= arrayNumberAsc[0] || false
                                    }
                                    onPress={() => {
                                      onChange(arrayNumberAsc[value - 2]);
                                    }}
                                  >
                                    <AntDesign
                                      name="caretup"
                                      size={15}
                                      style={{
                                        opacity:
                                          value <= arrayNumberAsc[0] ? 0.1 : 1,
                                      }}
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    disabled={
                                      value >= arrayNumberAsc.at(-1) || false
                                    }
                                    onPress={() => {
                                      onChange(arrayNumberAsc[value]);
                                    }}
                                  >
                                    <AntDesign
                                      name="caretdown"
                                      size={15}
                                      style={{
                                        opacity:
                                          value >= arrayNumberAsc.at(-1)
                                            ? 0.1
                                            : 1,
                                      }}
                                    />
                                  </TouchableOpacity>
                                </VStack>
                              </HStack>
                            );
                          }}
                          name="startMonth"
                        />
                      </View>
                    </HStack>
                    <Ionicons
                      name="arrow-forward-outline"
                      size={15}
                      style={{ marginHorizontal: 1 }}
                    />
                    <HStack
                      rounded={"2xl"}
                      style={styles.pickBox}
                      width={"48%"}
                      borderWidth={!isIos && 1}
                    >
                      <View width={"100%"}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <HStack alignItems={"center"}>
                                <Picker
                                  itemStyle={{ height: 50, fontSize: 15 }}
                                  style={{ flex: 1 }}
                                  shouldRasterizeIOS
                                  dropdownIconColor={"#fff"}
                                  dropdownIconRippleColor={"#fff"}
                                  selectedValue={value}
                                  onValueChange={(itemValue) =>
                                    onChange(itemValue)
                                  }

                                  // enabled={isIos}
                                >
                                  {arrayNumberAsc.map((item, index) => {
                                    return (
                                      <Picker.Item
                                        style={{ fontSize: 15 }}
                                        key={index}
                                        label={`Tháng ${item}`}
                                        value={item}
                                      />
                                    );
                                  })}
                                </Picker>
                                <VStack position={"absolute"} right={"10%"}>
                                  <TouchableOpacity
                                    disabled={
                                      value <= arrayNumberAsc[0] || false
                                    }
                                    onPress={() => {
                                      onChange(arrayNumberAsc[value - 2]);
                                    }}
                                  >
                                    <AntDesign
                                      name="caretup"
                                      size={15}
                                      style={{
                                        opacity:
                                          value <= arrayNumberAsc[0] ? 0.1 : 1,
                                      }}
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    disabled={
                                      value >= arrayNumberAsc.at(-1) || false
                                    }
                                    onPress={() => {
                                      onChange(arrayNumberAsc[value]);
                                    }}
                                  >
                                    <AntDesign
                                      name="caretdown"
                                      size={15}
                                      style={{
                                        opacity:
                                          value >= arrayNumberAsc.at(-1)
                                            ? 0.1
                                            : 1,
                                      }}
                                    />
                                  </TouchableOpacity>
                                </VStack>
                              </HStack>
                            );
                          }}
                          name="endMonth"
                        />
                      </View>
                    </HStack>
                  </>
                ) : (
                  <>
                    <HStack
                      width={"48%"}
                      borderWidth={!isIos && 1}
                      rounded={"2xl"}
                      style={styles.pickBox}
                    >
                      <View width={"100%"}>
                        <Controller
                          control={control}
                          rules={{
                            required: true,
                          }}
                          render={({ field: { onChange, onBlur, value } }) => {
                            return (
                              <HStack alignItems={"center"}>
                                <Picker
                                  itemStyle={{
                                    height: 50,
                                    fontSize: 15,
                                  }}
                                  style={{ flex: 1 }}
                                  shouldRasterizeIOS
                                  selectedValue={value}
                                  onValueChange={(itemValue) =>
                                    onChange(itemValue)
                                  }
                                  dropdownIconColor={"#fff"}
                                  dropdownIconRippleColor={"#fff"}
                                >
                                  {arrayNumberAsc.map((item, index) => {
                                    return (
                                      item % 3 == 0 && (
                                        <Picker.Item
                                          key={index}
                                          label={`Quý ${Math.ceil(item / 3)}`}
                                          value={item - 2}
                                        />
                                      )
                                    );
                                  })}
                                </Picker>
                                <VStack position={"absolute"} right={"10%"}>
                                  <TouchableOpacity
                                    disabled={
                                      value == arrayNumberAsc[0] || false
                                    }
                                    onPress={() => {
                                      onChange(value - 3);
                                    }}
                                  >
                                    <AntDesign
                                      name="caretup"
                                      size={15}
                                      style={{
                                        opacity:
                                          value == arrayNumberAsc[0] ? 0.1 : 1,
                                      }}
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    disabled={value == 10 || false}
                                    onPress={() => {
                                      onChange(value + 3);
                                    }}
                                  >
                                    <AntDesign
                                      name="caretdown"
                                      size={15}
                                      style={{
                                        opacity: value == 10 ? 0.1 : 1,
                                      }}
                                    />
                                  </TouchableOpacity>
                                </VStack>
                              </HStack>
                            );
                          }}
                          name="startMonth"
                        />
                      </View>
                    </HStack>
                    <Ionicons
                      name="arrow-forward-outline"
                      size={15}
                      style={{ marginHorizontal: 1 }}
                    />
                    <HStack
                      width={"48%"}
                      borderWidth={!isIos && 1}
                      rounded={"2xl"}
                      style={styles.pickBox}
                    >
                      <View width={"100%"}>
                        <Controller
                          control={control}
                          rules={{
                            required: true,
                          }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <HStack alignItems={"center"}>
                              <Picker
                                itemStyle={{ height: 50, fontSize: 15 }}
                                style={{ flex: 1 }}
                                shouldRasterizeIOS
                                selectedValue={value}
                                onValueChange={(itemValue) =>
                                  onChange(itemValue)
                                }
                                dropdownIconColor={"#fff"}
                                dropdownIconRippleColor={"#fff"}
                              >
                                {arrayNumberAsc.map((item, index) => {
                                  return (
                                    item % 3 == 0 && (
                                      <Picker.Item
                                        key={index}
                                        label={`Quý ${Math.ceil(item / 3)}`}
                                        value={item}
                                      />
                                    )
                                  );
                                })}
                              </Picker>
                              <VStack position={"absolute"} right={"10%"}>
                                <TouchableOpacity
                                  disabled={value == 3 || false}
                                  onPress={() => {
                                    onChange(value - 3);
                                  }}
                                >
                                  <AntDesign
                                    name="caretup"
                                    size={15}
                                    style={{
                                      opacity: value == 3 ? 0.1 : 1,
                                    }}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  disabled={
                                    value == arrayNumberAsc.at(-1) || false
                                  }
                                  onPress={() => {
                                    onChange(value + 3);
                                  }}
                                >
                                  <AntDesign
                                    name="caretdown"
                                    size={15}
                                    style={{
                                      opacity:
                                        value == arrayNumberAsc.at(-1)
                                          ? 0.1
                                          : 1,
                                    }}
                                  />
                                </TouchableOpacity>
                              </VStack>
                            </HStack>
                          )}
                          name="endMonth"
                        />
                      </View>
                    </HStack>
                  </>
                )}
              </HStack>
            </VStack>
          </VStack>
        </KeyboardAvoidingView>
      </VStack>
      <HStack
        borderTopWidth={0.5}
        position={"absolute"}
        backgroundColor={"#fff"}
        bottom={0}
        p={2}
        justifyContent={"space-between"}
        alignItems={"center"}
        w={"100%"}
      >
        <Pressable
          w={"48%"}
          onPress={() => {
            reset();
          }}
        >
          {({ isHovered, isFocused, isPressed }) => {
            return (
              <View
                paddingY={3}
                borderRadius={5}
                borderWidth={1}
                borderColor={
                  isPressed
                    ? primaryColorLight
                    : isHovered
                    ? primaryColorLight
                    : primaryColor
                }
                backgroundColor={isPressed ? grey : isHovered ? grey : "#fff"}
              >
                <Text color={primaryColor} textAlign={"center"} fontSize={16}>
                  Đặt lại
                </Text>
              </View>
            );
          }}
        </Pressable>
        <Pressable
          w={"48%"}
          onPress={() => {
            onSubmit();
          }}
        >
          {({ isHovered, isFocused, isPressed }) => {
            return (
              <View
                paddingY={3}
                borderRadius={5}
                borderWidth={1}
                borderColor={primaryColor}
                backgroundColor={
                  isPressed
                    ? primaryColorLight
                    : isHovered
                    ? primaryColorLight
                    : primaryColor
                }
              >
                <Text color={"white"} textAlign={"center"} fontSize={16}>
                  Xác nhận
                </Text>
              </View>
            );
          }}
        </Pressable>
      </HStack>
    </VStack>
  );
}
const styles = StyleSheet.create({
  pickBox: {
    alignItems: "center",
    borderColor: grey,
  },
});
export default FinancialReportFilter;
