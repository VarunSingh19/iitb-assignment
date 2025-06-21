import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import axios from 'axios';

function CourseForm() {
  const [course, setCourse] = useState({
    title: '',
    courseId: '',
    description: '',
    prerequisites: []
  });
  const [availableCourses, setAvailableCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAvailableCourses();
  }, []);

  const fetchAvailableCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/courses');
      setAvailableCourses(response.data);
    } catch (err) {
      setError('Failed to fetch available courses');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert prerequisites to an array of course objects
      const prerequisites = course.prerequisites.map(prereqId => ({
        id: Number(prereqId),
        courseId: prereqId
      }));
      
      const courseData = {
        ...course,
        prerequisites
      };
      
      await axios.post('http://localhost:8080/api/courses', courseData);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    }
  };

  const handlePrerequisiteChange = (e) => {
    const selected = e.target.value;
    setCourse(prev => ({
      ...prev,
      prerequisites: selected
    }));
  };

  return (
    <Box sx={{ mt: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Create New Course
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Course Title"
          value={course.title}
          onChange={(e) => setCourse(prev => ({ ...prev, title: e.target.value }))}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Course ID"
          value={course.courseId}
          onChange={(e) => setCourse(prev => ({ ...prev, courseId: e.target.value }))}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          value={course.description}
          onChange={(e) => setCourse(prev => ({ ...prev, description: e.target.value }))}
          margin="normal"
          required
          multiline
          rows={4}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Prerequisites</InputLabel>
          <Select
            multiple
            value={course.prerequisites}
            onChange={handlePrerequisiteChange}
            label="Prerequisites"
          >
            {availableCourses.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.courseId} - {c.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Create Course
        </Button>
      </form>
    </Box>
  );
}

export default CourseForm;
