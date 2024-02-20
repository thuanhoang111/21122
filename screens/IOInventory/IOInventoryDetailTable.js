import {
  Center,
  Divider,
  HStack,
  Heading,
  ScrollView,
  VStack,
  Text,
  Pressable,
} from "native-base";
import { StyleSheet } from "react-native";
import * as constantMain from "../../constants/ConstantMain";
import Feather from "react-native-vector-icons/Feather";
import { formatMoneyToVN } from "./../../constants/ConstantFunc";
import NoData from "../../components/NoData/NoData";
function IOInventoryDetailTable({ data = [], fields }) {
  const listWidth = ["21%", "24%", "26%", "28%"];
  return (
    <Center style={styles.table} flex={15}>
      {/* Header Table */}
      <HStack
        style={styles.tableHeader}
        justifyContent={"flex-start"}
        w={"100%"}
        space={1}
      >
        {fields.map((item, index) => {
          return (
            <Heading
              py={2}
              size={"sm"}
              textAlign={index == fields.length - 1 ? "left" : "center"}
              key={index}
              style={styles.titleHeader}
              width={listWidth[index]}
            >
              {item}
            </Heading>
          );
        })}
      </HStack>
      <VStack style={styles.tableContent} flex={15}>
        <ScrollView
          style={styles.tableContentScrollView}
          nestedScrollEnabled={true}
        >
          {data.length != 0 ? (
            data.map((item, index) => {
              return (
                <Pressable key={index}>
                  {({ isHovered, isFocused, isPressed }) => {
                    return (
                      <>
                        <HStack
                          paddingLeft={0.5}
                          style={styles.boxItemContent}
                          alignItems={"center"}
                          space={"0.5"}
                          bg={
                            isPressed
                              ? "coolGray.200"
                              : isHovered
                              ? "coolGray.200"
                              : "white"
                          }
                        >
                          <Text fontSize={10} style={[{ width: listWidth[0] }]}>
                            {item.DateTime}
                          </Text>
                          <Text fontSize={10} style={[{ width: listWidth[1] }]}>
                            {item.DocumentCode}
                          </Text>
                          <VStack
                            alignItems={"flex-start"}
                            style={[{ width: listWidth[2] }]}
                          >
                            <Text fontSize={12} bold>
                              {item.ExportValue
                                ? item.ExportQuantity
                                : item.ImportQuantity}
                            </Text>
                            <HStack
                              alignItems={"center"}
                              justifyContent={"space-between"}
                            >
                              <Text fontSize={10}>
                                {formatMoneyToVN(
                                  item.ExportValue
                                    ? item.ExportValue
                                    : item.ImportValue,
                                  "đ"
                                )}
                              </Text>
                              <Feather
                                name={
                                  item.ExportValue
                                    ? "arrow-down-right"
                                    : "arrow-up-right"
                                }
                                size={16}
                                color={item.ExportValue ? "#fb0414" : "#1dfd1c"}
                              ></Feather>
                            </HStack>
                          </VStack>
                          <VStack
                            alignItems={"flex-start"}
                            style={[{ width: listWidth[3] }]}
                          >
                            <Text fontSize={12} bold>
                              {item.StockQuantity}
                            </Text>
                            <Text fontSize={10}>
                              {formatMoneyToVN(item.StockValue, "đ")}
                            </Text>
                          </VStack>
                        </HStack>
                        <Divider></Divider>
                      </>
                    );
                  }}
                </Pressable>
              );
            })
          ) : (
            <NoData />
          )}
        </ScrollView>
      </VStack>
    </Center>
  );
}

export default IOInventoryDetailTable;
const styles = StyleSheet.create({
  table: {
    marginHorizontal: constantMain.widthOfScreen * 0.025,
    elevation: 5,
    marginVertical: 10,
    shadowColor: "#52006A",
    backgroundColor: "#fff",
    borderRadius: 20,
    fontSize: 8,
    overflow: "hidden",
  },
  tableHeader: {
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
  },
  tableContentScrollView: {
    paddingLeft: 10,
  },
  boxItemContent: {
    paddingVertical: 10,
  },
});
