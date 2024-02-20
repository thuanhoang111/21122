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
} from "native-base";
import { useContext, useEffect, useState } from "react";
import {
  compactMoneyToString,
  convertPercent,
  formatMoneyToVN,
} from "../../constants/ConstantFunc";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import PieChart from "../../components/PieChart/PieChart";
import { Alert, SafeAreaView } from "react-native";
import Header from "../../components/Header/Header";
import { Drawer } from "react-native-drawer-layout";
import Filter from "../../components/Filter/Filter";
import * as Get from "../../API/service/Get";
import * as Post from "../../API/service/Post";
import { MainContext } from "../MainContext";
import { widthOfScreen } from "../../constants/ConstantMain";
import { linkClickColor, linkColor } from "../../constants/ConstantStyle";
function BankDepositBook({ route, navigation }) {
  const mainContext = useContext(MainContext);
  const dataUser = mainContext.dataUser;
  const lastPermissionYear = mainContext.lastPermissionYear;
  const inforFilter = mainContext.inforFilter;
  const isIos = mainContext.isIos;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [dataChart, setDataChart] = useState();
  const [configChart, setConfigChart] = useState({
    endAngle: 0,
    isAnimate: true,
  });
  const [lstBankAccount, setLstBankAccount] = useState([]);
  /**
   * function convert data from Api to data for PieChart
   * @param {Array[obj]} data
   */
  const handleConfigChartPie = (data) => {
    if (!data) {
      setDataChart([]);
    } else {
      const totalReVenue = data.TongTienThu;
      const totalExpenses = data.TongTienChi;
      let totalBalance = data.TienTonCuoiKy;
      const totalAmount = totalReVenue + totalExpenses + totalBalance;
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
        isAnimate: false,
      });
    }
  };
  /**
   * Function get data from Api
   * @param {Number} startMonth
   * @param {Number} endMonth
   * @param {Number} year
   * @param {Number} accountCode
   */
  const handleGetData = (startMonth, endMonth, year, accountCode) => {
    Get.HandleGetWithParam(
      `CashInBank/CashInBank_Total`,
      `m1=${startMonth}&m2=${endMonth}&AccountCode=${accountCode}&userId=${dataUser.id}&year=${year}`
    )
      .then((data) => {
        if (data.isError || data.error) {
          Alert.alert("Thông báo", data.errorDescription, [
            { text: "Ok", onPress: () => setOpen(false) },
          ]);
          setDataChart([]);
          setData([]);
        } else {
          data && handleConfigChartPie(data, accountCode);
          data && setData(data);
          setTimeout(() => {
            setOpen(false);
            mainContext.onChangeInforFilter({
              startMonth,
              endMonth,
              year,
              accountCode,
            });
          }, 100);
        }
      })
      .finally(() => {
        mainContext.onChangeLoading(false);
      });
  };
  /**
   * Function Get list Bank account
   */
  const handleGetBankAccount = () => {
    Post.handlePostWithBody("CashInBank/FindListAccount", {
      userId: dataUser.id,
      year: lastPermissionYear,
    }).then((data) => {
      if (data.isError) {
        setLstBankAccount([]);
      } else {
        setLstBankAccount(data.ListBankAccount);
      }
    });
  };
  useEffect(() => {
    handleGetData(
      inforFilter.startMonth || 1,
      inforFilter.endMonth || 12,
      inforFilter.year || lastPermissionYear,
      1121
    );

    handleGetBankAccount();
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
              inforFilter={inforFilter && inforFilter}
              lstBankAccount={lstBankAccount}
            />
          )
        );
      }}
      drawerStyle={{ backgroundColor: "#f1f1f1", width: "85%" }}
    >
      <Header
        onBack={() => navigation.goBack()}
        title={"Sổ tiền gửi ngân hàng"}
        onClick={() => setOpen(true)}
        isRightIcon
      ></Header>
      <SafeAreaView>
        <Center py={3}>
          {data.length !== 0 ? (
            <Text fontSize="xl" bold>
              {inforFilter.year &&
              inforFilter.startMonth &&
              inforFilter.endMonth
                ? `Từ ${inforFilter.startMonth}/${inforFilter.year} đến ${inforFilter.endMonth}/${inforFilter.year}`
                : "Không có dữ liệu"}
            </Text>
          ) : (
            <Skeleton.Text width={"70%"} lines={1} py={2}></Skeleton.Text>
          )}
        </Center>
        <Center>
          <PieChart
            dataChart={dataChart}
            endAngle={configChart.endAngle}
            isAnimate={configChart.isAnimate}
            setDataChart={setDataChart}
            listTitle={["Thu", "Chi", "Tồn"]}
          />
        </Center>
        <VStack marginX={5} marginY={2}>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <HStack alignItems={"center"} justifyContent={"center"}>
              <Heading fontSize={"xl"} paddingY={2}>
                Diễn giải:
              </Heading>
              <Text>(Đơn vị tính:VND)</Text>
            </HStack>

            <Pressable
              onPress={() =>
                navigation.navigate("Chi tiết sổ tiền gửi NH", {
                  data: dataUser,
                })
              }
            >
              {({ isHovered, isPressed }) => {
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
                        <Text fontSize={"md"}>Tiền thu</Text>
                      </HStack>
                      <HStack alignItems={"center"}>
                        <Text>{formatMoneyToVN(data.TongTienThu, "đ")}</Text>
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
                        <Text fontSize={"md"}>Tiền chi</Text>
                      </HStack>
                      <HStack alignItems={"center"}>
                        <Text>{formatMoneyToVN(data.TongTienChi, "đ")}</Text>
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
                      py={1}
                      bg={
                        isPressed
                          ? "coolGray.200"
                          : isHovered
                          ? "coolGray.200"
                          : "white"
                      }
                    >
                      <HStack alignItems={"center"}>
                        <View p={2.5}>
                          <FontAwesome5 name="money-bill-wave"></FontAwesome5>
                        </View>
                        <Text fontSize={"md"}>Số dư đầu kỳ</Text>
                      </HStack>
                      <Text>
                        {formatMoneyToVN(data.TienDuDauKy, "đ")}
                        <MaterialIcons name="keyboard-arrow-right" />
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
                      py={1}
                      bg={
                        isPressed
                          ? "coolGray.200"
                          : isHovered
                          ? "coolGray.200"
                          : "white"
                      }
                    >
                      <HStack alignItems={"center"}>
                        <View p={2.5}>
                          <FontAwesome5 name="money-bill-wave"></FontAwesome5>
                        </View>
                        <Text fontSize={"md"}>Số tồn cuối kỳ</Text>
                      </HStack>
                      <Text>
                        {formatMoneyToVN(data.TienTonCuoiKy, "đ")}
                        <MaterialIcons name="keyboard-arrow-right" />
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

export default BankDepositBook;
