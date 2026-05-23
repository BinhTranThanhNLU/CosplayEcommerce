import { Outlet } from "react-router-dom";
import { Footer } from "../components/HeaderAndFooter/Footer";
import { Header } from "../components/HeaderAndFooter/Header";
import { AnnouncementBar } from "../components/HomeComponent/AnnouncementBar";

export const UserLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnnouncementBar />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};