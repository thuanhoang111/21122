import {
  Divider,
  HStack,
  Heading,
  ScrollView,
  Text,
  VStack,
  View,
} from "native-base";
import { StyleSheet } from "react-native";
import { heightOfScreen, widthOfScreen } from "../../constants/ConstantMain";
import { CostAnalysisName } from "../../model/data";
import * as ConstantFunction from "../../constants/ConstantFunc";
/**
 * Author : ThuanHoang 28/6/2023
 * @param {String} tableName
 * @param {ArrayList} data
 * @returns IU Display data in tabular form
 */
function BudgetSituationTable({ tableName, data }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Heading
          size={"md"}
          style={(styles.titleHeader, { width: widthOfScreen })}
        >
          {tableName}
        </Heading>
      </View>
      <VStack style={styles.tableContent}>
        <ScrollView
          style={styles.tableContentScrollView}
          nestedScrollEnabled={true}
        >
          {data.map((item, index) => {
            return (
              <View key={index}>
                <HStack style={styles.boxItemContent}>
                  <View style={{ marginHorizontal: 2 }}>
                    <Text
                      style={{
                        width: widthOfScreen * 0.5,
                      }}
                    >
                      {ConstantFunction.handleGetTitleWithCode(
                        CostAnalysisName,
                        item.AccountCode
                      )}
                      {/* {item.title} */}
                    </Text>
                  </View>
                  <View style={{ marginHorizontal: 5 }}>
                    <Text
                      style={{
                        width: widthOfScreen * 0.35,
                        textAlign: "right",
                      }}
                    >
                      {item.Money.toLocaleString()}
                    </Text>
                  </View>
                </HStack>
                <Divider></Divider>
              </View>
            );
          })}
        </ScrollView>
      </VStack>
    </View>
  );
}
const styles = StyleSheet.create({
  table: {
    width: widthOfScreen * 0.95,
    marginHorizontal: widthOfScreen * 0.025,
    marginBottom: heightOfScreen * 0.03,
    elevation: 5,
    shadowColor: "#52006A",
    backgroundColor: "#fff",
    borderRadius: 20,
    fontSize: 8,
    overflow: "hidden",
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
    maxHeight:
      Platform.OS === "ios" ? heightOfScreen * 0.5 : heightOfScreen * 0.55,
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
export default BudgetSituationTable;
