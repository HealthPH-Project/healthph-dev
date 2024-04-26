const InputDate = ({ size, additionalClasses, state, ...props }) => {
  const inputState = state ? "input-" + state : "";
  return (
    <div
      className={`input-wrapper input-date-wrapper ${size} relative ${additionalClasses}`}
    >
      <input
        type="date"
        className={`input ${size} ${inputState} w-full`}
        {...props}
      />
    </div>
  );
};
export default InputDate;
