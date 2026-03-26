'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TradingFilters } from '@/components/ui/trading-filters';
import { StrategyCharts } from '@/components/ui/strategy-charts';
import { TradingMetricsSummary } from '@/components/ui/trading-metrics-summary';
import { validateDashboardData, processNewDbData, calculateTestAnalytics } from '@/lib/dataValidator';
import { 
    groupCompletedTradeSetsBrowser, 
    calculateOverallPnLBrowser, 
    validateDashboardLogic 
} from '@/lib/logicValidator';
import { CheckCircle, XCircle, AlertCircle, BarChart3, TrendingUp, TrendingDown, Calculator, Database } from 'lucide-react';

export default function DashboardTestPage() {
    const [selectedFilters, setSelectedFilters] = useState({
        type: 'strategy',
        value: 'all'
    });

    const [logicValidation, setLogicValidation] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [validationResults, setValidationResults] = useState({
        processedData: [],
        analytics: {
            totalPnL: 0, totalTrades: 0, winningTrades: 0, losingTrades: 0,
            winRate: 0, avgWin: 0, avgLoss: 0, maxProfit: 0, maxLoss: 0,
            symbols: [], strategies: [], timeRange: { start: null, end: null }
        },
        validation: {
            dataIntegrity: false,
            hasValidPnL: false,
            hasValidPrices: false,
            hasValidDates: false,
            hasValidQuantities: false,
            totalTradeCount: 0,
            uniqueSymbols: 0,
            dataTimeSpan: { start: null, end: null }
        }
    });

    // Load validation data on component mount
    useEffect(() => {
        const loadValidationData = async () => {
            try {
                const response = await fetch('/new_db_data.json');
                if (response.ok) {
                    const data = await response.json();
                    const results = validateDashboardData(data);
                    setValidationResults(results);
                }
            } catch (error) {
                console.error('Failed to load validation data:', error);
            }
        };
        
        loadValidationData();
    }, []);

    const { processedData, analytics, validation } = validationResults;

    // Run comprehensive logic validation
    const runLogicValidation = async () => {
        setIsValidating(true);
        
        try {
            // Fetch the new database data
            const response = await fetch('/new_db_data.json');
            if (!response.ok) {
                throw new Error('Failed to fetch new_db_data.json');
            }
            const newDbData = await response.json();

            // Test original logic functions
            const ordersWithStatus = newDbData.map(order => ({
                ...order,
                status: 'COMPLETE'
            }));

            const groupedResult = groupCompletedTradeSetsBrowser(ordersWithStatus);
            const tradeKeys = Object.keys(groupedResult).filter(key => key.startsWith('TRADE_'));
            const overallPnL = calculateOverallPnLBrowser(groupedResult);

            // Calculate individual trade P&Ls for comparison
            const originalTradeAnalysis = tradeKeys.slice(0, 10).map(key => {
                const trade = groupedResult[key];
                let buyTotal = 0, sellTotal = 0, quantity = 0;
                
                trade.orders.forEach(order => {
                    const amount = order.quantity * order.average_price;
                    if (order.transaction_type === 'BUY') {
                        buyTotal += amount;
                        quantity += order.quantity;
                    } else {
                        sellTotal += amount;
                    }
                });
                
                return {
                    tradeId: key,
                    symbol: trade.orders[0].tradingsymbol,
                    orderCount: trade.orders.length,
                    pnl: Number((sellTotal - buyTotal).toFixed(2)),
                    quantity,
                    buyAmount: Number(buyTotal.toFixed(2)),
                    sellAmount: Number(sellTotal.toFixed(2))
                };
            });

            // Compare with data validator results
            const validatorTrades = processedData.slice(0, 10);
            
            // Symbol analysis
            const originalSymbols = new Set();
            tradeKeys.forEach(key => {
                groupedResult[key].orders.forEach(order => {
                    originalSymbols.add(order.tradingsymbol);
                });
            });
            
            const validatorSymbols = new Set(processedData.map(trade => trade.symbol));

            // Calculate accuracy metrics
            const pnlDifference = Math.abs(overallPnL.pnl - analytics.totalPnL);
            const tradeDifference = Math.abs(tradeKeys.length - analytics.totalTrades);
            
            const logicResults = {
                originalLogic: {
                    totalTrades: tradeKeys.length,
                    totalPnL: overallPnL.pnl,
                    totalBuyAmount: overallPnL.amount.totalBuy,
                    totalSellAmount: overallPnL.amount.totalSell,
                    pnlType: overallPnL.type,
                    date: groupedResult.date,
                    symbolCount: originalSymbols.size,
                    sampleTrades: originalTradeAnalysis
                },
                dataValidator: {
                    totalTrades: analytics.totalTrades,
                    totalPnL: analytics.totalPnL,
                    winRate: analytics.winRate,
                    winningTrades: analytics.winningTrades,
                    losingTrades: analytics.losingTrades,
                    avgWin: analytics.avgWin,
                    avgLoss: analytics.avgLoss,
                    symbolCount: validatorSymbols.size,
                    sampleTrades: validatorTrades
                },
                comparison: {
                    pnlDifference: Number(pnlDifference.toFixed(2)),
                    tradeDifference,
                    pnlAccurate: pnlDifference < 1000, // Allow for rounding differences
                    tradeCountAccurate: tradeDifference <= 5,
                    symbolsMatch: [...originalSymbols].every(symbol => validatorSymbols.has(symbol))
                },
                summary: {
                    totalTransactions: newDbData.length,
                    validationPassed: pnlDifference < 1000 && tradeDifference <= 5,
                    accuracy: {
                        pnl: pnlDifference < 1000 ? 'PASS' : 'FAIL',
                        trades: tradeDifference <= 5 ? 'PASS' : 'FAIL',
                        symbols: [...originalSymbols].every(symbol => validatorSymbols.has(symbol)) ? 'PASS' : 'FAIL'
                    }
                }
            };

            setLogicValidation(logicResults);
        } catch (error) {
            console.error('Logic validation error:', error);
            setLogicValidation({ error: error.message });
        } finally {
            setIsValidating(false);
        }
    };

    useEffect(() => {
        // Auto-run validation on component mount
        runLogicValidation();
    }, []);

    // Status indicators
    const getStatusIcon = (isValid) => {
        return isValid ? 
            <CheckCircle className="w-4 h-4 text-green-600" /> : 
            <XCircle className="w-4 h-4 text-red-600" />;
    };

    const getStatusColor = (isValid) => {
        return isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50';
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard Data Validation Test</h1>
                    <p className="text-muted-foreground">
                        Testing data accuracy and logic validation against new_db_data.json
                    </p>
                </div>
                <Button 
                    onClick={runLogicValidation} 
                    disabled={isValidating}
                    className="flex items-center gap-2"
                >
                    <Calculator className="w-4 h-4" />
                    {isValidating ? 'Validating...' : 'Revalidate Logic'}
                </Button>
            </div>

            {/* Logic Validation Results */}
            {logicValidation && !logicValidation.error && (
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="w-5 h-5" />
                            Logic Validation Results
                            <Badge variant={logicValidation.summary.validationPassed ? 'default' : 'destructive'}>
                                {logicValidation.summary.validationPassed ? 'PASSED' : 'FAILED'}
                            </Badge>
                        </CardTitle>
                        <CardDescription>
                            Comparison between original logic.js functions and data validator
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card className="bg-blue-50 border-blue-200">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">Input Data</p>
                                            <p className="text-2xl font-bold">{logicValidation.summary.totalTransactions}</p>
                                            <p className="text-xs text-muted-foreground">Transactions</p>
                                        </div>
                                        <BarChart3 className="w-8 h-8 text-blue-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className={getStatusColor(logicValidation.comparison.pnlAccurate)}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">P&L Accuracy</p>
                                            <p className="text-2xl font-bold">₹{logicValidation.comparison.pnlDifference}</p>
                                            <p className="text-xs text-muted-foreground">Difference</p>
                                        </div>
                                        {getStatusIcon(logicValidation.comparison.pnlAccurate)}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className={getStatusColor(logicValidation.comparison.tradeCountAccurate)}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">Trade Count</p>
                                            <p className="text-2xl font-bold">{logicValidation.comparison.tradeDifference}</p>
                                            <p className="text-xs text-muted-foreground">Difference</p>
                                        </div>
                                        {getStatusIcon(logicValidation.comparison.tradeCountAccurate)}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className={getStatusColor(logicValidation.comparison.symbolsMatch)}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">Symbol Match</p>
                                            <p className="text-2xl font-bold">{logicValidation.originalLogic.symbolCount}</p>
                                            <p className="text-xs text-muted-foreground">Symbols</p>
                                        </div>
                                        {getStatusIcon(logicValidation.comparison.symbolsMatch)}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Detailed Comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Original Logic Results */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Original Logic (logic.js)</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Total Trades:</span>
                                        <span className="font-medium">{logicValidation.originalLogic.totalTrades}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total P&L:</span>
                                        <span className={`font-medium ${logicValidation.originalLogic.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            ₹{logicValidation.originalLogic.totalPnL.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Buy Amount:</span>
                                        <span className="font-medium">₹{logicValidation.originalLogic.totalBuyAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sell Amount:</span>
                                        <span className="font-medium">₹{logicValidation.originalLogic.totalSellAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>P&L Type:</span>
                                        <Badge variant={logicValidation.originalLogic.pnlType === 'PROFIT' ? 'default' : 'destructive'}>
                                            {logicValidation.originalLogic.pnlType}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Symbols:</span>
                                        <span className="font-medium">{logicValidation.originalLogic.symbolCount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Trade Date:</span>
                                        <span className="font-medium">{logicValidation.originalLogic.date}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Data Validator Results */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Data Validator</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Total Trades:</span>
                                        <span className="font-medium">{logicValidation.dataValidator.totalTrades}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total P&L:</span>
                                        <span className={`font-medium ${logicValidation.dataValidator.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            ₹{logicValidation.dataValidator.totalPnL.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Win Rate:</span>
                                        <span className="font-medium">{logicValidation.dataValidator.winRate.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Winning Trades:</span>
                                        <span className="font-medium text-green-600">{logicValidation.dataValidator.winningTrades}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Losing Trades:</span>
                                        <span className="font-medium text-red-600">{logicValidation.dataValidator.losingTrades}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Avg Win:</span>
                                        <span className="font-medium text-green-600">₹{logicValidation.dataValidator.avgWin.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Avg Loss:</span>
                                        <span className="font-medium text-red-600">₹{logicValidation.dataValidator.avgLoss.toLocaleString()}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sample Trade Comparison */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Sample Trade Comparison</CardTitle>
                                <CardDescription>First 5 trades from both processing methods</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-2">Method</th>
                                                <th className="text-left p-2">Trade ID</th>
                                                <th className="text-left p-2">Symbol</th>
                                                <th className="text-left p-2">P&L</th>
                                                <th className="text-left p-2">Quantity</th>
                                                <th className="text-left p-2">Orders/Strategy</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logicValidation.originalLogic.sampleTrades.map((trade, idx) => (
                                                <tr key={`orig-${idx}`} className="border-b">
                                                    <td className="p-2 font-medium">Original</td>
                                                    <td className="p-2">{trade.tradeId}</td>
                                                    <td className="p-2">{trade.symbol}</td>
                                                    <td className={`p-2 ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        ₹{trade.pnl.toLocaleString()}
                                                    </td>
                                                    <td className="p-2">{trade.quantity}</td>
                                                    <td className="p-2">{trade.orderCount} orders</td>
                                                </tr>
                                            ))}
                                            {logicValidation.dataValidator.sampleTrades.map((trade, idx) => (
                                                <tr key={`val-${idx}`} className="border-b bg-blue-50">
                                                    <td className="p-2 font-medium">Validator</td>
                                                    <td className="p-2">{trade.id}</td>
                                                    <td className="p-2">{trade.symbol}</td>
                                                    <td className={`p-2 ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        ₹{trade.pnl.toLocaleString()}
                                                    </td>
                                                    <td className="p-2">{trade.quantity}</td>
                                                    <td className="p-2">{trade.strategy}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Accuracy Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Accuracy Assessment</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {Object.entries(logicValidation.summary.accuracy).map(([metric, result]) => (
                                        <div key={metric} className="flex items-center justify-between p-3 border rounded">
                                            <span className="capitalize font-medium">{metric} Accuracy:</span>
                                            <Badge variant={result === 'PASS' ? 'default' : 'destructive'}>
                                                {result}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            )}

            {logicValidation?.error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-red-600">
                            <XCircle className="w-4 h-4" />
                            <span className="font-medium">Logic Validation Error:</span>
                        </div>
                        <p className="text-red-600 mt-2">{logicValidation.error}</p>
                    </CardContent>
                </Card>
            )}

            {/* Original Validation Summary */}
            <Card className="border-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Data Validation Summary
                    </CardTitle>
                    <CardDescription>
                        Validation status for processed trading data from new_db_data.json
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Validation Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className={getStatusColor(validation.dataIntegrity)}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Data Integrity</p>
                                        <p className="text-2xl font-bold">{validation.totalTradeCount}</p>
                                        <p className="text-xs text-muted-foreground">Processed Trades</p>
                                    </div>
                                    {getStatusIcon(validation.dataIntegrity)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={getStatusColor(validation.hasValidPnL && validation.hasValidPrices)}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Financial Data</p>
                                        <p className="text-2xl font-bold">₹{analytics.totalPnL.toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground">Total P&L</p>
                                    </div>
                                    {getStatusIcon(validation.hasValidPnL && validation.hasValidPrices)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={getStatusColor(validation.hasValidDates)}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Time Range</p>
                                        <p className="text-2xl font-bold">{validation.uniqueSymbols}</p>
                                        <p className="text-xs text-muted-foreground">Unique Symbols</p>
                                    </div>
                                    {getStatusIcon(validation.hasValidDates)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Validation Results */}
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                Validation Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Data Integrity:</span>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(validation.dataIntegrity)}
                                            <span className="text-sm">{validation.dataIntegrity ? 'Valid' : 'Invalid'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Valid P&L Values:</span>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(validation.hasValidPnL)}
                                            <span className="text-sm">{validation.hasValidPnL ? 'Valid' : 'Invalid'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Valid Prices:</span>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(validation.hasValidPrices)}
                                            <span className="text-sm">{validation.hasValidPrices ? 'Valid' : 'Invalid'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Valid Dates:</span>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(validation.hasValidDates)}
                                            <span className="text-sm">{validation.hasValidDates ? 'Valid' : 'Invalid'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Valid Quantities:</span>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(validation.hasValidQuantities)}
                                            <span className="text-sm">{validation.hasValidQuantities ? 'Valid' : 'Invalid'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Time Span:</span>
                                        <span className="text-sm">
                                            {validation.dataTimeSpan.start?.toLocaleDateString()} - {validation.dataTimeSpan.end?.toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Analytics Summary */}
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Analytics Summary</CardTitle>
                            <CardDescription>Key metrics calculated from processed data</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{analytics.winRate}%</div>
                                    <div className="text-sm text-muted-foreground">Win Rate</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">₹{analytics.avgWin.toLocaleString()}</div>
                                    <div className="text-sm text-muted-foreground">Avg Win</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-600">₹{analytics.avgLoss.toLocaleString()}</div>
                                    <div className="text-sm text-muted-foreground">Avg Loss</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{analytics.avgDuration} min</div>
                                    <div className="text-sm text-muted-foreground">Avg Duration</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Trading Filters */}
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Dynamic Filters Test</CardTitle>
                            <CardDescription>Test the filtering functionality with processed data</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TradingFilters
                                tradingData={processedData}
                                selectedFilter={selectedFilters}
                                onFilterChange={setSelectedFilters}
                            />
                        </CardContent>
                    </Card>

                    {/* Metrics Summary */}
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Metrics Cards Test</CardTitle>
                            <CardDescription>Test the metrics summary component</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TradingMetricsSummary
                                tradingData={processedData}
                                selectedFilter={selectedFilters}
                            />
                        </CardContent>
                    </Card>

                    {/* Strategy Charts */}
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Charts Test</CardTitle>
                            <CardDescription>Test all chart components with processed data</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <StrategyCharts
                                tradingData={processedData}
                                selectedFilter={selectedFilters}
                            />
                        </CardContent>
                    </Card>

                    {/* Raw Data Sample */}
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Sample Processed Data</CardTitle>
                            <CardDescription>First 5 processed trades for verification</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {processedData.slice(0, 5).map((trade, index) => (
                                    <div key={trade.id} className="p-3 border rounded-lg text-sm">
                                        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                                            <div><strong>Symbol:</strong> {trade.symbol}</div>
                                            <div><strong>Strategy:</strong> {trade.strategy}</div>
                                            <div><strong>P&L:</strong> ₹{trade.pnl}</div>
                                            <div><strong>Return:</strong> {trade.return_pct}%</div>
                                            <div><strong>Duration:</strong> {trade.duration}m</div>
                                            <div><strong>Emotion:</strong> {trade.emotion}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>

            {/* ... rest of existing code ... */}
        </div>
    );
}
