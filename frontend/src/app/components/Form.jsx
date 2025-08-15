'use client'
import React, { useState } from 'react'
// import { 
//   CLLogoColour, 
//   CLTagline, 
//   TextField, 
//   DatePicker, 
//   FileUpload, 
//   Switch, 
//   Autocomplete, 
//   SnackBar,  
// } from '../libs/era'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Autocomplete, CLLogoColour, CLTagline, DatePicker, FileUpload, SnackBar, Switch, TextField } from '../libs/era'
import { Button } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


const options = ['Import', 'Export', 'Transit']

export default function Form() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    date: null,
    file: null,
    agree: false,
    type: ''
  })
  const [snackOpen, setSnackOpen] = useState(false)

  const handleChange = (field) => (event, value) => {
    if (field === 'date') {
      setForm({ ...form, date: value })
    } else if (field === 'type') {
      setForm({ ...form, type: value })
    } else if (field === 'file') {
      setForm({ ...form, file: event.target.files[0] })
    } else if (field === 'agree') {
      setForm({ ...form, agree: event.target.checked })
    } else {
      setForm({ ...form, [field]: event.target.value })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSnackOpen(true)
  }

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 420,
        mx: 'auto',
        mt: 4,
        p: 4,
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: 'background.paper'
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
      <img src={CLLogoColour} alt="Logo" style={{ height: 48, marginBottom: 8 }} />        <CLTagline />
      </Box>
      <Typography variant="h5" align="center" mb={2}>
        Registration Form
      </Typography>
      <TextField
        label="Full Name"
        value={form.name}
        onChange={handleChange('name')}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Email Address"
        value={form.email}
        onChange={handleChange('email')}
        fullWidth
        required
        margin="normal"
        type="email"
      />
      <DatePicker
        label="Date of Birth"
        value={form.date}
        onChange={handleChange('date')}
        fullWidth
        required
        margin="normal"
      />
      <Autocomplete
        options={options}
        value={form.type}
        onChange={handleChange('type')}
        renderInput={(params) => (
          <TextField {...params} label="Uploading For" margin="normal" required />
        )}
        fullWidth
      />
      <FileUpload
        label="Upload Document"
        onChange={handleChange('file')}
        required
        margin="normal"
        fullWidth
      />
      <Box mt={2}>
        <Switch
          checked={form.agree}
          onChange={handleChange('agree')}
          label="I agree to the terms and conditions"
          required
        />
      </Box>
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        fullWidth 
        sx={{ mt: 3 }}
        disabled={!form.agree}
      >
        Submit
      </Button>
      <SnackBar
        open={snackOpen}
        onClose={() => setSnackOpen(false)}
        message="Form submitted successfully!"
        severity="success"
      />
    </Box>
  )
}