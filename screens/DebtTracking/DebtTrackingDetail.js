import { Center, HStack, Heading, Skeleton, Text, VStack } from "native-base";
import Header from "../../components/Header/Header";
import { formatMoneyToVN } from "../../constants/ConstantFunc";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import DebtTrackingDetailTable from "./DebtTrackingDetailTable";
import { Alert, SafeAreaView } from "react-native";
import { useState, useEffect, useContext } from "react";
import SkeletonTable from "../../components/Skeleton/SkeletonTable";
import Pagination from "../../components/Pagination/Pagination";
import { MainContext } from "../MainContext";
import * as Post from "../../API/service/Post";
import { heightOfScreen } from "../../constants/ConstantMain";
function DebtTrackingDetail({ route, navigation }) {
  const listTitle = ["Ngày", "Phát sinh", "Số dư"];
  const mainContext = useContext(MainContext);
  const dataUser = mainContext.dataUser;
  const debtSelected = route.params.dataTransfer;
  const inforFilter = mainContext.inforFilter;
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const handleGetData = (
    startMonth,
    endMonth,
    startDay,
    endDay,
    debtBookCode,
    year
  ) => {
    Post.handlePostWithBody("DebtReport/Detail", {
      m1: startMonth,
      m2: endMonth,
      startDay,
      endDay,
      debtBookCode,
      cusCode: [debtSelected.CusId],
      userId: dataUser.id,
      year,
    })
      .then((data) => {
        if (data.isError || data.error) {
          Alert.alert(data.errorMsg || "Thông báo", data.errorDescription, [
            { text: "Ok" },
          ]);
          setData({ listDebtReportDetail: [] });
        } else {
          setData(data);
        }
      })
      .finally(() => {
        mainContext.onChangeLoading(false);
        mainContext.onChangeInforFilter({
          startMonth,
          endMonth,
          startDay,
          endDay,
          debtBookCode,
          year,
        });
      });
  };
  const quantityItem = 10;
  useEffect(() => {
    handleGetData(
      inforFilter.startMonth || 1,
      inforFilter.endMonth || 12,
      inforFilter.startDay || "",
      inforFilter.endDay || "",
      inforFilter.debtBookCode || 131,
      inforFilter.year || lastPermissionYear
    );
  }, []);
  return (
    <VStack space="4">
      <Header
        title={"Chi tiết công nợ"}
        onBack={() => navigation.goBack()}
      ></Header>
      <VStack space="3" paddingX={2} alignItems={"center"}>
        <Heading size={"md"} textAlign={"left"} width={"100%"}>
          * Chi tiết công nợ
        </Heading>
        <VStack space="1" width={"95%"}>
          <HStack
            space="3"
            alignItems="center"
            justifyContent={"space-between"}
          >
            <HStack alignItems={"center"}>
              <EvilIcons name="sc-telegram" />
              <Text fontSize="md" bold>
                Tài khoản:
              </Text>
            </HStack>
            <Text fontSize="sm" flex={1}>
              {debtSelected.CusName}
            </Text>
          </HStack>
          <HStack
            space="3"
            alignItems="center"
            justifyContent={"space-between"}
          >
            <HStack alignItems={"center"}>
              <EvilIcons name="sc-telegram" />
              <Text fontSize="md" bold>
                Đối tượng:
              </Text>
            </HStack>
            <Text fontSize="sm" flex={1}>
              {debtSelected.Obj}
            </Text>
          </HStack>
          <HStack
            space="3"
            alignItems="center"
            justifyContent={"space-between"}
          >
            <HStack alignItems={"center"}>
              <EvilIcons name="sc-telegram" />
              <Text fontSize="md" bold>
                Thời gian:
              </Text>
            </HStack>
            <Text
              fontSize="sm"
              flex={1}
            >{`Từ ${inforFilter.startMonth}/${inforFilter.year} đến ${inforFilter.endMonth}/${inforFilter.year}`}</Text>
          </HStack>
        </VStack>
      </VStack>
      <SafeAreaView>
        <VStack height={heightOfScreen - 325} justifyContent={"flex-start"}>
          {data && data.listDebtReportDetail ? (
            <DebtTrackingDetailTable
              data={data.listDebtReportDetail.slice(
                (page - 1) * quantityItem,
                page * quantityItem
              )}
              totalPrice={{
                totalDebtBalance: data.totalDebtBalance,
                totalOddDebt: data.totalOddDebt,
                totalOddValid: data.totalOddValid,
                totalValidBalance: data.totalValidBalance,
              }}
              fields={listTitle}
              page={page}
            ></DebtTrackingDetailTable>
          ) : (
            <>
              <Center
                w="100%"
                style={{
                  borderRadius: 25,
                  zIndex: 100,
                }}
              >
                <SkeletonTable length={5} numberInLine={4} />
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
          {data && data.listDebtReportDetail && (
            <HStack
              alignItems={"center"}
              justifyContent={"flex-end"}
              paddingX={3}
              flex={1}
            >
              <Pagination
                callBack={setPage}
                currentValue={page}
                lengthData={data.listDebtReportDetail.length}
                quantityItem={quantityItem}
              />
            </HStack>
          )}
        </VStack>
      </SafeAreaView>
    </VStack>
  );
}

export default DebtTrackingDetail;
