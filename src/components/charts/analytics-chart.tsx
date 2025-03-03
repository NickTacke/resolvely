"use client";

import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

type AnalyticsChartProps = {
  data: { period: string; opened: number; completed: number }[];
};

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="opened" fill="#0088FE" name="Opened Tickets" />
        <Bar dataKey="completed" fill="#00C49F" name="Completed Tickets" />
      </BarChart>
    </ResponsiveContainer>
  );
}