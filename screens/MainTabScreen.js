import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/FontAwesome5";
import HomeScreen from "./HomeScreen";
import TabProfile from "./InforAccount/TabProfile";
import { MainProvider } from "./MainContext";
import OverviewScreen from "./OverViewScreen/OverViewScreen";
import { primaryColor } from "../constants/ConstantStyle";
const TabArr = [
  {
    route: "Overview",
    label: "Tổng quan",
    icon: "home",
    component: OverviewScreen,
  },
  {
    route: "Category",
    label: "Danh mục",
    icon: "th-large",
    component: HomeScreen,
  },
  {
    route: "InforUser",
    label: "Thông tin",
    icon: "user-alt",
    component: TabProfile,
  },
];

const Tab = createBottomTabNavigator();

const animate1 = {
  0: { scale: 0.5, translateY: 7 },
  0.92: { translateY: -20 },
  1: { scale: 1.2, translateY: -10 },
};
const animate2 = {
  0: { scale: 1.2, translateY: -10 },
  1: { scale: 1, translateY: 7 },
};
const icon1 = {
  0: { scale: 0 },
  1: { scale: 1 },
};
const circle2 = { 0: { scale: 1 }, 1: { scale: 0 } };

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate(animate1);
      circleRef.current.animate(icon1);
      textRef.current.transitionTo({ scale: 1 });
      iconRef.current.animate(icon1);
    } else {
      viewRef.current.animate(animate2);
      circleRef.current.animate(circle2);
      textRef.current.transitionTo({ scale: 0 });
    }
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}
    >
      <Animatable.View ref={viewRef} duration={800} style={styles.container}>
        <View style={styles.btn}>
          <Animatable.View ref={circleRef} style={styles.circle} />
          <Animatable.View ref={iconRef}>
            <Icon
              name={item.icon}
              size={18}
              color={focused ? "#fff" : primaryColor}
            />
          </Animatable.View>
        </View>
        <Animatable.Text ref={textRef} style={styles.text}>
          {item.label}
        </Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  );
};

export default function AnimTab1() {
  return (
    <MainProvider>
      <Tab.Navigator
        initialRouteName="Overview"
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            height: 80,
          },
        }}
      >
        {TabArr.map((item, index) => {
          return (
            <Tab.Screen
              key={index}
              name={item.route}
              component={item.component}
              options={{
                tabBarShowLabel: false,
                tabBarButton: (props) => <TabButton {...props} item={item} />,
              }}
            />
          );
        })}
      </Tab.Navigator>
    </MainProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    height: 80,
    position: "absolute",
    borderBottomEndRadius: 16,
  },
  btn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "#fff",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: primaryColor,
    borderRadius: 25,
  },
  text: {
    fontSize: 10,
    textAlign: "center",
    color: primaryColor,
  },
});
