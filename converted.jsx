<div className="d">
<!-- Just pasting the main div structure -->
  <div className="topbar">
    <div>
      <div className="t-name">Pundalik Tilve</div>
      <div className="t-sub">Plant Manager · Fri Mar 20</div>
    </div>
    <div className="live"><div className="dot-live"></div>Live</div>
  </div>

  <div className="main">

    <!-- ══ 1. WARNINGS & EMERGENCIES ══ -->
    <div>
      <div className="sec-label">Warnings & Emergencies</div>
      <div className="card" style={{ padding: '10px 12px' }}>
        <div className="warn-critical">
          <div className="warn-icon">!</div>
          <div>
            <div className="warn-title">Incident — Forklift near-miss · Zone B</div>
            <div className="warn-sub">Operator: Ravi S. · Unresolved · Action required</div>
            <div className="warn-time">Reported 07:42 AM today</div>
          </div>
        </div>
        <div className="warn-high">
          <div className="warn-icon">!</div>
          <div>
            <div className="warn-title">Attendance critical — 22.9% present</div>
            <div className="warn-sub">Only 8 of 35 workers present. SOP tasks at risk.</div>
          </div>
        </div>
        <div className="warn-high" style={{ marginBottom: '0' }}>
          <div className="warn-icon">!</div>
          <div>
            <div className="warn-title">4 asset readings missed yesterday</div>
            <div className="warn-sub">13/17 assets fed. 4 readings incomplete since Mar 19.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ 2. WASTE OPERATIONS ══ -->
    <div>
      <div className="sec-label">Waste Operations</div>
      <div className="card">
        <div className="ws-2col">
          <div className="ws-block">
            <div className="ws-hd"><span className="ws-title">Solid Waste</span><span className="ws-target">Target 500 kg</span></div>
            <div className="ws-row"><span className="ws-rl">Collected</span><span className="ws-rv">0 kg</span></div>
            <div className="bar-bg"><div className="bar-fill" style={{ background: '#3B82F6', width: '0%' }}></div></div>
            <div className="ws-row"><span className="ws-rl">Processed</span><span className="ws-rv">0 kg</span></div>
            <div className="bar-bg"><div className="bar-fill" style={{ background: '#93C5FD', width: '0%' }}></div></div>
          </div>
          <div className="ws-block">
            <div className="ws-hd"><span className="ws-title">Liquid Waste</span><span className="ws-target">Target 8000 L</span></div>
            <div className="ws-row"><span className="ws-rl">Collected</span><span className="ws-rv">0 L</span></div>
            <div className="bar-bg"><div className="bar-fill" style={{ background: '#10B981', width: '0%' }}></div></div>
            <div className="ws-row"><span className="ws-rl">Processed</span><span className="ws-rv">0 L</span></div>
            <div className="bar-bg"><div className="bar-fill" style={{ background: '#6EE7B7', width: '0%' }}></div></div>
          </div>
        </div>
        <div className="divider"></div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
            <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--color-text-primary)' }}>Dry Waste Segregation</span>
            <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Total: 0 kg today</span>
          </div>
          <div className="seg-row"><span className="seg-lbl">Plastic</span><div className="seg-bar-bg"><div className="seg-bar-fill" style={{ background: '#6366F1', width: '0%' }}></div></div><span className="seg-val">0 kg</span></div>
          <div className="seg-row"><span className="seg-lbl">Paper</span><div className="seg-bar-bg"><div className="seg-bar-fill" style={{ background: '#F59E0B', width: '0%' }}></div></div><span className="seg-val">0 kg</span></div>
          <div className="seg-row"><span className="seg-lbl">Metal</span><div className="seg-bar-bg"><div className="seg-bar-fill" style={{ background: '#6B7280', width: '0%' }}></div></div><span className="seg-val">0 kg</span></div>
          <div className="seg-row"><span className="seg-lbl">Organic</span><div className="seg-bar-bg"><div className="seg-bar-fill" style={{ background: '#16A34A', width: '0%' }}></div></div><span className="seg-val">0 kg</span></div>
        </div>
        <div className="divider"></div>
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '6px' }}>Bio Gas</div>
          <div className="strip3">
            <div className="strip-b"><div className="strip-v">0 m³</div><div className="strip-l">Generated</div></div>
            <div className="strip-b"><div className="strip-v">0 kWh</div><div className="strip-l">Power out</div></div>
            <div className="strip-b"><div className="strip-v" style={{ color: '#DC2626' }}>0%</div><div className="strip-l">vs target</div></div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '6px' }}>Water Purification</div>
          <div className="strip3" style={{ marginBottom: '6px' }}>
            <div className="strip-b"><div className="strip-v" style={{ color: '#2563EB' }}>0 L</div><div className="strip-l">Treated</div></div>
            <div className="strip-b"><div className="strip-v" style={{ color: '#0D9488' }}>0 L</div><div className="strip-l">Purified</div></div>
            <div className="strip-b"><div className="strip-v" style={{ color: '#DC2626' }}>0%</div><div className="strip-l">Recovery</div></div>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}><span>Progress</span><span>Target: 5000 L</span></div>
          <div className="bar-bg" style={{ height: '5px', borderRadius: '3px' }}><div className="bar-fill" style={{ background: '#2563EB', width: '0%', height: '5px' }}></div></div>
        </div>
        <div className="divider"></div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '8px' }}>Completion Rates</div>
          <div className="completion-row" style={{ paddingTop: '0' }}>
            <div className="ring-wrap">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="22" fill="none" strokeWidth="6" stroke="var(--color-background-secondary)"/>
                <circle cx="30" cy="30" r="22" fill="none" strokeWidth="6" stroke="#DC2626" strokeDasharray="0 138" strokeLinecap="round" transform="rotate(-90 30 30)"/>
              </svg>
              <span className="ring-label">0%</span>
            </div>
            <div className="completion-detail">
              <div className="comp-title">SOP Task Completion</div>
              <div className="comp-row"><span className="comp-lbl">Completed</span><span className="comp-val" style={{ color: '#16A34A' }}>0 / 10</span></div>
              <div className="comp-row"><span className="comp-lbl">Overdue</span><span className="comp-val" style={{ color: '#DC2626' }}>3 tasks</span></div>
              <div className="comp-row"><span className="comp-lbl">Pending</span><span className="comp-val" style={{ color: '#D97706' }}>7 tasks</span></div>
            </div>
          </div>
          <div style={{ height: '0.5px', background: 'var(--color-border-tertiary)', margin: '6px 0' }}></div>
          <div className="completion-row">
            <div className="ring-wrap">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="22" fill="none" strokeWidth="6" stroke="var(--color-background-secondary)"/>
                <circle cx="30" cy="30" r="22" fill="none" strokeWidth="6" stroke="#D97706" strokeDasharray="89 138" strokeLinecap="round" transform="rotate(-90 30 30)"/>
              </svg>
              <span className="ring-label" style={{ fontSize: '11px' }}>65%</span>
            </div>
            <div className="completion-detail">
              <div className="comp-title">Asset Parameter Feeding</div>
              <div className="comp-row"><span className="comp-lbl">Fed today</span><span className="comp-val" style={{ color: '#16A34A' }}>11 / 17</span></div>
              <div className="comp-row"><span className="comp-lbl">Pending</span><span className="comp-val" style={{ color: '#D97706' }}>6 assets</span></div>
              <div className="comp-row"><span className="comp-lbl">Overdue (yest.)</span><span className="comp-val" style={{ color: '#DC2626' }}>4 missed</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ 3. MAINTENANCE PIPELINE ══ -->
    <div>
      <div className="sec-label">Maintenance Pipeline</div>
      <div className="card">
        <div className="mp3">
          <div className="mp-b sched"><div className="mp-n">4</div><div className="mp-l">Scheduled</div></div>
          <div className="mp-b inprog"><div className="mp-n">2</div><div className="mp-l">In Progress</div></div>
          <div className="mp-b done"><div className="mp-n">3</div><div className="mp-l">Completed</div></div>
        </div>
        <div className="row-item"><div className="m-dot" style={{ background: '#D97706' }}></div><span className="m-name">Baling machine — belt inspection</span><span className="badge b-amber">In Progress</span></div>
        <div className="row-item"><div className="m-dot" style={{ background: '#3B82F6' }}></div><span className="m-name">Tata LPT 8000L — oil change</span><span className="badge b-blue">Scheduled</span></div>
        <div className="row-item"><div className="m-dot" style={{ background: '#D97706' }}></div><span className="m-name">Bio gas genset — filter check</span><span className="badge b-amber">In Progress</span></div>
        <div className="row-item"><div className="m-dot" style={{ background: '#16A34A' }}></div><span className="m-name">Weigh bridge — calibration</span><span className="badge b-green">Completed</span></div>
      </div>
    </div>

    <!-- ══ 4. WORKFORCE MANAGEMENT ══ -->
    <div>
      <div className="sec-label">Workforce Management</div>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '26px', fontWeight: '500', color: '#DC2626' }}>8</span>
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>/ 35 present</span>
          <span style={{ marginLeft: 'auto', fontSize: '18px', fontWeight: '500', color: '#DC2626' }}>22.9%</span>
        </div>
        <div className="att-track"><div className="att-fill" style={{ background: '#DC2626', width: '22.9%' }}></div></div>
        <div className="att-leg">
          <span><div className="ld" style={{ background: '#DC2626' }}></div>Absent (27)</span>
          <span><div className="ld" style={{ background: '#16A34A' }}></div>Present (8)</span>
          <span style={{ marginLeft: 'auto' }}>Target 80%</span>
        </div>
        <div className="divider"></div>
        <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '6px' }}>Top Supervisors</div>
        <div className="sup-row">
          <div className="sup-av" style={{ background: '#E6F1FB', color: '#185FA5' }}>BG</div>
          <span className="sup-name">Bhagvan Gawade</span>
          <span className="sup-tasks">0 tasks done</span>
        </div>
        <div className="sup-row">
          <div className="sup-av" style={{ background: '#EAF3DE', color: '#3B6D11' }}>MK</div>
          <span className="sup-name">Manish Kumar</span>
          <span className="sup-tasks">0 tasks done</span>
        </div>
        <div className="sup-row">
          <div className="sup-av" style={{ background: '#FAEEDA', color: '#854F0B' }}>SN</div>
          <span className="sup-name">Sujit Naik</span>
          <span className="sup-tasks">0 tasks done</span>
        </div>
        <div className="divider"></div>
        <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '6px' }}>Tasks Assigned Today</div>
        <div className="task-box">
          <div className="tb-s"><div className="tb-v" style={{ color: '#DC2626' }}>3</div><div className="tb-l">Overdue</div></div>
          <div className="tb-s"><div className="tb-v" style={{ color: '#D97706' }}>7</div><div className="tb-l">Open</div></div>
          <div className="tb-s"><div className="tb-v" style={{ color: '#16A34A' }}>0</div><div className="tb-l">Done</div></div>
        </div>
        <div className="t-row">
          <div className="t-dot" style={{ background: '#DC2626' }}></div>
          <span className="t-name">Morning waste intake log</span>
          <span className="t-assign">Bhagvan G.</span>
          <span className="badge b-red">Overdue</span>
        </div>
        <div className="t-row">
          <div className="t-dot" style={{ background: '#DC2626' }}></div>
          <span className="t-name">Effluent quality check</span>
          <span className="t-assign">Manish K.</span>
          <span className="badge b-red">Overdue</span>
        </div>
        <div className="t-row">
          <div className="t-dot" style={{ background: '#DC2626' }}></div>
          <span className="t-name">Incident report filing</span>
          <span className="t-assign">Sujit N.</span>
          <span className="badge b-red">Overdue</span>
        </div>
        <div className="t-row">
          <div className="t-dot" style={{ background: '#D97706' }}></div>
          <span className="t-name">Bio gas pressure reading</span>
          <span className="t-assign">Sujit N.</span>
          <span className="badge b-amber">Pending</span>
        </div>
        <div className="t-row">
          <div className="t-dot" style={{ background: '#D97706' }}></div>
          <span className="t-name">Weigh bridge daily check</span>
          <span className="t-assign">Unassigned</span>
          <span className="badge b-gray">Pending</span>
        </div>
        <div style={{ textAlign: 'center', paddingTop: '8px', fontSize: '11px', color: '#2563EB', cursor: 'pointer' }}>View all 10 tasks ↗</div>
      </div>
    </div>

    <!-- ══ 5. FINANCIALS ══ -->
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Net surplus this month</span>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#15803D' }}>₹0.6L</span>
        </div>
        <div style={{ position: 'relative', width: '100%', height: '64px' }}>
          {/* CHART PLACEHOLDER */}
          <FinancialsChart />
        </div>
        <div style={{ display: 'flex', gap: '14px', marginTop: '6px', fontSize: '10px', color: 'var(--color-text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#16A34A' }}></span>Income</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#EF4444' }}></span>Expense</span>
        </div>
      </div>
    </div>

    <!-- ══ 6. ASSET FEEDING ══ -->
    <div>
      <div className="sec-label">Asset Live Readings</div>
      <div className="card" style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)' }}>17 assets total</span>
          <span style={{ fontSize: '11px', color: '#D97706', fontWeight: '500' }}>11 fed · 6 pending</span>
        </div>
        <div className="bar-bg" style={{ height: '5px', marginBottom: '10px' }}><div className="bar-fill" style={{ background: '#D97706', width: '65%', height: '5px' }}></div></div>

        <div className="af-row"><div className="af-dot" style={{ background: '#16A34A' }}></div><span className="af-name">Tata LPT (8000L)</span><span className="af-cat">Liquid WM</span><span className="badge b-green">Fed</span></div>
        <div className="af-row"><div className="af-dot" style={{ background: '#16A34A' }}></div><span className="af-name">Manual Forklift</span><span className="af-cat">Solid WM</span><span className="badge b-green">Fed</span></div>
        <div className="af-row"><div className="af-dot" style={{ background: '#16A34A' }}></div><span className="af-name">Weigh Bridge</span><span className="af-cat">Solid WM</span><span className="badge b-green">Fed</span></div>
        <div className="af-row"><div className="af-dot" style={{ background: '#16A34A' }}></div><span className="af-name">2G HP Baling Machine</span><span className="af-cat">Solid WM</span><span className="badge b-green">Fed</span></div>
        <div className="af-row"><div className="af-dot" style={{ background: '#D97706' }}></div><span className="af-name">5 TPD Bio Gas + Genset</span><span className="af-cat">Bio Gas</span><span className="badge b-amber">Pending</span></div>
        <div className="af-row"><div className="af-dot" style={{ background: '#D97706' }}></div><span className="af-name">Effluent Treatment Plant</span><span className="af-cat">Liquid WM</span><span className="badge b-amber">Pending</span></div>
        <div style={{ textAlign: 'center', paddingTop: '8px', fontSize: '11px', color: '#2563EB', cursor: 'pointer' }}>View all 17 assets ↗</div>
      </div>
    </div>

    <!-- ══ 7. FLEET TRACKING ══ -->
    <div>
      <div className="sec-label">Fleet Tracking <span className="dot-live" style={{ marginLeft: '4px' }}></span></div>
      <div className="card">
        <div className="fleet4">
          <div className="fs"><div className="fs-v">4</div><div className="fs-l">Total</div></div>
          <div className="fs"><div className="fs-v" style={{ color: '#16A34A' }}>3</div><div className="fs-l">Active</div></div>
          <div className="fs"><div className="fs-v" style={{ color: '#D97706' }}>1</div><div className="fs-l">Maint.</div></div>
          <div className="fs"><div className="fs-v">0</div><div className="fs-l">Trips</div></div>
        </div>
        <div className="v-row"><span className="v-id">TAT086547</span><span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', flex: '1', marginLeft: '8px' }}>0 trips · 0 km</span><span className="sb sb-a">Active</span></div>
        <div className="v-row"><span className="v-id">BOL087184</span><span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', flex: '1', marginLeft: '8px' }}>Under service</span><span className="sb sb-m">Maintenance</span></div>
        <div className="v-row"><span className="v-id">BOL087398</span><span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', flex: '1', marginLeft: '8px' }}>0 trips · 0 km</span><span className="sb sb-a">Active</span></div>
        <div className="v-row"><span className="v-id">TAT086545</span><span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', flex: '1', marginLeft: '8px' }}>0 trips · 0 km</span><span className="sb sb-a">Active</span></div>
        <div className="v-row"><span className="v-id">BOL086968</span><span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', flex: '1', marginLeft: '8px' }}>0 trips · 0 km</span><span className="sb sb-a">Active</span></div>
      </div>
    </div>

    <!-- ══ 8. YESTERDAY ══ -->
    <div>
      <div className="sec-label">Yesterday — Mar 19</div>
      <div className="card" style={{ padding: '8px 12px' }}>
        <div className="yd-row"><span className="yd-l">Solid waste collected</span><span className="yd-v" style={{ color: '#B45309' }}>0 kg — missed target</span></div>
        <div className="yd-row"><span className="yd-l">Dry waste segregated</span><span className="yd-v" style={{ color: '#B45309' }}>0 kg — missed target</span></div>
        <div className="yd-row"><span className="yd-l">Liquid waste processed</span><span className="yd-v" style={{ color: '#B45309' }}>0 L — missed target</span></div>
        <div className="yd-row"><span className="yd-l">Bio gas generated</span><span className="yd-v" style={{ color: '#B45309' }}>0 m³ — missed target</span></div>
        <div className="yd-row"><span className="yd-l">Water purified</span><span className="yd-v" style={{ color: '#B45309' }}>0 L — missed target</span></div>
        <div className="yd-row"><span className="yd-l">SOP tasks</span><span className="yd-v" style={{ color: '#15803D' }}>All completed</span></div>
        <div className="yd-row"><span className="yd-l">Asset readings</span><span className="yd-v" style={{ color: '#B45309' }}>13/17 — 4 missed</span></div>
        <div className="yd-row"><span className="yd-l">Attendance</span><span className="yd-v" style={{ color: '#15803D' }}>8/8 — 100%</span></div>
        <div className="yd-row"><span className="yd-l">Incidents</span><span className="yd-v" style={{ color: '#15803D' }}>0 — clear</span></div>
      </div>
    </div>

  </div>
</div>
