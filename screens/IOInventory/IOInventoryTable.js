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
const widthOfTable = constantMain.widthOfScreen * 0.95;
function InOutputInventoryTable({ data = [], fields, onclick }) {
  return (
    <Center style={styles.table}>
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
              // onPressIn={() => {
              //   item === "Ngày" && setInverseDate(!inverseDate);
              // }}
            >
              <Heading
                size={"sm"}
                key={index}
                style={
                  (styles.titleHeader,
                  {
                    width: widthOfTable / fields.length - 20,
                  })
                }
              >
                {item}
                {item === "Ngày" && (
                  <IconAntDesign
                    name={inverseDate ? "caretup" : "caretdown"}
                    size={10}
                  />
                )}
              </Heading>
            </Pressable>
          );
        })}
      </HStack>

      <VStack style={styles.tableContent}>
        <ScrollView
          style={styles.tableContentScrollView}
          nestedScrollEnabled={true}
        >
          {data.length != 0 ? (
            data.map((item, index) => {
              return (
                <Pressable key={index} onPress={() => onclick(item)}>
                  {({ isHovered, isFocused, isPressed }) => {
                    return (
                      <>
                        <HStack
                          w={"100%"}
                          style={styles.boxItemContent}
                          paddingLeft={0.5}
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
                          <VStack
                            alignItems={"flex-start"}
                            style={[{ width: "30%" }]}
                          >
                            <Text fontSize={"sm"} bold>
                              {item.productionCode}
                            </Text>
                            <Text fontSize={"xs"}>{item.productionName}</Text>
                          </VStack>
                          <VStack
                            alignItems={"flex-start"}
                            style={[{ width: "30%" }]}
                          >
                            <Text fontSize={"sm"} bold>
                              {item.quantityImport}
                            </Text>
                            <Text fontSize={"xs"}>
                              {item.moneyImport.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </Text>
                          </VStack>
                          <VStack
                            alignItems={"flex-start"}
                            style={[{ width: "30%" }]}
                          >
                            <Text fontSize={"sm"} bold>
                              {item.quantityExport}
                            </Text>
                            <Text fontSize={"xs"}>
                              {item.moneyExport.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
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
            })
          ) : (
            <VStack
              space="5"
              alignItems={"center"}
              justifyContent={"center"}
              opacity={0.5}
              paddingTop={10}
            >
              <MaterialCommunityIcons
                size={"150"}
                name="database-off-outline"
              />
              <Text fontSize={"lg"}>Không có dữ liệu </Text>
            </VStack>
          )}
        </ScrollView>
      </VStack>
    </Center>
  );
}

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
    paddingLeft: "5%",
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
        ? constantMain.heightOfScreen * 0.58
        : constantMain.heightOfScreen * 0.6,
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
export default InOutputInventoryTable;
