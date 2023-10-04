import { View } from "react-native";
import * as constantMain from "../../constants/ConstantMain";
import { VStack, Heading, ScrollView, Skeleton, Text } from "native-base";
import * as Get from "../../API/service/Get";
import { useEffect, useState } from "react";
import DataTableMain_2 from "./../../components/DataTable/DataTableMain_2";
import { financialReportName } from "../../model/data";
import { useToggle } from "@uidotdev/usehooks";
import SkeletonTable from "./../../components/Skeleton/SkeletonTable";
import FinancialReportFilter from "./../../components/Filter/FinancialReportFilter";
import Header from "../../components/Header/Header";
import { Drawer } from "react-native-drawer-layout";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
function FinancialReport({ route, navigation }) {
  const [open, setOpen] = useState(false);
  const [listFinancialReport, setListFinancialReport] = useState();
  const [isRender, setIsRender] = useToggle(false);
  const dataUser = route.params.data;
  const lastPermissionYear =
    dataUser.permission[dataUser.permission.length - 1].year;
  const [inforFilter, setInforFilter] = useState({
    startMonth: 1,
    endMonth: 12,
    year: lastPermissionYear,
  });
  /**
   * Author:ThuanHoang 25/06/2023
   * Function handle get data Financial Report
   */
  const getInfoReport = async (year, startMonth, endMonth) => {
    await Get.getWithParam(
      "FinancialReport",
      `m1=${startMonth}&m9=${endMonth}&userId=${dataUser.id}&year=${year}`
    )
      .then((res) => {
        setOpen(false);
        setListFinancialReport(res[0].FinancialDetails);
      })
      .catch(() => {
        setTimeout(() => {
          setListFinancialReport([]);
        }, 2000);
      })
      .finally(() => {
        setInforFilter({
          startMonth,
          endMonth,
          year,
        });
      });
  };
  useEffect(() => {
    setTimeout(() => {
      setIsRender(true);
    }, 1);
    getInfoReport(
      inforFilter.year,
      inforFilter.startMonth,
      inforFilter.endMonth
    );
  }, []);
  return (
    <Drawer
      swipeEdgeWidth={40}
      swipeMinDistance={100}
      swipeMinVelocity={1000}
      drawerPosition="right"
      drawerType="front"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      hideStatusBarOnOpen
      renderDrawerContent={() => {
        return (
          <FinancialReportFilter
            inforPermission={dataUser.permission}
            onSearch={getInfoReport}
            inforFilter={inforFilter}
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
      <View
        style={{
          width: constantMain.widthOfScreen,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <VStack space={1} alignItems="center" marginY={2}>
          {listFinancialReport ? (
            <>
              <Heading fontSize="xl">
                {` Năm ${
                  inforFilter
                    ? inforFilter.year
                    : dataUser.permission[dataUser.permission.length - 1].year
                }`}
              </Heading>
              <Heading fontSize="md" fontWeight={400}>
                Thông tư 24/2017/TT-BTC
              </Heading>
            </>
          ) : (
            isRender && (
              <>
                <Skeleton.Text lines={1} w={"35%"}></Skeleton.Text>
                <Skeleton.Text lines={1} w={"70%"}></Skeleton.Text>
              </>
            )
          )}
        </VStack>

        {listFinancialReport ? (
          <ScrollView
            height={constantMain.heightOfScreen * 0.72}
            nestedScrollEnabled={true}
          >
            <DataTableMain_2
              fields={["Tài Sản"]}
              data={listFinancialReport.slice(0, 9)}
              listTitle={financialReportName.slice(0, 9)}
            ></DataTableMain_2>
            <DataTableMain_2
              fields={["Nguồn vốn"]}
              data={listFinancialReport.slice(9)}
              listTitle={financialReportName.slice(9)}
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
    </Drawer>
  );
}

export default FinancialReport;
