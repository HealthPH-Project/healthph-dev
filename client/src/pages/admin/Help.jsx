import EmptyState from "../../components/admin/EmptyState";

const Help = () => {
  return (
    <EmptyState
      iconName="QuestionCircle"
      heading="Help Content Unavailable"
      content="We're working on providing instructions in using the system. For immediate assistance, please contact our support team."
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
export default Help;
