const Stepper = ({ noOfSteps, currentStep }) => {
  return (
    <div className="stepper" style={{ "--no-of-steps": `${noOfSteps}` }}>
      {Array.from({ length: noOfSteps }).map((v, i) => {
        return (
          <div
            key={i}
            className={`stepper-item ${currentStep == i + 1 ? "active" : ""}`}
          ></div>
        );
      })}
    </div>
  );
};
export default Stepper;
