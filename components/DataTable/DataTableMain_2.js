import {
  Divider,
  HStack,
  Heading,
  ScrollView,
  VStack,
  View,
} from "native-base";
import { StyleSheet, Text } from "react-native";
import * as constantMain from "../../constants/ConstantMain";
import * as ConstantFunction from "../../constants/ConstantFunc";
import { formatMoneyToVN } from "./../../constants/ConstantFunc";
import NoData from "../NoData/NoData";
import { blackColor, whiteColor } from "../../constants/ConstantStyle";
function DataTableMain_2({ data, fields, listTitle, circulars }) {
  const numberDivide = circulars === "TT133" ? 10 : 100;
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        {fields.map((item, index) => {
          return (
            <Heading
              size={"md"}
              key={index}
              style={
                (styles.titleHeader,
                {
                  width: constantMain.widthOfScreen / fields.length + 10,
                  textTransform: "uppercase",
                })
              }
            >
              {item}
            </Heading>
          );
        })}
      </View>

      <VStack style={styles.tableContent}>
        {data.length != 0 ? (
          <>
            <ScrollView
              style={styles.tableContentScrollView}
              nestedScrollEnabled={true}
            >
              {data.slice(0, data.length - 1).map((item, index) => {
                return (
                  listTitle[index] && (
                    <View key={index}>
                      <HStack style={styles.boxItemContent}>
                        <View style={{ marginHorizontal: 5 }}>
                          <Text
                            style={[
                              { width: constantMain.widthOfScreen * 0.5 },
                              listTitle[index].code % numberDivide === 0 &&
                              listTitle[index].code !== "320"
                                ? {
                                    fontWeight: 700,
                                  }
                                : {
                                    fontSize: 12,
                                    paddingLeft: 10,
                                  },
                            ]}
                          >
                            {/* {ConstantFunction.handleGetTitleWithCode(
                              listTitle,
                              item.Code
                            )} */}
                            {item.Target}
                          </Text>
                        </View>
                        <View style={{ marginHorizontal: 5 }}>
                          <Text
                            style={[
                              {
                                width: constantMain.widthOfScreen * 0.35,
                                textAlign: "right",
                              },
                              listTitle[index].code % numberDivide === 0 &&
                                listTitle[index].code !== "320" && {
                                  fontWeight: 700,
                                },
                            ]}
                          >
                            {ConstantFunction.formatMoneyToVN(
                              item.EndingBalance,
                              "đ"
                            )}
                          </Text>
                        </View>
                      </HStack>
                      <Divider></Divider>
                    </View>
                  )
                );
              })}
            </ScrollView>
            <HStack style={[styles.boxTotalContent]}>
              <View style={{ marginHorizontal: 5 }}>
                <Text style={[styles.textTotalItemContent]}>
                  {listTitle.slice(-1)[0].title}
                </Text>
              </View>
              <View style={{ marginHorizontal: 5, marginRight: 10 }}>
                <Text style={[styles.textTotalItemContent]}>
                  {formatMoneyToVN(data.slice(-1)[0].EndingBalance, "đ")}
                </Text>
              </View>
            </HStack>
          </>
        ) : (
          <NoData fontSizeText="lg" />
        )}
      </VStack>
    </View>
  );
}
const styles = StyleSheet.create({
  table: {
    marginHorizontal: constantMain.widthOfScreen * 0.025,
    marginTop: 20,
    elevation: 5,
    shadowColor: "#52006A",
    backgroundColor: whiteColor,
    borderRadius: 20,
    fontSize: 8,
    overflow: "hidden",
    marginBottom: 10,
  },
  tableHeader: {
    paddingVertical: 10,
    paddingLeft: 20,
    backgroundColor: "#D9D9D9",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  titleHeader: {
    fontSize: 16,
    fontWeight: 600,
    color: blackColor,
  },
  totalPrice: {
    fontSize: 17,
    fontWeight: 800,
  },
  tableContent: {
    marginTop: 10,

    minHeight: constantMain.heightOfScreen * 0.45,
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
export default DataTableMain_2;
