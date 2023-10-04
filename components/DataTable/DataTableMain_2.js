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
import { financialReportName } from "../../model/data";
import * as ConstantFunction from "../../constants/ConstantFunc";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
function DataTableMain_2({ data, fields, listTitle }) {
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
                  <View key={index}>
                    <HStack style={styles.boxItemContent}>
                      <View style={{ marginHorizontal: 5 }}>
                        <Text
                          style={[
                            { width: constantMain.widthOfScreen * 0.5 },
                            listTitle[index].code % 100 !== 0
                              ? listTitle[index].code % 10 && {
                                  fontSize: 11,
                                  paddingLeft: 10,
                                }
                              : {
                                  fontWeight: 700,
                                },
                          ]}
                        >
                          {ConstantFunction.handleGetTitleWithCode(
                            financialReportName,
                            item.Code
                          )}
                        </Text>
                      </View>
                      <View style={{ marginHorizontal: 5 }}>
                        <Text
                          style={
                            listTitle[index].code % 100 !== 0
                              ? {
                                  width: constantMain.widthOfScreen * 0.35,
                                  textAlign: "right",
                                }
                              : {
                                  width: constantMain.widthOfScreen * 0.35,
                                  textAlign: "right",
                                  fontWeight: 700,
                                }
                          }
                        >
                          {item.EndingBalance.toLocaleString()}
                        </Text>
                      </View>
                    </HStack>
                    <Divider></Divider>
                  </View>
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
                  {Math.round(data.slice(-1)[0].EndingBalance).toLocaleString()}
                </Text>
              </View>
            </HStack>
          </>
        ) : (
          <VStack
            space="5"
            alignItems={"center"}
            justifyContent={"center"}
            opacity={0.5}
            paddingTop={10}
          >
            <MaterialCommunityIcons size={"150"} name="database-off-outline" />
            <Text fontSize={"lg"}>Không có dữ liệu </Text>
          </VStack>
        )}
      </VStack>
    </View>
  );
}
const styles = StyleSheet.create({
  table: {
    width: constantMain.widthOfScreen * 0.95,
    maxHeight:
      Platform.OS === "ios"
        ? constantMain.heightOfScreen * 0.6
        : constantMain.heightOfScreen * 0.75,
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
        ? constantMain.heightOfScreen * 0.5
        : constantMain.heightOfScreen * 0.55,
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