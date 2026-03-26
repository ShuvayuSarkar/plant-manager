'use client';

import { useState, useContext, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { updateUserDocument } from '@/lib/firebase/database/index';
import { JournalContext } from './journalDetailsProvider';
import { toast } from "sonner";
import { Button } from '../ui/button';
import { deleteImageFromS3, uploadImageToS3 } from '@/lib/firebase/storage/uploadImage';
import Image from 'next/image';

export default function FeelingsPanel() {
    const { selectedTrade, detailsData } = useContext(JournalContext);
    const [journalEntry, setJournalEntry] = useState('');
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [existingChartImage, setExistingChartImage] = useState('');

    // Get the current document (assuming first one from todaysTrades)
    const currentDocument = detailsData?.todaysTrades?.[0];

    console.log(currentDocument);


    // Get all trade keys from the document (TRADE_001, TRADE_002, etc.)
    const allTradeKeys = currentDocument ?
        Object.keys(currentDocument).filter(key => key.startsWith('TRADE_')) : [];

    // Get the current trade key based on selectedTrade index
    const currentTradeKey = allTradeKeys?.[selectedTrade];

    // Get the current trade data directly from document
    const currentTradeData = currentDocument?.[currentTradeKey] || {};

    // Get document ID
    const docId = currentDocument?.id;

    useEffect(() => {
        // Set journal entry and chart image based on current trade data
        setJournalEntry(currentTradeData?.description || '');
        setExistingChartImage(currentTradeData?.chartImage || '');
    }, [detailsData, selectedTrade, currentTradeKey, currentTradeData?.description, currentTradeData?.chartImage]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];


        if (!file) return;

        setUploading(true);

        try {
            if (!docId) throw new Error("Document ID not found");

            const arrayBuffer = await file.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);

            console.log(buffer, file.name, file.type, file.size, file.lastModified);

            if (existingChartImage) {
                await deleteImageFromS3(existingChartImage);
            }

            const imageUrl = await uploadImageToS3(buffer, file.name, file.type);

            await updateUserDocument("journal", docId, {
                [`trades.${currentTradeKey}.chartImage`]: imageUrl,
                updated_at: new Date()
            });

            setExistingChartImage(imageUrl);
            toast.success("Image uploaded successfully!");
        } catch (err) {
            toast.error("Failed to upload image.");
            console.error("Upload failed:", err);
        } finally {
            setUploading(false);
        }
    };


    const handleSaveDescription = async () => {
        try {
            if (!docId) throw new Error("Document ID not found");
            setSaving(true);

            await updateUserDocument("journal", docId, {
                [`trades.${currentTradeKey}.description`]: journalEntry,
                updated_at: new Date()
            });


            toast.success("Description saved!");
        } catch (err) {
            toast.error("Failed to save description.");
            console.error("Error saving description:", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card className="rounded p-0 m-0 h-[calc(100vh-6.3rem)]">
            <CardContent className="p-3 flex flex-col gap-4 overflow-y-auto custom-scroll">
                <input id="image_upload" className="hidden" type="file" onChange={handleFileChange} />

                {existingChartImage ? (
                    <label htmlFor="image_upload" className='flex flex-col gap-2 p-0 rounded' >
                        <Image 
                        src={existingChartImage} 
                        alt="Chart" 
                        className="h-64 w-full object-contain rounded border"
                        width={500}
                        height={500}
                        quality={100}
                        priority
                         />
                    </label>
                ) : (
                    <div className="h-64 bg-neutral-100 dark:bg-neutral-700 rounded flex items-center justify-center">
                        <label htmlFor="image_upload" className="text-center text-neutral-500 dark:text-neutral-400">
                            <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                            <div>Chart visualization would go here</div>
                            <div className="text-sm">Nifty 18500 CE trading data</div>
                            {uploading && <div className="text-sm text-neutral-900 dark:text-neutral-100 mt-2">Uploading...</div>}
                        </label>
                    </div>
                )}

                <div className='flex flex-col gap-2'>
                    <Label className="text-neutral-900 dark:text-neutral-100 font-medium mb-2 block">
                        Write down your feelings, Mr Shakespeare
                    </Label>
                    <Textarea
                        value={journalEntry}
                        onChange={(e) => setJournalEntry(e.target.value)}
                        placeholder="Describe your trading experience, emotions, and thoughts..."
                        className="min-h-24 border-neutral-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400"
                    />
                    <Button
                        type="button"
                        onClick={handleSaveDescription}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                </div>

                <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                        Risk management Insights
                    </h3>
                    <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full mt-2" />
                            <div>You risked 2% of your capital for this trade</div>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full mt-2" />
                            <div>Max. loss in this trade is</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}