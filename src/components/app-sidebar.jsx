'use client';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from 'next/navigation';

import connect_broker from "../icons/connect_broker.svg";
import dashboard from "../icons/dashboard.svg";
import journal from "../icons/journal.svg";
import review from "../icons/review.svg";
import { trackEvent } from '@/lib/mixpanelClient';
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { uploadBugReport } from "@/lib/firebase/database/bugReports"; // We'll create this function
import { addDoc, collection, getFirestore, Timestamp } from "firebase/firestore";
import { clientApp } from "@/lib/firebase/index";


const db = getFirestore(clientApp);

export function AppSidebar() {
    const t = useTranslations();
    const router = useRouter();

    const [openBugDialog, setOpenBugDialog] = useState(false);
    const [bugText, setBugText] = useState("");
    const [bugImage, setBugImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBugImageChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        setBugImage(e.target.files[0]);
      }
    };

    const handleBugSubmit = async () => {
      setIsSubmitting(true);
      try {
        await uploadBugReport(bugText, bugImage);
        setBugText("");
        setBugImage(null);
        setOpenBugDialog(false);
        alert("Bug report submitted!");
      } catch (err) {
        console.error("Bug report error:", err);
        alert("Failed to submit bug report.");
      }
      setIsSubmitting(false);
    };

    // Feedback dialog state
    const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
    const [like, setLike] = useState("");
    const [hate, setHate] = useState("");
    const [features, setFeatures] = useState("");
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

    const handleFeedbackSubmit = async () => {
      setIsSubmittingFeedback(true);
      try {
        await addDoc(collection(db, "feedback"), {
          like,
          hate,
          features,
          createdAt: Timestamp.now(),
        });
        setLike("");
        setHate("");
        setFeatures("");
        setOpenFeedbackDialog(false);
        alert("Thank you for your feedback!");
      } catch (err) {
        alert("Failed to submit feedback.");
      }
      setIsSubmittingFeedback(false);
    };


    const items = [
        {
            title: t("sidebar.journal"),
            url: "/dashboard/journal",
            icon: journal,
        },
        {
            title: t("sidebar.dashboard"),
            url: "/dashboard",
            icon: dashboard,
        },

        // {
        //     title: t("sidebar.connect"),
        //     url: "/dashboard/connect",
        //     icon: connect_broker,
        // },
        {
            title: "Batch Operations",
            url: "/dashboard/trades",
            icon: review, // Using review icon for now, can be changed later
        },
        {
            title: t("sidebar.review"),
            url: "/dashboard/review",
            icon: review,
        },


    ]


    return (
        <Sidebar className="!bg-[#FCFDFF] dark:!bg-black flex flex-col px-2">

            <SidebarHeader className="flex justify-center items-center  !bg-[#FCFDFF] dark:!bg-black m-0 pt-1">
                <div className="font-bold text-xl py-6 tracking-wide">Plant Manager</div>
            </SidebarHeader>

            <SidebarContent className="!bg-[#FCFDFF] dark:!bg-black pt-2">
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild className="hover:bg-[#eef4ff] dark:hover:bg-neutral-800">
                                {item.url === '/dashboard/review' ? (
                                    <button
                                        type="button"
                                        className='py-6 text-[16px] flex items-center w-full text-black dark:text-white'
                                        onClick={() => {
                                            trackEvent('clicked_on_reviewyourjournal');
                                            router.push('/dashboard/review');
                                        }}
                                    >
                                        <Image src={item.icon} alt={item.title} width={20} height={20} quality={100} />
                                        <span className="text-black dark:text-white">{item.title}</span>
                                    </button>
                                ) : (
                                    <Link
                                        href={item.url}
                                        className="py-6 text-[16px] flex items-center w-full text-black dark:text-white"
                                    >
                                        <Image src={item.icon} alt={item.title} width={20} height={20} quality={100} />
                                        <span className="text-black dark:text-white">{item.title}</span>
                                    </Link>
                                )}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>

            </SidebarContent>

            <SidebarFooter className="!bg-[#FCFDFF] dark:!bg-black">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Dialog open={openBugDialog} onOpenChange={setOpenBugDialog}>
                          <DialogTrigger asChild>
                            <SidebarMenuButton asChild className="hover:bg-[#eef4ff] dark:hover:bg-neutral-800">
                              <button className='py-6 text-[16px] flex items-center w-full text-black dark:text-white' type="button">
                                <Image src={review} alt="Report Bugs" width={20} height={20} quality={100} />
                                <span className="text-black dark:text-white">Report Bugs</span>
                              </button>
                            </SidebarMenuButton>
                          </DialogTrigger>
                          <DialogContent className="w-full max-w-2xl min-h-[400px]">
                            <DialogHeader>
                              <DialogTitle>Report a Bug</DialogTitle>
                            </DialogHeader>
                            <Textarea
                              placeholder="Describe the bug or issue..."
                              value={bugText}
                              onChange={e => setBugText(e.target.value)}
                              className="mb-4"
                            />
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleBugImageChange}
                              className="mb-4"
                            />
                            <DialogFooter>
                              <Button onClick={handleBugSubmit} disabled={isSubmitting || !bugText}>
                                {isSubmitting ? "Submitting..." : "Submit"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <Dialog open={openFeedbackDialog} onOpenChange={setOpenFeedbackDialog}>
                          <DialogTrigger asChild>
                            <SidebarMenuButton asChild className="hover:bg-[#eef4ff] dark:hover:bg-neutral-800">
                              <button className='py-6 text-[16px] flex items-center w-full text-black dark:text-white' type="button">
                                <Image src={review} alt={t("sidebar.feedback")} width={20} height={20} quality={100} />
                                <span className="text-black dark:text-white">{t("sidebar.feedback")}</span>
                              </button>
                            </SidebarMenuButton>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Please share your honest feedback <span role="img" aria-label="smile">😇</span>
                              </DialogTitle>
                            </DialogHeader>
                            <div>
                              <label className="font-medium block mb-1">What do you <b>like</b> the most about this dashboard ?</label>
                              <Textarea
                                value={like}
                                onChange={e => setLike(e.target.value)}
                                className="mb-4"
                              />
                              <label className="font-medium block mb-1">What do you <b>hate or feel frustrated</b> about this dashboard ?</label>
                              <Textarea
                                value={hate}
                                onChange={e => setHate(e.target.value)}
                                className="mb-4"
                              />
                              <label className="font-medium block mb-1">What <b>new features</b> would help you trade better ?</label>
                              <Textarea
                                value={features}
                                onChange={e => setFeatures(e.target.value)}
                                className="mb-4"
                              />
                            </div>
                            <DialogFooter>
                              <Button onClick={handleFeedbackSubmit} disabled={isSubmittingFeedback || (!like && !hate && !features)}>
                                {isSubmittingFeedback ? "Submitting..." : "Submit"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

        </Sidebar>
    )
}