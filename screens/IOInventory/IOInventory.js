import { Center, HStack, Skeleton, Text, VStack, View } from "native-base";
import Header from "../../components/Header/Header";
import { SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import InOutputInventoryTable from "./IOInventoryTable";
import SkeletonTable from "../../components/Skeleton/SkeletonTable";
import { InOutputInventoryData } from "../../model/data";
import Pagination from "../../components/Pagination/Pagination";
import { Drawer } from "react-native-drawer-layout";
import IOInventoryFilter from "../../components/Filter/IOInventoryFilter";

const listTitle = ["Mã hàng", "Nhập", "Xuất"];
function InOutputInventory({ route, navigation }) {
  const dataUser = route.params.data;

  const [title, setTitle] = useState();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [inforFilter, setInforFilter] = useState({
    warehouse: "",
    accountType: "",
    unitType: "",
    productionCode: "",
    productionName: "",
    startMonth: "",
    endMonth: "",
    startDay: "",
    endDay: "",
  });
  const quantityItem = 10;
  useEffect(() => {
    setTimeout(() => {
      setData(InOutputInventoryData);
      setTitle("Từ tháng 1 đến tháng 11");
    }, 1000);
  }, []);
  const onClick = (dataTransfer) => {
    navigation.navigate("Chi tiết vật tư hàng hóa", {
      dataTransfer: dataTransfer,
    });
  };
  const handleGetData = (data) => {
    console.log(data);
  };
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
          <IOInventoryFilter
            inforPermission={dataUser.permission}
            onSearch={(data) => console.log(data)}
            inforFilter={inforFilter}
          />
        );
      }}
      drawerStyle={{ backgroundColor: "#fff", width: "85%" }}
    >
      <VStack>
        <Header
          title={"Nhập xuất tồn"}
          isRightIcon
          onClick={() => setOpen(!open)}
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
              <InOutputInventoryTable
                data={data.slice(
                  (page - 1) * quantityItem,
                  page * quantityItem
                )}
                fields={listTitle}
                onclick={onClick}
              ></InOutputInventoryTable>
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

export default InOutputInventory;
