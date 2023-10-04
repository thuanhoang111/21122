import { useEffect, useState } from "react";
import { Platform, ScrollView, Text, View } from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
  VictoryTooltip,
} from "victory-native";
import { heightOfScreen, widthOfScreen } from "../../constants/ConstantMain";
import BudgetSituationTable from "../BudgetSituation/BudgetSituationTable";
import { VStack, HStack } from "native-base";
import { useToggle } from "@uidotdev/usehooks";

function ProfitAnalysis() {
  const dataSampleMonth = [
    { month: " ", value: 0 },
    { month: "T1", value: 210 },
    { month: "T2", value: 340 },
    { month: "T3", value: 430 },
    { month: "T4", value: 70 },
    { month: "T5", value: 230 },
    { month: "T6", value: 605 },
    { month: "T7", value: 270 },
    { month: "T8", value: 160 },
    { month: "T9", value: 420 },
    { month: "T10", value: 700 },
    { month: "T11", value: 470 },
    { month: "T12", value: 980 },
  ];
  const initialDataDotMonth = Array.from(
    { length: dataSampleMonth.length - 1 },
    () => ({
      month: " ",
      value: 0,
    })
  );
  const [dataDotSample, setDataDotSample] = useState(initialDataDotMonth);
  const [isRender, setIsRender] = useToggle(false);
  const quarterYearDataDetail = [
    {
      item: [
        {
          title: "Chi phí hoạt động tín dụng nội bộ",
          Money: 40000000,
        },
        {
          title: "Chi phí quản lý kinh doanh",
          Money: 7953000,
        },
        {
          title: "Chi phí khác",
          Money: 2250000,
        },
        {
          title: "Chi phí lương",
          Money: 1550000,
        },
      ],
    },
    {
      item: [
        {
          title: "Chi phí hoạt động tín dụng nội bộ",
          Money: 40000000,
        },
        {
          title: "Chi phí quản lý kinh doanh",
          Money: 7953000,
        },
        {
          title: "Chi phí khác",
          Money: 2250000,
        },
        {
          title: "Chi phí lương",
          Money: 1550000,
        },
      ],
    },
    {
      item: [
        {
          title: "Chi phí hoạt động tín dụng nội bộ",
          Money: 40000000,
        },
        {
          title: "Chi phí quản lý kinh doanh",
          Money: 7953000,
        },
        {
          title: "Chi phí khác",
          Money: 2250000,
        },
        {
          title: "Chi phí lương",
          Money: 1550000,
        },
      ],
    },
    {
      item: [
        {
          title: "Chi phí hoạt động tín dụng nội bộ",
          Money: 40000000,
        },
        {
          title: "Chi phí quản lý kinh doanh",
          Money: 7953000,
        },
        {
          title: "Chi phí khác",
          Money: 2250000,
        },
        {
          title: "Chi phí lương",
          Money: 1550000,
        },
      ],
    },
  ];
  useEffect(() => {
    setDataDotSample(dataSampleMonth.slice(1));
    setTimeout(() => {
      setIsRender(true);
    }, 500);
  }, []);
  return (
    <VStack>
      {isRender && (
        <>
          <HStack
            justifyContent={"flex-end"}
            backgroundColor={"#fff"}
            margin={3}
            borderRadius={10}
            style={{ elevation: 10, shadowColor: "#52006A" }}
          >
            <View
              style={{
                width: widthOfScreen * 0.95,
                height: heightOfScreen * 0.4,
              }}
            >
              <VictoryChart
                theme={VictoryTheme.material}
                height={[heightOfScreen * 0.4]}
                width={widthOfScreen}
              >
                <VictoryLine
                  style={{
                    data: {
                      stroke: "#009087",
                    },
                  }}
                  data={dataSampleMonth}
                  x="month"
                  y="value"
                  animate={{
                    duration: 1500,
                  }}
                />
                <VictoryScatter
                  animate={
                    Platform.OS === "ios" && {
                      duration: 100,
                      easing: "expOut",
                      onExit: {
                        duration: 500,
                        before: () => ({ opacity: 0.3, _y: 0 }),
                      },
                      onEnter: {
                        duration: 500,
                        before: () => ({ opacity: 0.3, _y: 0 }),
                        after: (datum) => ({ opacity: 1, _y: datum._y }),
                      },
                    }
                  }
                  // labels={({ datum }) => datum.value}
                  // labelComponent={<VictoryTooltip />}
                  style={{
                    data: {
                      fill: ({ datum }) =>
                        datum.month === "T12" ? "#F25F33" : "#009087",
                      opacity: ({ datum }) => datum.opacity || 1,
                    },
                  }}
                  size={7}
                  data={dataDotSample}
                  x="month"
                  y="value"
                />
              </VictoryChart>
            </View>
          </HStack>
          <Text
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              fontWeight: 600,
            }}
          >
            Chi phí chi tiết
          </Text>
          <ScrollView
            height={heightOfScreen * 0.38}
            style={{ paddingBottom: 2 }}
          >
            {quarterYearDataDetail.map((item, index) => {
              return (
                <BudgetSituationTable
                  key={index}
                  tableName={`Quý ${index + 1}/2023`}
                  data={item.item}
                ></BudgetSituationTable>
              );
            })}
          </ScrollView>
        </>
      )}
    </VStack>
  );
}

export default ProfitAnalysis;
