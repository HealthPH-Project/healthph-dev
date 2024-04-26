import React from "react";
import * as Icons from "../assets/icons/icons.js";

const Icon = ({
  iconName,
  fill,
  stroke,
  height,
  width,
  className,
  onClick,
}) => {
  const RawIcon = Icons[iconName];

  return RawIcon ? (
    <RawIcon
      fill={fill ?? "#FFF"}
      stroke={stroke}
      height={height ?? "48px"}
      width={width ?? "48px"}
      className={className}
      onClick={onClick}
    />
  ) : null;
};

export default Icon;
