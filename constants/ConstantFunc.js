//function get name in listName with code from Api return
import moment from "moment";
import { unitNameInVN } from "./ConstantMain";
const titleError = "Không tìm thấy mã đúng với yêu cầu";
export const handleGetTitleWithCode = (listNameArray, code) => {
  const infoTitle = listNameArray.find((item) => item.code === code);
  return infoTitle.title ? infoTitle.title : titleError;
};
export const formatMoney = (item) => {
  return `${item.value.toFixed(1)}${unitNameInVN.million}`;
};
export const convertPercent = (total, value, type) => {
  const percent = ((value / total) * 100).toFixed(1);
  return type === "String" ? `${percent}%` : Number.parseFloat(percent);
};
export const compactMoney = (number) => {
  if (number === 0) {
    return number;
  } else if (Math.round(number / 1000000000) > 0) {
    return `${(number / 1000000000).toFixed(2)}Ty`;
  } else if (Math.round(number / 1000000) > 0) {
    return `${(number / 1000000).toFixed(2)}Tr`;
  } else if (Math.round(number / 1000) > 0) {
    return `${(number / 1000).toFixed(2)}Ng`;
  } else {
    return `${number.toFixed(2)}đ`;
  }
};
export const formatMoneyToVN = (money) => {
  return money
    ? money.toLocaleString("vi-VN", {
        maximumFractionDigits: 0,
        style: "currency",
        currency: "VND",
      })
    : `0đ`;
};
export const convertDateTimeToString = (dataTime, formatString) => {
  return moment(dataTime).format(formatString);
};
export const convertStringToDateTime = (value, formatString) => {
  var dateMomentObject = moment(value, formatString).add(1, "days"); // 1st argument - string, 2nd argument - format
  return dateMomentObject.toDate();
};
