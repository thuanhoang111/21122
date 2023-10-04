import React, { useEffect, useState } from "react";
import {
  View,
  Dimensions,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  LogBox,
  ScrollView,
  TouchableHighlight,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StoreInfoUser } from "../constants/API";
import SiwakeAPI from "../API/SiwakeApi";
import { Avatar, List, TouchableRipple } from "react-native-paper";
import {
  Text,
  Center,
  HStack,
  NativeBaseProvider,
  Skeleton,
  useDisclose,
  Divider,
  IconButton,
  Icon,
} from "native-base";
import ActionSheetOrder from "./ListOrder/ActionSheetOrder";
import IconEntypo from "react-native-vector-icons/Entypo";
import { Animatable } from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import IconOcticons from "react-native-vector-icons/Octicons";

const NumberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function ListInvoiceScreen({ navigation, route }) {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const [ImageInvoice, setImageInvoice] = useState();
  const [orderId, setOrderId] = useState();
  const { isOpen, onOpen, onClose } = useDisclose();
  const [visibleFilter, setVisibleFilter] = useState(false);

  const [infoUser, setInfoUser] = useState();
  // Nếu có update thì load lại lưới
  if (route.params) {
    setLoad(route.params.load);
    route.params = null;
  }

  const GetUser = async () => {
    try {
      const infoUserGet = await AsyncStorage.getItem(StoreInfoUser);
      let jsonUser = JSON.parse(infoUserGet);
      setInfoUser({
        // ...infoUser,
        uni_k_code: jsonUser.UserInfo.uni_k_code,
        agriCode: jsonUser.UserInfo.branch.jaCode,
        loginYear: jsonUser.UserInfo.login_year,
      });
      setLoad(true);
    } catch (error) {}
  };
  const GetListInvoice = async () => {
    try {
      const listSiwake = await SiwakeAPI.get(
        infoUser.uni_k_code,
        infoUser.agriCode,
        infoUser.loginYear,
        false
      );
      setData(listSiwake);

      // setLoad();
    } catch (error) {}
  };
  // const HandleDisplayImage = (item, enable) => {
  //   let base64 = item.image;
  //   setImageInvoice(base64);
  //   setVisiblePopup(enable);
  // };

  // // Biến bật tắt Modal Popup
  // const [visiblePopup, setVisiblePopup] = useState(false);

  // Vẽ Card Item
  const CardItem = (item, index) => {
    let { width } = Dimensions.get("window");

    return (
      <>
        <List.Item
          key={index}
          style={styles.listItem}
          title={
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                fontWeight: 600,
                backgroundColor: "transparent",
                color: "#585957",
              }}
            >
              {item.number_receipt}
            </Text>
          }
          description={item.customer_name}
          left={() => (
            <>
              <LinearGradient
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={["#e619b7", "#e1271e", "#dac625"]}
                style={styles.typeSign}
              ></LinearGradient>
              <List.Icon
                size={20}
                icon="file-document"
                color="#000"
                // style={{ backgroundColor: "#d7d7d7" }}
              />
            </>
          )}
          right={() => (
            <IconButton
              m={"8px"}
              borderRadius="full"
              variant="solid"
              p="3"
              bg={"transparent"}
              _pressed={{ bg: "coolGray.200" }}
              icon={
                <Icon
                  color="#000"
                  name={"dots-three-vertical"}
                  as={IconEntypo}
                  size="sm"
                />
              }
              onPress={() => {
                setOrderId(item.no);
                onOpen();
              }}
            />
          )}
        />
        <Divider />
      </>
    );
  };

  useEffect(() => {
    GetUser();
    {
      infoUser && GetListInvoice();
    }
  }, [load]);
  return (
    <>
      <ImageBackground
        source={{
          uri: "https://clash.com/img/bg-clouds-2.9f5d2e6f.jpg",
        }}
        style={styles.bgImage}
        // resizeMode="stretch"
      >
        <SafeAreaView>
          <ScrollView>
            <TouchableRipple rippleColor="rgba(0, 0, 0, .32)">
              <NativeBaseProvider>
                <TouchableOpacity
                  // onPress={() => navigation.navigate("Lọc thông tin hóa đơn")}
                  style={styles.btnFilter}
                  onPress={() => {
                    setVisibleFilter(true);
                  }}
                >
                  <View style={styles.btnFilterContent}>
                    <Text>Lọc</Text>
                    <IconOcticons
                      // style={{ textAlign: "center" }}
                      name="filter"
                      size={25}
                      // color="#FFF"
                    ></IconOcticons>
                  </View>
                </TouchableOpacity>

                {data.length > 0 ? (
                  <>
                    {data.map((item, index) => {
                      return CardItem(item, index);
                    })}
                    {isOpen && (
                      <ActionSheetOrder
                        isOpen={isOpen}
                        onClose={onClose}
                        orderId={orderId}
                        infoUser={infoUser}
                        navigation={navigation}
                      ></ActionSheetOrder>
                    )}
                  </>
                ) : (
                  <Center w="100%">
                    {Array.from({ length: 10 }).map((_, index) => {
                      return (
                        <HStack
                          key={index}
                          w="100%"
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
                          p={4}
                        >
                          <HStack flex="2" space="4">
                            <Skeleton w="25%" />
                            <Skeleton.Text w={"75%"} lines={2} />
                          </HStack>
                        </HStack>
                      );
                    })}
                  </Center>
                )}
              </NativeBaseProvider>
            </TouchableRipple>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
      {visibleFilter && (
        <FilterModalBill
          visibleFilter={visibleFilter}
          setVisibleFilter={setVisibleFilter}
        ></FilterModalBill>
      )}
    </>
  );
}

// Component ModalPoup
const ModalPoup = ({ visible, children }) => {
  const [showModal, setShowModal] = useState(visible);

  useEffect(() => {
    toggleModal();
  }, [visible]);

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.modalBackGround}>
        <View style={styles.modalContainer}>{children}</View>
      </View>
    </Modal>
  );
};

const heightOfScreen = Dimensions.get("window").height;
const styles = StyleSheet.create({
  typeSign: {
    backgroundColor: "#dc2b23",
    width: 10,
    height: "auto",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  bgImage: {
    height: heightOfScreen,
  },
  btnFilter: {
    width: "20%",
    marginTop: 10,
    marginRight: 10,
    alignSelf: "flex-end",

    // textAlign: "right",
  },
  btnFilterContent: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
    borderRadius: 10,
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    height: "90%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: "100%",
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  hinhhoadon: {
    width: "100%",
    height: "80%",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#309ee7" /* Green */,
    color: "white",
    textAlign: "center",
    fontSize: 15,
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  listItem: {
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#bdbdc7",
    padding: 0,
    paddingRight: 20,
  },
});

export default ListInvoiceScreen;
