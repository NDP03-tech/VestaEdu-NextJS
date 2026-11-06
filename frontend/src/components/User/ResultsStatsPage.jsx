import React, { useEffect, useState } from "react";
import { Spin, message, Empty } from "antd";
import {
  FileDoneOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  RiseOutlined,
  FireOutlined,
} from "@ant-design/icons";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import config from "../../config";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

// Recharts cần mã màu hex (thuộc tính SVG), tương ứng blue-600 / slate-*
const CHART_COLOR = "#2563eb";
const GRID_COLOR = "#e2e8f0";
const AXIS_COLOR = "#64748b";

const TONES = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  indigo: "bg-indigo-50 text-indigo-600",
};

/* ------------------------------------------------------------------ */
/* Presentational components                                           */
/* ------------------------------------------------------------------ */

const IconChip = ({ icon: Icon, className = "bg-blue-600 text-white" }) => (
  <div
    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${className}`}
  >
    <Icon />
  </div>
);

const StatCard = ({ title, value, icon, tone, trend }) => (
  <div className="flex h-full items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
    <div>
      <p className="m-0 text-sm font-medium text-slate-500">{title}</p>
      <p className="m-0 mt-1 text-3xl font-semibold tabular-nums text-slate-900">
        {value}
      </p>
      {trend && (
        <p className="m-0 mt-3 flex items-center gap-1.5 text-[13px] text-slate-500">
          <RiseOutlined className="text-emerald-500" />
          {trend}
        </p>
      )}
    </div>
    <IconChip icon={icon} className={TONES[tone]} />
  </div>
);

const ProgressBar = ({ percent, barClass }) => (
  <div className="flex items-center gap-3">
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100"
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${barClass}`}
        style={{ width: `${percent}%` }}
      />
    </div>
    <span className="w-12 text-right text-xl font-bold text-slate-900">
      {percent}%
    </span>
  </div>
);

const RateCard = ({
  title,
  icon: Icon,
  iconClass,
  percent,
  barClass,
  passed,
  failed,
}) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
    <div className="mb-5 flex items-center gap-3">
      <Icon className={`text-2xl ${iconClass}`} />
      <h3 className="m-0 text-lg font-semibold text-slate-900">{title}</h3>
    </div>
    <ProgressBar percent={percent} barClass={barClass} />
    <div className="mt-4 flex justify-between text-sm text-slate-500">
      <span>Passed: {passed}</span>
      <span>Failed: {failed}</span>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const ResultsStatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${config.API_URL}/api/results/user/results-stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        message.error("Failed to load statistics.");
        console.error(err);
        setLoading(false);
      });
  }, []);

  const calculatePassRate = () => {
    if (!stats || stats.totalSubmitted === 0) return 0;
    return Math.round((stats.totalPassed / stats.totalSubmitted) * 100);
  };

  const calculateTodayRate = () => {
    if (!stats || stats.submittedToday === 0) return 0;
    return Math.round((stats.passedToday / stats.submittedToday) * 100);
  };

  if (loading || !stats) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const passRate = calculatePassRate();
  const todayRate = calculateTodayRate();

  return (
    <div className="px-4 py-5 md:px-6 md:py-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Page header */}
        <header className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <IconChip icon={TrophyOutlined} />
            <h2 className="m-0 text-2xl font-semibold tracking-tight text-slate-900">
              Results & Statistics
            </h2>
          </div>
          <p className="m-0 text-[15px] text-slate-500">
            Track your learning progress and performance
          </p>
        </header>

        {/* Stat cards */}
        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Submitted"
            value={stats.totalSubmitted}
            icon={FileDoneOutlined}
            tone="blue"
          />
          <StatCard
            title="Total Passed"
            value={stats.totalPassed}
            icon={CheckCircleOutlined}
            tone="emerald"
            trend={`${passRate}% pass rate`}
          />
          <StatCard
            title="Submitted Today"
            value={stats.submittedToday}
            icon={ClockCircleOutlined}
            tone="amber"
          />
          <StatCard
            title="Passed Today"
            value={stats.passedToday}
            icon={FireOutlined}
            tone="indigo"
            trend={stats.submittedToday > 0 ? `${todayRate}% today` : null}
          />
        </section>

        {/* Rate cards */}
        <section className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          <RateCard
            title="Overall Pass Rate"
            icon={TrophyOutlined}
            iconClass="text-blue-600"
            percent={passRate}
            barClass="bg-blue-600"
            passed={stats.totalPassed}
            failed={stats.totalSubmitted - stats.totalPassed}
          />
          <RateCard
            title="Today's Performance"
            icon={FireOutlined}
            iconClass="text-amber-500"
            percent={todayRate}
            barClass="bg-amber-500"
            passed={stats.passedToday}
            failed={stats.submittedToday - stats.passedToday}
          />
        </section>

        {/* Chart */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          <div className="mb-7 flex items-center gap-3 border-b border-slate-200 pb-5">
            <IconChip icon={RiseOutlined} />
            <div>
              <h2 className="m-0 text-xl font-semibold text-slate-900 md:text-2xl">
                Performance Trend
              </h2>
              <p className="m-0 text-sm text-slate-500">
                Average score over time
              </p>
            </div>
          </div>

          {stats.chartData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={CHART_COLOR}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLOR}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                <XAxis
                  dataKey="date"
                  stroke={AXIS_COLOR}
                  style={{ fontSize: "13px" }}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke={AXIS_COLOR}
                  style={{ fontSize: "13px" }}
                  label={{
                    value: "Score (%)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: AXIS_COLOR },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: `1px solid ${GRID_COLOR}`,
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    padding: "12px",
                  }}
                  formatter={(value) => [`${value}%`, "Avg Score"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="averageScore"
                  stroke={CHART_COLOR}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  dot={{ fill: CHART_COLOR, strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="px-5 py-14 text-center">
              <Empty
                description={
                  <span className="text-[15px] text-slate-500">
                    No data available yet. Complete some quizzes to see your
                    performance trend!
                  </span>
                }
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ResultsStatsPage;
