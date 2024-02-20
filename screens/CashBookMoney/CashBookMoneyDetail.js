import { HStack, Heading, VStack, Text, Center, Skeleton } from "native-base";
import Entypo from "react-native-vector-icons/Entypo";
import CashBookMoneyTable from "./CashBookMoneyTable";
import { useContext, useState } from "react";
import { useEffect } from "react";
import Pagination from "./../../components/Pagination/Pagination";
import * as Get from "../../API/service/Get";
import SkeletonTable from "../../components/Skeleton/SkeletonTable";
import { useToggle } from "@uidotdev/usehooks";
import { Alert, SafeAreaView } from "react-native";
import { Drawer } from "react-native-drawer-layout";
import Filter from "../../components/Filter/Filter";
import Header from "../../components/Header/Header";
import { formatMoneyToVN } from "../../constants/ConstantFunc";
import { MainContext } from "../MainContext";
import { heightOfScreen, widthOfScreen } from "../../constants/ConstantMain";

const listTitle = ["Ngày", "Thu", "Chi", "Tồn"];
function CashBookMoneyDetail({ route, navigation }) {
  const mainContext = useContext(MainContext);
  const dataUser = mainContext.dataUser;
  const inforFilter = mainContext.inforFilter;
  const lastPermissionYear = mainContext.lastPermissionYear;
  const isIos = mainContext.isIos;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [totalPrice, setTotalPrice] = useState({
    openingBalance: 0,
    endingBalance: 0,
  });
  const [inverseDate, setInverseDate] = useToggle(false);
  const quantityItem = 20;
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
    Get.HandleGetWithParam(
      `DongTienMat/CashBook_Detail`,
      `m1=${startMonth}&m2=${endMonth}&AccountType=${accountType}&userId=${dataUser.id}&year=${year}`
    )
      .then((data) => {
        if (data.isError || data.error) {
          Alert.alert(
            data.errorMsg || "Thông báo",
            data.errorDescription || "Không có dữ liệu vui lòng chọn lại năm",
            [{ text: "Ok" }]
          );
          setData([]);
          handleGetTotalData(startMonth, endMonth, year, accountType);
        } else {
          data && data.results && setData(data.results[0]);
          setPage(1);
          const currentData = data.results[0];

          setTotalPrice(
            currentData.length != 0
              ? {
                  openingBalance:
                    currentData[0].Expenditure != 0
                      ? currentData[0].Balance + currentData[0].Expenditure
                      : currentData[0].Balance - currentData[0].Revenue,
                  endingBalance:
                    currentData[currentData.length - 1].Balance -
                    currentData[currentData.length - 1].SpentTax +
                    currentData[currentData.length - 1].IncomeTax,
                  // + currentData[currentData.length - 1].Revenue,
                }
              : { openingBalance: 0, endingBalance: 0 }
          );
        }
      })
      .finally(() => {
        setOpen(false);
        mainContext.onChangeLoading(false);
      });
  };
  /**
   * Author: ThuanHoang 19/09/2023
   * Function get data from Api CashMoney
   * @param {ArrayList} data
   */
  const handleGetTotalData = (startMonth, endMonth, year, accountType) => {
    Get.HandleGetWithParam(
      `DongTienMat/CashBook`,
      `m1=${startMonth}&m2=${endMonth}&AccountType=${accountType}&userId=${dataUser.id}&year=${year}`
    )
      .then((data) => {
        const currentData = data.results[0];
        if (!data.isError || !data.error || data.results[0] != undefined) {
          setTotalPrice(
            inforFilter.accountCode == 0
              ? {
                  openingBalance: currentData.TienDuDauKy,
                  endingBalance: currentData.TienTonCuoiKy,
                }
              : {
                  openingBalance: currentData.TienDuDauKyNgoaiTe,
                  endingBalance: currentData.TienDuCuoiKyNgoaiTe,
                }
          );
        }
      })
      .finally(() => {
        mainContext.onChangeLoading(false);
      });
  };
  useEffect(() => {
    data && data.reverse();
    setPage(1);
  }, [inverseDate]);
  useEffect(() => {
    handleGetData(
      inforFilter.startMonth || 1,
      inforFilter.endMonth || 12,
      inforFilter.year || lastPermissionYear,
      0
    );
  }, []);
  return (
    <Drawer
      swipeEdgeWidth={widthOfScreen * 0.5}
      swipeMinDistance={100}
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
        title={"Chi tiết sổ quỹ"}
        onClick={() => setOpen(true)}
        isRightIcon
      />
      <SafeAreaView>
        <VStack height={heightOfScreen - 200}>
          <VStack px={3} py={3}>
            <HStack
              space="3"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <HStack alignItems={"center"}>
                <Entypo name="dot-single" size={32} />
                <Heading fontSize={20}>Số dư đầu kì:</Heading>
              </HStack>
              <Text fontSize={20}>
                {totalPrice ? (
                  formatMoneyToVN(totalPrice.openingBalance, "đ")
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
              <HStack alignItems={"center"}>
                <Entypo name="dot-single" size={32} />
                <Heading fontSize={"xl"}>Số dư cuối kì:</Heading>
              </HStack>
              <Text fontSize={"xl"}>
                {totalPrice ? (
                  formatMoneyToVN(totalPrice.endingBalance, "đ")
                ) : (
                  <Skeleton.Text w={"60%"} lines={1} borderRadius={10} />
                )}
              </Text>
            </HStack>
          </VStack>
          {data ? (
            <CashBookMoneyTable
              data={data.slice((page - 1) * quantityItem, page * quantityItem)}
              fields={listTitle}
              inverseDate={inverseDate}
              setInverseDate={setInverseDate}
              page={page}
            ></CashBookMoneyTable>
          ) : (
            <>
              <Center
                w="100%"
                paddingTop={4}
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
              flex={1}
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
