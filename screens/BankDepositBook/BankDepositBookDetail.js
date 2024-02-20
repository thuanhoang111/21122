import { HStack, Heading, VStack, Text, Center, Skeleton } from "native-base";
import Entypo from "react-native-vector-icons/Entypo";
import { useContext, useState, useEffect } from "react";
import Pagination from "./../../components/Pagination/Pagination";
import SkeletonTable from "../../components/Skeleton/SkeletonTable";
import { useToggle } from "@uidotdev/usehooks";
import BankDepositBookTable from "./BankDepositBookTable";
import { Alert, SafeAreaView } from "react-native";
import Header from "../../components/Header/Header";
import Filter from "./../../components/Filter/Filter";
import { Drawer } from "react-native-drawer-layout";
import * as Get from "../../API/service/Get";
import * as Post from "../../API/service/Post";
import { formatMoneyToVN } from "./../../constants/ConstantFunc";
import { MainContext } from "../MainContext";
import { heightOfScreen, widthOfScreen } from "../../constants/ConstantMain";
const title = ["Ngày", "Thu", "Chi", "Tồn"];
function BankDepositBookDetail({ route, navigation }) {
  const mainContext = useContext(MainContext);
  const dataUser = mainContext.dataUser;
  const inforFilter = mainContext.inforFilter;
  const lastPermissionYear = mainContext.lastPermissionYear;
  const isIos = mainContext.isIos;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [inverseDate, setInverseDate] = useToggle(false);
  const [lstBankAccount, setLstBankAccount] = useState([]);
  const [totalPrice, setTotalPrice] = useState({
    openingBalance: 0,
    endingBalance: 0,
  });
  // Quantity wants to be displayed on the table
  const quantityItem = 20;

  /**
   * Function Get list Bank account
   */
  const handleGetBankAccount = () => {
    Post.handlePostWithBody("CashInBank/FindListAccount", {
      userId: dataUser.id,
      year: inforFilter.year || lastPermissionYear,
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
  }, []);
  /**
   * Function get data BankDepositBookDetail
   * @param {Number} startMonth 
    @param {Number} endMonth 
    @param {Number} year 
    @param {Number} accountCode 
   */
  const handleGetData = (startMonth, endMonth, year, accountCode) => {
    Get.HandleGetWithParam(
      `CashInBank/CashInBank_Detail`,
      `m1=${startMonth}&m2=${endMonth}&AccountCode=${accountCode}&userId=${dataUser.id}&year=${year}`
    )
      .then((data) => {
        if (data.isError || data.error) {
          Alert.alert(
            data.errorMsg || "Thông báo",
            data.errorDescription || "Không có dữ liệu vui lòng chọn lại năm",
            [{ text: "Ok" }]
          );
          setData([]);
          handleGetTotalData(startMonth, endMonth, year, accountCode);
        } else {
          setData(data);
          setTotalPrice(
            data.length != 0
              ? {
                  openingBalance:
                    data[0].Expenditure != 0
                      ? data[0].Balance + data[0].Expenditure
                      : data[0].Balance - data[0].Revenue,
                  endingBalance:
                    data[data.length - 1].Balance -
                    data[data.length - 1].SpentTax +
                    data[data.length - 1].IncomeTax,
                }
              : { openingBalance: 0, endingBalance: 0 }
          );
          setPage(1);
        }
      })
      .finally(() => {
        setOpen(false);
        mainContext.onChangeLoading(false);
      });
  };
  /**
   * Function get data from Api
   * @param {Number} startMonth
   * @param {Number} endMonth
   * @param {Number} year
   * @param {Number} accountCode
   */
  const handleGetTotalData = (startMonth, endMonth, year, accountCode) => {
    Get.HandleGetWithParam(
      `CashInBank/CashInBank_Total`,
      `m1=${startMonth}&m2=${endMonth}&AccountCode=${accountCode}&userId=${dataUser.id}&year=${year}`
    ).then((data) => {
      if (!data.isError || !data.error) {
        setTotalPrice({
          openingBalance: data.TienDuDauKy,
          endingBalance: data.TienTonCuoiKy,
        });
      }
    });
  };
  useEffect(() => {
    data && data.reverse();
    setPage(1);
  }, [inverseDate]);
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
        <VStack height={heightOfScreen - 200} justifyContent={"flex-start"}>
          <VStack px={3} py={3}>
            <HStack
              space="3"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <HStack alignItems={"center"}>
                <Entypo name="dot-single" size={32} />
                <Heading fontSize={"xl"}>Số dư đầu kì:</Heading>
              </HStack>
              <Text fontSize={"xl"}>
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
            <>
              <BankDepositBookTable
                data={data.slice(
                  (page - 1) * quantityItem,
                  page * quantityItem
                )}
                fields={title}
                inverseDate={inverseDate}
                setInverseDate={setInverseDate}
                page={page}
              ></BankDepositBookTable>
            </>
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

export default BankDepositBookDetail;
