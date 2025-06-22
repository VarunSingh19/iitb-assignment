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

function UpdateCourseForm({ courseId, onClose }) {
  const [course, setCourse] = useState({
    title: '',
    courseId: '',
    description: '',
    prerequisites: []
  });
  const [availableCourses, setAvailableCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourseDetails();
    fetchAvailableCourses();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/courses/${courseId}`);
      const courseData = response.data;
      // Convert prerequisites to array of IDs
      const prerequisites = courseData.prerequisites?.map(prereq => prereq.id) || [];
      setCourse({
        ...courseData,
        prerequisites
      });
    } catch (err) {
      setError('Failed to fetch course details');
    }
  };

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
      const courseData = {
        ...course,
        prerequisites: course.prerequisites.map(id => ({
          id: Number(id)
        }))
      };
      
      await axios.put(`http://localhost:8080/api/courses/${courseId}`, courseData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update course');
      console.error('Update error:', err.response?.data);
    }
  };

  const handlePrerequisiteChange = (e) => {
    const selectedValues = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
    setCourse(prev => ({
      ...prev,
      prerequisites: selectedValues
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
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
          multiline
          rows={4}
          value={course.description}
          onChange={(e) => setCourse(prev => ({ ...prev, description: e.target.value }))}
          margin="normal"
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Prerequisites</InputLabel>
          <Select
            multiple
            value={course.prerequisites}
            onChange={handlePrerequisiteChange}
            renderValue={(selected) => {
              if (!selected || selected.length === 0) return 'No prerequisites';
              const selectedCourses = availableCourses.filter(course => selected.includes(course.id));
              return selectedCourses.map(course => `${course.courseId} - ${course.title}`).join(', ');
            }}
          >
            {availableCourses.map((availCourse) => (
              <MenuItem key={availCourse.id} value={availCourse.id}>
                {availCourse.courseId} - {availCourse.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="contained" type="submit">
            Update Course
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default UpdateCourseForm;
