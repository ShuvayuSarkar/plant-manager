'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DemoTestPage() {
    const [demoData, setDemoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processedTrades, setProcessedTrades] = useState([]);

    // Load demo data
    const loadDemoData = async () => {
        try {
            console.log("Fetching demo data from /demoData.json");
            const response = await fetch('/demoData.json');
            console.log("Response status:", response.status, response.ok);
            
            if (response.ok) {
                const data = await response.json();
                console.log("Demo data loaded:", data?.length || 0, "orders");
                setDemoData(data);
                setLoading(false);
            } else {
                console.error('Failed to load demo data:', response.status, response.statusText);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error loading demo data:', error);
            setLoading(false);
        }
    };

    // Process demo data into trading format (simplified version)
    const processDemoDataForTrading = (data) => {
        console.log("processDemoDataForTrading called with:", data?.length || 0, "orders");
        
        if (!data || data.length === 0) {
            console.log("No data to process");
            return [];
        }

        // Group orders by symbol to pair BUY/SELL orders
        const groupedBySymbol = {};
        data.forEach(order => {
            const symbol = order.tradingsymbol;
            if (!groupedBySymbol[symbol]) {
                groupedBySymbol[symbol] = [];
            }
            groupedBySymbol[symbol].push(order);
        });

        const completeTrades = [];
        let tradeIndex = 0;

        // Process each symbol group
        Object.keys(groupedBySymbol).forEach(symbol => {
            const orders = groupedBySymbol[symbol].sort((a, b) =>
                new Date(a.order_timestamp) - new Date(b.order_timestamp)
            );

            // Simple pairing: find BUY followed by SELL
            for (let i = 0; i < orders.length - 1; i++) {
                const buyOrder = orders[i];
                const sellOrder = orders[i + 1];

                if (buyOrder.transaction_type === 'BUY' && sellOrder.transaction_type === 'SELL') {
                    const entryPrice = buyOrder.average_price;
                    const exitPrice = sellOrder.average_price;
                    const quantity = Math.min(buyOrder.quantity, sellOrder.quantity);
                    const pnl = (exitPrice - entryPrice) * quantity;

                    // Calculate duration
                    const entryTime = new Date(buyOrder.order_timestamp);
                    const exitTime = new Date(sellOrder.order_timestamp);
                    const durationMs = exitTime - entryTime;
                    const durationMinutes = Math.floor(durationMs / (1000 * 60));

                    // Generate strategy based on duration
                    let strategy;
                    if (durationMinutes <= 20) {
                        strategy = 'scalping';
                    } else if (durationMinutes <= 60) {
                        strategy = 'breakout';
                    } else if (durationMinutes <= 120) {
                        strategy = 'momentum';
                    } else {
                        strategy = 'reversal';
                    }

                    // Determine emotion based on PnL
                    let emotion;
                    if (pnl > 0) {
                        emotion = 'confident';
                    } else if (pnl < 0) {
                        emotion = 'frustrated';
                    } else {
                        emotion = 'neutral';
                    }

                    const trade = {
                        id: `trade-${tradeIndex}`,
                        symbol: symbol,
                        strategy: strategy,
                        side: 'LONG',
                        quantity: quantity,
                        entry_price: parseFloat(entryPrice.toFixed(2)),
                        exit_price: exitPrice,
                        pnl: parseFloat(pnl.toFixed(2)),
                        return_pct: parseFloat(((exitPrice - entryPrice) / entryPrice * 100).toFixed(2)),
                        emotion: emotion,
                        date: buyOrder.order_timestamp,
                        entry_date: buyOrder.order_timestamp,
                        exit_date: sellOrder.order_timestamp,
                        mistake: pnl < 0 ? 'fomo' : null,
                        duration: durationMinutes
                    };

                    completeTrades.push(trade);
                    tradeIndex++;
                }
            }
        });

        console.log("Generated", completeTrades.length, "complete trades from", Object.keys(groupedBySymbol).length, "symbols");
        
        return completeTrades;
    };

    // Process the data when loaded
    useEffect(() => {
        if (demoData.length > 0) {
            const processed = processDemoDataForTrading(demoData);
            setProcessedTrades(processed);
        }
    }, [demoData]);

    useEffect(() => {
        loadDemoData();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Demo Data Test Page</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold">{loading ? 'Loading...' : demoData.length}</p>
                            <p className="text-sm text-gray-600">Raw Orders</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{processedTrades.length}</p>
                            <p className="text-sm text-gray-600">Processed Trades</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">
                                ₹{processedTrades.length > 0 ? processedTrades.reduce((sum, t) => sum + t.pnl, 0).toFixed(2) : '0.00'}
                            </p>
                            <p className="text-sm text-gray-600">Total P&L</p>
                        </div>
                    </div>
                    
                    <Button onClick={loadDemoData} disabled={loading}>
                        Reload Demo Data
                    </Button>

                    {processedTrades.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-4">Sample Trades (First 5)</h3>
                            <div className="space-y-2">
                                {processedTrades.slice(0, 5).map((trade) => (
                                    <div key={trade.id} className="border rounded p-3 text-sm">
                                        <div className="grid grid-cols-4 gap-2">
                                            <div><strong>Symbol:</strong> {trade.symbol}</div>
                                            <div><strong>Strategy:</strong> {trade.strategy}</div>
                                            <div><strong>P&L:</strong> ₹{trade.pnl}</div>
                                            <div><strong>Duration:</strong> {trade.duration} min</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
