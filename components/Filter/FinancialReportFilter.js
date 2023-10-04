import { useState } from "react";
import { TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { heightOfScreen } from "../../constants/ConstantMain";
import AntDesign from "react-native-vector-icons/AntDesign";
import IconIonicons from "react-native-vector-icons/Ionicons";
import { Controller, useForm } from "react-hook-form";

import { Picker, PickerIOS } from "@react-native-picker/picker";
import {
  HStack,
  Heading,
  Pressable,
  Switch,
  Text,
  VStack,
  View,
} from "native-base";

const currentDate = new Date();
function FinancialReportFilter({ inforPermission, onSearch, inforFilter }) {
  const yearPermission = inforPermission[inforPermission.length - 1].year;
  const arrayNumberAsc = Array.from({ length: 12 }, (_, index) => index + 1);
  const [isSelectMonth, setIsSelectMonth] = useState(true);
  const { control, reset, getValues } = useForm({
    defaultValues: {
      year: yearPermission,
      startMonth: 1,
      endMonth: 12,
    },
  });
  const onSubmit = () => {
    let data = getValues();
    onSearch(data.year, data.startMonth, data.endMonth);
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
                  <AntDesign name="caretup" />
                  <AntDesign name="caretdown" />
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
                                  item % 3 == 0 && (
                                    <Picker.Item
                                      key={index}
                                      label={`Quý ${Math.ceil(item / 3)}`}
                                      value={item - 2}
                                    />
                                  )
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
                                  item % 3 == 0 && (
                                    <Picker.Item
                                      key={index}
                                      label={`Quý ${Math.ceil(item / 3)}`}
                                      value={item}
                                    />
                                  )
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
                )}
              </HStack>
            </VStack>
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

export default FinancialReportFilter;
