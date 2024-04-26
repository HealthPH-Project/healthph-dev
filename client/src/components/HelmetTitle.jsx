import { Helmet } from "react-helmet-async";

const HelmetTitle = ({ title }) => {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};
export default HelmetTitle;
