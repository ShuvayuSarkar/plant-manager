'use client';

import { useState, useMemo, useEffect } from "react";
import { TradingDataTable } from "@/components/ui/trading-data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackEvent } from '@/lib/mixpanelClient';
import useGlobalState from '@/hooks/globalState';

const Trades = () => {
    useEffect(() => {
        trackEvent('viewed_tradedetailspage');
    }, []);

    const { data } = useGlobalState()


    // Function to process demo data into trading format
    const processDemoDataForTrading = (data) => {
        const strategies = ['breakout', 'momentum', 'reversal', 'scalping', 'swing'];
        const emotions = ['confident', 'anxious', 'neutral', 'excited', 'frustrated'];
        const mistakes = [null, 'early_exit', 'late_entry', 'oversized', 'fomo'];

        return data.slice(0, 20).map((order, index) => {
            // Use index as seed for consistent random generation
            const seedRandom = (seed) => {
                const x = Math.sin(seed) * 10000;
                return x - Math.floor(x);
            };

            const strategy = strategies[Math.floor(seedRandom(index) * strategies.length)];
            const emotion = emotions[Math.floor(seedRandom(index + 1) * emotions.length)];
            const mistake = seedRandom(index + 2) > 0.7 ? mistakes[Math.floor(seedRandom(index + 3) * (mistakes.length - 1)) + 1] : null;

            // Generate consistent but varied dates
            const baseDate = new Date('2024-01-01');
            const dayOffset = Math.floor(seedRandom(index + 4) * 90); // Spread over 90 days
            const date = new Date(baseDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);

            // Calculate P&L with some logic
            const quantity = order.quantity || 1;
            const entryPrice = order.price || 100;
            const variation = (seedRandom(index + 5) - 0.5) * 0.1; // ±5% variation
            const exitPrice = entryPrice * (1 + variation);
            const pnl = (exitPrice - entryPrice) * quantity;
            const returnPct = ((exitPrice - entryPrice) / entryPrice) * 100;

            return {
                id: order.order_id || `order-${index}`,
                date: date.toISOString(),
                symbol: order.tradingsymbol || `STOCK${index}`,
                type: order.transaction_type || (seedRandom(index + 6) > 0.5 ? 'BUY' : 'SELL'),
                quantity: quantity,
                entry_price: entryPrice,
                exit_price: exitPrice,
                pnl: pnl,
                return_pct: returnPct,
                strategy: strategy,
                emotion: emotion,
                mistake: mistake,
                duration: Math.floor(seedRandom(index + 7) * 120) + 15, // 15-135 minutes
                notes: seedRandom(index + 8) > 0.7 ? `Trade note ${index + 1}` : null
            };
        });
    };

    // Generate consistent trading data
    const processedTradingData = useMemo(() => {
        return processDemoDataForTrading(data);
    }, []);

    const [tradingData, setTradingData] = useState(processedTradingData);

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">All Trades</h1>
                    <p className="text-muted-foreground mt-1">
                        Complete history and detailed view of all your trading activities
                    </p>
                </div>
            </div>

            {/* Trading Data Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Trading History</CardTitle>
                    <CardDescription>
                        Detailed view of all your trades with filtering and sorting capabilities
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TradingDataTable data={tradingData} />
                </CardContent>
            </Card>
        </div>
    );
};

export default Trades;
