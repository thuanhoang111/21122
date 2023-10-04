import React from "react";
import { View, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InfoScreen from "../InfoScreen";
import Icon from "react-native-vector-icons/FontAwesome5";
import InforAccountScreen from "./InforAccountScreen";
import SettingScreen from "./SettingScreen";
const Stack = createNativeStackNavigator();
function TabProfile({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Thông tin chính"
        component={InfoScreen}
        options={{
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleStyle: {
            fontSize: 20,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="Thông tin tài khoản"
        component={InforAccountScreen}
        options={{
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            fontSize: 20,
          },
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Thông tin cài đặt"
        component={SettingScreen}
        options={{
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            fontSize: 20,
          },
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default TabProfile;
