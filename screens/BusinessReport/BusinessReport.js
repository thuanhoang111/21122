import { useEffect, useState } from "react";
import { Platform, ScrollView, Text, View } from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
} from "victory-native";
import { heightOfScreen, widthOfScreen } from "../../constants/ConstantMain";
import BudgetSituationTable from "../BudgetSituation/BudgetSituationTable";
import { VStack, Center } from "native-base";
import { currentTimeColor, primaryColor } from "../../constants/ConstantStyle";
function BusinessReport() {
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
    { month: "T12", value: 80 },
  ];
  const initialDataDotMonth = Array.from(
    { length: dataSampleMonth.length - 1 },
    () => ({
      month: " ",
      value: 0,
    })
  );
  const [dataDotSample, setDataDotSample] = useState(initialDataDotMonth);
  const quarterYearDataDetail = [
    {
      item: [
        {
          AccountName: "0003",
          Money: 40000000,
        },
        {
          AccountName: "0005",
          Money: 7953000,
        },
        {
          AccountName: "0006",
          Money: 2250000,
        },
        {
          AccountName: "0008",
          Money: 1550000,
        },
      ],
    },
    {
      item: [
        {
          AccountName: "0003",
          Money: 40000000,
        },
        {
          AccountName: "0005",
          Money: 7953000,
        },
        {
          AccountName: "0006",
          Money: 2250000,
        },
        {
          AccountName: "0008",
          Money: 1550000,
        },
      ],
    },
    {
      item: [
        {
          AccountName: "0003",
          Money: 40000000,
        },
        {
          AccountName: "0005",
          Money: 7953000,
        },
        {
          AccountName: "0006",
          Money: 2250000,
        },
        {
          AccountName: "0008",
          Money: 1550000,
        },
      ],
    },
    {
      item: [
        {
          AccountName: "0003",
          Money: 40000000,
        },
        {
          AccountName: "0005",
          Money: 7953000,
        },
        {
          AccountName: "0006",
          Money: 2250000,
        },
        {
          AccountName: "0008",
          Money: 1550000,
        },
      ],
    },
  ];
  useEffect(() => {
    setDataDotSample(dataSampleMonth.slice(1));
    setTimeout(() => {
      setIsRender(true);
    }, 1000);
  }, []);
  return (
    isRender && (
      <VStack
        alignItems={"flex-start"}
        justifyContent={"center"}
        flex={1}
        safeAreaBottom={20}
      >
        <Center
          backgroundColor={"#fff"}
          margin={3}
          borderRadius={10}
          style={{ elevation: 10, shadowColor: "#52006A" }}
        >
          <VictoryChart
            theme={VictoryTheme.material}
            height={heightOfScreen * 0.35}
            width={widthOfScreen}
          >
            <VictoryLine
              style={{
                data: {
                  stroke: primaryColor,
                },
              }}
              data={dataSampleMonth}
              x="month"
              y="value"
              animate={{
                duration: 500,
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
                    datum.month === "T12" ? currentTimeColor : primaryColor,
                  opacity: ({ datum }) => datum.opacity || 1,
                },
              }}
              size={7}
              data={dataDotSample}
              x="month"
              y="value"
            />
          </VictoryChart>
        </Center>
        <Text
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            fontWeight: 600,
          }}
        >
          Chi phí chi tiết
        </Text>
        <ScrollView style={{ paddingBottom: 2 }}>
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
      </VStack>
    )
  );
}

export default BusinessReport;
