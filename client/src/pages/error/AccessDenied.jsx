import { Link } from "react-router-dom";
import EmptyState from "../../components/admin/EmptyState";

const AccessDenied = () => {
  return (
    <EmptyState
      iconName="Lock"
      heading="Access Denied"
      content="You don't have permission to access this area. Please return to the previous page or reach out to support if assistance is needed."
    >
      <a
        href={"mailto:" + import.meta.env.VITE_HEALTHPH_EMAIL}
        className="prod-btn-base prod-btn-primary flex justify-center items-center"
      >
        Contact Support
      </a>
    </EmptyState>
  );
};
export default AccessDenied;
