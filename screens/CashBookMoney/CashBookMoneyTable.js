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
function CashBookMoneyTable({ data, fields, inverseDate, setInverseDate }) {
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
              onPressIn={() => {
                item === "Ngày" && setInverseDate(!inverseDate);
              }}
            >
              <Heading
                size={"sm"}
                key={index}
                style={
                  (styles.titleHeader,
                  {
                    width: widthOfTable / fields.length - 10,
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
                          <Text fontSize={"2xs"} style={[{ width: "21%" }]}>
                            {item.DateTime}
                          </Text>
                          <Text fontSize={"2xs"} style={[{ width: "23%" }]}>
                            {item.Revenue.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </Text>
                          <Text fontSize={"2xs"} style={[{ width: "23%" }]}>
                            {item.Expenditure.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </Text>
                          <HStack alignItems={"center"}>
                            <Text fontSize={"2xs"}>
                              {item.Balance.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </Text>
                            <Feather
                              name={
                                item.Revenue == 0
                                  ? "arrow-down-right"
                                  : "arrow-up-right"
                              }
                              size={16}
                              color={item.Revenue == 0 ? "#fb0414" : "#1dfd1c"}
                            ></Feather>
                            <MaterialIcons name="keyboard-arrow-right" />
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
    marginTop: 20,
    elevation: 5,
    shadowColor: "#52006A",
    backgroundColor: "#fff",
    borderRadius: 20,
    fontSize: 8,
    overflow: "hidden",
    marginBottom: 10,
  },
  tableHeader: {
    paddingLeft: "8%",
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
        ? constantMain.heightOfScreen * 0.52
        : constantMain.heightOfScreen * 0.55,
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
export default CashBookMoneyTable;
