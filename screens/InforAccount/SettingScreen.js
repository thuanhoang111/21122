import {
  Button,
  VStack,
  WarningOutlineIcon,
  Input,
  FormControl,
  useToast,
} from "native-base";
import { useEffect, useState } from "react";
import { Keyboard, SafeAreaView } from "react-native";
import { Divider, List } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StoreInfoUser } from "../../constants/API";
import IconIonicons from "react-native-vector-icons/Ionicons";
import { View } from "react-native";
import * as Post from "../../API/service/Post";
import { useObjectState } from "@uidotdev/usehooks";
import { Controller, useForm } from "react-hook-form";
import ToastNotification from "../../components/CustomToast/ToastNotification";
import { widthOfScreen } from "./../../constants/ConstantMain";
import Header from "../../components/Header/Header";
import * as Application from "expo-application";

function SettingScreen({ navigation, route }) {
  const toast = useToast();
  const initialError = {
    currentPasswordError: false,
    newPasswordError: false,
    confirmPasswordError: false,
    confirmPasswordText: "Vui lòng nhập đầy đủ các thông tin",
  };
  const [expandedPassword, setExpandedPassword] = useState(false);
  const [expandedInfoVersion, setExpandedInfoVersion] = useState(false);
  const [isHiddenPassword, setIsHiddenPassword] = useState(true);
  const [dataUser, setDataUser] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useObjectState(initialError);
  const { control, reset, getValues } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const handleShowAccordion = (callback, state) => callback(!state);

  const getUserID = async () => {
    try {
      const infoUserGet = await AsyncStorage.getItem(StoreInfoUser);
      let jsonUser = JSON.parse(infoUserGet);
      setDataUser(jsonUser);
    } catch (error) {}
  };
  useEffect(() => {
    getUserID();
  }, []);
  const handleShowError = (data) => {
    data.currentPassword.trim() === "" &&
      setShowError(() => ({
        currentPasswordError: true,
      }));
    data.newPassword.trim() === "" &&
      setShowError(() => ({
        newPasswordError: true,
      }));
    data.confirmPassword.trim() === "" &&
      setShowError(() => ({
        confirmPasswordError: true,
      }));
  };
  const handleChangePassword = async (data) => {
    setIsLoading(true);
    await Post.handlePostWithBody(`ChangePassword`, {
      userID_PW: dataUser.UserInfo.id,
      oldpassword: data.currentPassword,
      newpassword: data.newPassword,
    })
      .then((data) => {
        reset();
        data &&
          toast.show({
            avoidKeyboard: true,
            placement: "top",
            duration: 2000,
            render: ({ id }) => {
              return (
                <ToastNotification
                  id={id}
                  status={data.code === "0" ? "success" : "error"}
                  variant={"left-accent"}
                  title={"Thông báo"}
                  description={data.errorDescription}
                  onClose={() => toast.close(id)}
                />
              );
            },
          });
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.show({
          render: () => {
            return (
              <ToastNotification
                variant={"left-accent"}
                title={"Thông báo"}
                status={"error"}
                description={"Đã xảy khi thực hiện chức năng"}
              />
            );
          },
        });
      });
  };
  const handleSubmit = async () => {
    Keyboard.dismiss();
    setShowError(initialError);
    let data = getValues();
    if (
      data.confirmPassword !== "" &&
      data.currentPassword !== "" &&
      data.newPassword !== ""
    ) {
      data.confirmPassword !== data.newPassword
        ? setShowError(() => ({
            confirmPasswordError: true,
            confirmPasswordText: "Xác nhận mật khẩu không đúng",
          }))
        : handleChangePassword(data);
    } else {
      handleShowError(data);
    }
  };
  return (
    <>
      <Header
        onBack={() => navigation.goBack()}
        title={"Thông tin tài khoản"}
      ></Header>
      <SafeAreaView>
        <List.Section>
          <List.Accordion
            title="Thay đổi mật khẩu"
            titleStyle={{ fontSize: 18, fontWeight: 500, color: "black" }}
            expanded={expandedPassword}
            onPress={() =>
              handleShowAccordion(setExpandedPassword, expandedPassword)
            }
            left={(props) => (
              <List.Icon {...props} color="#8ecb63" icon="key-variant" />
            )}
          >
            <View
              style={{
                alignSelf: "flex-end",
                padding: 0,
                position: "relative",
                right: 20,
                top: 5,
                zIndex: 100,
              }}
            >
              <IconIonicons
                onPress={() => setIsHiddenPassword(!isHiddenPassword)}
                name={isHiddenPassword ? "eye-off" : "eye"}
                size={25}
              ></IconIonicons>
            </View>
            <VStack space={5} style={{ width: widthOfScreen * 0.95 }}>
              <FormControl
                isInvalid={showError.currentPasswordError ? true : false}
                w="100%"
                maxW="300px"
              >
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <Input
                        size={"lg"}
                        placeholder="Nhập mật khẩu hiện tại"
                        onFocus={() => {
                          setShowError(() => ({
                            currentPasswordError: false,
                          }));
                        }}
                        variant={"underlined"}
                        value={value}
                        type={isHiddenPassword ? "password" : "text"}
                        onChangeText={(e) => onChange(e)}
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          this.secondTextInput.focus();
                        }}
                      />
                    );
                  }}
                  name="currentPassword"
                ></Controller>
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Vui lòng nhập đầy đủ các thông tin
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={showError.newPasswordError ? true : false}
                w="100%"
                maxW="300px"
              >
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <Input
                        size={"lg"}
                        placeholder="Nhập mật khẩu mới"
                        onFocus={() => {
                          setShowError(() => ({
                            newPasswordError: false,
                          }));
                        }}
                        variant={"underlined"}
                        value={value}
                        type={isHiddenPassword ? "password" : "text"}
                        onChangeText={(e) => onChange(e)}
                        ref={(input) => {
                          this.secondTextInput = input;
                        }}
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          this.thirdTextInput.focus();
                        }}
                      />
                    );
                  }}
                  name="newPassword"
                ></Controller>
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Vui lòng nhập đầy đủ các thông tin
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={showError.confirmPasswordError ? true : false}
                w="100%"
                maxW="300px"
              >
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <Input
                        size={"lg"}
                        placeholder="Xác nhận mật khẩu mới"
                        onFocus={() => {
                          setShowError(() => ({
                            confirmPasswordError: false,
                          }));
                        }}
                        variant={"underlined"}
                        value={value}
                        type={isHiddenPassword ? "password" : "text"}
                        onChangeText={(e) => onChange(e)}
                        ref={(input) => {
                          this.thirdTextInput = input;
                        }}
                      />
                    );
                  }}
                  name="confirmPassword"
                ></Controller>
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {showError.confirmPasswordText}
                </FormControl.ErrorMessage>
              </FormControl>
              <Button
                background={"#dc764c"}
                paddingY={10}
                height={10}
                marginY={5}
                borderRadius={20}
                onPress={() => {
                  handleSubmit();
                }}
                isLoading={isLoading}
                isLoadingText="Đang xử lý"
                _pressed={{ opacity: 0.8 }}
              >
                xác nhận
              </Button>
            </VStack>
          </List.Accordion>
          <Divider></Divider>
          <List.Accordion
            title="Thông tin phiên bản"
            expanded={expandedInfoVersion}
            onPress={() =>
              handleShowAccordion(setExpandedInfoVersion, expandedInfoVersion)
            }
            titleStyle={{ fontSize: 18, fontWeight: 500, color: "black" }}
            left={(props) => (
              <List.Icon {...props} color="#8ecb63" icon="information" />
            )}
          >
            <List.Item
              title={`Phiên bản hiện tại: ${Application.nativeBuildVersion}`}
            />
          </List.Accordion>
        </List.Section>
      </SafeAreaView>
    </>
  );
}
export default SettingScreen;
