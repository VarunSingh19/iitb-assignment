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
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import axios from 'axios';

const CourseDetails = ({ courseId }) => {
  const [course, setCourse] = useState(null);
  const [instances, setInstances] = useState([]);
  const [error, setError] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [instructorName, setInstructorName] = useState('');

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const [courseResponse, instancesResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/courses/${courseId}`),
        axios.get(`http://localhost:8080/api/instances/course/${courseId}`)
      ]);
      setCourse(courseResponse.data);
      setInstances(instancesResponse.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch course details');
    }
  };

  const handleEdit = (instance) => {
    setSelectedInstance(instance);
    setInstructorName(instance.instructorName || '');
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
    setSelectedInstance(null);
    setInstructorName('');
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`http://localhost:8080/api/instances/${selectedInstance.year}/${selectedInstance.semester}/${courseId}`, {
        instructorName: instructorName
      });
      fetchCourseDetails();
      handleEditClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update instance');
    }
  };

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography color="error">{error}</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            {course.title} ({course.courseId})
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {course.description}
          </Typography>

          {course.prerequisites && course.prerequisites.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>Prerequisites:</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Course ID</TableCell>
                      <TableCell>Title</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {course.prerequisites.map((prereq) => (
                      <TableRow key={prereq.id}>
                        <TableCell>{prereq.courseId}</TableCell>
                        <TableCell>{prereq.title}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          <Typography variant="h6" sx={{ mt: 2 }}>Instances:</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Year</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Instructor</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {instances.map((instance) => (
                  <TableRow key={instance.id}>
                    <TableCell>{instance.year}</TableCell>
                    <TableCell>{instance.semester}</TableCell>
                    <TableCell>{instance.instructorName || "IITB Faculty Name"}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(instance)}
                      >
                        Edit Instructor
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openEditDialog} onClose={handleEditClose}>
        <DialogTitle>Edit Instructor Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Instructor Name"
            fullWidth
            value={instructorName}
            onChange={(e) => setInstructorName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseDetails;
