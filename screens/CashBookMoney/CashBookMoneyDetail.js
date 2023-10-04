import { HStack, Heading, VStack, Text, Center, Skeleton } from "native-base";
import Entypo from "react-native-vector-icons/Entypo";
import CashBookMoneyTable from "./CashBookMoneyTable";
import { useState } from "react";
import { useEffect } from "react";
import Pagination from "./../../components/Pagination/Pagination";
import axios from "axios";
import SkeletonTable from "../../components/Skeleton/SkeletonTable";
import { useToggle } from "@uidotdev/usehooks";
import { Alert, SafeAreaView } from "react-native";
import { Drawer } from "react-native-drawer-layout";
import Filter from "../../components/Filter/Filter";
import Header from "../../components/Header/Header";
import { formatMoneyToVN } from "../../constants/ConstantFunc";

const listTitle = ["Ngày", "Thu", "Chi", "Tồn"];
function CashBookMoneyDetail({ route, navigation }) {
  const dataUser = route.params.data;
  const inforFilter = route.params.inforFilter;
  const lastPermissionYear =
    dataUser.permission[dataUser.permission.length - 1].year;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  console.log(inforFilter);
  const [inverseDate, setInverseDate] = useToggle(false);
  const quantityItem = 11;
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
  const handleGetData = (startMonth, endMonth, year, accountType) => {
    axios
      .get(
        `http://192.168.90.84:1375/api/DongTienMat/CashBook_Detail?m1=${startMonth}&m2=${endMonth}&AccountType=${accountType}&userId=${dataUser.id}&year=${year}`
      )
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        if (data.error) {
          Alert.alert("Thông báo", data.errorDescription, [{ text: "Ok" }]);
        } else {
          data && data.results && setData(data.results[0]);
          setPage(1);
          setOpen(false);
        }
      })
      .catch(() =>
        setTimeout(() => {
          setData([]);
        }, 3000)
      );
  };
  useEffect(() => {
    data && data.reverse();
    setPage(1);
  }, [inverseDate]);
  useEffect(() => {
    inforFilter
      ? handleGetData(
          inforFilter.startMonth,
          inforFilter.endMonth,
          inforFilter.year,
          inforFilter.accountCode
        )
      : handleGetData(1, 12, lastPermissionYear, 0);
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
        title={"Chi Tiết Sổ Quỹ"}
        onClick={() => setOpen(true)}
        isRightIcon
      />
      <SafeAreaView>
        <VStack>
          <VStack px={3} py={3}>
            <HStack
              space="3"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <Heading fontSize={"xl"}>
                <Entypo name="dot-single" size={32} />
                Số dư đầu kì:
              </Heading>
              <Text fontSize={"xl"}>
                {/* {inforBalance.beginBalance
                  ? inforBalance.beginBalance.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })
                  : "0đ"} */}
                {data ? (
                  data[data.length - 1] ? (
                    formatMoneyToVN(
                      data[0].Expenditure != 0
                        ? data[0].Balance + data[0].Expenditure
                        : data[0].Balance + data[0].Revenue
                    )
                  ) : (
                    formatMoneyToVN(0)
                  )
                ) : (
                  <Skeleton.Text w={"60%"} lines={1} borderRadius={10} />
                )}
              </Text>
            </HStack>
            <HStack
              space="3"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <Heading fontSize={"xl"}>
                <Entypo name="dot-single" size={32} />
                Số dư cuối kì:
              </Heading>
              <Text fontSize={"xl"}>
                {data ? (
                  data[data.length - 1] ? (
                    formatMoneyToVN(
                      data[data.length - 1].Expenditure != 0
                        ? data[data.length - 1].Balance +
                            data[data.length - 1].Expenditure
                        : data[data.length - 1].Balance +
                            data[data.length - 1].Revenue
                    )
                  ) : (
                    formatMoneyToVN(0)
                  )
                ) : (
                  <Skeleton.Text w={"60%"} lines={1} borderRadius={10} />
                )}
              </Text>
            </HStack>
          </VStack>
          {data ? (
            <>
              <CashBookMoneyTable
                data={data.slice(
                  (page - 1) * quantityItem,
                  page * quantityItem
                )}
                fields={listTitle}
                inverseDate={inverseDate}
                setInverseDate={setInverseDate}
              ></CashBookMoneyTable>
            </>
          ) : (
            <>
              <Center
                w="100%"
                style={{
                  borderRadius: 25,
                  zIndex: 100,
                }}
              >
                <SkeletonTable length={7} numberInLine={4} />
              </Center>
              <HStack
                padding={6}
                alignItems={"center"}
                justifyContent={"flex-end"}
              >
                <Skeleton w={"60%"} lines={1} borderRadius={10} />
              </HStack>
            </>
          )}
          {data && (
            <HStack
              alignItems={"center"}
              justifyContent={"flex-end"}
              paddingX={3}
            >
              <Pagination
                callBack={setPage}
                currentValue={page}
                lengthData={data.length}
                quantityItem={quantityItem}
                inverseDate={inverseDate}
              />
            </HStack>
          )}
        </VStack>
      </SafeAreaView>
    </Drawer>
  );
}

export default CashBookMoneyDetail;
