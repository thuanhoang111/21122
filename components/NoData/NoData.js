import { VStack, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { heightOfScreen, widthOfScreen } from "../../constants/ConstantMain";
function NoData({ fontSizeText = "md", sizeIcon = 150 }) {
  return (
    <VStack
      space="3"
      width={widthOfScreen * 0.9}
      flex={1}
      alignItems={"center"}
      justifyContent={"center"}
      opacity={0.5}
    >
      <MaterialCommunityIcons size={sizeIcon} name="database-off-outline" />
      <Text fontSize={fontSizeText}>Không có dữ liệu </Text>
    </VStack>
  );
}

export default NoData;
