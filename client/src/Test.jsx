import { forwardRef, useEffect, useRef } from "react";
import TestList from "./test.json";
import React, { useState, useCallback, useMemo } from "react";

import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useGeneratePercentageQuery } from "./features/api/analyticsSlice";

const Test = () => {
  let x = TestList;

  const data = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];

  const COLORS = ["#DBB324", "#007AFF", "#D82727", "#35CA3B"];
  const RADIAN = Math.PI / 180;

  let {
    data: percentage,
    isLoading: isPercentageLoading,
    isFetching: isPercentageFetching,
  } = useGeneratePercentageQuery("all");

  useEffect(() => {
    if (percentage) {
      percentage.map(({ label }, i) => {
        console.log(label);
      });
    }
  }, [percentage]);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
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
  };
  return (
    <>
      <div className="test-layout">
        {isPercentageFetching ? (
          <p>Fetching.....</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
              <Legend
                verticalAlign="top"
                align="left"
                iconSize={20}
                height={60}
                content={({ payload }) => {
                  return (
                    <div className="flex items-center">
                      {payload.map((entry, index) => {
                        const { color, payload } = entry;
                        console.log(entry);
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
                              {payload.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
              />
              {percentage && (
                <Pie
                  data={percentage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
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
              )}
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
};

export default Test;
