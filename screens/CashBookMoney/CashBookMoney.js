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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  compactMoney,
  convertPercent,
  formatMoneyToVN,
} from "../../constants/ConstantFunc";
import PieChart from "./../../components/PieChart/PieChart";
import { SafeAreaView } from "react-native";
import Filter from "../../components/Filter/Filter";
import { Drawer } from "react-native-drawer-layout";
import Header from "../../components/Header/Header";
import { Alert } from "react-native";
function CashBookMoney({ route, navigation }) {
  const dataUser = route.params.data;
  const lastPermissionYear =
    dataUser.permission[dataUser.permission.length - 1].year;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [dataChart, setDataChart] = useState();
  const [endAngle, setEndAngle] = useState(0);
  const [isAnimate, setIsAnimate] = useState(true);
  const [title, setTitle] = useState();
  const [inforFilter, setInforFilter] = useState({
    startMonth: 1,
    endMonth: 12,
    year: lastPermissionYear,
    accountCode: 0,
  });
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
   * @returns data
   */
  const handleGetData = (startMonth, endMonth, year, accountCode) => {
    axios
      .get(
        `http://192.168.90.84:1375/api/DongTienMat/CashBook?m1=${startMonth}&m2=${endMonth}&AccountType=${accountCode}&userId=${dataUser.id}&year=${year}`
      )
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        if (data.error) {
          Alert.alert("Thông báo", data.errorDescription, [{ text: "Ok" }]);
        } else {
          setOpen(false);
          data &&
            data.results &&
            handleConfigChartPie(data.results[0], accountCode);
          data && data.results && setData(data.results[0]);
          setTitle(`Từ ${startMonth}/${year} đến ${endMonth}/${year}`);
        }
      })
      .catch(() => {
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
  const handleConfigChartPie = (data, accountCode) => {
    if (!data) {
      setDataChart([]);
    } else {
      const totalReVenue =
        accountCode == 0 ? data.TongTienThu : data.TongTienThuNgoaiTe;
      const totalExpenses =
        accountCode == 0 ? data.TongTienChi : data.TongTienChiNgoaiTe;
      const totalBalance =
        accountCode == 0 ? data.TienTonCuoiKy : data.TienTonCuoiKyNgoaiTe;

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
        setEndAngle(360);
        setIsAnimate(false);
      }, 100);
    }
  };
  useEffect(() => {
    handleGetData(
      inforFilter.startMonth,
      inforFilter.endMonth,
      inforFilter.year,
      inforFilter.accountCode
    );
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
        title={"Sổ quỹ tiền mặt"}
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
          endAngle={endAngle}
          isAnimate={isAnimate}
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
                navigation.navigate("Chi Tiết Sổ Quỹ", {
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
                              : data.TongTienThuNgoaiTe
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
                              : data.TongTienChiNgoaiTe
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
                            : data.TienDuDauKyNgoaiTe
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
                            : data.TienTonCuoiKyNgoaiTe
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
