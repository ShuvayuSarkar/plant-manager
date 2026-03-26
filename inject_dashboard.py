import re

html_content = r"""
"use client";

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const taskData = [
  { name: 'Overdue', value: 3, color: '#ef4444' },
  { name: 'Open', value: 7, color: '#f59e0b' },
  { name: 'Done', value: 4, color: '#10b981' }
];

const compData = [
  { name: 'Plastic', value: 120, color: '#6366f1' },
  { name: 'Organic', value: 250, color: '#10b981' },
  { name: 'Metal', value: 45, color: '#64748b' },
  { name: 'Paper', value: 85, color: '#f59e0b' }
];

const finData = [
  { name: 'Oct', income: 180, expense: 130 },
  { name: 'Nov', income: 195, expense: 140 },
  { name: 'Dec', income: 210, expense: 145 },
  { name: 'Jan', income: 200, expense: 140 },
  { name: 'Feb', income: 221, expense: 155 },
  { name: 'Mar', income: 240, expense: 165 }
];

const fleetData = [
  { name: 'Active', value: 3, color: '#10b981' },
  { name: 'Maintenance', value: 1, color: '#f59e0b' }
];

const CountUp = ({ target, duration = 2500, isCurrency = false, suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrame;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(ease * target);
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };
    animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  const formatted = parseFloat(count).toFixed(decimals);
  return <>{isCurrency ? '₹' : ''}{formatted}{suffix}</>;
};

export default function AdvancedDashboard() {
  useEffect(() => {
    // 1. Staggered Entrance Animations
    const elements = document.querySelectorAll('.anim-fade-up');
    elements.forEach((el, index) => {
      setTimeout(() => el.classList.add('visible'), 100 + (index * 80));
    });

    // 2. Progress Bar Loading Fluidity
    setTimeout(() => {
      const fills = document.querySelectorAll('.prog-fill, .att-fill, .yvt-fill');
      fills.forEach(fill => {
        const targetWidth = fill.getAttribute('data-width');
        if (targetWidth) fill.style.width = targetWidth;
      });
    }, 500);
  }, []);

  return (
    <>
      <style>{`
        :root {
          --slate-900: #0f172a; --slate-800: #1e293b; --slate-700: #334155;
          --slate-600: #475569; --slate-500: #64748b; --slate-400: #94a3b8;
          --slate-300: #cbd5e1; --slate-200: #e2e8f0; --slate-100: #f1f5f9; --slate-50: #f8fafc;
          --red: #ef4444; --red-bg: #fef2f2; --red-dim: #fca5a5;
          --amber: #f59e0b; --amber-bg: #fffbeb;
          --green: #10b981; --green-bg: #f0fdf4;
          --blue: #3b82f6; --cyan: #06b6d4; --indigo: #6366f1;
        }

        .adv-dash {
          font-family: 'Inter', sans-serif;
          color: var(--slate-700);
          background: transparent;
          overflow-x: hidden;
          width: 100%;
          line-height: 1.5;
        }

        .mesh-bg { position: fixed; inset: 0; z-index: -1; overflow: hidden; background: #f3f6f9; pointer-events: none; }
        @keyframes floatBg { 0% { transform: scale(1) translate(0, 0); } 33% { transform: scale(1.1) translate(40px, -50px); } 66% { transform: scale(0.9) translate(-30px, 40px); } 100% { transform: scale(1) translate(0, 0); } }
        .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.6; animation: floatBg 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1); }
        .orb-1 { width: 45vw; height: 45vw; background: rgba(99, 102, 241, 0.15); top: -10%; left: -10%; animation-delay: 0s; }
        .orb-2 { width: 35vw; height: 35vw; background: rgba(16, 185, 129, 0.15); bottom: -10%; right: -5%; animation-delay: -5s; animation-duration: 25s; }
        .orb-3 { width: 50vw; height: 50vw; background: rgba(245, 158, 11, 0.1); top: 30%; left: 30%; animation-delay: -10s; animation-duration: 30s; }

        .top-nav { position: sticky; top: 0; z-index: 100; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(241, 245, 249, 0.8); display: flex; justify-content: space-between; align-items: center; padding: 12px 40px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02); margin-bottom: 24px; border-radius: 12px; margin-top: 10px; }
        .logo-area { display: flex; align-items: center; gap: 12px; }
        .logo-icon { width: 32px; height: 32px; background: var(--green); color: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3); }
        .logo-text .brand { font-size: 14px; font-weight: 800; color: var(--slate-900); line-height: 1.2; }
        .logo-text .tagline { font-size: 10px; font-weight: 700; color: var(--slate-500); letter-spacing: 0.05em; }

        .user-area { display: flex; align-items: center; gap: 20px; }
        .live-pill { display: flex; align-items: center; gap: 6px; padding: 4px 10px; background: var(--green-bg); color: var(--green); border-radius: 20px; font-size: 10px; font-weight: 800; border: 1px solid rgba(16, 185, 129, 0.2); box-shadow: 0 0 10px rgba(16, 185, 129, 0.1); }
        .live-dot { width: 6px; height: 6px; background: var(--green); border-radius: 50%; box-shadow: 0 0 6px var(--green); }
        .user-meta { text-align: right; line-height: 1.2; }
        .user-name { font-size: 12px; font-weight: 700; color: var(--slate-900); }
        .user-date { font-size: 11px; font-weight: 500; color: var(--slate-400); }
        .user-avatar { width: 32px; height: 32px; border-radius: 50%; background: #e0e7ff; color: #4f46e5; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; }

        .dashboard-container { max-width: 1400px; margin: 0 auto; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; align-items: start; }

        @media(max-width: 1160px) { .grid-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media(max-width: 768px) { .grid-3 { grid-template-columns: 1fr; } .top-nav { padding: 12px 16px; flex-wrap: wrap; } .user-meta, .live-pill { display: none !important; } }

        .anim-fade-up { opacity: 0; transform: translateY(20px); transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .anim-fade-up.visible { opacity: 1; transform: translateY(0); }

        .sec-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px; }
        .sec-title { font-size: 13px; font-weight: 800; color: var(--slate-800); letter-spacing: 0.08em; text-transform: uppercase; }
        .sec-meta { font-size: 11px; font-weight: 600; color: var(--slate-400); }

        .panel { background: rgba(255, 255, 255, 0.65); backdrop-filter: blur(24px); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.9); box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.03), inset 0 1px 0 rgba(255, 255, 255, 1); padding: 24px; margin-bottom: 32px; position: relative; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .panel:hover { transform: translateY(-2px); box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 1); }

        .alert-card { background: #ffffff; border-radius: 12px; padding: 18px; margin-bottom: 16px; display: flex; gap: 16px; align-items: flex-start; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.04); position: relative; overflow: hidden; cursor: pointer; transition: all 0.3s ease; }
        .alert-card:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.1); }
        .alert-card.critical { border-left: 4px solid var(--red); background: linear-gradient(90deg, #fef2f2 0%, #ffffff 60%); }
        .alert-card.warning { border-left: 4px solid var(--amber); background: linear-gradient(90deg, #fffbeb 0%, #ffffff 60%); }
        .a-icon { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; flex-shrink: 0; }
        .critical .a-icon { background: var(--red-bg); color: var(--red); border: 1px solid var(--red-dim); }
        .warning .a-icon { background: var(--amber-bg); color: var(--amber); border: 1px solid #fcd34d; }
        .a-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; line-height: 1.3; }
        .critical .a-title { color: #991b1b; } .warning .a-title { color: #92400e; }
        .a-desc { font-size: 12px; font-weight: 500; margin-bottom: 8px; line-height: 1.4; color: var(--slate-600); }
        .a-time { font-size: 11px; color: var(--red); }
        .a-badge { position: absolute; top: 18px; right: 18px; font-size: 10px; font-weight: 700; padding: 4px 8px; border-radius: 6px; }
        .critical .a-badge { background: var(--red-bg); color: var(--red); }

        .prog-track { height: 20px; background: rgba(241, 245, 249, 0.7); border-radius: 20px; display: flex; box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04); overflow: hidden; }
        .prog-fill { height: 100%; width: 0; transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1); border-radius: 20px; display: flex; align-items: center; padding: 0 12px; color: #fff; font-size: 11px; font-weight: 700; }
        .prog-fill.blue { background: linear-gradient(90deg, #60a5fa, #3b82f6); }
        .prog-fill.green { background: linear-gradient(90deg, #34d399, #10b981); }
        .prog-fill.amber { background: linear-gradient(90deg, #fbbf24, #f59e0b); }
        .prog-fill.cyan { background: linear-gradient(90deg, #22d3ee, #06b6d4); }

        .yvt-wrap { margin-bottom: 20px; }
        .yvt-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 8px; }
        .yvt-label { font-size: 12px; font-weight: 800; color: #1e293b; letter-spacing: 0.02em; }
        .yvt-deficit { font-size: 10px; font-weight: 700; color: var(--slate-500); background: #f8fafc; padding: 3px 8px; border-radius: 6px; border: 1px solid #e2e8f0; }
        .yvt-track { height: 24px; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; align-items: center; padding: 2px; margin-bottom: 6px; position:relative; }
        .yvt-fill { height: 100%; border-radius: 10px; display: flex; align-items: center; padding: 0 10px; color: #fff; font-size: 11px; font-weight: 800; width: 0; transition: width 1.2s ease; overflow:hidden; white-space:nowrap; }
        .yvt-fill.blue { background: #3b82f6; } .yvt-fill.green { background: #10b981; } .yvt-fill.amber { background: #f59e0b; } .yvt-fill.cyan { background: #06b6d4; }
        .yvt-sub { display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; color: var(--slate-400); padding: 0 2px; }

        .gauge-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 32px; }
        .gauge-card { border: 1px solid rgba(255, 255, 255, 0.6); border-radius: 16px; padding: 24px 20px 20px; text-align: center; background: rgba(255, 255, 255, 0.6); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02); display: flex; flex-direction: column; align-items: center;}
        .gauge-card.bio { background: #fffdf5; border-color: #fef3c7; }
        .gauge-card.water { background: #f0fdfa; border-color: #ccfbf1; }
        
        .fin-block { border-radius: 16px; padding: 20px; border: 1px solid transparent; }
        .fin-block.bg-green { background: linear-gradient(135deg, rgba(240, 253, 244, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%); border-color: #dcfce7; }
        .fin-block.bg-red { background: linear-gradient(135deg, rgba(254, 242, 242, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%); border-color: #fee2e2; }

        .navy-block { background: var(--slate-800); color: #fff; padding: 18px 24px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin: 24px 0 32px; }
        .chip-green { background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 4px 10px; border-radius: 12px; font-weight: 800; font-size: 14px; border: 1px solid rgba(16, 185, 129, 0.3); }

        .donut-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none; width: 100%; }
        .legend-item { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; color: var(--slate-600); margin-bottom: 20px; justify-content: space-between;}
        .legend-num { padding: 4px 10px; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 6px; font-size: 16px; font-weight: 700; color: var(--slate-900); }
        .dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;}

        .att-bar { position: relative; height: 12px; border-radius: 6px; background: rgba(241, 245, 249, 1); margin: 20px 0 16px; box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06); overflow: hidden; }
        .att-fill { height: 100%; width: 0; background-color: #f87171; background-image: repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.25) 0px, rgba(255, 255, 255, 0.25) 6px, transparent 6px, transparent 12px), linear-gradient(90deg, #f87171, #ef4444); transition: width 1.2s ease; }
        
        .flex-between { display: flex; justify-content: space-between; align-items: center; }
        .flex-start { display: flex; justify-content: flex-start; align-items: center; gap: 8px; }
      `}</style>

      <div className="adv-dash relative">
        <div className="mesh-bg">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>

        <nav className="top-nav">
          <div className="logo-area">
            <div className="logo-icon">WM</div>
            <div className="logo-text">
              <div className="brand">EcoPlant Ops</div>
              <div className="tagline">COMMAND CENTER</div>
            </div>
          </div>
          <div className="user-area">
            <div className="live-pill"><span className="live-dot"></span> LIVE SYNC</div>
            <div className="user-meta">
              <div className="user-name">Manager Account</div>
              <div className="user-date">Live Dashboard View</div>
            </div>
            <div className="user-avatar">AD</div>
          </div>
        </nav>

        <div className="dashboard-container pb-10">
          <div className="grid-3">

            {/* COLUMN 1 */}
            <div className="col">
              <div className="sec-header anim-fade-up">
                <div className="sec-title">ACTION REQUIRED</div>
                <div className="sec-meta">2 Critical, 1 Warning</div>
              </div>

              <div className="alert-card critical anim-fade-up">
                <div className="a-icon">!</div>
                <div className="a-content">
                  <div className="a-title">Forklift Near-Miss</div>
                  <div className="a-desc">Operator: Ravi S. · Unresolved safety incident</div>
                  <div className="a-time">Reported 07:42 AM today</div>
                </div>
                <div className="a-badge">Zone B</div>
              </div>

              <div className="alert-card warning anim-fade-up" style={{ marginBottom: 32 }}>
                <div className="a-icon">!</div>
                <div className="a-content">
                  <div className="a-title">Attendance Critical: 22.9%</div>
                  <div className="a-desc">8/35 workers present. High risk for SLA breaches.</div>
                </div>
              </div>

              <div className="sec-header anim-fade-up">
                <div className="sec-title">WORKFORCE & TASKS</div>
              </div>
              
              <div className="panel anim-fade-up" style={{ background: '#ffffff', padding: 28 }}>
                <div className="flex-between" style={{ alignItems: 'baseline', marginBottom: 8 }}>
                  <div><span style={{ fontSize: 48, fontWeight: 800, color: 'var(--slate-800)', lineHeight: 1 }}><CountUp target={8}/></span> <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--slate-500)' }}>/ 35 PRESENT</span></div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--red)' }}><CountUp target={22.9} suffix="%" decimals={1}/></div>
                </div>

                <div className="att-bar">
                  <div className="att-fill" data-width="22.9%"></div>
                </div>

                <div className="flex-between" style={{ marginBottom: 32, fontSize: 12, fontWeight: 600, color: 'var(--slate-600)' }}>
                  <div className="flex-start">
                    <div className="flex-start" style={{ marginRight: 12 }}><div className="dot" style={{ background: 'var(--red)' }}></div> ABSENT (27)</div>
                    <div className="flex-start"><div className="dot" style={{ background: 'var(--green)' }}></div> PRESENT (8)</div>
                  </div>
                  <div>TARGET: 80%</div>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', margin: '0 -28px 32px', width: 'calc(100% + 56px)' }}></div>

                <div className="flex-between" style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--slate-800)' }}>Task Completion</div>
                  <div style={{ fontSize: 11, padding: '4px 10px', background: '#f8fafc', borderRadius: 8, color: 'var(--slate-500)', fontWeight: 600 }}>14 TOTAL</div>
                </div>

                <div className="flex-start gap-5">
                  <div style={{ position: 'relative', width: 130, height: 130 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={taskData} cx="50%" cy="50%" innerRadius={45} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                          {taskData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-center">
                      <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--slate-800)', lineHeight: 1.1 }}><CountUp target={28} suffix="%"/></div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--slate-500)', letterSpacing: '0.05em', marginTop: 2 }}>DONE</div>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="legend-item"><div className="flex-start"><div className="dot" style={{ background: 'var(--red)' }}></div><span>OVERDUE</span></div><div className="legend-num">3</div></div>
                    <div className="legend-item"><div className="flex-start"><div className="dot" style={{ background: 'var(--amber)' }}></div><span>OPEN</span></div><div className="legend-num">7</div></div>
                    <div className="legend-item" style={{ marginBottom: 0 }}><div className="flex-start"><div className="dot" style={{ background: 'var(--green)' }}></div><span>DONE</span></div><div className="legend-num"><CountUp target={4}/></div></div>
                  </div>
                </div>
              </div>

              <div className="sec-header anim-fade-up">
                <div className="sec-title">YESTERDAY VS TARGET</div>
                <div className="sec-meta">Mar 19 Review</div>
              </div>
              <div className="panel anim-fade-up" style={{ paddingBottom: 24 }}>
                <div className="yvt-wrap">
                  <div className="yvt-head"><div className="yvt-label">SOLID WASTE</div><div className="yvt-deficit">Deficit: 80 kg</div></div>
                  <div className="yvt-track"><div className="yvt-fill blue" data-width="84%">420 kg</div></div>
                  <div className="yvt-sub"><span>0</span><span>TARGET: 500</span></div>
                </div>
                <div className="yvt-wrap">
                  <div className="yvt-head"><div className="yvt-label">LIQUID WASTE</div><div className="yvt-deficit">Deficit: 500 L</div></div>
                  <div className="yvt-track"><div className="yvt-fill green" data-width="93%">7500 L</div></div>
                  <div className="yvt-sub"><span>0</span><span>TARGET: 8000</span></div>
                </div>
                <div className="yvt-wrap">
                  <div className="yvt-head"><div className="yvt-label">BIO GAS</div><div className="yvt-deficit">Deficit: 10 m³</div></div>
                  <div className="yvt-track"><div className="yvt-fill amber" data-width="80%">40 m³</div></div>
                  <div className="yvt-sub"><span>0</span><span>TARGET: 50</span></div>
                </div>
              </div>
            </div>

            {/* COLUMN 2 */}
            <div className="col">
              <div className="sec-header anim-fade-up">
                <div className="sec-title">WASTE OPERATIONS</div>
                <div className="sec-meta">Live Intakes</div>
              </div>

              <div className="panel anim-fade-up" style={{ padding: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--slate-800)', marginBottom: 24 }}>Collection vs Processing Pipeline</div>

                <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                  <div className="flex-between" style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate-700)' }}>SOLID WASTE (KG)</div>
                    <div style={{ fontSize: 11, padding: '4px 10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, color: 'var(--slate-500)', fontWeight: 600 }}>TARGET: 500</div>
                  </div>
                  <div className="prog-track" style={{ height: 32, background: '#e2e8f0', borderRadius: 16, position: 'relative' }}>
                    <div className="prog-fill blue" data-width="45%" style={{ borderRadius: 16 }}></div>
                    <div style={{ position: 'absolute', left: 4, top: 4, height: 24, padding: '0 12px', background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: 12, display: 'flex', alignItems: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>
                      <CountUp target={225}/> &nbsp;Proc.
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 16, padding: 20, marginBottom: 32 }}>
                  <div className="flex-between" style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate-700)' }}>LIQUID WASTE (L)</div>
                    <div style={{ fontSize: 11, padding: '4px 10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, color: 'var(--slate-500)', fontWeight: 600 }}>TARGET: 8000</div>
                  </div>
                  <div className="prog-track" style={{ height: 32, background: '#e2e8f0', borderRadius: 16, position: 'relative' }}>
                    <div className="prog-fill green" data-width="65%" style={{ borderRadius: 16 }}></div>
                    <div style={{ position: 'absolute', left: 4, top: 4, height: 24, padding: '0 12px', background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: 12, display: 'flex', alignItems: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>
                      <CountUp target={5200}/> &nbsp;Proc.
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', margin: '0 -24px 32px', width: 'calc(100% + 48px)' }}></div>

                <div className="flex-between" style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--slate-800)' }}>Dry Waste Composition</div>
                  <div style={{ color: '#4f46e5', background: '#eef2ff', fontWeight: 800, padding: '6px 12px', borderRadius: 8, fontSize: 11 }}>Total: 500 kg</div>
                </div>

                <div className="flex-start" style={{ gap: 32, marginBottom: 32 }}>
                  <div style={{ position: 'relative', width: 140, height: 140 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={compData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="value" stroke="none">
                          {compData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="legend-item" style={{ marginBottom: 16 }}><div className="flex-start"><div className="dot" style={{ background: '#6366f1' }}></div><span style={{ fontWeight: 700 }}>PLASTIC</span></div><div><strong style={{ fontSize: 18, color: 'var(--slate-900)' }}><CountUp target={120}/></strong> <span style={{ fontSize: 12, color: 'var(--slate-400)' }}>kg</span></div></div>
                    <div className="legend-item" style={{ marginBottom: 16 }}><div className="flex-start"><div className="dot" style={{ background: '#f59e0b' }}></div><span style={{ fontWeight: 700 }}>PAPER</span></div><div><strong style={{ fontSize: 18, color: 'var(--slate-900)' }}><CountUp target={85}/></strong> <span style={{ fontSize: 12, color: 'var(--slate-400)' }}>kg</span></div></div>
                    <div className="legend-item" style={{ marginBottom: 16 }}><div className="flex-start"><div className="dot" style={{ background: '#64748b' }}></div><span style={{ fontWeight: 700 }}>METAL</span></div><div><strong style={{ fontSize: 18, color: 'var(--slate-900)' }}><CountUp target={45}/></strong> <span style={{ fontSize: 12, color: 'var(--slate-400)' }}>kg</span></div></div>
                    <div className="legend-item" style={{ marginBottom: 0 }}><div className="flex-start"><div className="dot" style={{ background: '#10b981' }}></div><span style={{ fontWeight: 700 }}>ORGANIC</span></div><div><strong style={{ fontSize: 18, color: 'var(--slate-900)' }}><CountUp target={250}/></strong> <span style={{ fontSize: 12, color: 'var(--slate-400)' }}>kg</span></div></div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', margin: '0 -24px 32px', width: 'calc(100% + 48px)' }}></div>

                <div className="gauge-grid">
                  <div className="gauge-card bio anim-fade-up">
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--slate-700)', letterSpacing: '0.05em', marginBottom: 10 }}>BIO GAS YIELD</div>
                    <div style={{ width: '100%', height: 80, position: 'relative' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={[{value: 80}, {value: 20}]} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={50} outerRadius={70} stroke="none" dataKey="value">
                            <Cell fill="#f59e0b" />
                            <Cell fill="#f8fafc" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ marginTop: -20, zIndex: 10 }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: '#ea580c', lineHeight: 1, marginBottom: 12 }}><CountUp target={80} suffix="%"/></div>
                      <div style={{ fontSize: 11, fontWeight: 700, background: '#fff', padding: '6px 14px', borderRadius: 6, border: '1px solid #f1f5f9', color: 'var(--slate-700)' }}>40 / 50 m³</div>
                    </div>
                  </div>
                  <div className="gauge-card water anim-fade-up">
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--slate-700)', letterSpacing: '0.05em', marginBottom: 10 }}>WATER PURITY</div>
                    <div style={{ width: '100%', height: 80, position: 'relative' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={[{value: 90}, {value: 10}]} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={50} outerRadius={70} stroke="none" dataKey="value">
                            <Cell fill="#06b6d4" />
                            <Cell fill="#f8fafc" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ marginTop: -20, zIndex: 10 }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: '#0284c7', lineHeight: 1, marginBottom: 12 }}><CountUp target={90} suffix="%"/></div>
                      <div style={{ fontSize: 11, fontWeight: 700, background: '#fff', padding: '6px 14px', borderRadius: 6, border: '1px solid #f1f5f9', color: 'var(--slate-700)' }}>4.5k / 5k L</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3 */}
            <div className="col">
              <div className="sec-header anim-fade-up">
                <div className="sec-title">FINANCIAL OVERVIEW</div>
                <div className="sec-meta">Q1 2026 Trend</div>
              </div>

              <div className="panel anim-fade-up" style={{ padding: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="fin-block bg-green">
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', marginBottom: 4 }}>TOTAL INCOME</div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--slate-900)', margin: '6px 0 12px', lineHeight: 1 }}><CountUp target={2.4} isCurrency suffix="L" decimals={1}/></div>
                    <div style={{ fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 6, display: 'inline-block', color: 'var(--green)', background: '#dcfce7' }}>↑ 8.2% <span style={{ fontWeight: 500, fontSize: 10 }}>vs Feb</span></div>
                  </div>
                  <div className="fin-block bg-red">
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--red)', marginBottom: 4 }}>TOTAL EXPENSE</div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--slate-900)', margin: '6px 0 12px', lineHeight: 1 }}><CountUp target={1.8} isCurrency suffix="L" decimals={1}/></div>
                    <div style={{ fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 6, display: 'inline-block', color: 'var(--red)', background: '#fee2e2' }}>↑ 3.1% <span style={{ fontWeight: 500, fontSize: 10 }}>vs Feb</span></div>
                  </div>
                </div>

                <div className="navy-block anim-fade-up">
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate-300)', letterSpacing: '0.05em' }}>NET SURPLUS MARGIN</div>
                  <div className="chip-green"><CountUp target={0.6} isCurrency suffix="L" decimals={1}/> <span style={{ color: '#fff' }}>(25%)</span></div>
                </div>

                <div style={{ height: 180, width: '100%', marginTop: 24 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={finData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.03)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} tickFormatter={v => "₹" + v} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                      <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" />
                      <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="sec-header anim-fade-up" style={{ marginTop: 32 }}>
                <div className="sec-title">FLEET & ASSET TRACKING</div>
                <div className="sec-meta">Real-time Status</div>
              </div>

              <div className="panel anim-fade-up">
                <div className="flex-between" style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-900)' }}>Asset Parameter Feeding</div>
                  <div style={{ fontSize: 11, padding: '4px 10px', background: 'rgba(241, 245, 249, 0.8)', borderRadius: 8, color: 'var(--slate-500)', fontWeight: 600 }}>17 TOTAL</div>
                </div>

                <div className="prog-track" style={{ marginBottom: 16, background: 'transparent', boxShadow: 'none', height: 20 }}>
                  <div className="prog-fill green" data-width="65%" style={{ borderRadius: '10px 0 0 10px', justifyContent: 'center', boxShadow: '0 2px 10px rgba(16,185,129,0.2)', zIndex: 1 }}>65% Fed</div>
                  <div className="prog-fill amber" data-width="35%" style={{ borderRadius: '0 10px 10px 0', justifyContent: 'center' }}>35% Pend</div>
                </div>

                <div className="flex-between" style={{ marginBottom: 36, color: 'var(--slate-600)', fontSize: 12, fontWeight: 600 }}>
                  <div className="flex-start"><div className="dot" style={{ background: 'var(--green)' }}></div> 11 COMPLIANT</div>
                  <div className="flex-start"><div className="dot" style={{ background: 'var(--amber)' }}></div> 6 MISSING</div>
                </div>

                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 20 }}>Fleet Utilization</div>

                <div className="flex-start gap-4">
                  <div style={{ position: 'relative', width: 80, height: 80 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={fleetData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} paddingAngle={2} dataKey="value" stroke="none">
                          {fleetData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-center" style={{ fontSize: 16, fontWeight: 800, color: 'var(--slate-900)' }}>
                      <CountUp target={75} suffix="%"/>
                    </div>
                  </div>
                  <div style={{ flex: 1, marginLeft: 16 }}>
                    <div className="legend-item" style={{ marginBottom: 12 }}><div className="flex-start"><div className="dot" style={{ background: 'var(--green)' }}></div><span style={{ fontSize: 12 }}>ACTIVE</span></div><div className="legend-num" style={{ padding: '2px 8px', fontSize: 14 }}><CountUp target={3}/></div></div>
                    <div className="legend-item" style={{ marginBottom: 0 }}><div className="flex-start"><div className="dot" style={{ background: 'var(--amber)' }}></div><span style={{ fontSize: 12 }}>MAINT.</span></div><div className="legend-num" style={{ padding: '2px 8px', fontSize: 14 }}><CountUp target={1}/></div></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
"""

with open("src/app/dashboard/page.js", "w", encoding="utf-8") as file:
    file.write(html_content)

print("Dashboard rewrite complete.")
