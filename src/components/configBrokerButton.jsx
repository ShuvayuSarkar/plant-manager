'use client';
import { useForm } from "react-hook-form"
import Link from "next/link";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { CodeCopy } from "@/components/codeCopy"
import { Button } from "@/components/ui/button"
import { MoveRightIcon, ExternalLink } from "lucide-react"
import { getUserCredentials, saveCredentials } from "@/lib/firebase/database/index"
import { toast } from "sonner";
import { useEffect, useState } from "react";
import useGlobalState from "@/hooks/globalState";
import { useRouter } from "next/navigation";
import { removeCookie } from "@/lib/utils";
import { trackEvent } from '@/lib/mixpanelClient';
import YouTube from 'react-youtube';
import { generateZerodhaSession } from "@/lib/brokers/zerodhaKite";

const ConfigureButton = ({ brokerName, brokerAction, brokerURL, credential }) => {

    const { credentials, setCredentials, setSelectedBroker, requestTokens, setRequestTokens } = useGlobalState();

    const router = useRouter()

    const findCredential = (broker) => credentials?.find((cred) => cred.broker === broker.toLowerCase());
    const creds = findCredential(brokerName) || { api_key: "", api_secret: "" };
    const findRequestToken = (broker) =>
        requestTokens?.find((token) => token.broker.toLowerCase() === broker.toLowerCase());

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            api_key: "",
            api_secret: "",
        },
    });

    const isConnected = !!findRequestToken(brokerName);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            const creds = findCredential(brokerName);
            reset({
                api_key: creds?.api_key || credential?.api_key || "",
                api_secret: creds?.api_secret || credential?.api_secret || "",
            });
        }
    }, [open, credential, brokerName, credentials, reset]);


    const onSubmit = async (formData) => {
        const payload = {
            ...formData,
            broker: brokerName.toLowerCase(),
        };

        try {
            const res = await saveCredentials(payload);
            const data = await getUserCredentials();
            setCredentials(data);
            toast.success("Credentials saved!");


            setOpen(false);
        } catch (error) {
            toast.error(error.message || "Save failed");
        }
    };


    async function handleConnect(credentials) {
        try {
            const link = await brokerAction(credentials.api_key);
            const session = await generateZerodhaSession()
            setSelectedBroker(brokerName);
            router.push(link);
            if (brokerName.toLowerCase() === 'zerodha') {
                trackEvent('broker_connected');
            }
        } catch (error) {
            toast.error(error.message || "Connection failed");
        }
    }

    function handleDisconnect() {
        removeCookie("zerodha_request_token");
        setRequestTokens((prev) =>
            prev.filter((token) => token.broker !== "zerodha")
        );
        setSelectedBroker(null);
        toast.success("Zerodha disconnected successfully");
    }


    return (
        <Dialog open={open} onOpenChange={setOpen} className="rounded-md">
            <DialogTrigger asChild>
                <Button onClick={() => trackEvent('clicked_configure')}>Configure</Button>
            </DialogTrigger>

            <DialogContent className="rounded-md p-4">
                <div className="flex gap-4">
                    {/* Video Section */}
                    <div
                        className="relative w-[500px] rounded-md overflow-hidden"
                        style={{ aspectRatio: "16/9" }}
                    // onClick handler only if you want to track clicks on the area
                    >
                        <iframe
                            className="absolute top-0 left-0 w-full h-full rounded-md"
                            src="https://www.youtube.com/embed/igxikF_NwHI"
                            title="YouTube video player"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="eager"
                        />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6  w-80">
                        <DialogHeader>
                            <DialogTitle>Credentials</DialogTitle>
                            <DialogDescription>
                                This information is securely stored and used only for authentication purposes.
                                <Link
                                    href={brokerURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 ml-1"
                                >
                                    <ExternalLink className="inline-block size-4" />
                                </Link>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="api_key">API Key</Label>
                                <Input id="api_key" {...register("api_key")} placeholder="API_KEY" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="api_secret">API Secret</Label>
                                <Input id="api_secret" {...register("api_secret")} placeholder="API_SECRET" />
                            </div>
                        </div>

                        <div>
                            <CodeCopy name="Redirect URL" value={process.env.NODE_ENV === "development" ? "http://localhost:3000/dashboard/connect" : "https://www.tradiohub.com/dashboard/connect"} />
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" type="button">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                            {
                                isConnected ?
                                    <Button type="button" onClick={() => handleDisconnect()}>
                                        Disconnect
                                    </Button> :
                                    creds?.api_key && creds?.api_secret && (
                                        <Button type="button" onClick={() => handleConnect(creds)}>
                                            Connect <MoveRightIcon />
                                        </Button>
                                    )
                            }

                        </DialogFooter>
                    </form>


                </div>
            </DialogContent>
        </Dialog >
    );
};

export default ConfigureButton  