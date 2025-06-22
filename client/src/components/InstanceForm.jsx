import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import axios from 'axios';

function InstanceForm() {
  const [instance, setInstance] = useState({
    year: '',
    semester: '',
    courseId: '',
    instructorName: ''
  });
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editInstance, setEditInstance] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/courses');
      setCourses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && editInstance) {
        // Update existing instance
        await axios.put(`http://localhost:8080/api/instances/${editInstance.year}/${editInstance.semester}/${editInstance.course.id}`, {
          year: Number(instance.year),
          semester: instance.semester.toString(),
          instructorName: instance.instructorName
        });
        setEditMode(false);
        setEditInstance(null);
      } else {
        // Create new instance
        const course = courses.find(c => c.courseId === instance.courseId);
        if (!course) {
          throw new Error('Invalid course selected');
        }

        const instanceData = {
          courseId: instance.courseId,
          year: Number(instance.year),
          semester: instance.semester.toString(),
          instructorName: instance.instructorName?.trim() || 'IITB Faculty Name'
        };

        // Validate instructor name
        if (!instanceData.instructorName) {
          throw new Error('Instructor name is required');
        }

        const response = await axios.post('http://localhost:8080/api/instances', instanceData);
        console.log('Created instance:', response.data);
        setInstance({
          year: '',
          semester: '',
          courseId: '',
          instructorName: ''
        });
      }
      setError(null);
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response?.data?.message || 'Failed to save instance');
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

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Year"
          variant="outlined"
          value={instance.year}
          onChange={(e) => setInstance({ ...instance, year: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Semester"
          variant="outlined"
          value={instance.semester}
          onChange={(e) => setInstance({ ...instance, semester: e.target.value })}
          sx={{ mb: 2 }}
        />
        <Select
          fullWidth
          label="Course"
          value={instance.courseId}
          onChange={(e) => setInstance({ ...instance, courseId: e.target.value })}
          sx={{ mb: 2 }}
        >
          {courses.map((course) => (
            <MenuItem key={course.id} value={course.courseId}>
              {course.title} ({course.courseId})
            </MenuItem>
          ))}
        </Select>
        <TextField
          fullWidth
          label="Instructor Name"
          variant="outlined"
          value={instance.instructorName}
          onChange={(e) => setInstance({ ...instance, instructorName: e.target.value.trim() })}
          required
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Create Instance
        </Button>
      </Box>
    </Box>
  );
}

export default InstanceForm;
