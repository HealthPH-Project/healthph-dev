const ModalWithBody = ({
  onConfirm,
  onConfirmLabel,
  onCancel,
  onLoading,
  onLoadingLabel,
  heading,
  content,
  color,
  additionalClasses,
  children,
}) => {
  return (
    <div className={`modal ${additionalClasses}`}>
      <div
        className="modal-backdrop"
        onClick={onLoading ? null : onCancel}
      ></div>
      <div className="modal-container">
        <div className="modal-body !p-0">
          <p className="modal-heading !p-[20px] border-b-2 border-gray-50">
            {heading}
          </p>
          {children}
        </div>
        <div className="modal-actions">
          {onCancel && (
            <button
              className="prod-btn-base prod-btn-secondary me-0 sm:me-[16px]"
              onClick={onCancel}
              disabled={onLoading}
            >
              Cancel
            </button>
          )}
          <button
            className={`prod-btn-base prod-btn-${color ?? "primary"} ${
              onCancel ? "mb-[16px]" : ""
            } sm:mb-0`}
            onClick={onConfirm}
            disabled={onLoading}
          >
            {onLoading ? onLoadingLabel : onConfirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ModalWithBody;
