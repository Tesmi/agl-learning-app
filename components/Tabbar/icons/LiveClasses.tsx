import * as React from "react"
import Svg, { Rect, G, Path } from "react-native-svg"
import { Colors, ICON_SIZE, IconProps } from "./Constants";

export default ({ active }: IconProps) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={ICON_SIZE} height={ICON_SIZE}
      viewBox="0 0 24 24"
      className="prefix__feather prefix__feather-tv"
    >
    <G 
      transform="translate(1 1)"
      fillRule="evenodd"	
      strokeLinecap="round"
      strokeLinejoin="round"
    >
    <Rect 
      stroke={active ? Colors.primary : Colors.border}
      strokeWidth={2}
      fill={active ? Colors.primary : "none"}
      x={2} y={7} width={20} height={15} rx={2} ry={2} />
    <Path 
    	stroke={active ? Colors.primary : Colors.border}
        strokeWidth={2}
        fill="none"
     	d="M17 2l-5 5-5-5" 
     />
    </G>
   </Svg>
  )
}


