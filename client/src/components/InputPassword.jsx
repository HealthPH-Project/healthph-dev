import { useState } from "react";
import Icon from "./Icon.jsx";

const InputPassword = ({
  size,
  additionalClasses,
  state,
  defaultShow = false,
  ...props
}) => {
  const inputState = state ? "input-" + state : "";
  const [showPassword, setShowPassword] = useState(defaultShow);

  return (
    <div
      className={`input-wrapper input-password-wrapper ${size} relative ${additionalClasses}`}
    >
      <input
        type={`${showPassword ? "text" : "password"}`}
        className={`input ${size} ${inputState} w-full`}
        {...props}
      />
      <Icon
        iconName={`${showPassword ? "EyeSlash" : "Eye"}`}
        fill="#8693A0"
        className="icon trailing-icon"
        onClick={() => setShowPassword(!showPassword)}
      />
    </div>
  );
};
export default InputPassword;
