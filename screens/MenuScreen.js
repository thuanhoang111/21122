import React, { useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { Image } from "react-native";
import { Modal, ScrollView, VStack } from "native-base";
import { MainContext } from "./MainContext";
import LottieView from "lottie-react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";
import { primaryColor } from "../constants/ConstantStyle";
function MenuScreen({ navigation }) {
  const AlertBuilding = () =>
    Alert.alert("Thông báo", "Chức năng đang phát triển. Xin cám ơn", [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  const mainContext = useContext(MainContext);
  const isLoading = mainContext.isLoading;
  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Hàng số 5 */}
          {/* <View style={styles.divideRow}>
            <TouchableOpacity
              style={[styles.styleButton, styles.shadowProp, styles.elevation]}
              onPress={() => {
                navigation.navigate("Màn hình mẫu");
              }}
            >
              <VStack alignItems={"center"} style={{ paddingVertical: 50 }}>
                <Entypo name="briefcase" size={75} color={"#3d46c2"} />
                <Text style={styles.titleTag}>Màn hình mẫu</Text>
              </VStack>
            </TouchableOpacity>
          </View> */}
          {/* Hàng số 1 */}
          <View style={[styles.divideRow, styles.styleRow1]}>
            <TouchableOpacity
              disabled={isLoading || false}
              style={[styles.styleButton, styles.shadowProp, styles.elevation]}
              onPress={() => {
                navigation.navigate("Báo cáo tài chính");
              }}
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
              disabled={isLoading || false}
              style={[styles.styleButton, styles.shadowProp, styles.elevation]}
              // onPress={() => navigation.navigate("Tra cứu công nợ")}
              onPress={() => {
                navigation.navigate("Sổ tiền gửi ngân hàng");
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
              disabled={isLoading || false}
              style={[styles.styleButton, styles.shadowProp, styles.elevation]}
              onPress={() => {
                navigation.navigate("Sổ quỹ tiền mặt");
              }}
            >
              <VStack alignItems={"center"} style={{ paddingVertical: 40 }}>
                <Image
                  style={styles.icon}
                  source={require("../assets/iconHomeScreen/tonKho.png")}
                ></Image>
                <Text style={styles.titleTag}>Sổ quỹ tiền mặt</Text>
              </VStack>
            </TouchableOpacity>
            <View />
            <TouchableOpacity
              disabled={isLoading || false}
              style={[styles.styleButton, styles.shadowProp, styles.elevation]}
              onPress={() => {
                navigation.navigate("Nhập xuất tồn");
              }}
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
              disabled={isLoading || false}
              style={[styles.styleButton, styles.shadowProp, styles.elevation]}
              onPress={() => navigation.navigate("Phân tích chi phí")}
              // onPress={() => {
              //   AlertBuilding();
              // }}
            >
              <VStack alignItems={"center"} style={{ paddingVertical: 40 }}>
                <Image
                  style={styles.icon}
                  source={require("../assets/iconHomeScreen/chiPhi.png")}
                ></Image>
                <Text style={styles.titleTag}>Phân tích chi phí</Text>
              </VStack>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isLoading || false}
              style={[styles.styleButton, styles.shadowProp, styles.elevation]}
              onPress={() => {
                navigation.navigate("Theo dõi công nợ");
              }}
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
          {/* Hàng số 4 */}
          <View style={styles.divideRow}>
            <TouchableOpacity
              style={[styles.styleButton, styles.shadowProp, styles.elevation]}
              // onPress={() => {
              //   navigation.navigate("Theo dõi vay nợ");
              // }}
              onPress={() => AlertBuilding()}
            >
              <VStack alignItems={"center"} style={{ paddingVertical: 50 }}>
                <Entypo name="network" size={75} color={"#67e8f9"} />
                <Text style={styles.titleTag}>Theo dõi vay nợ</Text>
              </VStack>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.styleButton, styles.shadowProp, styles.elevation]}
              onPress={() => {
                navigation.navigate("Phân tích kinh doanh");
              }}
            >
              <VStack alignItems={"center"} style={{ paddingVertical: 50 }}>
                <FontAwesome5 name="chart-bar" size={75} color={"#EB5E55"} />
                <Text style={styles.titleTag}>phân tích kinh doanh</Text>
              </VStack>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {isLoading && (
        <Modal isOpen={isLoading}>
          <LottieView
            source={require("../assets/JsonLoading/AnimationLoaderDot.json")}
            colorFilters={[
              {
                keypath: "button",
                color: "#F00000",
              },
              {
                keypath: "Sending Loader",
                color: "#F00000",
              },
            ]}
            style={{ width: 200 }}
            autoPlay
            loop
          />
        </Modal>
      )}
    </>
  );
}

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 2,
  },
  titleTag: {
    textAlign: "center",
    paddingTop: 7,
    color: primaryColor,
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
