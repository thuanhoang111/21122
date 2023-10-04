import {
  Alert,
  Button,
  CloseIcon,
  HStack,
  IconButton,
  NativeBaseProvider,
  Text,
  VStack,
  Toast,
} from "native-base";
import { useEffect, useRef, useState } from "react";
import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import { Divider, List, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StoreInfoUser } from "../../constants/API";
import IconIonicons from "react-native-vector-icons/Ionicons";
import { View } from "react-native";

import * as Post from "../../API/service/Post";
import { TextField } from "react-native-material-textfield";

function SettingScreen() {
  const id = "test-toast";

  const [expandedPassword, setExpandedPassword] = useState(false);
  const [expandedInfoVersion, setExpandedInfoVersion] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const currentPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);

  const [showError, setShowError] = useState({});
  // const [sho]

  const [isDisableBtnSubmit, setIsDisableBtnSubmit] = useState(false);
  const [isHiddenPassword, setIsHiddenPassword] = useState(false);
  const [dataUser, setDataUser] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const handleShowAccordion = (callback, state) => callback(!state);

  const getUserID = async () => {
    try {
      const infoUserGet = await AsyncStorage.getItem(StoreInfoUser);
      let jsonUser = JSON.parse(infoUserGet);
      setDataUser(jsonUser);
    } catch (error) {}
  };

  const ToastAlert = ({
    id,
    status,
    variant,
    title,
    description,
    isClosable,
    ...rest
  }) => (
    <Alert
      maxWidth="100%"
      alignSelf="center"
      flexDirection="row"
      status={status ? status : "error"}
      variant={variant}
      {...rest}
    >
      <VStack space={1} flexShrink={1} w="90%">
        <HStack
          flexShrink={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text
              fontSize="md"
              fontWeight="medium"
              flexShrink={1}
              color={
                variant === "solid"
                  ? "lightText"
                  : variant !== "outline"
                  ? "darkText"
                  : null
              }
            >
              {title}
            </Text>
          </HStack>
        </HStack>
        <Text
          px="6"
          color={
            variant === "solid"
              ? "lightText"
              : variant !== "outline"
              ? "darkText"
              : null
          }
        >
          {description}
        </Text>
      </VStack>
    </Alert>
  );

  useEffect(() => {
    getUserID();
  }, []);
  const handleSubmit = async () => {
    setIsLoading(true);
    await Post.postWithParam(
      `ChangePassword`,
      `userID_PW=${dataUser.UserInfo.id}&oldpassword=${currentPassword}&newpassword=${newPassword}`
    )
      .then((data) => {
        setShowError(data);
        newPasswordRef.current.clear();
        currentPasswordRef.current.clear();
        confirmPasswordRef.current.clear();
        {
          data.code === "0" &&
            Toast.show({
              placement: "top",
              render: () => {
                return (
                  <ToastAlert
                    status={data.code === "0" && "success"}
                    {...{
                      title: "Thông báo ",
                      variant: "top-accent",
                      description: data.errorDescription,
                      isClosable: true,
                    }}
                  />
                );
              },
            });
        }
        if (data.code === "-2") {
          currentPasswordRef.current.focus();
        } else if (data.code === "-3") {
          newPasswordRef.current.focus();
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        alert(error);
      });
  };
  const checkRegex = () => {
    if (
      newPassword.length > 0 &&
      currentPassword.length > 0 &&
      confirmPassword.length > 0 &&
      newPassword === confirmPassword
    ) {
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPassword("");
  }, [expandedPassword]);
  const handleShowAlertSubmit = () => {
    setShowError({
      code: "1",
      errorDescription: "Vui lòng nhập đầy đủ các thông tin",
    });
  };
  useEffect(() => {
    const isSubmit = checkRegex();
    setIsDisableBtnSubmit(isSubmit);
  }, [confirmPassword, newPassword, currentPassword]);

  const handleCheckError = (field, code, inforError) => {
    if (field.length === 0) {
      if (inforError.code === "1" || inforError.code === code) {
        return inforError.errorDescription;
      }
    }
  };
  return (
    <NativeBaseProvider>
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
              top: 19,
              zIndex: 100,
            }}
          >
            <IconIonicons
              onPress={() => setIsHiddenPassword(!isHiddenPassword)}
              name={isHiddenPassword ? "eye-off" : "eye"}
              size={25}
            ></IconIonicons>
          </View>
          <View style={{ width: widthOfScreen * 0.95 }}>
            <TextField
              label="Mật khẩu hiện tại"
              value={currentPassword}
              onChangeText={(currentPassword) =>
                setCurrentPassword(currentPassword)
              }
              secureTextEntry={isHiddenPassword ? false : true}
              ref={currentPasswordRef}
              error={handleCheckError(currentPassword, "-2", showError)}
              labelTextStyle={{ paddingTop: 5 }}
            />
            <TextField
              label="Mật khẩu mới"
              value={newPassword}
              onChangeText={(newPassword) => setNewPassword(newPassword)}
              secureTextEntry={isHiddenPassword ? false : true}
              ref={newPasswordRef}
              labelTextStyle={{ paddingTop: 5 }}
              error={handleCheckError(newPassword, "-3", showError)}
            />
            <TextField
              label="Xác nhận mật khẩu mới"
              ref={confirmPasswordRef}
              value={confirmPassword}
              onChangeText={(confirmPassword) =>
                setConfirmPassword(confirmPassword)
              }
              contextMenuHidden={true}
              secureTextEntry={isHiddenPassword ? false : true}
              error={handleCheckError(confirmPassword, "-3", showError)}
              onBlur={() => confirmPasswordRef.current.clear()}
              labelTextStyle={{ paddingTop: 5 }}
            />
            <List.Item
              descriptionNumberOfLines={3}
              description={
                <Button
                  background={isDisableBtnSubmit ? "#dc764c" : "#8d8e9c"}
                  padding={0}
                  height={8}
                  style={{ width: widthOfScreen * 0.7 }}
                  margin={"auto"}
                  borderRadius={20}
                  onPress={() => {
                    isDisableBtnSubmit
                      ? handleSubmit()
                      : handleShowAlertSubmit();
                  }}
                  isLoading={isLoading}
                  isLoadingText="Đang xử lý"
                  _pressed={{ opacity: 0.8 }}
                >
                  xác nhận
                </Button>
              }
            ></List.Item>
          </View>
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
          <List.Item title="Phiên bản thử nghiệm 1 " />
          <List.Item title="Phiên bản thử nghiệm 2" />
        </List.Accordion>
      </List.Section>
    </NativeBaseProvider>
  );
}
const widthOfScreen = Dimensions.get("window").width;
const style = StyleSheet.create({
  input: {
    width: 800,
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginRight: "auto",
    marginLeft: 10,
    borderRadius: 5,
    borderColor: "#bdbdc7",
  },
});
export default SettingScreen;
