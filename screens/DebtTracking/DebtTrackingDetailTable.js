import {
  Center,
  Divider,
  HStack,
  Heading,
  VStack,
  Text,
  Pressable,
} from "native-base";
import { StyleSheet, VirtualizedList, ViewProps } from "react-native";
import { useEffect } from "react";
import { formatMoneyToVN } from "./../../constants/ConstantFunc";
import { widthOfScreen } from "../../constants/ConstantMain";
import DebtTrackingDetailModal from "./DebtTrackingDetailModal";
import { useObjectState } from "@uidotdev/usehooks";
import NoData from "../../components/NoData/NoData";
function DebtTrackingDetailTable({ data = [], fields, page, totalPrice }) {
  const [modalSelected, setModalSelected] = useObjectState({
    data: {},
    isShow: false,
  });

  const getItemCount = (_data) => data.length;
  const widthList = ["30%", "35%", "35%"];
  useEffect(() => {
    data.length != 0 &&
      this.VirtualizedListRef.scrollToOffset({ animated: true, offset: 0 });
  }, [page]);

  return (
    <>
      <Center style={styles.table} flex={12}>
        <HStack
          style={styles.tableHeader}
          justifyContent={"flex-start"}
          paddingLeft={2}
        >
          {fields.map((item, index) => {
            return (
              <Pressable py={2} key={index} width={widthList[index]}>
                <Heading
                  paddingLeft={3}
                  fontSize={17}
                  key={index}
                  textAlign={"left"}
                  style={styles.titleHeader}
                >
                  {item}
                </Heading>
              </Pressable>
            );
          })}
        </HStack>
        <VStack flex={15}>
          {data.length != 0 ? (
            <>
              <VirtualizedList
                ref={(ref) => {
                  this.VirtualizedListRef = ref;
                }}
                initialNumToRender={4}
                renderItem={({ item, index }) => {
                  return (
                    <Pressable
                      key={index}
                      onPress={() =>
                        setModalSelected(() => ({
                          data: item,
                          isShow: true,
                        }))
                      }
                    >
                      {({ isHovered, isFocused, isPressed }) => {
                        return (
                          <>
                            <HStack
                              w={"100%"}
                              style={styles.boxItemContent}
                              paddingLeft={3}
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
                                style={[{ width: widthList[0] }]}
                              >
                                <Text fontSize={"sm"}>
                                  {item.DateDebtReport || "undefined"}
                                </Text>
                              </VStack>
                              <VStack
                                alignItems={"flex-start"}
                                style={[{ width: widthList[1] }]}
                              >
                                <Text fontSize={"xs"} bold>
                                  {item.OddValid
                                    ? item.OddValid.toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                      })
                                    : "0đ"}
                                </Text>
                                <Text fontSize={"xs"}>
                                  {item.OddDebt
                                    ? item.OddDebt.toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                      })
                                    : "0đ"}
                                </Text>
                              </VStack>
                              <VStack
                                alignItems={"flex-start"}
                                style={[{ width: widthList[2] }]}
                              >
                                <Text fontSize={"xs"} bold>
                                  {item.OddValid
                                    ? item.OddValid.toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                      })
                                    : "0đ"}
                                </Text>
                                <Text fontSize={"xs"}>
                                  {item.DebtBalance
                                    ? item.DebtBalance.toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                      })
                                    : "0đ"}
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
                getItemCount={getItemCount}
                getItem={(data, index) => {
                  return data[index];
                }}
                data={data}
              />
              <HStack
                style={styles.totalPriceBox}
                justifyContent={"space-around"}
                paddingLeft={2}
                alignItems={"center"}
              >
                <Text
                  py={2}
                  fontSize={"md"}
                  textAlign={"left"}
                  style={styles.titleHeader}
                  width={widthList[0]}
                >
                  Tổng
                </Text>
                <Text
                  py={2}
                  fontSize={"sm"}
                  textAlign={"left"}
                  style={styles.titleHeader}
                  width={widthList[1]}
                >
                  {formatMoneyToVN(totalPrice.totalDebtBalance, "đ")}
                </Text>
                <Text
                  py={2}
                  fontSize={"sm"}
                  textAlign={"left"}
                  style={styles.titleHeader}
                  width={widthList[2]}
                >
                  {formatMoneyToVN(totalPrice.totalValidBalance, "đ")}
                </Text>
              </HStack>
            </>
          ) : (
            <NoData fontSizeText="lg" />
          )}
        </VStack>
      </Center>
      {modalSelected.isShow && (
        <DebtTrackingDetailModal
          date={modalSelected.data.DateDebtReport}
          documentCode={modalSelected.data.DocumentCode}
          speech={modalSelected.data.Speech}
          listAccount={modalSelected.data.ListAccount}
          isOpen={modalSelected.isShow}
          onClose={() =>
            setModalSelected((item) => ({
              isShow: false,
            }))
          }
        />
      )}
    </>
  );
}
const styles = StyleSheet.create({
  table: {
    marginHorizontal: widthOfScreen * 0.025,
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
  totalPriceBox: {
    backgroundColor: "#D9D9D9",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    display: "flex",
    flexDirection: "row",
  },
  titleHeader: {
    fontWeight: 600,
    color: "#000",
  },
  totalPrice: {
    fontSize: 17,
    fontWeight: 800,
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
export default DebtTrackingDetailTable;
