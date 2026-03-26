"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MoveRightIcon, PieChart, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { generateZerodhaSession, getZerodhaLink } from "@/lib/brokers/zerodhaKite";
import { getCookie } from "@/lib/utils";
import { getUserCredentials, saveCredentials } from "@/lib/firebase/database/index"
import { toast } from "sonner";
import useGlobalState from "@/hooks/globalState";
import ConfigureButton from "@/components/configBrokerButton";
import { trackEvent } from '@/lib/mixpanelClient';


const getDhanLink = async () => {
  try {
    // Replace with your actual Dhan API integration
    const dhanAuthUrl = `https://api.dhan.co/auth?client_id=YOUR_DHAN_CLIENT_ID&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=code`
    window.location.href = dhanAuthUrl
  } catch (error) {
    console.error("Error connecting to Dhan:", error)
  }
}

// AngelOne connection function
const getAngelOneLink = async () => {
  try {
    const state = Math.random().toString(36).substring(2, 15);
    const apiKey = process.env.NEXT_PUBLIC_ANGEL_API_KEY || 'm5dcULU3';
    window.location.href = `https://smartapi.angelone.in/publisher-login?api_key=${apiKey}&state=${state}`;
  } catch (error) {
    console.error("Error connecting to AngelOne:", error);
  }
};


const brokers = [
  {
    name: "Zerodha",
    description: "India's largest discount broker offering the lowest, most transparent prices in the industry",
    logo: "/brokers/zerodha_logo.svg",
    action: getZerodhaLink,
    url: "https://zerodha.com/products/api/",
    tokenParam: "request_token",
  },
  {
    name: "Dhan",
    description: "Advanced trading platform with cutting-edge technology and comprehensive market access",
    logo: "/brokers/dhan_logo.svg",
    action: getDhanLink,
    tokenParam: "dhan_token",
    url: ''
  },
  {
    name: "AngelOne",
    description: "Leading full-service broker with comprehensive research and advanced trading tools",
    logo: "/brokers/angelone.svg",
    action: getAngelOneLink,
    tokenParam: "auth_token",
    cookieName: "angelone_auth_token",
    url: 'https://smartapi.angelbroking.com/signup#'
  },
]
const ActionButton = ({ brokerName, brokerAction, brokerURL, credential }) => {
  console.log(credential);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      api_key: credential?.api_key || "",
      api_secret: credential?.api_secret || "",
    },
  });

  const [open, setOpen] = useState(false);

  // Reset form when Dialog is opened/closed
  useEffect(() => {
    if (open) {
      reset({
        api_key: credential?.api_key || "",
        api_secret: credential?.api_secret || "",
      });
    }
  }, [open, credential, reset]);

  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      broker: brokerName.toLowerCase(),
    };

    console.log("Submitting payload", payload);

    try {
      const res = await saveCredentials(payload);
      toast.success("Credentials saved!");
      console.log("Saved:", res);
      setOpen(false); // close dialog manually
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "Save failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Configure</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <CodeCopy name="Redirect URL" value="https://www.tradiohub.com/dashboard/connect" />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
            {credential?.api_key && credential?.api_secret && (
              <Button type="button" onClick={brokerAction}>
                Connect <MoveRightIcon />
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


const Connect = () => {
  const searchParams = useSearchParams()
  const requestToken = searchParams.get('request_token');
  const { credentials, setCredentials, requestTokens, setRequestTokens, selectedBroker, setSelectedBroker } = useGlobalState();

  console.log(credentials)


  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const res = await getUserCredentials();

        setCredentials(res);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchCredentials();
  }, [])

  useEffect(() => {
    if (!requestToken || !selectedBroker || !credentials?.length) return;

    console.log("Request Token:", requestToken, selectedBroker);

    const connect = async () => {
      const broker = selectedBroker.toLowerCase();
      const cookieName = `${broker}_request_token`;
      const token = requestToken;
      const tokens = [];

      const findCredential = (broker) =>
        credentials?.find((cred) => cred.broker.toLowerCase() === broker.toLowerCase());


      try {
        const brokerCredential = findCredential(broker);
        console.log("----", brokerCredential);

        if (!brokerCredential) {
          toast.error(`No credentials found for broker: ${broker}`);
          return;
        }

        const response = await generateZerodhaSession(
          brokerCredential.api_key,
          brokerCredential.api_secret,
          token
        );



        tokens.push({ token, broker });

        // Set cookie for 1 day
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${cookieName}=${token}; path=/; expires=${expires}; SameSite=Lax;`;
        document.cookie = `zerodhaSession=${response.accessToken}; path=/; expires=${expires}; SameSite=Lax`;

        setRequestTokens((prev) => {
          const exists = prev.some((item) => item.token === token && item.broker === broker);
          return exists ? prev : [...prev, ...tokens];
        });

        toast.success("Connected successfully");
      } catch (error) {
        toast.error(error?.message || "Something went wrong");
      } finally {
        setSelectedBroker(null);
      }
    };

    connect();
  }, [requestToken, selectedBroker, credentials]);




  const isBrokerConnected = (brokerName) => {
    return requestTokens?.some((token) => token.broker.toLowerCase() === brokerName.toLowerCase())
  }

  return (
    <div className="container mx-auto py-2 px-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Connect Your Broker</h1>
        <p className="text-neutral-500 max-w-2xl mx-auto">
          Choose a broker to connect with your account. This enables seamless trading and portfolio management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">


        {brokers.map((broker) => (
          <Card key={broker.name} className="rounded-md shadow border-none">
            <CardHeader className="flex items-center justify-center pb-4">
              <div className="w-48 h-16 flex items-center justify-center">
                <img
                  src={broker.logo || "/angelone.png?height=64&width=192"}
                  alt={broker.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.target.src = "/angelone.png?height=64&width=192"
                  }}
                />
              </div>
            </CardHeader>

            <CardContent>
              <div>
                <p className="text-neutral-500">{broker.description}</p>
              </div>
            </CardContent>

            <CardFooter >
              {isBrokerConnected(broker.name) ? (
                <div className="flex justify-between w-full ">
                  <ConfigureButton
                    brokerName={broker.name}
                    brokerAction={broker.action}
                    brokerURL={broker.url}
                    credential={
                      credentials[0]?.credential?.find(c => c.broker === broker.name.toLowerCase())
                    } />
                  <span className="w-fit  flex gap-2 items-center justify-center">
                    <div className="h-3 w-3 bg-green-500 rounded-full" />
                    <span>Connected</span>
                  </span>
                </div>

              ) : (
                <ConfigureButton
                  brokerName={broker.name}
                  brokerAction={broker.action}
                  brokerURL={broker.url}
                  credential={
                    credentials[0]?.credential?.find(c => c.broker === broker.name.toLowerCase())
                  } />
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-10 text-center">
        <div className="flex items-center justify-center mb-4">
          <PieChart className="h-6 w-6 text-neutral-400 mr-2" />
          <h2 className="text-xl font-semibold">Don't see your broker?</h2>
        </div>
        <p className="text-neutral-500 mb-4">
          We're constantly adding new brokers to our platform. Let us know which broker you'd like to see next.
        </p>
        <Button variant="secondary" onClick={() => trackEvent('clicked_on_requestbroker')}>Request a Broker</Button>
      </div>
    </div>
  )
}

export default Connect
