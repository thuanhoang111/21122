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
import {
  compactMoney,
  formatMoney,
  formatMoneyToVN,
} from "./../../constants/ConstantFunc";
const widthOfTable = constantMain.widthOfScreen * 0.95;
function DebtTrackingTable({ data = [], fields }) {
  return (
    <Center style={styles.table}>
      <HStack
        style={styles.tableHeader}
        justifyContent={"flex-start"}
        w={"100%"}
      >
        {fields.map((item, index) => {
          return (
            <Pressable py={2} key={index}>
              <Heading
                size={"xs"}
                textAlign={"center"}
                key={index}
                style={
                  (styles.titleHeader,
                  {
                    width: widthOfTable / fields.length - 5,
                  })
                }
              >
                {item}
                {item === "Ngày" && <IconAntDesign size={10} />}
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
                          <VStack
                            alignItems={"flex-start"}
                            style={[{ width: "24%" }]}
                          >
                            <Text fontSize={"2xs"} bold>
                              {item.customerId}
                            </Text>
                            <Text fontSize={8}>{item.customerName}</Text>
                          </VStack>
                          <VStack
                            alignItems={"flex-start"}
                            style={[{ width: "25%" }]}
                          >
                            <Text fontSize={"2xs"} bold>
                              {compactMoney(item.ostBalanceIPeriod)}
                            </Text>
                            <Text fontSize={"2xs"}>
                              {formatMoneyToVN(item.validBalanceBPeriod)}
                            </Text>
                          </VStack>
                          <VStack
                            alignItems={"flex-start"}
                            style={[{ width: "25%" }]}
                          >
                            <Text fontSize={"2xs"} bold>
                              {compactMoney(item.ostBalanceDPeriod)}
                            </Text>
                            <HStack
                              alignItems={"center"}
                              justifyContent={"space-between"}
                            >
                              <Text fontSize={"2xs"}>
                                {formatMoneyToVN(item.validBalanceDPeriod)}
                              </Text>
                            </HStack>
                          </VStack>
                          <VStack
                            alignItems={"flex-start"}
                            style={[{ width: "25%" }]}
                          >
                            <Text fontSize={"2xs"} bold>
                              {compactMoney(item.ostBalanceEPeriod)}
                            </Text>
                            <Text fontSize={"2xs"}>
                              {formatMoneyToVN(item.validBalanceEPeriod)}
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
export default DebtTrackingTable;
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
