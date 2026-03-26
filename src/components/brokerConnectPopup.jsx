"use client"

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

/**
 * Broker Connect Popup Component
 * 
 * A modal dialog designed for financial trading applications that allows users 
 * to connect their trading accounts from various brokers to automatically import 
 * trade details, eliminating manual data entry.
 * 
 * Features:
 * - Modern curved design with rounded-3xl corners
 * - Responsive design that adapts to mobile screens
 * - Interactive broker logos with hover effects
 * - Security reassurance messaging
 * - Clean typography and proper spacing
 * - Smooth transitions and animations
 * 
 * Usage:
 * <BrokerConnectPopup 
 *   trigger={<Button>Connect Broker</Button>}
 *   onConnect={(broker) => console.log('Connect to:', broker)}
 * />
 */
const BrokerConnectPopup = ({
    trigger,
    onConnect,
    isOpen: controlledOpen,
    onOpenChange
}) => {
    const [internalOpen, setInternalOpen] = useState(false);

    // Use controlled or internal state
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setIsOpen = onOpenChange || setInternalOpen;

    // Broker configuration with actual logo paths from your public directory
    const brokerLogos = [
        {
            name: 'Zerodha',
            logo: '/brokers/zerodhakite.svg',
            color: '#387ED1',
            bgColor: '#387ED1'
        },
        {
            name: 'Angel One',
            logo: '/brokers/angelone.svg',
            color: '#FF6B35',
            bgColor: '#FF6B35'
        },
        {
            name: 'Groww',
            logo: '/brokers/groww.svg',
            color: '#00D09C',
            bgColor: '#00D09C'
        },
        {
            name: 'Dhan',
            logo: '/brokers/dhan_logo.svg',
            color: '#7B68EE',
            bgColor: '#7B68EE'
        },
        {
            name: 'Upstox',
            logo: null, // Placeholder for future broker
            color: '#DAA520',
            bgColor: '#DAA520'
        }
    ];

    const BrokerLogo = ({ broker, index }) => (
        <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-white/20 hover:border-white/40"
            style={{ backgroundColor: broker.bgColor }}
            onClick={() => onConnect?.(broker)}
            title={`Connect to ${broker.name}`}
        >
            {broker.logo ? (
                <Image
                    src={broker.logo}
                    alt={broker.name}
                    width={28}
                    height={28}
                    className="filter brightness-0 invert"
                />
            ) : (
                broker.name.charAt(0)
            )}
        </div>
    );

    const MoreBrokerIcon = () => (
        <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 hover:scale-105 transition-all duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100">
            <Plus size={24} />
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

            <DialogContent
                className="max-w-md w-full mx-4 p-0 rounded-3xl border-0 shadow-2xl overflow-hidden"
                showCloseButton={false}
            >
                <div className="bg-white">
                    {/* Header with Close Button */}
                    <div className="relative px-8 pt-8 pb-6">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                            aria-label="Close dialog"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>

                        <div className="pr-10">
                            <h2 className="text-xl font-semibold text-gray-800 text-center leading-tight">
                                Auto import all trade details everyday without typing it manually
                            </h2>
                        </div>
                    </div>

                    {/* Broker Logos Section */}
                    <div className="px-8 py-6">
                        {/* First Row - 4 main brokers + more indicator */}
                        <div className="flex justify-center items-center gap-3 mb-4">
                            {brokerLogos.slice(0, 4).map((broker, index) => (
                                <BrokerLogo key={`main-${index}`} broker={broker} index={index} />
                            ))}
                            <MoreBrokerIcon />
                        </div>

                        {/* Second Row - Additional broker + text */}
                        <div className="flex justify-center items-center gap-3">
                            <BrokerLogo broker={brokerLogos[4]} index={4} />
                            <span className="text-gray-500 font-medium text-base">
                                + more
                            </span>
                        </div>
                    </div>

                    {/* Connect Button */}
                    <div className="px-8 pb-6">
                        <Button
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-2xl transition-colors shadow-md border-0 h-auto text-base"
                            onClick={() => {
                                onConnect?.();
                                // Optional: Close popup after connection attempt
                                // setIsOpen(false);
                            }}
                        >
                            Connect Broker
                        </Button>
                    </div>

                    {/* Footer */}
                    <div className="px-8 pb-6 text-center">
                        <p className="text-gray-500 text-sm leading-relaxed">
                            🔒 100% secure. Takes less than 5 minutes
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// Example usage component (for demonstration only)
export const BrokerConnectPopupExample = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleConnect = (broker) => {
        console.log('Connect to broker:', broker?.name || 'Generic');
        // Add your connection logic here
    };

    return (
        <div className="p-8">
            <h3 className="text-lg font-semibold mb-4">Broker Connect Popup Example</h3>

            {/* Controlled usage */}
            <BrokerConnectPopup
                trigger={
                    <Button className="mb-4">
                        Open Broker Connect (Controlled)
                    </Button>
                }
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                onConnect={handleConnect}
            />

            {/* Uncontrolled usage */}
            <BrokerConnectPopup
                trigger={
                    <Button variant="outline">
                        Open Broker Connect (Uncontrolled)
                    </Button>
                }
                onConnect={handleConnect}
            />
        </div>
    );
};

export default BrokerConnectPopup;
