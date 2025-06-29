import React, { useState } from 'react';
import {
  Container, Typography, Box, Paper, TextField,
  MenuItem, Button, Switch, FormControlLabel, Rating,
  Alert
} from '@mui/material';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const FeedbackForm = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    category: '',
    message: '',
    rating: 3,
    isAnonymous: false
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ error: '', success: '' });

  const categories = ['Bug', 'Feature', 'UI/UX', 'Performance', 'Suggestion'];

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus({ error: '', success: '' });
  };

  const handleToggle = () => {
    setForm({ ...form, isAnonymous: !form.isAnonymous });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.category || !form.message || !form.rating) {
      return setStatus({ error: 'All fields are required', success: '' });
    }

    try {
      const data = new FormData();
      data.append('category', form.category);
      data.append('message', form.message);
      data.append('rating', form.rating);
      data.append('isAnonymous', form.isAnonymous);
      if (file) data.append('file', file);

      await axios.post('/feedback/submit', data);
      setStatus({ error: '', success: 'Feedback submitted successfully!' });
      setForm({ category: '', message: '', rating: 3, isAnonymous: false });
      setFile(null);
    } catch (err) {
      setStatus({
        success: '',
        error: err.response?.data?.message || 'Submission failed'
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={6} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Submit Feedback
        </Typography>

        {!user && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please login to submit feedback.
          </Alert>
        )}

        {status.error && <Alert severity="error" sx={{ mb: 2 }}>{status.error}</Alert>}
        {status.success && <Alert severity="success" sx={{ mb: 2 }}>{status.success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
            select fullWidth name="category" label="Category"
            value={form.category} onChange={handleChange} margin="normal"
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Message" name="message" multiline rows={4}
            value={form.message} onChange={handleChange}
            fullWidth margin="normal"
          />

          <Box sx={{ my: 2 }}>
            <Typography gutterBottom>Rating:</Typography>
            <Rating
              name="rating"
              value={form.rating}
              onChange={(e, newValue) =>
                setForm({ ...form, rating: newValue || 1 })
              }
            />
          </Box>

          <FormControlLabel
            control={
              <Switch checked={form.isAnonymous} onChange={handleToggle} />
            }
            label="Submit Anonymously"
          />

          <Box sx={{ my: 2 }}>
            <Button variant="outlined" component="label">
              Upload File
              <input type="file" hidden onChange={e => setFile(e.target.files[0])} />
            </Button>
            {file && <Typography variant="caption" sx={{ ml: 1 }}>{file.name}</Typography>}
          </Box>

          <Button
            fullWidth type="submit" variant="contained"
            disabled={!user}
            sx={{ mt: 2, py: 1.5 }}
          >
            Submit Feedback
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default FeedbackForm;
