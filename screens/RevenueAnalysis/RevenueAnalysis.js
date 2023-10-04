import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import ChartYear from "../../components/ChartYear/ChartYear";
import axios from "axios";
import { Avatar, Center, Divider, HStack, Skeleton } from "native-base";
import RevenueAnalysisTable from "./RevenueAnalysisTable";

const RevenueAnalysis = ({ route, navigation }) => {
  const [costAnalysisDetails, setCostAnalysisDetails] = useState();
  const [totalPriceOfEachYear, setTotalPriceOfEachYear] = useState();
  const dataUser = route.params.data;
  const lastPermissionYear =
    dataUser.permission[dataUser.permission.length - 1].year;
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
  const handleGetData = () => {
    axios
      .get(
        `http://192.168.90.84:1375/api/CostAnalysis/YearReport?radyear=2&reportType=0&userId=${dataUser.id}&year=${lastPermissionYear}`
      )
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setCostAnalysisDetails(data);
        handleCalcPriceOfEachYear(data);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    handleGetData();
  }, []);
  return (
    <View style={styles.container}>
      {costAnalysisDetails ? (
        <>
          {totalPriceOfEachYear && (
            <ChartYear data={totalPriceOfEachYear}></ChartYear>
          )}
          <View style={{ marginTop: 50 }}>
            <RevenueAnalysisTable
              tableName={`Năm ${lastPermissionYear}`}
              data={costAnalysisDetails[0].BusinessReportDetails}
            ></RevenueAnalysisTable>
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
export default RevenueAnalysis;
