import { View, Text, HStack, VStack, Skeleton } from "native-base";
import { heightOfScreen, widthOfScreen } from "../../constants/ConstantMain";
import { VictoryContainer, VictoryPie } from "victory-native";
import { memo } from "react";
import NoData from "../NoData/NoData";
function PieChart({
  dataChart,
  setDataChart,
  endAngle,
  isAnimate,
  chartName = "Tổng quan",
  listColor = [
    "tomato",
    "#90ba45",
    "gold",
    "#56a97a",
    "#ee1211",
    "#51acae",
    "cyan",
    "#b95746",
    "#dd22b0",
    "#7c67c5",
  ],
  listTitle = [],
}) {
  return (
    <VStack
      marginX={5}
      borderRadius={10}
      id="table-chart-box"
      borderColor={"#e3e3e4"}
      backgroundColor={"#fff"}
      borderWidth={3}
      style={{ elevation: 100, shadowColor: "#52006A" }}
    >
      <VStack>
        <Text
          fontSize={"md"}
          bold
          p={3}
          position={"absolute"}
          width={widthOfScreen * 0.9}
          textAlign={"center"}
          zIndex={1000}
        >
          {chartName}
        </Text>
        {dataChart ? (
          dataChart.length != 0 ? (
            <VictoryPie
              horizontal
              style={{
                parent: { marginBlock: 5, top: -10 },
                labels: {
                  fontSize: 13,
                  fontWeight: "bold",
                },
              }}
              animate={{
                duration: isAnimate ? 2000 : 0,
              }}
              endAngle={endAngle}
              labelPosition={"centroid"}
              containerComponent={<VictoryContainer responsive={false} />}
              width={widthOfScreen * 0.9}
              height={heightOfScreen * 0.35}
              labelRadius={({ _, index, datum }) => {
                return datum._y > 20 ? 30 : (index + 0.5) * 20;
              }}
              colorScale={listColor}
              data={dataChart}
              x={(a) => {
                return a.money != "0 đ" ? (a.active ? a.money : a.x) : " ";
              }}
              radius={({ datum }) => (datum.active == true ? 100 : 90)}
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onPressIn: (e, index) => {
                      let currentItem = dataChart.find(
                        (item) => item.index === index.datum.index
                      );
                      currentItem.active = !currentItem.active;
                      setDataChart(
                        dataChart.map((item) => {
                          return item.index === currentItem.index
                            ? currentItem
                            : item;
                        })
                      );
                    },
                  },
                },
              ]}
            />
          ) : (
            <VStack
              space="5"
              width={widthOfScreen * 0.9}
              height={heightOfScreen * 0.35}
              alignItems={"center"}
              justifyContent={"center"}
              opacity={0.5}
            >
              <NoData />
            </VStack>
          )
        ) : (
          <VStack
            space="5"
            width={widthOfScreen * 0.9}
            height={heightOfScreen * 0.35}
            alignItems={"center"}
            justifyContent={"center"}
            opacity={0.5}
            paddingTop={10}
          >
            <Skeleton
              borderWidth={1}
              borderColor="coolGray.200"
              endColor="warmGray.50"
              size="180"
              rounded="full"
              mt="-70"
            />
          </VStack>
        )}
      </VStack>
      <HStack
        space="3"
        alignItems="center"
        justifyContent={"space-evenly"}
        marginBottom={2}
        position={"absolute"}
        bottom={0}
        width={"100%"}
      >
        {listTitle.length != 0 &&
          listTitle.map((item, index) => {
            return (
              <HStack key={index} size="16" space={1}>
                <View bg={listColor[index]} size={5} borderWidth={1}></View>
                <Text>{item}</Text>
              </HStack>
            );
          })}
      </HStack>
    </VStack>
  );
}

export default memo(PieChart);
