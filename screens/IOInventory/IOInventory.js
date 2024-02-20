import { Center, HStack, Skeleton, Text, VStack } from "native-base";
import Header from "../../components/Header/Header";
import { Alert, SafeAreaView } from "react-native";
import { useContext, useEffect, useState } from "react";
import SkeletonTable from "../../components/Skeleton/SkeletonTable";
import Pagination from "../../components/Pagination/Pagination";
import { Drawer } from "react-native-drawer-layout";
import IOInventoryFilter from "../../components/Filter/IOInventoryFilter";
import IOInventoryTable from "./IOInventoryTable";
import { MainContext } from "../MainContext";
import * as Get from "../../API/service/Get";
import * as Post from "../../API/service/Post";
import { heightOfScreen, widthOfScreen } from "../../constants/ConstantMain";
const listTitle = ["Mã hàng", "Nhập", "Xuất"];
const initInforSearch = {
  UnitList: [],
  wareHouseList: [],
  accountList: [],
};
function IOInventory({ route, navigation }) {
  const mainContext = useContext(MainContext);
  const dataUser = mainContext.dataUser;
  const lastPermissionYear = mainContext.lastPermissionYear;
  const inforFilter = mainContext.inforFilter;
  const isIos = mainContext.isIos;
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [inforSearch, setInforSearch] = useState({
    UnitList: [],
    wareHouseList: [],
    accountList: [],
  });
  const quantityItem = 20;
  const handleGetData = async (
    year,
    warehouse,
    accountType,
    unitType,
    productionCode,
    productionName,
    startMonth,
    endMonth,
    startDay,
    endDay
  ) => {
    await Get.HandleGetWithParam(
      `IOInventory/IOInventory_Total`,
      `m1=${startMonth}&m2=${endMonth}&startDay=${startDay}&endDay=${endDay}&productCode=${productionCode}&productName=${productionName}&unitCode=${unitType}&wareHouseCode=${warehouse}&kanKamokuCode=${accountType}&userId=${dataUser.id}&year=${year}`
    )
      .then((data) => {
        if (data.isError || data.error) {
          Alert.alert(data.errorMsg || "Thông báo", data.errorDescription, [
            { text: "Ok" },
          ]);
          setData([]);
        } else {
          data && setData(data[0]);
        }
        year != inforFilter.year && handleGetInforSearchDT(year);
      })
      .finally(() => {
        setTimeout(() => {
          setOpen(false);
          setPage(1);
          mainContext.onChangeInforFilter({
            warehouse,
            accountType,
            unitType,
            productionCode,
            productionName,
            year,
            startMonth,
            endMonth,
            startDay,
            endDay,
          });
        }, 2000);
      });
    mainContext.onChangeLoading(false);
  };
  /**
   * Function Get list Bank account
   */
  const handleGetInforSearchDT = async (year) => {
    await Post.handlePostWithBody("IOInventory/FindSearch", {
      userId: dataUser.id,
      year: year,
    }).then((data) => {
      setInforSearch(initInforSearch);

      if (data.isError || data.error) {
      } else {
        setInforSearch(data);
      }
      return data;
    });
  };
  useEffect(() => {
    handleGetInforSearchDT(inforFilter.year || lastPermissionYear);
    handleGetData(
      inforFilter.year || lastPermissionYear,
      "",
      // data.accountList[1] || 152,
      "",
      "",
      "",
      "",
      inforFilter.startMonth || 1,
      inforFilter.endMonth || 1,
      "",
      ""
    );
    return () => {
      mainContext.onChangeInforFilter((item) => ({
        productionCode: undefined,
      }));
    };
  }, []);
  const onClick = (dataTransfer) => {
    navigation.navigate("Chi tiết vật tư hàng hóa", {
      dataTransfer: dataTransfer,
    });
  };
  return (
    <Drawer
      swipeEdgeWidth={widthOfScreen * 0.5}
      swipeMinDistance={50}
      swipeMinVelocity={2000}
      drawerPosition="right"
      drawerType="front"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      hideStatusBarOnOpen
      swipeEnabled={isIos}
      renderDrawerContent={() => {
        return (
          <IOInventoryFilter
            onSearchAgain={handleGetInforSearchDT}
            inforPermission={dataUser.permission}
            onSearch={handleGetData}
            inforSearch={inforSearch}
          />
        );
      }}
      drawerStyle={{ backgroundColor: "#f1f1f1", width: "85%" }}
    >
      <VStack>
        <Header
          title={"Nhập xuất tồn"}
          isRightIcon
          onClick={() => setOpen(!open)}
          onBack={() => navigation.goBack()}
        ></Header>
        <SafeAreaView>
          <VStack height={heightOfScreen - 200} justifyContent={"flex-start"}>
            <VStack alignItems={"center"} py={3}>
              {inforFilter.startMonth || inforFilter.startDay ? (
                <Text
                  fontSize="lg"
                  fontWeight={600}
                  px={2}
                  textAlign={"center"}
                  width={"80%"}
                >
                  {inforFilter.startMonth != 0
                    ? inforFilter.startMonth == inforFilter.endMonth
                      ? `Trong tháng ${inforFilter.startMonth}`
                      : `Từ tháng ${inforFilter.startMonth} đến tháng ${inforFilter.endMonth}`
                    : inforFilter.startDay === inforFilter.endDay
                    ? `Trong ngày ${inforFilter.startDay}`
                    : `Từ ngày ${inforFilter.startDay} đến ngày ${inforFilter.endDay}`}
                </Text>
              ) : (
                <Skeleton.Text width={"70%"} lines={1}></Skeleton.Text>
              )}
            </VStack>
            {data ? (
              <IOInventoryTable
                data={data.slice(
                  (page - 1) * quantityItem,
                  page * quantityItem
                )}
                fields={listTitle}
                onClick={onClick}
                page={page}
              ></IOInventoryTable>
            ) : (
              <>
                <Center
                  w="100%"
                  style={{
                    borderRadius: 25,
                    zIndex: 100,
                  }}
                >
                  <SkeletonTable length={8} numberInLine={3} />
                </Center>
                <HStack
                  padding={6}
                  alignItems={"center"}
                  justifyContent={"flex-end"}
                  width={"100%"}
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
                />
              </HStack>
            )}
          </VStack>
        </SafeAreaView>
      </VStack>
    </Drawer>
  );
}

export default IOInventory;
