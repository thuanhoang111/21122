import { Center, HStack, Skeleton, Text, VStack } from "native-base";
import Header from "../../components/Header/Header";
import { SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import IOInventoryDetailTable from "./IOInventoryDetailTable";
import SkeletonTable from "../../components/Skeleton/SkeletonTable";
import { heightOfScreen } from "../../constants/ConstantMain";
import { IEInventoryDetailTableData } from "../../model/data";
import Pagination from "../../components/Pagination/Pagination";
const listTitle = ["Ngày", "Số CT", "Nhập/Xuất", "Tồn"];
function InOutputInventoryDetail({ route, navigation }) {
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const quantityItem = 11;
  useEffect(() => {
    setData(IEInventoryDetailTableData);
  }, []);
  return (
    <VStack space="5">
      <Header
        title={"Chi tiết vật tư hàng hóa"}
        onBack={() => navigation.goBack()}
      />
      <SafeAreaView>
        <VStack>
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
