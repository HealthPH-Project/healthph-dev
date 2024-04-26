import { useState } from "react";
import FieldGroup from "../../components/FieldGroup";
import Input from "../../components/Input";
import InputPassword from "../../components/InputPassword";
import PasswordRequirements from "../../components/auth/PasswordRequirements";
import Checkbox from "../../components/Checkbox";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CustomSelect from "../../components/CustomSelect";
import Stepper from "../../components/auth/Stepper";
import {
  useRegisterUserMutation,
  useResetPasswordMutation,
} from "../../features/api/authAPISlice";

const Register = () => {
  const [formData, setFormData] = useState({
    department_level: "",
    organization: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    re_password: "",
  });
  const [pwdFlags, setPWDFlags] = useState({
    length: "",
    lowercase: "",
    uppercase: "",
    number: "",
    character: "",
  });
  const [terms, setTerms] = useState(false);
  const [formErrors, setFormErrors] = useState({
    department_level: "",
    organization: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    re_password: "",
    terms: "",
  });

  const [currentStep, setCurrentStep] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  const [accountCreated, setAccountCreated] = useState(false);

  const [registerUser] = useRegisterUserMutation();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkError()) {
      setIsLoading(true);

      const response = await registerUser(formData);

      if (!response) {
        console.log("Error creating user.");
        setIsLoading(false);
        return;
      }

      if ("error" in response) {
        const { detail } = response["error"]["data"];

        detail.map(({ field, error }, i) => {
          if (field in formData) {
            setFormErrors((formErrors) => ({
              ...formErrors,
              [field]: error,
            }));
          }
        });

        let step = 3;

        const stepOneFields = ["department_level", "organization"];
        const stepTwoFields = ["first_name", "last_name", "email"];

        if (detail.find((err) => stepOneFields.includes(err["field"]))) {
          step = 1;
        } else if (detail.find((err) => stepTwoFields.includes(err["field"]))) {
          step = 2;
        }

        setCurrentStep(step);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      setAccountCreated(true);
    }
  };

  const checkError = () => {
    let flag = false;
    for (const key in pwdFlags) {
      if (pwdFlags[key] != "success") {
        setFormErrors((formErrors) => ({
          ...formErrors,
          password: "Must follow the following requirements.",
        }));
        flag = true;
        break;
      }
    }

    if (formData.password != formData.re_password) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        re_password: "Passwords do not match.",
      }));
      flag = true;
    }

    if (terms == false) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        terms: "Must agree to Terms of Use and Privacy Policy",
      }));
      flag = true;
    }

    return flag;
  };

  return (
    <>
      {!accountCreated ? (
        <form method="post" onSubmit={handleSubmit}>
          <Stepper noOfSteps="3" currentStep={currentStep} />
          {currentStep == 1 && (
            <StepOne
              formData={formData}
              formErrors={formErrors}
              setFormData={setFormData}
              setFormErrors={setFormErrors}
              setCurrentStep={setCurrentStep}
            />
          )}
          {currentStep == 2 && (
            <StepTwo
              formData={formData}
              formErrors={formErrors}
              setFormData={setFormData}
              setFormErrors={setFormErrors}
              setCurrentStep={setCurrentStep}
            />
          )}
          {currentStep == 3 && (
            <StepThree
              formData={formData}
              terms={terms}
              pwdFlags={pwdFlags}
              formErrors={formErrors}
              setFormData={setFormData}
              setPWDFlags={setPWDFlags}
              setTerms={setTerms}
              setFormErrors={setFormErrors}
              setCurrentStep={setCurrentStep}
              isLoading={isLoading}
            />
          )}
        </form>
      ) : (
        <>
          <p className="heading">Account Created</p>
          <p className="subheading">
            Your account has successfully been{" "}
            <span className="font-semibold">created</span> and sent for
            <span className="font-semibold"> verification!</span>
          </p>
          <p className="subheading">
            You can now sign in to HealthPH with{" "}
            <span className="font-semibold text-destructive-500">
              limited access
            </span>
            . You will receive another email in 1-2 business days once you are
            verified or not.
          </p>
          <NavLink
            to="/login"
            className="prod-btn-base prod-btn-primary w-full text-center"
          >
            Back to Sign In
          </NavLink>
        </>
      )}
    </>
  );
};

const StepOne = ({
  formData,
  formErrors,
  setFormData,
  setFormErrors,
  setCurrentStep,
}) => {
  const handleChangeDepartment = (value) => {
    setFormData({ ...formData, department_level: value });
    setFormErrors((formErrors) => ({
      ...formErrors,
      department_level: "",
    }));
  };

  const checkError = () => {
    let flag = false;

    if (formData.department_level == "") {
      setFormErrors((formErrors) => ({
        ...formErrors,
        department_level: "Must choose department level.",
      }));
      flag = true;
    }

    if (
      formData.organization == "" ||
      formData.organization.trim().length == 0
    ) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        organization: "Must enter organization.",
      }));
      flag = true;
    }

    return flag;
  };
  return (
    <>
      <p className="heading">Join HealthPH Today!</p>
      <p className="subheading">
        First, accurately provide your department level and the organization you
        are in for efficient verification.
      </p>
      <FieldGroup
        label="Department Level"
        labelFor="department"
        additionalClasses="w-full mb-[20px]"
        caption={
          formErrors.department_level != "" ? formErrors.department_level : ""
        }
        state={formErrors.department_level != "" ? "error" : ""}
      >
        <CustomSelect
          options={[
            {
              label: "National Level Office",
              value: "national",
            },
            {
              label: "Regional Level Office",
              value: "regional",
            },
            {
              label: "Provincial Level Office",
              value: "provincial",
            },
            {
              label: "City Level Office",
              value: "city",
            },
            {
              label: "Municipal Level Office",
              value: "municipal",
            },
          ]}
          id="department"
          placeholder="Select Department Level"
          size="input-select-md"
          value={formData.department_level}
          handleChange={handleChangeDepartment}
          additionalClasses="w-full  mt-[8px]"
          state={formErrors.department_level != "" ? "error" : ""}
          editable={true}
        />
      </FieldGroup>
      <FieldGroup
        label="Organization"
        labelFor="organization"
        additionalClasses="w-full mb-[20px]"
        caption={formErrors.organization != "" ? formErrors.organization : ""}
        state={formErrors.organization != "" ? "error" : ""}
      >
        <Input
          size="input-md"
          id="organization"
          type="text"
          additionalClasses="w-full mt-[8px]"
          placeholder="Enter organization"
          value={formData.organization}
          onChange={(e) => {
            setFormData({ ...formData, organization: e.target.value });
            setFormErrors({ ...formErrors, organization: "" });
          }}
          state={formErrors.organization != "" ? "error" : ""}
          // required
        />
      </FieldGroup>
      <button
        type="button"
        className="prod-btn-base prod-btn-primary w-full mt-[4px] mb-[32px]"
        onClick={() => {
          if (!checkError()) {
            setCurrentStep(2);
          }
        }}
      >
        Continue
      </button>
      <p className="text-center">
        <span className=" prod-p2 text-gray-700 font-medium">
          Already have an account?
        </span>
        <NavLink to="/login"> Sign In</NavLink>
      </p>
    </>
  );
};

const StepTwo = ({
  formData,
  formErrors,
  setFormData,
  setFormErrors,
  setCurrentStep,
}) => {
  const checkError = () => {
    let flag = false;

    if (formData.first_name == "" || formData.first_name.trim().length == 0) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        first_name: "Must enter first name.",
      }));
      flag = true;
    }

    if (formData.last_name == "" || formData.last_name.trim().length == 0) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        last_name: "Must enter last name.",
      }));
      flag = true;
    }

    const validEmail =
      /^([a-z0-9]+[a-z0-9!#$%&'*+/=?^_`{|}~-]?(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/;

    if (formData.email == "" || formData.email.trim().length == 0) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        email: "Must enter email address.",
      }));
      flag = true;
    } else if (!validEmail.test(formData.email)) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        email: "Must enter valid email address.",
      }));
      flag = true;
    }

    return flag;
  };
  return (
    <>
      <p className="heading">Join HealthPH Today!</p>
      <p className="subheading">
        Accurately provide your account details to get verified from HealthPH.
      </p>
      <FieldGroup
        label="First Name"
        labelFor="first-name"
        additionalClasses="w-full mb-[20px]"
        caption={formErrors.first_name != "" ? formErrors.first_name : ""}
        state={formErrors.first_name != "" ? "error" : ""}
      >
        <Input
          size="input-md"
          id="first-name"
          type="text"
          additionalClasses="w-full mt-[8px]"
          placeholder="Enter first name"
          value={formData.first_name}
          onChange={(e) => {
            setFormData({ ...formData, first_name: e.target.value });
            setFormErrors({ ...formErrors, first_name: "" });
          }}
          state={formErrors.first_name != "" ? "error" : ""}
          // required
        />
      </FieldGroup>
      <FieldGroup
        label="Last Name"
        labelFor="last-name"
        additionalClasses="w-full mb-[20px]"
        caption={formErrors.last_name != "" ? formErrors.last_name : ""}
        state={formErrors.last_name != "" ? "error" : ""}
      >
        <Input
          size="input-md"
          id="last-name"
          type="text"
          additionalClasses="w-full mt-[8px]"
          placeholder="Enter last name"
          value={formData.last_name}
          onChange={(e) => {
            setFormData({ ...formData, last_name: e.target.value });
            setFormErrors({ ...formErrors, last_name: "" });
          }}
          state={formErrors.last_name != "" ? "error" : ""}
          // required
        />
      </FieldGroup>
      <FieldGroup
        label="Email"
        labelFor="email"
        additionalClasses="w-full mb-[20px]"
        caption={formErrors.email != "" ? formErrors.email : ""}
        state={formErrors.email != "" ? "error" : ""}
      >
        <Input
          size="input-md"
          id="email"
          type="text"
          additionalClasses="w-full mt-[8px]"
          placeholder="Enter email"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            setFormErrors({ ...formErrors, email: "" });
          }}
          state={formErrors.email != "" ? "error" : ""}
          // required
        />
      </FieldGroup>
      <button
        type="button"
        className="prod-btn-base prod-btn-primary w-full mt-[4px] mb-[18px]"
        onClick={() => {
          if (!checkError()) {
            setCurrentStep(3);
          }
        }}
      >
        Continue
      </button>
      <button
        type="button"
        className="prod-btn-base prod-btn-secondary w-full"
        onClick={() => setCurrentStep(1)}
      >
        Go Back
      </button>
    </>
  );
};

const StepThree = ({
  formData,
  pwdFlags,
  terms,
  formErrors,
  setFormData,
  setPWDFlags,
  setTerms,
  setFormErrors,
  setCurrentStep,
  isLoading,
}) => {
  const handleChangeTerms = (value) => {
    setTerms(value);
    setFormErrors((formErrors) => ({
      ...formErrors,
      terms: "",
    }));
  };

  return (
    <>
      <p className="heading">Creating a Password</p>
      <p className="subheading">
        Provide your password to secure your account.
      </p>
      <FieldGroup
        label="Password"
        labelFor="password"
        additionalClasses="w-full mb-[8px]"
        caption={formErrors.password != "" ? formErrors.password : ""}
        state={formErrors.password != "" ? "error" : ""}
      >
        <InputPassword
          size="input-md"
          id="password"
          additionalClasses="w-full mt-[8px]"
          placeholder="Enter new password"
          value={formData.password}
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
            setFormErrors({ ...formErrors, password: "" });
          }}
          state={formErrors.password != "" ? "error" : ""}
          required
        />
      </FieldGroup>
      <PasswordRequirements
        password={formData.password}
        pwdFlags={pwdFlags}
        handleChange={setPWDFlags}
      />
      <FieldGroup
        label="Confirm Password"
        labelFor="re-password"
        additionalClasses="w-full mb-[8px]"
        caption={formErrors.re_password != "" ? formErrors.re_password : ""}
        state={formErrors.re_password != "" ? "error" : ""}
      >
        <InputPassword
          size="input-md"
          id="re-password"
          additionalClasses="w-full mt-[8px]"
          placeholder="Re-enter password"
          value={formData.re_password}
          onChange={(e) => {
            setFormData({ ...formData, re_password: e.target.value });
            setFormErrors({ ...formErrors, re_password: "" });
          }}
          caption="An error message an error message an error message"
          state={formErrors.re_password != "" ? "error" : ""}
          required
        />
      </FieldGroup>
      <FieldGroup
        additionalClasses="w-full mb-[24px]"
        caption={formErrors.terms != "" ? formErrors.terms : ""}
        state={formErrors.terms != "" ? "error" : ""}
      >
        <Checkbox
          name="terms"
          id="terms"
          checked={terms}
          handleChange={handleChangeTerms}
          size="input-checkbox-sm"
          additionalClasses="items-start mt-[24px] mb-[8px]"
        >
          <p className="ms-[10px] mt-[-2px] text-[14px] leading-[20px] text-gray-700">
            By creating your account, you agree to HealthPH's{" "}
            <Link
              to="/terms-of-use"
              className="!text-[14px] !leading-[20px] !text-primary-500"
            >
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link
              to="Privacy Policy"
              className=" !text-[14px] !leading-[20px] !text-primary-500"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </Checkbox>
      </FieldGroup>
      <button
        type="submit"
        className="prod-btn-base prod-btn-primary w-full mb-[18px]"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create Account"}
      </button>
      <button
        type="button"
        className="prod-btn-base prod-btn-secondary w-full"
        onClick={() => setCurrentStep(2)}
      >
        Go Back
      </button>
    </>
  );
};

export default Register;
