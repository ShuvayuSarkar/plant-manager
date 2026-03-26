'use client'
import { Button } from "../ui/button"
import Link from "next/link"
import { Edit } from "lucide-react"
import AngryIcon from "../../icons/emoji/fluent_emoji-angry-16-regular.svg"
import FrownIcon from "../../icons/emoji/bi_emoji-frown.svg"
import LaughIcon from "../../icons/emoji/fluent_emoji-laugh-16-regular.svg"
import SmileIcon from "../../icons/emoji/mynaui_emoji-smile.svg"
import SmilePlusIcon from "../../icons/emoji/fluent_emoji-meme-24-regular.svg"
import Image from "next/image"
import { salsaFont } from '@/lib/utils';
import { calculatePnLForTrade } from "@/lib/logic"
import { useContext } from "react"
import { CalenderContext } from "./calenderDataProvider"
import { trackEvent } from '@/lib/mixpanelClient';

export default function TradeCard({ onClickStrategyBtn, data, index }) {

    const pnl = calculatePnLForTrade(data.orders.orders)

    const { setOpenDialog } = useContext(CalenderContext);

    const handleCardClick = () => {
        onClickStrategyBtn()
        setOpenDialog(true)
    };

    return (
        <div
            onClick={handleCardClick}
            role="button"
            tabIndex={0}
            className={`flex flex-col gap-2 p-2 border  
                ${pnl.type === 'PROFIT' ? 'bg-green-100' : 'bg-red-100'}  
                border-neutral-400 dark:border-neutral-600 rounded-md transition-colors duration-300 w-full`}
        >
            <div className='flex justify-between items-center'>
                <p className={`font-bold ${salsaFont.className}`}>
                    {pnl.type === 'PROFIT' && '+'}{pnl.pnl}
                </p>
                <div className="flex gap-2 items-center justify-center">
                    <div className={`bg-white font-medium rounded py-1 px-2 text-xs`}>
                        Trade {parseInt(data.tradeId.split('_')[1])}
                    </div>
                    <Link href="">
                        <Edit size={20} />
                    </Link>
                </div>
            </div>

            <div className='flex gap-2 items-center justify-between w-full my-2'>
                <Image src={AngryIcon} alt="angry" />
                <Image src={FrownIcon} alt="frown" />
                <Image src={SmileIcon} alt="smile" />
                <Image src={LaughIcon} alt="laugh" />
                <Image src={SmilePlusIcon} alt="smile plus" />
            </div>

            <div className='flex gap-1 w-full'>
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        trackEvent('clicked_on_card_strategy');
                        handleCardClick();
                    }}
                    className="flex-1 p-0 px-2 m-0 border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-black dark:text-white"
                    variant="ghost"
                >
                    Strategy
                </Button>

                <Button
                    className="flex-1 p-0 px-2 m-0 border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-black dark:text-white"
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        trackEvent('clicked_on_card_mistakes')
                    }}
                >
                    Mistakes
                </Button>
            </div>
        </div>
    )
}
