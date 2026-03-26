'use client'
import Image from "next/image"
import SubscriberForm from "./subscriberForm"
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Hero() {
    const [heroImage, setHeroImage] = useState('');
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const image = resolvedTheme === 'dark' ? '/hero_image_dark.png' : '/hero_image.png';
        setHeroImage(image);
    }, [resolvedTheme]);

    return (
        <section
            className="flex flex-col w-full px-6 sm:px-12 lg:px-20 py-5"
            aria-labelledby="hero-heading"
        >
            <div className="flex flex-col gap-5 w-full lg:w-8/12">
                <h1 id="hero-heading" className="text-3xl sm:text-5xl font-bold">
                    Journaling made real & simple
                </h1>
                <p className="text-base sm:text-lg text-neutral-500">
                    Tradio helps Indian traders track their trades, understand mistakes, and become consistent with simple tools and expert mentorship to guide you along the way.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row w-full mt-2 gap-10 items-start">
                {/* Left image - wider */}
                <div className="w-full lg:w-2/3 flex justify-start items-start lg:h-[450px] h-full">
                    {
                        heroImage && <Image
                            src={heroImage}
                            alt="Illustration of Tradio trading journal interface"
                            width={1920}
                            height={1080}
                            quality={100}
                            className="w-full h-full object-contain"
                        />
                    }
                </div>

                <div
                    id="subscribe-form"
                    className="scroll-mt-28 w-full lg:w-1/3 flex flex-col justify-start lg:items-end items-center px-4 sm:px-12 lg:px-8 gap-4"
                >
                    <h2 className="lg:text-right text-center font-medium w-full">
                        43 / 200 traders already subscribed 🔥
                    </h2>
                    <SubscriberForm />
                </div>
            </div>
        </section>
    );
}
