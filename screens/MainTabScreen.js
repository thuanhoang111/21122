import React from "react";
import { Text, View, Button } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "./HomeScreen";
import ListInvoiceScreen from "./ListInvoiceScreen";
import InfoScreen from "./InfoScreen";
import TabProfile from "./InforAccount/TabProfile";

const Tab = createBottomTabNavigator();

const MainTabScreen = () => (
  <Tab.Navigator
    initialRouteName="Home"
    activeColor="#fff"
    screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
    // tabBarOptions={{
    //   keyboardHidesTabBar: true,
    // }}
  >
    <Tab.Screen
      name="Home"
      screenOption
      component={HomeScreen}
      options={{
        tabBarLabel: "Tổng Quan",
        tabBarColor: "#009387",
        tabBarIcon: ({ color }) => <Icon name="home" color={color} size={26} />,
      }}
    />
    <Tab.Screen
      name="Info"
      component={TabProfile}
      options={{
        tabBarLabel: "Thông tin",
        tabBarColor: "#1f65ff",
        tabBarIcon: ({ color }) => (
          <Icon name="user-alt" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
);
export default MainTabScreen;
