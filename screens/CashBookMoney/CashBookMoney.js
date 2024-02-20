import {
  Center,
  View,
  Text,
  HStack,
  VStack,
  Heading,
  Pressable,
  Divider,
  ScrollView,
  Skeleton,
  Modal,
} from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useContext, useEffect, useState } from "react";
import * as Get from "../../API/service/Get";
import {
  compactMoneyToString,
  convertPercent,
  formatMoneyToVN,
} from "../../constants/ConstantFunc";
import PieChart from "./../../components/PieChart/PieChart";
import { SafeAreaView } from "react-native";
import Filter from "../../components/Filter/Filter";
import { Drawer } from "react-native-drawer-layout";
import Header from "../../components/Header/Header";
import { Alert } from "react-native";
import { MainContext } from "../MainContext";
import { widthOfScreen } from "../../constants/ConstantMain";
import { linkClickColor, linkColor } from "../../constants/ConstantStyle";
function CashBookMoney({ route, navigation }) {
  const mainContext = useContext(MainContext);
  const dataUser = mainContext.dataUser;
  const lastPermissionYear = mainContext.lastPermissionYear;
  const isIos = mainContext.isIos;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [dataChart, setDataChart] = useState();
  const [configChart, setConfigChart] = useState({
    endAngle: 0,
    isAnimate: true,
  });
  const inforFilter = mainContext.inforFilter;
  const lstBankAccount = [
    {
      AccountCode: 0,
      AccountName: "Tiền Việt Nam",
    },
    {
      AccountCode: 1,
      AccountName: "Ngoại tệ",
    },
  ];
  /**
   * Author: ThuanHoang 19/09/2023
   * Function get data from Api CashMoney
   * @param {ArrayList} data
   */
  const handleGetData = (startMonth, endMonth, year, accountCode) => {
    Get.HandleGetWithParam(
      `DongTienMat/CashBook`,
      `m1=${startMonth}&m2=${endMonth}&AccountType=${accountCode}&userId=${dataUser.id}&year=${year}`
    )
      .then((data) => {
        if (data.isError || data.error || data.results[0] === undefined) {
          Alert.alert(
            data.errorMsg || "Thông báo",
            data.errorDescription || "Đã xảy ra lỗi vui lòng chọn lại năm",
            [{ text: "Ok", onPress: () => setOpen(false) }]
          );
          setDataChart([]);
          setData({});
        } else {
          data &&
            data.results &&
            handleConfigChartPie(data.results[0], accountCode);
          data && data.results && setData(data.results[0]);
          setTimeout(() => {
            setOpen(false);
            mainContext.onChangeInforFilter({
              startMonth,
              endMonth,
              year,
              accountCode,
            });
          }, 1000);
        }
      })
      .finally(() => {
        mainContext.onChangeLoading(false);
      });
  };
  const handleConfigChartPie = (data, accountCode) => {
    if (!data) {
      setDataChart([]);
    } else {
      const totalReVenue =
        accountCode == 0 ? data.TongTienThu : data.TongTienThuNgoaiTe;
      const totalExpenses =
        accountCode == 0 ? data.TongTienChi : data.TongTienChiNgoaiTe;
      let totalBalance =
        accountCode == 0 ? data.TienTonCuoiKy : data.TienTonCuoiKyNgoaiTe;
      const totalAmount = totalReVenue + totalExpenses + Math.abs(totalBalance);
      totalBalance = Math.abs(totalBalance);
      setDataChart(
        totalAmount !== 0
          ? [
              {
                index: 1,
                x: convertPercent(totalAmount, totalReVenue, "String"),
                y: convertPercent(totalAmount, totalReVenue, "Number"),
                money: compactMoneyToString(totalReVenue),
                active: false,
              },
              {
                index: 2,
                x: convertPercent(totalAmount, totalExpenses, "String"),
                y: convertPercent(totalAmount, totalExpenses, "Number"),
                money: compactMoneyToString(totalExpenses),
                active: false,
              },
              {
                index: 3,
                x: convertPercent(totalAmount, totalBalance, "String"),
                y: convertPercent(totalAmount, totalBalance, "Number"),
                money: compactMoneyToString(totalBalance),
                active: false,
              },
            ]
          : []
      );
      setConfigChart({
        endAngle: 360,
        isAnimate: true,
      });
    }
  };
  useEffect(() => {
    handleGetData(
      inforFilter.startMonth || 1,
      inforFilter.endMonth || 12,
      inforFilter.year || lastPermissionYear,
      0
    );
    return () => {
      mainContext.onChangeInforFilter((item) => ({
        accountCode: undefined,
      }));
    };
  }, []);
  return (
    <Drawer
      swipeEdgeWidth={widthOfScreen * 0.5}
      swipeMinDistance={50}
      swipeMinVelocity={1000}
      drawerPosition="right"
      drawerType="front"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      hideStatusBarOnOpen
      swipeEnabled={isIos}
      renderDrawerContent={() => {
        return (
          inforFilter.accountCode !== undefined && (
            <Filter
              inforPermission={dataUser.permission}
              onSearch={handleGetData}
              lstBankAccount={lstBankAccount}
            />
          )
        );
      }}
      drawerStyle={{ backgroundColor: "#f1f1f1", width: "85%" }}
    >
      <Header
        onBack={() => navigation.goBack()}
        title={"Sổ quỹ tiền mặt"}
        onClick={() => setOpen(true)}
        isRightIcon
      ></Header>
      <SafeAreaView>
        <Center py={3}>
          {data ? (
            <Text fontSize="xl" bold>
              {inforFilter.year &&
                inforFilter.startMonth &&
                inforFilter.endMonth &&
                `Từ ${inforFilter.startMonth}/${inforFilter.year} đến ${inforFilter.endMonth}/${inforFilter.year}`}
            </Text>
          ) : (
            <Skeleton.Text width={"70%"} lines={1} py={2}></Skeleton.Text>
          )}
        </Center>
        <Center>
          <PieChart
            dataChart={dataChart}
            endAngle={configChart.endAngle}
            isAnimate={configChart.isAnimateisAnimate}
            setDataChart={setDataChart}
            listTitle={["Thu", "Chi", "Tồn"]}
          />
        </Center>
        <VStack marginX={5} marginY={2}>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <HStack alignItems={"center"} justifyContent={"center"}>
              <Heading fontSize={"xl"} paddingY={2}>
                Diễn giải:{" "}
              </Heading>
              <Text>(Đơn vị tính:VND)</Text>
            </HStack>

            <Pressable
              onPress={() =>
                navigation.navigate("Chi tiết sổ quỹ", {
                  onGetData: handleGetData,
                })
              }
            >
              {({ isHovered, isFocused, isPressed }) => {
                return (
                  <View
                    flexDirection={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Text
                      fontSize={"md"}
                      color={
                        isPressed
                          ? linkClickColor
                          : isHovered
                          ? linkClickColor
                          : linkColor
                      }
                    >
                      Xem thêm
                    </Text>
                    <MaterialIcons
                      name="keyboard-arrow-right"
                      size={15}
                      color={
                        isPressed
                          ? linkClickColor
                          : isHovered
                          ? linkClickColor
                          : linkColor
                      }
                    />
                  </View>
                );
              }}
            </Pressable>
          </HStack>
          <ScrollView>
            <VStack
              borderRadius={10}
              id="table-chart-box"
              borderColor={"#e3e3e4"}
              backgroundColor={"#fff"}
              borderWidth={3}
              style={{ elevation: 100, shadowColor: "#52006A" }}
            >
              <Pressable
                Pressable
                onPress={() => console.log("I'm Pressed")}
                overflow="hidden"
              >
                {({ isHovered, isFocused, isPressed }) => {
                  return (
                    <HStack
                      HStack
                      borderTopRadius={5}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      paddingRight={1}
                      display={"flex"}
                      flexDirection={"row"}
                      p="1"
                      bg={
                        isPressed
                          ? "coolGray.200"
                          : isHovered
                          ? "coolGray.200"
                          : "white"
                      }
                    >
                      <HStack alignItems={"center"}>
                        <View p={2}>
                          <FontAwesome5 name="money-bill-wave"></FontAwesome5>
                        </View>
                        <Text fontSize={"md"}>
                          {inforFilter.accountCode == 0
                            ? "Tiền thu"
                            : "Tiền thu ngoại tệ"}
                        </Text>
                      </HStack>
                      <HStack alignItems={"center"}>
                        <Text>
                          {formatMoneyToVN(
                            inforFilter.accountCode == 0
                              ? data.TongTienThu
                              : data.TongTienThuNgoaiTe,
                            "đ"
                          )}
                        </Text>
                        <MaterialIcons name="keyboard-arrow-right" />
                      </HStack>
                    </HStack>
                  );
                }}
              </Pressable>
              <Pressable
                Pressable
                onPress={() => console.log("I'm Pressed")}
                overflow="hidden"
              >
                {({ isHovered, isFocused, isPressed }) => {
                  return (
                    <HStack
                      HStack
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      paddingRight={1}
                      display={"flex"}
                      flexDirection={"row"}
                      p="1"
                      bg={
                        isPressed
                          ? "coolGray.200"
                          : isHovered
                          ? "coolGray.200"
                          : "white"
                      }
                    >
                      <HStack alignItems={"center"}>
                        <View p={2}>
                          <FontAwesome5 name="money-bill-wave"></FontAwesome5>
                        </View>
                        <Text fontSize={"md"}>Tiền thuế thu</Text>
                      </HStack>
                      <HStack alignItems={"center"}>
                        <Text>
                          {formatMoneyToVN(data.TongTienThueThu, "đ")}
                        </Text>
                        <MaterialIcons name="keyboard-arrow-right" />
                      </HStack>
                    </HStack>
                  );
                }}
              </Pressable>
              <Divider></Divider>
              <Pressable
                Pressable
                onPress={() => console.log("I'm Pressed")}
                overflow="hidden"
              >
                {({ isHovered, isFocused, isPressed }) => {
                  return (
                    <HStack
                      HStack
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      paddingRight={1}
                      display={"flex"}
                      flexDirection={"row"}
                      p="1"
                      bg={
                        isPressed
                          ? "coolGray.200"
                          : isHovered
                          ? "coolGray.200"
                          : "white"
                      }
                    >
                      <HStack alignItems={"center"}>
                        <View p={2}>
                          <FontAwesome5 name="money-bill-wave"></FontAwesome5>
                        </View>
                        <Text fontSize={"md"}>
                          {inforFilter.accountCode == 0
                            ? "Tiền chi"
                            : "Tiền chi ngoại tệ"}
                        </Text>
                      </HStack>
                      <HStack alignItems={"center"}>
                        <Text>
                          {formatMoneyToVN(
                            inforFilter.accountCode == 0
                              ? data.TongTienChi
                              : data.TongTienChiNgoaiTe,
                            "đ"
                          )}
                        </Text>
                        <MaterialIcons name="keyboard-arrow-right" />
                      </HStack>
                    </HStack>
                  );
                }}
              </Pressable>
              <Pressable
                Pressable
                onPress={() => console.log("I'm Pressed")}
                overflow="hidden"
              >
                {({ isHovered, isFocused, isPressed }) => {
                  return (
                    <HStack
                      HStack
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      paddingRight={1}
                      display={"flex"}
                      flexDirection={"row"}
                      p="1"
                      bg={
                        isPressed
                          ? "coolGray.200"
                          : isHovered
                          ? "coolGray.200"
                          : "white"
                      }
                    >
                      <HStack alignItems={"center"}>
                        <View p={2}>
                          <FontAwesome5 name="money-bill-wave"></FontAwesome5>
                        </View>
                        <Text fontSize={"md"}>Tiền thuế chi</Text>
                      </HStack>
                      <HStack alignItems={"center"}>
                        <Text>
                          {formatMoneyToVN(data.TongTienThueChi, "đ")}
                        </Text>
                        <MaterialIcons name="keyboard-arrow-right" />
                      </HStack>
                    </HStack>
                  );
                }}
              </Pressable>
              <Divider></Divider>
              <Pressable
                Pressable
                onPress={() => console.log("I'm Pressed")}
                overflow="hidden"
              >
                {({ isHovered, isFocused, isPressed }) => {
                  return (
                    <HStack
                      HStack
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      display={"flex"}
                      flexDirection={"row"}
                      px={4}
                      py={1}
                      bg={
                        isPressed
                          ? "coolGray.200"
                          : isHovered
                          ? "coolGray.200"
                          : "white"
                      }
                    >
                      <Text fontSize={"md"}>Số dư đầu kỳ</Text>
                      <Text>
                        {formatMoneyToVN(
                          inforFilter.accountCode == 0
                            ? data.TienDuDauKy
                            : data.TienDuDauKyNgoaiTe,
                          "đ"
                        )}
                      </Text>
                    </HStack>
                  );
                }}
              </Pressable>
              <Pressable
                Pressable
                onPress={() => console.log("I'm Pressed")}
                overflow="hidden"
              >
                {({ isHovered, isFocused, isPressed }) => {
                  return (
                    <HStack
                      HStack
                      borderBottomRadius={5}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      display={"flex"}
                      flexDirection={"row"}
                      px={4}
                      py={1}
                      bg={
                        isPressed
                          ? "coolGray.200"
                          : isHovered
                          ? "coolGray.200"
                          : "white"
                      }
                    >
                      <Text fontSize={"md"}>Số tồn cuối kỳ</Text>
                      <Text>
                        {formatMoneyToVN(
                          inforFilter.accountCode == 0
                            ? data.TienTonCuoiKy
                            : data.TienTonCuoiKyNgoaiTe,
                          "đ"
                        )}
                      </Text>
                    </HStack>
                  );
                }}
              </Pressable>
            </VStack>
          </ScrollView>
        </VStack>
      </SafeAreaView>
    </Drawer>
  );
}

export default CashBookMoney;
