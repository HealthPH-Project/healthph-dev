import React, { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

const MultiSelect = ({
  placeHolder,
  options,
  defaultValue,
  onChange,
  selectAllLabel,
  selectAll,
  additionalClassname,
  menuClassname,
  menuPlacement,
}) => {
  // State variables using React hooks
  const [showMenu, setShowMenu] = useState(false); // Controls the visibility of the dropdown menu
  const [selectedValue, setSelectedValue] = useState(selectAll ? options : []); // Stores the selected value(s)
  const inputRef = useRef(); // Reference to the custom select input element
  const menuRef = useRef(); // Reference to the custom select dropdown menu

  useEffect(() => {
    const handler = (e) => {
      if (inputRef.current && inputRef.current.contains(e.target)) {
        if (menuRef.current && menuRef.current.contains(e.target)) return;
        setShowMenu(!showMenu);
      } else if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !e.target.className.split(" ").includes("dropdown-item")
      ) {
        setShowMenu(false);
      }
    };

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });

  const getDisplay = () => {
    if (selectedValue.length === 0) {
      return placeHolder;
    }

    if (selectedValue.length == options.length) {
      return selectAllLabel;
    }

    const sorted = selectedValue.sort((a, b) => a.order - b.order);

    let display = "";

    if (sorted.length > 2) {
      display = `${sorted[0].label}, ${sorted[1].label} + ${sorted.length - 2}`;
    } else {
      for (let i = 0; i < sorted.length; i++) {
        display += sorted[i].label;
        if (sorted.length != i + 1) {
          display += ", ";
        }
      }
    }

    return display;
  };

  const removeOption = (option) => {
    return selectedValue.filter((o) => o.value !== option.value);
  };

  const onItemClick = (option) => {
    let newValue;
    if (selectedValue.findIndex((o) => o.value === option.value) >= 0) {
      newValue = removeOption(option);
    } else {
      newValue = [...selectedValue, option];
    }
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const isSelected = (option) => {
    return selectedValue.filter((o) => o.value === option.value).length > 0;
  };

  return (
    <div
      className={`multiselect-dropdown-container ${additionalClassname}`}
      tabIndex={0}
      ref={inputRef}
    >
      <div className="dropdown-input">
        <div className={`dropdown-selected-value `}>{getDisplay()}</div>
        <div className="dropdown-tools">
          <div className={`dropdown-tool ${showMenu ? "dropdown-active" : ""}`}>
            <Icon
              iconName="ChevronDown"
              fill="#465360"
              height="20px"
              width="20px"
            />
          </div>
        </div>
      </div>

      {showMenu && (
        <div className={`dropdown-menu ${menuClassname}`} ref={menuRef}>
          {/* SELECT ALL / INDETERMINATE */}
          <div className="select-all">
            <div
              className={`dropdown-item ${
                selectedValue.length > 0 ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedValue(selectedValue.length == 0 ? options : []);
                onChange(selectedValue.length == 0 ? options : []);
              }}
            >
              <div className="dropdown-check-wrapper">
                {selectedValue.length > 0 && (
                  <Icon
                    iconName={
                      selectedValue.length == options.length
                        ? "Check"
                        : "IndeterminateCheck"
                    }
                    height="20px"
                    width="20px"
                    fill="#FFF"
                  />
                )}
              </div>
              <span>{selectAllLabel}</span>
            </div>
          </div>

          {/* OPTIONS */}
          {options.map((option) => (
            <div
              className={`dropdown-item ${isSelected(option) && "selected"}`}
              key={option.value}
              id={option.value}
              onClick={() => onItemClick(option)}
            >
              <div className="dropdown-check-wrapper">
                <Icon iconName="Check" height="20px" width="20px" fill="#FFF" />
              </div>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default MultiSelect;
