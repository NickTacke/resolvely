"use client";

import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

type PriorityDistributionProps = {
  data: { priority: string; count: number }[];
};

export default function PriorityBarChart({ data }: PriorityDistributionProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="priority" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} tickets`, 'Count']} />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" name="Tickets" />
      </BarChart>
    </ResponsiveContainer>
  );
}