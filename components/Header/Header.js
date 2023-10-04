import { HStack, Image, Pressable, Text, View } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { heightOfScreen, widthOfScreen } from "../../constants/ConstantMain";
const isIos = Platform.OS == "ios";
function Header({ onBack, title, onClick, isRightIcon = false }) {
  return (
    <HStack
      alignItems={"center"}
      justifyContent={"space-around"}
      w={"100%"}
      px={3}
      paddingBottom={2}
      paddingTop={isIos ? heightOfScreen * 0.053 : 2}
      bg={"#009387"}
    >
      <Pressable onPress={() => onBack()} zIndex={100}>
        {({ isHovered, isFocused, isPressed }) => {
          return (
            <View
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              textAlign={"center"}
            >
              <MaterialIcons
                name="arrow-back-ios"
                size={25}
                color={isPressed ? "#1892a7" : isHovered ? "#1892a7" : "white"}
              />
            </View>
          );
        }}
      </Pressable>
      <Text
        fontSize={25}
        fontWeight={600}
        color={"white"}
        numberOfLines={1}
        w={"75%"}
        ellipsizeMode="tail"
        textAlign={"center"}
      >
        {title}
      </Text>

      <Pressable
        onPress={() => onClick && onClick()}
        minW={widthOfScreen * 0.05}
        disabled={isRightIcon ? false : true}
      >
        {({ isHovered, isFocused, isPressed }) => {
          return isRightIcon ? (
            <Image
              alt="Hình ảnh đã bị lỗi"
              style={{ width: 25, height: 25, tintColor: "#fff" }}
              source={require("../../assets/filter.png")}
            ></Image>
          ) : (
            ""
          );
        }}
      </Pressable>
    </HStack>
  );
}

export default Header;
