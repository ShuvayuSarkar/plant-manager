'use client';
import { useCallback, useContext } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ChevronDown } from 'lucide-react';
import { isDateToday } from '@/lib/dateCalculator';
import TradeCard from './tradeCard';
import { formatNumber, salsaFont } from '@/lib/utils';
import { CalenderContext } from './calenderDataProvider';
import { JournalContext } from '../details/journalDetailsProvider';
import { calculateOverallPnL } from '@/lib/logic';
import GetOrders from '../getOrders';

const WeeklyCalendar = ({ data }) => {
    const { weekOffset, setWeekOffset, weekData } = useContext(CalenderContext);
    const { setDetailsData, setSelectedTrade } = useContext(JournalContext);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const handlePrevWeek = useCallback(() => {
        setWeekOffset(prev => prev - 1);
    }, []);

    const handleNextWeek = useCallback(() => {
        setWeekOffset(prev => prev + 1);
    }, []);

    const handleToday = useCallback(() => {
        setWeekOffset(0);
    }, []);

    const getDataForDate = (date) => {
        const formattedDate = new Date(date).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

        const matchedItems = data.filter((item) => {
            // Defensive check in case item.trades or item.trades.date is undefined
            const r = item?.trades?.date?.trim() === formattedDate;
            console.log(formattedDate, item?.trades?.date?.trim(), r);
            return r
        });

        if (matchedItems.length === 0) {
            return [];
        }

        console.log("Matched items:", matchedItems);

        // Collect all trades from all matching items

        const allTrades = matchedItems.map(item => ({
            ...item.trades,
            id: item.id,
        }));
        return allTrades;
    };

    const isCurrentWeek = weekOffset === 0;

    return (
        <div className="w-full h-[calc(100vh-4.5rem)] flex flex-col gap-2" >
            {/* Header */}
            < div className="flex items-center justify-between " >
                <div className="flex items-center gap-4">
                    {/* Filters */}
                    <div className="flex bg-white rounded-full shadow-md">
                        <button className="px-4 py-2 border border-neutral-400 text-sm font-medium bg-white text-black hover:bg-neutral-100 rounded-full flex items-center gap-2">
                            Strategy <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex bg-white rounded-full shadow-md">
                        <button className="px-4 py-2 border border-neutral-400 text-sm font-medium bg-white text-black hover:bg-neutral-100 rounded-full flex items-center gap-2">
                            Mistakes <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={handlePrevWeek} className="p-2 hover:bg-neutral-100 rounded-lg">
                        <ChevronLeft className="w-5 h-5 text-neutral-600" />
                    </button>

                    <button onClick={handleToday} className="px-4 py-2 font-medium transition-colors rounded-lg">
                        {weekData.title}
                    </button>

                    <button onClick={handleNextWeek} className="p-2 hover:bg-neutral-100 rounded-lg">
                        <ChevronRight className="w-5 h-5 text-neutral-600" />
                    </button>

                    <button className="p-2 hover:bg-neutral-100 rounded-lg ml-2">
                        <Calendar className="w-5 h-5 text-neutral-600" />
                    </button>
                </div>

                <div className="flex bg-teal-50 rounded-lg p-1">
                    <button
                        className="px-4 py-2 text-teal-700 font-medium bg-teal-100 rounded-md hover:bg-teal-200 transition-colors"
                        onClick={() => window.location.href = '/dashboard/trades'}
                    >
                        Week
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-5 gap-px bg-neutral-200 border border-neutral-200 rounded-md overflow-hidden" >
                {
                    days.map((day, index) => {
                        const date = weekData.dates[index];


                        const isToday = date && isDateToday(date)

                        const dayData = getDataForDate(date);
                        console.log("Day data:", dayData);


                        const pnlResult = calculateOverallPnL(dayData);
                        const totalPnL = pnlResult.pnl

                        const totalValue = {
                            type: pnlResult.type,
                            pnl: Math.abs(totalPnL).toFixed(2),
                        };


                        return (
                            <div key={day} className="bg-white flex flex-col h-[calc(100vh-8rem)]">
                                {/* Day Header */}
                                <div
                                    className={`px-4 ${salsaFont.className
                                        } py-3 border-b h-14 rounded border-neutral-200 flex justify-between items-center relative ${isToday ? "bg-teal-50" : "bg-neutral-50"
                                        }`}
                                >
                                    <div className="flex flex-col items-start justify-start w-full"  >
                                        <h3
                                            className={`font-medium ${isToday ? "text-teal-700" : "text-neutral-800"
                                                }`}
                                        >
                                            {day}

                                        </h3>
                                        <span className=" text-neutral-500">
                                            {date
                                                ? new Date(date).getDate()
                                                : ""}
                                        </span>
                                    </div>
                                    {dayData.length > 0 && (
                                        <div
                                            className={` ${totalValue.type === "PROFIT"
                                                ? "bg-green-100"
                                                : "bg-red-100"
                                                } text-black rounded-full px-2 py-1 absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1`}
                                        >
                                            {totalValue.type === "PROFIT" ? "+" : "-"} {formatNumber(totalValue?.pnl) ?? 0}
                                        </div>
                                    )}
                                </div>

                                {/* Day Content */}
                                <div className="h-full p-3 flex flex-col overflow-y-auto  custom-scroll">
                                    {

                                        dayData.length > 0 ? (
                                            <div className="space-y-2">
                                                {dayData
                                                    .flatMap(dataObj =>
                                                        Object.entries(dataObj)
                                                            .filter(([key]) => key.startsWith("TRADE_"))
                                                            .map(([key, orders]) => ({ tradeId: key, orders }))
                                                    )
                                                    .map((trade, idx) => {
                                                        return <TradeCard
                                                            key={idx}
                                                            data={trade}
                                                            onClickStrategyBtn={() => {
                                                                if (dayData.length > 0) {
                                                                    setSelectedTrade(idx);
                                                                    setDetailsData({ todaysTrades: dayData, currentDate: date });
                                                                } else {
                                                                    setSelectedTrade(0);
                                                                    setDetailsData(null);
                                                                }
                                                            }}

                                                        />

                                                    }

                                                    )}
                                            </div>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-neutral-400">
                                                {isToday ?
                                                    <GetOrders showElseCondition={true} />

                                                    : "No Trades"}
                                            </div>
                                        )}
                                </div>


                            </div>
                        );
                    })
                }
            </div>
        </div >
    );
};

export default WeeklyCalendar;