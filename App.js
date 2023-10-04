import "react-native-gesture-handler";
import SignInScreen from "./screens/SignInScreen";
import MainTabScreen from "./screens/MainTabScreen";
import { AuthContext } from "./components/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StoreInfoUser } from "./constants/API";
import { NativeBaseProvider } from "native-base";
import { LogBox } from "react-native";
import axios from "axios";
import { Alert } from "react-native";
import * as Notifications from "expo-notifications";
export default function App() {
  LogBox.ignoreLogs(["Asyncstorage: ..."]); // Ignore log notification by message
  LogBox.ignoreAllLogs(); //Ignore all log notifications

  const initialLoginState = {
    isLoading: true,
    userID: null,
    userToken: null,
  };
  Notifications.getExpoPushTokenAsync({
    projectId: "ae27f2dd-0784-43e9-8346-4e96cce571fd",
  }).then((data) => {
    console.log(data);
  });
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  // Second, call the method

  Notifications.scheduleNotificationAsync({
    content: {
      title: "Thông báo nhận thưởng💝",
      body: "Chúc mừng bạn đã nhận được phần thưởng 💞của chương trình 🍑🍑🍑🐯",
      data: { data: "goes here" },
    },
    trigger: null,
  });
  const changeTypeLogout = async (userId) => {
    await axios
      .post("http://192.168.90.84:1375/api/User/Logout", {
        userID: userId,
      })
      .then((response) => {
        console.log(response.data);
        Alert.alert("Thông báo", response.data, [{ text: "Ok" }]);
        AsyncStorage.removeItem(StoreInfoUser);
      });
  };

  const authContext = React.useMemo(() => ({
    signIn: async (foundUser) => {
      const userToken = "token123";
      const userID = foundUser.id;

      try {
        // await AsyncStorage.setItem('userID', userID)
        await AsyncStorage.setItem(StoreInfoUser, JSON.stringify(foundUser));
      } catch (e) {
        console.log(e);
      }
      // Kích hoạt action
      dispatch({ type: "LOGIN", id: userID, token: userToken });
    },

    signOut: async (userId) => {
      try {
        // AsyncStorage.removeItem(StoreInfoUser);
        changeTypeLogout(userId);
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: "LOGOUT" });
    },
  }));

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...prevState,
          userID: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          userID: null,
          userToken: null,
          isLoading: false,
        };
      case "REGISTER":
        return {
          ...prevState,
          userID: action.id,
          userToken: action.token,
          isLoading: false,
        };
      default:
        return {
          ...prevState,
          userID: null,
          userToken: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState
  );

  useEffect(() => {
    setTimeout(async () => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem("userToken");
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: "RETRIEVE_TOKEN", token: userToken });
    }, 1000);
  }, []);

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <NativeBaseProvider>
          {loginState.userID === null ? (
            <SignInScreen></SignInScreen>
          ) : (
            <MainTabScreen></MainTabScreen>
          )}
        </NativeBaseProvider>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
