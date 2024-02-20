import "react-native-gesture-handler";
import SignInScreen from "./screens/SignInScreen";
import MainTabScreen from "./screens/MainTabScreen";
import { AuthContext } from "./components/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StoreInfoUser } from "./constants/API";
import { NativeBaseProvider } from "native-base";
import { LogBox } from "react-native";
import * as Post from "./API/service/Post";
import { enableFreeze, enableScreens } from "react-native-screens";
import { Alert } from "react-native";
import * as Notifications from "expo-notifications";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Updates from "expo-updates";
export default function App() {
  enableScreens(false);
  enableFreeze(false);
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  LogBox.ignoreLogs(["Asyncstorage: ..."]); // Ignore log notification by message
  LogBox.ignoreAllLogs(); //Ignore all log notifications
  const initialLoginState = {
    isLoading: true,
    userID: null,
    userToken: null,
  };
  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // const renderCount = useRenderCount();
  // Notifications.getExpoPushTokenAsync({
  //   projectId: "ae27f2dd-0784-43e9-8346-4e96cce571fd",
  // }).then((data) => {
  //   console.log(data);
  // });
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  // Second, call the method

  // Notifications.scheduleNotificationAsync({
  //   content: {
  //     title: "Thông báo nhận thưởng💝",
  //     body: "Chúc mừng bạn đã nhận được phần thưởng 💞của chương trình 🍑🍑🍑🐯",
  //     data: { data: "goes here" },
  //   },
  //   trigger: null,
  // });

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const changeTypeLogout = async (userId) => {
    await Post.handlePostWithBody("User/Logout", {
      userID: userId,
    }).then((data) => {
      Alert.alert("Thông báo", data, [{ text: "Ok" }]);
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
          userID: action.id,
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
  const checkLogin = async () => {
    let userToken;
    userToken = null;
    let jsonUser = null;
    try {
      userToken = await AsyncStorage.getItem("userToken");
      const S_User = await AsyncStorage.getItem(StoreInfoUser);
      jsonUser = JSON.parse(S_User);
    } catch (e) {
      console.log(e);
    }
    dispatch({
      type: "RETRIEVE_TOKEN",
      token: userToken,
      id: jsonUser.UserInfo.id,
    });
  };
  useLayoutEffect(() => {
    // onFetchUpdateAsync();
    // setIsLoading(false);
    checkLogin();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <NativeBaseProvider>
            <SafeAreaProvider>
              {loginState.userID !== null ? (
                <MainTabScreen></MainTabScreen>
              ) : (
                <SignInScreen></SignInScreen>
              )}
            </SafeAreaProvider>
          </NativeBaseProvider>
        </NavigationContainer>
      </AuthContext.Provider>
    </GestureHandlerRootView>
  );
}
