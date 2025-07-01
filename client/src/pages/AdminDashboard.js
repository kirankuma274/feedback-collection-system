
import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import StarIcon from '@mui/icons-material/Star';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const uploadsBase =
  (process.env.REACT_APP_API_URL || '')
    .replace(/\/api\/?$/, '') + '/uploads/';

const AdminDashboard = () => {
 
  const { user, authLoading } = useAuth();

  
  const [feedbacks, setFeedbacks] = useState([]);
  const [filters, setFilters] = useState({ category: '', minRating: '' });
  const [summary, setSummary] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  
  const fetchData = useCallback(async () => {
    try {
      setDataLoading(true);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.minRating) params.minRating = filters.minRating;

      const [feedbackRes, summaryRes] = await Promise.all([
        axios.get('/feedback/all', { params }),
        axios.get('/feedback/summary'),
      ]);

      setFeedbacks(feedbackRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading data');
    } finally {
      setDataLoading(false);
    }
  }, [filters.category, filters.minRating]);

  
  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      fetchData();
    }
  }, [authLoading, user, fetchData]);

 
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await axios.delete(`/feedback/${id}`);
      fetchData();
    } catch {
      alert('Failed to delete feedback');
    }
  };

  
  const chartData = summary
    ? {
        labels: summary.categoryBreakdown.map((c) => c._id),
        datasets: [
          {
            label: 'Category Count',
            data: summary.categoryBreakdown.map((c) => c.count),
            backgroundColor: [
              '#42a5f5',
              '#66bb6a',
              '#ffa726',
              '#ef5350',
              '#ab47bc',
            ],
          },
        ],
      }
    : null;

 
  if (authLoading)
    return (
      <Box sx={{ mt: 10, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );

  if (user?.role !== 'admin')
    return (
      <Container sx={{ mt: 10 }}>
        <Alert severity="error">Access denied. Admins only.</Alert>
      </Container>
    );

  if (dataLoading)
    return (
      <Box sx={{ mt: 10, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );

 
  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      
      <Button
        variant="outlined"
        sx={{ mb: 2 }}
        onClick={async () => {
          try {
            const res = await axios.get('/feedback/export/csv', {
              responseType: 'blob',
            });
            const url = URL.createObjectURL(
              new Blob([res.data], { type: 'text/csv' })
            );
            const link = document.createElement('a');
            link.href = url;
            link.download = 'feedbacks.csv';
            link.click();
            URL.revokeObjectURL(url);
          } catch {
            alert('Failed to export CSV');
          }
        }}
      >
        Export CSV
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          select
          fullWidth
          label="Category"
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Bug">Bug</MenuItem>
          <MenuItem value="Feature">Feature</MenuItem>
          <MenuItem value="UI/UX">UI/UX</MenuItem>
          <MenuItem value="Performance">Performance</MenuItem>
          <MenuItem value="Suggestion">Suggestion</MenuItem>
        </TextField>

        <TextField
          label="Min Rating"
          type="number"
          inputProps={{ min: 1, max: 5 }}
          value={filters.minRating}
          onChange={(e) =>
            setFilters({ ...filters, minRating: e.target.value })
          }
        />
      </Box>

      
      {summary && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <FeedbackIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <CardContent>
                <Typography variant="subtitle2">Total Feedbacks</Typography>
                <Typography variant="h6">
                  {summary.totalFeedbacks}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <StarIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
              <CardContent>
                <Typography variant="subtitle2">Average Rating</Typography>
                <Typography variant="h6">
                  {Number(summary.averageRating).toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      
      {chartData && (
        <Box sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
          <Pie data={chartData} />
        </Box>
      )}

      
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>User</TableCell>
              <TableCell>File</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbacks.map((f) => (
              <TableRow key={f._id}>
                <TableCell>{f.category}</TableCell>
                <TableCell sx={{ maxWidth: 300 }}>{f.message}</TableCell>
                <TableCell>{f.rating}</TableCell>
                <TableCell>
                  {f.isAnonymous || !f.user ? 'Anonymous' : f.user.name}
                </TableCell>
                <TableCell>
                  {f.fileUrl && (
                    <a
                      href={uploadsBase + f.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    color="error"
                    onClick={() => handleDelete(f._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
