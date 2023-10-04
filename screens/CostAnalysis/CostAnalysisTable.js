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
import * as ConstantFunction from "../../constants/ConstantFunc";
import { CostAnalysisName } from "../../model/data";
/**
 * Author : ThuanHoang 28/6/2023
 * @param {String} tableName
 * @param {ArrayList} data
 * @returns IU Display data in tabular form
 */
function CostAnalysisTable({ tableName, data }) {
  const totalCost = data.reduce((prevValue, item) => prevValue + item.Money, 0);
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
          height={250}
          style={styles.tableContentScrollView}
          nestedScrollEnabled={true}
        >
          {data.map((item, index) => {
            return (
              <View key={index}>
                <HStack style={styles.boxItemContent}>
                  <View style={{ marginHorizontal: 5 }}>
                    <Text
                      style={{
                        width: widthOfScreen * 0.5,
                      }}
                    >
                      {ConstantFunction.handleGetTitleWithCode(
                        CostAnalysisName,
                        item.AccountCode
                      )}
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
                {index != data.length - 1 && <Divider></Divider>}
              </View>
            );
          })}
        </ScrollView>
        {/* <HStack style={[styles.boxTotalContent]}>
          <View style={{ marginHorizontal: 5 }}>
            <Text style={[styles.textTotalItemContent]}>asdasdasd</Text>
          </View>
          <View style={{ marginHorizontal: 5, marginRight: 10 }}>
            <Text style={[styles.textTotalItemContent]}>
               {Math.round(
                        data.slice(-1)[0].EndingBalance
                      ).toLocaleString()} 
              asdasda
            </Text>
          </View>
        </HStack> */}
      </VStack>
    </View>
  );
}
const styles = StyleSheet.create({
  table: {
    width: widthOfScreen * 0.95,
    maxHeight:
      Platform.OS === "ios" ? heightOfScreen * 0.3 : heightOfScreen * 0.35,
    marginHorizontal: widthOfScreen * 0.025,
    marginTop: 15,
    elevation: 5,
    shadowColor: "#52006A",
    backgroundColor: "#fff",
    borderRadius: 20,
    fontSize: 8,
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
      Platform.OS === "ios" ? heightOfScreen * 0.25 : heightOfScreen * 0.3,
  },
  tableContentScrollView: {
    paddingLeft: 10,
    marginBottom: 20,
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
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
});
export default CostAnalysisTable;
