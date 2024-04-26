import Icon from "./Icon";

const FieldGroup = ({
  label,
  labelFor,
  required,
  desc,
  optional,
  icon,
  additionalClasses,
  disabled,
  state,
  caption,
  children,
}) => {
  return (
    <div
      className={`field-group ${disabled ? "disabled" : ""} ${
        state == "error" ? "error" : ""
      } ${additionalClasses}`}
    >
      <div className="flex items-center justify-between">
        {label && (
          <label htmlFor={labelFor} className="flex items-center">
            {label}
            {required && <span>*</span>}
            {icon && (
              <Icon
                iconName={icon}
                className="ms-[4px]"
                fill="#8693A0"
                height="16px"
                width="16px"
              />
            )}
          </label>
        )}
        {optional && <span className="optional">{optional}</span>}
      </div>
      {desc && <p className="description">{desc}</p>}
      {children}
      {caption && (
        <div
          className={`flex items-top mt-[4px] ${
            children.props.showCount == true ? "w-[75%]" : ""
          }`}
        >
          {state && (
            <Icon
              className="shrink-0"
              iconName={`${
                ["information", "warning"].includes(state)
                  ? "Information"
                  : state == "error"
                  ? "Error"
                  : state == "success"
                  ? "CheckCircle"
                  : ""
              }`}
              fill={`${
                state == "information"
                  ? "#288DD7"
                  : state == "warning"
                  ? "#DBB324"
                  : state == "error"
                  ? "#D82727"
                  : state == "success"
                  ? "#35CA3B"
                  : ""
              }`}
              height="16px"
              width="16px"
            />
          )}
          <span className={`caption ${state}`}>{caption}</span>
        </div>
      )}
    </div>
  );
};
export default FieldGroup;
