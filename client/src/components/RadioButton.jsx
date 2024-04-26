const RadioButton = ({ size, label, isDisabled, handleChange, ...props }) => {
  return (
    <div
      className={`input-radio-wrapper ${size ?? "input-radio-lg"} ${
        isDisabled ? "disabled" : ""
      } w-fit flex items-center`}
    >
      <input
        type="radio"
        className="input-radio shrink-0"
        {...props}
        tabIndex={0}
        onChange={(e) => handleChange(e.target.value)}
      />
      <label htmlFor={props.id}>{label}</label>
    </div>
  );
};
export default RadioButton;
