import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Dimensions, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

import {
  Avatar,
  NativeBaseProvider,
  HStack,
  VStack,
  Skeleton,
  Center,
  ScrollView,
  Divider,
  Button,
  Icon,
} from "native-base";
import { AuthContext } from "../components/context";
import { StoreInfoUser } from "../constants/API";
import { List } from "react-native-paper";
import moment from "moment";
import MaskedView from "@react-native-masked-view/masked-view";

const InfoScreen = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);

  const initialInfoUser = {
    uni_k_code: Number,
    userID: "",
    userName: "",
    startDay: "",
    endDay: "",
    label: "",
  };
  const [infoUser, setInfoUser] = useState(initialInfoUser);

  const getUserID = async () => {
    try {
      const infoUserGet = await AsyncStorage.getItem(StoreInfoUser);
      let jsonUser = JSON.parse(infoUserGet);
      setInfoUser({
        ...infoUser,
        uni_k_code: jsonUser.UserInfo.uni_k_code,
        userID: jsonUser.UserInfo.id,
        userName: jsonUser.UserInfo.name,
        startDay: moment(jsonUser.UserInfo.registtime).format("DD/MM/yyyy"),
        endDay: moment(jsonUser.UserInfo.endtime).format("DD/MM/yyyy"),
        label: jsonUser.UserInfo.type,
        address: jsonUser.KanriInfo.Table[0].adres1,
        province: jsonUser.BranchInfo.Table[0].name,
        cooperativeName: jsonUser.KanriInfo.Table[0].name,
      });
    } catch (error) {}
  };

  useEffect(() => {
    getUserID();
  }, []);

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
  return (
    <NativeBaseProvider>
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView>
          <View style={styles.body}>
            <View style={styles.imageUser}>
              {infoUser.userID ? (
                <>
                  <HStack justifyContent="center" space={2}>
                    <Avatar
                      bg="#fff"
                      size="2xl"
                      source={{
                        uri: "https://firebasestorage.googleapis.com/v0/b/appchatzala.appspot.com/o/Screenshot%202023-06-08%20094702.png?alt=media&token=f2dbd21f-8643-4505-a335-f69d964d38ce&_gl=1*fkiao5*_ga*MTc2MTM4NjIuMTY3NTkxODU2NA..*_ga_CW55HF8NVT*MTY4NjE5MjMyNC4xMy4xLjE2ODYxOTI0NDMuMC4wLjA.",
                      }}
                    >
                      {infoUser.userName}
                    </Avatar>
                  </HStack>

                  <View style={styles.infoUser}>
                    <MaskedView
                      style={{ height: 24 }}
                      maskElement={
                        <Text
                          style={{
                            textAlign: "center",
                            fontSize: 20,
                            fontWeight: 600,
                            backgroundColor: "transparent",
                            color: "#fff",
                          }}
                        >
                          {infoUser.userName}
                        </Text>
                      }
                    >
                      <LinearGradient
                        colors={["#4facfe", "#00f2fe"]}
                        style={{ flex: 1 }}
                      />
                    </MaskedView>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 12,
                        fontWeight: 300,
                      }}
                    >
                      {handleShowPosition(infoUser.label)}
                    </Text>
                  </View>

                  <List.Section title="Thông tin cá nhân">
                    <List.Accordion
                      titleStyle={{ fontWeight: 600 }}
                      title="Tài khoản"
                      expanded={false}
                      left={(props) => (
                        <List.Icon {...props} icon="account-circle"></List.Icon>
                      )}
                      right={(props) => (
                        <List.Icon {...props} icon="chevron-right"></List.Icon>
                      )}
                      onPress={() =>
                        navigation.navigate("Thông tin tài khoản", infoUser)
                      }
                    ></List.Accordion>
                    <Divider></Divider>
                    <List.Accordion
                      title="Cài Đặt"
                      titleStyle={{ fontWeight: 600 }}
                      left={(props) => (
                        <List.Icon {...props} icon="cog-outline"></List.Icon>
                      )}
                      right={(props) => (
                        <List.Icon {...props} icon="chevron-right"></List.Icon>
                      )}
                      expanded={false}
                      onPress={() => navigation.navigate("Thông tin cài đặt")}
                    ></List.Accordion>
                  </List.Section>

                  <View
                    style={{
                      position: "relative",
                      bottom: 0,
                      borderRadius: 20,
                      marginBottom: 20,
                    }}
                  >
                    <Button
                      background="#dc764c"
                      padding={0}
                      height={8}
                      width={"85%"}
                      margin={"auto"}
                      borderRadius={20}
                      onPress={() => signOut(infoUser.userID)}
                      // leftIcon={
                      //   <IconMaterialCommunity
                      //     name="logout"
                      //     size={20}
                      //     style={{ opacity: 0.5 }}
                      //   ></IconMaterialCommunity>
                      // }
                    >
                      Đăng xuất
                    </Button>
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
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

export default InfoScreen;

const width = Dimensions.get("window").width - 20;
const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "auto",
    height: 64,
    backgroundColor: "#fff",
  },
  headerName: {
    margin: "auto",
    padding: "auto",
    fontSize: 20,
    fontWeight: 600,
  },
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
  block_1: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#309ee7",
    borderRadius: 10,
  },
  account_name: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: "white",
    margin: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#309ee7",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar_info: {},
  avatar_name: {
    fontSize: 24,
    color: "white",
  },
  block_2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    margin: 10,
    marginTop: 3,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "white",
    borderRadius: 7,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: "#309ee7",
  },
  block_2_item: {
    width: width - 20,
    padding: 20,
    paddingLeft: 10,
    paddingRight: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  block_2_title: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  block_2_icon: {
    fontSize: 28,
  },
  block_logout_item: {
    padding: 20,
    paddingLeft: 10,
    paddingRight: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  block_logout: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: width - 220,
    marginLeft: width - 120,
    paddingTop: 40,
    borderRadius: 10,
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
  text_Logout: {
    color: "white",
    fontSize: 20,
    justifyContent: "center",
    paddingBottom: 5,
  },
  inforUser: {},
  imageUser: {
    marginTop: 20,
  },
});
