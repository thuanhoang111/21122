import { Center, HStack, Skeleton, Text, VStack, View } from "native-base";
import Header from "../../components/Header/Header";
import { Alert, SafeAreaView } from "react-native";
import { useContext, useEffect, useState } from "react";
import Pagination from "../../components/Pagination/Pagination";
import SkeletonTable from "../../components/Skeleton/SkeletonTable";
import DebtTrackingTable from "./DebtTrackingTable";
import { Drawer } from "react-native-drawer-layout";
import DebtTrackingFilter from "../../components/Filter/DebtTrackingFilter";
import { MainContext } from "../MainContext";
import { heightOfScreen, widthOfScreen } from "../../constants/ConstantMain";
import * as Post from "../../API/service/Post";
const initInforSearch = {
  bookStyleDS: [],
  customerDS: [],
};
function DebtTracking({ route, navigation }) {
  const mainContext = useContext(MainContext);
  const isIos = mainContext.isIos;
  const [open, setOpen] = useState(false);
  const dataUser = mainContext.dataUser;
  const inforFilter = mainContext.inforFilter;
  const onChangeLoading = mainContext.onChangeLoading;
  const lastPermissionYear = mainContext.lastPermissionYear;
  const [title, setTitle] = useState();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [inforSearch, setInforSearch] = useState(initInforSearch);

  const quantityItem = 10;
  const listTitle = ["Đối tượng", "Đầu kỳ", "Trong kỳ", "Cuối kỳ"];
  const handleGetAllObj = () => {
    Post.handlePostWithBody("DebtReport/FindSearch", {
      userId: dataUser.id,
      year: inforFilter.year || lastPermissionYear,
    }).then((data) => {
      if (data.isError) {
        setInforSearch(initInforSearch);
      } else {
        setInforSearch(data);
      }
    });
  };
  useEffect(() => {
    setTitle(
      `Từ tháng ${inforFilter.startMonth || 1} đến tháng ${
        inforFilter.endMonth || 12
      }`
    );
    handleGetData(
      inforFilter.startMonth || 1,
      inforFilter.endMonth || 12,
      inforFilter.startDay || "",
      inforFilter.endDay || "",
      inforFilter.debtBookCode || "131",
      inforFilter.cusCode || [],
      inforFilter.year || lastPermissionYear
    );
    handleGetAllObj();
  }, []);
  const onClick = (dataTransfer) => {
    const valueBS = inforSearch.bookStyleDS.find(
      (item) => item.BookCode == inforFilter.debtBookCode
    );
    dataTransfer.Obj = `${valueBS.BookCode} - ${valueBS.BookName}`;
    navigation.navigate("Chi tiết công nợ", {
      dataTransfer: dataTransfer,
    });
  };
  const handleGetData = (
    startMonth,
    endMonth,
    startDay,
    endDay,
    debtBookCode,
    cusCode,
    year
  ) => {
    Post.handlePostWithBody("DebtReport/", {
      m1: startMonth,
      m2: endMonth,
      startDay,
      endDay,
      debtBookCode,
      cusCode,
      userId: dataUser.id,
      year,
    })
      .then((data) => {
        if (data.isError || data.error) {
          Alert.alert(data.errorMsg || "Thông báo", data.errorDescription, [
            { text: "Ok" },
          ]);
          setData([]);
        } else {
          setData(data);
        }
      })
      .finally(() => {
        setOpen(false);
        mainContext.onChangeLoading(false);
        mainContext.onChangeInforFilter({
          startMonth,
          endMonth,
          startDay,
          endDay,
          debtBookCode,
          cusCode,
          year,
        });
      });
  };
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
          <DebtTrackingFilter
            inforPermission={dataUser.permission}
            onSearch={handleGetData}
            bookStyleDS={inforSearch.bookStyleDS}
            customerDS={inforSearch.customerDS}
          />
        );
      }}
      drawerStyle={{ backgroundColor: "#f1f1f1", width: "85%" }}
    >
      <Header
        title={"Theo dõi công nợ"}
        isRightIcon
        onBack={() => navigation.goBack()}
        onClick={() => setOpen(true)}
      ></Header>
      <SafeAreaView>
        <VStack height={heightOfScreen - 180} justifyContent={"flex-start"}>
          <Center py={3} backgroundColor={"red"}>
            {title ? (
              <Text fontSize="xl" bold>
                {title}
              </Text>
            ) : (
              <Skeleton.Text width={"70%"} lines={1}></Skeleton.Text>
            )}
          </Center>
          {data ? (
            <DebtTrackingTable
              data={data.slice((page - 1) * quantityItem, page * quantityItem)}
              totalData={data.at(-1)}
              fields={listTitle}
              onClick={onClick}
              page={page}
            ></DebtTrackingTable>
          ) : (
            <>
              <Center
                w="100%"
                style={{
                  borderRadius: 25,
                  zIndex: 100,
                }}
              >
                <SkeletonTable length={8} numberInLine={4} />
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
          {/* Pagination */}
          {data && (
            <HStack
              alignItems={"center"}
              justifyContent={"flex-end"}
              paddingX={3}
              flex={1.4}
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
    </Drawer>
  );
}

export default DebtTracking;
