import Icon from "./Icon";

const CheckboxGroup = ({ size, options, values, handleChange, ...props }) => {
  const handleUpdateValues = (value) => {
    if (values.includes(value)) {
      handleChange(values.filter((v) => v !== value));
    } else {
      handleChange([...values, value]);
    }
  };

  return (
    <div className="input-chechbox-group">
      {options &&
        options.map((v, i) => {
          const { label, value, isDisabled } = v;
          return (
            <div
              key={i}
              className={`input-checkbox-wrapper ${
                size ?? "input-checkbox-lg"
              } ${isDisabled ? "disabled" : ""} w-fit flex items-center`}
            >
              <input
                type="checkbox"
                className=" shrink-0"
                id={props.name + "-" + value}
                checked={values.includes(value)}
                onChange={() => handleUpdateValues(value)}
              />
              <div
                className="input-checkbox shrink-0 flex justify-center items-center"
                tabIndex={0}
                onClick={(e) => handleUpdateValues(value)}
              >
                <Icon iconName="Check" className="icon" />
              </div>
              <label htmlFor={props.name + "-" + value}>{label}</label>
            </div>
          );
        })}
    </div>
  );
};
export default CheckboxGroup;
