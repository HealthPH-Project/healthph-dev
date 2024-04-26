import Icon from "./Icon.jsx";

const Input = ({
  size,
  additionalClasses,
  leadingIcon,
  trailingIcon,
  onClickLeading,
  onClickTrailing,
  state,
  ...props
}) => {
  const inputState = state ? "input-" + state : "";
  const padding =
    leadingIcon || trailingIcon
      ? "input" + (leadingIcon ? "-lead" : "") + (trailingIcon ? "-trail" : "")
      : "";

  return (
    <div className={`input-wrapper ${size} relative ${additionalClasses}`}>
      {leadingIcon && (
        <Icon
          iconName={leadingIcon}
          fill="#8693A0"
          className="icon leading-icon"
        />
      )}
      <input
        className={`input ${size} ${inputState} w-full ${padding}`}
        {...props}
      />
      {trailingIcon && (
        <Icon
          iconName={trailingIcon}
          fill="#8693A0"
          stroke="#8693A0"
          className={`icon trailing-icon ${
            onClickTrailing != null ? "cursor-pointer" : ""
          }`}
          onClick={onClickTrailing}
        />
      )}
    </div>
  );
};
export default Input;
