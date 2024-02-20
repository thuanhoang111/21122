import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  Avatar,
  HStack,
  VStack,
  Skeleton,
  Center,
  ScrollView,
  Heading,
  Input,
  Box,
  Text,
  KeyboardAvoidingView,
  useToast,
  Pressable,
} from "native-base";
import IconIonicons from "react-native-vector-icons/Ionicons";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import IconEntypo from "react-native-vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import { Controller, useForm } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useObjectState } from "@uidotdev/usehooks";
import {
  convertDateTimeToString,
  convertStringToDateTime,
  showDatePickerAndroid,
} from "../../constants/ConstantFunc";
import * as Post from "../../API/service/Post";
import { AuthContext } from "../../components/context";
import { InforUserContext } from "./InforUserContext";
import { MainContext } from "../MainContext";
import Header from "../../components/Header/Header";
import { heightOfScreen, widthOfScreen } from "../../constants/ConstantMain";
function InforAccountScreen({ navigation, route }) {
  const mainContext = useContext(MainContext);
  const isIos = mainContext.isIos;
  const toast = useToast();
  const { signIn } = useContext(AuthContext);
  const listPosition = [
    {
      positionCode: 0,
      positionTitle: "Chưa có chức vụ",
    },
    {
      positionCode: 4,
      positionTitle: "Kế Toán",
    },
    {
      positionCode: 7,
      positionTitle: "Giám Đốc",
    },
  ];
  const initShowUpdateIpt = {
    userName: false,
    type: false,
    address: false,
    province: false,
    date: false,
    cooperativeName: false,
  };
  //  Author:ThuanHoang 05/06/2023
  //  Handle pick Image in device
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [4, 3],
      width: 100,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.uri);
    }
  };
  const context = useContext(InforUserContext);
  const [image, setImage] = useState(
    "https://firebasestorage.googleapis.com/v0/b/waca-4c0b4.appspot.com/o/icon.png?alt=media&token=ff1120d2-5a12-4ab4-87ad-7528bfff5f69"
  );
  const [showUpdateInput, setShowUpdateInput] =
    useObjectState(initShowUpdateIpt);
  const { control, reset, getValues } = useForm({
    defaultValues: {
      userId: context.inforUser.userID,
      userName: context.inforUser.userName,
      type: context.inforUser.label,
      address: context.inforUser.address,
      province: context.inforUser.province,
      registTime: convertStringToDateTime(
        context.inforUser.startDay,
        "DD/MM/yyyy"
      ),
      endTime: convertStringToDateTime(context.inforUser.endDay, "DD/MM/yyyy"),
      cooperativeName: context.inforUser.cooperativeName,
    },
  });
  const handleShowPosition = (idPosition) => {
    switch (idPosition) {
      case 4:
        return "Kế Toán";
      case 7:
        return "Giám đốc";
      default:
        return "Chưa có chức vụ ";
    }
  };
  const handleFocusInput = () => {
    showUpdateInput.userName && this.userNameInput.focus();
    showUpdateInput.address && this.addressInput.focus();
    showUpdateInput.cooperativeName && this.cooperativeNameInput.focus();
    showUpdateInput.province && this.provinceInput.focus();
  };
  useEffect(() => {
    isIos && handleFocusInput();
  }, [showUpdateInput]);
  // Function Submit Update new infor user
  const handleSubmit = () => {
    mainContext.onChangeLoading(true);
    Post.handlePostWithBody("User/Update", getValues())
      .then((data) => {
        !data.error && setShowUpdateInput(initShowUpdateIpt);
        const message = data.message;
        data.data && signIn(data.data);
        data &&
          toast.show({
            avoidKeyboard: true,
            placement: "top",
            duration: 2000,
            render: ({ id }) => {
              return (
                <ToastNotification
                  id={id}
                  status={message.error ? "error" : "success"}
                  variant={"left-accent"}
                  title={message.errorMsg}
                  description={message.errorDescription}
                  onClose={() => toast.close(id)}
                />
              );
            },
          });
      })
      .finally(() => {
        context.onUpdate(true);
        mainContext.onChangeLoading(false);
      });
  };
  return (
    <>
      <Header
        onBack={() => navigation.goBack()}
        title={"Thông tin tài khoản"}
      ></Header>
      {context.inforUser.userID ? (
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={!isIos ? -200 : -heightOfScreen}
          zIndex={10000}
          backgroundColor={"#f1f1f1"}
          flex={1}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            backgroundColor={"#f1f1f1"}
          >
            <Center>
              <Avatar
                bg="#fff"
                size={
                  widthOfScreen * 0.25 > 100
                    ? widthOfScreen * 0.25
                    : widthOfScreen * 0.4
                }
                source={{
                  uri: image,
                }}
              ></Avatar>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={["#00DBDE", "#FC00FF"]}
                style={styles.btnChoiceFile}
              >
                <IconEntypo
                  name="camera"
                  style={{ color: "#fff" }}
                  onPress={pickImage}
                ></IconEntypo>
              </LinearGradient>
            </Center>
            <VStack style={styles.inforUserDetail}>
              {/* Họ và Tên */}
              <VStack
                space="2"
                alignItems="flex-start"
                justifyContent={"space-between"}
                style={styles.inforItemTitle}
              >
                <Heading size={"xs"}>Họ và tên</Heading>
                <HStack
                  space={3}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Controller
                    control={control}
                    rules={{
                      maxLength: 100,
                    }}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Input
                          variant={
                            showUpdateInput.userName ? "underlined" : "unstyled"
                          }
                          paddingLeft={1}
                          isDisabled={showUpdateInput.userName ? false : true}
                          ref={(input) => {
                            this.userNameInput = input;
                          }}
                          InputLeftElement={<Text>-</Text>}
                          placeholder="Nhập thông tin họ và tên"
                          flex={15}
                          fontSize={"md"}
                          value={value}
                          onChangeText={(e) => onChange(e)}
                          returnKeyType="done"
                          onSubmitEditing={() => {
                            handleSubmit();
                          }}
                        />
                      );
                    }}
                    name="userName"
                  ></Controller>
                  <HStack
                    flex={showUpdateInput.userName ? 2 : 1.1}
                    space={1}
                    justifyContent={"flex-end"}
                  >
                    {showUpdateInput.userName ? (
                      <>
                        <IconAntDesign
                          name={"checkcircleo"}
                          size={25}
                          color={"#22c55e"}
                          style={{ position: "relative", bottom: "-10%" }}
                          onPress={() => {
                            handleSubmit();
                          }}
                        ></IconAntDesign>
                        <IconAntDesign
                          name="closecircleo"
                          size={25}
                          color={"#ef4444"}
                          style={{ position: "relative", bottom: "-10%" }}
                          onPress={() => {
                            setShowUpdateInput((item) => ({
                              userName: false,
                            }));
                          }}
                        ></IconAntDesign>
                      </>
                    ) : (
                      <IconAntDesign
                        name={"edit"}
                        size={25}
                        color={"#000"}
                        style={{ position: "relative", bottom: "-10%" }}
                        onPress={() => {
                          setShowUpdateInput(initShowUpdateIpt);
                          setShowUpdateInput((item) => ({
                            userName: true,
                          }));
                        }}
                      ></IconAntDesign>
                    )}
                  </HStack>
                </HStack>
              </VStack>
              {/* Tên hợp tác xã */}
              <VStack
                space="2"
                alignItems="flex-start"
                justifyContent={"space-between"}
                style={styles.inforItemTitle}
              >
                <Heading size={"xs"}>Tên hợp tác xã</Heading>
                <HStack
                  space={3}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Controller
                    control={control}
                    rules={{
                      maxLength: 100,
                    }}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Input
                          variant={
                            showUpdateInput.cooperativeName
                              ? "underlined"
                              : "unstyled"
                          }
                          paddingLeft={1}
                          isDisabled={
                            showUpdateInput.cooperativeName ? false : true
                          }
                          ref={(input) => {
                            this.cooperativeNameInput = input;
                          }}
                          InputLeftElement={<Text>-</Text>}
                          placeholder="Nhập thông tin Tên hợp tác xã"
                          flex={15}
                          fontSize={"md"}
                          value={value}
                          onChangeText={(e) => onChange(e)}
                          returnKeyType="done"
                          onSubmitEditing={() => {
                            handleSubmit();
                          }}
                        />
                      );
                    }}
                    name="cooperativeName"
                  ></Controller>
                  <HStack
                    flex={showUpdateInput.cooperativeName ? 2 : 1.1}
                    space={1}
                    justifyContent={"flex-end"}
                  >
                    {showUpdateInput.cooperativeName ? (
                      <>
                        <IconAntDesign
                          name={"checkcircleo"}
                          size={25}
                          color={"#22c55e"}
                          style={{ position: "relative", bottom: "-10%" }}
                          onPress={() => {
                            handleSubmit();
                          }}
                        ></IconAntDesign>
                        <IconAntDesign
                          name="closecircleo"
                          size={25}
                          color={"#ef4444"}
                          style={{ position: "relative", bottom: "-10%" }}
                          onPress={() => {
                            setShowUpdateInput((item) => ({
                              cooperativeName: false,
                            }));
                          }}
                        ></IconAntDesign>
                      </>
                    ) : (
                      <IconAntDesign
                        name="edit"
                        size={25}
                        color={"#000"}
                        style={{ position: "relative", bottom: "-10%" }}
                        onPress={() => {
                          setShowUpdateInput(initShowUpdateIpt);
                          setShowUpdateInput((item) => ({
                            cooperativeName: true,
                          }));
                        }}
                      ></IconAntDesign>
                    )}
                  </HStack>
                </HStack>
              </VStack>
              {/* Chức vụ */}
              <VStack
                space="2"
                alignItems="flex-start"
                justifyContent={"space-between"}
                style={styles.inforItemTitle}
              >
                <Heading size={"xs"}>Chức vụ</Heading>
                <HStack
                  space={3}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Box
                    flex={15}
                    borderColor={"#000"}
                    borderWidth={showUpdateInput.type && !isIos ? 0.5 : 0}
                    rounded={"2xl"}
                    minHeight={55}
                  >
                    <Controller
                      control={control}
                      rules={{
                        maxLength: 100,
                      }}
                      render={({ field: { onChange, value } }) => {
                        return showUpdateInput.type ? (
                          <Picker
                            itemStyle={{
                              height: 50,
                              fontSize: 15,
                              textAlign: "left",
                              marginLeft: -20,
                            }}
                            selectionColor={"red"}
                            shouldRasterizeIOS
                            selectedValue={value}
                            onValueChange={(itemValue) => onChange(itemValue)}
                          >
                            {listPosition &&
                              listPosition.map((item, index) => {
                                return (
                                  <Picker.Item
                                    key={index}
                                    label={item.positionTitle}
                                    value={item.positionCode}
                                  />
                                );
                              })}
                          </Picker>
                        ) : (
                          <Text
                            height={50}
                            paddingTop={3}
                            fontSize={"md"}
                            color={"#acaca9"}
                          >
                            - {handleShowPosition(value)}
                          </Text>
                        );
                      }}
                      name="type"
                    ></Controller>
                  </Box>
                  <HStack
                    flex={showUpdateInput.type ? 2 : 1.1}
                    space={1}
                    justifyContent={"flex-end"}
                  >
                    {showUpdateInput.type ? (
                      <>
                        <IconAntDesign
                          name={"checkcircleo"}
                          size={25}
                          color={"#22c55e"}
                          style={{ position: "relative", bottom: "-10%" }}
                          onPress={() => {
                            handleSubmit();
                          }}
                        ></IconAntDesign>
                        <IconAntDesign
                          name="closecircleo"
                          size={25}
                          color={"#ef4444"}
                          style={{ position: "relative", bottom: "-10%" }}
                          onPress={() => {
                            setShowUpdateInput((item) => ({
                              type: false,
                            }));
                          }}
                        ></IconAntDesign>
                      </>
                    ) : (
                      <IconAntDesign
                        name={"edit"}
                        size={25}
                        color={"#000"}
                        style={{ position: "relative", bottom: "-10%" }}
                        onPress={() => {
                          setShowUpdateInput(initShowUpdateIpt);
                          setShowUpdateInput((item) => ({
                            type: true,
                          }));
                        }}
                      ></IconAntDesign>
                    )}
                  </HStack>
                </HStack>
              </VStack>
              {/* Địa chỉ */}
              <VStack
                space="2"
                alignItems="flex-start"
                justifyContent={"space-between"}
                style={styles.inforItemTitle}
              >
                <Heading size={"xs"}>Địa chỉ</Heading>
                <HStack
                  space={3}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Controller
                    control={control}
                    rules={{
                      maxLength: 100,
                    }}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Input
                          variant={
                            showUpdateInput.address ? "underlined" : "unstyled"
                          }
                          paddingLeft={1}
                          isDisabled={showUpdateInput.address ? false : true}
                          ref={(input) => {
                            this.addressInput = input;
                          }}
                          numberOfLines={2}
                          InputLeftElement={<Text>-</Text>}
                          placeholder="Nhập thông tin địa chỉ"
                          flex={15}
                          fontSize={"md"}
                          value={value}
                          onChangeText={(e) => onChange(e)}
                          returnKeyType="done"
                          onSubmitEditing={() => {
                            handleSubmit();
                          }}
                        />
                      );
                    }}
                    name="address"
                  ></Controller>
                  <HStack
                    flex={showUpdateInput.address ? 2 : 1.1}
                    space={1}
                    justifyContent={"flex-end"}
                  >
                    {showUpdateInput.address ? (
                      <>
                        <IconAntDesign
                          name={"checkcircleo"}
                          size={25}
                          color={"#22c55e"}
                          style={{ position: "relative", bottom: "-10%" }}
                          onPress={() => {
                            handleSubmit();
                          }}
                        ></IconAntDesign>
                        <IconAntDesign
                          name="closecircleo"
                          size={25}
                          color={"#ef4444"}
                          style={{ position: "relative", bottom: "-10%" }}
                          onPress={() => {
                            setShowUpdateInput((item) => ({
                              address: false,
                            }));
                          }}
                        ></IconAntDesign>
                      </>
                    ) : (
                      <IconAntDesign
                        name={"edit"}
                        size={25}
                        color={"#000"}
                        style={{ position: "relative", bottom: "-10%" }}
                        onPress={() => {
                          setShowUpdateInput(initShowUpdateIpt);
                          setShowUpdateInput((item) => ({
                            address: true,
                          }));
                        }}
                      ></IconAntDesign>
                    )}
                  </HStack>
                </HStack>
              </VStack>
              {/* Tỉnh thành */}
              <VStack
                space="2"
                alignItems="flex-start"
                justifyContent={"space-between"}
                style={styles.inforItemTitle}
              >
                <Heading size={"xs"}>Tỉnh thành</Heading>
                <HStack
                  space={3}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Controller
                    control={control}
                    rules={{
                      maxLength: 100,
                    }}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Input
                          variant={
                            showUpdateInput.province ? "underlined" : "unstyled"
                          }
                          paddingLeft={1}
                          // isDisabled={showUpdateInput.province ? false : true}
                          isDisabled
                          ref={(input) => {
                            this.provinceInput = input;
                          }}
                          InputLeftElement={<Text>-</Text>}
                          placeholder="Nhập thông tin tỉnh thành"
                          flex={15}
                          fontSize={"md"}
                          value={value}
                          onChangeText={(e) => onChange(e)}
                        />
                      );
                    }}
                    name="province"
                  ></Controller>
                  {/* <HStack
                    flex={showUpdateInput.province ? 2 : 1.1}
                    space={1}
                    justifyContent={"flex-end"}
                  >
                    {showUpdateInput.province ? (
                      <>
                        <IconAntDesign
                          name={"checkcircleo"}
                          size={25}
                          color={"#22c55e"}
                          style={{ position: "relative", bottom: "-10%" }}
                          onPress={() => {
                            handleSubmit();
                          }}
                        ></IconAntDesign>
                        <IconAntDesign
                          name="closecircleo"
                          size={25}
                          color={"#ef4444"}
                          style={{ position: "relative", bottom: "-10%" }}
                          onPress={() => {
                            setShowUpdateInput((item) => ({
                              province: false,
                            }));
                          }}
                        ></IconAntDesign>
                      </>
                    ) : (
                      <IconAntDesign
                        name={"edit"}
                        size={25}
                        color={"#000"}
                        style={{ position: "relative", bottom: "-10%" }}
                        onPress={() => {
                          setShowUpdateInput(initShowUpdateIpt);
                          setShowUpdateInput((item) => ({
                            province: true,
                          }));
                        }}
                      ></IconAntDesign>
                    )}
                  </HStack> */}
                </HStack>
              </VStack>
              {/* Ngày */}
              <HStack
                space="2"
                alignItems="center"
                justifyContent={"space-between"}
                style={styles.inforItemTitle}
                width={"100%"}
              >
                <VStack flex={7} space={2}>
                  <Heading size={"xs"}>Ngày bắt đầu</Heading>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return showUpdateInput.date ? (
                        isIos ? (
                          <DateTimePicker
                            style={{ width: 110, height: 50 }}
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
                            backgroundColor={"#dbdbdb"}
                            rounded={"md"}
                            onPress={() => {
                              showDatePickerAndroid(value, onChange);
                            }}
                          >
                            <Text fontSize={16} fontWeight={500}>
                              {convertDateTimeToString(value, "DD/MM/yyyy")}
                            </Text>
                          </Pressable>
                        )
                      ) : (
                        <Text
                          height={50}
                          paddingTop={3}
                          fontSize={"md"}
                          color={"#acaca9"}
                        >
                          - {convertDateTimeToString(value, "DD/MM/yyyy")}
                        </Text>
                      );
                    }}
                    name="registTime"
                  ></Controller>
                </VStack>
                <IconIonicons
                  name="arrow-forward-outline"
                  size={25}
                  style={{ flex: 1 }}
                />
                <VStack flex={7} space={2}>
                  <Heading size={"xs"}>Ngày kết thúc</Heading>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return showUpdateInput.date ? (
                        isIos ? (
                          <DateTimePicker
                            style={{ width: 110, height: 50 }}
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
                            backgroundColor={"#dbdbdb"}
                            rounded={"md"}
                            onPress={() => {
                              showDatePickerAndroid(value, onChange);
                            }}
                          >
                            <Text fontSize={16} fontWeight={500}>
                              {convertDateTimeToString(value, "DD/MM/yyyy")}
                            </Text>
                          </Pressable>
                        )
                      ) : (
                        <Text
                          height={50}
                          paddingTop={3}
                          fontSize={"md"}
                          color={"#acaca9"}
                        >
                          - {convertDateTimeToString(value, "DD/MM/yyyy")}
                        </Text>
                      );
                    }}
                    name="endTime"
                  ></Controller>
                </VStack>
                <HStack
                  flex={showUpdateInput.date ? 2.5 : 1.1}
                  space={1}
                  justifyContent={"flex-end"}
                >
                  {showUpdateInput.date ? (
                    <>
                      <IconAntDesign
                        name={"checkcircleo"}
                        size={25}
                        color={"#22c55e"}
                        style={{ position: "relative", bottom: "-10%" }}
                        onPress={() => {
                          handleSubmit();
                        }}
                      ></IconAntDesign>
                      <IconAntDesign
                        name="closecircleo"
                        size={25}
                        color={"#ef4444"}
                        style={{ position: "relative", bottom: "-10%" }}
                        onPress={() => {
                          setShowUpdateInput((item) => ({
                            date: false,
                          }));
                        }}
                      ></IconAntDesign>
                    </>
                  ) : (
                    <IconAntDesign
                      name={"edit"}
                      size={25}
                      color={"#000"}
                      style={{ position: "relative", bottom: "-10%" }}
                      onPress={() => {
                        setShowUpdateInput(initShowUpdateIpt);
                        setShowUpdateInput((item) => ({
                          date: true,
                        }));
                      }}
                    ></IconAntDesign>
                  )}
                </HStack>
              </HStack>
            </VStack>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <VStack
          w="90%"
          maxW="400"
          borderWidth="1"
          space={6}
          rounded="md"
          alignItems="center"
          _dark={{
            borderColor: "coolGray.500",
          }}
          _light={{
            borderColor: "coolGray.200",
          }}
        >
          <Skeleton h="40" />
          <Skeleton
            borderWidth={1}
            borderColor="coolGray.200"
            endColor="warmGray.50"
            size="32"
            rounded="full"
            mt="-70"
          />
          <HStack space="2">
            <Skeleton size="5" rounded="full" />
            <Skeleton size="5" rounded="full" />
            <Skeleton size="5" rounded="full" />
            <Skeleton size="5" rounded="full" />
            <Skeleton size="5" rounded="full" />
          </HStack>
          <Skeleton.Text lines={3} alignItems="center" px="12" />
          <Skeleton mb="3" w="40" rounded="20" />
        </VStack>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  gradient: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    height: 40,
  },
  inforUserDetail: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: "2%",
  },
  inforItemTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 10,
  },
  btnChoiceFile: {
    width: 20,
    height: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    position: "absolute",
    bottom: 0,
    right: Dimensions.get("window").width / 2 - 40,
  },
});

export default InforAccountScreen;
