import {
  Center,
  Divider,
  HStack,
  Heading,
  VStack,
  Text,
  Pressable,
} from "native-base";
import { StyleSheet, VirtualizedList } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { memo, useContext, useEffect } from "react";
import { formatMoneyToVN } from "../../constants/ConstantFunc";
import { widthOfScreen } from "../../constants/ConstantMain";
import { MainContext } from "../MainContext";
import NoData from "../../components/NoData/NoData";
function IOInventoryTable({ data = [], fields, onClick, page }) {
  const mainContext = useContext(MainContext);
  const isIos = mainContext.isIos;
  const getItemCount = (_data) => data.length;
  const listWidth = ["35%", "28%", "25%"];
  useEffect(() => {
    data.length != 0 &&
      this.IOInventoryTableRef.scrollToOffset({ animated: true, offset: 0 });
  }, [page]);
  return (
    <Center style={styles.table} flex={15}>
      <HStack
        style={styles.tableHeader}
        justifyContent={"flex-start"}
        w={"100%"}
      >
        {fields.map((item, index) => {
          return (
            <Pressable
              py={2}
              key={index}
              width={listWidth[index]}
              // onPressIn={() => {
              //   item === "Ngày" && setInverseDate(!inverseDate);
              // }}
            >
              <Heading size={"sm"} key={index} style={styles.titleHeader}>
                {item}
              </Heading>
            </Pressable>
          );
        })}
      </HStack>
      <VStack style={styles.tableContent} flex={15}>
        {data.length != 0 ? (
          <VirtualizedList
            ref={(ref) => {
              this.IOInventoryTableRef = ref;
            }}
            initialNumToRender={1}
            renderItem={({ item, index }) => {
              return (
                <Pressable onPress={() => onClick(item)}>
                  {({ isHovered, isFocused, isPressed }) => {
                    return (
                      <>
                        <HStack
                          w={"100%"}
                          style={styles.boxItemContent}
                          paddingLeft={0.5}
                          alignItems={"center"}
                          space={1}
                          bg={
                            isPressed
                              ? "coolGray.200"
                              : isHovered
                              ? "coolGray.200"
                              : "white"
                          }
                        >
                          <VStack
                            alignItems={"flex-start"}
                            style={[{ width: listWidth[0] }]}
                          >
                            <Text fontSize={"sm"} bold>
                              {item.ProductCode || "X"}
                            </Text>
                            <Text fontSize={"xs"}>
                              {item.ProductName || "X"}
                            </Text>
                          </VStack>
                          <VStack
                            alignItems={"flex-start"}
                            style={[{ width: listWidth[1] }]}
                          >
                            <Text fontSize={"sm"} bold>
                              {item.ImportQuantity || "0"}
                            </Text>
                            <Text fontSize={"xs"}>
                              {item.ImportValue
                                ? formatMoneyToVN(item.ImportValue, "đ")
                                : "0đ"}
                            </Text>
                          </VStack>
                          <VStack
                            alignItems={"flex-start"}
                            style={[{ width: listWidth[2] }]}
                          >
                            <Text fontSize={"sm"} bold>
                              {item.ExportQuantity || "0"}
                            </Text>
                            <Text fontSize={"xs"}>
                              {item.ExportValue
                                ? formatMoneyToVN(item.ExportValue, "đ")
                                : "0đ"}
                            </Text>
                          </VStack>
                          <HStack alignItems={"center"}>
                            <MaterialIcons
                              name="keyboard-arrow-right"
                              size={24}
                            />
                          </HStack>
                        </HStack>
                        <Divider></Divider>
                      </>
                    );
                  }}
                </Pressable>
              );
            }}
            keyExtractor={(item, index) => index}
            getItemCount={getItemCount}
            getItem={(data, index) => {
              return data[index];
            }}
            data={data}
          />
        ) : (
          <NoData fontSizeText="lg" />
        )}
      </VStack>
    </Center>
  );
}

const styles = StyleSheet.create({
  table: {
    marginHorizontal: widthOfScreen * 0.025,
    marginVertical: 10,
    elevation: 5,
    shadowColor: "#52006A",
    backgroundColor: "#fff",
    borderRadius: 20,
    fontSize: 8,
    overflow: "hidden",
  },
  tableHeader: {
    paddingLeft: "5%",
    paddingVertical: 5,
    backgroundColor: "#D9D9D9",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    display: "flex",
    flexDirection: "row",
  },
  titleHeader: {
    fontSize: 16,
    fontWeight: 600,
    color: "#000",
  },
  tableContent: {
    marginTop: 10,
    paddingLeft: 5,
  },
  boxItemContent: {
    paddingVertical: 10,
  },
});
export default memo(IOInventoryTable);
