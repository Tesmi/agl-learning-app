import React from "react";
import {View} from 'react-native'
import Tabbar from "./Tabbar";

export default (props) => (
  <View style={{opacity: props.opacity, height: props.height, zIndex: 4}}>
     <Tabbar props={props}/>
  </View>
    
);
