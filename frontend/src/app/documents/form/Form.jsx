'use client';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import FileUploadFormField from '@/app/components/FileUploadFormField';
import { SnackBar, CLLogoColour } from '@/app/libs/era';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function Form() {
  const methods = useForm({
    defaultValues: {
      employeeId: '165468',
      leaveType: 'Sick Leave',
      leaveStartDate: null,
      leaveEndDate: null,
      reason: '',
      medicalCertificate: null
    }
  });
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = methods;

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackType, setSnackType] = useState('success');
  const [result, setResult] = useState(null);

  const onSubmit = async (form) => {
    const formData = new FormData();
    formData.append('employeeId', form.employeeId);
    formData.append(
      'leaveDates',
      form.leaveStartDate && form.leaveEndDate
        ? `${form.leaveStartDate.format('YYYY-MM-DD')} to ${form.leaveEndDate.format('YYYY-MM-DD')}`
        : ''
    );
    formData.append('reason', form.reason);
    formData.append('file', form.medicalCertificate); // <-- make sure this is a File object

    try {
      const token = localStorage.getItem('token'); // or wherever you store it
      const res = await fetch('http://localhost:8080/api/leave/apply', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + token // if needed
        }
      });
      let data = {};
      try {
        data = await res.json();
        console.log('Backend response:', data);
      } catch {
        data = {};
      }

      if (!res.ok) {
        setSnackMessage('❌ Submission failed.');
        setSnackType('error');
      } else {
        setResult(data);
        setSnackMessage('✅ Leave application submitted!');
        setSnackType('success');
        // Do NOT reset the form so data remains visible
      }
      setSnackOpen(true);
    } catch (error) {
      console.error('Upload error:', error);
      setSnackMessage('❌ Error during submission.');
      setSnackType('error');
      setSnackOpen(true);
    }
  };

  return (
    <FormProvider {...methods}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Paper
          elevation={6}
          sx={{
            maxWidth: 540,
            mx: 'auto',
            mt: 6,
            p: 5,
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            bgcolor: '#f9fbfd'
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <img src={CLLogoColour} alt="Logo" style={{ height: 48, marginBottom: 8 }} />
            <Typography variant="h5" fontWeight={700} color="primary.main" mb={1}>
              Medical Leave Application
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Please fill in the details below to apply for medical leave.
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: '100%' }}
          >
            <Controller
              name="employeeId"
              control={control}
              rules={{ required: 'Employee ID is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Employee ID"
                  fullWidth
                  margin="normal"
                  error={!!errors.employeeId}
                  helperText={errors.employeeId?.message}
                  sx={{ bgcolor: '#fff' }}
                />
              )}
            />

            <Controller
              name="leaveType"
              control={control}
              defaultValue="Sick Leave"
              rules={{ required: 'Type of leave is required' }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" sx={{ bgcolor: '#fff' }}>
                  <InputLabel id="leave-type-label">Type of Leave</InputLabel>
                  <Select
                    {...field}
                    labelId="leave-type-label"
                    label="Type of Leave"
                    error={!!errors.leaveType}
                  >
                    <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                    <MenuItem value="Hospitalisation Leave">Hospitalisation Leave</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="leaveStartDate"
                  control={control}
                  rules={{ required: 'Start date is required' }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      value={field.value || null} // <-- always null, never undefined
                      label="Start Date"
                      format="YYYY-MM-DD"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: 'normal',
                          error: !!errors.leaveStartDate,
                          helperText: errors.leaveStartDate?.message,
                          sx: { bgcolor: '#fff' }
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="leaveEndDate"
                  control={control}
                  rules={{ required: 'End date is required' }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="End Date"
                      format="YYYY-MM-DD"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: 'normal',
                          error: !!errors.leaveEndDate,
                          helperText: errors.leaveEndDate?.message,
                          sx: { bgcolor: '#fff' }
                        }
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Controller
              name="reason"
              control={control}
              rules={{ required: 'Reason for leave is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Reason for Leave"
                  multiline
                  rows={3}
                  fullWidth
                  margin="normal"
                  error={!!errors.reason}
                  helperText={errors.reason?.message}
                  sx={{ bgcolor: '#fff' }}
                />
              )}
            />

            <FileUploadFormField name="medicalCertificate" label="Upload Medical Certificate" required />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 3,
                fontWeight: 600,
                fontSize: '1.1rem',
                py: 1.2,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
              }}
            >
              Submit Application
            </Button>

            {result && (
              <Box mt={4} p={2} border="1px solid #e0e0e0" borderRadius={2} bgcolor="#fff">
                <Typography variant="h6" color="primary.main">Application Submitted</Typography>
                <Typography>Application ID: {result.applicationId}</Typography>
                <Typography>Status: {result.status}</Typography>
              </Box>
            )}

            <SnackBar
              open={snackOpen}
              onClose={() => setSnackOpen(false)}
              title={snackType === 'success' ? 'Success' : 'Error'}
              type={snackType}
            >
              {snackMessage}
            </SnackBar>
          </Box>
        </Paper>
      </LocalizationProvider>
    </FormProvider>
  );
}