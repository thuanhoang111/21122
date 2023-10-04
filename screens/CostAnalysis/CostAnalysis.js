import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import ChartYear from "../../components/ChartYear/ChartYear";
import axios from "axios";
import CostAnalysisTable from "./CostAnalysisTable";
import { Center, Divider, HStack, Skeleton } from "native-base";
import { useToggle } from "@uidotdev/usehooks";
import * as method from "../../API/util/httpRequest";
import { data } from "../../model/data";
import SkeletonTable from "./../../components/Skeleton/SkeletonTable";
const CostAnalysis = ({ route, navigation }) => {
  const [dataCost, setDataCost] = useState();
  const [totalPriceOfEachYear, setTotalPriceOfEachYear] = useState();
  const [isRenderLoading, setIsRenderLoading] = useToggle(false);

  const dataUser = route.params.data;
  const inforFilter = route.params.inforFilter;
  const lastPermissionYear =
    dataUser.permission[dataUser.permission.length - 1].year;
  /**
   * Author: ThuanHoang 24/06/2023
   * The function sums the values of CostAnalysis by year and the format is suitable for displaying the diagram
   * @param {ArrayList} data
   * @returns List data for view Component ChartYear
   */
  const handleCalcPriceOfEachYear = (data) => {
    const inforPriceOfEachYear = [];
    data.forEach((item) => {
      inforPriceOfEachYear.unshift({
        year: item.Nam,
        value: item.CostAnalysisDetails.reduce((prevValue, currentValue) => {
          return prevValue + currentValue.Money;
        }, 0),
      });
    });
    setTotalPriceOfEachYear(inforPriceOfEachYear);
  };
  /**
   * Author:ThuanHoang 12/09/2023
   * Function Synthesize information from cost analysis
   */
  const handlePriceSummary = async () => {
    axios
      .post(`http://192.168.90.84:1375/api/CostAnalysis`, {
        radyear: 1,
        reporttype: 1,
        userId: dataUser.id,
        year: lastPermissionYear,
      })
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.log(error));
  };
  /**
   * Author: ThuanHoang 24/06/2023
   * Function get data from Api with type MonthReport
   * @param {ArrayList} data
   * @returns data
   */
  const handleGetData = () => {
    axios
      .get(
        `http://192.168.90.84:1375/api/CostAnalysis/YearReport?radYear=2&reportType=1&userId=${dataUser.id}&year=${lastPermissionYear}`
      )
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setDataCost(data);
        handleCalcPriceOfEachYear(data);
      })
      .catch((error) => console.log(error));
  };
  // useEffect(() => {
  //   handlePriceSummary();
  // }, []);
  useEffect(() => {
    handleGetData();
    setTimeout(() => {
      setIsRenderLoading(true);
    }, 1);
  }, []);
  return (
    <View style={styles.container}>
      {dataCost ? (
        <>
          {totalPriceOfEachYear && (
            <ChartYear data={totalPriceOfEachYear}></ChartYear>
          )}
          <View style={{ marginTop: 30 }}>
            <CostAnalysisTable
              tableName={`Năm ${lastPermissionYear}`}
              data={dataCost[0].CostAnalysisDetails.slice(2, 10).filter(
                (item) =>
                  item.AccountCode !== "0007" && item.AccountCode !== "0004"
              )}
            ></CostAnalysisTable>
          </View>
        </>
      ) : (
        <Center
          w="100%"
          style={{
            borderRadius: 25,
            zIndex: 100,
          }}
        >
          {isRenderLoading && (
            <>
              <HStack
                w="40%"
                space={4}
                marginBottom={100}
                justifyContent={"center"}
                alignItems={"flex-end"}
              >
                <Skeleton flex="1" h="200" rounded="md" />
                <Skeleton flex="1" h="130" rounded="md" />
                <Divider
                  style={{
                    width: 200,
                    height: 3,
                    position: "absolute",
                    bottom: 0,
                    zIndex: 1000,
                    backgroundColor: "#b8c0c2",
                  }}
                ></Divider>
              </HStack>
              <SkeletonTable></SkeletonTable>
            </>
          )}
        </Center>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  tooltipContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
  },
  tooltipText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
export default CostAnalysis;
