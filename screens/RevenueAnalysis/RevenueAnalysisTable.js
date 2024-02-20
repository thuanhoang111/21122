import {
  Divider,
  HStack,
  Heading,
  ScrollView,
  Text,
  VStack,
  View,
  Pressable,
  Select,
  CheckIcon,
} from "native-base";
import { StyleSheet } from "react-native";
import { widthOfScreen } from "../../constants/ConstantMain";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { linkClickColor, linkColor } from "../../constants/ConstantStyle";
import NoData from "./../../components/NoData/NoData";
import { MainContext } from "../MainContext";
import { useContext } from "react";
function RevenueAnalysisTable({
  data,
  showDetail = () => {},
  year,
  onChangeYear,
}) {
  const mainContext = useContext(MainContext);
  const permissionUser = mainContext.dataUser.permission;
  return (
    <View style={styles.table}>
      <HStack style={styles.tableHeader} alignItems={"center"}>
        <HStack alignItems={"center"}>
          <Heading size={"md"} style={styles.titleHeader}>
            Năm:
          </Heading>
          <Select
            selectedValue={year}
            width="90"
            borderWidth={0}
            dropdownIcon={true}
            textDecorationLine={"underline"}
            placeholder={year.toString()}
            _selectedItem={{
              endIcon: <CheckIcon size="5" />,
            }}
            placeholderTextColor={"black"}
            mt={1}
            fontSize={"md"}
            variant="underlined"
            onValueChange={(itemValue) => {
              mainContext.onChangeLoading(true);
              onChangeYear(itemValue);
            }}
          >
            {permissionUser.map((item, index) => {
              return (
                <Select.Item
                  key={index}
                  label={item.year}
                  value={item.year.toString()}
                />
              );
            })}
          </Select>
        </HStack>
        <Pressable onPress={() => showDetail()}>
          {({ isHovered, isFocused, isPressed }) => {
            return (
              <View
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Text
                  fontSize={"md"}
                  color={
                    isPressed
                      ? linkClickColor
                      : isHovered
                      ? linkClickColor
                      : linkColor
                  }
                >
                  Xem chi tiết
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={15}
                  color={
                    isPressed
                      ? linkClickColor
                      : isHovered
                      ? linkClickColor
                      : linkColor
                  }
                />
              </View>
            );
          }}
        </Pressable>
      </HStack>

      <VStack style={styles.tableContent}>
        {data.length != 0 ? (
          <ScrollView
            style={styles.tableContentScrollView}
            nestedScrollEnabled={true}
          >
            {data.map((item, index) => {
              return (
                <View key={index}>
                  <HStack style={styles.boxItemContent}>
                    <View style={{ marginHorizontal: 5 }}>
                      <Text
                        style={{
                          width: widthOfScreen * 0.5,
                        }}
                      >
                        {item.AccountName}
                      </Text>
                    </View>
                    <View style={{ marginHorizontal: 5 }}>
                      <Text
                        style={{
                          width: widthOfScreen * 0.35,
                          textAlign: "right",
                        }}
                      >
                        {item.Money.toLocaleString()}
                      </Text>
                    </View>
                  </HStack>
                  {index != data.length - 1 && <Divider></Divider>}
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <NoData height={"100%"} />
        )}
      </VStack>
    </View>
  );
}
const styles = StyleSheet.create({
  table: {
    flex: 4,
    width: widthOfScreen * 0.95,
    marginHorizontal: widthOfScreen * 0.025,
    margin: 20,
    elevation: 5,
    shadowColor: "#52006A",
    backgroundColor: "#fff",
    borderRadius: 20,
    fontSize: 8,
    overflow: "hidden",
  },
  tableHeader: {
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "#D9D9D9",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleHeader: {
    fontSize: 16,
    fontWeight: 600,
    color: "#000",
  },
  totalPrice: {
    fontSize: 17,
    fontWeight: 800,
  },
  tableContent: {
    flex: 1,
  },
  tableContentScrollView: {
    paddingLeft: 10,
  },

  boxItemContent: {
    paddingVertical: 10,
  },
  textTotalItemContent: {
    fontSize: 16,
    fontWeight: 700,
  },
  boxTotalContent: {
    alignContent: "center",
    backgroundColor: "#dddddc",
    paddingLeft: 10,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
export default RevenueAnalysisTable;
