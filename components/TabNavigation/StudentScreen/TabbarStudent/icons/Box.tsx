import * as React from "react"
import Svg, { G, Path } from "react-native-svg"

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
      fill={active ? Colors.primary : "none"}
      stroke={active ? Colors.primary : Colors.border}
      strokeWidth={2}
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <Path
      	stroke={active ? "white" : Colors.border}
      	strokeWidth={2}
       d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
      </G>
    </Svg>
  )
}


