import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Button,
  TextInput,
  FlatList,
  LogBox,
  Alert,
  TouchableOpacity,
} from "react-native";
import { ItemRow } from "./ItemGrid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StoreInfoUser } from "../constants/API";
import Dialog, {
  DialogContent,
  DialogFooter,
  DialogButton,
  DialogTitle,
  SlideAnimation,
} from "react-native-popup-dialog";
import SiwakeAPI from "../API/SiwakeApi";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { Invoice } from "../model/StructInvoice";

LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(["componentWillReceiveProps"]);

const InvoiceScreen = ({ route }) => {
  const navigation = route.params.navigation.navigation;

  const siwakeRoute = route.params.data.Invoice.SiwakeModel;
  const productRoute = route.params.data.Invoice.ProductModel;

  const [status, setStatus] = useState({
    mode: route.params.mode,
    refresh: false,
    visibleDialog: false,
    idx: -1,
  });

  const [SiwakeModel, setdataSiwake] = useState(siwakeRoute);
  const [ProductModel, setProductModel] = useState(productRoute);
  // Biến tạm được sao chép từ ProductModel để edit
  const [ProductTemp, setProductTemp] = useState([...ProductModel]);

  /**
    Xử lý đăng ký hàng hóa mới
  **/
  const registDataProduct = () => {
    let temp_ProductModel = [...ProductTemp];

    temp_ProductModel.push({
      STT: temp_ProductModel.length + 1,
      product_name: "",
      unit: "",
      quantity: "",
      price: "",
      total: "",
    });

    let index = temp_ProductModel.length > 0 ? temp_ProductModel.length - 1 : 0;
    setProductTemp(temp_ProductModel);
    setStatus({
      ...status,
      visibleDialog: true,
      idx: index,
    });
  };

  /**
    Xử lý sửa hàng hóa
  **/
  const updateDataProduct = (val, id) => {
    setStatus({
      ...status,
      visibleDialog: val,
      idx: id,
    });
  };

  /**
    Xử lý cancel dialog
  **/
  const CancelUpdate = () => {
    setProductTemp([...ProductModel]);

    setStatus({
      ...status,
      visibleDialog: false,
      idx: -1,
    });
  };

  /**
     Khi thay đổi text của siwake
   **/
  const ChangeTextSiwake = (val, mode) => {
    let tienthanhtoan;

    switch (mode) {
      case 0:
        setdataSiwake({
          ...SiwakeModel,
          sohd: val,
        });
        break;
      case 1:
        setdataSiwake({
          ...SiwakeModel,
          nguoimuahang: val,
        });
        break;
      case 2:
        setdataSiwake({
          ...SiwakeModel,
          masothuebenmua: val,
        });
        break;
      case 3:
        setdataSiwake({
          ...SiwakeModel,
          ngayhoadon: val,
        });
        break;
      case 4:
        tienthanhtoan =
          parseFloat(val.replace(/,/g, "")) +
          parseFloat(SiwakeModel.congtienhang.replace(/,/g, ""));
        setdataSiwake({
          ...SiwakeModel,
          tienthueGTGT: NumberWithCommas(
            val.replace(/,/g, "").replace(/\./g, "")
          ),
          tongtienthanhtoan: NumberWithCommas(tienthanhtoan),
        });
        break;
      case 5:
        tienthanhtoan =
          parseFloat(val.replace(/,/g, "")) +
          parseFloat(SiwakeModel.tienthueGTGT.replace(/,/g, ""));
        setdataSiwake({
          ...SiwakeModel,
          congtienhang: NumberWithCommas(
            val.replace(/,/g, "").replace(/\./g, "")
          ),
          tongtienthanhtoan: NumberWithCommas(tienthanhtoan),
        });
        break;
    }
  };

  /**
    Khi thay đổi text trong dialog
  **/
  const ChangeTextProduct = (index, val, mode) => {
    // Thao tác chỉnh sửa trên product tạm
    let temp_ProductModel = [...ProductTemp];
    let product = { ...temp_ProductModel[index] };

    // Các mode chỉnh sửa
    switch (mode) {
      // Tên hàng
      case 1:
        product.product_name = val;
        break;
      // Đơn vị tính
      case 2:
        product.unit = val;
        break;
      // Số lượng
      case 3:
        product.quantity = val;
        product.total = val * product.price;
        break;
      // Đơn giá
      case 4:
        product.price = val;
        product.total = val * product.quantity;
        break;
    }
    temp_ProductModel[index] = product;
    setProductTemp(temp_ProductModel);
  };

  /**
    Xử lý save dialog
  **/
  const HandleSaveDialog = () => {
    let temp_ProductModel = [...ProductTemp];
    let product = { ...temp_ProductModel[status.idx] };
    ProductModel[status.idx] = product;
    setProductModel(ProductModel);

    setStatus({
      ...status,
      refresh: true,
      visibleDialog: false,
    });
  };

  /**
    Xử lý xóa hàng hóa
  **/
  const deleteProduct = (stt) => {
    let temp_ProductModel = [...ProductTemp];
    debugger;
    var product = temp_ProductModel.find((p) => p.STT == stt.toString());
    let i = temp_ProductModel.indexOf(product);

    if (temp_ProductModel[i]) {
      temp_ProductModel.splice(i, 1);

      setProductTemp(temp_ProductModel);
      setProductModel(temp_ProductModel);
      setStatus({
        ...status,
        refresh: true,
      });
    }
  };

  /**
    Xử lý nút xác nhận để lưu chứng từ
  **/
  const HandleSubmit = async () => {
    const infoUserGet = await AsyncStorage.getItem(StoreInfoUser);
    let jsonUser = JSON.parse(infoUserGet);
    // Mã uni_k_code
    let userID = jsonUser.id;
    let uni_k_code = jsonUser.uni_k_code;

    // Kiểm tra số hóa đơn
    if (SiwakeModel.sohd == "") {
      Alert.alert("Thông báo", "Không bỏ trống số hóa đơn", [{ text: "Ok" }]);
      return;
    }
    // Kiểm tra thông tin người mua hàng
    if (SiwakeModel.nguoimuahang == "") {
      Alert.alert("Thông báo", "Không bỏ trống người mua hàng", [
        { text: "Ok" },
      ]);
      return;
    }
    // Kiểm tra mã số thuế
    if (SiwakeModel.masothuebenmua == "") {
      Alert.alert("Thông báo", "Không bỏ trống mã số thuế", [{ text: "Ok" }]);
      return;
    }
    // Kiểm tra thuế VAT
    if (SiwakeModel.tienthueGTGT == "") {
      Alert.alert("Thông báo", "Không bỏ trống tiền thuế VAT", [
        { text: "Ok" },
      ]);
      return;
    }
    // Kiểm tra tiền thanh toán
    if (SiwakeModel.tongtienthanhtoan == "") {
      Alert.alert("Thông báo", "Không bỏ trống tiền thanh toán", [
        { text: "Ok" },
      ]);
      return;
    }
    // Kiểm tra ngày
    var dateInvoice = moment(SiwakeModel.ngayhoadon, "DD/MM/YYYY", true);
    if (!dateInvoice.isValid()) {
      Alert.alert(
        "Ngày mua",
        "Vui lòng kiểm tra ngày mua theo định dạng dd/MM/yyyy",
        [{ text: "OK", onPress: () => {} }]
      );
      return;
    }

    var ngayhoadon = new Date(dateInvoice.toString());

    const SiwakeMobile = {
      uni_k_code: uni_k_code,
      image: SiwakeModel.base64Image,
      number_receipt: SiwakeModel.sohd,
      customer_name: SiwakeModel.nguoimuahang,
      customer_taxcode: SiwakeModel.masothuebenmua,
      purchase_date: ngayhoadon,
      money_tax: NumberWithCommas(
        SiwakeModel.tienthueGTGT.replace(/,/g, "").replace(/\./g, "")
      ),
      money_total: NumberWithCommas(
        SiwakeModel.congtienhang.replace(/,/g, "").replace(/\./g, "")
      ),
      money_payment: NumberWithCommas(
        SiwakeModel.tongtienthanhtoan.replace(/,/g, "").replace(/\./g, "")
      ),
      no_hiden: SiwakeModel.no_hiden,
    };

    const result = await SiwakeUpdate(
      uni_k_code,
      userID,
      SiwakeMobile.no_hiden,
      SiwakeMobile,
      ProductModel,
      status.mode
    );

    result.error === null
      ? Alert.alert("Thông báo", "Cập nhật thành công", [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("Danh sách hóa đơn", { load: false }),
          },
        ])
      : Alert.alert("Lỗi", "Cập nhật thất bại" + `${result.errorDescription}`, [
          { text: "OK", onPress: () => {} },
        ]);
  };

  const SiwakeUpdate = async (
    uni_k_code,
    userID,
    no,
    SiwakeMobile,
    ProductModel,
    mode
  ) => {
    try {
      let siwakeResponse;
      // Thêm mới
      if (mode == "0") {
        siwakeResponse = await SiwakeAPI.add(
          userID,
          SiwakeMobile,
          ProductModel
        );
      }
      // chỉnh sửa
      else {
        siwakeResponse = await SiwakeAPI.update(
          uni_k_code,
          userID,
          no,
          SiwakeMobile,
          ProductModel
        );
      }

      const result = JSON.parse(JSON.stringify(siwakeResponse));
      return result;
    } catch (err) {
      alert("update failed");
    }
  };

  const NumberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Render ra ItemRow trong FlatList
  const renderItem = (item) => (
    <ItemRow
      itemRow={item}
      updateData={updateDataProduct}
      delete={deleteProduct}
    />
  );

  return (
    <SafeAreaView>
      <View style={{ height: 20 }}></View>
      <View>
        {/*Begin of dialog*/}
        <Dialog
          visible={status.visibleDialog}
          onTouchOutside={() => {
            setStatus({
              ...status,
              visibleDialog: true,
            });
          }}
          dialogTitle={
            status.idx == -1 ? (
              <DialogTitle title="Thêm thông tin hàng hóa" />
            ) : (
              <DialogTitle title="Sửa thông tin hàng hóa" />
            )
          }
          dialogAnimation={
            new SlideAnimation({
              slideFrom: "bottom",
            })
          }
          footer={
            <DialogFooter>
              <DialogButton text="Hủy bỏ" onPress={CancelUpdate} />
              <DialogButton text="Lưu" onPress={HandleSaveDialog} />
            </DialogFooter>
          }
        >
          <DialogContent>
            <View style={{ height: 30 }}></View>
            <View style={InvoiceScreen_Style.containRow}>
              <View style={{ flex: 2 }}>
                <Text style={InvoiceScreen_Style.labelItem}>
                  Tên hàng hóa:{" "}
                </Text>
              </View>
              <View style={{ flex: 3 }}>
                <TextInput
                  style={InvoiceScreen_Style.input}
                  placeholder="Nhập tên mặt hàng"
                  defaultValue={
                    status.idx >= 0 ? ProductTemp[status.idx].product_name : ""
                  }
                  onChangeText={(val) => {
                    ChangeTextProduct(status.idx, val, 1);
                  }}
                  maxLength={20}
                ></TextInput>
              </View>
            </View>
            <View style={InvoiceScreen_Style.containRow}>
              <View style={{ flex: 2 }}>
                <Text style={InvoiceScreen_Style.labelItem}>Đơn vị tính:</Text>
              </View>
              <View style={{ flex: 3 }}>
                <TextInput
                  style={InvoiceScreen_Style.input}
                  placeholder="Nhập đơn vị tính"
                  defaultValue={
                    status.idx >= 0 ? ProductTemp[status.idx].unit : ""
                  }
                  onChangeText={(val) => ChangeTextProduct(status.idx, val, 2)}
                  maxLength={10}
                ></TextInput>
              </View>
            </View>
            <View style={InvoiceScreen_Style.containRow}>
              <View style={{ flex: 2 }}>
                <Text style={InvoiceScreen_Style.labelItem}>Số lượng:</Text>
              </View>
              <View style={{ flex: 3 }}>
                <TextInput
                  style={InvoiceScreen_Style.input}
                  keyboardType="numeric"
                  placeholder="Nhập số lượng"
                  defaultValue={
                    status.idx >= 0 ? ProductTemp[status.idx].quantity : ""
                  }
                  onChangeText={(val) => ChangeTextProduct(status.idx, val, 3)}
                  maxLength={10}
                ></TextInput>
              </View>
            </View>
            <View style={InvoiceScreen_Style.containRow}>
              <View style={{ flex: 2 }}>
                <Text style={InvoiceScreen_Style.labelItem}>Đơn giá:</Text>
              </View>
              <View style={{ flex: 3 }}>
                <TextInput
                  style={InvoiceScreen_Style.input}
                  placeholder="Nhập đơn giá"
                  keyboardType="numeric"
                  defaultValue={
                    status.idx >= 0 ? ProductTemp[status.idx].price : ""
                  }
                  onChangeText={(val) => ChangeTextProduct(status.idx, val, 4)}
                  maxLength={10}
                ></TextInput>
              </View>
            </View>
            <View style={InvoiceScreen_Style.containRow}>
              <View style={{ flex: 1 }}>
                <Text style={InvoiceScreen_Style.labelItem}>Thành tiền:</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text style={InvoiceScreen_Style.labelItem}>
                  {status.idx >= 0
                    ? NumberWithCommas(
                        ProductTemp[status.idx].total
                          .toString()
                          .replace(/,/g, "")
                          .replace(/\./g, "")
                      )
                    : ""}
                </Text>
              </View>
            </View>
          </DialogContent>
        </Dialog>
        {/*End of dialog*/}

        <View style={InvoiceScreen_Style.body}>
          <View style={[InvoiceScreen_Style.headerContainer, { flex: 3 }]}>
            <ScrollView>
              <View
                style={[
                  InvoiceScreen_Style.containRow,
                  { backgroundColor: "White" },
                ]}
              >
                <View style={InvoiceScreen_Style.titleContainer}>
                  <Text style={InvoiceScreen_Style.title}>
                    Hóa Đơn
                    {/* {
                      (status.mode == 0
                        ? 'Hóa Đơn'
                        : 'Sửa' + ' hóa đơn ')
                    } */}
                  </Text>
                </View>
                <View style={InvoiceScreen_Style.confirmButton}>
                  <Button title="Xác nhận" onPress={HandleSubmit}></Button>
                </View>
              </View>

              <View style={InvoiceScreen_Style.containRow}>
                <View style={{ flex: 2 }}>
                  <Text style={InvoiceScreen_Style.labelItem}>Số hóa đơn:</Text>
                </View>
                <View style={{ flex: 3 }}>
                  <TextInput
                    style={InvoiceScreen_Style.input}
                    placeholder="Tối đa 30 ký tự"
                    maxLength={10}
                    onChangeText={(val) => ChangeTextSiwake(val, 0)}
                    value={SiwakeModel.sohd}
                  ></TextInput>
                </View>
              </View>

              <View style={InvoiceScreen_Style.containRow}>
                <View style={{ flex: 2 }}>
                  <Text style={InvoiceScreen_Style.labelItem}>
                    Tên khách hàng:
                  </Text>
                </View>
                <View style={{ flex: 3 }}>
                  <TextInput
                    style={InvoiceScreen_Style.input}
                    placeholder="Tối đa 30 ký tự"
                    maxLength={30}
                    onChangeText={(val) => ChangeTextSiwake(val, 1)}
                    value={SiwakeModel.nguoimuahang}
                  ></TextInput>
                </View>
              </View>

              <View style={InvoiceScreen_Style.containRow}>
                <View style={{ flex: 2 }}>
                  <Text style={InvoiceScreen_Style.labelItem}>Mã số thuế:</Text>
                </View>
                <View style={{ flex: 3 }}>
                  <TextInput
                    style={InvoiceScreen_Style.input}
                    placeholder="Mã số thuế"
                    maxLength={10}
                    onChangeText={(val) => ChangeTextSiwake(val, 2)}
                    value={SiwakeModel.masothuebenmua}
                  ></TextInput>
                </View>
              </View>

              <View style={InvoiceScreen_Style.containRow}>
                <View style={{ flex: 2 }}>
                  <Text style={InvoiceScreen_Style.labelItem}>Ngày mua:</Text>
                </View>
                <View style={{ flex: 3 }}>
                  <TextInput
                    style={InvoiceScreen_Style.input}
                    placeholder="Ngày mua hàng"
                    maxLength={10}
                    onChangeText={(val) => ChangeTextSiwake(val, 3)}
                    value={SiwakeModel.ngayhoadon}
                  ></TextInput>
                </View>
              </View>

              <View style={InvoiceScreen_Style.containRow}>
                <View style={{ flex: 2 }}>
                  <Text style={InvoiceScreen_Style.labelItem}>Thuế VAT:</Text>
                </View>
                <View style={{ flex: 3 }}>
                  <TextInput
                    style={InvoiceScreen_Style.input_money}
                    onChangeText={(val) => ChangeTextSiwake(val, 4)}
                    value={SiwakeModel.tienthueGTGT}
                    keyboardType="numeric"
                  ></TextInput>
                </View>
              </View>

              <View style={InvoiceScreen_Style.containRow}>
                <View style={{ flex: 2 }}>
                  <Text style={InvoiceScreen_Style.labelItem}>Tiền hàng:</Text>
                </View>
                <View style={{ flex: 3 }}>
                  <TextInput
                    style={InvoiceScreen_Style.input_money}
                    onChangeText={(val) => ChangeTextSiwake(val, 5)}
                    value={SiwakeModel.congtienhang}
                    keyboardType="numeric"
                  ></TextInput>
                </View>
              </View>

              <View style={InvoiceScreen_Style.containRow}>
                <View style={{ flex: 2 }}>
                  <Text style={InvoiceScreen_Style.labelItem}>
                    Tiền thanh toán:
                  </Text>
                </View>
                <View style={{ flex: 3 }}>
                  <TextInput
                    style={InvoiceScreen_Style.input_money}
                    onChangeText={(val) => ChangeTextSiwake(val, 6)}
                    value={SiwakeModel.tongtienthanhtoan}
                    keyboardType="numeric"
                  ></TextInput>
                </View>
              </View>
            </ScrollView>
          </View>
          <View style={[InvoiceScreen_Style.headerContainer, { flex: 6 }]}>
            <View>
              <Text style={InvoiceScreen_Style.listViewHeader}>
                Danh sách sản phẩm
              </Text>
            </View>
            <View
              style={{ alignItems: "flex-end", marginRight: 20, color: "#fff" }}
            >
              <TouchableOpacity
                onPress={() => {
                  registDataProduct();
                }}
                style={InvoiceScreen_Style.appButtonContainer}
              >
                <Text style={InvoiceScreen_Style.appButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <FlatList
                data={ProductModel}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={(item) => item.STT}
                extraData={status.refresh}
              />
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default InvoiceScreen;

const width = Dimensions.get("window").width - 20;
export const InvoiceScreen_Style = StyleSheet.create({
  body: {
    position: "relative",
    minHeight: Dimensions.get("window").height,
  },
  title: {
    fontWeight: "bold",
    color: "#41C8FF",
    fontSize: 20,
  },
  confirmButton: {
    width: (width * 25) / 100,
  },
  input: {
    flex: 1,
    height: 30,
    borderWidth: 1,
    paddingLeft: 5,
    borderRadius: 5,
    backgroundColor: "white",
  },
  input_money: {
    flex: 1,
    height: 30,
    borderWidth: 1,
    paddingRight: 5,
    borderRadius: 5,
    backgroundColor: "white",
    textAlign: "right",
  },
  listViewHeader: {
    textAlign: "center",
    color: "#41C8FF",
    fontWeight: "bold",
    fontSize: 20,
  },
  // duyen
  titleContainer: {
    width: (width * 65) / 100,
    alignItems: "center",
  },
  containRow: {
    textAlignVertical: "center",
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    backgroundColor: "#41C8FF",
    marginBottom: 4,
    borderRadius: 5,
    flexDirection: "row",
    width: width - 20,
    padding: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelItem: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  appButtonContainer: {
    elevation: 15,
    backgroundColor: "#41C8FF",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
