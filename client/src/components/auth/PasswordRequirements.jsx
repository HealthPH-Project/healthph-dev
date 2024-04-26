import { useEffect, useState } from "react";
import Icon from "../Icon";

const PasswordRequirements = ({ password, pwdFlags, handleChange }) => {
  useEffect(() => {
    const newPWDFlag = {
      length: /\s/.test(password)
        ? "error"
        : password.length >= 8
        ? "success"
        : "",
      lowercase: /[a-z]/.test(password) ? "success" : "",
      uppercase: /[A-Z]/.test(password) ? "success" : "",
      number: /\d/.test(password) ? "success" : "",
      character: "",
    };

    const specialChars = /^.*[!@#$%^&*_-]+.*$/;
    if (specialChars.test(password)) {
      newPWDFlag.character = "success";
    } else {
      newPWDFlag.character = "";
    }

    const negative = /[^a-zA-Z0-9!@#$%^&*_-\s]/;

    if (negative.test(password)) {
      newPWDFlag.character = "error";
    }

    handleChange(newPWDFlag);
  }, [password]);
  return (
    <ul className="pwd-reqs mb-[20px]">
      <li className={`${pwdFlags.length}`}>
        <Icon
          iconName={
            pwdFlags.length == "success"
              ? "CheckCircle"
              : pwdFlags.length == "error"
              ? "Error"
              : "Information"
          }
          height="20px"
          width="20px"
          className="icon me-[4px]"
        />
        <p className="prod-p3">Use at least 8 characters (no whitespaces)</p>
      </li>
      <li className={`${pwdFlags.lowercase}`}>
        <Icon
          iconName={
            pwdFlags.lowercase == "success"
              ? "CheckCircle"
              : pwdFlags.lowercase == "error"
              ? "Error"
              : "Information"
          }
          height="20px"
          width="20px"
          className="icon me-[4px]"
        />
        <p className="prod-p3">Use at least 1 lowercase letter (a-z)</p>
      </li>
      <li className={`${pwdFlags.uppercase}`}>
        <Icon
          iconName={
            pwdFlags.uppercase == "success"
              ? "CheckCircle"
              : pwdFlags.uppercase == "error"
              ? "Error"
              : "Information"
          }
          height="20px"
          width="20px"
          className="icon me-[4px]"
        />
        <p className="prod-p3">Use at least 1 uppercase letter (A-Z)</p>
      </li>
      <li className={`${pwdFlags.number}`}>
        <Icon
          iconName={
            pwdFlags.number == "success"
              ? "CheckCircle"
              : pwdFlags.number == "error"
              ? "Error"
              : "Information"
          }
          height="20px"
          width="20px"
          className="icon me-[4px]"
        />
        <p className="prod-p3">Use at least 1 number (0-9)</p>
      </li>
      <li className={`${pwdFlags.character}`}>
        <Icon
          iconName={
            pwdFlags.character == "success"
              ? "CheckCircle"
              : pwdFlags.character == "error"
              ? "Error"
              : "Information"
          }
          height="20px"
          width="20px"
          className="icon me-[4px]"
        />
        <p className="prod-p3">
          Use at least 1 special character [ !@#$%^&*-_ ]
        </p>
      </li>
    </ul>
  );
};
export default PasswordRequirements;
