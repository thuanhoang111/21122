import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InfoScreen from "./InfoScreen";
import MenuScreen from "./MenuScreen";
import CostAnalysis from "./CostAnalysis/CostAnalysis";
import FinancialReport from "./FinancialReport/FinancialReport";
import { Image } from "react-native";
import FilterPage from "./FilterPage/FilterPage";
import { StoreInfoUser } from "../constants/API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BudgetSituation_2 from "./BudgetSituation/BudgetSituation_2";
import ProfitAnalysis from "./ProfitAnalysis/ProfitAnalysis";
import RevenueAnalysis from "./RevenueAnalysis/RevenueAnalysis";
import CashBookMoney from "./CashBookMoney/CashBookMoney";
import CashBookMoneyDetail from "./CashBookMoney/CashBookMoneyDetail";
import { Toast } from "native-base";
import BankDepositBook from "./BankDepositBook/BankDepositBook";
import BankDepositBookDetail from "./BankDepositBook/BankDepositBookDetail";
import IOInventory from "./IOInventory/IOInventory";
import IOInventoryDetail from "./IOInventory/IOInventoryDetail";
import DebtTracking from "./DebtTracking/DebtTracking";

const Stack = createNativeStackNavigator();
const HomeScreen = ({ navigation }) => {
  const [dataUser, setDataUser] = useState();
  const getUserID = async () => {
    try {
      const infoUserGet = await AsyncStorage.getItem(StoreInfoUser);
      let jsonUser = JSON.parse(infoUserGet);
      setDataUser(jsonUser);
    } catch (error) {}
  };
  useEffect(() => {
    getUserID();
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Danh mục chức năng"
        component={MenuScreen}
        options={{
          headerStyle: {
            backgroundColor: "#009387",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontSize: 25,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="Báo cáo tài chính"
        component={FinancialReport}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Chi tiết phân tích chi phí"
        component={BudgetSituation_2}
        options={{
          headerStyle: {
            backgroundColor: "#009387",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontSize: 25,
          },
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Sổ quỹ tiền mặt"
        component={CashBookMoney}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Sổ tiền gửi ngân hàng"
        component={BankDepositBook}
        screenOptions={{ headerShown: false }}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Nhập xuất tồn"
        component={IOInventory}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Theo dõi công nợ"
        component={DebtTracking}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Phân tích lợi nhuận"
        component={ProfitAnalysis}
        options={{
          headerStyle: {
            backgroundColor: "#009387",
          },
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontSize: 25,
          },
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Phân tích chi phí"
        component={CostAnalysis}
        options={{
          headerStyle: {
            backgroundColor: "#009387",
          },
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontSize: 25,
          },
          headerBackTitleVisible: false,
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Tìm kiếm", {
                  typeFilter: "Chi tiết phân tích chi phí",
                  data: dataUser,
                })
              }
            >
              <View>
                <Image
                  style={{ width: 25, height: 25, tintColor: "#fff" }}
                  source={require("../assets/filter.png")}
                ></Image>
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Phân tích doanh thu"
        component={RevenueAnalysis}
        options={{
          headerStyle: {
            backgroundColor: "#009387",
          },
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontSize: 25,
          },
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Tìm kiếm"
        component={FilterPage}
        options={{
          headerStyle: {
            backgroundColor: "#009387",
          },
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontSize: 25,
          },
          headerBackTitleVisible: false,
        }}
      />
      {/* <Stack.Screen
        name="Lọc thông tin hóa đơn"
        component={FilterModalBill}
        options={{
          headerStyle: {
            backgroundColor: "#309ee7",
          },
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Hóa đơn"
        component={InvoiceScreen}
        options={{
          headerStyle: {
            backgroundColor: "#309ee7",
          },
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerBackTitleVisible: false,
        }}
      /> */}
      <Stack.Screen
        name="Thông tin"
        component={InfoScreen}
        options={{
          headerStyle: {
            backgroundColor: "#309ee7",
          },
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Chi Tiết Sổ Quỹ"
        component={CashBookMoneyDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Chi tiết sổ tiền gửi NH"
        component={BankDepositBookDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Chi tiết vật tư hàng hóa"
        component={IOInventoryDetail}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeScreen;
