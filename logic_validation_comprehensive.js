// Comprehensive Logic Validation Test
// This script tests the existing dashboard logic against new_db_data.json

import { readFileSync } from 'fs';
const newDbData = JSON.parse(readFileSync('./public/new_db_data.json', 'utf8'));

// Import and adapt the original logic functions
function groupCompletedTradeSets(orders) {
    orders.sort((a, b) =>
        new Date(a.order_timestamp).getTime() - new Date(b.order_timestamp).getTime()
    );

    // Assume all orders are complete since new data doesn't have status field
    const completedOrders = orders.map(order => ({
        ...order,
        status: 'COMPLETE'
    }));

    const grouped = {};
    let tempGroup = [];
    let tradeCounter = 1;
    let runningQty = 0;

    const formatToISTDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-CA', {
            timeZone: 'Asia/Kolkata'
        });
    };

    const overallDate = completedOrders.length > 0
        ? formatToISTDate(completedOrders[0].order_timestamp)
        : null;

    for (let order of completedOrders) {
        const formattedOrder = {
            order_timestamp: order.order_timestamp,
            tradingsymbol: order.tradingsymbol,
            quantity: order.quantity,
            average_price: order.average_price,
            transaction_type: order.transaction_type
        };

        if (tempGroup.length === 0) {
            tempGroup.push(formattedOrder);
            runningQty = order.transaction_type === "BUY" ? order.quantity : -order.quantity;
            continue;
        }

        const first = tempGroup[0];
        const sameMeta = order.tradingsymbol === first.tradingsymbol;

        if (!sameMeta) {
            tempGroup = [formattedOrder];
            runningQty = order.transaction_type === "BUY" ? order.quantity : -order.quantity;
            continue;
        }

        const isSameSide = order.transaction_type === "BUY" ? runningQty >= 0 : runningQty <= 0;

        if (isSameSide) {
            tempGroup.push(formattedOrder);
            runningQty += order.transaction_type === "BUY" ? order.quantity : -order.quantity;
        } else {
            runningQty += order.transaction_type === "BUY" ? order.quantity : -order.quantity;
            tempGroup.push(formattedOrder);

            if (runningQty === 0) {
                const groupKey = `TRADE_${String(tradeCounter).padStart(3, "0")}`;
                grouped[groupKey] = {
                    orders: [...tempGroup],
                    stop_loss: 0,
                    target_price: 0,
                    feelings: [],
                    strategy: [],
                    insights: [],
                    chartImage: '',
                    description: '',
                };
                tradeCounter++;
                tempGroup = [];
                runningQty = 0;
            }
        }
    }

    return {
        date: overallDate,
        ...grouped
    };
}

function calculateOverallPnL(groupedTrades) {
    let totalBuy = 0;
    let totalSell = 0;
    let totalQty = 0;

    for (let tradeKey in groupedTrades) {
        if (tradeKey === 'date') continue;
        
        const trades = groupedTrades[tradeKey].orders;

        let buyQty = 0, buyTotal = 0;
        let sellQty = 0, sellTotal = 0;

        for (let order of trades) {
            const qty = Number(order.quantity);
            const price = Number(order.average_price);

            if (order.transaction_type === "BUY") {
                buyQty += qty;
                buyTotal += qty * price;
            } else if (order.transaction_type === "SELL") {
                sellQty += qty;
                sellTotal += qty * price;
            }
        }

        // Sanity check to skip unbalanced legs
        if (buyQty !== sellQty) {
            console.warn(`⚠ Qty mismatch in ${tradeKey}: BUY ${buyQty} ≠ SELL ${sellQty}`);
            continue;
        }

        totalBuy += buyTotal;
        totalSell += sellTotal;
        totalQty += buyQty;
    }

    const totalPnL = totalSell - totalBuy;

    return {
        amount: {
            totalBuy: Number(totalBuy.toFixed(2)),
            totalSell: Number(totalSell.toFixed(2)),
            totalQty: totalQty
        },
        pnl: Number(totalPnL.toFixed(2)),
        type: totalPnL > 0 ? "PROFIT" : totalPnL < 0 ? "LOSS" : "BREAKEVEN"
    };
}

function calculatePnLForTrade(trades) {
    if (!Array.isArray(trades)) {
        return {
            error: 'trades is not iterable',
            amount: null,
            pnl: null,
            type: 'INVALID'
        };
    }
    
    let buyQty = 0, buyTotal = 0;
    let sellQty = 0, sellTotal = 0;

    for (let order of trades) {
        const qty = Number(order.quantity);
        const price = Number(order.average_price);

        if (order.transaction_type === "BUY") {
            buyQty += qty;
            buyTotal += qty * price;
        } else if (order.transaction_type === "SELL") {
            sellQty += qty;
            sellTotal += qty * price;
        }
    }

    if (buyQty !== sellQty) {
        return {
            error: `⚠ Quantity mismatch: BUY ${buyQty} ≠ SELL ${sellQty}`,
            amount: null,
            pnl: null,
            type: "INVALID"
        };
    }

    const pnl = sellTotal - buyTotal;

    return {
        amount: {
            totalBuy: Number(buyTotal.toFixed(2)),
            totalSell: Number(sellTotal.toFixed(2)),
            totalQty: buyQty
        },
        pnl: Number(pnl.toFixed(2)),
        type: pnl > 0 ? "PROFIT" : pnl < 0 ? "LOSS" : "BREAKEVEN"
    };
}

// Run comprehensive validation
function runLogicValidation() {
    console.log('🔍 Starting comprehensive logic validation...\n');
    
    // Step 1: Test grouping logic
    console.log('📊 Step 1: Testing trade grouping logic');
    const groupedTrades = groupCompletedTradeSets(newDbData);
    
    const tradeKeys = Object.keys(groupedTrades).filter(key => key !== 'date');
    console.log(`✅ Grouped ${tradeKeys.length} complete trades`);
    console.log(`📅 Date: ${groupedTrades.date}\n`);
    
    // Step 2: Analyze each trade
    console.log('📊 Step 2: Analyzing individual trades');
    const tradeAnalysis = [];
    
    for (let tradeKey of tradeKeys) {
        const trade = groupedTrades[tradeKey];
        const pnlResult = calculatePnLForTrade(trade.orders);
        
        tradeAnalysis.push({
            tradeKey,
            ordersCount: trade.orders.length,
            symbol: trade.orders[0]?.tradingsymbol,
            pnlResult
        });
        
        console.log(`${tradeKey}: ${trade.orders[0]?.tradingsymbol} - ${trade.orders.length} orders - PnL: ${pnlResult.pnl} (${pnlResult.type})`);
    }
    
    // Step 3: Calculate overall metrics
    console.log('\n📊 Step 3: Calculating overall metrics');
    const overallPnL = calculateOverallPnL(groupedTrades);
    
    console.log('💰 Overall P&L Summary:');
    console.log(`  Total Buy: ₹${overallPnL.amount.totalBuy.toLocaleString()}`);
    console.log(`  Total Sell: ₹${overallPnL.amount.totalSell.toLocaleString()}`);
    console.log(`  Total Quantity: ${overallPnL.amount.totalQty.toLocaleString()}`);
    console.log(`  Net P&L: ₹${overallPnL.pnl.toLocaleString()} (${overallPnL.type})`);
    
    // Step 4: Validation checks
    console.log('\n🔍 Step 4: Data validation checks');
    
    const validTrades = tradeAnalysis.filter(t => t.pnlResult.type !== 'INVALID');
    const invalidTrades = tradeAnalysis.filter(t => t.pnlResult.type === 'INVALID');
    
    console.log(`✅ Valid trades: ${validTrades.length}`);
    console.log(`❌ Invalid trades: ${invalidTrades.length}`);
    
    if (invalidTrades.length > 0) {
        console.log('\n⚠️ Invalid trades details:');
        invalidTrades.forEach(trade => {
            console.log(`  ${trade.tradeKey}: ${trade.pnlResult.error}`);
        });
    }
    
    // Step 5: Statistical analysis
    console.log('\n📈 Step 5: Statistical analysis');
    
    const profitableTrades = validTrades.filter(t => t.pnlResult.pnl > 0);
    const losingTrades = validTrades.filter(t => t.pnlResult.pnl < 0);
    const breakEvenTrades = validTrades.filter(t => t.pnlResult.pnl === 0);
    
    const winRate = validTrades.length > 0 ? (profitableTrades.length / validTrades.length) * 100 : 0;
    const avgProfit = profitableTrades.length > 0 ? 
        profitableTrades.reduce((sum, t) => sum + t.pnlResult.pnl, 0) / profitableTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? 
        Math.abs(losingTrades.reduce((sum, t) => sum + t.pnlResult.pnl, 0) / losingTrades.length) : 0;
    
    console.log(`🎯 Win Rate: ${winRate.toFixed(2)}%`);
    console.log(`📈 Profitable trades: ${profitableTrades.length} (Avg: ₹${avgProfit.toFixed(2)})`);
    console.log(`📉 Losing trades: ${losingTrades.length} (Avg: ₹${avgLoss.toFixed(2)})`);
    console.log(`⚖️ Break-even trades: ${breakEvenTrades.length}`);
    
    // Step 6: Symbol analysis
    console.log('\n🏷️ Step 6: Symbol-wise analysis');
    
    const symbolStats = {};
    validTrades.forEach(trade => {
        const symbol = trade.symbol;
        if (!symbolStats[symbol]) {
            symbolStats[symbol] = {
                trades: 0,
                totalPnL: 0,
                profits: 0,
                losses: 0
            };
        }
        symbolStats[symbol].trades++;
        symbolStats[symbol].totalPnL += trade.pnlResult.pnl;
        if (trade.pnlResult.pnl > 0) symbolStats[symbol].profits++;
        else if (trade.pnlResult.pnl < 0) symbolStats[symbol].losses++;
    });
    
    console.log('Symbol breakdown:');
    Object.entries(symbolStats).forEach(([symbol, stats]) => {
        const winRate = stats.trades > 0 ? (stats.profits / stats.trades) * 100 : 0;
        console.log(`  ${symbol}: ${stats.trades} trades, ₹${stats.totalPnL.toFixed(2)} P&L, ${winRate.toFixed(1)}% win rate`);
    });
    
    // Final summary
    console.log('\n🎯 VALIDATION SUMMARY:');
    console.log(`✅ Logic processing: ${validTrades.length}/${tradeAnalysis.length} trades processed successfully`);
    console.log(`💰 Total P&L matches: ${overallPnL.pnl === validTrades.reduce((sum, t) => sum + t.pnlResult.pnl, 0) ? 'YES' : 'NO'}`);
    console.log(`🔢 Data integrity: ${invalidTrades.length === 0 ? 'GOOD' : 'ISSUES FOUND'}`);
    
    return {
        groupedTrades,
        tradeAnalysis,
        overallPnL,
        statistics: {
            totalTrades: validTrades.length,
            winRate,
            avgProfit,
            avgLoss,
            symbolStats
        }
    };
}

// Export for use in other modules
export { runLogicValidation, groupCompletedTradeSets, calculateOverallPnL, calculatePnLForTrade };

// Run validation if called directly
if (typeof window === 'undefined') {
    runLogicValidation();
}
