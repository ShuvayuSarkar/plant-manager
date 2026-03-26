// Data validation and processing utility for testing dashboard accuracy

// Process raw trading data into the format expected by dashboard components
export function processNewDbData(rawData) {
    // Group transactions by symbol to create complete trades
    const groupedTrades = {};
    
    rawData.forEach(transaction => {
        const symbol = transaction.tradingsymbol;
        if (!groupedTrades[symbol]) {
            groupedTrades[symbol] = {
                buys: [],
                sells: []
            };
        }
        
        if (transaction.transaction_type === 'BUY') {
            groupedTrades[symbol].buys.push(transaction);
        } else {
            groupedTrades[symbol].sells.push(transaction);
        }
    });
    
    // Create complete trades by matching buys and sells
    const completeTrades = [];
    let tradeId = 1;
    
    Object.entries(groupedTrades).forEach(([symbol, trades]) => {
        const { buys, sells } = trades;
        
        // Sort by timestamp
        buys.sort((a, b) => new Date(a.order_timestamp) - new Date(b.order_timestamp));
        sells.sort((a, b) => new Date(a.order_timestamp) - new Date(b.order_timestamp));
        
        // Match buys with sells using FIFO approach
        let buyIndex = 0;
        let sellIndex = 0;
        
        while (buyIndex < buys.length && sellIndex < sells.length) {
            const buy = buys[buyIndex];
            const sell = sells[sellIndex];
            
            // Calculate trade quantities
            const buyQty = buy.quantity;
            const sellQty = sell.quantity;
            const tradeQty = Math.min(buyQty, sellQty);
            
            // Calculate P&L
            const entryPrice = buy.average_price;
            const exitPrice = sell.average_price;
            const pnl = (exitPrice - entryPrice) * tradeQty;
            const returnPct = ((exitPrice - entryPrice) / entryPrice) * 100;
            
            // Calculate duration in minutes
            const entryTime = new Date(buy.order_timestamp);
            const exitTime = new Date(sell.order_timestamp);
            const durationMs = exitTime - entryTime;
            const duration = Math.round(durationMs / (1000 * 60)); // Convert to minutes
            
            // Generate realistic metadata based on patterns
            const strategies = ['breakout', 'momentum', 'reversal', 'scalping', 'swing'];
            const emotions = ['confident', 'anxious', 'neutral', 'excited', 'frustrated'];
            const mistakes = [null, 'early_exit', 'late_entry', 'oversized', 'fomo'];
            
            // Use symbol and trade data for consistent random generation
            const seedValue = symbol.charCodeAt(0) + tradeId;
            const seedRandom = (seed) => {
                const x = Math.sin(seed) * 10000;
                return x - Math.floor(x);
            };
            
            const strategy = strategies[Math.floor(seedRandom(seedValue) * strategies.length)];
            const emotion = emotions[Math.floor(seedRandom(seedValue + 1) * emotions.length)];
            const mistake = seedRandom(seedValue + 2) > 0.7 ? 
                mistakes[Math.floor(seedRandom(seedValue + 3) * mistakes.length)] : null;
            
            completeTrades.push({
                id: `trade-${tradeId}`,
                symbol: symbol,
                strategy: strategy,
                side: 'BUY', // Always BUY since we're creating complete round trips
                quantity: tradeQty,
                entry_price: entryPrice,
                exit_price: exitPrice,
                pnl: parseFloat(pnl.toFixed(2)),
                return_pct: parseFloat(returnPct.toFixed(2)),
                emotion: emotion,
                date: buy.order_timestamp,
                mistake: mistake,
                duration: Math.max(duration, 1) // Ensure minimum 1 minute duration
            });
            
            tradeId++;
            
            // Update quantities and advance indices
            buy.quantity -= tradeQty;
            sell.quantity -= tradeQty;
            
            if (buy.quantity <= 0) buyIndex++;
            if (sell.quantity <= 0) sellIndex++;
        }
    });
    
    return completeTrades;
}

// Calculate analytics from processed data
export function calculateTestAnalytics(tradingData) {
    if (!tradingData || tradingData.length === 0) {
        return {
            totalTrades: 0,
            winRate: 0,
            totalPnL: 0,
            avgWin: 0,
            avgLoss: 0,
            maxProfit: 0,
            maxLoss: 0,
            avgDuration: 0,
            symbols: [],
            strategies: [],
            timeRange: { start: null, end: null }
        };
    }
    
    const winningTrades = tradingData.filter(t => t.pnl > 0);
    const losingTrades = tradingData.filter(t => t.pnl < 0);
    const totalTrades = tradingData.length;
    
    const totalPnL = tradingData.reduce((sum, t) => sum + t.pnl, 0);
    const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;
    const avgWin = winningTrades.length > 0 ? 
        winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? 
        Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length) : 0;
    
    const maxProfit = tradingData.length > 0 ? Math.max(...tradingData.map(t => t.pnl)) : 0;
    const maxLoss = tradingData.length > 0 ? Math.min(...tradingData.map(t => t.pnl)) : 0;
    const avgDuration = tradingData.reduce((sum, t) => sum + (t.duration || 0), 0) / totalTrades;
    
    // Get unique symbols and strategies
    const symbols = [...new Set(tradingData.map(t => t.symbol))];
    const strategies = [...new Set(tradingData.map(t => t.strategy))];
    
    // Get time range
    const dates = tradingData.map(t => new Date(t.date));
    const timeRange = {
        start: new Date(Math.min(...dates)),
        end: new Date(Math.max(...dates))
    };
    
    return {
        totalTrades,
        winRate: parseFloat(winRate.toFixed(2)),
        totalPnL: parseFloat(totalPnL.toFixed(2)),
        avgWin: parseFloat(avgWin.toFixed(2)),
        avgLoss: parseFloat(avgLoss.toFixed(2)),
        maxProfit: parseFloat(maxProfit.toFixed(2)),
        maxLoss: parseFloat(maxLoss.toFixed(2)),
        avgDuration: parseFloat(avgDuration.toFixed(1)),
        symbols,
        strategies,
        timeRange
    };
}

// Validate data accuracy
export function validateDashboardData(rawData = []) {
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
        return {
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
        };
    }

    const processedData = processNewDbData(rawData);
    const analytics = calculateTestAnalytics(processedData);
    
    return {
        processedData,
        analytics,
        validation: {
            dataIntegrity: processedData.length > 0,
            hasValidPnL: processedData.every(t => typeof t.pnl === 'number'),
            hasValidPrices: processedData.every(t => t.entry_price > 0 && t.exit_price > 0),
            hasValidDates: processedData.every(t => !isNaN(new Date(t.date))),
            hasValidQuantities: processedData.every(t => t.quantity > 0),
            totalTradeCount: processedData.length,
            uniqueSymbols: analytics.symbols.length,
            dataTimeSpan: analytics.timeRange
        }
    };
}

// Export functions for use in other modules
export { processNewDbData, calculateTestAnalytics, validateDashboardData };
