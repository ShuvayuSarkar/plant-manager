import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import DataListerner from "@/hooks/dataListerner";


export default function RootLayout({ children }) {
    return (
        <SidebarProvider>
            <DataListerner />

            <div>
                <AppSidebar />
            </div>
            <div className="flex flex-col flex-1 w-full text-[16px] h-screen overflow-hidden">
                <div className="sticky top-0 z-40 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10">
                    <Navbar />
                </div>
                <div className="m-2 flex-1 overflow-y-auto overflow-x-hidden">
                    {children}
                </div>
            </div>
        </SidebarProvider>

    );
}
