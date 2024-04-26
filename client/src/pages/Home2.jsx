import { useState } from "react";
import Icon from "../components/Icon.jsx";
import Input from "../components/Input.jsx";
import Textarea from "../components/Textarea.jsx";
import Select from "../components/Select.jsx";
import CustomSelect from "../components/CustomSelect.jsx";
import RadioButton from "../components/RadioButton.jsx";
import Checkbox from "../components/Checkbox.jsx";
import Switch from "../components/Switch.jsx";
import InputPassword from "../components/InputPassword.jsx";
import InputDate from "../components/InputDate.jsx";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

const Home = () => {
  const [test, setTest] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [test2, setTest2] = useState("");
  const [check, setCheck] = useState(false);
  const [switchX, setSwitch] = useState(false);
  const [y, setY] = useState("");

  const [options, setOptions] = useState([
    {
      label: "Option 1",
      value: "opt1",
    },
    {
      label: "Option 2",
      value: "opt2",
    },
    {
      label: "Option 3",
      value: "opt3",
    },
    {
      label: "Option 3",
      value: "opt3",
    },
    {
      label: "Option 3",
      value: "opt3",
    },
    {
      label: "Option 3",
      value: "opt3",
    },
    {
      label: "Option 3",
      value: "opt3",
    },
  ]);

  const x = [
    {
      label: "Option 1",
      value: "opt1",
    },
    {
      label: "Option 2",
      value: "opt2",
    },
    {
      label: "Option 3",
      value: "opt3",
    },
  ];

  const handleChangeSelect = (e) => {
    console.log(e);
  };
  return (
    <div className="home-layout">
      <div className="">
        <h1 className="web-d-h1">
          <NavLink to="/login">LOGIN</NavLink>
        </h1>
        <h1 className="web-d-h1">
          <NavLink to="/register">REGISTER</NavLink>
        </h1>
        <h1 className="web-d-h1">HOME {switchX ? "yes" : "no"}</h1>
      </div>
      <br /> <br /> <br />
      <InputDate
        size="input-sm md:input-md lg:input-lg"
        additionalClasses="w-[300px]"
      />
      <br /> <br /> <br />
      <Select
        options={options}
        placeHolder="Please select..."
        onChange={(e) => handleChangeSelect(e)}
        isSearchable
        isMulti
      />
      <br /> <br /> <br />
      <InputPassword
        size="input-sm md:input-md lg:input-lg"
        additionalClasses="w-[300px]"
        state="error"
      />
      <br /> <br /> <br />
      <Switch
        name="switch"
        label="Switch"
        id="switch"
        size="input-switch-sm md:input-switch-md lg:input-switch-lg"
        checked={switchX}
        handleChange={setSwitch}
      />
      <br /> <br /> <br />
      <Checkbox
        name="Terms"
        label="Agree"
        id="terms"
        checked={check}
        handleChange={setCheck}
        size="input-checkbox-sm md:input-checkbox-md lg:input-checkbox-lg"
      />
      <Checkbox
        name="opt"
        label="Opt 1"
        value="opt-1"
        id="opt-1"
        size="input-checkbox-sm md:input-checkbox-md lg:input-checkbox-lg"
        isDisabled
      />
      <br /> <br /> <br />
      <RadioButton
        name="options"
        label="Option 1"
        value="option-1"
        id="option-1"
        checked={y === "option-1"}
        handleChange={setY}
        size="input-radio-sm md:input-radio-md lg:input-radio-lg"
      />
      <RadioButton
        name="options"
        label="Option 2"
        value="option-2"
        id="option-2"
        checked={y === "option-2"}
        handleChange={setY}
      />
      <br /> <br /> <br />
      <CustomSelect
        options={[
          {
            label: "Option 1",
            value: "opt1",
          },
          {
            label: "Option 2",
            value: "opt2",
            isDisabled: true,
          },
          {
            label: "Option 3",
            value: "opt3",
          },
        ]}
        placeholder="Select one..."
        size="input-select-sm md:input-select-md lg:input-select-lg"
        value={test2}
        handleChange={setTest2}
        additionalClasses="w-[300px]"
      />
      <br /> <br /> <br />
      <button
        className="prod-icon-btn prod-icon-btn-sm prod-btn-secondary"
        disabled
      >
        <Icon iconName="Sample" fill="#000" className="icon" />
      </button>
      <button className="prod-push-btn-sm md:prod-push-btn-base lg:prod-push-btn-lg prod-btn-primary">
        Button
      </button>
      <br />
      <br />
      <button className="prod-push-btn-sm md:prod-push-btn-base lg:prod-push-btn-lg prod-btn-ghost">
        Button
      </button>
      <br />
      <br />
      <button className="prod-push-btn-sm md:prod-push-btn-base lg:prod-push-btn-lg prod-btn-secondary">
        Button
      </button>
      <br />
      <br />
      <button className="prod-push-btn-sm md:prod-push-btn-base lg:prod-push-btn-lg prod-btn-destructive">
        Button
      </button>
    </div>
  );
};
export default Home;
