import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { createContext, useState, useEffect } from "react";
import { StoreInfoUser } from "../../constants/API";

const InforUserContext = createContext();
function InforUserProvider({ children }) {
  const initialInfoUser = {
    uni_k_code: Number,
    userID: "",
    userName: "",
    startDay: "",
    endDay: "",
    label: "",
    address: "",
    province: "",
    cooperativeName: "",
  };
  const [isUpdate, setIsUpdate] = useState(false);
  const [inforUser, setInforUser] = useState(initialInfoUser);
  // Function get data in Storage
  const getUserID = async () => {
    try {
      const infoUserGet = await AsyncStorage.getItem(StoreInfoUser);
      let jsonUser = JSON.parse(infoUserGet);
      setInforUser({
        ...inforUser,
        uni_k_code: jsonUser.UserInfo.uni_k_code,
        userID: jsonUser.UserInfo.id,
        userName: jsonUser.UserInfo.name,
        startDay: moment(jsonUser.UserInfo.registtime).format("DD/MM/yyyy"),
        endDay: moment(jsonUser.UserInfo.endtime).format("DD/MM/yyyy"),
        label: jsonUser.UserInfo.type,
        address: jsonUser.KanriInfo.Table[0].adres1,
        province: jsonUser.BranchInfo.Table[0].name,
        cooperativeName: jsonUser.KanriInfo.Table[0].name,
      });
      setIsUpdate(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserID();
  }, [isUpdate]);
  return (
    <InforUserContext.Provider
      value={{
        onUpdate: setIsUpdate,
        inforUser: inforUser,
      }}
    >
      {children}
    </InforUserContext.Provider>
  );
}

export { InforUserContext, InforUserProvider };
