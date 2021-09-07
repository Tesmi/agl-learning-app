import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { timing, withTransition } from "react-native-redash";
import { Value, block, onChange, set, useCode } from "react-native-reanimated";
import Tab from "./Tab";
import Particules from "./Particules";
import Weave from "./Weave";

import * as Navigation from '../../TabNavRef'

import Bell from "./icons/Bell";
import LiveClasses from './icons/LiveClasses'
import Dashboard from './icons/Dashboard'
import Box from './icons/Box'
import Schedule from './icons/Schedule'
import Files from './icons/Files'

import { DURATION, ICON_SIZE, PADDING, SEGMENT } from "./icons/Constants";

const tabs = [
  { icon: [<Dashboard />, "HomeScreen"] },
  { icon: [<Files />, "FilesScreen"]},
  { icon: [<Schedule />,"ScheduleScreen"] },
  { icon: [<Bell />,"NotificationsScreen"] },
  { icon: [<Box />,"RecycleScreen"] },
];
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  tabs: {
    flexDirection: "row",
    alignItems: "center",
  },
  tab: {
    width: SEGMENT,
    height: ICON_SIZE + PADDING * 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ({props}) => {

  const clickHandler = (index, screenName) =>{
    active.setValue(index)
    Navigation.navigate(screenName)
  }

  const active = new Value<number>(0);
  const transition = withTransition(active, { duration: DURATION });
  const activeTransition = new Value(0);
  
  useCode(
    () =>
      block([
        onChange(active, set(activeTransition, 0)),
        set(activeTransition, timing({ duration: DURATION })),
      ]),
    [active, activeTransition]
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabs}>
        {tabs.map(({ icon }, index) => (
          <View key={index} style={styles.tab}>
            <Weave {...{ active, transition, index }} />
            <Tab
              onPress={() => clickHandler(index, icon[1])}
              {...{ active, transition, index }}
            >
              {icon[0]}
            </Tab>
          </View>
        ))}
        <Particules {...{ transition, activeTransition }} />
      </View>
    </SafeAreaView>
  );
};
