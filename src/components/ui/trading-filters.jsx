'use client'

import * as React from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function TradingFilters({ onFiltersChange, selectedFilters = {} }) {
  const [activeFilter, setActiveFilter] = React.useState({
    type: "strategy", // strategy, mistake, day, emotion, slot
    value: "all" // always "all" for grouping view
  })

  const handleFilterSelect = (filterType) => {
    const newFilter = { type: filterType, value: "all" }
    setActiveFilter(newFilter)
    onFiltersChange?.(newFilter)
  }

  const isFilterActive = (filterType) => {
    return activeFilter.type === filterType
  }

  const filterOptions = [
    { type: 'strategy', label: 'Strategy', description: 'Group by trading strategies' },
    { type: 'mistake', label: 'Mistake', description: 'Group by trading mistakes' },
    { type: 'day', label: 'Day', description: 'Group by trading days' },
    { type: 'emotion', label: 'Emotion', description: 'Group by emotions' },
    { type: 'slot', label: 'Time Slot', description: 'Group by time periods' }
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Chart Grouping
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              Active: {filterOptions.find(opt => opt.type === activeFilter.type)?.label || 'Strategy'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {filterOptions.map((option) => (
            <Button
              key={option.type}
              variant={isFilterActive(option.type) ? "default" : "outline"}
              size="lg"
              onClick={() => handleFilterSelect(option.type)}
              className="h-12 px-6 text-md font-medium"
            >
              {option.label}
              {isFilterActive(option.type) && (
                <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                  Active
                </Badge>
              )}
            </Button>
          ))}
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          {filterOptions.find(opt => opt.type === activeFilter.type)?.description}
        </div>
      </CardContent>
    </Card>
  )
}
