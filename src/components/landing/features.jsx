import Image from "next/image";
import automaticFlash from "@/icons/features/automatic-flash.png";
import dashboard from "@/icons/features/dashboard.png";
import emotion from "@/icons/features/emotion.png";
import mentorship from "@/icons/features/mentorship.png";
import { trackEvent } from '@/lib/mixpanelClient';

const features = [
    {
        title: "Track trades automatically",
        description:
            "Connect your broker (Zerodha, Groww,..) once and Tradio auto-imports all your trades. No Excel. No manual entry",
        icon: automaticFlash,
    },
    {
        title: "Emotion and strategy builder",
        description:
            "Log how you feel and Spot emotional patterns that hurt your results. Build strategies on top of these",
        icon: emotion,
    },
    {
        title: "Powerful Dashboard",
        description:
            "See your P&L, win rate, risk-reward, and strategy performance with advanced filters— all in one place.",
        icon: dashboard,
    },
    {
        title: "1-on-1 Expert Mentorship",
        description:
            "Get real feedback from experienced traders. Fix mistakes, ask questions, grow faster.",
        icon: mentorship,
    },
];

export default function Features() {
    return (
        <section
            className="flex lg:flex-row flex-col items-center justify-center gap-8 px-6 sm:px-10 py-8"
            aria-labelledby="features-heading"
        >
            <h2 id="features-heading" className="sr-only">
                Key Features of Tradio
            </h2>

            {features.map((feature, index) => (
                <article
                    key={index}
                    className="flex flex-col items-center text-center lg:w-[300px]"
                    aria-label={feature.title}
                >
                    <div aria-hidden="true">
                        <Image
                            src={feature.icon}
                            alt=""
                            width={50}
                            height={50}
                        />
                    </div>
                    <h3 className="text-lg font-medium mt-3">{feature.title}</h3>
                    <p className="text-neutral-500 mt-1">{feature.description}</p>
                </article>
            ))}
        </section>
    );
}
