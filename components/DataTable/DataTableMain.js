import { DataTable, Divider, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import * as constantMain from "../../constants/ConstantMain";
import {
  Center,
  NativeBaseProvider,
  VStack,
  Heading,
  ScrollView,
  HStack,
  Skeleton,
  View,
} from "native-base";
import { financialReportName } from "./../../model/data";
const optionsPerPage = [2, 3, 4];
function DataTableMain({ data, fields, isPagination, isDetailDiagram }) {
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
  let totalPrice = 0;
  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  return (
    <DataTable style={styles.table}>
      <DataTable.Header style={styles.tableHeader}>
        {fields.map((item, index) => {
          return (
            <DataTable.Title textStyle={styles.titleHeader} key={index}>
              {item}
            </DataTable.Title>
          );
        })}
      </DataTable.Header>
      <ScrollView style={{ marginTop: 20 }}>
        {data.map((item, index) => {
          return (
            <View key={item.id}>
              <DataTable.Row style={{ alignContent: "center" }}>
                <DataTable.Cell
                  textStyle={{
                    fontSize: 12,
                  }}
                  style={{
                    width: 200,
                    flex: 7,
                    flexWrap: "wrap",
                    height: "auto",
                    overflow: "visible",
                    padding: 0,
                  }}
                >
                  <Text numberOfLines={2}>{item.productionName}</Text>
                </DataTable.Cell>
                <DataTable.Cell></DataTable.Cell>
                <DataTable.Cell
                  textStyle={{
                    fontSize: 12,
                  }}
                  style={{
                    flex: 3,
                    flexWrap: "wrap",
                    height: "auto",
                    overflow: "visible",
                  }}
                >
                  {item.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </DataTable.Cell>
              </DataTable.Row>
              {isDetailDiagram && <Divider></Divider>}
            </View>
          );
        })}
      </ScrollView>

      {/* {isDetailDiagram && (
        <DataTable.Row>
          <DataTable.Cell textStyle={styles.totalPrice}>
            Tổng tài sản
          </DataTable.Cell>
          <DataTable.Cell textStyle={styles.totalPrice}>
            {totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </DataTable.Cell>
        </DataTable.Row>
      )}
      {isPagination && (
        <DataTable.Pagination
          page={page}
          numberOfPages={data.length}
          onPageChange={(page) => setPage(page)}
          label={page + 1 + "/" + data.length}
          optionsPerPage={optionsPerPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          showFastPagination
          optionsLabel={"Rows per page"}
        />
      )} */}
    </DataTable>
  );
}
const styles = StyleSheet.create({
  table: {
    width: constantMain.widthOfScreen * 0.95,
    // height: 300,
    maxHeight:
      Platform.OS === "ios"
        ? constantMain.heightOfScreen * 0.7
        : constantMain.heightOfScreen * 0.75,
    marginHorizontal: constantMain.widthOfScreen * 0.025,
    marginTop: 20,
    elevation: 5,
    shadowColor: "#52006A",
    backgroundColor: "#fff",
    borderRadius: 20,
    fontSize: 8,
  },
  tableHeader: {
    backgroundColor: "#D9D9D9",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  titleHeader: {
    fontSize: 18,
    fontWeight: 700,
    color: "#000",
  },
  totalPrice: {
    fontSize: 17,
    fontWeight: 800,
  },
});

export default DataTableMain;
