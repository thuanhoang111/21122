import { HStack, ScrollView, VStack, Text, Skeleton, View } from "native-base";
import BudgetSituationTable from "./BudgetSituationTable";
import { useContext, useState } from "react";
import { useEffect } from "react";
import * as Get from "../../API/service/Get";
import SkeletonTable from "../../components/Skeleton/SkeletonTable";
import SkeletonChartBar from "../../components/Skeleton/SkeletonChartBar";
import { MainContext } from "../MainContext";
import BarChartInMonth from "../../components/BarChartInMonth/BarChartInMonth";
import { compactMoney } from "../../constants/ConstantFunc";
import Header from "../../components/Header/Header";
import { Alert } from "react-native";

function BudgetSituation_2({ route, navigation }) {
  const mainContext = useContext(MainContext);
  const [data, setData] = useState();
  const dataUser = mainContext.dataUser;
  const inforFilter = mainContext.inforFilter;
  const title = route.params.title;
  const reportType = route.params.reportType;
  // /**
  //  * Author: ThuanHoang 03/07/2023
  //  * Aggregate function that sums values of previously filtered data into values for graph and filtered by month
  //  * @param {ArrayList} data
  //  * @returns The data list has been edited for diagram display
  //  */
  // const calcMoneyEachMonth = (data) => {
  //   return data.reduce((prevList, currentValue) => {
  //     const totalMoney = currentValue.costAnalysisDetails.reduce(
  //       (prevValue, currentValue) => {
  //         return prevValue + currentValue.Money;
  //       },
  //       0
  //     );

  //     return [
  //       ...prevList,
  //       {
  //         title: currentValue.month,
  //         value: totalMoney / 1000000,
  //       },
  //     ];
  //   }, []);
  // };
  // /**
  //  * Author: ThuanHoang 03/07/2023
  //  * Aggregate function that sums values of previously filtered data into values for graph and filtered by quarter
  //  * @param {ArrayList} data
  //  * @returns The data list has been edited for diagram display
  //  */
  // const calcMoneyEachQuarter = (data) => {
  //   return data.reduce((prevList, currentValue) => {
  //     const totalMoney = currentValue.costAnalysisDetails.reduce(
  //       (prevValue, currentValue) => {
  //         return prevValue + currentValue.Money;
  //       },
  //       0
  //     );
  //     const inforQuarter = {
  //       title: `Quý ${currentValue.quarter}`,
  //       value: totalMoney / 1000000,
  //     };
  //     return [...prevList, inforQuarter];
  //   }, []);
  // };
  /**
   * Author: ThuanHoang 03/07/2023
   * Function that filters CostAnalysis values by quarter
   * @param {ArrayList} data
   * @returns The filtered data
   */
  const filterInforCostAnalysisQuarter = (data) => {
    let totalValueQuarter = [];
    return data.reduce((prevValue, currentValue) => {
      const filterValueQuarter = currentValue.CostAnalysisDetails.slice(
        2,
        10
      ).filter(
        (item) => item.AccountCode !== "0007" && item.AccountCode !== "0004"
      );
      totalValueQuarter =
        totalValueQuarter.length <= 0
          ? filterValueQuarter
          : filterValueQuarter.map((item, index) => {
              return {
                AccountCode: item.AccountCode,
                AccountName: null,
                Money: item.Money + totalValueQuarter[index].Money,
              };
            });

      if (currentValue.Thang % 3 === 0) {
        const inforQuarter = {
          costAnalysisDetails: totalValueQuarter,
          quarter: currentValue.Thang / 3,
          year: currentValue.Nam,
        };
        totalValueQuarter = [];
        return [...prevValue, inforQuarter];
      } else {
        return [...prevValue];
      }
    }, []);
  };
  /**
   * Author: ThuanHoang 27/12/2023
   * Function that filters BusinessReportDetails values by month
   * @param {ArrayList} data
   * @returns The filtered data
   */
  const filterInforBusinessRpt = (data) => {
    return data.map((item, index) => {
      return {
        BusinessReportDetails: item.BusinessReportDetails.slice(2, 10).filter(
          (item) => item.AccountCode !== "0007" && item.AccountCode !== "0004"
        ),
        year: item.Nam,
        month: item.Thang,
      };
    });
  };
  /**
   * Author: ThuanHoang 27/12/2023
   * Function that filters BusinessReportDetails values by quarter
   * @param {ArrayList} data
   * @returns The filtered data
   */
  const filterInforBusinessRptQuarter = (data) => {
    let totalValueQuarter = [];
    return data.reduce((prevValue, currentValue) => {
      const filterValueQuarter = currentValue.BusinessReportDetails.slice(
        2,
        10
      ).filter(
        (item) => item.AccountCode !== "0007" && item.AccountCode !== "0004"
      );
      totalValueQuarter =
        totalValueQuarter.length <= 0
          ? filterValueQuarter
          : filterValueQuarter.map((item, index) => {
              return {
                AccountCode: item.AccountCode,
                AccountName: null,
                Money: item.Money + totalValueQuarter[index].Money,
              };
            });

      if (currentValue.Thang % 3 === 0) {
        const inforQuarter = {
          BusinessReportDetails: totalValueQuarter,
          quarter: currentValue.Thang / 3,
          year: currentValue.Nam,
        };
        totalValueQuarter = [];
        return [...prevValue, inforQuarter];
      } else {
        return [...prevValue];
      }
    }, []);
  };
  /**
   * Author: ThuanHoang 03/07/2023
   * Function that filters BusinessReportDetails values by month
   * @param {ArrayList} data
   * @returns The filtered data
   */
  const filterInforCostAnalysis = (data) => {
    return data.map((item, index) => {
      return {
        costAnalysisDetails: item.CostAnalysisDetails.slice(2, 10).filter(
          (item) => item.AccountCode !== "0007" && item.AccountCode !== "0004"
        ),
        year: item.Nam,
        month: item.Thang,
      };
    });
  };

  /**
   * Author: ThuanHoang 28/06/2023
   * Function get data from Api with type MonthReport
   * @param {ArrayList} data
   * @returns data
   */
  const handleGetData = () => {
    Get.HandleGetWithParam(
      `CostAnalysis/MonthReport`,
      `m1=${inforFilter.startMonth || 1}&m2=${
        inforFilter.endMonth || 12
      }&reportType=${reportType}&userId=${dataUser.id}&year=${
        inforFilter.year || mainContext.lastPermissionYear
      }`
    ).then((data) => {
      if (data.error || data.isError) {
        Alert.alert("Thông báo", data.errorDescription, [{ text: "Ok" }]);
        setData([]);
      } else {
        const dataFilter =
          inforFilter.type !== "quarter"
            ? reportType
              ? filterInforCostAnalysis(data)
              : filterInforBusinessRpt(data)
            : reportType
            ? filterInforCostAnalysisQuarter(data)
            : filterInforBusinessRptQuarter(data);

        setData(dataFilter);
      }
    });
  };
  useEffect(() => {
    handleGetData();
  }, []);
  return (
    <VStack height={"100%"}>
      <Header onBack={() => navigation.goBack()} title={title}></Header>
      <HStack
        justifyContent={"flex-end"}
        backgroundColor={"#fff"}
        margin={2}
        borderRadius={10}
        style={{ elevation: 10, shadowColor: "#52006A" }}
        flex={0.7}
      >
        <View style={{ flex: 1, paddingHorizontal: 2, height: "100%" }}>
          {data ? (
            // <VictoryChart
            //   theme={VictoryTheme.material}
            //   height={heightOfScreen * 0.35}
            //   width={widthOfScreen}
            //   animate={{ duration: 3000, onLoad: { duration: 1000 } }}
            //   domainPadding={{ x: [50, 20], y: 20 }}
            // >
            //   <VictoryBar
            //     cornerRadius={5}
            //     labels={({ datum }) => {
            //       return datum.value !== 0 ? formatMoney(datum) : "";
            //     }}
            //     style={{
            //       data: {
            //         fill: ({ datum }) =>
            //           (inforFilter.year == currentYear &&
            //             datum.title === currentMonth) ||
            //           datum.title === `Quý ${Math.round(currentMonth / 3)}`
            //             ? "#F25F33"
            //             : "#009087",
            //       },
            //       labels: {
            //         fontSize: 7,
            //       },
            //     }}
            //     data={dataChart}
            //     x={"title"}
            //     y={"value"}
            //   />
            // </VictoryChart>
            <BarChartInMonth
              data={
                data.length > 0
                  ? Array.from({ length: 12 }, (_, index) => {
                      return compactMoney(
                        reportType
                          ? data[index].costAnalysisDetails.reduce(
                              (prevValue, currentValue) =>
                                currentValue.Money + prevValue,
                              0
                            )
                          : data[index].BusinessReportDetails.reduce(
                              (prevValue, currentValue) =>
                                currentValue.Money + prevValue,
                              0
                            ),
                        10000000,
                        1
                      );
                    })
                  : Array.from({ length: 12 }, (_, index) => 0)
              }
              titleUnit="Trăm Triệu"
              showTitleUnit
              colorInteger={["#fb923c", "#4ade80", "blue"]}
            />
          ) : (
            <SkeletonChartBar></SkeletonChartBar>
          )}
        </View>
      </HStack>
      {data ? (
        <Text
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            fontWeight: 500,
            fontSize: 14,
          }}
        >
          Chi phí chi tiết
        </Text>
      ) : (
        <HStack px={2} py={2}>
          <Skeleton.Text w={"40%"} lines={1} />
        </HStack>
      )}

      {data ? (
        <ScrollView flex={5}>
          {data.map((item, index) => {
            return (
              <BudgetSituationTable
                key={index}
                tableName={
                  inforFilter.type == "quarter"
                    ? `Quý ${item.quarter}/${item.year}`
                    : `Tháng ${item.month}/${item.year}`
                }
                data={
                  reportType
                    ? item.costAnalysisDetails
                    : item.BusinessReportDetails
                }
              ></BudgetSituationTable>
            );
          })}
        </ScrollView>
      ) : (
        <SkeletonTable />
      )}
    </VStack>
  );
}

export default BudgetSituation_2;
