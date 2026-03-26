import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import TradePanel from "./tradePanel";
import FeelingsPanel from "./feelingsPanel";
import Builder from "./builder";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { CalenderContext } from "../journal/calenderDataProvider";
import { JournalContext } from "./journalDetailsProvider";
import { getDataForDate } from "@/lib/logic";

export default function Details() {
    const { setWeekOffset, openDialog, setOpenDialog } = useContext(CalenderContext);
    const { detailsData: data, selectedTrade, todaysTrades, setSelectedTrade } = useContext(JournalContext);

    console.log("Details data:", data);

    function changeTrade(position) {
        if (todaysTrades.length === 0) return;

        setSelectedTrade((prev) => {
            if (position === 'left') {
                return Math.max(prev - 1, 0);
            }
            if (position === 'right') {
                return Math.min(prev + 1, todaysTrades.length - 1);
            }
            return prev;
        });
    }

    const handlePrevWeek = () => {
        setWeekOffset((prev) => prev - 1);
    }

    const handleNextWeek = () => {
        setWeekOffset((prev) => prev + 1);
    }

    const handleToday = () => {
        setWeekOffset(0);
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>


            <DialogContent className="fixed top-[50%] left-1/2 -translate-x-1/2 w-[calc(100vw-4rem)] max-w-[calc(100vw-8rem)] max-h-[95vh] overflow-hidden p-0 m-0 gap-0 rounded-md bg-white dark:bg-neutral-900 shadow-md">
                <DialogHeader>
                    <DialogTitle className="hidden">Trade Details</DialogTitle>
                    <div className="bg-[#F2F2F2] p-0 m-0 h-12 w-full flex items-center justify-center">
                        {/* Week Selector */}
                        <div className="flex items-center">
                            <Button
                                variant="icon"
                                onClick={handlePrevWeek}
                                className="p-2 hover:bg-neutral-100 rounded-lg "
                            >
                                <ChevronLeft className="w-5 h-5 text-neutral-600" />
                            </Button>

                            <Button
                                variant="icon"
                                onClick={handleToday}
                                className="px-4 py-2 font-medium rounded-lg">
                                {data ? data.currentDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) : 'Today'}
                            </Button>

                            <Button
                                variant="icon"
                                onClick={handleNextWeek}
                                className="p-2 hover:bg-neutral-100 rounded-lg">
                                <ChevronRight className="w-5 h-5 text-neutral-600" />
                            </Button>
                        </div>

                        {
                            data &&
                            <div className="flex items-center">
                                <Button
                                    variant="icon"
                                    onClick={() => { changeTrade('left') }}
                                    className="p-2 hover:bg-neutral-100 rounded-lg">
                                    <ChevronLeft className="w-5 h-5 text-neutral-600" />

                                </Button>

                                <div className="px-4 py-2 font-medium rounded-lg">Trade {selectedTrade + 1}</div>

                                <Button
                                    variant="icon"
                                    onClick={() => { changeTrade('right') }}
                                    className="p-2 hover:bg-neutral-100 rounded-lg">
                                    <ChevronRight className="w-5 h-5 text-neutral-600" />
                                </Button>
                            </div>
                        }

                        {/*
                         <Button
                            variant="icon"
                            className="p-2 hover:bg-neutral-100 rounded-lg ml-2"
                            aria-label="Open calendar picker"
                        >
                            <Calendar className="w-5 h-5 text-neutral-600" />
                        </Button>
                         */}
                    </div>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    Details about the strategy and trade journal for the selected week.
                </DialogDescription>
                {
                    data ?
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h- p-2 overflow-y-auto">
                                <TradePanel />
                                <Builder />
                                <FeelingsPanel />
                            </div>
                        </>
                        :
                        <div className="h-[calc(100vh-6.3rem)] flex items-center justify-center text-neutral-400 text-sm">
                            No trades
                        </div>
                }


            </DialogContent>
        </Dialog>
    );
}
