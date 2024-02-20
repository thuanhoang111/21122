import { createContext, useEffect, useLayoutEffect, useState } from "react";
import { StoreInfoUser } from "../constants/API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useObjectState, useToggle } from "@uidotdev/usehooks";
import { Platform } from "react-native";
import { StatusBar } from "native-base";
import { primaryColor } from "../constants/ConstantStyle";
const MainContext = createContext();
function MainProvider({ children }) {
  const [dataUser, setDataUser] = useState();
  const [inforFilter, setInforFilter] = useObjectState({});
  const [isLoading, setIsLoading] = useToggle(false);
  const getUserID = async () => {
    try {
      const infoUserGet = await AsyncStorage.getItem(StoreInfoUser);
      let jsonUser = JSON.parse(infoUserGet);
      setDataUser(jsonUser.UserInfo);
    } catch (error) {}
  };
  useLayoutEffect(() => {
    getUserID();
  }, []);
  const isIos = Platform.OS === "ios";
  return (
    dataUser && (
      <MainContext.Provider
        value={{
          dataUser: dataUser,
          onChangeUser: setDataUser,
          lastPermissionYear:
            dataUser &&
            dataUser.permission[dataUser.permission.length - 1].year,
          inforFilter,
          onChangeInforFilter: setInforFilter,
          isLoading,
          onChangeLoading: setIsLoading,
          isIos: isIos,
        }}
      >
        <StatusBar barStyle={"dark-content"} backgroundColor={primaryColor} />
        {children}
      </MainContext.Provider>
    )
  );
}

export { MainContext, MainProvider };
