import { HStack, Heading, VStack, Text, Center, Skeleton } from "native-base";
import Entypo from "react-native-vector-icons/Entypo";
import { useState } from "react";
import { useEffect } from "react";
import Pagination from "./../../components/Pagination/Pagination";
import SkeletonTable from "../../components/Skeleton/SkeletonTable";
import { useToggle } from "@uidotdev/usehooks";
import BankDepositBookTable from "./BankDepositBookTable";
import { Alert, SafeAreaView } from "react-native";
import Header from "../../components/Header/Header";
import Filter from "./../../components/Filter/Filter";
import { Drawer } from "react-native-drawer-layout";
import axios from "axios";
import { formatMoneyToVN } from "./../../constants/ConstantFunc";
const title = ["Ngày", "Thu", "Chi", "Tồn"];
function BankDepositBookDetail({ route, navigation }) {
  const [open, setOpen] = useState(false);
  const dataUser = route.params.data;
  const inforFilter = route.params.inforFilter;
  const lastPermissionYear =
    dataUser.permission[dataUser.permission.length - 1].year;
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [inverseDate, setInverseDate] = useToggle(false);
  const [lstBankAccount, setLstBankAccount] = useState([]);
  const quantityItem = 11;
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
    inforFilter
      ? handleGetData(
          inforFilter.startMonth,
          inforFilter.endMonth,
          inforFilter.year,
          inforFilter.accountCode
        )
      : handleGetData(1, 12, lastPermissionYear, 1121);
    handleGetBankAccount();
  }, []);
  const handleGetData = (startMonth, endMonth, year, accountCode) => {
    axios
      .get(
        `http://192.168.90.84:1375/api/CashInBank/CashInBank_Detail?m1=${startMonth}&m2=${endMonth}&AccountCode=${accountCode}&userId=${dataUser.id}&year=${year}`
      )
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        if (data.error) {
          Alert.alert("Thông báo", data.errorDescription, [{ text: "Ok" }]);
        } else {
          data && setData(data);
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
        title={"Chi tiết sổ tiền gửi NH"}
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
                {data ? (
                  data[0] ? (
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
              <BankDepositBookTable
                data={data.slice(
                  (page - 1) * quantityItem,
                  page * quantityItem
                )}
                fields={title}
                inverseDate={inverseDate}
                setInverseDate={setInverseDate}
              ></BankDepositBookTable>
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

export default BankDepositBookDetail;
