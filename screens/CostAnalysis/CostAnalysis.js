import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Alert } from "react-native";
import ChartYear from "../../components/ChartYear/ChartYear";
import * as Post from "../../API/service/Post";
import * as Get from "../../API/service/Get";
import CostAnalysisTable from "./CostAnalysisTable";
import { Center, Divider, HStack, Skeleton, VStack } from "native-base";
import { useToggle } from "@uidotdev/usehooks";
import SkeletonTable from "./../../components/Skeleton/SkeletonTable";
import { MainContext } from "../MainContext";
import Header from "../../components/Header/Header";
const CostAnalysis = ({ route, navigation }) => {
  const mainContext = useContext(MainContext);
  const [dataCost, setDataCost] = useState();
  const [totalPriceOfEachYear, setTotalPriceOfEachYear] = useState();
  const [isRenderLoading, setIsRenderLoading] = useToggle(false);
  const inforFilter = mainContext.inforFilter;
  const dataUser = mainContext.dataUser;
  const lastPermissionYear = mainContext.lastPermissionYear;

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
    await Post.handlePostWithBody(`CostAnalysis`, {
      radyear: 1,
      reporttype: 1,
      userId: dataUser.id,
      year: lastPermissionYear,
    })
      .then((res) => {
        return res;
      })
      .catch((error) => console.log(error));
  };
  /**
   * Author: ThuanHoang 24/06/2023
   * Function get data from Api with type MonthReport
   * @param {ArrayList} data
   * @returns data
   */
  const handleGetData = async (year) => {
    await Get.HandleGetWithParam(
      `CostAnalysis/YearReport`,
      `radYear=2&reportType=1&userId=${dataUser.id}&year=${year}`
    )
      .then((data) => {
        if (data.error || data.isError) {
          Alert.alert("Thông báo", data.errorDescription || "Đã xảy ra lỗi", [
            { text: "Ok" },
          ]);
          setDataCost([]);
          setTotalPriceOfEachYear([{ year: year, value: 0 }]);
        } else {
          setDataCost(data[0].CostAnalysisDetails);
          handleCalcPriceOfEachYear(data);
        }
      })
      .finally(() => {
        mainContext.onChangeInforFilter({
          year,
        });
        mainContext.onChangeLoading(false);
      });
  };
  // useEffect(() => {
  //   handlePriceSummary();
  // }, []);
  useEffect(() => {
    handleGetData(inforFilter.year || lastPermissionYear);
    setTimeout(() => {
      setIsRenderLoading(true);
    }, 1);
  }, []);
  return (
    <>
      <Header
        title={"Phân tích chi phí"}
        onBack={() => navigation.goBack()}
        // onClick={() => navigation.navigate("Chi tiết phân tích chi phí")}
      ></Header>
      <VStack justifyContent={"center"} flex={1}>
        {dataCost ? (
          <VStack
            alignItems={"center"}
            space={10}
            justifyContent={"space-between"}
            flex={1}
            paddingBottom={2}
          >
            {totalPriceOfEachYear && (
              <ChartYear data={totalPriceOfEachYear}></ChartYear>
            )}
            <CostAnalysisTable
              year={inforFilter.year || lastPermissionYear}
              data={dataCost
                .slice(2, 10)
                .filter(
                  (item) =>
                    item.AccountCode !== "0007" && item.AccountCode !== "0004"
                )}
              showDetail={(data) =>
                navigation.navigate("Chi tiết phân tích chi phí", {
                  data: data,
                  title: "Chi tiết phân tích chi phí",
                  reportType: 1,
                })
              }
              onChangeYear={handleGetData}
            ></CostAnalysisTable>
          </VStack>
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
                  minHeight={250}
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
      </VStack>
    </>
  );
};
export default CostAnalysis;
