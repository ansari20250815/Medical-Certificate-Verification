'use client';

import React, { useState } from 'react';
import '../ManagerDashboard.css';
import Sidebar from '../components/SideBar1';
import Header from '../components/Header';
import SummaryCard from '../components/SummaryCard';
import Manager from '../manager/Manager';

import {
  Typography
} from '@mui/material';

const Dashboard = () => {

  return (
    <div className="dashboard-container" style={{ minHeight: '100vh', background: '#f9fbfd' }}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', minWidth: 220, background: '#1a2332', zIndex: 100 }}>
          <Sidebar />
        </div>
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', padding: '35px 35px 35px 40px', overflowY: 'auto', height: '100vh' }}>
          <Typography variant="h4" align="center" gutterBottom fontWeight={700} color="primary.main">
            Medical Leave Applications Dashboard
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', margin: '20px 0' }}>
            <SummaryCard title="Total Medical Leaves" value="10" />
            <SummaryCard title="Pending Leave Requests" value="0" />
            <SummaryCard title="Approved Leaves This Month" value="0" />
            <SummaryCard title="Rejected Leaves This Month" value="0" />
          </div>
          <div className="leave-requests-container">
            <h2 className="leave-table-header">Team Leave Requests</h2>
            <Manager />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
