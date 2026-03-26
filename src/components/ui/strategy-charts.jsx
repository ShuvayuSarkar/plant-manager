'use client'

import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  LineChart,
  Line,
  ComposedChart,
} from 'recharts';
import { Badge } from '@/components/ui/badge';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${formatter ? formatter(entry.value) : entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function StrategyCharts({ strategyMetrics = {}, tradingData = [], selectedFilter = { type: "strategy", value: "all" } }) {
  // Process all trading data and group by the selected filter type
  const data = React.useMemo(() => {
    console.log("StrategyCharts received tradingData:", tradingData.length, "items");
    console.log("Selected filter:", selectedFilter);
    
    if (!tradingData || tradingData.length === 0) {
      console.log("No trading data available");
      return [];
    }

    // Group data by the selected filter type
    const groupedData = {};

    tradingData.forEach(trade => {
      let key;
      switch (selectedFilter.type) {
        case "strategy":
          key = trade.strategy;
          break;
        case "mistake":
          key = trade.mistake || "no_mistake";
          break;
        case "day":
          key = new Date(trade.date).toLocaleDateString('en-US', { weekday: 'long' });
          break;
        case "emotion":
          key = trade.emotion;
          break;
        case "slot":
          // Simple time slot logic based on hour
          const hour = new Date(trade.date).getHours();
          if (hour < 9) key = "Pre-Market";
          else if (hour < 10) key = "Opening";
          else if (hour < 12) key = "Morning";
          else if (hour < 15) key = "Afternoon";
          else key = "Closing";
          break;
        default:
          key = trade.strategy; // fallback to strategy
      }

      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(trade);
    });

    // Calculate metrics for each group
    return Object.entries(groupedData).map(([key, trades]) => {
      const winningTrades = trades.filter(t => t.pnl > 0);
      const losingTrades = trades.filter(t => t.pnl < 0);
      const totalPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
      const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
      const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length : 0;
      const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length) : 0;
      const avgDuration = trades.reduce((sum, t) => sum + (t.duration || 45), 0) / trades.length;

      console.log(`Group ${key}:`, { trades: trades.length, totalPnL, winRate });

      return {
        strategy: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
        winRate: winRate,
        totalTrades: trades.length,
        totalPnL: totalPnL,
        avgWin: avgWin,
        avgLoss: avgLoss,
        avgDuration: avgDuration,
        sharpeRatio: 0, // Simplified
        maxDrawdown: 0, // Simplified
      };
    }).sort((a, b) => b.totalPnL - a.totalPnL); // Sort by profitability
  }, [tradingData, selectedFilter]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No strategy data available</p>
      </div>
    );
  }

  // Prepare duration data with categories
  const durationData = data.map(item => ({
    ...item,
    durationCategory: item.avgDuration < 30 ? 'Quick' :
      item.avgDuration < 60 ? 'Medium' : 'Long'
  }));

  // Strategy distribution data
  const strategyDistribution = data.map((item, index) => ({
    name: item.strategy,
    value: item.totalTrades,
    pnl: item.totalPnL,
    fill: COLORS[index % COLORS.length]
  }));

  return (
    <div className="space-y-8 p-6">

      {/* 1. Dynamic Performance Chart */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">
            {selectedFilter.type.charAt(0).toUpperCase() + selectedFilter.type.slice(1)} Performance Overview
          </h3>
          <p className="text-sm text-muted-foreground">
            Win rate comparison across different {selectedFilter.type}s
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {/* Performance chart on left side */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />                <XAxis
                  dataKey="strategy"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Win Rate (%)', angle: -90, position: 'insideLeft' }}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip formatter={(value) => `${value.toFixed(1)}%`} />} />
                <Bar
                  dataKey="winRate"
                  name="Win Rate (%)"
                  radius={[4, 4, 0, 0]}
                >
                  {data.map((entry, index) => {
                    const color = entry.winRate >= 70 ? '#10B981' : // Green for high win rate
                      entry.winRate >= 50 ? '#3B82F6' : // Blue for medium win rate
                        entry.winRate >= 30 ? '#F59E0B' : // Orange for low win rate
                          '#EF4444'; // Red for very low win rate
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Empty right side */}
          <div></div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-green-500 text-green-700">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Excellent (≥70%): {data.filter(s => s.winRate >= 70).length} {selectedFilter.type}s
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-700">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Good (50-69%): {data.filter(s => s.winRate >= 50 && s.winRate < 70).length} {selectedFilter.type}s
            </Badge>
            <Badge variant="outline" className="border-orange-500 text-orange-700">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Average (30-49%): {data.filter(s => s.winRate >= 30 && s.winRate < 50).length} {selectedFilter.type}s
            </Badge>
            <Badge variant="outline" className="border-red-500 text-red-700">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Poor (&lt;30%): {data.filter(s => s.winRate < 30).length} {selectedFilter.type}s
            </Badge>
          </div>
          <div></div>
        </div>
      </div>

      {/* 2. Win/Loss Analysis */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">
            {selectedFilter.type.charAt(0).toUpperCase() + selectedFilter.type.slice(1)} Win/Loss Analysis
          </h3>
          <p className="text-sm text-muted-foreground">
            Average win size vs average loss size across {selectedFilter.type}s
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Average Win vs Loss Comparison */}
          <div className="h-64">
            <h4 className="text-sm font-medium mb-2">Average Win vs Loss Size</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="strategy" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                <Legend />
                <Bar dataKey="avgWin" fill="#10B981" name="Avg Win" />
                <Bar dataKey="avgLoss" fill="#EF4444" name="Avg Loss" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Trade Count Distribution */}
          <div className="h-64">
            <h4 className="text-sm font-medium mb-2">Trade Count by {selectedFilter.type.charAt(0).toUpperCase() + selectedFilter.type.slice(1)}</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="strategy" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="totalTrades" fill="#8884D8" name="Total Trades" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Duration Analysis */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">
            {selectedFilter.type.charAt(0).toUpperCase() + selectedFilter.type.slice(1)} Duration Analysis
          </h3>
          <p className="text-sm text-muted-foreground">
            Trading duration patterns across {selectedFilter.type}s
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Average Duration by Strategy */}
          <div className="h-64">
            <h4 className="text-sm font-medium mb-2">Average Duration by {selectedFilter.type.charAt(0).toUpperCase() + selectedFilter.type.slice(1)}</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={durationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="strategy" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<CustomTooltip formatter={(value) => `${value} min`} />} />
                <Bar dataKey="avgDuration" name="Avg Duration (min)">
                  {durationData.map((entry, index) => {
                    const color = entry.durationCategory === 'Quick' ? '#10B981' :
                      entry.durationCategory === 'Medium' ? '#F59E0B' : '#EF4444';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Duration vs Performance Correlation */}
          <div className="h-64">
            <h4 className="text-sm font-medium mb-2">Duration vs Win Rate Correlation</h4>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={durationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="strategy" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar yAxisId="left" dataKey="avgDuration" fill="#8884D8" name="Avg Duration (min)" />
                <Line yAxisId="right" type="monotone" dataKey="winRate" stroke="#FF7300" name="Win Rate %" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex justify-center flex-wrap gap-2">
          <Badge variant="outline" className="border-green-500 text-green-700">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Quick (&lt;30 min): {durationData.filter(s => s.durationCategory === 'Quick').length} {selectedFilter.type}s
          </Badge>
          <Badge variant="outline" className="border-orange-500 text-orange-700">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
            Medium (30-60 min): {durationData.filter(s => s.durationCategory === 'Medium').length} {selectedFilter.type}s
          </Badge>
          <Badge variant="outline" className="border-red-500 text-red-700">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Long (&gt;60 min): {durationData.filter(s => s.durationCategory === 'Long').length} {selectedFilter.type}s
          </Badge>
        </div>
      </div>

      {/* 4. Distribution Analysis */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">
            {selectedFilter.type.charAt(0).toUpperCase() + selectedFilter.type.slice(1)} Distribution
          </h3>
          <p className="text-sm text-muted-foreground">
            Trade count and P&L distribution across {selectedFilter.type}s
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strategy Type Distribution */}
          <div className="h-64">
            <h4 className="text-sm font-medium mb-2">Trade Count Distribution</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={strategyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {strategyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* P&L Distribution */}
          <div className="h-64">
            <h4 className="text-sm font-medium mb-2">P&L Distribution by {selectedFilter.type.charAt(0).toUpperCase() + selectedFilter.type.slice(1)}</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="strategy" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                <Bar dataKey="totalPnL" name="Total P&L">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.totalPnL >= 0 ? '#10B981' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strategy Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h5 className="font-medium text-green-800">Most Profitable</h5>
            <p className="text-sm text-green-600">
              {data.reduce((max, strategy) => strategy.totalPnL > max.totalPnL ? strategy : max, data[0])?.strategy || 'N/A'}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h5 className="font-medium text-blue-800">Highest Win Rate</h5>
            <p className="text-sm text-blue-600">
              {data.reduce((max, strategy) => strategy.winRate > max.winRate ? strategy : max, data[0])?.strategy || 'N/A'}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h5 className="font-medium text-purple-800">Most Active</h5>
            <p className="text-sm text-purple-600">
              {data.reduce((max, strategy) => strategy.totalTrades > max.totalTrades ? strategy : max, data[0])?.strategy || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}