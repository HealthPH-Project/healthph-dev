import { forwardRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const PrintAnalytics = forwardRef(({ data, dateTable }, ref) => {
  const user = useSelector((state) => state.auth.user);

  const formatDataLength = (value, minDigit) => {
    return value.length > minDigit
      ? value.toString().padStart(minDigit, "0").slice(0, minDigit)
      : value.toString().padStart(minDigit, "0");
  };

  // const displayRowRange = (currentPage) => {
  //   const startIndex =
  //     data.length == 0 ? 0 : currentPage * rowsPerPage - rowsPerPage + 1;
  //   const endIndex =
  //     currentPage * rowsPerPage < data.length
  //       ? currentPage * rowsPerPage
  //       : data.length;

  //   return `Row ${startIndex} - ${endIndex} of ${data.length}`;
  // };

  const suspectedSymptomsData = data["suspected_symptoms"];

  const suspectedSymptoms = suspectedSymptomsData
    ? [
        {
          id: "total",
          label: "TOTAL SUSPECTED",
          value: suspectedSymptomsData["total"]["count"],
          regions_located:
            suspectedSymptomsData["total"]["regions_located"].length,
        },
        {
          id: "tb",
          label: "PTB",
          value: suspectedSymptomsData["TB"]["count"],
          regions_located:
            suspectedSymptomsData["TB"]["regions_located"].length,
        },
        {
          id: "pn",
          label: "PNEUMONIA",
          value: suspectedSymptomsData["PN"]["count"],
          regions_located:
            suspectedSymptomsData["PN"]["regions_located"].length,
        },
        {
          id: "covid",
          label: "COVID",
          value: suspectedSymptomsData["COVID"]["count"],
          regions_located:
            suspectedSymptomsData["COVID"]["regions_located"].length,
        },
        {
          id: "auri",
          label: "AURI",
          value: suspectedSymptomsData["AURI"]["count"],
          regions_located:
            suspectedSymptomsData["AURI"]["regions_located"].length,
        },
      ]
    : [];

  const frequent_words = data["frequent_words"];

  const percentage = data["percentage"];

  const COLORS = ["#F5D76E", "#6A8EB5", "#F78C6B", "#78C6B2"];
  const RADIAN = Math.PI / 180;

  const wordcloud = data["wordcloud"];

  const wordcloud_data = data["wordcloud_data"];

  const dynamicWordCloudImage = data["dynamicWordCloudImage"];

  const displayRegion = (v) => {
    const regions = {
      all: "All Regions",
      NCR: "National Capital Region",
      I: "Region I",
      II: "Region II",
      III: "Region III",
      CAR: "Cordillera Administrative Region (CAR)",
      IVA: "Region IV-A (CALABARZON)",
      IVB: "Region IV-B (MIMAROPA)",
      V: "Region V",
      VI: "Region VI",
      VII: "Region VII",
      VIII: "Region VIII",
      IX: "Region IX",
      X: "Region X",
      XI: "Region XI",
      XII: "Region XII",
      XIII: "Region XIII",
      BARMM: "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)",
    };

    return regions[v];
  };

  return (
    <div className="print-component">
      <div className="print-container" ref={ref}>
        <div className="page">
          <div className="page-header mb-[36px]">
            <p>Analytics</p>
            <p>HealthPH</p>
          </div>
          <div className="page-content">
            <div className="content-header">
              <div className="flex items-center">
                <p>Suspected Symptoms</p>
              </div>
              <p>As of {dateTable}</p>
            </div>
            <div className="suspected-symptoms-container">
              {suspectedSymptoms.map(
                ({ id, label, value, regions_located }, i) => {
                  return (
                    <div className="suspected-symptom-item" key={id}>
                      <p className="label">{label}</p>
                      <p className="value">{formatDataLength(value, 3)}</p>
                      <p className="region">
                        <span>Regions Located:</span>{" "}
                        {formatDataLength(regions_located, 2)}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
            <div className="grid grid-cols-[1fr,_1fr]">
              {/* TOP WORDS */}
              <div>
                <div className="content-header">
                  <div className="flex items-center">
                    <p>Top Words</p>
                    <span className="ms-[8px]">
                      {displayRegion(data["frequent_words_filter"])}
                    </span>
                  </div>
                </div>
                <div className="report-wrapper">
                  {frequent_words && (
                    <BarChart
                      data={frequent_words["frequent_words"]}
                      className=" pt-8"
                      width={360}
                      height={400}
                      margin={{
                        top: 12,
                        right: 14,
                        left: 14,
                        bottom: 12,
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
                        fontSize={12}
                      />
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
                                    <span className="prod-l5 text-gray-900">
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
                        maxBarSize={16}
                        radius={[0, 8, 8, 0]}
                      >
                        <LabelList
                          dataKey="frequency"
                          position="right"
                          fontSize={12}
                        />
                        <LabelList
                          dataKey="word"
                          content={({ x, y, value }) => {
                            return (
                              <text
                                x={x}
                                y={y - 5}
                                className="recharts-text recharts-cartesian-axis-tick-value text-[12px]"
                                fill="#666"
                              >
                                <tspan>{value}</tspan>
                              </text>
                            );
                          }}
                        />
                      </Bar>
                    </BarChart>
                  )}
                </div>
              </div>

              {/* PERCENTAGE */}
              <div>
                <div className="content-header">
                  <div className="flex items-center">
                    <p>Suspected Conditions Percentage</p>
                    <span className="ms-[8px]">
                      {displayRegion(data["percentage_filter"])}
                    </span>
                  </div>
                </div>
                <div className="report-wrapper">
                  {percentage && (
                    <PieChart
                      width={360}
                      height={400}
                      margin={{
                        top: 12,
                        right: 14,
                        left: 14,
                        bottom: 12,
                      }}
                      className=" pt-8"
                    >
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
                                    className="flex items-center me-[10px]"
                                    key={index}
                                  >
                                    <div
                                      className="h-[16px] w-[16px] rounded-[4px] me-[10px]"
                                      style={{ backgroundColor: color }}
                                    ></div>
                                    <span className="prod-l5 text-gray-900">
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
                          count,
                        }) => {
                          const radius =
                            innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);

                          return (
                            <>
                              <text
                                x={x}
                                y={y - 10}
                                fill="white"
                                textAnchor={x > cx ? "start" : "end"}
                                dominantBaseline="central"
                                className="font-semibold"
                              >
                                {`${(percent * 100).toFixed(0)}%`}
                              </text>
                              <text
                                x={x}
                                y={y + 10}
                                fill="white"
                                textAnchor={x > cx ? "start" : "end"}
                                dominantBaseline="central"
                                className="font-semibold"
                              >
                                {`(${count})`}
                              </text>
                            </>
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
                    </PieChart>
                  )}
                </div>
              </div>
            </div>

            {/* WORDCLOUD */}
            <div className="content-header">
              <div className="flex items-center">
                <p>Word Cloud</p>
                <span className="ms-[8px]">
                  {displayRegion(data["wordcloud_filter"])}
                </span>
              </div>
            </div>
            <div className="wordcloud-wrapper h-[300px] w-full flex justify-center items-center">
              <img src={dynamicWordCloudImage} alt="wordcloud" />
            </div>
          </div>
          <div className="page-footer mt-[36px]">
            <p>
              Generated by: {user.first_name + " " + user.last_name} -{" "}
              {user.email}
            </p>
            <p>Page {formatDataLength(0 + 1, 2)} </p>
          </div>
        </div>
      </div>
    </div>
  );
});
export default PrintAnalytics;
