import { Platform, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import {
  Heading,
  NativeBaseProvider,
  Center,
  Container,
  Radio,
  Box,
  HStack,
  Select,
  CheckIcon,
  Button,
  KeyboardAvoidingView,
} from "native-base";
import { useCallback, useState } from "react";
import { heightOfScreen, widthOfScreen } from "./../../constants/ConstantMain";
import {
  monthInYear,
  quarterInYearEnd,
  quarterInYearStart,
} from "../../model/data";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  AutocompleteDropdown,
  AutocompleteDropdownContextProvider,
} from "react-native-autocomplete-dropdown";
function FilterPage({ route, navigation }) {
  const listPermissionYear = route.params.data.UserInfo.permission;
  const typeFilter = route.params.typeFilter;
  const [year, setYear] = useState(
    listPermissionYear[listPermissionYear.length - 1].year
  );
  const [typeTime, setTypeTime] = useState("quarter");
  const [startMonth, setStartMonth] = useState("1");
  const [endMonth, setEndMonth] = useState("12");

  const [quarter, setQuarter] = useState({
    startQuarter: "1",
    endQuarter: "12",
  });
  /**
   * Author:Thuanhoang  19/06/2023
   * @param {Object} element
   * @returns Qualifying value
   */
  const findItem = (element) => {
    return element.value === startMonth;
  };
  /**
   * Author:ThuanHoang 19/06/2023
   * @param {String} nameScreen
   * Function submit form when click button "Tìm kiếm",
   * handle change data input from form anh transfer to screen have nameScreen
   */
  const handleSubmit = (nameScreen, typeSearch) => {
    navigation.navigate(nameScreen, {
      data: route.params.data.UserInfo,
      inforFilter: {
        startMonth: typeTime === "month" ? startMonth : quarter.startQuarter,
        endMonth: typeTime === "month" ? endMonth : quarter.endQuarter,
        year: year,
        type: typeTime,
      },
    });
  };

  /**
   * function handle change item when selected
   * @param {Object} item
   * @param {String} typeQuarter
   */
  const handleChangeSelectItem = (item, typeQuarter) => {
    if (item) {
      const valueMonth = item.value;
      setQuarter(
        typeQuarter === "start"
          ? { startQuarter: valueMonth, endQuarter: quarter.endQuarter }
          : { startQuarter: quarter.startQuarter, endQuarter: valueMonth }
      );
    }
  };
  return (
    <AutocompleteDropdownContextProvider>
      <View style={styles.formFilter}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          enabled
        >
          <Container style={styles.containerFilter}>
            <Heading size={"sm"} style={styles.headerFilter}>
              Lọc theo
            </Heading>
            <HStack
              style={{
                alignItems: "center",
                width: "100%",
                marginHorizontal: 30,
                marginTop: 5,
                maxHeight: 30,
              }}
            >
              <Text style={{ fontSize: 18 }}>Năm:</Text>
              <Select
                selectedValue={year}
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                h={"100%"}
                width={81}
                marginLeft={1}
                fontSize={10}
                backgroundColor={"#fff"}
                dropdownIcon={
                  <MaterialIcons name="arrow-drop-down"></MaterialIcons>
                }
                onValueChange={(itemValue) => setYear(itemValue)}
              >
                {listPermissionYear.map((item, index) => {
                  return (
                    <Select.Item
                      key={index}
                      label={item.year.toString()}
                      value={item.year}
                    />
                  );
                })}
              </Select>
            </HStack>
            <Radio.Group
              name="myRadioGroup"
              value={typeTime}
              defaultValue="1"
              onChange={(nextValue) => {
                setTypeTime(nextValue);
              }}
              style={styles.groupButton}
            >
              <Box style={styles.box}>
                <View style={styles.boxRadioButton}>
                  <HStack
                    space={2}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                    style={{
                      width: "100%",
                      maxHeight: 30,
                      position: "relative",
                      marginTop: "12%",
                      paddingRight: 10,
                    }}
                  >
                    <Box style={{ width: "8%" }}>
                      <Text>Từ:</Text>
                    </Box>
                    <Box style={{ width: "28%" }}>
                      <Select
                        selectedValue={quarter.startQuarter}
                        height="100%"
                        _selectedItem={{
                          bg: "teal.600",
                          endIcon: <CheckIcon size="5" />,
                        }}
                        fontSize={9}
                        backgroundColor={"#fff"}
                        dropdownIcon={
                          <MaterialIcons name="arrow-drop-down"></MaterialIcons>
                        }
                        onValueChange={(itemValue) => (e) =>
                          handleChangeSelectItem(itemValue, "start")}
                        isDisabled={typeTime === "month" ? true : false}
                      >
                        {quarterInYearStart.map((item, index) => {
                          return (
                            <Select.Item
                              key={index}
                              label={item.label}
                              value={item.value}
                            />
                          );
                        })}
                      </Select>
                    </Box>
                    <Box style={{ width: "11%" }}>
                      <Text>Đến:</Text>
                    </Box>
                    <Box style={{ width: "28%" }}>
                      <Select
                        selectedValue={quarter.endQuarter}
                        height="100%"
                        _selectedItem={{
                          bg: "teal.600",
                          endIcon: <CheckIcon size="5" />,
                        }}
                        fontSize={9}
                        backgroundColor={"#fff"}
                        dropdownIcon={
                          <MaterialIcons name="arrow-drop-down"></MaterialIcons>
                        }
                        onValueChange={(itemValue) =>
                          handleChangeSelectItem(itemValue, "end")
                        }
                        isDisabled={typeTime === "month" ? true : false}
                      >
                        {quarterInYearEnd.map((item, index) => {
                          return (
                            <Select.Item
                              key={index}
                              label={item.label}
                              value={item.value}
                            />
                          );
                        })}
                      </Select>
                    </Box>
                  </HStack>
                </View>
                <View style={styles.radioButtonMonth}>
                  <Radio
                    colorScheme={"emerald"}
                    value="quarter"
                    isDisabled={typeFilter === "FinancialReport" ? true : false}
                    my={0}
                  >
                    Quý
                  </Radio>
                </View>
              </Box>
              <Box style={styles.box}>
                <View style={styles.boxRadioButton}>
                  <HStack
                    space={2}
                    justifyContent={"flex-end"}
                    alignItems={"center"}
                    style={{
                      width: "100%",
                      maxHeight: 30,
                      position: "relative",
                      marginTop: "12%",
                      paddingRight: 10,
                    }}
                  >
                    <Box style={{ width: "8%" }}>
                      <Text>Từ:</Text>
                    </Box>
                    <Box style={{ width: "28%" }}>
                      <Select
                        selectedValue={startMonth}
                        height="100%"
                        _selectedItem={{
                          bg: "teal.600",
                          endIcon: <CheckIcon size="5" />,
                        }}
                        fontSize={9}
                        backgroundColor={"#fff"}
                        dropdownIcon={
                          <MaterialIcons name="arrow-drop-down"></MaterialIcons>
                        }
                        onValueChange={(itemValue) => setStartMonth(itemValue)}
                        isDisabled={typeTime === "month" ? false : true}
                      >
                        {monthInYear.map((item, index) => {
                          return (
                            <Select.Item
                              key={index}
                              label={item.label}
                              value={item.value}
                            />
                          );
                        })}
                      </Select>
                    </Box>
                    <Box style={{ width: "11%" }}>
                      <Text>Đến:</Text>
                    </Box>
                    <Box style={{ width: "28%" }}>
                      <Select
                        selectedValue={endMonth}
                        minWidth="70"
                        height="100%"
                        _selectedItem={{
                          bg: "teal.600",
                          endIcon: <CheckIcon size="5" />,
                        }}
                        backgroundColor={"#fff"}
                        dropdownIcon={
                          <MaterialIcons name="arrow-drop-down"></MaterialIcons>
                        }
                        fontSize={9}
                        onValueChange={(itemValue) => setEndMonth(itemValue)}
                        isDisabled={typeTime === "month" ? false : true}
                      >
                        {monthInYear
                          .slice(monthInYear.findIndex(findItem))
                          .map((item, index) => {
                            return (
                              <Select.Item
                                key={index}
                                label={item.label}
                                value={item.value}
                              />
                            );
                          })}
                      </Select>
                    </Box>
                  </HStack>
                </View>
                <View style={styles.radioButtonMonth}>
                  <Radio colorScheme={"emerald"} value="month" my={1}>
                    Tháng
                  </Radio>
                </View>
              </Box>
            </Radio.Group>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 10,
                width: "100%",
              }}
            >
              <Button onPress={() => handleSubmit(typeFilter)}>Tìm kiếm</Button>
            </View>
          </Container>
        </KeyboardAvoidingView>
      </View>
    </AutocompleteDropdownContextProvider>
  );
}
const styles = StyleSheet.create({
  formFilter: {
    backgroundColor: "#DADADA",
    width: "100%",
    height: heightOfScreen * (heightOfScreen > 650 ? 0.55 : 0.6),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  containerFilter: {
    marginTop: 20,
    left: "10%",
    position: "relative",
  },
  groupButton: {
    marginLeft: 20,
  },
  radioButtonYearQuarter: {
    marginTop: 10,
    marginLeft: 8,
  },
  radioButtonMonth: {
    position: "absolute",
    backgroundColor: "#DADADA",
    marginLeft: 10,
    paddingHorizontal: 5,
  },
  box: {
    marginTop: 10,
  },
  boxRadioButton: {
    marginTop: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#099087",
    width: widthOfScreen * 0.8,
    height: 85,
    position: "relative",
  },
});

export default FilterPage;
