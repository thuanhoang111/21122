import React, {  useState } from "react";
import { View, StyleSheet, SafeAreaView, Dimensions  } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  Avatar,
  NativeBaseProvider,
  HStack,
  VStack,
  Skeleton,
  Center,
  ScrollView,
} from "native-base";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import IconEntypo from "react-native-vector-icons/Entypo";
import DialogInfor from "./../../components/DialogInfor";
import {
  List,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
function InforAccountScreen({ navigation, route }) {
  const handleShowPosition = (idPosition) => {
    switch (idPosition) {
      case 4:
        return "Kế Toán";
        break;
      case 7:
        return "Giám đốc";
        break;
      default:
        return "Chưa có chức vụ ";
        break;
    }
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
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  const [image, setImage] = useState(
    "https://firebasestorage.googleapis.com/v0/b/appchatzala.appspot.com/o/Screenshot%202023-06-08%20094702.png?alt=media&token=f2dbd21f-8643-4505-a335-f69d964d38ce&_gl=1*fkiao5*_ga*MTc2MTM4NjIuMTY3NTkxODU2NA..*_ga_CW55HF8NVT*MTY4NjE5MjMyNC4xMy4xLjE2ODYxOTI0NDMuMC4wLjA."
  );
  const [infoUser, setInfoUser] = useState(route.params);
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [inforOfField, setInforOfField] = useState();
  //  Author:ThuanHoang 05/06/2023 
  //  Handle show dialog
  const handleShowDialog = (title, field, value) => {
    setInforOfField({ title: title, field: field, value: value });
    setIsShowDialog(true);
  };
  return (
    <NativeBaseProvider>
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView>
          <View style={styles.body}>
            <View style={styles.imageUser}>
              {infoUser.userID ? (
                <>
                  <Center>
                    <Avatar
                      bg="#fff"
                      size="2xl"
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
                  <View style={styles.inforUserDetail}>
                    <List.Item
                      title="Họ và tên"
                      description={
                        infoUser
                          ? infoUser.userName
                            ? "- " + infoUser.userName
                            : "-"
                          : "-"
                      }
                      titleStyle={styles.inforItemTitle}
                      right={(props) => (
                        <IconAntDesign
                          name="edit"
                          size={15}
                          onPress={() =>
                            handleShowDialog(
                              "họ và tên",
                              "userName",
                              infoUser.userName
                            )
                          }
                        ></IconAntDesign>
                      )}
                    />
                    <List.Item
                      title="Chức vụ"
                      description={"- " + handleShowPosition(infoUser.label)}
                      titleStyle={styles.inforItemTitle}
                      right={(props) => (
                        <IconAntDesign
                          name="edit"
                          size={15}
                          style={{ position: "relative", bottom: "-10%" }}
                          onPress={() =>
                            handleShowDialog("Chức vụ", "label", infoUser.label)
                          }
                        ></IconAntDesign>
                      )}
                    />
                    <List.Item
                      title="Địa chỉ"
                      description={
                        infoUser
                          ? infoUser.address
                            ? "- " + infoUser.address
                            : "-"
                          : "-"
                      }
                      titleStyle={styles.inforItemTitle}
                      right={(props) => (
                        <IconAntDesign
                          name="edit"
                          size={15}
                          style={{ position: "relative", bottom: "-10%" }}
                          onPress={() =>
                            handleShowDialog(
                              "Địa chỉ",
                              "address",
                              infoUser.label
                            )
                          }
                        ></IconAntDesign>
                      )}
                    />
                    <List.Item
                      title="Tỉnh thành "
                      description={
                        infoUser
                          ? infoUser.province
                            ? "- " + infoUser.province
                            : "-"
                          : "-"
                      }
                      titleStyle={styles.inforItemTitle}
                      right={(props) => (
                        <IconAntDesign
                          name="edit"
                          size={15}
                          style={{ position: "relative", bottom: "-10%" }}
                          onPress={() =>
                            handleShowDialog(
                              "Tỉnh thành",
                              "province",
                              infoUser.label
                            )
                          }
                        ></IconAntDesign>
                      )}
                    />
                    <List.Item
                      title="Ngày bắt đầu "
                      description={
                        infoUser
                          ? infoUser.startDay
                            ? "- " + infoUser.startDay
                            : "-"
                          : "-"
                      }
                      titleStyle={styles.inforItemTitle}
                      right={(props) => (
                        <IconAntDesign
                          name="edit"
                          size={15}
                          style={{ position: "relative", bottom: "-10%" }}
                          onPress={() =>
                            handleShowDialog(
                              "Ngày bắt đầu",
                              "startDay",
                              infoUser.startDay
                            )
                          }
                        ></IconAntDesign>
                      )}
                    />
                    <List.Item
                      title="Ngày kết thúc"
                      description={
                        infoUser
                          ? infoUser.endDay
                            ? "- " + infoUser.endDay
                            : "-"
                          : "-"
                      }
                      titleStyle={styles.inforItemTitle}
                      right={(props) => (
                        <IconAntDesign
                          name="edit"
                          size={15}
                          style={{ position: "relative", bottom: "-10%" }}
                          onPress={() =>
                            handleShowDialog(
                              "Ngày kết thúc",
                              "endDay",
                              infoUser.endDay
                            )
                          }
                        ></IconAntDesign>
                      )}
                    />
                    <List.Item
                      title="Tên hợp tác xã"
                      description={
                        infoUser
                          ? infoUser.cooperativeName
                            ? "- " + infoUser.cooperativeName
                            : "-"
                          : "-"
                      }
                      titleStyle={styles.inforItemTitle}
                      right={(props) => (
                        <IconAntDesign
                          name="edit"
                          size={15}
                          style={{ position: "relative", bottom: "-10%" }}
                          onPress={() =>
                            handleShowDialog(
                              "Tên hợp tác xã",
                              "cooperativeName",
                              infoUser.cooperativeName
                            )
                          }
                        ></IconAntDesign>
                      )}
                    />
                  </View>
                </>
              ) : (
                <>
                  <Center w="100%">
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
                  </Center>
                </>
              )}
            </View>
          </View>
        </ScrollView>
        {isShowDialog && (
          <DialogInfor
            isShowDialog={isShowDialog}
            setIsShowDialog={setIsShowDialog}
            inforOfField={inforOfField}
            inforUser={infoUser}
            setInforUser={setInfoUser}
          ></DialogInfor>
        )}
      </SafeAreaView>
    </NativeBaseProvider>
  );
}
const width = Dimensions.get("window").width - 20;
const styles = StyleSheet.create({
  infoUser: {
    paddingTop: 10,
  },
  safeContainer: {
    backgroundColor: "#eaeae9",
  },
  body: {
    position: "relative",
    minHeight: Dimensions.get("window").height,
  },
  gradient: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    height: 40,
  },
  button: {
    width: "70%",
  },
  imageUser: {
    marginTop: 20,
  },
  inforUserDetail: {
    paddingHorizontal: "5%",
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
