import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

function getTimeInZone(offset) {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * offset);
}

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [indiaTime, setIndiaTime] = useState(null);
  const [sgTime, setSgTime] = useState(null);

  useEffect(() => {
    setIndiaTime(getTimeInZone(5.5));
    setSgTime(getTimeInZone(8));
    const timer = setInterval(() => {
      setIndiaTime(getTimeInZone(5.5));
      setSgTime(getTimeInZone(8));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch("http://localhost:8080/api/resume/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setResumes(data))
      .catch(err => console.error("Failed to fetch resumes:", err));
  }, []);

  const scoreBarOptions = {
    chart: { type: 'bar' },
    xaxis: {
      categories: resumes.map(r => r.candidateId),
      title: { text: 'Candidate ID' }
    },
    colors: ['#1976d2']
  };

  const scoreBarSeries = [{
    name: 'Score',
    data: resumes.map(r => Number(r.score.toFixed(2)))
  }];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>BIPO</Typography>
      <Grid container spacing={3}>
        {/* <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Resume Score Chart</Typography>
            <ApexChart options={scoreBarOptions} series={scoreBarSeries} type="bar" height={300} />
          </Paper>
        </Grid> */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Current Times</Typography>
            <Typography>🇮🇳 India: {indiaTime?.toLocaleTimeString()}</Typography>
            <Typography>🇸🇬 Singapore: {sgTime?.toLocaleTimeString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Certificate Data Extracted</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient ID</TableCell>
                    <TableCell>Hospital</TableCell>
                    <TableCell>Patient Name </TableCell>
                    <TableCell>Patient DOB</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resumes.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{r.candidateId}</TableCell>
                      <TableCell>{r.score.toFixed(4)}</TableCell>
                      <TableCell>{r.rank}</TableCell>
                      <TableCell>{Array.isArray(r.suggestedKeywords) ? r.suggestedKeywords.join(', ') : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
