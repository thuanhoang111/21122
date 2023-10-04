import { View } from "react-native";
import * as constantMain from "../../constants/ConstantMain";
import {
  VStack,
  Heading,
  Box,
  Stagger,
  IconButton,
  Actionsheet,
  ScrollView,
  FlatList,
  Text,
  HStack,
  Avatar,
  Spacer,
  Popover,
  Button,
  Checkbox,
  Image,
} from "native-base";
import DataTableMain from "../../components/DataTable/DataTableMain";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useState } from "react";

function ExpenditureAnalysis() {
  return (
    <View
      style={{ width: constantMain.widthOfScreen, position: "relative" }}
    ></View>
  );
}
export default ExpenditureAnalysis;
