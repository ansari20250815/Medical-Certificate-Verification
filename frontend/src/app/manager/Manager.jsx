'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, Stack, Snackbar, CircularProgress } from '@mui/material';
import styles from './Manager.module.css';

export default function Manager() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState({});
  const [message, setMessage] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);

  const statusColors = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'error'
  };
  useEffect(() => {
    async function fetchLeaveApplications() {
      try {
        const res = await fetch('http://localhost:8080/api/leave/applications');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setLeaveApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaveApplications();
  }, []);

  const handleVerify = async (id, status) => {
    setVerifying((v) => ({ ...v, [id]: true }));
    const res = await fetch(`http://localhost:8080/api/leave/verify/${id}?status=${status}`, {
      method: 'POST'
    });
    if (res.ok) {
      setMessage(`Application ${id} ${status === 'APPROVED' ? 'approved' : 'rejected'}.`);
      setSnackOpen(true);
      // Refresh applications
      const refreshed = await fetch('http://localhost:8080/api/leave/applications');
      setLeaveApplications(await refreshed.json());
    } else {
      setMessage('Verification failed.');
      setSnackOpen(true);
    }
    setVerifying((v) => ({ ...v, [id]: false }));
  };
  if (loading) return <Box textAlign="center" mt={4}><CircularProgress /></Box>;

  return (
    <Box maxWidth={1200} mx="auto" mt={4} px={2}>
      <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f4f6fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Application ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Employee ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Leave Dates</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Remarks</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>System Suggestion</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Confidence Score</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Result Details</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">No leave applications found.</TableCell>
                </TableRow>
              ) : (
                leaveApplications.map((app, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{app.applicationId}</TableCell>
                    <TableCell>{app.employeeId}</TableCell>
                    <TableCell>{app.leaveDates}</TableCell>
                    <TableCell>{app.remarks}</TableCell>
                    <TableCell>
                      <Chip label={app.status} color={statusColors[app.status] || 'default'} size="small" sx={{ fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={app.systemSuggestion || '-'} color={app.systemSuggestion === 'Approve' ? 'success' : 'error'} size="small" />
                    </TableCell>
                    <TableCell>
                      {app.confidenceScore != null ? `${app.confidenceScore}%` : '-' }
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small" onClick={() => { setSelectedDetails(app); setDetailsOpen(true); }}>View</Button>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button variant="contained" color="success" size="small" disabled={verifying[app.applicationId] || app.status !== 'PENDING'} onClick={() => handleVerify(app.applicationId, 'APPROVED')}>Approve</Button>
                        <Button variant="contained" color="error" size="small" disabled={verifying[app.applicationId] || app.status !== 'PENDING'} onClick={() => handleVerify(app.applicationId, 'REJECTED')}>Reject</Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Snackbar open={snackOpen} autoHideDuration={3000} onClose={() => setSnackOpen(false)} message={message} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
      {/* Details Slider */}
      {detailsOpen && selectedDetails && (
        <Box position="fixed" top={0} right={0} height="100vh" width={{ xs: '100vw', sm: 420, md: 480 }} bgcolor="#fff" zIndex={9999} boxShadow={4} display="flex" flexDirection="column" style={{ transition: 'right 0.3s', borderLeft: '1px solid #eee' }}>
          <Box p={3} borderBottom="1px solid #eee" display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Application Details</Typography>
            <Button variant="outlined" color="error" onClick={() => setDetailsOpen(false)}>Close</Button>
          </Box>
          <Box p={2} flex={1} overflow="auto">
            <Table size="small">
              <TableBody>
                <TableRow><TableCell><b>Application ID</b></TableCell><TableCell>{selectedDetails.applicationId}</TableCell></TableRow>
                <TableRow><TableCell><b>Employee ID</b></TableCell><TableCell>{selectedDetails.employeeId}</TableCell></TableRow>
                <TableRow><TableCell><b>Leave Dates</b></TableCell><TableCell>{selectedDetails.leaveDates}</TableCell></TableRow>
                <TableRow><TableCell><b>Status</b></TableCell><TableCell>{selectedDetails.status}</TableCell></TableRow>
                <TableRow><TableCell><b>System Suggestion</b></TableCell><TableCell>{selectedDetails.systemSuggestion}</TableCell></TableRow>
                <TableRow><TableCell><b>Confidence Score</b></TableCell><TableCell>{selectedDetails.confidenceScore}%</TableCell></TableRow>
                <TableRow><TableCell><b>Result Details</b></TableCell><TableCell>{selectedDetails.resultDetails}</TableCell></TableRow>
                <TableRow><TableCell><b>Patient Details</b></TableCell><TableCell>{selectedDetails.patientName}</TableCell></TableRow>
                <TableRow><TableCell><b>Doctor Details</b></TableCell><TableCell>{selectedDetails.doctorName}</TableCell></TableRow>
                <TableRow><TableCell><b>Clinic Name</b></TableCell><TableCell>{selectedDetails.clinicName}</TableCell></TableRow>
                <TableRow><TableCell><b>Clinic Address</b></TableCell><TableCell>{selectedDetails.clinicAddress}</TableCell></TableRow>
                <TableRow><TableCell><b>Contact Number</b></TableCell><TableCell>{selectedDetails.contactNumber}</TableCell></TableRow>
                <TableRow><TableCell><b>Registration ID</b></TableCell><TableCell>{selectedDetails.registrationId}</TableCell></TableRow>
                <TableRow><TableCell><b>Date Of Issue</b></TableCell><TableCell>{selectedDetails.dateOfIssue}</TableCell></TableRow>
                <TableRow><TableCell><b>MC Number</b></TableCell><TableCell>{selectedDetails.mcNumber}</TableCell></TableRow>
                <TableRow><TableCell><b>QR Code Present</b></TableCell><TableCell>{selectedDetails.qrCodePresent ? 'Yes' : 'No'}</TableCell></TableRow>
                <TableRow><TableCell><b>QR Code URL</b></TableCell><TableCell>{selectedDetails.qrCodeUrl ? <a href={selectedDetails.qrCodeUrl} target="_blank" rel="noopener noreferrer">{selectedDetails.qrCodeUrl}</a> : '—'}</TableCell></TableRow>
                <TableRow><TableCell><b>File</b></TableCell><TableCell>{selectedDetails.fileName ? <a href={`http://localhost:8080/api/documents/download/${selectedDetails.fileName}`} target="_blank" rel="noopener noreferrer">Download</a> : '-'}</TableCell></TableRow>
                <TableRow><TableCell><b>Remarks</b></TableCell><TableCell>{selectedDetails.remarks}</TableCell></TableRow>
              </TableBody>
            </Table>
          </Box>
        </Box>
      )}
    </Box>
  );
}
