import { Center, HStack, Skeleton, Text, VStack } from "native-base";
import Header from "../../components/Header/Header";
import { SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination/Pagination";
import SkeletonTable from "../../components/Skeleton/SkeletonTable";
import DebtTrackingTable from "./DebtTrackingTable";
import { DebtTrackingData } from "../../model/data";

function DebtTracking({ route, navigation }) {
  const [title, setTitle] = useState();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const quantityItem = 9;
  const listTitle = ["Đối tượng", "Đầu kỳ", "Trong kỳ", "Cuối kỳ"];
  useEffect(() => {
    setTimeout(() => {
      setData(DebtTrackingData);
      setTitle("Từ tháng 1 đến tháng 11");
    }, 1000);
  }, []);
  return (
    <VStack>
      <Header
        title={"Theo dõi công nợ"}
        isRightIcon
        onBack={() => navigation.goBack()}
      ></Header>
      <SafeAreaView>
        <VStack>
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
              fields={listTitle}
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
              />
            </HStack>
          )}
        </VStack>
      </SafeAreaView>
    </VStack>
  );
}

export default DebtTracking;
