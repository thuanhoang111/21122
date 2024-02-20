import { View } from "react-native";
import * as constantMain from "../../constants/ConstantMain";
import { VStack, Heading, ScrollView, Skeleton, Text } from "native-base";
import * as Get from "../../API/service/Get";
import { useContext, useEffect, useState } from "react";
import DataTableMain_2 from "./../../components/DataTable/DataTableMain_2";
import {
  financialReportName24,
  financialReportName133,
} from "../../model/data";
import SkeletonTable from "./../../components/Skeleton/SkeletonTable";
import FinancialReportFilter from "./../../components/Filter/FinancialReportFilter";
import Header from "../../components/Header/Header";
import { Drawer } from "react-native-drawer-layout";
import { MainContext } from "../MainContext";
import { SafeAreaView } from "react-native";
import { Alert } from "react-native";
import { useObjectState } from "@uidotdev/usehooks";
function FinancialReport({ route, navigation }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useObjectState({
    listFinancialReport: undefined,
    circulars: undefined,
  });
  const mainContext = useContext(MainContext);
  const dataUser = mainContext.dataUser;
  const lastPermissionYear = mainContext.lastPermissionYear;
  const onChangeLoading = mainContext.onChangeLoading;
  const inforFilter = mainContext.inforFilter;
  const isIos = mainContext.isIos;
  /**
   * Author:ThuanHoang 25/06/2023
   * Function handle get data Financial Report
   */
  const getInfoReport = async (year, startMonth, endMonth) => {
    await Get.HandleGetWithParam(
      "FinancialReport",
      `m1=${startMonth}&m2=${endMonth}&userId=${dataUser.id}&year=${year}`
    )
      .then((data) => {
        if (data.isError || data.error) {
          Alert.alert(data.errorMsg || "Thông báo", data.errorDescription, [
            { text: "Ok" },
          ]);
          setData(() => ({
            listFinancialReport: [],
            circulars: "Null",
          }));
        } else {
          setData(() => ({
            listFinancialReport: data[0].FinancialDetails,
            circulars: data[0].ThongTu,
          }));
        }
      })
      .finally(() => {
        setTimeout(() => {
          mainContext.onChangeLoading(false);
          setOpen(false);
          mainContext.onChangeInforFilter({
            startMonth,
            endMonth,
            year,
          });
        }, 1000);
      });
  };
  useEffect(() => {
    onChangeLoading(false);
    getInfoReport(
      inforFilter.year || lastPermissionYear,
      inforFilter.startMonth || 1,
      inforFilter.endMonth || 12
    );
  }, []);
  return (
    <Drawer
      swipeEdgeWidth={constantMain.widthOfScreen * 0.5}
      swipeMinDistance={50}
      swipeMinVelocity={1000}
      drawerPosition="right"
      drawerType="front"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      hideStatusBarOnOpen
      swipeEnabled={isIos}
      renderDrawerContent={() => {
        return (
          <FinancialReportFilter
            inforPermission={dataUser.permission}
            onSearch={getInfoReport}
          />
        );
      }}
      drawerStyle={{ backgroundColor: "#f1f1f1", width: "85%" }}
    >
      <Header
        onBack={() => navigation.goBack()}
        title={"Báo cáo tài chính"}
        onClick={() => setOpen(true)}
        isRightIcon
      ></Header>
      <SafeAreaView>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            height: "94%",
          }}
        >
          <VStack space={1} alignItems="center" marginY={2}>
            {data.circulars ? (
              data.circulars != "Null" ? (
                <>
                  <Heading fontSize="xl">
                    {` Năm ${
                      inforFilter.year
                        ? inforFilter.year
                        : dataUser.permission[dataUser.permission.length - 1]
                            .year
                    }`}
                  </Heading>
                  <Heading fontSize="md" fontWeight={400}>
                    Thông tư {data.circulars}/
                    {inforFilter.year || lastPermissionYear}/TT-BTC
                  </Heading>
                </>
              ) : (
                <Heading fontSize="xl" fontWeight={400}>
                  Không có dữ liệu
                </Heading>
              )
            ) : (
              <>
                <Skeleton.Text lines={1} w={"35%"}></Skeleton.Text>
                <Skeleton.Text lines={1} w={"70%"}></Skeleton.Text>
              </>
            )}
          </VStack>

          {data.listFinancialReport ? (
            <ScrollView
              flex={1}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              <DataTableMain_2
                fields={["Tài Sản"]}
                data={data.listFinancialReport.slice(
                  0,
                  data.circulars === "TT133" ? 27 : 9
                )}
                circulars={data.circulars}
                listTitle={
                  data.circulars === "TT133"
                    ? financialReportName133.slice(0, 27)
                    : financialReportName24.slice(0, 9)
                }
              ></DataTableMain_2>
              <DataTableMain_2
                fields={["Nguồn vốn"]}
                data={data.listFinancialReport.slice(
                  data.circulars === "TT133" ? 27 : 9
                )}
                circulars={data.circulars}
                listTitle={
                  data.circulars === "TT133"
                    ? financialReportName133.slice(27)
                    : financialReportName24.slice(9)
                }
              ></DataTableMain_2>
            </ScrollView>
          ) : (
            <ScrollView>
              <VStack space={5} alignItems={"center"}>
                <SkeletonTable length={6} numberInLine={1} />
                <SkeletonTable length={5} numberInLine={1} />
              </VStack>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </Drawer>
  );
}

export default FinancialReport;
