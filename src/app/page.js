"use client";
import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import Hero from "@/components/landing/hero";
import JoinWaitlist from "@/components/landing/joinWaitlist";
import Navbar from "@/components/landing/navbar";
import { useEffect } from 'react';
import { trackEvent } from '@/lib/mixpanelClient';




export default function Home() {
  useEffect(() => {
    trackEvent('viewed_landing');
  }, []);

  return (
    <main className="dark:bg-black">
      <Navbar />
      <Hero />
      <Features />
      <JoinWaitlist />
      <Footer />
    </main>
  );
}
