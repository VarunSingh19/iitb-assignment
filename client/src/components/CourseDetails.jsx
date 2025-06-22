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
  Paper
} from '@mui/material';
import axios from 'axios';

const CourseDetails = ({ courseId }) => {
  const [course, setCourse] = useState(null);
  const [instances, setInstances] = useState([]);
  const [error, setError] = useState(null);

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
                </TableRow>
              </TableHead>
              <TableBody>
                {instances.map((instance) => (
                  <TableRow key={instance.id}>
                    <TableCell>{instance.year}</TableCell>
                    <TableCell>{instance.semester}</TableCell>
                    <TableCell>{instance.instructorName || "IITB Faculty Name"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CourseDetails;
