export function groupCompletedTradeSets(orders) {

    orders.sort((a, b) =>
        new Date(a.order_timestamp).getTime() - new Date(b.order_timestamp).getTime()
    );

    const completedOrders = orders.filter(order => order.status === 'COMPLETE');

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
            transaction_type: order.transaction_type,
            id: order.order_id
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
                    startegy: [],
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

export function calculateOverallPnL(tradeArray) {
    let totalBuy = 0;
    let totalSell = 0;
    let totalQty = 0;

    for (const tradeObj of tradeArray) {
        for (const key in tradeObj) {
            if (!key.startsWith("TRADE_")) continue;

            const trade = tradeObj[key];
            if (!trade || !Array.isArray(trade.orders)) {
                console.warn(`Skipping invalid trade: ${key}`, trade);
                continue;
            }

            const trades = trade.orders;

            let buyQty = 0, buyTotal = 0;
            let sellQty = 0, sellTotal = 0;

            for (const order of trades) {
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
                console.warn(`Qty mismatch in ${key}: BUY ${buyQty} ≠ SELL ${sellQty}`);
                continue;
            }

            totalBuy += buyTotal;
            totalSell += sellTotal;
            totalQty += buyQty;
        }
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


export function calculatePnLForTrade(trades) {
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


export function calculateDetails(trades) {
    if (!trades || trades.length < 2) return null;

    let totalBuyQuantity = 0;
    let totalBuyValue = 0;
    let totalSellQuantity = 0;
    let totalSellValue = 0;

    for (const trade of trades) {
        if (trade.transaction_type === 'BUY') {
            totalBuyQuantity += trade.quantity;
            totalBuyValue += trade.quantity * trade.average_price;
        } else if (trade.transaction_type === 'SELL') {
            totalSellQuantity += trade.quantity;
            totalSellValue += trade.quantity * trade.average_price;
        }
    }

    // If there are no buys or no sells, or if the quantities don't match up for a complete trade cycle,
    // we might not have a meaningful PnL for this set of trades.
    // You might want to adjust this logic based on how you define a "complete trade".
    if (totalBuyQuantity === 0 || totalSellQuantity === 0) {
        return null;
    }

    // To calculate PnL, we need to consider the minimum of the total buy and sell quantities
    // to ensure we're only calculating PnL for the "closed" portion of the trade.
    const quantityForPnL = Math.min(totalBuyQuantity, totalSellQuantity);


    // Calculate weighted average entry and exit prices
    const entry_price = totalBuyValue / totalBuyQuantity;
    const exit_price = totalSellValue / totalSellQuantity;

    const pnl = (exit_price - entry_price) * quantityForPnL;

    return {
        entry_price: parseFloat(entry_price.toFixed(2)), // Format to a reasonable number of decimal places
        exit_price: parseFloat(exit_price.toFixed(2)),
        quantity: quantityForPnL, // This represents the quantity for which PnL is calculated
        pnl: parseFloat(pnl.toFixed(2)), // PnL usually shown with 2 decimal places
    };
}

export function extractAllOrders(data) {
    const allOrders = [];

    // Iterate through each document in the array
    data.forEach(document => {
        // Check if the document has a trades object
        if (document.trades && typeof document.trades === 'object') {
            // Iterate through each trade in the trades object
            Object.keys(document.trades).forEach(tradeKey => {
                const trade = document.trades[tradeKey];

                // Skip the 'date' key as it's not a trade object
                if (tradeKey === 'date') return;

                // Check if the trade has orders array
                if (trade.orders && Array.isArray(trade.orders)) {
                    // Add each order to the allOrders array
                    trade.orders.forEach(order => {
                        // Convert Firestore timestamp to ISO string if needed
                        let processedOrder = { ...order };

                        if (order.order_timestamp && typeof order.order_timestamp === 'object' && order.order_timestamp.type === 'firestore/timestamp/1.0') {
                            // Convert Firestore timestamp to ISO string
                            const timestamp = new Date(order.order_timestamp.seconds * 1000);
                            processedOrder.order_timestamp = timestamp.toISOString();
                        }

                        allOrders.push(processedOrder);
                    });
                }
            });
        }
    });

    return allOrders;
}

export function getNonMatchingOrders(previousOrders, currentOrders) {
    const prevOrderIds = new Set(previousOrders.map(item => item.id));
    return currentOrders.filter(item => !prevOrderIds.has(item.order_id));
}