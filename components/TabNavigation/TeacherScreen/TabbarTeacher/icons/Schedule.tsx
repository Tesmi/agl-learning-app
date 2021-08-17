import * as React from "react"
import Svg, {G, Circle, Path } from "react-native-svg"
import { Colors, ICON_SIZE, IconProps } from "./Constants";

export default ({ active }: IconProps) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={ICON_SIZE} 
      height={ICON_SIZE}
      viewBox="0 0 24 24" 
     >
     <G
      transform="translate(1 1)"
        stroke={active ? Colors.primary : Colors.border}
        strokeWidth={2}
        fill={active ? Colors.primary : "none"}
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
     >
      <Circle
      stroke={active ? Colors.primary : Colors.border}
       fill={active ? Colors.primary : "none"}
       cx={12} cy={12} r={10}/>
      <Path 
      	stroke={active ? "white" : Colors.border}
      	d="M12 6v6l4 2" />

      </G>
    </Svg>
  )
}


