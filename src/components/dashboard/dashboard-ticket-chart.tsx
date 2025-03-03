"use client";

import React, { useState } from "react";
import { 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Bar, 
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie
} from "recharts";

const PRIORITY_COLORS = {
  "LOW": "#10B981",
  "NORMAL": "#3B82F6",
  "MEDIUM": "#3B82F6",
  "HIGH": "#F59E0B",
  "URGENT": "#EF4444",
};

const STATUS_COLORS = {
  "NEW": "#3B82F6",
  "OPEN": "#3B82F6",
  "IN PROGRESS": "#8B5CF6",
  "RESOLVED": "#10B981",
  "CLOSED": "#6B7280",
  "COMPLETED": "#10B981",
};

interface DistributionData {
  byStatus: Array<{ status: string; count: number }>;
  byPriority: Array<{ priority: string; count: number }>;
}

interface DashboardTicketChartProps {
  distribution: DistributionData;
}

function DashboardTicketChart({ distribution }: DashboardTicketChartProps) {
  const [view, setView] = useState<"priority" | "status">("status");

  if (!distribution || 
      !distribution.byStatus?.length || 
      !distribution.byPriority?.length) {
    return (
      <div className="flex h-[240px] items-center justify-center text-muted-foreground">
        No ticket data available yet
      </div>
    );
  }

  const statusData = distribution.byStatus;
  const priorityData = distribution.byPriority;

  return (
    <div className="h-[300px]">
      <div className="mb-4 flex items-center justify-between">
        <div className="space-x-2">
          <button
            onClick={() => setView("status")}
            className={`text-sm ${
              view === "status"
                ? "text-primary font-medium"
                : "text-muted-foreground"
            }`}
          >
            By Status
          </button>
          <button
            onClick={() => setView("priority")}
            className={`text-sm ${
              view === "priority"
                ? "text-primary font-medium"
                : "text-muted-foreground"
            }`}
          >
            By Priority
          </button>
        </div>
      </div>

      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          {view === "status" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              <BarChart 
                data={statusData} 
                margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="status" angle={-45} textAnchor="end" height={50} />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} tickets`, "Count"]}
                  labelFormatter={(label) => `Status: ${label}`}
                />
                <Bar dataKey="count" name="Tickets">
                  {statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] || "#8884d8"} 
                    />
                  ))}
                </Bar>
              </BarChart>
              
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                  label={({ status, percent }) => 
                    `${status}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] || "#8884d8"} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} tickets`, "Count"]}
                />
                <Legend />
              </PieChart>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              <BarChart 
                data={priorityData} 
                margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="priority" angle={-45} textAnchor="end" height={50} />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} tickets`, "Count"]}
                  labelFormatter={(label) => `Priority: ${label}`}
                />
                <Bar dataKey="count" name="Tickets">
                  {priorityData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={PRIORITY_COLORS[entry.priority as keyof typeof PRIORITY_COLORS] || "#8884d8"} 
                    />
                  ))}
                </Bar>
              </BarChart>
              
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="priority"
                  label={({ priority, percent }) => 
                    `${priority}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {priorityData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={PRIORITY_COLORS[entry.priority as keyof typeof PRIORITY_COLORS] || "#8884d8"} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} tickets`, "Count"]}
                />
                <Legend />
              </PieChart>
            </div>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export { DashboardTicketChart };
export default DashboardTicketChart;