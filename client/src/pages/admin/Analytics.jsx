import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "../../components/Icon";
import CustomSelect from "../../components/CustomSelect";
import { useEffect, useRef, useState } from "react";
import { format, subDays } from "date-fns";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  LabelList,
} from "recharts";
import {
  useGenerateFrequentWordsQuery,
  useGeneratePercentageQuery,
  useGenerateSuspectedSymptomsQuery,
  useGenerateWordCloudQuery,
} from "../../features/api/analyticsSlice";
import Report from "../../components/admin/Report";
import { ReactToPrint, useReactToPrint } from "react-to-print";
import PrintAnalytics from "../../components/admin/PrintAnalytics";
import { useSelector } from "react-redux";
import EmptyState from "../../components/admin/EmptyState";
import { useFetchPointsQuery } from "../../features/api/pointsSlice";
import { useFetchDatasetsQuery } from "../../features/api/datasetsSlice";
import SkeletonAnalytics from "../../components/admin/SkeletonAnalytics";
import { useCreateActivityLogMutation } from "../../features/api/activityLogsSlice";
import capitalizeSymptom from "../../hooks/useCapitalizeSymptom";
import ReactWordCloud from "react-wordcloud";
import { saveSvgAsPng, svgAsPngUri } from "save-svg-as-png";

import { toPng } from "html-to-image";
import { toast } from "react-toastify";
import Snackbar from "../../components/Snackbar";
import useDeviceDetect from "../../hooks/useDeviceDetect";

const Analytics = () => {
  const user = useSelector((state) => state.auth.user);

  const [log_activity] = useCreateActivityLogMutation();

  const [isAnalyticsAvailable, setIsAnalyticsAvailable] = useState(false);

  const { data: points, isFetching: isPointsFetching } = useFetchPointsQuery();

  const { data: datasets, isFetching: isDatasetsFetching } =
    useFetchDatasetsQuery();

  const [filters, setFilters] = useState({
    dateRange: 7,
  });

  const handleChangeFilter = (key, value) => {
    setFilters((filters) => ({
      ...filters,
      [key]: value,
    }));
  };

  const getDateRangeOptions = () => {
    const dateNow = new Date();
    const values = [7, 14, 21, 28];
    const options = [];

    Array.from(values).forEach((v) => {
      options.push({
        label:
          `Past ${v} Days ` +
          format(subDays(dateNow, v), "(MMM d - ") +
          format(dateNow, "MMM d, yyyy)"),
        value: v,
      });
    });
    return options;
  };

  const { data: suspected_symptoms, isFetching: isSuspectedSymptomsFetcing } =
    useGenerateSuspectedSymptomsQuery();

  const [topWordsFilter, setTopWordsFilter] = useState(
    user.user_type == "USER" ? user.accessible_regions[0] : "all"
  );

  let { data: frequent_words, isFetching: isTopWordsFetching } =
    useGenerateFrequentWordsQuery(topWordsFilter);

  const [percentageFilter, setPercentageFilter] = useState(
    user.user_type == "USER" ? user.accessible_regions[0] : "all"
  );

  let { data: percentage, isFetching: isPercentageFetching } =
    useGeneratePercentageQuery();

  const COLORS = ["#F5D76E", "#6A8EB5", "#F78C6B", "#78C6B2"];
  const RADIAN = Math.PI / 180;

  const [wordCloudFilter, setWordCloudFilter] = useState(
    user.user_type == "USER" ? user.accessible_regions[0] : "all"
  );

  const { data: wordcloud, isFetching: isWordCloudFetching } =
    useGenerateWordCloudQuery(wordCloudFilter);

  const wordcloudOptions = {
    colors: ["#171E26", "#F5D76E", "#6A8EB5", "#F78C6B", "#78C6B2"],
    rotations: 0,
    deterministic: true,
    padding: 20,
    fontSizes: [20, 50],
    scale: "linear",
  };

  const [wordCloudImage, setWordCloudImage] = useState(
    import.meta.env.VITE_API_URL + "/wordcloud/all"
  );

  const [dynamicWordCloudImage, setDynamicWordCloudImage] = useState("");

  const printRef = useRef();

  const { deviceType } = useDeviceDetect();

  const [showPrint, setShowPrint] = useState(false);

  const navigate = useNavigate();

  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);

    const wordcloudToPrint = document.querySelector("#wordcloud-print svg");

    svgAsPngUri(wordcloudToPrint).then((uri) => {
      setDynamicWordCloudImage(uri);
    });

    if (["mobile", "tablet"].includes(deviceType)) {
      setShowPrint(true);
      setTimeout(handleExportAnalytics, 1000);
    } else {
      setTimeout(handlePrintAnalytics, 1000);
    }
  };

  const handlePrintAnalytics = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "HealthPH - Analytics",
    pageStyle:
      "@page { size: A4;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",
    onAfterPrint: () => {
      setIsPrinting(false);
      document.getElementById("printWindow").remove();

      log_activity({
        user_id: user.id,
        entry: "Generated Analytics report",
        module: "Analytics",
      });
    },
  });

  const handleExportAnalytics = async () => {
    try {
      const imageData = await toPng(printRef.current, {
        canvasWidth: printRef.current.offsetWidth * 2,
        canvasHeight: printRef.current.offsetHeight * 2,
        quality: 1,
        pixelRatio: 1,
      });

      navigate("/print", {
        state: {
          data: {
            documentTitle: "HealthPH - Analytics",
            imageData: imageData,
            log_activity: {
              user_id: user.id,
              entry: "Generated Analytics report - test",
              module: "Analytics",
            },
          },
        },
      });
    } catch (error) {
      toast(
        <Snackbar
          iconName="Error"
          size="snackbar-sm"
          color="destructive"
          message={"Failed to generate report. Please try again."}
        />,
        {
          closeButton: ({ closeToast }) => (
            <Icon
              iconName="Close"
              className="close-icon close-icon-sm close-destructive"
              onClick={closeToast}
            />
          ),
        }
      );
    }
  };

  const displayPrintButton = () => {
    let flag = true;
    flag =
      isSuspectedSymptomsFetcing ||
      isTopWordsFetching ||
      isWordCloudFetching ||
      isPercentageFetching;
    return !flag;
  };

  useEffect(() => {
    if (!isWordCloudFetching) {
      if (wordcloud == "No datasets.") {
        setWordCloudImage("none");
      } else {
        setWordCloudImage(
          import.meta.env.VITE_API_URL + "/wordcloud/" + wordCloudFilter
        );
      }
    }
  }, [isWordCloudFetching, wordcloud]);

  return isPointsFetching || isDatasetsFetching ? (
    <SkeletonAnalytics />
  ) : points.length == 0 || datasets.length == 0 ? (
    <EmptyState
      iconName="Analytics"
      heading="Analytics Unavailable"
      content="No analytics data to show right now. Data will appear here as it becomes available."
    >
      <Link
        to="/dashboard/trends-map/upload-dataset"
        className="prod-btn-base prod-btn-primary flex justify-center items-center"
      >
        <span>Upload Dataset</span>
      </Link>
    </EmptyState>
  ) : (
    <>
      <div className="admin-wrapper flex flex-col h-full">
        <div className="header">
          <div className="breadcrumbs-wrapper">
            <div className="breadcrumb-item">
              <NavLink to="/dashboard">Analytics</NavLink>
              <Icon
                iconName="ChevronRight"
                height="16px"
                width="16px"
                fill="#A1ACB8"
                className="icon"
              />
            </div>
          </div>
        </div>
        <div ref={printRef}></div>
        <section className="analytics-section">
          <div className="header flex-col md:flex-row  items-start md:items-center">
            <div className="heading mb-[20px] md:mb-0">
              Suspected Conditions
            </div>
            <div className="w-full sm:w-auto flex flex-col xs:flex-row justify-start lg:justify-center items-start xs:items-center">
              {displayPrintButton() && (
                <>
                  <button
                    className="prod-btn-base prod-btn-secondary flex justify-center items-center mb-[16px] xs:mb-0"
                    onClick={handlePrint}
                    disabled={isPrinting}
                  >
                    {isPrinting ? (
                      <span>Printing...</span>
                    ) : (
                      <>
                        <span>Print</span>

                        <Icon
                          iconName="Printer"
                          height="20px"
                          width="20px"
                          fill="#8693A0"
                          className="ms-[8px]"
                        />
                      </>
                    )}
                  </button>
                  <PrintAnalytics
                    showPrint={showPrint}
                    ref={printRef}
                    data={{
                      suspected_symptoms: suspected_symptoms,
                      frequent_words: frequent_words,
                      frequent_words_filter: topWordsFilter,
                      percentage: percentage[percentageFilter],
                      percentage_filter: percentageFilter,
                      wordcloud: wordCloudImage,
                      wordcloud_filter: wordCloudFilter,
                      wordcloud_data: wordcloud,
                      dynamicWordCloudImage: dynamicWordCloudImage,
                    }}
                    dateTable={format(new Date(), "MMMM dd, yyyy | hh:mm a")}
                  />
                </>
              )}
              {/* <CustomSelect
                options={getDateRangeOptions()}
                placeholder="Select Date Range"
                size="input-select-md"
                value={filters.dateRange}
                handleChange={(e) => handleChangeFilter("dateRange", e)}
                additionalClasses="w-full min-w-[100px] ms-0 xs:ms-[16px]"
              /> */}
            </div>
          </div>
          <div className="analytics-content">
            <div className="analytics-cards">
              <AnalyticCardItem
                label="TOTAL SUSPECTED"
                isPrimary
                data={
                  !isSuspectedSymptomsFetcing && suspected_symptoms
                    ? suspected_symptoms["total"]
                    : null
                }
              />
              <AnalyticCardItem
                label="PTB"
                data={
                  !isSuspectedSymptomsFetcing && suspected_symptoms
                    ? suspected_symptoms["TB"]
                    : null
                }
              />
              <AnalyticCardItem
                label="PNEUMONIA"
                data={
                  !isSuspectedSymptomsFetcing && suspected_symptoms
                    ? suspected_symptoms["PN"]
                    : null
                }
              />
              <AnalyticCardItem
                label="COVID"
                data={
                  !isSuspectedSymptomsFetcing && suspected_symptoms
                    ? suspected_symptoms["COVID"]
                    : null
                }
              />
              <AnalyticCardItem
                label="AURI"
                data={
                  !isSuspectedSymptomsFetcing && suspected_symptoms
                    ? suspected_symptoms["AURI"]
                    : null
                }
              />
            </div>
          </div>
        </section>

        <section className="analytics-section">
          <div className="header">
            <div className="heading">Reports</div>
            <div className="flex flex-row justify-center items-center">
              {/* <button className="prod-btn-base prod-btn-secondary flex justify-center items-center ">
                <span>Print</span>
                <Icon
                  iconName="Printer"
                  height="20px"
                  width="20px"
                  fill="#8693A0"
                  className="ms-[8px]"
                />
              </button> */}
            </div>
          </div>

          <div className="analytics-content">
            <div className="analytics-reports">
              {/* REPORT - TOP WORDS*/}
              <Report
                heading="Top Words"
                filter={topWordsFilter}
                setFilter={setTopWordsFilter}
                isLoading={isTopWordsFetching}
              >
                <ResponsiveContainer width="100%" maxHeight={500}>
                  {frequent_words && (
                    <BarChart
                      data={frequent_words["frequent_words"]}
                      margin={{
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                      }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        padding={{ left: 20, right: 20 }}
                        tickLine={false}
                      />
                      <YAxis
                        hide={true}
                        dataKey="word"
                        type="category"
                        tickCount={6}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip />
                      <Legend
                        verticalAlign="top"
                        align="left"
                        iconSize={20}
                        height={60}
                        content={({ payload }) => {
                          return (
                            <div className="flex items-center">
                              {payload.map((entry, index) => {
                                const { color, value } = entry;
                                return (
                                  <div
                                    className="flex items-center me-[16px]"
                                    id={`${index}-${value}-${Math.floor(
                                      Math.random() * 100
                                    )}`}
                                    key={`${index}-${value}-${Math.floor(
                                      Math.random() * 100
                                    )}`}
                                  >
                                    <div
                                      className="h-[16px] w-[16px] rounded-[4px] me-[10px]"
                                      style={{ backgroundColor: color }}
                                    ></div>
                                    <span className="prod-l3 text-gray-900 capitalize">
                                      {value}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }}
                      />
                      <Bar
                        dataKey="frequency"
                        fill="#B5A8DE"
                        maxBarSize={18}
                        radius={[0, 8, 8, 0]}
                      >
                        <LabelList
                          dataKey="word"
                          content={({ x, y, value }) => {
                            return (
                              <text
                                x={x}
                                y={y - 5}
                                className="recharts-text recharts-cartesian-axis-tick-value text-[16px]"
                                fill="#666"
                              >
                                <tspan>{capitalizeSymptom(value)}</tspan>
                              </text>
                            );
                          }}
                        />
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </Report>

              {/* REPORT - PERCENTAGE */}
              <Report
                heading="Suspected Conditions Percentage"
                filter={percentageFilter}
                setFilter={setPercentageFilter}
                isLoading={isPercentageFetching}
              >
                <ResponsiveContainer width="100%" maxHeight={500}>
                  {percentage && (
                    <PieChart>
                      <Legend
                        verticalAlign="top"
                        align="left"
                        iconSize={20}
                        height={60}
                        content={({ payload }) => {
                          return (
                            <div className="flex items-center flex-wrap">
                              {payload.map((entry, index) => {
                                const { color, value } = entry;
                                return (
                                  <div
                                    className="flex items-center me-[16px] mb-[8px]"
                                    key={index}
                                  >
                                    <div
                                      className="h-[16px] w-[16px] rounded-[4px] me-[10px]"
                                      style={{ backgroundColor: color }}
                                    ></div>
                                    <span className="prod-l3 text-gray-900">
                                      {value}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }}
                      />
                      <Pie
                        data={percentage[percentageFilter]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({
                          cx,
                          cy,
                          midAngle,
                          innerRadius,
                          outerRadius,
                          percent,
                          index,
                        }) => {
                          const radius =
                            innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);

                          return (
                            <text
                              x={x}
                              y={y}
                              fill="white"
                              textAnchor={x > cx ? "start" : "end"}
                              dominantBaseline="central"
                            >
                              {`${(percent * 100).toFixed(0)}%`}
                            </text>
                          );
                        }}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {percentage[percentageFilter].map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </Report>

              {/* REPORT - WORDCLOUD */}
              <Report
                heading="Word Cloud"
                filter={wordCloudFilter}
                setFilter={setWordCloudFilter}
                isLoading={isWordCloudFetching}
                additionalClasses="col-span-1 md:col-span-2 min-h-[400px]"
              >
                {!isWordCloudFetching && (
                  <div className="rounded-[8px] overflow-hidden border bg-[#F8F9FA] border-gray-50 flex justify-center items-center">
                    <ReactWordCloud
                      className="dynamic-wordcloud"
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                      words={wordcloud}
                      options={wordcloudOptions}
                    />
                  </div>
                )}
              </Report>

              <div className="fixed top-0 left-full w-[700px] h-[300px] bg-white z-[50]">
                <ReactWordCloud
                  id="wordcloud-print"
                  className="wordcloud-print"
                  style={{
                    border: "1px solid black",
                    height: "100%",
                    width: "100%",
                  }}
                  words={wordcloud}
                  options={wordcloudOptions}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

const AnalyticCardItem = ({ label, data, subtext, isPrimary = false }) => {
  const formatDataLength = (value, minDigit) => {
    return value.length > minDigit
      ? value.toString().padStart(minDigit, "0").slice(0, minDigit)
      : value.toString().padStart(minDigit, "0");
  };

  return (
    <div className="item">
      <div className={`wrapper ${isPrimary ? "primary" : ""}`}>
        <p className="label">{label}</p>
        <p className="data">
          {data ? formatDataLength(data["count"], 3) : "000"}
        </p>
        <p className="subtext">
          Regions Located:{" "}
          <span>
            {data ? formatDataLength(data["regions_located"].length, 2) : "00"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Analytics;
