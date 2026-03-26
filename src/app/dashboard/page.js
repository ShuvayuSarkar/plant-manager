"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  PieChart,
  Pie,
  ComposedChart,
  Legend,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
} from "recharts";

const chartData = [
  { name: "Oct", income: 180000, expense: 150000 },
  { name: "Nov", income: 195000, expense: 155000 },
  { name: "Dec", income: 210000, expense: 162000 },
  { name: "Jan", income: 200000, expense: 158000 },
  { name: "Feb", income: 221000, expense: 174000 },
  { name: "Mar", income: 240000, expense: 180000 },
];

const solidWasteData = [
  { name: "Target", value: 500 },
  { name: "Col.", value: 340 },
  { name: "Proc.", value: 290 },
];

const liquidWasteData = [
  { name: "Target", value: 8000 },
  { name: "Col.", value: 5200 },
  { name: "Proc.", value: 4500 },
];

const dryWasteData = [
  { name: "Plastic", value: 120, fill: "#6366F1" },
  { name: "Paper", value: 85, fill: "#F59E0B" },
  { name: "Metal", value: 45, fill: "#6B7280" },
  { name: "Organic", value: 90, fill: "#16A34A" },
];

const sopTaskData = [
  { name: "Completed", value: 0, fill: "#16A34A" },
  { name: "Pending", value: 7, fill: "#D97706" },
  { name: "Overdue", value: 3, fill: "#DC2626" },
];

const assetFeedingData = [
  { name: "Fed today", value: 11, fill: "#16A34A" },
  { name: "Pending", value: 6, fill: "#D97706" },
  { name: "Overdue", value: 4, fill: "#DC2626" },
];

const maintenanceBarData = [
  { name: "Tasks", Scheduled: 4, InProgress: 2, Completed: 3 },
];

const tasksTodayData = [
  { name: "Overdue", value: 3, fill: "#DC2626" },
  { name: "Open", value: 7, fill: "#D97706" },
  { name: "Done", value: 0, fill: "#16A34A" },
];

const fleetData = [
  { name: "Active", value: 3, fill: "#16A34A" },
  { name: "Maint.", value: 1, fill: "#D97706" },
];

const yesterdayRadarData = [
  { subject: "Solid Waste", A: 40, fullMark: 100 },
  { subject: "Dry Seg", A: 55, fullMark: 100 },
  { subject: "Liquid W", A: 70, fullMark: 100 },
  { subject: "Bio Gas", A: 30, fullMark: 100 },
  { subject: "Water", A: 45, fullMark: 100 },
  { subject: "Tasks", A: 100, fullMark: 100 },
];

const assetActivityData = [
  { time: "08:00", active: 2 },
  { time: "10:00", active: 8 },
  { time: "12:00", active: 11 },
  { time: "14:00", active: 13 },
  { time: "16:00", active: 15 },
  { time: "18:00", active: 11 },
];

const GenericTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "var(--color-background-primary)",
          border: "1px solid var(--color-border-tertiary)",
          padding: "5px 8px",
          fontSize: "13px",
          borderRadius: "4px",
          color: "var(--color-text-primary)",
        }}
      >
        {payload.map((p, i) => (
          <div
            key={i}
            style={{
              color: p.color || p.payload?.fill,
              fontWeight: 500,
              display: "flex",
              justifyContent: "space-between",
              gap: "8px",
            }}
          >
            <span>{p.name}:</span>
            <span>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "var(--color-background-primary)",
          border: "1px solid var(--color-border-tertiary)",
          padding: "5px",
          fontSize: "13px",
          borderRadius: "4px",
          color: "var(--color-text-primary)",
        }}
      >
        {payload.map((p) => (
          <div key={p.dataKey} style={{ color: p.color, fontWeight: 500 }}>
            {p.dataKey === "income" ? "Income: " : "Expense: "}₹
            {Math.round(p.value / 1000)}K
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function PlantDashboardPage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .d-container { 
          --color-background-tertiary: #f4f4f5;
          --color-background-primary: #ffffff;
          --color-background-secondary: #f1f5f9;
          --bg-warn-critical: var(--color-background-secondary);
          --bg-warn-high: var(--color-background-secondary);
          --bg-sub-card: #ffffff;
          --border-sub-card: #e5e7eb;
          --color-border-tertiary: #e4e4e7;
          --color-text-primary: #09090b;
          --color-text-secondary: #71717a;
          background: var(--color-background-tertiary); 
          color: var(--color-text-primary);
          font-family: var(--font-sans); 
          font-size: 16px; 
          padding-bottom: 24px; 
          min-height: 100vh;
        }
        .topbar { background: var(--color-background-primary); border-bottom: 0.5px solid var(--color-border-tertiary); padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; }
        .t-name { font-size: 18px; font-weight: 500; color: var(--color-text-primary); }
        .t-sub { font-size: 14px; color: var(--color-text-secondary); }
        .live { display: flex; align-items: center; gap: 5px; font-size: 14px; color: var(--color-text-secondary); }
        .dot-live { width: 6px; height: 6px; border-radius: 50%; background: #16A34A; animation: blink 2s infinite; display: inline-block; }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.2} }
        .main { padding: 12px; display: flex; flex-direction: column; gap: 12px; }
        .sec-label { font-size: 13px; font-weight: 500; color: var(--color-text-secondary); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; }
        .card { background: var(--color-background-primary); border-radius: var(--border-radius-lg, 12px); border: 0.5px solid var(--color-border-tertiary); padding: 12px; }
        .divider { height: 0.5px; background: var(--color-border-tertiary); margin: 10px 0; }
        .row-item { display: flex; align-items: center; padding: 6px 0; border-bottom: 0.5px solid var(--color-border-tertiary); }
        .row-item:last-child { border-bottom: none; }
        .badge { font-size: 13px; padding: 2px 7px; border-radius: 10px; font-weight: 500; white-space: nowrap; }
        .b-red { background: #FEE2E2; color: #991B1B; }
        .b-amber { background: #FEF3C7; color: #92400E; }
        .b-green { background: #DCFCE7; color: #166534; }
        .b-blue { background: #DBEAFE; color: #1E40AF; }
        .b-gray { background: var(--color-background-secondary); color: var(--color-text-secondary); }
        .dark .d-container {
            --color-background-tertiary: #000000;
            --color-background-primary: #09090b;
            --color-background-secondary: #18181b;
            --bg-warn-critical: var(--color-background-secondary);
            --bg-warn-high: var(--color-background-secondary);
            --bg-sub-card: var(--color-background-secondary);
            --border-sub-card: transparent;
            --color-border-tertiary: #27272a;
            --color-text-primary: #f4f4f5;
            --color-text-secondary: #a1a1aa;
        }
        .dark .card { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5); }
        .dark .b-red { background:#3D1414;color:#FCA5A5; } .dark .b-amber { background:#3D2A00;color:#FCD34D; }
        .dark .b-green { background:#0F3D22;color:#4ADE80; } .dark .b-blue { background:#1E3A5F;color:#93C5FD; }
        .dark .warn-critical { background: var(--color-background-secondary); border-left-color: #EF4444; }
        .dark .warn-high { background: var(--color-background-secondary); border-left-color: #F59E0B; }
        .dark .warn-critical .warn-title, .dark .warn-critical .warn-sub, .dark .warn-critical .warn-time { color: #FFFFFF !important; }
        .dark .warn-high .warn-title, .dark .warn-high .warn-sub, .dark .warn-high .warn-time { color: #FFFFFF !important; }
        .bar-bg { height: 4px; border-radius: 2px; background: var(--color-border-tertiary); overflow: hidden; margin: 3px 0 5px; }
        .bar-fill { height: 100%; border-radius: 2px; }
        .warn-critical { background: var(--bg-warn-critical); border-left: 3px solid #DC2626; border-radius: var(--border-radius-md, 8px); padding: 10px 12px; margin-bottom: 8px; display: flex; gap: 10px; align-items: flex-start; }
        .warn-high { background: var(--bg-warn-high); border-left: 3px solid #E07B00; border-radius: var(--border-radius-md, 8px); padding: 10px 12px; margin-bottom: 8px; display: flex; gap: 10px; align-items: flex-start; }
        .warn-icon { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0; margin-top: 1px; }
        .warn-critical .warn-icon { background: #DC2626; }
        .warn-high .warn-icon { background: #E07B00; }
        .warn-title { font-size: 15px; font-weight: 500; }
        .warn-critical .warn-title { color: var(--color-text-primary); }
        .warn-high .warn-title { color: var(--color-text-primary); }
        .warn-sub { font-size: 14px; margin-top: 2px; }
        .warn-critical .warn-sub { color: var(--color-text-secondary); }
        .warn-high .warn-sub { color: var(--color-text-secondary); }
        .warn-time { font-size: 13px; margin-top: 3px; color: #EF4444; }
        .ws-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
        .ws-block { background: var(--bg-sub-card); border: 1px solid var(--border-sub-card); border-radius: var(--border-radius-md, 8px); padding: 10px; }
        .ws-hd { display: flex; justify-content: space-between; align-items: center; margin-bottom: 7px; }
        .ws-title { font-size: 14px; font-weight: 500; color: var(--color-text-primary); }
        .ws-target { font-size: 13px; color: var(--color-text-secondary); }
        .ws-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
        .ws-rl { font-size: 14px; color: var(--color-text-secondary); }
        .ws-rv { font-size: 14px; font-weight: 500; color: var(--color-text-primary); }
        .strip3 { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 6px; }
        .strip-b { background: var(--bg-sub-card); border: 1px solid var(--border-sub-card); border-radius: var(--border-radius-md, 8px); padding: 8px; text-align: center; }
        .strip-v { font-size: 18px; font-weight: 500; color: var(--color-text-primary); }
        .strip-l { font-size: 13px; color: var(--color-text-secondary); margin-top: 2px; }
        .seg-row { display: flex; align-items: center; gap: 6px; margin-bottom: 5px; }
        .seg-lbl { font-size: 14px; color: var(--color-text-secondary); width: 60px; flex-shrink: 0; }
        .seg-bar-bg { flex: 1; height: 5px; border-radius: 3px; background: var(--color-border-tertiary); overflow: hidden; }
        .seg-bar-fill { height: 100%; border-radius: 3px; }
        .seg-val { font-size: 14px; font-weight: 500; color: var(--color-text-primary); width: 36px; text-align: right; }
        .completion-row { display: flex; gap: 10px; align-items: center; padding: 8px 0; }
        .ring-wrap { position: relative; flex-shrink: 0; }
        .ring-label { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-size: 15px; font-weight: 500; color: var(--color-text-primary); white-space: nowrap; }
        .completion-detail { flex: 1; }
        .comp-title { font-size: 14px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 4px; }
        .comp-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 2px; }
        .comp-lbl { color: var(--color-text-secondary); }
        .comp-val { font-weight: 500; }
        .mp3 { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 6px; margin-bottom: 10px; }
        .mp-b { border-radius: var(--border-radius-md, 8px); padding: 10px 8px; text-align: center; }
        .mp-b.sched { background: #EFF6FF; } .mp-b.inprog { background: #FFFBEB; } .mp-b.done { background: #F0FDF4; }
        .mp-n { font-size: 26px; font-weight: 500; }
        .mp-b.sched .mp-n { color: #1D4ED8; } .mp-b.inprog .mp-n { color: #B45309; } .mp-b.done .mp-n { color: #15803D; }
        .mp-l { font-size: 13px; margin-top: 2px; }
        .mp-b.sched .mp-l { color: #3B82F6; } .mp-b.inprog .mp-l { color: #D97706; } .mp-b.done .mp-l { color: #16A34A; }
        .dark .mp-b.sched{background:#1E3A5F;} .dark .mp-b.inprog{background:#3D2E00;} .dark .mp-b.done{background:#0F3D22;}
        .m-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-right: 8px; }
        .m-name { flex: 1; font-size: 15px; color: var(--color-text-primary); }
        .att-track { height: 10px; border-radius: 5px; background: var(--color-background-secondary); overflow: hidden; margin: 6px 0 5px; }
        .att-fill { height: 100%; border-radius: 5px; }
        .att-leg { display: flex; gap: 10px; font-size: 13px; color: var(--color-text-secondary); }
        .att-leg span { display: flex; align-items: center; gap: 4px; }
        .ld { width: 7px; height: 7px; border-radius: 50%; }
        .task-box { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 6px; margin: 10px 0 10px; }
        .tb-s { background: var(--color-background-secondary); border-radius: var(--border-radius-md, 8px); padding: 8px; text-align: center; }
        .tb-v { font-size: 21px; font-weight: 500; }
        .tb-l { font-size: 13px; color: var(--color-text-secondary); margin-top: 2px; }
        .t-row { display: flex; align-items: center; padding: 6px 0; border-bottom: 0.5px solid var(--color-border-tertiary); }
        .t-row:last-child { border-bottom: none; }
        .t-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-right: 8px; }
        .t-name { flex: 1; font-size: 15px; color: var(--color-text-primary); }
        .t-assign { font-size: 14px; color: var(--color-text-secondary); margin-right: 8px; }
        .sup-row { display: flex; align-items: center; padding: 7px 0; border-bottom: 0.5px solid var(--color-border-tertiary); }
        .sup-row:last-child { border-bottom: none; }
        .sup-av { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 500; margin-right: 8px; flex-shrink: 0; }
        .sup-name { flex: 1; font-size: 15px; color: var(--color-text-primary); }
        .sup-tasks { font-size: 14px; color: var(--color-text-secondary); }
        .fin-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
        .fin-b { border-radius: var(--border-radius-md, 8px); padding: 10px 12px; }
        .fin-b.inc { background: var(--color-background-secondary); border: 0.5px solid var(--color-border-tertiary); }
        .fin-b.exp { background: var(--color-background-secondary); border: 0.5px solid var(--color-border-tertiary); }
        .fin-lbl { font-size: 13px; text-transform: uppercase; letter-spacing:.06em; margin-bottom: 2px; }
        .fin-b.inc .fin-lbl { color: var(--color-text-secondary); } .fin-b.exp .fin-lbl { color: var(--color-text-secondary); }
        .fin-val { font-size: 21px; font-weight: 500; }
        .fin-b.inc .fin-val { color: var(--color-text-primary); } .fin-b.exp .fin-val { color: var(--color-text-primary); }
        .fin-d { font-size: 14px; margin-top: 2px; }
        .fin-b.inc .fin-d { color:#16A34A; } .fin-b.exp .fin-d { color:#DC2626; }
        .dark .fin-b.inc{background:#0F3D22;border-color:#14532D;} .dark .fin-b.exp{background:#3D1414;border-color:#7F1D1D;}
        .dark .fin-b.inc .fin-lbl, .dark .fin-b.inc .fin-val, .dark .fin-b.inc .fin-d { color: #FFFFFF !important; }
        .dark .fin-b.exp .fin-lbl, .dark .fin-b.exp .fin-val, .dark .fin-b.exp .fin-d { color: #FFFFFF !important; }
        .af-row { display: flex; align-items: center; padding: 7px 0; border-bottom: 0.5px solid var(--color-border-tertiary); }
        .af-row:last-child { border-bottom: none; }
        .af-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; margin-right: 8px; }
        .af-name { flex: 1; font-size: 15px; color: var(--color-text-primary); }
        .af-cat { font-size: 13px; color: var(--color-text-secondary); margin-right: 8px; }
        .af-time { font-size: 13px; color: var(--color-text-secondary); }
        .fleet4 { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 6px; margin-bottom: 10px; }
        .fs { background: var(--color-background-secondary); border-radius: var(--border-radius-md, 8px); padding: 8px; text-align: center; }
        .fs-v { font-size: 19px; font-weight: 500; color: var(--color-text-primary); }
        .fs-l { font-size: 13px; color: var(--color-text-secondary); margin-top: 1px; }
        .v-row { display: flex; align-items: center; padding: 6px 0; border-bottom: 0.5px solid var(--color-border-tertiary); }
        .v-row:last-child { border-bottom: none; }
        .v-id { flex: 1; font-size: 15px; font-weight: 500; color: var(--color-text-primary); font-family: var(--font-mono, monospace); }
        .sb { font-size: 13px; padding: 2px 7px; border-radius: 10px; font-weight: 500; }
        .sb-a { background:#DCFCE7;color:#166534; } .sb-m { background:#FEF9C3;color:#854D0E; }
        .dark .sb-a{background:#0F3D22;color:#4ADE80;} .dark .sb-m{background:#3D2A00;color:#FCD34D;}
        .yd-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 0.5px solid var(--color-border-tertiary); }
        .yd-row:last-child { border-bottom: none; }
        .yd-l { font-size: 15px; color: var(--color-text-secondary); }
        .yd-v { font-size: 15px; font-weight: 500; }
        
        @media (min-width: 768px) {
          .grid-2-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        }
        @media (max-width: 767px) {
          .grid-2-col { display: flex; flex-direction: column; gap: 12px; }
        }
        .grid-2-col > div { display: flex; flex-direction: column; }
        .grid-2-col > div > .card { flex: 1; }
      `,
        }}
      />
      <div className="d-container">
        {/* TOPBAR */}
        <div className="topbar">
          <div>
            <div className="t-name">Pundalik Tilve</div>
            <div className="t-sub">Plant Manager · Fri Mar 20</div>
          </div>
          <div className="live">
            <div className="dot-live"></div>Live
          </div>
        </div>

        <div className="main">
          {/* ══ 1. WARNINGS & EMERGENCIES ══ */}
          <div>
            <div className="sec-label">Warnings & Emergencies</div>
            <div className="card" style={{ padding: "10px 12px" }}>
              <div className="warn-critical">
                <div className="warn-icon">!</div>
                <div>
                  <div className="warn-title">
                    Incident — Forklift near-miss · Zone B
                  </div>
                  <div className="warn-sub">
                    Operator: Ravi S. · Unresolved · Action required
                  </div>
                  <div className="warn-time">Reported 07:42 AM today</div>
                </div>
              </div>
              <div className="warn-high">
                <div className="warn-icon">!</div>
                <div>
                  <div className="warn-title">
                    Attendance critical — 22.9% present
                  </div>
                  <div className="warn-sub">
                    Only 8 of 35 workers present. SOP tasks at risk.
                  </div>
                </div>
              </div>
              <div className="warn-high" style={{ marginBottom: "0" }}>
                <div className="warn-icon">!</div>
                <div>
                  <div className="warn-title">
                    4 asset readings missed yesterday
                  </div>
                  <div className="warn-sub">
                    13/17 assets fed. 4 readings incomplete since Mar 19.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══ 2. WASTE OPERATIONS ══ */}
          <div>
            <div className="sec-label">Waste Operations</div>
            <div className="card">
              <div className="ws-2col">
                <div className="ws-block">
                  <div className="ws-hd">
                    <span className="ws-title">Solid Waste</span>
                    <span className="ws-target">Target 500 kg</span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "120px",
                      marginTop: "10px",
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={solidWasteData}
                        margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="var(--color-border-tertiary)"
                        />
                        <XAxis
                          dataKey="name"
                          tick={{
                            fontSize: 12,
                            fill: "var(--color-text-secondary)",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{
                            fontSize: 12,
                            fill: "var(--color-text-secondary)",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: "transparent" }}
                          contentStyle={{
                            background: "var(--color-background-primary)",
                            border: "1px solid var(--color-border-tertiary)",
                            borderRadius: "8px",
                            fontSize: "14px",
                          }}
                        />
                        <Bar
                          dataKey="value"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={30}
                        >
                          {solidWasteData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index === 0
                                  ? "#6B7280"
                                  : index === 1
                                    ? "#3B82F6"
                                    : "#6366F1"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="ws-block">
                  <div className="ws-hd">
                    <span className="ws-title">Liquid Waste</span>
                    <span className="ws-target">Target 8000 L</span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "120px",
                      marginTop: "10px",
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={liquidWasteData}
                        margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="var(--color-border-tertiary)"
                        />
                        <XAxis
                          dataKey="name"
                          tick={{
                            fontSize: 12,
                            fill: "var(--color-text-secondary)",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{
                            fontSize: 12,
                            fill: "var(--color-text-secondary)",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: "transparent" }}
                          contentStyle={{
                            background: "var(--color-background-primary)",
                            border: "1px solid var(--color-border-tertiary)",
                            borderRadius: "8px",
                            fontSize: "14px",
                          }}
                        />
                        <Bar
                          dataKey="value"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={30}
                        >
                          {liquidWasteData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index === 0
                                  ? "#6B7280"
                                  : index === 1
                                    ? "#10B981"
                                    : "#059669"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="divider"></div>
              <div className="grid-2-col" style={{ gap: "12px" }}>
                <div style={{ marginBottom: "0" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "var(--color-text-primary)",
                      marginBottom: "6px",
                    }}
                  >
                    Bio Gas
                  </div>
                  <div className="strip3">
                    <div className="strip-b">
                      <div className="strip-v" style={{ color: "#10B981" }}>
                        24 m³
                      </div>
                      <div className="strip-l">Generated</div>
                    </div>
                    <div className="strip-b">
                      <div className="strip-v" style={{ color: "#3B82F6" }}>
                        110 kWh
                      </div>
                      <div className="strip-l">Power out</div>
                    </div>
                    <div className="strip-b">
                      <div className="strip-v" style={{ color: "#F59E0B" }}>
                        96%
                      </div>
                      <div className="strip-l">vs target</div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--color-text-secondary)",
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "6px",
                      marginBottom: "3px",
                    }}
                  >
                    <span>Progress</span>
                    <span>Target: 25 m³</span>
                  </div>
                  <div
                    className="bar-bg"
                    style={{ height: "5px", borderRadius: "3px" }}
                  >
                    <div
                      className="bar-fill"
                      style={{
                        background: "#10B981",
                        width: "96%",
                        height: "5px",
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "var(--color-text-primary)",
                      marginBottom: "6px",
                    }}
                  >
                    Water Purification
                  </div>
                  <div className="strip3" style={{ marginBottom: "6px" }}>
                    <div className="strip-b">
                      <div className="strip-v" style={{ color: "#10B981" }}>
                        4200 L
                      </div>
                      <div className="strip-l">Treated</div>
                    </div>
                    <div className="strip-b">
                      <div className="strip-v" style={{ color: "#3B82F6" }}>
                        3800 L
                      </div>
                      <div className="strip-l">Purified</div>
                    </div>
                    <div className="strip-b">
                      <div className="strip-v" style={{ color: "#F59E0B" }}>
                        84%
                      </div>
                      <div className="strip-l">Recovery</div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--color-text-secondary)",
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "3px",
                    }}
                  >
                    <span>Progress</span>
                    <span>Target: 5000 L</span>
                  </div>
                  <div
                    className="bar-bg"
                    style={{ height: "5px", borderRadius: "3px" }}
                  >
                    <div
                      className="bar-fill"
                      style={{
                        background: "#3B82F6",
                        width: "84%",
                        height: "5px",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══ DRY WASTE SEGREGATION ══ */}
          <div>
            <div className="sec-label">Dry Waste Segregation</div>
            <div className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "7px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "var(--color-text-primary)",
                  }}
                >
                  Segregation Progress
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Total: 340 kg today
                </span>
              </div>
              <div
                style={{ width: "100%", height: "160px", marginTop: "10px" }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dryWasteData}
                    margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--color-border-tertiary)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 12,
                        fill: "var(--color-text-secondary)",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{
                        fontSize: 12,
                        fill: "var(--color-text-secondary)",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        background: "var(--color-background-primary)",
                        border: "1px solid var(--color-border-tertiary)",
                        borderRadius: "8px",
                        fontSize: "14px",
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                      {dryWasteData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ══ COMPLETION RATES ══ */}
          <div>
            <div className="sec-label">Completion Rates</div>
            <div className="card">
              <div className="ws-2col">
                <div
                  className="ws-block"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span className="ws-title" style={{ marginBottom: "8px" }}>
                    SOP Task Completion
                  </span>
                  <div style={{ width: "100%", height: "120px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sopTaskData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          innerRadius={30}
                          outerRadius={50}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {sopTaskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "var(--color-background-primary)",
                            border: "1px solid var(--color-border-tertiary)",
                            borderRadius: "8px",
                            fontSize: "14px",
                          }}
                          itemStyle={{ color: "var(--color-text-primary)" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ width: "100%", marginTop: "auto" }}>
                    <div className="comp-row">
                      <span className="comp-lbl">Completed</span>
                      <span className="comp-val" style={{ color: "#16A34A" }}>
                        0
                      </span>
                    </div>
                    <div className="comp-row">
                      <span className="comp-lbl">Pending</span>
                      <span className="comp-val" style={{ color: "#D97706" }}>
                        7
                      </span>
                    </div>
                    <div className="comp-row">
                      <span className="comp-lbl">Overdue</span>
                      <span className="comp-val" style={{ color: "#DC2626" }}>
                        3
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="ws-block"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span className="ws-title" style={{ marginBottom: "8px" }}>
                    Asset Parameter Feeding
                  </span>
                  <div style={{ width: "100%", height: "120px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={assetFeedingData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          innerRadius={30}
                          outerRadius={50}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {assetFeedingData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "var(--color-background-primary)",
                            border: "1px solid var(--color-border-tertiary)",
                            borderRadius: "8px",
                            fontSize: "14px",
                          }}
                          itemStyle={{ color: "var(--color-text-primary)" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ width: "100%", marginTop: "auto" }}>
                    <div className="comp-row">
                      <span className="comp-lbl">Fed today</span>
                      <span className="comp-val" style={{ color: "#16A34A" }}>
                        11
                      </span>
                    </div>
                    <div className="comp-row">
                      <span className="comp-lbl">Pending</span>
                      <span className="comp-val" style={{ color: "#D97706" }}>
                        6
                      </span>
                    </div>
                    <div className="comp-row">
                      <span className="comp-lbl">Overdue</span>
                      <span className="comp-val" style={{ color: "#DC2626" }}>
                        4
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══ 3. & 6. MAINTENANCE & ASSET READINGS ══ */}
          <div className="grid-2-col">
            <div>
              <div className="sec-label">Maintenance Pipeline</div>
              <div className="card">
                <div
                  style={{
                    height: "70px",
                    width: "100%",
                    marginBottom: "16px",
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={maintenanceBarData}
                      margin={{ top: 0, right: 0, left: -40, bottom: 0 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" hide />
                      <Tooltip
                        content={<GenericTooltip />}
                        cursor={{ fill: "transparent" }}
                      />
                      <Bar
                        dataKey="Scheduled"
                        stackId="a"
                        fill="#3B82F6"
                        radius={[4, 0, 0, 4]}
                        barSize={20}
                      />
                      <Bar
                        dataKey="InProgress"
                        stackId="a"
                        fill="#D97706"
                        barSize={20}
                      />
                      <Bar
                        dataKey="Completed"
                        stackId="a"
                        fill="#16A34A"
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "13px",
                      marginTop: "-15px",
                      padding: "0 5px",
                    }}
                  >
                    <span style={{ color: "#3B82F6", fontWeight: 500 }}>
                      4 Scheduled
                    </span>
                    <span style={{ color: "#D97706", fontWeight: 500 }}>
                      2 In Prog
                    </span>
                    <span style={{ color: "#16A34A", fontWeight: 500 }}>
                      3 Done
                    </span>
                  </div>
                </div>
                <div className="row-item">
                  <div
                    className="m-dot"
                    style={{ background: "#D97706" }}
                  ></div>
                  <span className="m-name">
                    Baling machine — belt inspection
                  </span>
                  <span className="badge b-amber">In Progress</span>
                </div>
                <div className="row-item">
                  <div
                    className="m-dot"
                    style={{ background: "#3B82F6" }}
                  ></div>
                  <span className="m-name">Tata LPT 8000L — oil change</span>
                  <span className="badge b-blue">Scheduled</span>
                </div>
                <div className="row-item">
                  <div
                    className="m-dot"
                    style={{ background: "#D97706" }}
                  ></div>
                  <span className="m-name">Bio gas genset — filter check</span>
                  <span className="badge b-amber">In Progress</span>
                </div>
                <div className="row-item">
                  <div
                    className="m-dot"
                    style={{ background: "#16A34A" }}
                  ></div>
                  <span className="m-name">Weigh bridge — calibration</span>
                  <span className="badge b-green">Completed</span>
                </div>
              </div>
            </div>

            <div>
              <div className="sec-label">Asset Live Readings</div>
              <div className="card" style={{ padding: "10px 12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "500",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    17 assets total
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#D97706",
                      fontWeight: "500",
                    }}
                  >
                    11 fed · 6 pending
                  </span>
                </div>
                <div
                  className="bar-bg"
                  style={{ height: "5px", marginBottom: "10px" }}
                >
                  <div
                    className="bar-fill"
                    style={{
                      background: "#D97706",
                      width: "65%",
                      height: "5px",
                    }}
                  ></div>
                </div>

                <div
                  style={{
                    height: "60px",
                    width: "100%",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--color-text-secondary)",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Peak Activity Today
                  </span>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={assetActivityData}
                      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorActive"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <Tooltip
                        content={<GenericTooltip />}
                        cursor={{
                          stroke: "var(--color-border-tertiary)",
                          strokeWidth: 1,
                          strokeDasharray: "3 3",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="active"
                        stroke="#3B82F6"
                        fillOpacity={1}
                        fill="url(#colorActive)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="af-row">
                  <div
                    className="af-dot"
                    style={{ background: "#16A34A" }}
                  ></div>
                  <span className="af-name">Tata LPT (8000L)</span>
                  <span className="af-cat">Liquid WM</span>
                  <span className="badge b-green">Fed</span>
                </div>
                <div className="af-row">
                  <div
                    className="af-dot"
                    style={{ background: "#16A34A" }}
                  ></div>
                  <span className="af-name">Manual Forklift</span>
                  <span className="af-cat">Solid WM</span>
                  <span className="badge b-green">Fed</span>
                </div>
                <div className="af-row">
                  <div
                    className="af-dot"
                    style={{ background: "#16A34A" }}
                  ></div>
                  <span className="af-name">Weigh Bridge</span>
                  <span className="af-cat">Solid WM</span>
                  <span className="badge b-green">Fed</span>
                </div>
                <div className="af-row">
                  <div
                    className="af-dot"
                    style={{ background: "#16A34A" }}
                  ></div>
                  <span className="af-name">2G HP Baling Machine</span>
                  <span className="af-cat">Solid WM</span>
                  <span className="badge b-green">Fed</span>
                </div>
                <div className="text-center pt-2 text-[12px] text-blue-600 cursor-pointer hover:underline">
                  View all 17 assets ↗
                </div>
              </div>
            </div>
          </div>

          {/* ══ 4 & 5. COMPACTED HORIZONTAL SECTIONS ══ */}
          <div className="grid-2-col">
            {/* ══ 4. WORKFORCE MANAGEMENT ══ */}
            <div>
              <div className="sec-label">Workforce Management</div>
              <div className="card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "28px",
                      fontWeight: "500",
                      color: "#DC2626",
                    }}
                  >
                    8
                  </span>
                  <span
                    style={{
                      fontSize: "16px",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    / 35 present
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "21px",
                      fontWeight: "500",
                      color: "#DC2626",
                    }}
                  >
                    22.9%
                  </span>
                </div>
                <div className="att-track">
                  <div
                    className="att-fill"
                    style={{ background: "#DC2626", width: "22.9%" }}
                  ></div>
                </div>
                <div className="att-leg">
                  <span>
                    <div className="ld" style={{ background: "#DC2626" }}></div>
                    Absent (27)
                  </span>
                  <span>
                    <div className="ld" style={{ background: "#16A34A" }}></div>
                    Present (8)
                  </span>
                  <span style={{ marginLeft: "auto" }}>Target 80%</span>
                </div>
                <div className="divider"></div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "var(--color-text-primary)",
                    marginBottom: "6px",
                  }}
                >
                  Top Supervisors
                </div>
                <div className="sup-row">
                  <div
                    className="sup-av"
                    style={{ background: "#E6F1FB", color: "#185FA5" }}
                  >
                    BG
                  </div>
                  <span className="sup-name">Bhagvan Gawade</span>
                  <span className="sup-tasks">0 tasks done</span>
                </div>
                <div className="sup-row">
                  <div
                    className="sup-av"
                    style={{ background: "#EAF3DE", color: "#3B6D11" }}
                  >
                    MK
                  </div>
                  <span className="sup-name">Manish Kumar</span>
                  <span className="sup-tasks">0 tasks done</span>
                </div>
                <div className="sup-row">
                  <div
                    className="sup-av"
                    style={{ background: "#FAEEDA", color: "#854F0B" }}
                  >
                    SN
                  </div>
                  <span className="sup-name">Sujit Naik</span>
                  <span className="sup-tasks">0 tasks done</span>
                </div>
              </div>
            </div>

            {/* ══ TASKS ASSIGNED TODAY ══ */}
            <div>
              <div className="sec-label">Tasks Assigned Today</div>
              <div className="card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "16px",
                    gap: "12px",
                  }}
                >
                  <div style={{ width: "80px", height: "80px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tasksTodayData}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={40}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {tasksTodayData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip content={<GenericTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "15px",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#DC2626",
                          }}
                        ></div>
                        Overdue
                      </span>
                      <span style={{ fontWeight: 600, color: "#DC2626" }}>
                        3
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "15px",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#D97706",
                          }}
                        ></div>
                        Open
                      </span>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--color-text-primary)",
                        }}
                      >
                        7
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "15px",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#16A34A",
                          }}
                        ></div>
                        Done
                      </span>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--color-text-primary)",
                        }}
                      >
                        0
                      </span>
                    </div>
                  </div>
                </div>
                <div className="t-row">
                  <div
                    className="t-dot"
                    style={{ background: "#DC2626" }}
                  ></div>
                  <span className="t-name">Morning waste intake log</span>
                  <span className="t-assign">Bhagvan G.</span>
                  <span className="badge b-red">Overdue</span>
                </div>
                <div className="t-row">
                  <div
                    className="t-dot"
                    style={{ background: "#DC2626" }}
                  ></div>
                  <span className="t-name">Effluent quality check</span>
                  <span className="t-assign">Manish K.</span>
                  <span className="badge b-red">Overdue</span>
                </div>
                <div className="t-row">
                  <div
                    className="t-dot"
                    style={{ background: "#DC2626" }}
                  ></div>
                  <span className="t-name">Incident report filing</span>
                  <span className="t-assign">Sujit N.</span>
                  <span className="badge b-red">Overdue</span>
                </div>
                <div className="t-row">
                  <div
                    className="t-dot"
                    style={{ background: "#D97706" }}
                  ></div>
                  <span className="t-name">Bio gas pressure reading</span>
                  <span className="t-assign">Sujit N.</span>
                  <span className="badge b-amber">Pending</span>
                </div>
                <div className="t-row">
                  <div
                    className="t-dot"
                    style={{ background: "#D97706" }}
                  ></div>
                  <span className="t-name">Weigh bridge daily check</span>
                  <span className="t-assign">Unassigned</span>
                  <span className="badge b-gray">Pending</span>
                </div>
                <div className="text-center pt-2 text-[12px] text-blue-600 cursor-pointer hover:underline">
                  View all 10 tasks ↗
                </div>
              </div>
            </div>
          </div>

          {/* ══ 5. FINANCIALS ══ */}
          <div>
            <div className="sec-label">Financials — March 2026</div>
            <div className="card">
              <div className="fin-pair">
                <div className="fin-b inc">
                  <div className="fin-lbl">Income</div>
                  <div className="fin-val">₹2.4L</div>
                  <div className="fin-d">↑ 8.2% vs Feb</div>
                </div>
                <div className="fin-b exp">
                  <div className="fin-lbl">Expense</div>
                  <div className="fin-val">₹1.8L</div>
                  <div className="fin-d">↑ 3.1% vs Feb</div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Net surplus this month
                </span>
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: "500",
                    color: "#15803D",
                  }}
                >
                  ₹0.6L
                </span>
              </div>

              {/* RECHARTS INSERTION */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "140px",
                  marginTop: "10px",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--color-border-tertiary)"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9CA3AF" }}
                      tickFormatter={(value) => `₹${value / 100000}L`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="income"
                      name="Income"
                      fill="#16A34A"
                      radius={[2, 2, 0, 0]}
                      maxBarSize={30}
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      name="Expense"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#EF4444" }}
                      activeDot={{ r: 5 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  marginTop: "12px",
                  justifyContent: "center",
                  fontSize: "13px",
                  color: "var(--color-text-secondary)",
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "2px",
                      background: "#16A34A",
                    }}
                  ></span>
                  Income (Bar)
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#EF4444",
                    }}
                  ></span>
                  Expense (Line)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ══ 7 & 8. COMPACTED HORIZONTAL SECTIONS ══ */}
        <div className="grid-2-col">
          {/* ══ 7. FLEET TRACKING ══ */}
          <div>
            <div className="sec-label">
              Fleet Tracking{" "}
              <span className="dot-live" style={{ marginLeft: "4px" }}></span>
            </div>
            <div className="card">
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "16px",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "80px", height: "80px", flexShrink: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={fleetData}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {fleetData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<GenericTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div
                  className="fleet4"
                  style={{ flex: 1, marginBottom: 0, gap: "4px" }}
                >
                  <div className="fs">
                    <div className="fs-v">4</div>
                    <div className="fs-l">Total</div>
                  </div>
                  <div className="fs">
                    <div className="fs-v" style={{ color: "#16A34A" }}>
                      3
                    </div>
                    <div className="fs-l">Active</div>
                  </div>
                  <div className="fs">
                    <div className="fs-v" style={{ color: "#D97706" }}>
                      1
                    </div>
                    <div className="fs-l">Maint.</div>
                  </div>
                  <div className="fs">
                    <div className="fs-v">0</div>
                    <div className="fs-l">Trips</div>
                  </div>
                </div>
              </div>
              <div className="v-row">
                <span className="v-id">TAT086547</span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "var(--color-text-secondary)",
                    flex: "1",
                    marginLeft: "8px",
                  }}
                >
                  0 trips · 0 km
                </span>
                <span className="sb sb-a">Active</span>
              </div>
              <div className="v-row">
                <span className="v-id">BOL087184</span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "var(--color-text-secondary)",
                    flex: "1",
                    marginLeft: "8px",
                  }}
                >
                  Under service
                </span>
                <span className="sb sb-m">Maintenance</span>
              </div>
              <div className="v-row">
                <span className="v-id">BOL087398</span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "var(--color-text-secondary)",
                    flex: "1",
                    marginLeft: "8px",
                  }}
                >
                  0 trips · 0 km
                </span>
                <span className="sb sb-a">Active</span>
              </div>
            </div>
          </div>

          {/* ══ 8. YESTERDAY ══ */}
          <div>
            <div className="sec-label">Yesterday Overview — Mar 19</div>
            <div className="card" style={{ padding: "12px" }}>
              <div
                style={{ width: "100%", height: "160px", marginBottom: "16px" }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={yesterdayRadarData}
                  >
                    <PolarGrid stroke="var(--color-border-tertiary)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{
                        fill: "var(--color-text-secondary)",
                        fontSize: 12,
                      }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name="Target Adherence"
                      dataKey="A"
                      stroke="#16A34A"
                      fill="#16A34A"
                      fillOpacity={0.4}
                    />
                    <Tooltip
                      content={<GenericTooltip />}
                      wrapperStyle={{ zIndex: 100 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                <div
                  className="yd-row"
                  style={{ borderBottom: "none", padding: "4px 0" }}
                >
                  <span className="yd-l" style={{ fontSize: "13px" }}>
                    Solid Waste
                  </span>
                  <span
                    className="yd-v"
                    style={{ fontSize: "13px", color: "#B45309" }}
                  >
                    Target Missed
                  </span>
                </div>
                <div
                  className="yd-row"
                  style={{ borderBottom: "none", padding: "4px 0" }}
                >
                  <span className="yd-l" style={{ fontSize: "13px" }}>
                    Bio Gas
                  </span>
                  <span
                    className="yd-v"
                    style={{ fontSize: "13px", color: "#B45309" }}
                  >
                    Target Missed
                  </span>
                </div>
                <div
                  className="yd-row"
                  style={{ borderBottom: "none", padding: "4px 0" }}
                >
                  <span className="yd-l" style={{ fontSize: "13px" }}>
                    Water
                  </span>
                  <span
                    className="yd-v"
                    style={{ fontSize: "13px", color: "#B45309" }}
                  >
                    Target Missed
                  </span>
                </div>
                <div
                  className="yd-row"
                  style={{ borderBottom: "none", padding: "4px 0" }}
                >
                  <span className="yd-l" style={{ fontSize: "13px" }}>
                    SOP tasks
                  </span>
                  <span
                    className="yd-v"
                    style={{ fontSize: "13px", color: "#15803D" }}
                  >
                    100% Done
                  </span>
                </div>
                <div
                  className="yd-row"
                  style={{ borderBottom: "none", padding: "4px 0" }}
                >
                  <span className="yd-l" style={{ fontSize: "13px" }}>
                    Attendance
                  </span>
                  <span
                    className="yd-v"
                    style={{ fontSize: "13px", color: "#15803D" }}
                  >
                    100%
                  </span>
                </div>
                <div
                  className="yd-row"
                  style={{ borderBottom: "none", padding: "4px 0" }}
                >
                  <span className="yd-l" style={{ fontSize: "13px" }}>
                    Incidents
                  </span>
                  <span
                    className="yd-v"
                    style={{ fontSize: "13px", color: "#15803D" }}
                  >
                    0 Clear
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
