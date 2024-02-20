import { Picker } from "@react-native-picker/picker";
import {
  Button,
  CheckIcon,
  HStack,
  Heading,
  Pressable,
  ScrollView,
  Select,
  Spinner,
  Stack,
  Text,
  VStack,
  View,
} from "native-base";
import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { heightOfScreen, widthOfScreen } from "../../constants/ConstantMain";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Controller, useForm } from "react-hook-form";
import { MainContext } from "../../screens/MainContext";
import { useContext } from "react";
import {
  primaryColor,
  primaryColorLight,
  grey,
} from "../../constants/ConstantStyle";
function Filter({ inforPermission, onSearch, lstBankAccount = [] }) {
  const mainContext = useContext(MainContext);
  const inforFilter = mainContext.inforFilter;
  console.log(inforFilter);
  const isIos = mainContext.isIos;
  const arrayNumberAsc = Array.from({ length: 12 }, (_, index) => index + 1);
  const { control, reset, getValues } = useForm({
    defaultValues: {
      year: inforFilter.year,
      startMonth: inforFilter.startMonth,
      endMonth: inforFilter.endMonth,
      accountCode: inforFilter.accountCode,
    },
  });
  const onSubmit = async () => {
    mainContext.onChangeLoading(true);
    let data = getValues();
    console.log(data);
    await onSearch(data.startMonth, data.endMonth, data.year, data.accountCode);
    this.BankDepositBookRef &&
      this.BankDepositBookRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
    this.CashBookMoneyRef &&
      this.CashBookMoneyRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
  };
  return (
    <SafeAreaView>
      <VStack height={"100%"}>
        <Stack backgroundColor={"#f1f1f1"} px={2} py={4}>
          <Heading textAlign={"left"} size={"md"} fontWeight={500}>
            Bộ lọc thông tin
          </Heading>
        </Stack>
        <VStack
          px={2}
          // height={heightOfScreen * 0.7}
          backgroundColor={"#fff"}
          flex={15}
        >
          <ScrollView>
            {/* Year */}
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
                    render={({ field: { onChange, value } }) => {
                      const currentIndex = inforPermission.findIndex((item) => {
                        return item.year === parseInt(value);
                      });

                      return (
                        <HStack alignItems={"center"}>
                          <Picker
                            itemStyle={{
                              height: 50,
                              fontSize: 15,
                            }}
                            style={{
                              flex: 1,
                            }}
                            shouldRasterizeIOS
                            selectedValue={value}
                            onValueChange={(itemValue) => onChange(itemValue)}
                            dropdownIconColor={"#fff"}
                            dropdownIconRippleColor={"#fff"}
                            // enabled={isIos}
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
                  />
                </View>
              </HStack>
            </HStack>
            {/* Month */}
            <VStack justifyContent={"center"} space={1}>
              <Text fontSize={16} paddingLeft={2}>
                Tháng:
              </Text>
              <HStack alignItems={"center"} justifyContent={"space-between"}>
                <HStack
                  width={"48.5%"}
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
                              onValueChange={(itemValue) => onChange(itemValue)}
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
                                disabled={value <= arrayNumberAsc[0] || false}
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
                                      value >= arrayNumberAsc.at(-1) ? 0.1 : 1,
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
                  width={"48.1%"}
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
                              onValueChange={(itemValue) => onChange(itemValue)}
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
                                disabled={value <= arrayNumberAsc[0] || false}
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
                                      value >= arrayNumberAsc.at(-1) ? 0.1 : 1,
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
              </HStack>
            </VStack>
            {/* Bank Account */}
            <HStack py={2} lineHeight={1} alignItems={"center"} space={2}>
              <Text fontSize={16} paddingLeft={2}>
                TK kế toán:
              </Text>
              <View flex={1}>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    const currentIndex = lstBankAccount.findIndex((item) => {
                      return item.AccountCode === value;
                    });
                    return (
                      <HStack
                        alignItems={"center"}
                        style={styles.pickBox}
                        borderWidth={!isIos && 1}
                        rounded={"2xl"}
                      >
                        <Picker
                          itemStyle={{
                            height: 50,
                            fontSize: 15,
                          }}
                          style={{ flex: 1 }}
                          selectedValue={value}
                          dropdownIconColor={"#fff"}
                          dropdownIconRippleColor={"#fff"}
                          onValueChange={(itemValue) => onChange(itemValue)}
                          // enabled={isIos && lstBankAccount.length <= 0}
                        >
                          {lstBankAccount.map((item, index) => {
                            return (
                              <Picker.Item
                                key={index}
                                label={item.AccountName}
                                value={item.AccountCode}
                              />
                            );
                          })}
                        </Picker>
                        <VStack position={"absolute"} right={"10%"}>
                          <TouchableOpacity
                            disabled={currentIndex <= 0 || false}
                            onPress={({}) => {
                              onChange(
                                lstBankAccount[currentIndex - 1].AccountCode
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
                              currentIndex >= lstBankAccount.length - 1 || false
                            }
                            onPress={({}) => {
                              onChange(
                                lstBankAccount[currentIndex + 1].AccountCode
                              );
                            }}
                          >
                            <AntDesign
                              name="caretdown"
                              size={15}
                              style={{
                                opacity:
                                  currentIndex >= lstBankAccount.length - 1
                                    ? 0.1
                                    : 1,
                              }}
                            />
                          </TouchableOpacity>
                        </VStack>
                      </HStack>
                    );
                  }}
                  name="accountCode"
                />
              </View>
            </HStack>
          </ScrollView>
        </VStack>
        <HStack
          flex={1}
          borderTopWidth={0.5}
          position={"absolute"}
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

export default Filter;
