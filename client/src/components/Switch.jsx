const Switch = ({
  size,
  label,
  isDisabled,
  checked,
  handleChange,
  ...props
}) => {
  return (
    <div
      className={`input-switch-wrapper ${size ?? "input-switch-lg"} ${
        isDisabled ? "disabled" : ""
      } w-fit flex items-center`}
    >
      <input
        type="checkbox"
        className="input-switch shrink-0"
        {...props}
        checked={checked}
        onChange={() => handleChange(!checked)}
      />
      <label htmlFor={props.id}>{label}</label>
    </div>
  );
};
export default Switch;
