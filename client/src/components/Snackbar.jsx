import Icon from "./Icon";

const Snackbar = ({ size, color, iconName, message }) => {
  return (
    <div className={`snackbar ${size} snackbar-${color}`}>
      <Icon iconName={iconName} className="icon" />
      <p className="message">{message}</p>
    </div>
  );
};
export default Snackbar;
