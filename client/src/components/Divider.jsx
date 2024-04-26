const Divider = ({ type, className }) => {
  return (
    <>
      {type == "horizontal" ? (
        <div className={`w-full ${className}`}></div>
      ) : type == "vertical" ? (
        <div className={`h-full ${className}`}></div>
      ) : (
        <></>
      )}
    </>
  );
};
export default Divider;
