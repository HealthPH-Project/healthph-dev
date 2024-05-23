const SkeletonBody = ({ columns }) => {
  return (
    <div className="skeleton">
      <div className="skeleton-body">
        <div className="skeleton-table">
          <div className="skeleton-table-header border-b">
            <div className="w-[150px] me-4"></div>
            <div className="w-[150px]"></div>
          </div>
          <div
            className="skeleton-table-body"
            style={{ "--skeleton-columns": columns }}
          >
            <div className="skeleton-table-body-header">
              <div className="skeleton-grid h-full">
                {Array.from({ length: columns }).map((v, i) => {
                  return (
                    <div className="h-[16px] skeleton-cell" key={i}>
                      <div className="h-full"></div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex-grow overflow-hidden">
              {Array.from({ length: 100 }).map((v, i) => {
                return (
                  <div className="skeleton-grid h-[48px]" key={i}>
                    {Array.from({ length: columns }).map((v, i) => {
                      return (
                        <div className="h-[20px] skeleton-cell" key={i}>
                          <div className=" bg-[#DCE3E8] h-full rounded-[4px]"></div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="skeleton-table-footer border-t justify-between">
            <div className="w-[150px] me-4"></div>
            <div className="w-[200px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SkeletonBody;
