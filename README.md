# Plant Manager Dashboard

A comprehensive, real-time analytics platform built specifically for Plant Managers to oversee facility operations, productivity, and safety. Built with Next.js, TailwindCSS, and a scalable data architecture.

## 🌟 Why Plant Manager Dashboard?

This dashboard is designed to cut through the noise of daily operations and deliver **actionable insights** directly to plant management. Traditional SCADA and reporting systems can be clunky, disjointed, and hard to view on the go. 

**Key advantages include:**
- **Real-Time Responsiveness:** Instantly view live metrics rather than waiting for end-of-shift reports.
- **Mobile-First Experience:** Monitor floor progress, view safety incidents, and track KPIs from anywhere in the facility directly on your phone.
- **Extra Operational Insights:** Goes beyond basic output-tracking by visualizing predictive trends, downtime root causes, shift-by-shift performance comparisons, and resource utilization.
- **Unified Overview:** Consolidate data from multiple machines, shifts, and departments into one crystal-clear interface.

## 🛠️ Tech Stack
- Next.js (App Router)
- TailwindCSS
- Zustand (State Management)
- Firebase Admin SDK
- Custom API Integrations

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone <repo-url>
cd plant_manager_dashboard
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:

```
BASE_URL=http://localhost:3000
ADMIN_SECRET=your_firebase_admin_credentials
```

### 3. Run Locally
```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000) and will directly land on the Dashboard without authentication.

## 🔧 Core Components & Extra Insights

### Production Tracking Dashboard (`/dashboard`)
- **Live Output Cards**: Real-time throughput, cycle times, and yield statistics.
- **Downtime Analytics**: Cumulative tracking and root-cause visualization for equipment delays.
- **Shift Performance Filtering**: Advanced filtering by specific production lines, shifts, or manager assignments.
- **Yield and Quality Tables**: Sortable defect and quality history with detailed breakdowns.

### Smart Data Processing
1. **Raw Sensor/Machine Import**: Interfaces with factory data sources.
2. **Data Normalization**: Conversion for standard reporting formats.
3. **Automated Grouping**: Identifies shifts automatically.
4. **Predictive Metrics Calculation**: Real-time analytical predictions for shift targets.
5. **Chart Data Generation**: Smooth, responsive time-series visualization.

## 🌐 Next Steps & Architecture
- **PWA Support**: Full offline capability for areas with low connectivity on the shop floor.
- **Alert Systems**: Push notifications for critical machine faults or safety triggers.
- **Advanced Forecasting**: Machine-learning predictions for preventive maintenance based on past failure states limits.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
