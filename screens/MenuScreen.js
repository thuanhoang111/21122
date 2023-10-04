import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { StoreInfoUser } from "../constants/API";
import { Image } from "react-native";
import { HStack, VStack } from "native-base";

function MenuScreen({ navigation }) {
  const [dataUser, setDataUser] = useState();
  const getUserID = async () => {
    try {
      const infoUserGet = await AsyncStorage.getItem(StoreInfoUser);
      let jsonUser = JSON.parse(infoUserGet);
      setDataUser(jsonUser.UserInfo);
    } catch (error) {}
  };
  useEffect(() => {
    getUserID();
  }, []);
  const AlertBuilding = () =>
    Alert.alert("Thông báo", "Chức năng đang phát triển. Xin cám ơn", [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Hàng số 1 */}
        <View style={[styles.divideRow, styles.styleRow1]}>
          <TouchableOpacity
            style={[styles.styleButton, styles.shadowProp, styles.elevation]}
            onPress={() =>
              navigation.navigate("Báo cáo tài chính", { data: dataUser })
            }
          >
            <VStack alignItems={"center"} style={{ paddingVertical: 40 }}>
              <Image
                style={styles.icon}
                source={require("../assets/iconHomeScreen/taiChinh2.png")}
              ></Image>
              <Text style={styles.titleTag}>Báo cáo tài chính</Text>
            </VStack>
          </TouchableOpacity>
          <View style={{ flex: 0.1 }} />
          <TouchableOpacity
            style={[styles.styleButton, styles.shadowProp, styles.elevation]}
            // onPress={() => navigation.navigate("Tra cứu công nợ")}
            onPress={() => {
              navigation.navigate("Sổ tiền gửi ngân hàng", { data: dataUser });
            }}
          >
            <VStack alignItems={"center"}>
              <Image
                style={styles.icon}
                source={require("../assets/iconHomeScreen/congNo.png")}
              ></Image>
              <Text style={styles.titleTag}>Sổ tiền gửi ngân hàng </Text>
            </VStack>
          </TouchableOpacity>
        </View>

        {/* Hàng số 2 */}
        <View style={styles.divideRow}>
          <TouchableOpacity
            style={[styles.styleButton, styles.shadowProp, styles.elevation]}
            onPress={() =>
              navigation.navigate("Sổ quỹ tiền mặt", { data: dataUser })
            }
          >
            <VStack alignItems={"center"} style={{ paddingVertical: 40 }}>
              {/* <Icon
                style={{ textAlign: "center" }}
                name="chart-line"
                size={60}
                color="#FF6699"
              ></Icon> */}
              <Image
                style={styles.icon}
                source={require("../assets/iconHomeScreen/tonKho.png")}
              ></Image>
              <Text style={styles.titleTag}>Sổ quỹ tiền mặt</Text>
            </VStack>
          </TouchableOpacity>
          <View />
          <TouchableOpacity
            style={[styles.styleButton, styles.shadowProp, styles.elevation]}
            onPress={() =>
              navigation.navigate("Nhập xuất tồn", { data: dataUser })
            }
          >
            <VStack alignItems={"center"}>
              <Image
                style={styles.icon}
                source={require("../assets/iconHomeScreen/loiNhuan.png")}
              ></Image>
              <Text style={styles.titleTag}>Nhập xuất tồn </Text>
            </VStack>
          </TouchableOpacity>
        </View>

        {/* Hàng số 3 */}
        <View style={styles.divideRow}>
          <TouchableOpacity
            style={[styles.styleButton, styles.shadowProp, styles.elevation]}
            onPress={() =>
              navigation.navigate("Phân tích chi phí", { data: dataUser })
            }
          >
            <VStack alignItems={"center"} style={{ paddingVertical: 40 }}>
              <Image
                style={styles.icon}
                source={require("../assets/iconHomeScreen/chiPhi.png")}
              ></Image>
              <Text style={styles.titleTag}>Phân tích chi phí</Text>
            </VStack>
          </TouchableOpacity>
          <View style={{ flex: 0.1 }} />
          <TouchableOpacity
            style={[styles.styleButton, styles.shadowProp, styles.elevation]}
            onPress={() =>
              navigation.navigate("Theo dõi công nợ", { data: dataUser })
            }
          >
            <VStack alignItems={"center"} style={{ paddingVertical: 50 }}>
              <Image
                style={styles.icon}
                source={require("../assets/iconHomeScreen/doanhThu.png")}
              ></Image>
              <Text style={styles.titleTag}>Theo dõi công nợ</Text>
            </VStack>
          </TouchableOpacity>
        </View>
        {/* Hàng số 3 */}
        <View style={styles.divideRow}>
          <TouchableOpacity
            style={[styles.styleButton, styles.shadowProp, styles.elevation]}
            onPress={() => {
              AlertBuilding();
            }}
          >
            <View style={{ paddingVertical: 50 }}>
              <Icon
                style={{ textAlign: "center" }}
                name="clipboard-list"
                size={60}
                color="#008080"
              ></Icon>
              <Text style={styles.titleTag}>Theo dõi vay nợ asdasd</Text>
            </View>
          </TouchableOpacity>
          <View style={{ flex: 0.1 }} />
          <TouchableOpacity
            style={[styles.styleButton, styles.shadowProp, styles.elevation]}
            onPress={() => {
              AlertBuilding();
            }}
          >
            <View style={{ paddingVertical: 50 }}>
              <Icon
                style={{ textAlign: "center" }}
                name="database"
                size={60}
                color="#FFA500"
              ></Icon>
              <Text style={styles.titleTag}>Đối tượng thu chi sadasd</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
  },
  titleTag: {
    textAlign: "center",
    paddingTop: 7,
    color: "#009087",
    fontWeight: 500,
  },
  divideRow: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },

  styleButton: {
    backgroundColor: "#fff",
    flex: 2,
    borderRadius: 10,
    marginBottom: 5,
    justifyContent: "center",
    margin: 10,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  styleRow1: {
    marginTop: 15,
  },
  elevation: {
    elevation: 5,
    shadowColor: "#52006A",
  },
  icon: {
    width: 70,
    height: 70,
  },
});
