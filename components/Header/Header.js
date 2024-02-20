import { HStack, Image, Pressable, Text, View, Platform } from "native-base";
import { heightOfScreen, widthOfScreen } from "../../constants/ConstantMain";
import { primaryColor } from "../../constants/ConstantStyle";
import AntDesign from "react-native-vector-icons/AntDesign";
import { MainContext } from "../../screens/MainContext";
import { useContext } from "react";
function Header({ onBack, title, onClick, isRightIcon = false }) {
  const mainContext = useContext(MainContext);
  return (
    <HStack
      alignItems={"center"}
      justifyContent={onBack ? "space-between" : "center"}
      w={"100%"}
      px={3}
      paddingBottom={2}
      paddingTop={mainContext.isIos ? heightOfScreen * 0.053 : 2}
      bg={primaryColor}
      zIndex={100}
    >
      {/* button go previous page */}
      {onBack && (
        <Pressable onPress={() => onBack()} zIndex={100}>
          {({ isHovered, isFocused, isPressed }) => {
            return (
              <View
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                textAlign={"center"}
              >
                <AntDesign
                  name="left"
                  size={25}
                  color={
                    isPressed ? "#b2b2b2" : isHovered ? "#b2b2b2" : "white"
                  }
                />
              </View>
            );
          }}
        </Pressable>
      )}
      {/* Title */}
      <Text
        fontSize={25}
        fontWeight={600}
        color={"white"}
        numberOfLines={1}
        maxWidth={"80%"}
        minWidth={"75%"}
        ellipsizeMode="tail"
        textAlign={"center"}
      >
        {title}
      </Text>
      {/* Button activate the function */}
      <Pressable
        onPress={() => onClick && onClick()}
        minW={widthOfScreen * 0.05}
        disabled={isRightIcon ? false : true}
      >
        {({ isHovered, isFocused, isPressed }) => {
          return isRightIcon ? (
            <Image
              alt="Hình ảnh đã bị lỗi"
              style={{
                width: 25,
                height: 25,
                tintColor: isPressed
                  ? "#b2b2b2"
                  : isHovered
                  ? "#b2b2b2"
                  : "white",
              }}
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
