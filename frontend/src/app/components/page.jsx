'use client'

import EraAppBar from "../components/AppBar";
import Sidebar from "../components/SideBar1"
import Header from "./Header";
import LeaveTable from "./LeaveBalance";
import LeaveSummary from "./LeaveHistory";

export default function DashboardPage() {
  return (
  <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Header />
        <LeaveSummary />
        <LeaveTable />
      </div>
    </div>
  );
}
 