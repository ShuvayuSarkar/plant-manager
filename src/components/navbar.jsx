"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ModeToggle } from "./theme/theme-mode";
import Link from "next/link";
import { Bell, Languages, PanelLeft } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTranslations } from "next-intl";
import { logout } from "@/lib/firebase/authActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useGlobalState from "@/hooks/globalState";
import GetOrders from "./getOrders";
import Image from "next/image";
import { trackEvent } from '@/lib/mixpanelClient';
import { removeCookie } from "@/lib/utils";

const Navbar = () => {
  const router = useRouter()
  const t = useTranslations();
  const { user, setRequestTokens, setSelectedBroker } = useGlobalState()
  const { toggleSidebar } = useSidebar()
  const [open, setOpen] = useState(false);

  const changeLanguage = async (lang) => {
    document.cookie = `locale=${lang}; path=/`;
    window.location.reload();
  };

  async function handleLogout() {
    setSelectedBroker(null)
    setRequestTokens([])
    removeCookie('zerodha_request_token')
    removeCookie('zerodhaSession')
    localStorage.clear()
    await logout()
    window.location.href = '/login'
  }

  return (
    <div className="flex justify-between h-fit w-full p-2 bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="flex gap-2 justify-center items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <PanelLeft className="text-black dark:text-white" />
        </Button>
      </div>

      <div className="flex gap-2 justify-center items-center">
        <GetOrders showElseCondition={true} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bell className="text-black dark:text-white" />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Notifications 1</DropdownMenuItem>
            <DropdownMenuItem>Notifications 2</DropdownMenuItem>
            <DropdownMenuItem>Notifications 3</DropdownMenuItem>
            <DropdownMenuItem>Notifications 4</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Languages className="text-black dark:text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => changeLanguage("en")}>{t("navbar.languages.en")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage("hi")}>{t("navbar.languages.hi")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarFallback className="cursor-none text-black dark:text-white">
                {user
                  ? user.displayName
                    ? user.displayName.slice(0, 2)
                    : user.email
                      ? user.email.slice(0, 2)
                      : "NA"
                  : "NA"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout}>{t("navbar.profile.logout")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div >
    </div >
  )
}

export default Navbar
