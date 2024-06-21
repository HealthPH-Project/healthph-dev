import { useSelector } from "react-redux";
import CustomSelect from "../CustomSelect";
import Icon from "../Icon";

const Report = ({
  heading,
  caption,
  filter,
  setFilter,
  isLoading,
  children,
  additionalClasses,
}) => {
  const user = useSelector((state) => state.auth.user);
  const regions = [
    { label: "All Regions", value: "all" },
    { label: "Region NCR", value: "NCR" },
    { label: "Region I", value: "I" },
    { label: "Region II", value: "II" },
    { label: "Region III", value: "III" },
    { label: "Region CAR", value: "CAR" },
    { label: "Region IV-A", value: "IVA" },
    { label: "Region IV-B", value: "IVB" },
    { label: "Region V", value: "V" },
    { label: "Region VI", value: "VI" },
    { label: "Region VII", value: "VII" },
    { label: "Region VIII", value: "VIII" },
    { label: "Region IX", value: "IX" },
    { label: "Region X", value: "X" },
    { label: "Region XI", value: "XI" },
    { label: "Region XII", value: "XII" },
    { label: "Region XIII", value: "XIII" },
    { label: "Region BARMM", value: "BARMM" },
  ];

  const filterRegions =
    user.user_type == "USER"
      ? regions.filter((r) => user.accessible_regions.includes(r.value))
      : regions;

  return (
    <div className={"report-container " + additionalClasses}>
      <div className="flex justify-between flex-col md:flex-row mb-[16px] md:mb-0">
        <div className="mb-[20px]">
          <p className="heading">{heading}</p>
          {caption && <p className="caption">{caption}</p>}
        </div>
        <div className="w-full max-w-[200px]">
          <CustomSelect
            options={filterRegions}
            placeholder="Select Region"
            size="input-select-md"
            value={filter}
            handleChange={(e) => setFilter(e)}
            additionalClasses="w-full"
            menuMaxHeight="max-h-[300px]"
          />
        </div>
      </div>
      {isLoading ? (
        <div className="report-placeholder">
          <Icon iconName="Analytics" height="240px" width="240px" />
        </div>
      ) : (
        children
      )}

      {/* <div className="report-table">
        <div className="report-table-header">
          <div className="item"></div>
          <div className="item">Label</div>
          <div className="item">Label</div>
          <div className="item">Label</div>
        </div>
        {Array.from({ length: 4 }).map((v, i) => {
          return (
            <div key={i} className="report-table-row">
              <div className="item">Data</div>
              <div className="item">Data</div>
              <div className="item">Data</div>
              <div className="item">Data</div>
            </div>
          );
        })}
      </div> */}
    </div>
  );
};
export default Report;
