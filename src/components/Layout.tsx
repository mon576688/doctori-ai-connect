import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ChatWidget } from "./ChatWidget";
import { SyncStatus } from "./SyncStatus";
import { ScrollToTop } from "./ScrollToTop";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="relative flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
      <SyncStatus />
      <ScrollToTop />
    </div>
  );
};