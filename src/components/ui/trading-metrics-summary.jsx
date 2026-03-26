'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Target, Clock, BarChart3, Trophy, DollarSign, Activity } from 'lucide-react'

const formatCurrency = (value) => {
  if (value === 0) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`
  }
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function TradingMetricsSummary({ tradingData = [], selectedFilter = { type: "strategy", value: "all" } }) {
  // Calculate metrics based on current filter
  const metrics = React.useMemo(() => {
    if (!tradingData || tradingData.length === 0) {
      return {
        winRate: 0,
        totalWins: 0,
        totalLosses: 0,
        avgWinSize: 0,
        avgLossSize: 0,
        tradesPerDay: 0,
        maxProfit: 0,
        avgDuration: 0
      }
    }

    // Filter data based on selected filter if a specific value is selected
    let filteredData = tradingData
    if (selectedFilter.value !== "all") {
      filteredData = tradingData.filter(trade => {
        switch (selectedFilter.type) {
          case "strategy":
            return trade.strategy === selectedFilter.value
          case "mistake":
            return trade.mistake === selectedFilter.value
          case "day":
            const tradeDay = new Date(trade.date).toLocaleDateString('en-US', { weekday: 'long' })
            return tradeDay === selectedFilter.value
          case "emotion":
            return trade.emotion === selectedFilter.value
          case "slot":
            // Time slot logic would go here
            return true
          default:
            return true
        }
      })
    }

    const winningTrades = filteredData.filter(t => t.pnl > 0)
    const losingTrades = filteredData.filter(t => t.pnl < 0)
    const totalTrades = filteredData.length

    const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0
    const avgWinSize = winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length : 0
    const avgLossSize = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length) : 0
    const maxProfit = filteredData.length > 0 ? Math.max(...filteredData.map(t => t.pnl)) : 0
    const avgDuration = filteredData.length > 0 ? filteredData.reduce((sum, t) => sum + (t.duration || 45), 0) / filteredData.length : 0

    // Calculate trades per day (assuming data spans multiple days)
    const uniqueDays = new Set(filteredData.map(t => new Date(t.date).toDateString())).size
    const tradesPerDay = uniqueDays > 0 ? totalTrades / uniqueDays : 0

    return {
      winRate,
      totalWins: winningTrades.length,
      totalLosses: losingTrades.length,
      avgWinSize,
      avgLossSize,
      tradesPerDay,
      maxProfit,
      avgDuration
    }
  }, [tradingData, selectedFilter])

  const metricsCards = [
    {
      title: "Win Rate",
      value: `${metrics.winRate.toFixed(1)}%`,
      icon: Target,
      color: metrics.winRate >= 60 ? "text-green-600" : metrics.winRate >= 40 ? "text-blue-600" : "text-red-600",
      bgColor: metrics.winRate >= 60 ? "bg-green-50" : metrics.winRate >= 40 ? "bg-blue-50" : "bg-red-50",
      borderColor: metrics.winRate >= 60 ? "border-green-200" : metrics.winRate >= 40 ? "border-blue-200" : "border-red-200",
    },
    {
      title: "Winning Trades",
      value: metrics.totalWins.toString(),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Losing Trades",
      value: metrics.totalLosses.toString(),
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      title: "Avg Win Size",
      value: formatCurrency(metrics.avgWinSize),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Avg Loss Size",
      value: formatCurrency(metrics.avgLossSize),
      icon: DollarSign,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      title: "Trades Per Day",
      value: metrics.tradesPerDay.toFixed(1),
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Max Profit",
      value: formatCurrency(metrics.maxProfit),
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      title: "Avg Duration",
      value: formatDuration(metrics.avgDuration),
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4">
      {metricsCards.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card key={index} className={`${metric.bgColor} ${metric.borderColor} border-2`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-black dark:text-black">
                  {metric.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
              <div className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
