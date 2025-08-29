'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack
} from '@mui/material';

const statusColors = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error'
};

const Manager = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState({});
  const [message, setMessage] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  const fetchPendingLeaves = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:8080/api/leave/pending');
    const data = await res.json();
    setLeaves(data);
    setLoading(false);
  };

  const handleVerify = async (id, status) => {
    setVerifying((v) => ({ ...v, [id]: true }));
    const res = await fetch(`http://localhost:8080/api/leave/verify/${id}?status=${status}`, {
      method: 'POST'
    });
    if (res.ok) {
      setMessage(`Application ${id} ${status === 'APPROVED' ? 'approved' : 'rejected'}.`);
      setSnackOpen(true);
      fetchPendingLeaves();
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
                <TableCell sx={{ fontWeight: 700 }}>Employee ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Leave Dates</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Patient Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Doctor</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Clinic</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Patient ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date of Issue</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>QR Code</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>File</TableCell>
                <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    No pending applications.
                  </TableCell>
                </TableRow>
              ) : (
                leaves.map((leave) => (
                  <TableRow key={leave.applicationId} hover>
                    <TableCell>{leave.employeeId}</TableCell>
                    <TableCell>{leave.leaveDates || '-'}</TableCell>
                    <TableCell>{leave.reason || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={leave.status}
                        color={statusColors[leave.status] || 'default'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>{leave.patientName || '-'}</TableCell>
                    <TableCell>{leave.doctorName || '-'}</TableCell>
                    <TableCell>{leave.clinicName || '-'}</TableCell>
                    <TableCell>{leave.registrationId || '-'}</TableCell>
                    <TableCell>{leave.dateOfIssue || '-'}</TableCell>
                    <TableCell>
                      {leave.qrCodePresent ? (
                        <Chip label="Yes" color="success" size="small" />
                      ) : (
                        <Chip label="No" color="default" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      {leave.fileName ? (
                        <a
                          href={`http://localhost:8080/api/leave/download/${leave.fileName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}
                        >
                          View
                        </a>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          disabled={verifying[leave.applicationId] || leave.status !== 'PENDING'}
                          onClick={() => handleVerify(leave.applicationId, 'APPROVED')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          disabled={verifying[leave.applicationId] || leave.status !== 'PENDING'}
                          onClick={() => handleVerify(leave.applicationId, 'REJECTED')}
                        >
                          Reject
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        message={message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Manager;