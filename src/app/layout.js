import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { GoogleAnalytics } from "nextjs-google-analytics";
import Script from "next/script";
import useGlobalState from "@/hooks/globalState";
import { onUserAuthStateChange } from "@/lib/firebase/database/index";
import AuthProvider from "@/hooks/authProvider";
import mixpanel from 'mixpanel-browser';


export const metadata = {
  title: "Plant Manager - Operations Dashboard",
  description:
    "Advanced plant management dashboard for tracking workforce, operations, waste segregation, and fleet logistics in real-time.",
  keywords:
    "plant manager, industrial dashboard, waste management, fleet tracking, facility operations, operations dashboard",
  openGraph: {
    title: "Plant Manager - Operations Dashboard",
    description:
      "Monitor workforce attendance, tasks, waste operations, and fleet tracking dynamically.",
    url: "https://plantmanager.local",
    siteName: "Plant Manager",
    images: [
      {
        url: "/og_image.png",
        width: 1200,
        height: 630,
        alt: "Plant Manager Dashboard",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plant Manager - Operations Dashboard",
    description:
      "A complete view of plant operations, from real-time warnings to live asset monitoring.",
    images: ["/og_image.png"],
  },
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();

  const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

  const initMixpanel = () => {
    if (!MIXPANEL_TOKEN) {
      console.warn('Mixpanel token is missing! Check your .env file.');
      return;
    }
    mixpanel.init(MIXPANEL_TOKEN, { autocapture: true });
  };

  const trackEvent = (eventName, properties = {}) => {
    mixpanel.track(eventName, properties);
  };


  return (
    <html lang={locale} dir="ltr" suppressHydrationWarning>
      <head>
      
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-KR2BT5JYL2" />

        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KR2BT5JYL2');
          `}
        </Script>

        <Script
          id="ms-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "s97fo8jn7d");
          `,
          }}
        />
      </head>




      <body className="antialiased">
        <AuthProvider />
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
