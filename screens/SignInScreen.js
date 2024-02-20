import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useTheme } from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../components/context";
import * as Post from "./../API/service/Post";
import { Spinner, useToast } from "native-base";
import { primaryColor } from "./../constants/ConstantStyle";
const SignInScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  // Use State khởi tạo
  const [data, setData] = useState({
    username: "",
    password: "",
    check_textInputChange: false,
    secureTextEntry: false,
    isValidUser: true,
    isValidPassword: true,
  });
  // Biến color động
  const { colors } = useTheme();

  // Biến truyền giá trị cho các component
  const { signIn } = useContext(AuthContext);

  //------------------------ Xử lý Textbox Tên tài khoản --------------r--- //
  const textInputChange = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
  };

  const handleValidUser = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        isValidUser: false,
      });
    }
  };

  /**
   * Thay đổi mật khẩu
   * @param {string} val chuỗi mật khẩu
   */
  const handlePasswordChange = (val) => {
    if (val.trim().length >= 2) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  async function getUserData(userID, password) {
    return await Post.handlePostWithBody("User/Login", {
      userID: userID,
      password: password,
    })
      .then((data) => {
        return data;
      })
      .finally((res) => {
        res && Alert.alert("Thông báo", "Lỗi đường truyền", [{ text: "Ok" }]);
        setIsLoading(false);
      });
  }
  // // nhớ xóa đi
  const Logout = async (userId) => {
    Post.handlePostWithBody("User/Logout", {
      userID: userId,
    }).then((response) => {
      // AsyncStorage.removeItem(StoreInfoUser);
    });
  };
  const loginHandle = async (userName, password) => {
    Logout(userName);
    const foundUser = await getUserData(userName, password);
    if (data.username.length == 0 || data.password.length == 0) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin tài khoản", [
        { text: "Ok" },
      ]);
      return;
    }

    if (!foundUser) {
      Alert.alert("Thông báo", "Tên tài khoản hoặc mật khẩu không đúng", [
        { text: "Ok" },
      ]);
      return;
    }
    if (foundUser.error == true) {
      Alert.alert(foundUser.errorMsg, foundUser.errorDescription, [
        { text: "Ok" },
      ]);
      return;
    }
    signIn(foundUser);
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={primaryColor} barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>HỆ THỐNG KẾ TOÁN HTX WACA</Text>
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            backgroundColor: "#FFFFFF",
          },
        ]}
      >
        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
            },
          ]}
        >
          Tên tài khoản:
        </Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" color={colors.text} size={20} />
          <TextInput
            placeholder="Nhập tên tài khoản"
            placeholderTextColor="#666666"
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            autoCapitalize="none"
            onChangeText={(val) => textInputChange(val)}
            onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
          />
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>
        {data.isValidUser ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Tên tài khoản tối thiểu 4 ký tự</Text>
          </Animatable.View>
        )}
        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
              marginTop: 35,
            },
          ]}
        >
          Mật khẩu:
        </Text>
        <View style={styles.action}>
          <Feather name="lock" color={colors.text} size={20} />
          <TextInput
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#666666"
            secureTextEntry={data.secureTextEntry ? true : false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            autoCapitalize="none"
            onChangeText={(val) => handlePasswordChange(val)}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="grey" size={20} />
            ) : (
              <Feather name="eye" color="grey" size={20} />
            )}
          </TouchableOpacity>
        </View>
        {data.isValidPassword ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Mật khẩu tối thiểu 5 ký tự.</Text>
          </Animatable.View>
        )}
        {/* <TouchableOpacity>
          <Text style={{ color: {primaryColor}, marginTop: 15 }}>
            Quên mật khẩu?
          </Text>
        </TouchableOpacity> */}
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.signIn}
            disabled={isLoading || false}
            onPress={() => {
              setIsLoading(true);
              setTimeout(() => {
                loginHandle(data.username, data.password);
              }, 500);
            }}
          >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={["#08d4c4", "#01ab9d"]}
              style={styles.signIn}
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: "#fff",
                    },
                  ]}
                >
                  Đăng nhập
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: primaryColor,
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
