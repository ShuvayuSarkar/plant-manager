'use client';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/mixpanelClient';
import Script from 'next/script';

export default function Review() {
    useEffect(() => {
        // Load Calendly script
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        document.head.appendChild(script);



        // Load Calendly CSS
        const link = document.createElement('link');
        link.href = 'https://assets.calendly.com/assets/external/widget.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Cleanup function
        return () => {
            document.head.removeChild(script);
            document.head.removeChild(link);
        };
    }, []);

    const handleScheduleClick = () => {
        if (window.Calendly) {
            window.Calendly.initPopupWidget({
                url: 'https://calendly.com/pavankona7302/30min'
            });

        } else {
            console.warn('Calendly widget not loaded yet');
        }

    };

    useEffect(() => {
        trackEvent('viewed_review');
    }, []);

    return (
        <>
            <div className='flex justify-center items-center h-[80%] '>
                <Button
                    className="rounded-md"
                    onClick={(e) => {
                        trackEvent('clicked_on_scheduletimewithme');
                        handleScheduleClick();
                    }}
                >
                    Schedule time with me
                </Button>
            </div>
        </>
    );
}