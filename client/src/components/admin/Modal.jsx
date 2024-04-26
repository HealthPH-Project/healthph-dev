const Modal = ({
  onConfirm,
  onConfirmLabel,
  onCancel,
  onLoading,
  onLoadingLabel,
  heading,
  content,
  color,
  additionalClasses,
}) => {
  return (
    <div className={`modal ${additionalClasses}`}>
      <div
        className="modal-backdrop"
        onClick={onLoading ? null : onCancel}
      ></div>
      <div className="modal-container">
        <div className="modal-body">
          <p className="modal-heading">{heading}</p>
          <p className="modal-content">{content}</p>
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
            className={`prod-btn-base prod-btn-${
              color ?? "primary"
            } mb-[16px] sm:mb-0`}
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
export default Modal;
