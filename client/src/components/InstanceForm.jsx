import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Select,
  MenuItem,
  TextField,
  Alert
} from '@mui/material';
import axios from 'axios';

function InstanceForm() {
  const [instance, setInstance] = useState({
    year: '',
    semester: '',
    courseId: ''
  });
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/courses');
      setCourses(response.data);
    } catch (err) {
      setError('Failed to fetch courses');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const course = courses.find(c => c.courseId === instance.courseId);
      if (!course) {
        throw new Error('Invalid course selected');
      }

      const instanceData = {
        courseId: instance.courseId,
        year: Number(instance.year),
        semester: Number(instance.semester)
      };

      await axios.post('http://localhost:8080/api/instances', instanceData);
      window.location.href = '/instances';
    } catch (err) {
      setError(err.message || 'Failed to create instance');
    }
  };

  return (
    <Box sx={{ mt: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Create Course Instance
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          select
          fullWidth
          label="Year"
          value={instance.year}
          onChange={(e) => setInstance(prev => ({ ...prev, year: e.target.value }))}
          margin="normal"
          required
        >
          <MenuItem value="2024">2024</MenuItem>
          <MenuItem value="2025">2025</MenuItem>
        </TextField>

        <TextField
          select
          fullWidth
          label="Semester"
          value={instance.semester}
          onChange={(e) => setInstance(prev => ({ ...prev, semester: e.target.value }))}
          margin="normal"
          required
        >
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
        </TextField>

        <TextField
          select
          fullWidth
          label="Course"
          value={instance.courseId}
          onChange={(e) => setInstance(prev => ({ ...prev, courseId: e.target.value }))}
          margin="normal"
          required
        >
          {courses.map((c) => (
            <MenuItem key={c.courseId} value={c.courseId}>
              {c.courseId} - {c.title}
            </MenuItem>
          ))}
        </TextField>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Create Instance
        </Button>
      </form>
    </Box>
  );
}

export default InstanceForm;
