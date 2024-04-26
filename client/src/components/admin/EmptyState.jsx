import Icon from "../Icon";

const EmptyState = ({ heading, content, iconName, children }) => {
  return (
    <div className="empty-container">
      <div className="icon-wrapper">
        <Icon iconName={iconName} height="24px" width="24px" fill="#007AFF" />
      </div>
      <div className="empty-wrapper">
        <p className="empty-heading">{heading}</p>
        <div className="empty-content">{content}</div>
      </div>
      {children && (
        <div className="mt-[32px] flex justify-center items-center flex-col-reverse xs:flex-row">
          {children}
        </div>
      )}
    </div>
  );
};
export default EmptyState;
