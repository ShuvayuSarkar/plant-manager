'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import Link from 'next/link';
import { Button } from '../ui/button';
import React from 'react'
import { Angry, Edit, Frown, Laugh, Smile, SmilePlus } from 'lucide-react'



function TradeCard() {
    return (
        <div className='bg-green-100 dark:bg-green-900 text-black dark:text-white border-2 border-green-300 dark:border-green-700 rounded-md p-2 gap-2 w-full flex flex-col transition-colors duration-300'>
            <div className='flex justify-between items-center'>
                <p className='font-bold text-lg'>+28800</p>
                <Link href="">
                    <Edit size={20} />
                </Link>
            </div>

            <div className='flex gap-2 items-center justify-between w-full my-2'>
                <Angry size={18} />
                <Frown size={18} />
                <Smile size={18} />
                <Laugh size={18} />
                <SmilePlus size={18} />
            </div>

            <div className='flex justify-around gap-1'>
                <Button
                    className="p-0 px-2 m-0 border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
                    variant="ghost"
                    asChild
                >
                    <Link href="/dashboard/strategy">Strategy</Link>
                </Button>
                <Button
                    className="p-0 px-2 m-0 border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
                    variant="ghost"
                    asChild
                >
                    <Link href="/dashboard/strategy">Mistakes</Link>
                </Button>
            </div>
        </div>
    );
}



export default function MyCalendar() {


    const events = [
        {
            title: '🎤 Open Mic Night',
            start: '2025-05-17',
            description: 'Try new standup set at local cafe',
        },   {
            title: '🎤 Open Mic Night',
            start: '2025-05-17',
            description: 'Try new standup set at local cafe',
        },
        {
            title: '🏋 Gym',
            start: '2025-06-04',
        },  {
            title: '🏋 Gym',
            start: '2025-06-04',
        },{
            title: '🏋 Gym',
            start: '2025-06-04',
        },{
            title: '🏋 Gym',
            start: '2025-06-02',
        },{
            title: '🏋 Gym',
            start: '2025-06-03',
        },{
            title: '🏋 Gym',
            start: '2025-06-04',
        },
    ];

    const renderEventContent = (eventInfo) => {
        return (
            <TradeCard />
        );
    };

    return (
        <div className=''>
            <FullCalendar
                buttonText={
                    {
                        month: "Month",
                        week: "Week",
                        today: "Today"
                    }
                }

                plugins={[dayGridPlugin]}
                initialView="dayGridWeek"
                headerToolbar={{
                    left: 'today',
                    center: 'prev title next',
                    right: 'dayGridWeek',
                }}
                events={events}
                eventContent={renderEventContent}
                height="auto"
                dayHeaderFormat={{ weekday: 'long' }}           
            />

        </div>
    );
}
