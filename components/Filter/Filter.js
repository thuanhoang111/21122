import { Picker, PickerIOS } from "@react-native-picker/picker";
import {
  Button,
  Divider,
  HStack,
  Heading,
  Modal,
  Pressable,
  ScrollView,
  Text,
  VStack,
  View,
} from "native-base";
import { useState } from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { heightOfScreen } from "../../constants/ConstantMain";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Controller, useForm } from "react-hook-form";
function Filter({
  inforPermission,
  onSearch,
  inforFilter,
  lstBankAccount = [],
}) {
  const arrayNumberAsc = Array.from({ length: 12 }, (_, index) => index + 1);
  const { control, reset, getValues } = useForm({
    defaultValues: {
      year: inforFilter.year,
      startMonth: inforFilter.startMonth,
      endMonth: inforFilter.endMonth,
      accountCode: inforFilter.accountCode,
    },
  });
  const onSubmit = () => {
    let data = getValues();
    onSearch(data.startMonth, data.endMonth, data.year, data.accountCode);
  };
  return (
    <SafeAreaView>
      <VStack justifyContent={"space-between"} height={"100%"}>
        <View>
          <Heading
            px={2}
            textAlign={"left"}
            size={"md"}
            fontWeight={500}
            py={4}
          >
            Bộ lọc thông tin
          </Heading>
          <VStack px={2} backgroundColor={"#fff"} height={heightOfScreen * 0.7}>
            {/* <ScrollView> */}
            <HStack
              marginTop={2}
              alignItems={"center"}
              justifyContent={"space-between"}
              paddingLeft={2}
            >
              <Text fontSize={16}>Năm:</Text>
              <HStack alignItems={"center"} width={"80%"}>
                <View width={"100%"}>
                  <Controller
                    control={control}
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
                  />
                </View>
                <VStack position={"absolute"} right={"10%"}>
                  <AntDesign name="caretup" />
                  <AntDesign name="caretdown" />
                </VStack>
              </HStack>
            </HStack>
            <VStack justifyContent={"center"}>
              <Text fontSize={16} paddingLeft={2}>
                Tháng:
              </Text>
              <HStack
                marginTop={2}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <HStack alignItems={"center"} width={"48%"}>
                  <View width={"100%"}>
                    <Controller
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <Picker
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
                          </Picker>
                        );
                      }}
                      name="startMonth"
                    />
                  </View>
                  {/* <VStack position={"absolute"} right={"10%"}>
                    <TouchableOpacity
                      disabled={startMonth === 12 && false}
                      onPress={() => setStartMonth(startMonth + 1)}
                    >
                      <AntDesign
                        name="caretup"
                        color={startMonth === 12 ? "#c7cacd" : "#000"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={startMonth === 1 && false}
                      onPress={() => setStartMonth(startMonth - 1)}
                    >
                      <AntDesign
                        name="caretdown"
                        color={startMonth === 1 ? "#c7cacd" : "#000"}
                      />
                    </TouchableOpacity>
                  </VStack> */}
                </HStack>
                <Ionicons name="arrow-forward-outline" size={15} />
                <HStack alignItems={"center"} width={"48%"}>
                  <View width={"100%"}>
                    <Controller
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <Picker
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
                          </Picker>
                        );
                      }}
                      name="endMonth"
                    />
                  </View>
                  {/* <VStack position={"absolute"} right={"10%"}>
                    <TouchableOpacity
                      disabled={endMonth === 12 && false}
                      onPress={() => setEndMonth(endMonth + 1)}
                    >
                      <AntDesign
                        name="caretup"
                        color={endMonth === 12 ? "#c7cacd" : "#000"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={endMonth === 1 && false}
                      onPress={() => setEndMonth(endMonth - 1)}
                    >
                      <AntDesign
                        name="caretdown"
                        color={endMonth === 1 ? "#c7cacd" : "#000"}
                      />
                    </TouchableOpacity>
                  </VStack> */}
                </HStack>
              </HStack>
            </VStack>
            {lstBankAccount.length != 0 && (
              <HStack py={2} lineHeight={1} alignItems={"center"}>
                <Text fontSize={16}>TK kế toán:</Text>
                <View w={"75%"}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Picker
                          itemStyle={{
                            height: 50,
                            fontSize: 15,
                          }}
                          selectedValue={value}
                          onValueChange={(itemValue) => onChange(itemValue)}
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
                      );
                    }}
                    name="accountCode"
                  />
                </View>
              </HStack>
            )}
            {/* </ScrollView> */}
          </VStack>
        </View>
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
                  borderColor={"#009387"}
                >
                  <Text color={"#009387"} textAlign={"center"} fontSize={16}>
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
    </SafeAreaView>
  );
}

export default Filter;
