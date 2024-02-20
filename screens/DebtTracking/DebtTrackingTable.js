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
import * as constantMain from "../../constants/ConstantMain";
import {
  compactMoneyToString,
  formatMoneyToVN,
} from "./../../constants/ConstantFunc";
import { memo, useEffect } from "react";
import NoData from "../../components/NoData/NoData";
function DebtTrackingTable({
  data = [],
  fields,
  onClick,
  page,
  totalData = {},
}) {
  useEffect(() => {
    data.length > 1 &&
      this.DebtTrackingRef.scrollToOffset({ animated: true, offset: 0 });
  }, [page]);

  const listWidth = ["24%", "25%", "25%", "23%"];
  return (
    <Center style={styles.table} flex={15}>
      <HStack
        style={styles.tableHeader}
        justifyContent={"flex-start"}
        w={"100%"}
        paddingY={2}
        paddingLeft={2}
      >
        {fields.map((item, index) => {
          return (
            <Pressable py={2} key={index} width={listWidth[index]}>
              <Heading size={"xs"} textAlign={"left"} key={index}>
                {item}
              </Heading>
            </Pressable>
          );
        })}
      </HStack>
      <VStack style={styles.tableContent} flex={15}>
        {data.length > 1 ? (
          <VirtualizedList
            ref={(ref) => {
              this.DebtTrackingRef = ref;
            }}
            initialNumToRender={10}
            renderItem={({ item, index }) => {
              return (
                <Pressable key={index} onPress={() => onClick(item)}>
                  {({ isHovered, isFocused, isPressed }) => {
                    return (
                      <>
                        <HStack
                          paddingLeft={2}
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
                            style={[{ width: listWidth[0] }]}
                          >
                            <Text fontSize={"2xs"} bold>
                              {item.CusId}
                            </Text>
                            <Text fontSize={8}>{item.CusName}</Text>
                          </VStack>
                          <VStack
                            alignItems={"flex-start"}
                            style={[{ width: listWidth[1] }]}
                          >
                            <Text fontSize={"2xs"} bold>
                              {compactMoneyToString(item.DebtBalanceIPeriod)}
                            </Text>
                            <Text fontSize={"2xs"}>
                              {formatMoneyToVN(item.ValidBalanceBPeriod, "đ")}
                            </Text>
                          </VStack>
                          <VStack
                            alignItems={"flex-start"}
                            style={[{ width: listWidth[2] }]}
                          >
                            <Text fontSize={"2xs"} bold>
                              {compactMoneyToString(item.DebtBalanceDPeriod)}
                            </Text>
                            <HStack
                              alignItems={"center"}
                              justifyContent={"space-between"}
                            >
                              <Text fontSize={"2xs"}>
                                {formatMoneyToVN(item.ValidBalanceDPeriod, "đ")}
                              </Text>
                            </HStack>
                          </VStack>
                          <VStack
                            alignItems={"flex-start"}
                            style={[{ width: listWidth[3] }]}
                          >
                            <Text fontSize={"2xs"} bold>
                              {compactMoneyToString(item.DebtBalanceEPeriod)}
                            </Text>
                            <Text fontSize={"2xs"}>
                              {formatMoneyToVN(item.ValidBalanceEPeriod, "đ")}
                            </Text>
                          </VStack>
                        </HStack>
                        <Divider></Divider>
                      </>
                    );
                  }}
                </Pressable>
              );
            }}
            keyExtractor={(item, index) => index}
            getItemCount={(_data) => data.length - 1}
            getItem={(data, index) => {
              return data[index];
            }}
            data={data}
          />
        ) : (
          <NoData fontSizeText="lg" />
        )}
      </VStack>
      <HStack
        style={styles.tableBottom}
        justifyContent={"flex-start"}
        w={"100%"}
      >
        <HStack
          paddingLeft={2}
          style={styles.boxItemContent}
          alignItems={"center"}
          space={"0.5"}
        >
          <VStack alignItems={"flex-start"} style={[{ width: listWidth[0] }]}>
            <Text fontSize={"xs"} bold>
              {totalData.CusId || "---"}
            </Text>
            <Text fontSize={8}>{totalData.CusName || "---"}</Text>
          </VStack>
          <VStack alignItems={"flex-start"} style={[{ width: listWidth[1] }]}>
            <Text fontSize={"xs"} bold>
              {compactMoneyToString(totalData.DebtBalanceIPeriod)}
            </Text>
            <Text fontSize={"2xs"}>
              {compactMoneyToString(totalData.ValidBalanceBPeriod)}
            </Text>
          </VStack>
          <VStack alignItems={"flex-start"} style={[{ width: listWidth[2] }]}>
            <Text fontSize={"xs"} bold>
              {compactMoneyToString(totalData.DebtBalanceDPeriod)}
            </Text>
            <HStack alignItems={"flex-start"} justifyContent={"space-between"}>
              <Text fontSize={"2xs"}>
                {compactMoneyToString(totalData.ValidBalanceDPeriod)}
              </Text>
            </HStack>
          </VStack>
          <VStack alignItems={"flex-start"} style={[{ width: listWidth[3] }]}>
            <Text fontSize={"xs"} bold>
              {compactMoneyToString(totalData.DebtBalanceEPeriod)}
            </Text>
            <Text fontSize={"2xs"}>
              {compactMoneyToString(totalData.ValidBalanceEPeriod)}
            </Text>
          </VStack>
        </HStack>
      </HStack>
    </Center>
  );
}
export default memo(DebtTrackingTable);
const styles = StyleSheet.create({
  table: {
    marginHorizontal: constantMain.widthOfScreen * 0.025,
    elevation: 5,
    shadowColor: "#52006A",
    backgroundColor: "#fff",
    borderRadius: 20,
    fontSize: 8,
    overflow: "hidden",
    marginBottom: 5,
  },
  tableHeader: {
    backgroundColor: "#D9D9D9",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    display: "flex",
    flexDirection: "row",
  },
  tableBottom: {
    backgroundColor: "#D9D9D9",
    display: "flex",
    flexDirection: "row",
  },
  tableContent: {
    marginTop: 10,
    minHeight: "50%",
  },
  boxItemContent: {
    paddingVertical: 10,
  },
});
