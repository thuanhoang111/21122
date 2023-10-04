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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import { formatMoneyToVN } from "./../../constants/ConstantFunc";
const widthOfTable = constantMain.widthOfScreen * 0.95;
function IOInventoryDetailTable({ data = [], fields }) {
  return (
    <Center style={styles.table}>
      {/* Header Table */}
      <HStack
        style={styles.tableHeader}
        justifyContent={"flex-start"}
        w={"100%"}
      >
        {/* {fields.map((item, index) => {
          return (
              <Heading
                size={"sm"}
                textAlign={index == 0 || index == 3 ? "center" : "left"}
                key={index}
                style={
                  (styles.titleHeader,
                  {
                    width: (widthOfTable * 0.95) / fields.length,
                  })
                }
              >
                {item}
              </Heading>
          );
        })} */}
        <Heading
          py={2}
          size={"sm"}
          textAlign={"center"}
          style={
            (styles.titleHeader,
            {
              width: "21%",
            })
          }
        >
          Ngày
        </Heading>
        <Heading
          py={2}
          size={"sm"}
          textAlign={"center"}
          style={
            (styles.titleHeader,
            {
              width: "20%",
            })
          }
        >
          Số CT
        </Heading>
        <Heading
          py={2}
          size={"sm"}
          textAlign={"center"}
          style={
            (styles.titleHeader,
            {
              width: "32%",
            })
          }
        >
          Nhập/Xuất
        </Heading>
        <Heading
          py={2}
          size={"sm"}
          textAlign={"left"}
          style={
            (styles.titleHeader,
            {
              width: "29%",
            })
          }
        >
          Tồn
        </Heading>
      </HStack>
      <VStack style={styles.tableContent}>
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
                          <Text fontSize={10} style={[{ width: "21%" }]}>
                            {item.date}
                          </Text>
                          <Text fontSize={10} style={[{ width: "20%" }]}>
                            {item.documentCode}
                          </Text>
                          <VStack
                            alignItems={"flex-start"}
                            style={[{ width: "30%" }]}
                          >
                            <Text fontSize={12} bold>
                              {item.valueExport
                                ? item.quantityExport
                                : item.quantityImport}
                            </Text>
                            <HStack
                              alignItems={"center"}
                              justifyContent={"space-between"}
                            >
                              <Text fontSize={10}>
                                {formatMoneyToVN(
                                  item.valueExport
                                    ? item.valueExport
                                    : item.valueImport
                                )}
                              </Text>
                              <Feather
                                name={
                                  item.valueExport
                                    ? "arrow-down-right"
                                    : "arrow-up-right"
                                }
                                size={16}
                                color={item.valueExport ? "#fb0414" : "#1dfd1c"}
                              ></Feather>
                            </HStack>
                          </VStack>
                          <VStack
                            alignItems={"flex-start"}
                            style={[{ width: "29%" }]}
                          >
                            <Text fontSize={12} bold>
                              {item.quantityBalance}
                            </Text>
                            <Text fontSize={10}>
                              {formatMoneyToVN(item.valueBalance)}
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
            <VStack
              space="5"
              alignItems={"center"}
              justifyContent={"center"}
              opacity={0.5}
              paddingTop={10}
            >
              <MaterialCommunityIcons size={150} name="database-off-outline" />
              <Text fontSize={"lg"}>Không có dữ liệu </Text>
            </VStack>
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
    marginTop: 10,
    elevation: 5,
    shadowColor: "#52006A",
    backgroundColor: "#fff",
    borderRadius: 20,
    fontSize: 8,
    overflow: "hidden",
    marginBottom: 10,
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
  totalPrice: {
    fontSize: 17,
    fontWeight: 800,
  },
  tableContent: {
    marginTop: 10,
    maxHeight:
      Platform.OS === "ios"
        ? constantMain.heightOfScreen * 0.62
        : constantMain.heightOfScreen * 0.64,
  },
  tableContentScrollView: {
    paddingLeft: 10,
  },

  boxItemContent: {
    paddingVertical: 10,
  },
  textTotalItemContent: {
    fontSize: 16,
    fontWeight: 700,
  },
  boxTotalContent: {
    alignContent: "center",
    backgroundColor: "#dddddc",
    paddingLeft: 10,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
