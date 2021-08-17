import * as React from "react"
import Svg, {G, Path } from "react-native-svg"
import { Colors, ICON_SIZE, IconProps } from "./Constants";

export default ({ active }: IconProps) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={ICON_SIZE} height={ICON_SIZE}
      viewBox="0 0 24 24"
      
    >
    <G
      transform="translate(1 1)"
      fill={active ? Colors.primary : "none"}      
      stroke={active ? Colors.primary : Colors.border}
      strokeWidth={2}
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <Path stroke={active ? "white" : Colors.border} d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </G>  
    </Svg>
  )
}


