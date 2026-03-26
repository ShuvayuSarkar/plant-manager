import { createContext, useState } from 'react';
const flattenTrades = (rawData = []) => {
    const result = [];

    rawData.forEach((entry) => {
        let tradeIndex = 0;

        Object.entries(entry).forEach(([key, value]) => {
            if (key.startsWith("TRADE_") && Array.isArray(value.orders)) {
                const tradeGroup = value.orders.map((order) => ({
                    ...order,
                    ref: tradeIndex,
                }));

                result.push(tradeGroup); // push as a group
                tradeIndex += 1;
            }
        });
    });

    return result;
};


export const JournalContext = createContext();

export function JournalDataProvider({ children }) {
    const [selectedTrade, setSelectedTrade] = useState(0);
    const [detailsData, setDetailsData] = useState(null);

    console.log("Details data HOOK:", detailsData);

    const todaysTrades = Array.isArray(detailsData?.todaysTrades)
        ? flattenTrades(detailsData.todaysTrades)
        : [];
    console.log("Todays trades:", todaysTrades);


    return (
        <JournalContext.Provider value={{
            todaysTrades,
            selectedTrade,
            setSelectedTrade,
            detailsData,
            setDetailsData
        }}>
            {children}
        </JournalContext.Provider>
    );
}
