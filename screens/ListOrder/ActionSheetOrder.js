import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Actionsheet, Box, Center, Icon, Text } from "native-base";
import { Alert, ImageBackground } from "react-native";
import { Path } from "react-native-svg";
import SiwakeAPI from "../../API/SiwakeApi";
import { useState } from "react";
import { Invoice } from "../../model/StructInvoice";
function ActionSheetOrder({
  key,
  isOpen,
  onClose,
  orderId,
  infoUser,
  navigation,
}) {
  const [invoiceData, setInvoiceData] = useState(null);

  const CallAPISiwake = async (no) => {
    let responeSW;
    try {
      responeSW = await SiwakeAPI.getOnly(
        infoUser.uni_k_code,
        no,
        infoUser.agriCode,
        infoUser.loginYear,
        true
      );
    } catch (err) {
      responeSW = "";
    }
    return responeSW;
  };
  const DeleteOnRow = async (no) => {
    try {
      const response = await SiwakeAPI.delete(
        infoUser.uni_k_code,
        no,
        infoUser.agriCode,
        infoUser.loginYear
      );
      const result = JSON.parse(JSON.stringify(response));
      Alert.alert(
        "Thông báo",
        result.error === null
          ? "Xóa hóa đơn thành công"
          : `Lỗi: ${result.errorDescription}`
      );
    } catch (err) {
      alert("Không có được hóa đơn");
    }
    // GetListInvoice();
  };
  const EditOnRow = async (no) => {
    let product_arr = [];
    let siwakeMD = await CallAPISiwake(no);
    if (siwakeMD == "") {
      Alert.alert("Lỗi", "Hóa đơn không có trong hệ thống", [
        { text: "OK", onPress: () => {} },
      ]);
    }

    // Hàng hóa của hóa đơn
    let productData = siwakeMD.dshanghoa;
    if (productData.length > 0) {
      for (let i = 0; i < productData.length; i++) {
        product_arr.push({
          STT: productData[i].stt,
          product_name: productData[i].tenhanghoa,
          unit: productData[i].dvt,
          quantity: productData[i].soluong,
          price: productData[i].dongia,
          total: productData[i].thanhtien,
        });
      }
    }

    Invoice.MaHTX = infoUser.uni_k_code;
    Invoice.ProductModel = product_arr;
    Invoice.SiwakeModel.nguoimuahang = siwakeMD.nguoimuahang;
    Invoice.SiwakeModel.masothuebenmua = siwakeMD.masothuebenmua;
    Invoice.SiwakeModel.ngayhoadon = siwakeMD.ngayhoadon;
    Invoice.SiwakeModel.sohd = siwakeMD.sohd;
    Invoice.SiwakeModel.congtienhang = siwakeMD.congtienhang;
    Invoice.SiwakeModel.tienthueGTGT = siwakeMD.tienthueGTGT;
    Invoice.SiwakeModel.tongtienthanhtoan = siwakeMD.tongtienthanhtoan;
    Invoice.SiwakeModel.base64Image = siwakeMD.base64Image;
    Invoice.SiwakeModel.no_hiden = siwakeMD.No_Hiden;

    setInvoiceData(Invoice);

    navigation.navigate("Hóa đơn", {
      mode: "1",
      data: { Invoice },
      navigation: { navigation },
    });
  };
  return (
    <Center>
      <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
        <Actionsheet.Content>
          <Box w="100%" h={60} px={4} justifyContent="center">
            <Text
              fontSize="16"
              color="gray.500"
              _dark={{
                color: "gray.300",
              }}
            >
              Các thao tác
            </Text>
          </Box>
          <Actionsheet.Item
            startIcon={<Icon as={MaterialIcons} size="6" name="delete" />}
            onPress={() =>
              Alert.alert(
                "Xóa chứng từ",
                `Xác nhận xóa hóa đơn?`,
                [
                  { text: "Cancel", onPress: () => {} },
                  { text: "OK", onPress: () => DeleteOnRow(orderId) },
                ],
                { cancelable: false }
              )
            }
          >
            Xóa
          </Actionsheet.Item>
          <Actionsheet.Item
            startIcon={
              <Icon
                as={MaterialCommunityIcons}
                name="clipboard-edit-outline"
                size="6"
              />
            }
            onPress={() => EditOnRow(orderId)}
          >
            Chỉnh sửa
          </Actionsheet.Item>
          <Actionsheet.Item
            startIcon={
              <Icon viewBox="0 0 24 24" size="6" fill="none">
                <Path d="M12.0007 10.5862L16.9507 5.63623L18.3647 7.05023L13.4147 12.0002L18.3647 16.9502L16.9507 18.3642L12.0007 13.4142L7.05072 18.3642L5.63672 16.9502L10.5867 12.0002L5.63672 7.05023L7.05072 5.63623L12.0007 10.5862Z" />
              </Icon>
            }
            onPress={() => onClose()}
          >
            Thoát
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </Center>
  );
}

export default ActionSheetOrder;
