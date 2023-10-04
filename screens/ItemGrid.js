import * as React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native";

const width = Dimensions.get("window").width - 20;

export const ItemRow = (props) => {
  const NumberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleClick = () => {
    updateData(true);
  };

  const updateData = (val) => {
    props.updateData(val, props.itemRow.STT - 1);
  };

  const deleteProduct = () => {
    props.delete(props.itemRow.STT);
  };

  return (
    <View style={styles.block}>
      <TouchableOpacity onPress={handleClick}>
        <View style={styles.block_item}>
          <View style={styles.block_item_SP}>
            <Text style={{ color: "white", fontSize: 16 }}>
              {props.itemRow.STT}
            </Text>
          </View>
          {/* <View style={[styles.block_item_SP, { width: 50 }]}>
            <Text style={{ color: 'white', fontSize: 16 }}>Sửa</Text>
          </View> */}
          <TouchableOpacity onPress={deleteProduct}>
            <View style={[styles.block_item_SP, { width: 50 }]}>
              <Text style={{ color: "white", fontSize: 16 }}>Xóa</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.block_item}>
          <Text> Tên mặt hàng: {props.itemRow.product_name}</Text>
        </View>
        <View style={styles.block_item}>
          <View style={{ flex: 1 }}>
            <Text> Đơn vị tính: {props.itemRow.unit}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text>
              {" "}
              Đơn giá:{" "}
              {NumberWithCommas(
                props.itemRow.price
                  .toString()
                  .replace(/,/g, "")
                  .replace(/\./g, "")
              )}
            </Text>
          </View>
        </View>
        <View style={styles.block_item}>
          <View style={{ flex: 1 }}>
            <Text>
              {" "}
              Số Lượng:{" "}
              {NumberWithCommas(
                props.itemRow.quantity
                  .toString()
                  .replace(/,/g, "")
                  .replace(/\./g, "")
              )}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text>
              Thành tiền:{" "}
              {NumberWithCommas(
                props.itemRow.total
                  .toString()
                  .replace(/,/g, "")
                  .replace(/\./g, "")
              )}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  eidtItemButton: {
    flex: 1,
    alignItems: "center",
    color: "#841584",
  },
  block: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    margin: 10,
    marginTop: 3,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "white",
    borderRadius: 7,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: "#41C8FF",
  },
  block_item: {
    width: width - 20,
    borderRadius: 3,
    padding: 2,
    paddingLeft: 10,
    paddingRight: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  block_item_SP: {
    color: "white",
    backgroundColor: "#41C8FF",
    width: 30,
    height: 25,
    borderRadius: 7,
    alignItems: "center",
  },
});
