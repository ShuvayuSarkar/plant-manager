'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
    TrendingDown, Shield, Smile, Frown, Meh, Heart,
    Zap, Award, BookOpen, Check
} from 'lucide-react'
import { JournalContext } from './journalDetailsProvider'
import { useContext, useEffect, useState } from 'react'
import { calculateDetails } from '@/lib/logic'
import { updateUserDocument } from '@/lib/firebase/database/index'
import { toast } from "sonner";

const tradeSchema = z.object({
    stop_loss_price: z.coerce.number().min(0),
    target_price: z.coerce.number().min(0),
    feelings: z.array(z.string()).optional(),
})


const inputFields = [
    { label: 'Entry price', name: 'entry_price', editable: false },
    { label: 'Exit price', name: 'exit_price', editable: false },
    { label: 'Quantity', name: 'quantity', editable: false },
    { label: 'Stop loss price', name: 'stop_loss_price', editable: true },
    { label: 'Target price', name: 'target_price', editable: true },
    { label: 'Reward : Risk', name: 'reward_risk', editable: false },
]

const feelings = [
    { id: 'calm', label: 'Calm', icon: Smile, color: 'text-green-600' },
    { id: 'overconfident', label: 'Over confident', icon: Zap, color: 'text-yellow-600' },
    { id: 'nervous', label: 'Nervous', icon: Frown, color: 'text-blue-600' },
    { id: 'confused', label: 'Confused', icon: Meh, color: 'text-purple-600' },
    { id: 'revenge', label: 'Revenge mode', icon: TrendingDown, color: 'text-red-600' },
    { id: 'happy', label: 'Happy', icon: Heart, color: 'text-pink-600' },
    { id: 'fear', label: 'Fear', icon: Shield, color: 'text-orange-600' },
    { id: 'lettinggo', label: 'Letting go', icon: Smile, color: 'text-cyan-600' },
    { id: 'hardwork', label: 'Hard work paid off', icon: Award, color: 'text-indigo-600' },
    { id: 'wanttolearn', label: 'Want to learn', icon: BookOpen, color: 'text-emerald-600' },
]

export function Checkbox({ checked = false, onChange }) {
    return (
        <div
            className={`
                w-4 h-4 border-2 rounded-sm cursor-pointer flex items-center justify-center transition-all duration-200
                ${checked
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 bg-white hover:border-blue-400 dark:border-gray-600 dark:bg-gray-800'
                }
            `}
            onClick={() => onChange?.(!checked)}
        >
            {checked && <Check className="w-3 h-3" />}
        </div>
    );
}

export default function TradePanel() {
    const { todaysTrades, selectedTrade, detailsData } = useContext(JournalContext)
    const currentTradeDetails = todaysTrades[selectedTrade]
    const initialAttributes = calculateDetails(currentTradeDetails || []);

    // Get the complete trade object with stop_loss, target_price, feelings
    // Using the same pattern as FeelingsPanel
    const currentDocument = detailsData?.todaysTrades?.[0];

    // Get all trade keys from the document (TRADE_001, TRADE_002, etc.)
    const allTradeKeys = currentDocument ?
        Object.keys(currentDocument).filter(key => key.startsWith('TRADE_')) : [];

    // Get the current trade key based on selectedTrade index
    const currentTradeKey = allTradeKeys?.[selectedTrade];

    // Get the current trade data directly from document
    const completeTradeData = currentDocument?.[currentTradeKey] || {};

    // Debug logs to check the data structure
    console.log('Complete trade data:', completeTradeData);
    console.log('Current trade key:', currentTradeKey);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(tradeSchema),
        mode: 'onBlur',
        defaultValues: {
            stop_loss_price: 0,
            target_price: 0,
            feelings: [],
        }
    })

    const watchedValues = watch()
    const [rewardToRisk, setRewardToRisk] = useState('')

    // Set form values when trade data changes
    useEffect(() => {
        if (completeTradeData) {
            // Based on your actual data structure
            const stopLossValue = completeTradeData.stop_loss || 0;
            const targetPriceValue = completeTradeData.target_price || 0;
            const feelingsValue = completeTradeData.feelings || [];

            console.log('Setting form values:', {
                stop_loss_price: stopLossValue,
                target_price: targetPriceValue,
                feelings: feelingsValue
            });

            // Use setValue instead of reset to ensure form updates
            setValue('stop_loss_price', stopLossValue);
            setValue('target_price', targetPriceValue);
            setValue('feelings', feelingsValue);
        }
    }, [completeTradeData, setValue, currentTradeKey]);

    // Live Reward:Risk Update - Fixed calculation
    useEffect(() => {
        const stopLoss = parseFloat(watchedValues.stop_loss_price) || 0
        const target = parseFloat(watchedValues.target_price) || 0

        const entry = initialAttributes?.entry_price

        if (entry > 0 && stopLoss > 0 && target > 0) {
            const reward = Math.abs(target - entry)
            const risk = Math.abs(entry - stopLoss)

            if (risk > 0) {
                setRewardToRisk((reward / risk).toFixed(2))
            } else {
                setRewardToRisk('∞') // Infinite reward if no risk
            }
        } else {
            setRewardToRisk('—')
        }
    }, [watchedValues.stop_loss_price, watchedValues.target_price, initialAttributes])

    const onSubmit = async (data) => {
        try {
            console.log('--------------------- Submitted data: ---------------', data);
            console.log('Current trade details:', currentTradeDetails);
            console.log('Current journal :', detailsData);

            // Step 1: Get current trade key like TRADE_001 based on selectedTrade index
            if (!currentTradeKey) {
                console.error("Trade key not found for selectedTrade index:", selectedTrade);
                return;
            }

            console.log('Updating trade key:', currentTradeKey);

            // Step 2: Get document ID
            const documentId = currentDocument?.id;

            if (!documentId) {
                console.error("Document ID not found");
                return;
            }

            // Step 3: Prepare update payload - FIXED: Use proper nested path
            const updatePayload = {
                [`trades.${currentTradeKey}.stop_loss`]: data.stop_loss_price,
                [`trades.${currentTradeKey}.target_price`]: data.target_price,
                [`trades.${currentTradeKey}.feelings`]: data.feelings || [],
                updated_at: new Date()
            };

            console.log('Update payload:', updatePayload);

            // Step 4: Update document using Firestore
            await updateUserDocument('journal', documentId, updatePayload);

            toast.success('Trade updated successfully');
        } catch (error) {
            toast.error('Failed to update trade');
            console.error("🔥 Error updating trade:", error);
        }
    };

    const toggleFeeling = (feelingId) => {
        const current = getValues('feelings') || []
        const updated = current.includes(feelingId)
            ? current.filter(f => f !== feelingId)
            : [...current, feelingId]

        setValue('feelings', updated, { shouldDirty: true })
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="rounded flex flex-col h-[calc(100vh-6.3rem)] p-0">
                    <CardContent className="space-y-4 flex-1 overflow-y-auto custom-scroll p-4">
                        <CardHeader className="p-0 m-0">
                            <div className="flex items-center justify-between">
                                <div className='flex gap-2'>
                                    <span className='font-bold'>P/L</span>
                                    <span>{initialAttributes?.pnl?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div>{currentTradeDetails?.[0]?.tradingsymbol || 'N/A'}</div>
                            </div>
                        </CardHeader>

                        <div className="flex flex-col gap-2 mt-1">
                            {inputFields.map((input) => {
                                let fieldValue = '';

                                if (input.name === 'reward_risk') {
                                    fieldValue = rewardToRisk;
                                } else if (input.name === 'stop_loss_price') {
                                    fieldValue = watchedValues.stop_loss_price || 0;
                                } else if (input.name === 'target_price') {
                                    fieldValue = watchedValues.target_price || 0;
                                } else {
                                    fieldValue = initialAttributes?.[input.name] || '';
                                }

                                return (
                                    <div key={input.name} className="flex gap-1 justify-between">
                                        <Label>{input.label}</Label>
                                        <div className="flex flex-col">
                                            <Input
                                                type="number"
                                                placeholder={input.name === "reward_risk" ? '—' : `Enter ${input.label.toLowerCase()}`}
                                                className="w-48"
                                                readOnly={!input.editable}

                                                {...(input.editable
                                                    ? register(input.name)
                                                    : {
                                                        value: fieldValue,
                                                        disabled: true,
                                                    })}

                                            />
                                            {errors[input.name] && input.editable && (
                                                <span className="text-red-500 text-xs mt-1">
                                                    {errors[input.name]?.message}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <Label className="pt-2">Describe how you are feeling</Label>
                        <div className="grid grid-cols-2 gap-1 mb-4">
                            {feelings.map((feeling) => {
                                const Icon = feeling.icon
                                const selected = watchedValues.feelings?.includes(feeling.id)

                                return (
                                    <div
                                        key={feeling.id}
                                        onClick={() => toggleFeeling(feeling.id)}
                                        className={`flex items-center gap-2 py-2 px-2 rounded cursor-pointer transition-colors ${selected
                                            ? 'bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600'
                                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-700/50 border border-transparent'
                                            }`}
                                    >
                                        <Checkbox
                                            checked={selected}
                                            onChange={() => toggleFeeling(feeling.id)}
                                        />
                                        <Icon className={`w-4 h-4 ${feeling.color}`} />
                                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                            {feeling.label}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>

                        <button
                            type="submit"
                            className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                        >
                            Save
                        </button>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}