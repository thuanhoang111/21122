import { AutoFocus, Camera, CameraType } from 'expo-camera'
import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { StoreInfoUser } from '../constants/API'
import { Invoice } from '../model/StructInvoice'
import AnalyticApi from '../API/Analytic'
import AsyncStorage from '@react-native-async-storage/async-storage'
import InvoiceScreen from './InvoiceScreen'

import { useNavigation } from '@react-navigation/native'

const wd_width = Dimensions.get('screen').width
const wd_height = Dimensions.get('screen').height

const TakePhotoScreen = () => {
  const navigation = useNavigation()

  const [permission, requestPermission] = Camera.useCameraPermissions()
  const [camera, SetCamera] = React.useState()

  const [statusCamera, setStatusCamera] = React.useState({
    /**Chụp hình */
    getPhoto: false,
    /**Hình mã hóa 64bit */
    imagebase64: '',
    /**Load hình */
    loadPhoto: false,
    /**Trạng thái của Camera (False: sử dụng chụp | True: không truy xuất sử dụng Camera) */
    status: false,
    /**Trạng thái vòng xoay loading */
    loading: false,
    /**Dữ liệu hóa đơn (False: Chưa có | True: đã có) */
    getInvoice: false,
  })

  async function asyncUserID() {
    try {
      const infoUserGet = await AsyncStorage.getItem(StoreInfoUser)
      let jsonUser = JSON.parse(infoUserGet)
      return jsonUser
    } catch (error) {}
  }

  if (!permission) {
    // Camera permissions are still loading
    return <View />
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          Chúng tôi cần quyền truy cập vào Camera của bạn
        </Text>
        <Button onPress={requestPermission} title="Chấp nhận" />
      </View>
    )
  }

  const getPicture = async () => {
    let imageUris = []

    let image = await camera.takePictureAsync({
      base64: true,
      quality: 1,
    })

    imageUris.push(image.uri)

    setStatusCamera({
      ...statusCamera,
      getPhoto: true,
      imagebase64: image.base64,
      status: true,
    })
  }

  const openImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      alert('Chúng tôi cần quyền truy cập thư viện ảnh')
      return
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      base64: true,
    })
    if (pickerResult.cancelled === true) {
      return
    }

    setStatusCamera({
      ...statusCamera,
      imagebase64: pickerResult.base64,
      loadPhoto: true,
      status: true,
    })
  }

  const removeImage = async () => {
    setStatusCamera({
      getPhoto: false,
      imagebase64: '',
      loadPhoto: false,
      status: false,
    })
  }

  const handleAnalysic = async (navigation) => {
    try {
      const dataInvoice = await GetDataAnalysic(navigation)
      if (dataInvoice) {
        Alert.alert(
          "Thông báo",
          "Phân tích dữ liệu thành công. Hãy nhấn đồng ý để đưa dữ liệu vào!",
          [{ text: "Đồng ý", onPress: () => {RedirectScreen(dataInvoice) } }]
        );
      }
    } catch (error) {
      console.log('Lỗi ngoại lệ : ' + error)
    }
  }

  const GetDataAnalysic = async (navigation) => {
    var infoUser = await asyncUserID()
    let image64 = statusCamera.imagebase64
    let product_arr = []

    setStatusCamera({
      ...statusCamera,
      loading: true,
    })

    try {
      const response = await AnalyticApi.Analytic(
        infoUser.id,
        infoUser.login_year,
        image64,
      )
      let result = JSON.stringify(response)
      // Kiểm tra lỗi từ server trả về
      if (result.includes('error')) {
        Alert.alert(
          'Hóa đơn không hợp lệ .',
          'Bạn có muốn chụp lại hóa đơn mới không ?',
          [
            {
              text: 'OK',
              onPress: async () => {
                await removeImage()
              },
            },
            {
              text: 'Cancel',
              onPress: () => {
                setStatusCamera({
                  ...statusCamera,
                  status: true,
                })
              },
            },
          ],
        )
        return
      }
      // Nếu có kết quả
      if (result) {
        let invoiceJson = response
        let productData = invoiceJson.dshanghoa
        // Kiểm tra danh sách hàng hóa nếu không có mặt hàng thì alert
        if (productData.length == 0) {
          Alert.alert(
            'Hóa đơn không hợp lệ .',
            'Bạn có muốn chụp lại hóa đơn mới không ?',
            [
              {
                text: 'OK',
                onPress: async () => {
                  await removeImage()
                },
              },
              {
                text: 'Cancel',
                onPress: () => {
                  setStatusCamera({
                    ...statusCamera,
                    status: true,
                    loading: false,
                  })
                },
              },
            ],
          )
        } else {
          Invoice.MaHTX = infoUser.uni_k_code
          for (let i = 0; i < productData.length; i++) {
            product_arr.push({
              STT: productData[i].stt,
              product_name: productData[i].tenhanghoa,
              unit: productData[i].dvt,
              quantity: productData[i].soluong,
              price: productData[i].dongia,
              total: productData[i].thanhtien,
            })
          }

          Invoice.ProductModel = product_arr
          Invoice.SiwakeModel.nguoimuahang = invoiceJson.nguoimuahang
          Invoice.SiwakeModel.masothuebenmua = invoiceJson.masothuebenmua
          Invoice.SiwakeModel.ngayhoadon = invoiceJson.ngayhoadon
          Invoice.SiwakeModel.sohd = invoiceJson.sohd
          Invoice.SiwakeModel.congtienhang = invoiceJson.congtienhang
          Invoice.SiwakeModel.tienthueGTGT = invoiceJson.tienthueGTGT
          Invoice.SiwakeModel.tongtienthanhtoan = invoiceJson.tongtienthanhtoan
          Invoice.SiwakeModel.base64Image = invoiceJson.base64Image

          setStatusCamera({
            ...statusCamera,
            getInvoice: true,
            loading: false,
          })
        }
      }
      // Kết quả từ server trả về null
      else {

      }

      return Invoice;

    }
    catch (error) { }

      // Nếu lấy được data từ phân tích hình ảnh
  // Chuyển qua component Invoice kèm theo dữ liệu đã phân tích được
  // Mode:0 (thêm mới) | Mode 1: chỉnh sửa
  // if (statusCamera.getInvoice) {
  //   Alert.alert(
  //     "Thông báo",
  //     "Đã có dữ liệu phân tích. Vui lòng nhấn đồng ý để đưa dữ liệu",
  //     [{ text: "Đồng ý", onPress: () => {RedirectScreen() } }]
  //   );

  //   // navigation.navigate('Hóa đơn', {
  //   //   mode: '0',
  //   //   data: { Invoice },
  //   //   navigation:{navigation}
  //   // });
  //   // return <InvoiceScreen mode={0} invoiceData={Invoice}></InvoiceScreen>
  // }
  }

  
  const RedirectScreen = (Invoice) => {
    navigation.navigate('Hóa đơn', {
      mode: '0',
      data: { Invoice },
      navigation: { navigation }
    });
  }


  return (
    <View style={styles.container}>
      {!statusCamera.status ? (
        <Camera
          ref={(ref) => {
            SetCamera(ref)
          }}
          style={{
            flex: 1,
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
          type={Camera.Constants.Type.black}
        >
          <TouchableOpacity onPress={() => getPicture()}>
            <Ionicons
              name={Platform.OS === 'ios' ? 'ios-camera' : 'md-camera'}
              size={80}
              color={'white'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openImage()}>
            <View>
              <Ionicons
                name={Platform.OS === 'ios' ? 'ios-image' : 'md-image'}
                size={70}
                color={'white'}
              />
            </View>
          </TouchableOpacity>
        </Camera>
      ) : (
        <View>
          <View>
            <Image
              style={styles.viewImage}
              source={{
                uri: `data:image/png;base64,${statusCamera.imagebase64}`,
              }}
            />
            <TouchableOpacity
              style={styles.deleteImage}
              onPress={() => removeImage()}
            >
              <Ionicons
                name={
                  Platform.OS === 'ios'
                    ? 'ios-close-circle-sharp'
                    : 'md-close-circle-sharp'
                }
                size={30}
                color={'#2f95dc'}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              position: 'absolute',
              bottom: 0,
              left: '42%',
            }}
          >
            <TouchableOpacity onPress={() => handleAnalysic(navigation)}>
              {/* <TouchableOpacity onPress={() => navigation.navigate('Hóa đơn')}> */}
              <Ionicons
                name={
                  Platform.OS === 'ios' ? 'ios-scan-circle' : 'md-scan-circle'
                }
                size={80}
                color={'white'}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {statusCamera.loading && (
        <View style={styles.loading}>
          <ActivityIndicator
            style={{ marginTop: 30 }}
            size="large"
            color="#309ee7"
          />
        </View>
      )}
    </View>
  )
}

export default TakePhotoScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },

  viewImage: {
    width: '100%',
    height: '100%',
    // wd_width <= 360
    //   ? 150
    //   : wd_width < 480
    //   ? wd_height - 200
    //   : wd_width < 768
    //   ? 200
    //   : 220,
    borderColor: 'white',
    borderWidth: 3,
  },

  deleteImage: {
    position: 'absolute',
    top: 5,
    right: 5,
  },

  loading: {
    position: 'absolute',
    width: wd_width,
    height: wd_height,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
})
