import { NavLink } from "react-router-dom";
import Icon from "../../components/Icon";
import CustomSelect from "../../components/CustomSelect";
import { useEffect, useState } from "react";
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
  LineChart,
  Line,
  PieChart,
  Pie,
} from "recharts";
import {
  useGenerateFrequentWordsQuery,
  useGeneratePercentageQuery,
  useGenerateWordCloudQuery,
} from "../../features/api/analyticsSlice";
import Report from "../../components/admin/Report";

const Analytics = () => {
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

  const data = [
    {
      name: "Jan",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Feb",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Mar",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Apr",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
  ];

  const [topWordsFilter, setTopWordsFilter] = useState("all");

  let {
    data: frequent_words,
    isLoading,
    isFetching: isTopWordsFetching,
  } = useGenerateFrequentWordsQuery(topWordsFilter);

  const [percentageFilter, setPercentageFilter] = useState("all");

  let {
    data: percentage,
    isLoading: isPercentageLoading,
    isFetching: isPercentageFetching,
  } = useGeneratePercentageQuery(percentageFilter);

  const COLORS = ["#DBB324", "#007AFF", "#D82727", "#35CA3B"];
  const RADIAN = Math.PI / 180;

  const [wordCloudFilter, setWordCloudFilter] = useState("all");

  const { data: wordcloud, isFetching: isWordCloudFetching } =
    useGenerateWordCloudQuery(wordCloudFilter);

  return (
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

        <section className="analytics-section">
          <div className="header flex-col md:flex-row  items-start md:items-center">
            <div className="heading mb-[20px] md:mb-0">Suspected Symptoms</div>
            <div className="w-full sm:w-auto flex flex-col xs:flex-row justify-center items-start xs:items-center">
              <button
                className="prod-btn-base prod-btn-secondary flex justify-center items-center mb-[16px] xs:mb-0"
                onClick={() => {
                  print("asas");
                }}
              >
                <span>Print</span>
                <Icon
                  iconName="Printer"
                  height="20px"
                  width="20px"
                  fill="#8693A0"
                  className="ms-[8px]"
                />
              </button>
              <CustomSelect
                options={getDateRangeOptions()}
                placeholder="Select Date Range"
                size="input-select-md"
                value={filters.dateRange}
                handleChange={(e) => handleChangeFilter("dateRange", e)}
                additionalClasses="w-full min-w-[100px] ms-0 xs:ms-[16px]"
              />
            </div>
          </div>
          <div className="analytics-content">
            <div className="analytics-cards">
              <AnalyticCardItem label="TOTAL SUSPECTED" isPrimary />
              <AnalyticCardItem label="TUBERCOLOSIS" />
              <AnalyticCardItem label="PNEUMONIA" />
              <AnalyticCardItem label="COVID" />
              <AnalyticCardItem label="AURI" />
            </div>
          </div>
        </section>

        <section className="analytics-section">
          <div className="header">
            <div className="heading">Reports</div>
            <div className="flex flex-row justify-center items-center">
              <button className="prod-btn-base prod-btn-secondary flex justify-center items-center ">
                <span>Print</span>
                <Icon
                  iconName="Printer"
                  height="20px"
                  width="20px"
                  fill="#8693A0"
                  className="ms-[8px]"
                />
              </button>
            </div>
          </div>

          <div className="analytics-content">
            <div className="analytics-reports">
              <Report
                heading="Top Words"
                caption="Caption"
                filter={topWordsFilter}
                setFilter={setTopWordsFilter}
                isLoading={isTopWordsFetching}
              >
                <ResponsiveContainer width="100%" maxHeight={400}>
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
                        dataKey="Word"
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
                      <Bar
                        dataKey="Frequency"
                        stackId="a"
                        fill="#007AFF"
                        maxBarSize={20}
                        radius={[0, 8, 8, 0]}
                      />
                      {/* <Bar
                      dataKey="uv"
                      stackId="a"
                      fill="#B9DBFF"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={60}
                    /> */}
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </Report>
              <Report
                heading="Percentage"
                caption="Caption"
                filter={percentageFilter}
                setFilter={setPercentageFilter}
                isLoading={isPercentageFetching}
              >
                <ResponsiveContainer width="100%" maxHeight={400}>
                  {/*  *
                  <BarChart
                    data={data}
                    margin={{
                      top: 0,
                      right: 0,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      padding={{ left: 20, right: 20 }}
                      tickLine={false}
                      tick={{ fontSize: "14px" }}
                    />
                    <YAxis
                      tickCount={6}
                      tickLine={false}
                      tick={{ fontSize: "14px" }}
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
                    <Bar
                      dataKey="pv"
                      stackId="a"
                      fill="#007AFF"
                      maxBarSize={60}
                    />
                    <Bar
                      dataKey="uv"
                      stackId="a"
                      fill="#B9DBFF"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={60}
                    />
                  </BarChart>
                  {/*  */}
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
                                    className="flex items-center me-[16px]"
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
                        data={percentage}
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
                        {percentage.map((entry, index) => (
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
              <Report
                heading="Word Cloud"
                caption="Caption"
                filter={wordCloudFilter}
                setFilter={setWordCloudFilter}
                isLoading={isWordCloudFetching}
                additionalClasses="col-span-1 md:col-span-2"
              >
                <div>
                  {/* {!isWordcloudLoading && (
                    <img src={wordcloudImage} alt="wordcloud" />
                  )} */}
                  {!isWordCloudFetching && (
                    <div className="rounded-[8px] overflow-hidden border bg-[#F8F9FA] border-gray-50 flex justify-center items-center">
                      <img src={wordcloud} alt="wordcloud" />
                    </div>
                  )}
                </div>
              </Report>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

const AnalyticCardItem = ({ label, data, subtext, isPrimary = false }) => {
  return (
    <div className="item">
      <div className={`wrapper ${isPrimary ? "primary" : ""}`}>
        <p className="label">{label}</p>
        <p className="data">000</p>
        <p className="subtext">
          Regions Located: <span>00</span>
        </p>
      </div>
    </div>
  );
};

export default Analytics;
