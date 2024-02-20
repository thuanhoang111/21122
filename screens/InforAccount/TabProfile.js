import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InfoScreen from "../InfoScreen";
import InforAccountScreen from "./InforAccountScreen";
import SettingScreen from "./SettingScreen";
import { InforUserProvider } from "./InforUserContext";
const Stack = createNativeStackNavigator();
function TabProfile({ navigation }) {
  return (
    <InforUserProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="Thông tin chính"
          component={InfoScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Thông tin tài khoản"
          component={InforAccountScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Thông tin cài đặt"
          component={SettingScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </InforUserProvider>
  );
}

export default TabProfile;
