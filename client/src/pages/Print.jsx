import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useCreateActivityLogMutation } from "../features/api/activityLogsSlice";

const Print = () => {
  const [log_activity] = useCreateActivityLogMutation();

  const location = useLocation();

  const navigate = useNavigate();

  const printRef = useRef(null);

  useEffect(() => {
    if (!location.state && !location.state?.data) {
      navigate("/", { replace: true });
    } else {
      setTimeout(handlePrint, 1000);
    }
  }, []);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: location.state?.data?.documentTitle,
    pageStyle:
      "@page { size: A4;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",
    onAfterPrint: () => {
      //   document.getElementById("printWindow").remove();
      //   log_activity({ ...location.state?.data?.log_activity });
      navigate(-1);
    },
  });

  return (
    <main className="print-page">
      <h1>Printing...</h1>
      <div className="print-image" ref={printRef}>
        <img src={location.state?.data?.imageData} alt="print-preview" />
      </div>
    </main>
  );
};
export default Print;
