import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import ChartYear from "../../components/ChartYear/ChartYear";
import * as Get from "../../API/service/Get";
import { Center, Divider, HStack, Skeleton } from "native-base";
import RevenueAnalysisTable from "./RevenueAnalysisTable";
import { MainContext } from "../MainContext";
import Header from "../../components/Header/Header";

const RevenueAnalysis = ({ route, navigation }) => {
  const mainContext = useContext(MainContext);
  const [costAnalysisDetails, setCostAnalysisDetails] = useState();
  const [totalPriceOfEachYear, setTotalPriceOfEachYear] = useState();
  const dataUser = mainContext.dataUser;
  const inforFilter = mainContext.inforFilter;
  const lastPermissionYear = mainContext.lastPermissionYear;
  const handleCalcPriceOfEachYear = (data) => {
    const inforPriceOfEachYear = [];
    data.forEach((item) => {
      inforPriceOfEachYear.unshift({
        year: item.Nam,
        value: item.BusinessReportDetails.reduce((prevValue, currentValue) => {
          return prevValue + currentValue.Money;
        }, 0),
      });
    });
    setTotalPriceOfEachYear(inforPriceOfEachYear);
  };
  const handleGetData = (year) => {
    Get.HandleGetWithParam(
      `CostAnalysis/YearReport`,
      `radyear=2&reportType=0&userId=${dataUser.id}&year=${year}`
    )
      .then((data) => {
        if (data.isError || data.error) {
          Alert.alert("Thông báo", data.errorDescription, [{ text: "Ok" }]);
          setCostAnalysisDetails([]);
          setTotalPriceOfEachYear([{ year: year, value: 0 }]);
        } else {
          setCostAnalysisDetails(data[0].BusinessReportDetails);
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
  useEffect(() => {
    handleGetData(inforFilter.year || lastPermissionYear);
  }, []);
  return (
    <>
      <Header
        onBack={() => navigation.goBack()}
        title={"Phân tích kinh doanh"}
      ></Header>
      <View style={styles.container}>
        {costAnalysisDetails ? (
          <>
            {totalPriceOfEachYear && (
              <ChartYear data={totalPriceOfEachYear}></ChartYear>
            )}
            <RevenueAnalysisTable
              year={inforFilter.year || lastPermissionYear}
              data={costAnalysisDetails}
              // showDetail={(data) =>
              //   navigation.navigate("Chi tiết phân tích chi phí", {
              //     data: data,
              //     title: "Chi tiết doanh thu",
              //     reportType: 0,
              //   })
              // }
              onChangeYear={handleGetData}
            ></RevenueAnalysisTable>
          </>
        ) : (
          <Center
            w="100%"
            style={{
              borderRadius: 25,
              zIndex: 100,
            }}
          >
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
            <View
              style={{
                borderRadius: 25,
                borderWidth: 0.5,
                borderColor: "#d2d0d1",
                width: "98%",
              }}
            >
              <HStack
                space={10}
                rounded="3xl"
                alignItems="center"
                p={3}
                style={{
                  backgroundColor: "#b8c0c2",
                  borderBottomRightRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
              >
                <HStack flex="2" space="8">
                  <Skeleton.Text w={"100%"} lines={1} />
                </HStack>
              </HStack>
              <HStack
                w={"100%"}
                maxW="400"
                rounded={"3xl"}
                marginTop={1}
                alignItems="center"
                p={4}
              >
                <HStack flex="2" space="6">
                  <Skeleton w={"100%"} h={40} lines={1} />
                </HStack>
              </HStack>
              <HStack
                space={10}
                rounded={"3xl"}
                marginTop={1}
                alignItems="center"
                style={{
                  backgroundColor: "#b8c0c2",
                  borderTopRightRadius: 0,
                  borderTopLeftRadius: 0,
                }}
                p={3}
              >
                <HStack flex="2" space="6">
                  <Skeleton.Text w={"100%"} lines={1} />
                </HStack>
              </HStack>
            </View>
          </Center>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
export default RevenueAnalysis;
