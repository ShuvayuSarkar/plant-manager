'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { onUserAuthStateChange } from '@/lib/firebase/database'
import { sendGTMEvent } from '@next/third-parties/google'
import { useRouter } from 'next/navigation'
import StyledButton from './styledButton'
import useGlobalState from '@/hooks/globalState'



export default function Navbar() {
    const { user } = useGlobalState()
    const router = useRouter();

    function handleGetFreeJournal() {
        if (typeof window !== 'undefined') {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'buttonClicked',
                buttonName: 'Get Free Trading Journal',
            });
        }

        router.push('#subscribe-form');
    }

    return (
        <header className="sticky top-0 bg-white dark:bg-black border-b border-neutral-300 dark:border-neutral-800 z-50">
            <nav
                className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-2 gap-2 sm:gap-0"
                role="navigation"
                aria-label="Main navigation"
            >

                <Link href="/" className="flex-shrink-0" aria-label="Go to Tradio homepage"><Image
                    src={"/tradio_logo_transparent.png"}
                    alt="Tradio Trading Journal Logo"
                    width={100}
                    height={100}
                    priority
                />
                </Link>


                {user ? (
                    <StyledButton href="/dashboard" ariaLabel="Go to your dashboard">
                        Dashboard
                    </StyledButton>
                ) : (
                    <StyledButton onClick={handleGetFreeJournal} ariaLabel="Subscribe for free trading journal access">
                        Get free trading journal
                    </StyledButton>
                )}
            </nav>
        </header>
    );
}
