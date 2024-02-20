import { Center, HStack, Skeleton, VStack } from "native-base";
import Header from "../../components/Header/Header";
import { Alert, SafeAreaView } from "react-native";
import { useContext, useEffect, useState } from "react";
import IOInventoryDetailTable from "./IOInventoryDetailTable";
import SkeletonTable from "../../components/Skeleton/SkeletonTable";
import { heightOfScreen } from "../../constants/ConstantMain";
import Pagination from "../../components/Pagination/Pagination";
const listTitle = ["Ngày", "Số CT", "Nhập/Xuất", "Tồn"];
import * as Get from "../../API/service/Get";
import { MainContext } from "../MainContext";
function InOutputInventoryDetail({ route, navigation }) {
  const mainContext = useContext(MainContext);
  const dataUser = mainContext.dataUser;
  const lastPermissionYear = mainContext.lastPermissionYear;
  const inforFilter = mainContext.inforFilter;
  const productionCode = route.params.dataTransfer.ProductCode;
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const quantityItem = 40;
  const handleGetData = async (
    year,
    unitType,
    productionCode,
    startMonth,
    endMonth,
    startDay,
    endDay
  ) => {
    await Get.HandleGetWithParam(
      `IOInventory/IOProductDetail`,
      `m1=${startMonth}&m2=${endMonth}&startDay=${startDay}&endDay=${endDay}&productCode=${productionCode}&unitCode=${unitType}&userId=${dataUser.id}&year=${year}`
    )
      .then((data) => {
        if (data.isError || data.error) {
          Alert.alert(data.errorMsg || "Thông báo", data.errorDescription, [
            { text: "Ok" },
          ]);
          setData([]);
        } else {
          data[0] && setData(data[0]);
        }
      })
      .finally(() => {
        setPage(1);
        mainContext.onChangeInforFilter({
          unitType,
          productionCode,
          year,
          startMonth,
          endMonth,
          startDay,
          endDay,
        });
      });
  };
  useEffect(() => {
    handleGetData(
      inforFilter.year || lastPermissionYear,
      "",
      productionCode,
      inforFilter.startMonth || 1,
      inforFilter.endMonth || 12,
      "",
      ""
    );
  }, []);
  return (
    <VStack space="5">
      <Header
        title={"Chi tiết vật tư hàng hóa"}
        onBack={() => navigation.goBack()}
      />
      <SafeAreaView>
        <VStack height={heightOfScreen - 220} justifyContent={"center"}>
          {data ? (
            <>
              <IOInventoryDetailTable
                data={data.slice(
                  (page - 1) * quantityItem,
                  page * quantityItem
                )}
                fields={listTitle}
              ></IOInventoryDetailTable>
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
                <SkeletonTable
                  length={Math.round(heightOfScreen / 90)}
                  numberInLine={4}
                />
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
          {data && data.length != 0 && (
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
  );
}

export default InOutputInventoryDetail;
