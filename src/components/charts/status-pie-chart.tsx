"use client";

import React from "react";
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

type StatusDistributionProps = {
  data: { status: string; count: number }[];
  colors: string[];
};

export default function StatusPieChart({ data, colors }: StatusDistributionProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
          nameKey="status"
          label={({ status, count }) => `${status}: ${count}`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} tickets`, 'Count']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}