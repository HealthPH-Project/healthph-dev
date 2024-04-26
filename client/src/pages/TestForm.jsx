import { useEffect, useState } from "react";
import Input from "../components/Input";
import RadioButton from "../components/RadioButton";
import Checkbox from "../components/Checkbox";
import CustomSelect from "../components/CustomSelect";
import InputPassword from "../components/InputPassword";
import CheckboxGroup from "../components/CheckboxGroup";
import Textarea from "../components/Textarea";
import FieldGroup from "../components/FieldGroup";

const TestForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [want, setWant] = useState("");
  const [terms, setTerms] = useState(false);
  const [test, setTest] = useState([]);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const obj = {
      firstName,
      lastName,
      password,
      gender,
      want,
      test,
      terms,
      message,
    };
    console.log(obj);
  };
  return (
    <div>
      <FieldGroup
        label="Input Label"
        desc="Field description"
        optional="Optional"
        labelFor="firstName"
        additionalClasses="w-[300px]"
        caption="An error message an error message an error message"
        state="error"
        disabled
        required
      >
        <Input
          size="input-lg"
          id="firstName"
          additionalClasses="w-full mt-[12px]"
          placeholder="Input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          trailingIcon="Sample"
        />
      </FieldGroup>

      <form action="" onSubmit={handleSubmit}>
        <div className="mb-[20px]">
          <span>First Name: </span>
          {/* <Input
            size="input-lg"
            id="firstName"
            additionalClasses="w-[300px]"
            placeholder="Input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            trailingIcon="Sample"
          /> */}
        </div>
        <div className="mb-[20px]">
          <span>Last Name: </span>
          <Input
            size="input-lg"
            additionalClasses="w-[300px]"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            leadingIcon="Check"
          />
        </div>

        <div className="mb-[20px]">
          <span>Password: </span>
          <InputPassword
            size="input-lg"
            additionalClasses="w-[300px]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-[20px]">
          <span>Gender: </span>
          <RadioButton
            name="gender"
            label="Male"
            value="male"
            id="gender-male"
            checked={gender === "male"}
            handleChange={setGender}
          />

          <RadioButton
            name="gender"
            label="Female"
            value="female"
            id="gender-female"
            checked={gender === "female"}
            handleChange={setGender}
          />
        </div>

        <div className="mb-[20px]">
          <span>What do you want?</span>
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
            size="input-select-lg"
            additionalClasses="w-[300px]"
            value={want}
            handleChange={setWant}
          />
        </div>

        <div className="mb-[20px]">
          <CheckboxGroup
            size="input-checkbox-lg"
            values={test}
            handleChange={setTest}
            options={[
              {
                label: "Test 1",
                value: "test1",
              },
              {
                label: "Test 2",
                value: "test2",
              },
            ]}
            name="test"
          />
        </div>

        <div className="mb-[20px]">
          <Checkbox
            name="Terms"
            label="I agree to the terms and conditions"
            id="terms"
            checked={terms}
            handleChange={setTerms}
            size="input-checkbox-lg"
          />
        </div>

        <div className="mb-[20px]">
          <span>Message:</span>
          {/* <Textarea
            name="message"
            id="message"
            checked={message}
            handleChange={setMessage}
            additionalClasses="w-[300px]"
            size="input-textarea-lg"
          /> */}
        </div>

        <FieldGroup
          label="Message"
          desc="Want to say something"
          optional="Optional"
          labelFor="message"
          additionalClasses="w-[300px]"
          caption="An error message an error message an error message"
          state="error"
          required
        >
          <Textarea
            name="message"
            id="message"
            checked={message}
            handleChange={setMessage}
            additionalClasses="w-full mt-[12px]"
            size="input-textarea-lg"
            rows={5}
            showCount
          />
        </FieldGroup>
        <button
          type="submit"
          className="prod-btn-sm md:prod-btn-base lg:prod-btn-lg prod-btn-destructive"
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
};
export default TestForm;
