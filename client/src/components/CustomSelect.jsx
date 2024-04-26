import Icon from "./Icon";
import React, { useEffect, useRef, useState, forwardRef } from "react";

const CustomSelect = ({
  options,
  size,
  placeholder,
  name,
  id,
  value,
  handleChange,
  onChange,
  isDisabled,
  state,
  additionalClasses,
  editable = true,
  menuMaxHeight,
  ...props
}) => {
  const inputState = state ? "input-" + state : "";
  const inputRef = useRef();
  const menuRef = useRef();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (editable) {
        if (inputRef.current && inputRef.current.contains(e.target)) {
          setShowMenu(!showMenu);
        } else if (menuRef.current && !menuRef.current.contains(e.target)) {
          setShowMenu(false);
        }
      }
    };

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });

  const getLabel = (value) => {
    return !value || value.length == 0
      ? placeholder
      : options.find((opt) => opt.value == value)["label"];
  };

  return (
    <div className={`custom-select ${additionalClasses}`} ref={inputRef}>
      <select
        name={name}
        id={id}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      >
        {options &&
          options.map(({ label, value, isDisabled }, i) => {
            return (
              <option key={i} value={value} disabled={isDisabled}>
                {label}
              </option>
            );
          })}
      </select>

      {/* Custom Select Input */}
      <div className={`input-select-wrapper ${size} w-full `}>
        <div
          className={`input-select 
          ${size} 
          ${inputState} 
          ${isDisabled ? "disabled" : ""} 
          ${showMenu ? "show-menu" : ""}
          ${editable ? "" : "read-only"}`}
          tabIndex={0}
          onClick={(e) => {
            if (editable) {
              inputRef.current.focus();
            } else {
              e.preventDefault();
            }
          }}
        >
          <span>{getLabel(value)}</span>

          <Icon iconName="ChevronDown" fill="#8693A0" className="icon" />
        </div>

        {/* Custom Select Input Menu */}
        {showMenu && (
          <ul
            className={`input-select-menu w-full ${
              !menuMaxHeight ? "" : menuMaxHeight
            } `}
            ref={menuRef}
          >
            {options &&
              options.map(({ label, value, isDisabled }, i) => {
                return (
                  <li
                    key={i}
                    className={`${isDisabled ? "disabled" : ""}`}
                    onClick={() => {
                      handleChange(value);
                      setShowMenu(!showMenu);
                    }}
                  >
                    {label}
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
};
export default CustomSelect;
