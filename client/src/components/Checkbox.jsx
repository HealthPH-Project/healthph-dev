import Icon from "./Icon";

const Checkbox = ({
  size,
  label,
  isDisabled,
  checked,
  handleChange,
  children,
  additionalClasses,
  ...props
}) => {
  return (
    <div
      className={`input-checkbox-wrapper ${size ?? "input-checkbox-lg"} ${
        isDisabled ? "disabled" : ""
      } w-fit flex ${additionalClasses}`}
    >
      <input
        type="checkbox"
        className=" shrink-0"
        checked={checked}
        {...props}
        onChange={(e) => handleChange(!checked)}
      />
      <div
        className="input-checkbox shrink-0 flex justify-center items-center"
        tabIndex={0}
        onClick={(e) => handleChange(!checked)}
      >
        <Icon iconName="Check" className="icon" />
      </div>
      {label ? <label htmlFor={props.id}>{label}</label> : children}
    </div>
  );
};
export default Checkbox;
