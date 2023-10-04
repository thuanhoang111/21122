import { Picker, PickerIOS } from "@react-native-picker/picker";
import {
  HStack,
  Heading,
  Input,
  Pressable,
  ScrollView,
  Switch,
  Text,
  VStack,
  View,
} from "native-base";
import { useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { heightOfScreen } from "../../constants/ConstantMain";
import AntDesign from "react-native-vector-icons/AntDesign";
import IconIonicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";
import { SafeAreaViewBase } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {
  convertDateTimeToString,
  convertStringToDateTime,
} from "../../constants/ConstantFunc";

const currentDate = new Date();
const listWareHouse = [
  {
    wareHouseName: "Tất cả",
    wareHouseCode: "",
  },
  {
    wareHouseName: "Không chỉ định",
    wareHouseCode: "KHOKCD",
  },
];
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
const listUnitType = [
  {
    unitTypeName: "Không chỉ định",
    unitTypeCode: "",
  },
];
function IOInventoryFilter({ inforPermission, onSearch, inforFilter }) {
  const yearPermission = inforPermission[inforPermission.length - 1].year;
  const arrayNumberAsc = Array.from({ length: 12 }, (_, index) => index + 1);
  const [isSelectMonth, setIsSelectMonth] = useState(true);
  const { control, reset, getValues } = useForm({
    defaultValues: {
      year: yearPermission,
      warehouse: "",
      accountType: "",
      unitType: "",
      productionCode: "",
      productionName: "",
      startMonth: 1,
      endMonth: 12,
      startDay: currentDate,
      endDay: currentDate,
    },
  });
  const onSubmit = () => {
    let data = getValues();
    data.endDay = convertDateTimeToString(data.endDay, "DD/MM/yyyy");
    data.startDay = convertDateTimeToString(data.startDay, "DD/MM/yyyy");
    onSearch(data);
    // transfer string to date
    var dateObject = convertStringToDateTime(data.startDay, "DD/MM/yyyy");
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
            >
              <Text fontSize={16}>Năm:</Text>
              <HStack alignItems={"center"} flex={1}>
                <View width={"100%"}>
                  <Controller
                    control={control}
                    rules={{
                      maxLength: 100,
                    }}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Picker
                          itemStyle={{ height: 50, fontSize: 15 }}
                          style={{ backgroundColor: "#fff" }}
                          shouldRasterizeIOS
                          selectedValue={value}
                          onValueChange={(itemValue) => onChange(itemValue)}
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
                      );
                    }}
                    name="year"
                  ></Controller>
                </View>
                <VStack position={"absolute"} right={"10%"}>
                  <FontAwesome5 name="arrows-alt-v" size={20} />
                </VStack>
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
              >
                {isSelectMonth ? (
                  <>
                    <HStack alignItems={"center"} width={"45%"}>
                      <View width={"100%"}>
                        <Controller
                          control={control}
                          rules={{
                            required: true,
                          }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <PickerIOS
                              itemStyle={{
                                height: 50,
                                fontSize: 15,
                              }}
                              style={{ backgroundColor: "#fff" }}
                              shouldRasterizeIOS
                              selectedValue={value}
                              onValueChange={(itemValue) => onChange(itemValue)}
                            >
                              {arrayNumberAsc.map((item, index) => {
                                return (
                                  <Picker.Item
                                    key={index}
                                    label={`Tháng ${item}`}
                                    value={item}
                                  />
                                );
                              })}
                            </PickerIOS>
                          )}
                          name="startMonth"
                        />
                      </View>
                      <VStack position={"absolute"} right={"10%"}>
                        <TouchableOpacity
                        //   disabled={startMonth === 12 && false}
                        //   onPress={() => setStartMonth(startMonth + 1)}
                        >
                          <AntDesign
                            name="caretup"
                            // color={startMonth === 12 ? "#c7cacd" : "#000"}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                        //   disabled={startMonth === 1 && false}
                        //   onPress={() => setStartMonth(startMonth - 1)}
                        >
                          <AntDesign
                            name="caretdown"
                            // color={startMonth === 1 ? "#c7cacd" : "#000"}
                          />
                        </TouchableOpacity>
                      </VStack>
                    </HStack>
                    <IconIonicons name="arrow-forward-outline" size={15} />
                    <HStack alignItems={"center"} width={"45%"}>
                      <View width={"100%"}>
                        <Controller
                          control={control}
                          rules={{
                            required: true,
                          }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <PickerIOS
                              itemStyle={{ height: 50, fontSize: 15 }}
                              style={{ backgroundColor: "#fff" }}
                              shouldRasterizeIOS
                              selectedValue={value}
                              onValueChange={(itemValue) => onChange(itemValue)}
                            >
                              {arrayNumberAsc.map((item, index) => {
                                return (
                                  <Picker.Item
                                    key={index}
                                    label={`Tháng ${item}`}
                                    value={item}
                                  />
                                );
                              })}
                            </PickerIOS>
                          )}
                          name="endMonth"
                        />
                      </View>
                      <VStack position={"absolute"} right={"10%"}>
                        <TouchableOpacity
                        //   disabled={endMonth === 12 && false}
                        //   onPress={() => setEndMonth(endMonth + 1)}
                        >
                          <AntDesign
                            name="caretup"
                            // color={endMonth === 12 ? "#c7cacd" : "#000"}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                        //   disabled={endMonth === 1 && false}
                        //   onPress={() => setEndMonth(endMonth - 1)}
                        >
                          <AntDesign
                            name="caretdown"
                            // color={endMonth === 1 ? "#c7cacd" : "#000"}
                          />
                        </TouchableOpacity>
                      </VStack>
                    </HStack>
                  </>
                ) : (
                  <>
                    <Controller
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <DateTimePicker
                          style={{ width: "40%", height: 50 }}
                          testID="dateTimePicker"
                          value={value}
                          mode={"date"}
                          is24Hour={true}
                          onChange={(_, date) => onChange(date)}
                          display={
                            Platform.OS === "ios" ? "calendar" : "calendar"
                          }
                          locale="vi"
                        />
                      )}
                      name="startDay"
                    />
                    <IconIonicons name="arrow-forward-outline" size={15} />

                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => {
                        return (
                          <DateTimePicker
                            style={{ width: "40%" }}
                            testID="dateTimePicker"
                            value={value}
                            mode={"date"}
                            is24Hour={true}
                            onChange={(_, date) => {
                              onChange(date);
                            }}
                            display={
                              Platform.OS === "ios" ? "calendar" : "calendar"
                            }
                            locale="vi"
                          />
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
            >
              <Text fontSize={16}>Kho:</Text>
              <HStack alignItems={"center"} flex={1}>
                <View width={"100%"}>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Picker
                        itemStyle={{ height: 50, fontSize: 15 }}
                        style={{ backgroundColor: "#fff" }}
                        shouldRasterizeIOS
                        selectedValue={value}
                        onValueChange={(itemValue) => onChange(itemValue)}
                      >
                        {listWareHouse &&
                          listWareHouse.map((item, index) => {
                            return (
                              <Picker.Item
                                key={index}
                                label={item.wareHouseName.toString()}
                                value={item.wareHouseCode}
                              />
                            );
                          })}
                      </Picker>
                    )}
                    name="warehouse"
                  />
                </View>
                <VStack position={"absolute"} right={"10%"}>
                  <AntDesign name="caretup" />
                  <AntDesign name="caretdown" />
                </VStack>
              </HStack>
            </HStack>
            {/* //accountType */}
            <HStack
              marginTop={2}
              alignItems={"center"}
              justifyContent={"space-between"}
              paddingLeft={2}
            >
              <Text fontSize={16}>Tài khoản:</Text>
              <HStack alignItems={"center"} flex={1}>
                <View width={"100%"}>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Picker
                        itemStyle={{ height: 50, fontSize: 15 }}
                        style={{ backgroundColor: "#fff" }}
                        shouldRasterizeIOS
                        selectedValue={value}
                        onValueChange={(itemValue) => onChange(itemValue)}
                      >
                        {listAccountType &&
                          listAccountType.map((item, index) => {
                            return (
                              <Picker.Item
                                key={index}
                                label={item.accountTypeName}
                                value={item.accountTypeCode}
                              />
                            );
                          })}
                      </Picker>
                    )}
                    name="accountType"
                  />
                </View>
                <VStack position={"absolute"} right={"10%"}>
                  <AntDesign name="caretup" />
                  <AntDesign name="caretdown" />
                </VStack>
              </HStack>
            </HStack>
            {/* unitType */}
            <HStack
              marginTop={2}
              alignItems={"center"}
              justifyContent={"space-between"}
              paddingLeft={2}
            >
              <Text fontSize={16}>Đơn vị tính:</Text>
              <HStack alignItems={"center"} flex={1}>
                <View width={"100%"}>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Picker
                        itemStyle={{ height: 50, fontSize: 15 }}
                        style={{ backgroundColor: "#fff" }}
                        shouldRasterizeIOS
                        selectedValue={value}
                        onValueChange={(itemValue) => onChange(itemValue)}
                      >
                        {listUnitType &&
                          listUnitType.map((item, index) => {
                            return (
                              <Picker.Item
                                key={index}
                                label={item.unitTypeName}
                                value={item.unitTypeCode}
                              />
                            );
                          })}
                      </Picker>
                    )}
                    name="unitType"
                  />
                </View>
                <VStack position={"absolute"} right={"10%"}>
                  <AntDesign name="caretup" />
                  <AntDesign name="caretdown" />
                </VStack>
              </HStack>
            </HStack>

            {/* productionCode */}
            <HStack
              marginTop={2}
              alignItems={"center"}
              justifyContent={"space-between"}
              paddingLeft={2}
            >
              <Text fontSize={16}>Mã hàng hóa:</Text>
              <Controller
                control={control}
                rules={{ maxLength: 100 }}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Input
                      maxW={"60%"}
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
            >
              <Text fontSize={16}>Tên hàng hóa:</Text>
              <Controller
                control={control}
                rules={{ maxLength: 100 }}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Input
                      maxW={"60%"}
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
          </VStack>
        </KeyboardAvoidingView>
      </VStack>
      <HStack
        borderTopWidth={0.5}
        height={heightOfScreen * 0.08}
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
                borderColor={"#009387"}
              >
                <Text color={"#009387"} textAlign={"center"} fontSize={16}>
                  Đặt lại
                </Text>
              </View>
            );
          }}
        </Pressable>
        <Pressable w={"48%"} onPress={() => onSubmit()}>
          {({ isHovered, isFocused, isPressed }) => {
            return (
              <View
                paddingY={3}
                borderRadius={5}
                borderWidth={1}
                borderColor={"#009387"}
                backgroundColor={"#009387"}
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

export default IOInventoryFilter;
