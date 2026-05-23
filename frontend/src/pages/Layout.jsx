import ZuroHeader from "./Zuroheader";
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function Layout() {
  return (
    <>
      {/* 👇 HEADER HERE (this is correct place) */}
      <ZuroHeader />

      {/* 👇 PAGE CONTENT HERE */}
      <Outlet />
      <BottomNav />
    </>
  );
}