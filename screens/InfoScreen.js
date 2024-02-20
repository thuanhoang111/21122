import React, { createContext, useContext, useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Dimensions, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import {
  Avatar,
  HStack,
  VStack,
  Skeleton,
  Center,
  ScrollView,
  Divider,
  Button,
} from "native-base";
import { List } from "react-native-paper";
import MaskedView from "@react-native-masked-view/masked-view";
import { InforUserContext } from "./InforAccount/InforUserContext";
import { AuthContext } from "../components/context";
import Header from "../components/Header/Header";

const InfoScreen = ({ navigation }) => {
  const context = useContext(InforUserContext);
  const { signOut } = useContext(AuthContext);

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
  return (
    <>
      <Header title={"Thông tin chính"}></Header>
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView>
          <View style={styles.body}>
            <View style={styles.imageUser}>
              {context.inforUser.userID ? (
                <>
                  <HStack justifyContent="center" space={2}>
                    <Avatar
                      bg="#fff"
                      size="2xl"
                      source={{
                        uri: "https://firebasestorage.googleapis.com/v0/b/waca-4c0b4.appspot.com/o/icon.png?alt=media&token=ff1120d2-5a12-4ab4-87ad-7528bfff5f69",
                      }}
                    >
                      {context.inforUser.userName}
                    </Avatar>
                  </HStack>

                  <View style={styles.inforUser}>
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
                          {context.inforUser.userName}
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
                      {handleShowPosition(context.inforUser.label)}
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
                      onPress={() => navigation.navigate("Thông tin tài khoản")}
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
                      onPress={() => signOut(context.inforUser.userID)}
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
    </>
  );
};

export default InfoScreen;

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: "#eaeae9",
  },
  body: {
    position: "relative",
    minHeight: Dimensions.get("window").height,
  },
  imageUser: {
    marginTop: 20,
  },
});
