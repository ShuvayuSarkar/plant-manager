'use server'

import { KiteConnect } from "kiteconnect";
import { cookies } from "next/headers";

function getKiteInstance(apiKey) {
    return new KiteConnect({ api_key: apiKey });
}

// Redirect user to login URL
export async function getZerodhaLink(apiKey) {
    const kc = await getKiteInstance(apiKey);
    return kc.getLoginURL()
}

export async function generateZerodhaSession(apiKey, apiSecret, requestToken) {
    try {
        const kc = await new KiteConnect({ api_key: apiKey });
        const response = await kc.generateSession(requestToken, apiSecret);

        return {
            accessToken: response.access_token,
            status: "success"
        };
    } catch (err) {
        return {
            error: err.message,
            status: "error"
        };
    }
}

export async function orders(apiKey, accessToken) {
    try {
        const kc = await new KiteConnect({ api_key: apiKey });
        kc.setAccessToken(accessToken);

        const orders = await kc.getOrders();
        return {
            orders,
            status: "success"
        };
    } catch (err) {
        return {
            error: err.message,
            status: "error"
        };
    }
}