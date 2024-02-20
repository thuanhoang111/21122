import { Picker, PickerIOS } from "@react-native-picker/picker";
import {
  HStack,
  Heading,
  Input,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Switch,
  Text,
  VStack,
  View,
} from "native-base";
import { useContext, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from "react-native";

import AntDesign from "react-native-vector-icons/AntDesign";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Controller, useForm } from "react-hook-form";
import {
  convertDateTimeToString,
  convertStringToDateTime,
  showDatePickerAndroid,
} from "../../constants/ConstantFunc";
import { MainContext } from "../../screens/MainContext";
const currentDate = new Date();
import {
  primaryColor,
  primaryColorLight,
  grey,
  whiteColor,
} from "../../constants/ConstantStyle";
function IOInventoryFilter({
  inforPermission,
  onSearch,
  inforSearch,
  productionCode,
  onSearchAgain,
}) {
  const mainContext = useContext(MainContext);
  const inforFilter = mainContext.inforFilter;
  const isIos = mainContext.isIos;
  // The last year in which the user has access
  const lastPermissionYear = mainContext.lastPermissionYear;
  // initialize the array of increasing numbers
  const arrayNumberAsc = Array.from({ length: 12 }, (_, index) => index + 1);
  // Displays month or quarter selection
  const [isSelectMonth, setIsSelectMonth] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { control, reset, getValues } = useForm({
    defaultValues: {
      year: inforFilter.year || lastPermissionYear,
      warehouse: inforFilter.warehouse || "",
      accountType: inforFilter.accountType || "",
      unitType: inforFilter.unitType || "",
      productionCode: productionCode || "",
      productionName: inforFilter.productionName || "",
      startMonth: inforFilter.startMonth || 1,
      endMonth: inforFilter.endMonth || 12,
      startDay: inforFilter.startDay
        ? convertStringToDateTime(inforFilter.startDay, "DD/MM/yyyy")
        : currentDate,
      endDay: inforFilter.endDay
        ? convertStringToDateTime(inforFilter.endDay, "DD/MM/yyyy")
        : currentDate,
    },
  });
  const handleReSearch = async () => {
    let data = getValues();
    setRefreshing(true);
    await onSearchAgain(data.year || inforFilter.year || lastPermissionYear);
    setRefreshing(false);
  };
  const onSubmit = async () => {
    mainContext.onChangeLoading(true);
    let data = getValues();
    data.endDay = convertDateTimeToString(data.endDay, "DD/MM/yyyy");
    data.startDay = convertDateTimeToString(data.startDay, "DD/MM/yyyy");
    if (!isSelectMonth) {
      data.startMonth = 0;
      data.endMonth = 0;
    }
    await onSearch(
      data.year,
      data.warehouse,
      data.accountType,
      data.unitType,
      data.productionCode,
      data.productionName,
      data.startMonth,
      data.endMonth,
      data.startDay,
      data.endDay
    );
    this.IOInventoryTableRef.scrollToOffset({ animated: true, offset: 0 });
  };

  return (
    <SafeAreaView>
      <VStack
        backgroundColor={"#fff"}
        justifyContent={"space-between"}
        height={"100%"}
      >
        <View flex={10}>
          <View px={2} py={4} backgroundColor={"#f1f1f1"}>
            <Heading textAlign={"left"} size={"md"} fontWeight={500}>
              Bộ lọc thông tin
            </Heading>
          </View>
          <KeyboardAvoidingView
            behavior="position"
            flex={1}
            minHeight={"auto"}
            // keyboardVerticalOffset={!isIos && 100}
          >
            <ScrollView
              height={"100%"}
              zIndex={1000}
              backgroundColor={whiteColor}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => handleReSearch()}
                ></RefreshControl>
              }
            >
              {/* year */}
              <HStack
                marginTop={2}
                alignItems={"center"}
                justifyContent={"space-between"}
                space={2}
                paddingLeft={2}
              >
                <Text fontSize={16}>Năm:</Text>
                <HStack
                  flex={1}
                  style={styles.pickBox}
                  borderWidth={!isIos && 1}
                  rounded={"lg"}
                >
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
                              disabled={currentIndex <= 0 || false}
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
                                  opacity: currentIndex <= 0 ? 0.1 : 1,
                                }}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              disabled={
                                currentIndex >= inforPermission.length - 1 ||
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
                                    currentIndex >= inforPermission.length - 1
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
                </HStack>
              </HStack>
              {/* //month or day */}
              <VStack justifyContent={"center"}>
                <HStack alignItems={"center"}>
                  <Text fontSize={16} paddingX={2}>
                    Ngày
                  </Text>
                  <Switch
                    size={"sm"}
                    offTrackColor={"#0ea5e9"}
                    onTrackColor={"#22c55e"}
                    isChecked={isSelectMonth}
                    colorScheme="primary"
                    onToggle={() => setIsSelectMonth(!isSelectMonth)}
                  />
                  <Text fontSize={16} paddingX={2}>
                    Tháng
                  </Text>
                </HStack>

                <HStack
                  marginTop={2}
                  alignItems={"center"}
                  justifyContent={"space-around"}
                  space={2}
                  px={1}
                  style={{ height: 50 }}
                >
                  {isSelectMonth ? (
                    <>
                      <HStack
                        rounded={"2xl"}
                        style={styles.pickBox}
                        width={"48%"}
                        borderWidth={!isIos && 1}
                      >
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
                                            value <= arrayNumberAsc[0]
                                              ? 0.1
                                              : 1,
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
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => {
                          return isIos ? (
                            <DateTimePicker
                              style={{ width: "40%", height: 50 }}
                              testID="dateTimePicker"
                              value={value}
                              mode={"date"}
                              is24Hour={true}
                              onChange={(_, date) => onChange(date)}
                              display={"default"}
                              locale="vi"
                            />
                          ) : (
                            <Pressable
                              px={3}
                              py={1}
                              backgroundColor={"#f1f1f1"}
                              rounded={"md"}
                              onPress={() => {
                                showDatePickerAndroid(value, onChange);
                              }}
                            >
                              <Text fontSize={16} fontWeight={500}>
                                {convertDateTimeToString(value, "DD/MM/yyyy")}
                              </Text>
                            </Pressable>
                          );
                        }}
                        name="startDay"
                      />
                      <Ionicons
                        name="arrow-forward-outline"
                        size={15}
                        style={{ marginHorizontal: 1 }}
                      />

                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => {
                          return isIos ? (
                            <DateTimePicker
                              style={{ width: "40%", height: 50 }}
                              testID="dateTimePicker"
                              value={value}
                              mode={"date"}
                              is24Hour={true}
                              onChange={(_, date) => onChange(date)}
                              display={"default"}
                              locale="vi"
                            />
                          ) : (
                            <Pressable
                              px={3}
                              py={1}
                              backgroundColor={"#f1f1f1"}
                              rounded={"md"}
                              onPress={() => {
                                showDatePickerAndroid(value, onChange);
                              }}
                            >
                              <Text fontSize={16} fontWeight={500}>
                                {convertDateTimeToString(value, "DD/MM/yyyy")}
                              </Text>
                            </Pressable>
                          );
                        }}
                        name="endDay"
                      />
                    </>
                  )}
                </HStack>
              </VStack>
              {/* //warehouse */}
              <HStack
                marginTop={2}
                alignItems={"center"}
                justifyContent={"space-between"}
                paddingLeft={2}
                space={2}
              >
                <Text fontSize={16}>Kho:</Text>
                <HStack
                  rounded={"lg"}
                  style={styles.pickBox}
                  flex={1}
                  borderWidth={!isIos && 1}
                >
                  <View width={"100%"}>
                    <Controller
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field: { onChange, onBlur, value } }) => {
                        const currentIndex =
                          inforSearch.wareHouseList.findIndex(
                            (item) => item.Code === value
                          );
                        return (
                          <HStack alignItems={"center"}>
                            <Picker
                              itemStyle={{ height: 50, fontSize: 15 }}
                              style={{ flex: 1 }}
                              shouldRasterizeIOS
                              selectedValue={value}
                              onValueChange={(itemValue) => onChange(itemValue)}
                              enabled={inforSearch.wareHouseList.length <= 0}
                              dropdownIconColor={"#fff"}
                              dropdownIconRippleColor={"#fff"}
                            >
                              {inforSearch.wareHouseList &&
                                inforSearch.wareHouseList.map((item, index) => {
                                  return (
                                    <Picker.Item
                                      key={index}
                                      label={item.Name}
                                      value={item.Code}
                                    />
                                  );
                                })}
                            </Picker>
                            <VStack position={"absolute"} right={"10%"}>
                              <TouchableOpacity
                                disabled={currentIndex <= 0 || false}
                                onPress={() => {
                                  onChange(
                                    inforSearch.wareHouseList[currentIndex - 1]
                                      .Code
                                  );
                                }}
                              >
                                <AntDesign
                                  name="caretup"
                                  size={15}
                                  style={{
                                    opacity: currentIndex <= 0 ? 0.1 : 1,
                                  }}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                disabled={
                                  currentIndex >=
                                    inforSearch.wareHouseList.length - 1 ||
                                  false
                                }
                                onPress={() => {
                                  onChange(
                                    inforSearch.wareHouseList[currentIndex + 1]
                                      .Code
                                  );
                                }}
                              >
                                <AntDesign
                                  name="caretdown"
                                  size={15}
                                  style={{
                                    opacity:
                                      currentIndex >=
                                      inforSearch.wareHouseList.length - 1
                                        ? 0.1
                                        : 1,
                                  }}
                                />
                              </TouchableOpacity>
                            </VStack>
                          </HStack>
                        );
                      }}
                      name="warehouse"
                    />
                  </View>
                </HStack>
              </HStack>
              {/* //accountType */}
              <HStack
                marginTop={2}
                alignItems={"center"}
                justifyContent={"space-between"}
                paddingLeft={2}
                space={2}
              >
                <Text fontSize={16}>Tài khoản:</Text>
                <HStack
                  rounded={"lg"}
                  style={styles.pickBox}
                  borderWidth={!isIos && 1}
                  flex={1}
                >
                  <View width={"100%"}>
                    <Controller
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field: { onChange, onBlur, value } }) => {
                        const currentIndex = inforSearch.accountList.findIndex(
                          (item) => item.Code === value
                        );
                        return (
                          <HStack alignItems={"center"}>
                            <Picker
                              itemStyle={{ height: 50, fontSize: 15 }}
                              style={{ flex: 1 }}
                              shouldRasterizeIOS
                              selectedValue={value}
                              onValueChange={(itemValue) => onChange(itemValue)}
                              enabled={inforSearch.accountList.length <= 0}
                              dropdownIconColor={"#fff"}
                              dropdownIconRippleColor={"#fff"}
                            >
                              {inforSearch.accountList &&
                                inforSearch.accountList.map((item, index) => {
                                  return (
                                    <Picker.Item
                                      key={index}
                                      label={item.Name}
                                      value={item.Code}
                                    />
                                  );
                                })}
                            </Picker>
                            <VStack position={"absolute"} right={"10%"}>
                              <TouchableOpacity
                                disabled={currentIndex <= 0 || false}
                                onPress={() => {
                                  onChange(
                                    inforSearch.accountList[currentIndex - 1]
                                      .Code
                                  );
                                }}
                              >
                                <AntDesign
                                  name="caretup"
                                  size={15}
                                  style={{
                                    opacity: currentIndex <= 0 ? 0.1 : 1,
                                  }}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                disabled={
                                  currentIndex == -1 ||
                                  currentIndex >=
                                    inforSearch.accountList.length - 1 ||
                                  false
                                }
                                onPress={() => {
                                  onChange(
                                    inforSearch.accountList[currentIndex + 1]
                                      .Code
                                  );
                                }}
                              >
                                <AntDesign
                                  name="caretdown"
                                  size={15}
                                  style={{
                                    opacity:
                                      currentIndex == -1 ||
                                      currentIndex >=
                                        inforSearch.accountList.length - 1
                                        ? 0.1
                                        : 1,
                                  }}
                                />
                              </TouchableOpacity>
                            </VStack>
                          </HStack>
                        );
                      }}
                      name="accountType"
                    />
                  </View>
                </HStack>
              </HStack>
              {/* unitType */}
              <HStack
                marginTop={2}
                alignItems={"center"}
                justifyContent={"space-between"}
                paddingLeft={2}
                space={2}
              >
                <Text fontSize={16}>Đơn vị tính:</Text>
                <HStack
                  rounded={"lg"}
                  style={styles.pickBox}
                  borderWidth={!isIos && 1}
                  flex={1}
                >
                  <View width={"100%"}>
                    <Controller
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field: { onChange, onBlur, value } }) => {
                        const currentIndex = inforSearch.UnitList.findIndex(
                          (item) => item.unitTypeCode === value
                        );
                        return (
                          <HStack alignItems={"center"}>
                            <Picker
                              itemStyle={{ height: 50, fontSize: 15 }}
                              style={{ flex: 1 }}
                              shouldRasterizeIOS
                              selectedValue={value}
                              onValueChange={(itemValue) => onChange(itemValue)}
                              enabled={inforSearch.UnitList.length <= 0}
                              dropdownIconColor={"#fff"}
                              dropdownIconRippleColor={"#fff"}
                            >
                              {inforSearch.UnitList &&
                                inforSearch.UnitList.map((item, index) => {
                                  return (
                                    <Picker.Item
                                      key={index}
                                      label={item.unitTypeName}
                                      value={item.unitTypeCode}
                                    />
                                  );
                                })}
                            </Picker>
                            <VStack position={"absolute"} right={"10%"}>
                              <TouchableOpacity
                                disabled={currentIndex <= 0 || false}
                                onPress={() => {
                                  onChange(
                                    inforSearch.UnitList[currentIndex - 1]
                                      .unitTypeCode
                                  );
                                }}
                              >
                                <AntDesign
                                  name="caretup"
                                  size={15}
                                  style={{
                                    opacity: currentIndex <= 0 ? 0.1 : 1,
                                  }}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                disabled={
                                  currentIndex >=
                                    inforSearch.UnitList.length - 1 || false
                                }
                                onPress={() => {
                                  onChange(
                                    inforSearch.UnitList[currentIndex + 1]
                                      .unitTypeCode
                                  );
                                }}
                              >
                                <AntDesign
                                  name="caretdown"
                                  size={15}
                                  style={{
                                    opacity:
                                      currentIndex == -1 ||
                                      currentIndex >=
                                        inforSearch.UnitList.length - 1
                                        ? 0.1
                                        : 1,
                                  }}
                                />
                              </TouchableOpacity>
                            </VStack>
                          </HStack>
                        );
                      }}
                      name="unitType"
                    />
                  </View>
                </HStack>
              </HStack>
              {/* productionCode */}
              <HStack
                marginTop={2}
                alignItems={"center"}
                justifyContent={"space-between"}
                paddingLeft={2}
                space={2}
              >
                <Text fontSize={16}>Mã hàng hóa:</Text>
                <Controller
                  control={control}
                  rules={{ maxLength: 100 }}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <Input
                        ml={1}
                        flex={1}
                        value={value}
                        onChangeText={(text) => onChange(text)}
                        variant="outline"
                        placeholder="Nhập mã hàng hóa cần tìm"
                      />
                    );
                  }}
                  name="productionCode"
                ></Controller>
              </HStack>
              {/* productionName */}
              <HStack
                marginTop={3}
                alignItems={"center"}
                justifyContent={"space-between"}
                paddingLeft={2}
                space={2}
              >
                <Text fontSize={16}>Tên hàng hóa:</Text>
                <Controller
                  control={control}
                  rules={{ maxLength: 100 }}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <Input
                        ml={1}
                        flex={1}
                        value={value}
                        onChangeText={(text) => onChange(text)}
                        variant="outline"
                        placeholder="Nhập tên hàng hóa cần tìm"
                      />
                    );
                  }}
                  name="productionName"
                ></Controller>
              </HStack>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
        <HStack
          position={"relative"}
          borderTopWidth={0.5}
          backgroundColor={"#fff"}
          p={2}
          bottom={0}
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
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  pickBox: {
    alignItems: "center",
    borderColor: grey,
  },
});
export default IOInventoryFilter;
