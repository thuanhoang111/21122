import { Picker } from "@react-native-picker/picker";
import {
  HStack,
  Heading,
  Icon,
  Pressable,
  Switch,
  Text,
  VStack,
  View,
} from "native-base";
import { useContext, useState, useEffect } from "react";
import {
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
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
import { heightOfScreen, widthOfScreen } from "../../constants/ConstantMain";
import Entypo from "react-native-vector-icons/Entypo";
import { StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {
  primaryColor,
  primaryColorLight,
  grey,
} from "../../constants/ConstantStyle";
const currentDate = new Date();
const listAccountType = [
  {
    accountTypeName: "Tất cả",
    accountTypeCode: "",
  },
  {
    accountTypeName: "1521  Nguyên vật liệu",
    accountTypeCode: 1521,
  },
  {
    accountTypeName: "1522  Công cụ dụng cụ",
    accountTypeCode: 1522,
  },
  {
    accountTypeName: "1561  Thành phẩm",
    accountTypeCode: 1561,
  },
  {
    accountTypeName: "1562  Hàng hóa",
    accountTypeCode: 1562,
  },
];

function DebtTrackingFilter({
  inforPermission,
  onSearch,
  bookStyleDS,
  customerDS,
}) {
  // The last year in which the user has access
  // initialize the array of increasing numbers
  const arrayNumberAsc = Array.from({ length: 12 }, (_, index) => index + 1);
  // Displays month or quarter selection
  const [isSelectMonth, setIsSelectMonth] = useState(true);
  const [objectValue, setObjectValue] = useState();
  const [open, setOpen] = useState(false);
  const mainContext = useContext(MainContext);
  const isIos = mainContext.isIos;
  const lastPermissionYear = mainContext.lastPermissionYear;
  const inforFilter = mainContext.inforFilter;

  useEffect(() => {
    DropDownPicker.addTranslation("Vn", {
      PLACEHOLDER: "Chọn đối tượng cần tìm",
      SEARCH_PLACEHOLDER: "nhập tên đối tượng...",
      SELECTED_ITEMS_COUNT_TEXT: "{count} đối tượng đã được chọn", // See below for advanced options
      NOTHING_TO_SHOW: "Không có đối tượng cần tìm!",
    });
    DropDownPicker.setLanguage("Vn");
  }, []);
  const { control, reset, getValues } = useForm({
    defaultValues: {
      year: inforFilter.year || lastPermissionYear,
      cusCode: [],
      debtBookCode: inforFilter.debtBookCode | 131,
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

  const onSubmit = async () => {
    mainContext.onChangeLoading(true);
    const data = getValues();
    data.endDay = convertDateTimeToString(data.endDay, "DD/MM/yyyy");
    data.startDay = convertDateTimeToString(data.startDay, "DD/MM/yyyy");
    await onSearch(
      data.startMonth,
      data.endMonth,
      data.startDay,
      data.endDay,
      data.debtBookCode,
      data.cusCode,
      data.year
    );

    mainContext.onChangeLoading(false);
  };

  return (
    <View style={{ height: "100%" }}>
      <SafeAreaView>
        <VStack minHeight={heightOfScreen * 0.9} backgroundColor={"#fff"}>
          <View px={2} py={4} backgroundColor={"#f1f1f1"}>
            <Heading textAlign={"left"} size={"md"} fontWeight={500}>
              Bộ lọc thông tin
            </Heading>
          </View>
          <KeyboardAvoidingView
            behavior="position"
            enabled
            keyboardVerticalOffset={!isIos && 100}
          >
            <VStack
              justifyContent={"space-between"}
              backgroundColor={"#fff"}
              paddingRight={1}
            >
              <VStack paddingBottom={5}>
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
                          const currentIndex = inforPermission.findIndex(
                            (item) => {
                              return item.year === value;
                            }
                          );
                          return (
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
                                    currentIndex >=
                                      inforPermission.length - 1 || false
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
                                        currentIndex >=
                                        inforPermission.length - 1
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
                  >
                    {isSelectMonth ? (
                      <>
                        <HStack
                          style={styles.pickBox}
                          borderWidth={!isIos && 1}
                          rounded={"2xl"}
                          width={"48%"}
                        >
                          <Controller
                            control={control}
                            rules={{
                              required: true,
                            }}
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
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
                                      <Picker.Item
                                        key={index}
                                        style={{ fontSize: 15 }}
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
                            )}
                            name="startMonth"
                          />
                        </HStack>
                        <Ionicons
                          name="arrow-forward-outline"
                          size={15}
                          style={{ marginHorizontal: 1 }}
                        />
                        <HStack
                          style={styles.pickBox}
                          borderWidth={!isIos && 1}
                          rounded={"2xl"}
                          width={"48%"}
                        >
                          <Controller
                            control={control}
                            rules={{
                              required: true,
                            }}
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
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
                                      value == arrayNumberAsc[0] || false
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
                                          value == arrayNumberAsc[0] ? 0.1 : 1,
                                      }}
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    disabled={
                                      value == arrayNumberAsc.at(-1) || false
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
                                display={
                                  Platform.OS === "ios" ? "default" : "calendar"
                                }
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
                {/* //debtBookCode */}
                <HStack
                  marginTop={2}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  paddingLeft={2}
                  space={2}
                >
                  <Text fontSize={16}>Tài khoản:</Text>
                  <HStack
                    rounded={"2xl"}
                    style={styles.pickBox}
                    flex={1}
                    borderWidth={!isIos && 1}
                  >
                    <Controller
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field: { onChange, onBlur, value } }) => {
                        const currentIndex = listAccountType.findIndex(
                          (item) => item.accountTypeCode === value
                        );
                        return (
                          bookStyleDS && (
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
                                {bookStyleDS &&
                                  bookStyleDS.map((item, index) => {
                                    return (
                                      <Picker.Item
                                        key={index}
                                        label={item.BookName}
                                        value={item.BookCode}
                                      />
                                    );
                                  })}
                              </Picker>
                              <VStack position={"absolute"} right={"10%"}>
                                <TouchableOpacity
                                  disabled={currentIndex <= 0 || false}
                                  onPress={() => {
                                    onChange(
                                      bookStyleDS[currentIndex - 1].BookCode
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
                                    currentIndex >= bookStyleDS.length - 1 ||
                                    false
                                  }
                                  onPress={() => {
                                    onChange(
                                      bookStyleDS[currentIndex + 1].BookCode
                                    );
                                  }}
                                >
                                  <AntDesign
                                    name="caretdown"
                                    size={15}
                                    style={{
                                      opacity:
                                        currentIndex >= bookStyleDS.length - 1
                                          ? 0.1
                                          : 1,
                                    }}
                                  />
                                </TouchableOpacity>
                              </VStack>
                            </HStack>
                          )
                        );
                      }}
                      name="debtBookCode"
                    />
                  </HStack>
                </HStack>
                {/* //cusCode */}
                <HStack
                  style={{ minWidth: widthOfScreen * 0.8 }}
                  marginTop={2}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  paddingLeft={2}
                  space={2}
                >
                  <Text fontSize={16} py={1}>
                    Đối tượng:
                  </Text>
                  <View flex={1}>
                    <Controller
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field: { onChange, value, onBlur, ref } }) => {
                        return (
                          <DropDownPicker
                            schema={{
                              label: "Name",
                              value: "Code",
                            }}
                            style={{
                              borderWidth: 0,
                              backgroundColor: "#f1f1f1",
                            }}
                            zIndex={1000}
                            zIndexInverse={3000}
                            open={open}
                            searchable
                            value={objectValue}
                            items={customerDS}
                            setOpen={setOpen}
                            setValue={(item) => {
                              setObjectValue(item);
                            }}
                            onChangeValue={(val) => {
                              onChange(val);
                            }}
                            TickIconComponent={() => (
                              <Icon
                                as={
                                  <Entypo
                                    name={"check"}
                                    selectionColor={"#34d399"}
                                  />
                                }
                              />
                            )}
                            theme="LIGHT"
                            multiple={true}
                            mode="BADGE"
                            listMode={"MODAL"}
                            activityIndicatorSize={50}
                            badgeDotColors={[
                              "#e76f51",
                              "#00b4d8",
                              "#e9c46a",
                              "#e76f51",
                              "#8ac926",
                              "#00b4d8",
                              "#e9c46a",
                            ]}
                          />
                        );
                      }}
                      name="cusCode"
                    />
                  </View>
                </HStack>
              </VStack>
            </VStack>
          </KeyboardAvoidingView>
        </VStack>
      </SafeAreaView>
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
            setObjectValue([]);
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
    </View>
  );
}
const styles = StyleSheet.create({
  pickBox: {
    alignItems: "center",
    borderColor: grey,
  },
});
export default DebtTrackingFilter;
