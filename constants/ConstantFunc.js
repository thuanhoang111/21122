//function get name in listName with code from Api return
import moment from "moment";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const titleError = "Không tìm thấy mã đúng với yêu cầu";
/**
 * function to convert number to unit money VND (String)
 * @param {number} value -number of characters in the number (1,2,3)
 */
export const convertNumberToStringVND = (value) => {
  switch (value) {
    case (1, 2, 3):
      return "Đồng";
    case (4, 5, 6):
      return "Nghìn";
    case (7, 8, 9):
      return "Triệu";
    case (10, 11, 12):
      return "Tỷ";

    default:
      return "_";
  }
};
/**
 * function to get title based on code
 * @param {*} listNameArray-List to get names
 * @param {String} code
 * @returns
 */
export const handleGetTitleWithCode = (listNameArray, code) => {
  const infoTitle = listNameArray.find((item) => item.code === code);
  return infoTitle && infoTitle.title ? infoTitle.title : titleError;
};
/**
 * function to reformat numbers
 * @param {Number} item-number needs editing
 */
export const formatMoney = (item) => {
  return `${item.value.toFixed(1)}`;
};
/**
 * function to convert number to percentage
 * @param {Number} total-total number
 * @param {Number} value-value to be converted
 * @param {String} type-datatypes(String,number)
 */
export const convertPercent = (total, value, type) => {
  const percent = ((value / total) * 100).toFixed(1);
  return type === "String" ? `${percent}%` : Number.parseFloat(percent);
};
/**
 * function compact number to string with unit
 * @param {Number} number-number to compact
 */
export const compactMoneyToString = (number) => {
  const curNumber = Math.abs(number);
  let valueReturn = "";
  if (curNumber === 0) {
    valueReturn = `${curNumber} đ`;
  } else if (!curNumber) {
    valueReturn = "---";
  } else if (Math.round(curNumber / 1000000000) > 0) {
    valueReturn = `${(curNumber / 1000000000).toFixed(2)} Ty`;
  } else if (Math.round(curNumber / 1000000) > 0) {
    valueReturn = `${(curNumber / 1000000).toFixed(2)} Tr`;
  } else if (Math.round(curNumber / 1000) > 0) {
    valueReturn = `${(curNumber / 1000).toFixed(2)} Ng`;
  } else {
    valueReturn = `${curNumber.toFixed(2)} đ`;
  }
  return number < 0 ? "-" + valueReturn : valueReturn;
};
/**
 * @param {Number} number-number to be shortened
 * @param {*} compactMoney-numbers used for shortening
 */
export const compactMoney = (number, compactMoney, numberAfterComma) => {
  return shortenNumber(number / compactMoney, numberAfterComma);
};
/**
 * shorten decimal numbers
 * @param {Number} number-number to be shortened
 * @param {Number} numAfterDPoint-number after comma
 */
export const shortenNumber = (number, numAfterDPoint) => {
  // Use toFixed to round the number to 2 decimal places and convert it to a string
  // Convert the number to a string
  var numberString = number.toString();

  // Find the index of the decimal point
  var decimalIndex = numberString.indexOf(".");

  // If the decimal point is found, keep only the first two digits after it
  if (decimalIndex !== -1) {
    var shortenedString = numberString.substring(
      0,
      decimalIndex + numAfterDPoint + 1
    );
    return parseFloat(shortenedString);
  }

  return number;
};
/**
 * format number to money
 * @param {Number} money-number to be format
 */
export const formatMoneyToVN = (money, unit) => {
  if (unit) {
    return money
      ? `${new Intl.NumberFormat("en-US").format(money)} ${unit}`
      : `0 ${unit}`;
  } else {
    return money ? new Intl.NumberFormat("en-US").format(money) : 0;
  }
};
/**
 * convert DateTime to String
 * @param {DateTime} dataTime
 * @param {String} formatString -type to format (DD/MM/yyyy)
 */
export const convertDateTimeToString = (dataTime, formatString) => {
  return moment(dataTime).format(formatString);
};
/**
 * convert String to DateTime
 * @param {*} value
 * @param {*} formatString -type to format (DD/MM/yyyy)
 */
export const convertStringToDateTime = (value, formatString) => {
  var dateMomentObject = moment(value + ",07:00:00", formatString + "hh:mm:ss"); // 1st argument - string, 2nd argument - format
  return dateMomentObject.toDate();
};
/**
 *
 * @param {Date} date
 * @param {Function} onChange
 */
export const showDatePickerAndroid = (date, onChange, year) => {
  DateTimePickerAndroid.open({
    // maximumDate: new Date(year, 11, 31),
    // minimumDate: new Date(year, 12, 1),
    value: date,
    onChange: (item) => {
      onChange(new Date(item.nativeEvent.timestamp));
    },
    mode: "date",
  });
};
