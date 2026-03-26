'use client';
import useGlobalState from "@/hooks/globalState";
import { getZerodhaLink, orders as ZerodhaOrders } from "@/lib/brokers/zerodhaKite";
import { getCookie, removeCookie } from "@/lib/utils";
import { toast } from "sonner";
import { extractAllOrders, getNonMatchingOrders, groupCompletedTradeSets } from "@/lib/logic";
import { createUserData } from "@/lib/firebase/database/index";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { trackEvent } from '@/lib/mixpanelClient';

export default function GetOrders({ showElseCondition = false }) {
    const { requestTokens, setRequestTokens, credentials, setSelectedBroker, data } = useGlobalState();
    const router = useRouter();

    const findCredential = (broker) =>
        credentials?.find((cred) => cred.broker.toLowerCase() === broker.toLowerCase());

    const findRequestToken = (broker) =>
        requestTokens?.find((token) => token.broker.toLowerCase() === broker.toLowerCase());

    const zerodhaCredential = findCredential("zerodha");
    const zerodhaToken = findRequestToken("zerodha");

    // Helper function to clean up zerodha token
    const removeZerodhaToken = () => {
        removeCookie("zerodha_request_token");
        setRequestTokens((prev) =>
            prev.filter((t) => t.broker !== "zerodha")
        );
    };

    // Fetch Zerodha Orders Safely
    async function fetchOrders() {
        try {
            const accessToken = getCookie("zerodhaSession");

            const token = accessToken;

            if (!token) {
                toast.error("Session Expired");
                removeCookie("zerodhaSession");
                removeZerodhaToken();
                return;
            }

            const orderRequest = await ZerodhaOrders(zerodhaCredential.api_key, token);

            if (orderRequest.status === "error") {
                console.error("API Error:", orderRequest.error);
                toast.error(orderRequest.error);

                const errorMsg = orderRequest.error.toLowerCase();

                const shouldClearToken = [
                    "token",
                    "session",
                    "expired",
                    "invalid",
                    "unauthorized",
                    "authentication"
                ].some((keyword) => errorMsg.includes(keyword));

                if (shouldClearToken) {
                    console.log("Auth error detected — removing Zerodha token");
                    removeZerodhaToken();
                    removeCookie("zerodhaSession");
                }

                return;
            }

            if (orderRequest.orders?.length > 0) {
                // Filtering previous trades and current trades and returning only not existing trades
                const previousTrades = extractAllOrders(data);
                // making data flat
                const currentTrades = orderRequest.orders;
                const nonMatchingOrders = getNonMatchingOrders(previousTrades, currentTrades);

                if (nonMatchingOrders.length === 0) {
                    toast.info("No New Trades for Today");
                    return;
                }

                const cleanData = groupCompletedTradeSets(nonMatchingOrders);
                await createUserData("journal", cleanData);
                toast.success("Orders fetched successfully");
                trackEvent('Sync_orders');
            } else {
                toast.info("No Trades for Today");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error(error.message || "Unexpected error");
            removeZerodhaToken();
            removeCookie("zerodhaSession");
            router.push("/dashboard/connect");
        }
    }
    async function handleConnect() {
        try {
            console.log(zerodhaCredential);
            if (zerodhaCredential) {
                const link = await getZerodhaLink(zerodhaCredential.api_key);
                setSelectedBroker("zerodha");
                if (link) {
                    router.push(link);
                }
            }
            else {
                throw new Error("Missing credentials or token");

            }
        } catch (error) {
            toast.error(error.message || "Connection failed");
            router.push("/dashboard/connect");
        }
    }

    const hasZerodhaToken = zerodhaToken && zerodhaCredential;

    return (
        <div className="flex flex-col items-center justify-center">
            {hasZerodhaToken && (
                <Button
                    variant="ghost"
                    onClick={fetchOrders}
                    title="Sync Orders"
                    className="flex items-center gap-2"
                >
                    <RefreshCw />
                    {showElseCondition && "Sync Orders"}
                </Button>
            )}

            {!hasZerodhaToken && showElseCondition && (
                <Button variant="ghost" onClick={handleConnect}>
                    Connect Broker
                </Button>
            )}
        </div>
    );
}