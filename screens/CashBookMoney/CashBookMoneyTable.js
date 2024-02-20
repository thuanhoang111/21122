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

import Feather from "react-native-vector-icons/Feather";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import { useEffect } from "react";
import NoData from "../../components/NoData/NoData";
import { formatMoneyToVN } from "../../constants/ConstantFunc";
const widthOfTable = constantMain.widthOfScreen * 0.95;
const listWidth = ["21%", "23%", "23%", "30%"];
function CashBookMoneyTable({
  data,
  fields,
  inverseDate,
  setInverseDate,
  page,
}) {
  useEffect(() => {
    this.CashBookMoneyRef &&
      this.CashBookMoneyRef.scrollTo({
        y: 0,
        animated: true,
      });
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
              paddingLeft={1}
              key={index}
              width={listWidth[index]}
              onPressIn={() => {
                item === "Ngày" && setInverseDate(!inverseDate);
              }}
            >
              <Heading size={"sm"} key={index} style={styles.titleHeader}>
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
      <VStack flex={15}>
        {data.length != 0 ? (
          <ScrollView
            ref={(ref) => {
              this.CashBookMoneyRef = ref;
            }}
            style={styles.tableContentScrollView}
          >
            {data.map((item, index) => {
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
                          <Text
                            fontSize={"2xs"}
                            style={[{ width: listWidth[0] }]}
                          >
                            {item.DateTime}
                          </Text>
                          <Text
                            fontSize={"2xs"}
                            style={[{ width: listWidth[1] }]}
                          >
                            {formatMoneyToVN(item.Revenue, "đ")}
                          </Text>
                          <Text
                            fontSize={"2xs"}
                            style={[{ width: listWidth[2] }]}
                          >
                            {formatMoneyToVN(item.Expenditure, "đ")}
                          </Text>
                          <HStack alignItems={"center"} width={listWidth[3]}>
                            <Text fontSize={"2xs"}>
                              {formatMoneyToVN(
                                item.Balance - item.SpentTax + item.IncomeTax,
                                "đ"
                              )}
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
            })}
          </ScrollView>
        ) : (
          <VStack flex={1}>
            <NoData />
          </VStack>
        )}
      </VStack>
    </Center>
  );
}
const styles = StyleSheet.create({
  table: {
    marginHorizontal: constantMain.widthOfScreen * 0.025,
    elevation: 5,
    shadowColor: "#52006A",
    backgroundColor: "#fff",
    borderRadius: 20,
    fontSize: 8,
    overflow: "hidden",
    marginBottom: 10,
  },
  tableHeader: {
    paddingLeft: 10,
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
  tableContentScrollView: {
    paddingLeft: 10,
  },
  boxItemContent: {
    paddingVertical: 10,
  },
});
export default CashBookMoneyTable;
