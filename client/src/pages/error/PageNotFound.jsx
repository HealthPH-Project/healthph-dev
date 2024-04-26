import { Link } from "react-router-dom";
import EmptyState from "../../components/admin/EmptyState";

const PageNotFound = () => {
  return (
    <EmptyState
      iconName="PaperFail"
      heading="Page Not Found"
      content="The page you're looking for doesn't exist. Let's get you back on track by heading to Analytics."
    >
      <Link
        to="/dashboard"
        className="prod-btn-base prod-btn-primary flex justify-center items-center"
      >
        Go to Analytics
      </Link>
    </EmptyState>
  );
};
export default PageNotFound;
