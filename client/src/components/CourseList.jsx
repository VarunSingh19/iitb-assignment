import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent 
} from '@mui/material';
import axios from 'axios';
import CourseDetails from './CourseDetails';
import UpdateCourseForm from './UpdateCourseForm';
import { useNavigate } from 'react-router-dom';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/courses');
      setCourses(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch courses');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const deleteCourse = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/courses/${id}`);
      if (response.status === 204) {
        fetchCourses();
        if (selectedCourse?.id === id) {
          setSelectedCourse(null);
        }
      } else {
        throw new Error('Failed to delete course');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete course');
    }
  };

  const viewCourse = (course) => {
    setSelectedCourse(course);
  };

  const navigate = useNavigate();

  const handleAddCourse = () => {
    navigate('/courses/new');
  };

  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedCourseForUpdate, setSelectedCourseForUpdate] = useState(null);

  const handleUpdateClick = (course) => {
    setSelectedCourseForUpdate(course);
    setUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
    setSelectedCourseForUpdate(null);
    fetchCourses();
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Course List
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleAddCourse}
            sx={{ mb: 2 }}
          >
            Add New Course
          </Button>
          {error && <Typography color="error">{error}</Typography>}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.courseId}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        onClick={() => viewCourse(course)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outlined" 
                        onClick={() => handleUpdateClick(course)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Update
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="error" 
                        onClick={() => deleteCourse(course.id)}
                        size="small"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {selectedCourse && (
        <CourseDetails courseId={selectedCourse.id} />
      )}

      <Dialog open={updateDialogOpen} onClose={handleCloseUpdateDialog} maxWidth="md" fullWidth>
        <DialogTitle>Update Course</DialogTitle>
        <DialogContent>
          <UpdateCourseForm 
            courseId={selectedCourseForUpdate?.id}
            onClose={handleCloseUpdateDialog}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default CourseList;
