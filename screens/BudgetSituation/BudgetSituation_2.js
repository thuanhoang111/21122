import {
  HStack,
  ScrollView,
  VStack,
  Text,
  Box,
  Progress,
  Skeleton,
} from "native-base";
import {
  Bar,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme,
} from "victory-native";
import {
  heightOfScreen,
  unitNameInVN,
  widthOfScreen,
} from "../../constants/ConstantMain";
import BudgetSituationTable from "./BudgetSituationTable";
import { Platform } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { currentMonth, currentYear } from "../../constants/ConstantMain";
import { formatMoney } from "../../constants/ConstantFunc";
import SkeletonTable from "../../components/Skeleton/SkeletonTable";
import SkeletonChartBar from "../../components/Skeleton/SkeletonChartBar";

function BudgetSituation_2({ route, navigation }) {
  const [dataForChart, setDataForChart] = useState();
  const [data, setData] = useState();
  const dataUser = route.params.data;
  const inforFilter = route.params.inforFilter;

  /**
   * Author: ThuanHoang 03/07/2023
   * Aggregate function that sums values of previously filtered data into values for graph and filtered by month
   * @param {ArrayList} data
   * @returns The data list has been edited for diagram display
   */
  const calcMoneyEachMonth = (data) => {
    return data.reduce((prevList, currentValue) => {
      const totalMoney = currentValue.costAnalysisDetails.reduce(
        (prevValue, currentValue) => {
          return prevValue + currentValue.Money;
        },
        0
      );

      return [
        ...prevList,
        {
          title: currentValue.month,
          value: totalMoney / 1000000,
        },
      ];
    }, []);
  };
  /**
   * Author: ThuanHoang 03/07/2023
   * Aggregate function that sums values of previously filtered data into values for graph and filtered by quarter
   * @param {ArrayList} data
   * @returns The data list has been edited for diagram display
   */
  const calcMoneyEachQuarter = (data) => {
    return data.reduce((prevList, currentValue) => {
      const totalMoney = currentValue.costAnalysisDetails.reduce(
        (prevValue, currentValue) => {
          return prevValue + currentValue.Money;
        },
        0
      );
      const inforQuarter = {
        title: `Quý ${currentValue.quarter}`,
        value: totalMoney / 1000000,
      };
      return [...prevList, inforQuarter];
    }, []);
  };
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
   * Author: ThuanHoang 03/07/2023
   * Function that filters CostAnalysis values by month
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
    axios
      .get(
        inforFilter
          ? `http://192.168.90.84:1375/api/CostAnalysis/MonthReport?m1=${inforFilter.startMonth}&m2=${inforFilter.endMonth}&reportType=1&userId=${dataUser.id}&year=${inforFilter.year}`
          : `http://192.168.90.84:1375/api/CostAnalysis/MonthReport?m1=1&m2=12&reportType=1&userId=${
              dataUser.id
            }&year=${dataUser.permission[dataUser.permission.length - 1].year}`
      )
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        const dataFilter =
          inforFilter.type !== "quarter"
            ? filterInforCostAnalysis(data)
            : filterInforCostAnalysisQuarter(data);
        setDataForChart(
          inforFilter.type !== "quarter"
            ? calcMoneyEachMonth(dataFilter)
            : calcMoneyEachQuarter(dataFilter)
        );
        setData(dataFilter);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    handleGetData();
  }, []);
  return (
    <VStack style={{ marginBottom: 20 }}>
      <HStack
        justifyContent={"flex-end"}
        backgroundColor={"#fff"}
        margin={2}
        borderRadius={10}
        style={{ elevation: 10, shadowColor: "#52006A" }}
      >
        <ScrollView
          horizontal
          style={{ width: widthOfScreen * 0.95, height: heightOfScreen * 0.35 }}
        >
          {dataForChart ? (
            <VictoryChart
              theme={VictoryTheme.material}
              height={heightOfScreen * 0.35}
              width={widthOfScreen}
              animate={{ duration: 3000, onLoad: { duration: 1000 } }}
              domainPadding={{ x: [50, 20], y: 20 }}
            >
              <VictoryBar
                cornerRadius={5}
                labels={({ datum }) => {
                  return datum.value !== 0 ? formatMoney(datum) : "";
                }}
                style={{
                  data: {
                    fill: ({ datum }) =>
                      (inforFilter.year == currentYear &&
                        datum.title === currentMonth) ||
                      datum.title === `Quý ${Math.round(currentMonth / 3)}`
                        ? "#F25F33"
                        : "#009087",
                  },
                  labels: {
                    fontSize: 7,
                  },
                }}
                data={dataForChart}
                x={"title"}
                y={"value"}
              />
            </VictoryChart>
          ) : (
            <SkeletonChartBar></SkeletonChartBar>
          )}
        </ScrollView>
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

      <ScrollView
        height={
          Platform.OS === "ios" ? heightOfScreen * 0.32 : heightOfScreen * 0.36
        }
      >
        {data ? (
          data.map((item, index) => {
            return (
              <BudgetSituationTable
                key={index}
                tableName={
                  inforFilter.type == "quarter"
                    ? `Quý ${item.quarter}/${item.year}`
                    : `Tháng ${item.month}/${item.year}`
                }
                data={item.costAnalysisDetails}
              ></BudgetSituationTable>
            );
          })
        ) : (
          <SkeletonTable />
        )}
      </ScrollView>
    </VStack>
  );
}

export default BudgetSituation_2;
