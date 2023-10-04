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
import { useEffect, useState } from "react";
import {
  compactMoney,
  convertPercent,
  formatMoneyToVN,
} from "../../constants/ConstantFunc";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import PieChart from "./../../components/PieChart/PieChart";
import { Alert, SafeAreaView } from "react-native";
import Header from "../../components/Header/Header";
import { Drawer } from "react-native-drawer-layout";
import Filter from "./../../components/Filter/Filter";
import axios from "axios";
import { widthOfScreen } from "../../constants/ConstantMain";
import { useNetworkState, useRenderCount } from "@uidotdev/usehooks";

function BankDepositBook({ route, navigation }) {
  const renderCount = useRenderCount();
  console.log(renderCount);
  const [open, setOpen] = useState(false);
  const dataUser = route.params.data;
  const lastPermissionYear =
    dataUser.permission[dataUser.permission.length - 1].year;
  const [data, setData] = useState([]);
  const [dataChart, setDataChart] = useState();
  const [configChart, setConfigChart] = useState({
    endAngle: 0,
    isAnimate: true,
  });
  const [title, setTitle] = useState();
  const [inforFilter, setInforFilter] = useState({
    startMonth: 1,
    endMonth: 12,
    year: lastPermissionYear,
    accountCode: 1121,
  });
  const [lstBankAccount, setLstBankAccount] = useState([]);
  const handleConfigChartPie = (data) => {
    if (!data) {
      setDataChart([]);
    } else {
      const totalReVenue = data.TongTienThu;
      const totalExpenses = data.TongTienChi;
      const totalBalance = data.TienTonCuoiKy;
      const totalAmount = totalReVenue + totalExpenses + totalBalance;

      setDataChart(
        totalAmount !== 0
          ? [
              {
                index: 1,
                x: convertPercent(totalAmount, totalReVenue, "String"),
                y: convertPercent(totalAmount, totalReVenue, "Number"),
                money: compactMoney(totalReVenue),
                active: false,
              },
              {
                index: 2,
                x: convertPercent(totalAmount, totalExpenses, "String"),
                y: convertPercent(totalAmount, totalExpenses, "Number"),
                money: compactMoney(totalExpenses),
                active: false,
              },
              {
                index: 3,
                x: convertPercent(totalAmount, totalBalance, "String"),
                y: convertPercent(totalAmount, totalBalance, "Number"),
                money: compactMoney(totalBalance),
                active: false,
              },
            ]
          : []
      );
      setTimeout(() => {
        setConfigChart({
          endAngle: 360,
          isAnimate: false,
        });
      }, 100);
    }
  };
  const handleGetData = (startMonth, endMonth, year, accountCode) => {
    axios
      .get(
        `http://192.168.90.84:1375/api/CashInBank/CashInBank_Total?m1=${startMonth}&m2=${endMonth}&AccountCode=${accountCode}&userId=${dataUser.id}&year=${year}`
      )
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        if (data.error) {
          Alert.alert("Thông báo", data.errorDescription, [{ text: "Ok" }]);
        } else {
          setOpen(false);
          data && handleConfigChartPie(data, accountCode);
          data && setData(data);
          setTitle(`Từ ${startMonth}/${year} đến ${endMonth}/${year}`);
        }
      })
      .catch((error) => {
        setOpen(false);
        setTitle();
        setDataChart();
        setTimeout(() => {
          setTitle("Không có dữ liệu");
          setDataChart([]);
          setData([]);
        }, 5000);
      })
      .finally(() => {
        setInforFilter({
          startMonth,
          endMonth,
          year,
          accountCode,
        });
      });
  };
  const handleGetBankAccount = () => {
    axios
      .post("http://192.168.90.84:1375/api/CashInBank/FindListAccount", {
        userId: dataUser.id,
        year: lastPermissionYear,
      })
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setLstBankAccount(data.ListBankAccount);
      })
      .catch(() => {
        setLstBankAccount([]);
      });
  };
  useEffect(() => {
    handleGetData(
      inforFilter.startMonth,
      inforFilter.endMonth,
      inforFilter.year,
      inforFilter.accountCode
    );
    handleGetBankAccount();
  }, []);
  return (
    <Drawer
      swipeEdgeWidth={40}
      swipeMinDistance={100}
      swipeMinVelocity={1000}
      drawerPosition="right"
      drawerType="front"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      hideStatusBarOnOpen
      renderDrawerContent={() => {
        return (
          <Filter
            inforPermission={dataUser.permission}
            onSearch={handleGetData}
            inforFilter={inforFilter}
            lstBankAccount={lstBankAccount}
          />
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
          {title ? (
            <Text fontSize="xl" bold>
              {title}
            </Text>
          ) : (
            <Skeleton.Text width={"70%"} lines={1} py={2}></Skeleton.Text>
          )}
        </Center>
        <PieChart
          dataChart={dataChart}
          endAngle={configChart.endAngle}
          isAnimate={configChart.isAnimate}
          setDataChart={setDataChart}
          listTitle={["Thu", "Chi", "Tồn"]}
        />
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
                  inforFilter: inforFilter,
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
                          ? "#1892a7"
                          : isHovered
                          ? "#1892a7"
                          : "#1ecbe1"
                      }
                    >
                      Xem thêm
                    </Text>
                    <MaterialIcons
                      name="keyboard-arrow-right"
                      size={15}
                      color={
                        isPressed
                          ? "#1892a7"
                          : isHovered
                          ? "#1892a7"
                          : "#1ecbe1"
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
                        <Text>{formatMoneyToVN(data.TongTienThu)}</Text>
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
                        <Text>{formatMoneyToVN(data.TongTienThueThu)}</Text>
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
                        <Text>{formatMoneyToVN(data.TongTienChi)}</Text>
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
                        <View p={2.5}>
                          <FontAwesome5 name="money-bill-wave"></FontAwesome5>
                        </View>
                        <Text fontSize={"md"}>Tiền thuế chi</Text>
                      </HStack>
                      <HStack alignItems={"center"}>
                        <Text>{formatMoneyToVN(data.TongTienThueChi)}</Text>
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
                        {formatMoneyToVN(data.TienDuDauKy)}
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
                        {formatMoneyToVN(data.TienTonCuoiKy)}
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
