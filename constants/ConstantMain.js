import moment from "moment";
import { Dimensions } from "react-native";
//width of mobile device
export const widthOfScreen = Dimensions.get("window").width;
//height of mobile device
export const heightOfScreen = Dimensions.get("window").height;
// unit money
export const unitNameInVN = {
  million: "Tr",
};
export const currentYear = moment().format("yyyy");
export const currentMonth = moment().format("M");
