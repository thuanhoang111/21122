import {
  Center,
  CheckIcon,
  Divider,
  HStack,
  Select,
  Text,
  VStack,
  Modal,
} from "native-base";
import { Alert, RefreshControl, TouchableOpacity, View } from "react-native";
import Header from "../../components/Header/Header";
import {
  compactMoney,
  compactMoneyToString,
  convertNumberToStringVND,
  formatMoneyToVN,
} from "../../constants/ConstantFunc";
import { heightOfScreen } from "../../constants/ConstantMain";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../MainContext";
import { useObjectState, useRenderCount } from "@uidotdev/usehooks";
import * as Get from "../../API/service/Get";
import BarChartInMonthNoTitle from "./../../components/BarChartInMonth/BarChartInMonthNoTitle";
import LottieView from "lottie-react-native";
const monthValueInit = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const initData = {
  PayTotal: 0,
  ReceiveTotal: 0,
  RevenueTotal: 0,
  ExpenseTotal: 0,
  ProfitTotal: 0,
  InventTotal: 0,
  RevenueDetails: monthValueInit,
  ExpenseDetails: monthValueInit,
  ProfitDetails: monthValueInit,
};
function OverViewScreen({}) {
  const mainContext = useContext(MainContext);
  const lastPermissionYear = mainContext.lastPermissionYear;
  const isLoading = mainContext.isLoading;
  const dataUser = mainContext.dataUser;
  const inforFilter = mainContext.inforFilter;
  const [filter, setFilter] = useObjectState({
    typeMoney: "doanh thu",
    unitName: "Triệu",
  });
  const [data, setData] = useState(initData);
  // const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    dataUser &&
      handleGetData(dataUser.id, inforFilter.year || lastPermissionYear);
  }, []);
  const changeDataInMonth = (typeMoney, isBase) => {
    const valuesInMonth =
      typeMoney === "doanh thu"
        ? data.RevenueDetails
        : typeMoney === "chi phí"
        ? data.ExpenseDetails
        : data.ProfitDetails;
    if (!valuesInMonth) {
      return monthValueInit;
    }
    const unit = changeUnit(valuesInMonth, "number");
    return isBase
      ? valuesInMonth
      : valuesInMonth.map((item) => {
          return compactMoney(item, unit, 1);
        });
  };
  const getNumberChar = (valuesInMonth) => {
    const valuesInMonthCp = [...valuesInMonth];
    const minValue = valuesInMonthCp
      .sort((a, b) => a - b)
      .find((item, index) => item != 0 && item > 0);
    if (!minValue) {
      const minValueOthCase = valuesInMonthCp.find((item) => item < 0);
      const numCharMax = Math.floor(Math.log10(-minValueOthCase));
      return numCharMax || 0;
    }
    const maxValue = valuesInMonthCp[valuesInMonthCp.length - 1];
    const numCharMax = Math.floor(Math.log10(maxValue));

    // return numCharMax - numCharMin < 3 ? numCharMin + 1 : numCharMax - 1;
    return numCharMax;
  };
  const changeUnit = (valuesInMonth) => {
    const numberChar = getNumberChar(valuesInMonth);
    return numberChar ? Math.pow(10, numberChar - 1) : 1;
  };
  const handleGetData = (userId, year) => {
    Get.HandleGetWithParam(`OverView`, `userId=${userId}&year=${year}`)
      .then((data) => {
        if (data.isError || data.error) {
          Alert.alert(
            "Thông báo",
            data.errorDescription || "Đã xảy ra lỗi vui lòng chọn lại năm",
            [{ text: "Ok" }]
          );
          setData(initData);
        } else {
          setData(data[0]);
          const valuesInMonth =
            filter.typeMoney === "doanh thu"
              ? data[0].RevenueDetails
              : filter.typeMoney === "chi phí"
              ? data[0].ExpenseDetails
              : data[0].ProfitDetails;
          setFilter(() => ({
            year: year,
            unitName: convertNumberToStringVND(
              getNumberChar(valuesInMonth || monthValueInit)
            ),
          }));
        }
      })
      .finally(() => {
        mainContext.onChangeLoading(false);
        mainContext.onChangeInforFilter({
          year,
        });
      });
  };
  // initialize the array of increasing numbers
  return (
    <>
      <VStack space="2" flex={1} paddingBottom={2}>
        <Header title={"Tình hình hợp tác xã"}></Header>
        {/* <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() =>
                dataUser && handleGetData(dataUser.id, inforFilter.year)
              }
            />
          }
        > */}
        <VStack
          space={2}
          marginX={2}
          // height={heightOfScreen - 180}
          // height={"100%"}
          flex={1}
          justifyContent={"space-between"}
        >
          <VStack
            space={1}
            backgroundColor={"#fff"}
            paddingX={5}
            borderRadius={10}
            flex={4.5}
            flexDirection={"column"}
          >
            {/* phải thu */}
            <HStack
              space="3"
              alignItems="center"
              justifyContent={"space-between"}
              paddingY={2}
              flex={1}
            >
              <Text fontSize="md" bold>
                Phải thu
              </Text>
              <Text fontSize="sm">{formatMoneyToVN(data.PayTotal, "đ")}</Text>
            </HStack>
            <Divider></Divider>
            {/* phải trả */}
            <HStack
              space="3"
              alignItems="center"
              justifyContent={"space-between"}
              paddingY={2}
              flex={1}
            >
              <Text fontSize="md" bold>
                Phải trả
              </Text>
              <Text fontSize="sm">
                {formatMoneyToVN(data.ReceiveTotal, "đ")}
              </Text>
            </HStack>
            <Divider></Divider>
            {/* Doanh thu */}
            <HStack
              space="3"
              alignItems="center"
              justifyContent={"space-between"}
              paddingY={2}
              flex={1}
            >
              <Text fontSize="md" bold>
                Doanh thu
              </Text>
              <Text fontSize="sm">
                {formatMoneyToVN(data.RevenueTotal, "đ")}
              </Text>
            </HStack>
            <Divider></Divider>
            {/* chi phí */}
            <HStack
              space="3"
              alignItems="center"
              justifyContent={"space-between"}
              paddingY={2}
              flex={1}
            >
              <Text fontSize="md" bold>
                Chi phí
              </Text>
              <Text fontSize="sm">
                {formatMoneyToVN(data.ExpenseTotal, "đ")}
              </Text>
            </HStack>
            <Divider></Divider>
            {/* Lợi nhuận */}
            <HStack
              space="3"
              alignItems="center"
              justifyContent={"space-between"}
              paddingY={2}
              flex={1}
            >
              <Text fontSize="md" bold>
                Lợi nhuận
              </Text>
              <Text fontSize="sm">
                {formatMoneyToVN(data.ProfitTotal, "đ")}
              </Text>
            </HStack>
            <Divider></Divider>
            {/* Hàng tồn kho */}
            <HStack
              space="3"
              alignItems="center"
              justifyContent={"space-between"}
              paddingY={2}
              flex={1}
            >
              <Text fontSize="md" bold>
                Hàng tồn kho
              </Text>
              <Text fontSize="sm">
                {formatMoneyToVN(data.InventTotal, "đ")}
              </Text>
            </HStack>
          </VStack>
          <VStack
            space={1}
            backgroundColor={"#fff"}
            borderRadius={10}
            padding={2}
            flex={5}
          >
            <HStack
              alignItems={"center"}
              justifyContent={"space-between"}
              zIndex={100}
            >
              <Text fontSize="2xl" bold>
                Doanh thu{" "}
                {/* <Text fontSize={"sm"} sub color={"red.500"}>
                  ({`${filter.unitName}`})
                </Text> */}
                <Text sub color={"red.500"} fontSize="sm">
                  (Triệu Đồng)
                </Text>
              </Text>
              <View
                style={{
                  width: 100,
                }}
              >
                {inforFilter && (
                  <Select
                    selectedValue={inforFilter.year || lastPermissionYear}
                    _selectedItem={{
                      endIcon: <CheckIcon size="5" />,
                    }}
                    placeholder={`${inforFilter.year}`}
                    mt={1}
                    onValueChange={(itemValue) => {
                      mainContext.onChangeLoading(true);
                      handleGetData(dataUser.id, itemValue);
                    }}
                  >
                    {dataUser.permission.map((item, index) => {
                      return (
                        <Select.Item
                          label={item.year.toString()}
                          key={index}
                          value={item.year}
                          disabled={item.year === inforFilter.year}
                        />
                      );
                    })}
                  </Select>
                )}
              </View>
            </HStack>
            {/* Button change TypeMoney */}
            <HStack alignItems="center" space={0.2}>
              {/* Button Revenue */}
              <TouchableOpacity
                onPress={() => {
                  setFilter(() => ({
                    typeMoney: "doanh thu",
                    unitName:
                      data &&
                      convertNumberToStringVND(
                        getNumberChar(data.RevenueDetails || monthValueInit)
                      ),
                  }));
                }}
                style={{ flex: 1 }}
              >
                <Center
                  bg={filter.typeMoney === "doanh thu" ? "#fff" : "muted.200"}
                  borderLeftRadius={10}
                  paddingY={2}
                  borderBottomWidth={filter.typeMoney === "doanh thu" ? 2 : 0}
                  borderColor={"fuchsia.400"}
                >
                  <Text fontSize="md" bold>
                    Doanh thu
                  </Text>
                </Center>
              </TouchableOpacity>
              {/* Button Cost */}
              <TouchableOpacity
                onPress={() =>
                  setFilter(() => ({
                    typeMoney: "chi phí",
                    unitName:
                      data &&
                      convertNumberToStringVND(
                        getNumberChar(data.ExpenseDetails || monthValueInit)
                      ),
                  }))
                }
                style={{ flex: 1 }}
              >
                <Center
                  bg={filter.typeMoney === "chi phí" ? "#fff" : "muted.200"}
                  paddingY={2}
                  borderBottomWidth={filter.typeMoney === "chi phí" ? 2 : 0}
                  borderColor={"fuchsia.400"}
                >
                  <Text fontSize="md" bold>
                    Chi phí
                  </Text>
                </Center>
              </TouchableOpacity>
              {/* Button Profit */}
              <TouchableOpacity
                onPress={() =>
                  setFilter(() => ({
                    typeMoney: "lợi nhuận",
                    unitName:
                      data &&
                      convertNumberToStringVND(
                        getNumberChar(data.ProfitDetails || monthValueInit)
                      ),
                  }))
                }
                style={{ flex: 1 }}
              >
                <Center
                  bg={filter.typeMoney === "lợi nhuận" ? "#fff" : "muted.200"}
                  borderRightRadius={10}
                  borderBottomWidth={filter.typeMoney === "lợi nhuận" ? 2 : 0}
                  borderColor={"fuchsia.400"}
                  paddingY={2}
                >
                  <Text fontSize="md" bold>
                    Lợi nhuận
                  </Text>
                </Center>
              </TouchableOpacity>
            </HStack>
            {/* Show total money */}
            <HStack alignItems={"center"}>
              {/* Revenue */}
              <Center borderLeftRadius={10} paddingY={2} flex={1}>
                <Text
                  fontSize="sm"
                  bold
                  color={
                    filter.typeMoney === "doanh thu" ? "success.400" : "#000"
                  }
                >
                  {formatMoneyToVN(
                    compactMoney(data.RevenueTotal, 1000000, 2),
                    "Tr"
                  )}
                </Text>
              </Center>
              {/* Cost */}
              <Center borderLeftRadius={10} paddingY={2} flex={1}>
                <Text
                  fontSize="sm"
                  bold
                  color={
                    filter.typeMoney === "chi phí" ? "success.400" : "#000"
                  }
                >
                  {formatMoneyToVN(
                    compactMoney(data.ExpenseTotal, 1000000, 2),
                    "Tr"
                  )}
                </Text>
              </Center>
              {/* Profit */}
              <Center borderLeftRadius={10} paddingY={2} flex={1}>
                <Text
                  fontSize="sm"
                  bold
                  color={
                    filter.typeMoney === "lợi nhuận" ? "success.400" : "#000"
                  }
                >
                  {formatMoneyToVN(
                    compactMoney(data.ProfitTotal, 1000000, 2),
                    "Tr"
                  )}
                </Text>
              </Center>
            </HStack>
            {/* Chart */}
            <BarChartInMonthNoTitle
              sizeIcon={100}
              data={changeDataInMonth(filter.typeMoney)}
              dataOrigin={changeDataInMonth(filter.typeMoney, true)}
            ></BarChartInMonthNoTitle>
          </VStack>
        </VStack>
        {/* </ScrollView> */}
      </VStack>
      {isLoading && (
        <Modal isOpen={isLoading}>
          <LottieView
            source={require("../../assets/JsonLoading/AnimationLoaderDot.json")}
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

export default OverViewScreen;
