import {
  FormControl,
  Input,
  Select,
  CheckIcon,
  WarningOutlineIcon,
} from "native-base";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dialog, Portal, Provider, Button } from "react-native-paper";
import moment from "moment";
import { KeyboardAvoidingView, Platform } from "react-native";
/**
 *
 * @param {Boolean}  isShowDialog
 * @param {Function}  setIsShowDialog
 * @param {ArrayList}  inforOfField
 * @param {ArrayList}  inforUser
 * @param {Function}  setInforUser
 * @returns Display dialog based on the information the user selects
 */
function DialogInfor({
  isShowDialog,
  setIsShowDialog,
  inforOfField,
  inforUser,
  setInforUser,
}) {
  const [valueInput, setValueInput] = useState("");
  const currentDate = new Date();
  const [showCalendar, setShowCalendar] = useState(false);
  /**
   * Author:ThuanHoang 15/06/2023
   * function submit infor user
   */
  const submitDialog = () => {
    if (typeof valueInput !== "number" ? valueInput.trim() != "" : true) {
      inforUser[inforOfField.field] = valueInput;
      setInforUser(inforUser);
    }
    setIsShowDialog(false);
  };
  /**
   * Author:ThuanHoang 15/06/2023
   * Hidden Dialog
   */
  const hideDialog = () => {
    setIsShowDialog(false);
  };
  /**
   * Author:ThuanHoang 15/06/2023
   * Function handle change value with Date dialog
   * @param {Date} selectedDate
   */
  const onChange = (selectedDate) => {
    const currentDate = selectedDate;
    inforUser[inforOfField.field] = moment(currentDate).format("DD/MM/yyyy");
    setInforUser(inforUser);
    setIsShowDialog(false);
  };

  useEffect(() => {
    if (inforOfField.field.includes("Day")) {
      setShowCalendar(true);
    } else {
      setShowCalendar(false);
    }
  }, [inforOfField.title]);
  return showCalendar ? (
    <Dialog visible={showCalendar} onDismiss={hideDialog}>
      <DateTimePicker
        testID="dateTimePicker"
        value={currentDate}
        mode={"date"}
        is24Hour={true}
        onChange={Platform.OS !== "ios" && onChange}
        display={Platform.OS === "ios" ? "spinner" : "calendar"}
        locale="vi"
      />
      {Platform.OS === "ios" && (
        <Dialog.Actions>
          <Button onPress={() => onChange()}>Xác nhận</Button>
        </Dialog.Actions>
      )}
    </Dialog>
  ) : (
    <Provider>
      <Portal>
        <Dialog
          visible={isShowDialog}
          onDismiss={hideDialog}
          style={{ width: "87%", top: 50, position: "absolute" }}
        >
          <Dialog.Title>Chỉnh sửa thông tin Người dùng </Dialog.Title>

          <Dialog.Content>
            <FormControl>
              <FormControl.Label>{inforOfField.title}</FormControl.Label>
              {inforOfField.field !== "label" ? (
                <>
                  <Input
                    onChangeText={(e) => setValueInput(e)}
                    placeholder={`Nhập thông tin ${inforOfField.title}`}
                  ></Input>
                </>
              ) : (
                <Select
                  accessibilityLabel="Vui lòng chọn chức vụ"
                  placeholder="Vui lòng chọn chức vụ"
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  mt="1"
                  w="100%"
                  onValueChange={(e) => setValueInput(e)}
                >
                  <Select.Item label="Kế toán" value={4} />
                  <Select.Item label="Giám đốc" value={7} />
                </Select>
              )}
            </FormControl>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => submitDialog()}>Xác nhận</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Provider>
  );
}

export default DialogInfor;
