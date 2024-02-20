import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InfoScreen from "./InfoScreen";
import MenuScreen from "./MenuScreen";
import CostAnalysis from "./CostAnalysis/CostAnalysis";
import FinancialReport from "./FinancialReport/FinancialReport";
import BudgetSituation_2 from "./BudgetSituation/BudgetSituation_2";
import ProfitAnalysis from "./ProfitAnalysis/ProfitAnalysis";
import RevenueAnalysis from "./RevenueAnalysis/RevenueAnalysis";
import CashBookMoney from "./CashBookMoney/CashBookMoney";
import CashBookMoneyDetail from "./CashBookMoney/CashBookMoneyDetail";
import IOInventory from "./IOInventory/IOInventory";
import IOInventoryDetail from "./IOInventory/IOInventoryDetail";
import DebtTracking from "./DebtTracking/DebtTracking";
import DebtTrackingDetail from "./DebtTracking/DebtTrackingDetail";
import BankDepositBook from "./BankDepositBook/BankDepositBook";
import BankDepositBookDetail from "./BankDepositBook/BankDepositBookDetail";
import { primaryColor } from "../constants/ConstantStyle";
const Stack = createNativeStackNavigator();
const HomeScreen = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Danh mục chức năng"
        component={MenuScreen}
        options={{
          headerStyle: {
            backgroundColor: primaryColor,
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
          headerShown: false,
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
        name="Nhập xuất tồn"
        component={IOInventory}
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
      <Stack.Screen
        name="Theo dõi công nợ"
        component={DebtTracking}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Chi tiết công nợ"
        component={DebtTrackingDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Theo dõi vay nợ"
        component={ProfitAnalysis}
        options={{
          headerStyle: {
            backgroundColor: primaryColor,
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
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Phân tích kinh doanh"
        component={RevenueAnalysis}
        options={{
          headerShown: false,
        }}
      />
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
        name="Chi tiết sổ quỹ"
        component={CashBookMoneyDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Sổ tiền gửi ngân hàng"
        component={BankDepositBook}
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
    </Stack.Navigator>
  );
};

export default HomeScreen;
