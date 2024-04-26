import { useState } from "react";

const Textarea = ({
  additionalClasses,
  size,
  state,
  showCount,
  handleChange,
  ...props
}) => {
  const [charCount, setCharCount] = useState(0);
  const inputState = state ? "input-" + state : "";

  return (
    <div className={`input-textarea-wrapper relative ${additionalClasses}`}>
      <textarea
        className={`input-textarea ${size} ${inputState} w-full`}
        maxLength={props.maxLength ?? 100}
        onChange={(e) => {
          handleChange(e.target.value);
          setCharCount(e.target.value.length);
        }}
        {...props}
      ></textarea>
      {showCount && (
        <span className="char-count">
          {charCount}/{props.maxLength ?? 100}
        </span>
      )}
    </div>
  );
};
export default Textarea;
