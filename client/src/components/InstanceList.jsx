import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Alert,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import axios from 'axios';

function InstanceList() {
  const [instances, setInstances] = useState([]);
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [error, setError] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [instructorName, setInstructorName] = useState('');

  const fetchInstances = async (all = false) => {
    try {
      if (all) {
        const response = await axios.get('http://localhost:8080/api/instances');
        setInstances(response.data);
      } else if (year && semester) {
        const response = await axios.get(
          `http://localhost:8080/api/instances/${year}/${semester}`
        );
        setInstances(response.data);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch course instances');
    }
  };

  
  const handleEdit = (instance) => {
    setSelectedInstance({
      ...instance,
      year: instance.year.toString(),
      semester: instance.semester.toString()
    });
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
      const instanceData = {
        courseId: selectedInstance.course.id,
        year: Number(selectedInstance.year),
        semester: selectedInstance.semester.toString(),
        instructorName: instructorName
      };
      
      await axios.put(`http://localhost:8080/api/instances/${selectedInstance.year}/${selectedInstance.semester}/${selectedInstance.course.id}`, instanceData);
      fetchInstances();
      handleEditClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update instance');
      console.error('Error:', err);
    }
  };

  const deleteInstance = async (year, semester, courseId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/instances/${year}/${semester}/${courseId}`
      );
      fetchInstances();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete instance');
    }
  };

  useEffect(() => {
    fetchInstances(true); // Fetch all instances on component mount
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Course Instances
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              select
              label="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="2024">2024</MenuItem>
              <MenuItem value="2025">2025</MenuItem>
            </TextField>
            <TextField
              select
              label="Semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
            </TextField>
            <Button 
              variant="contained" 
              color="primary"
              onClick={fetchInstances}
              disabled={!year || !semester}
            >
              Search
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => fetchInstances(true)}
              sx={{ ml: 2 }}
            >
              Refresh
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              href="/instances/new"
            >
              Add New Instance
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Instructor</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {instances.map((instance) => (
                  <TableRow key={instance.id}>
                    <TableCell>{instance.course.courseId}</TableCell>
                    <TableCell>{instance.course.title}</TableCell>
                    <TableCell>{instance.year}</TableCell>
                    <TableCell>{instance.semester}</TableCell>
                    <TableCell>{instance.instructorName || "IITB Faculty Name"}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(instance)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => deleteInstance(
                          instance.year,
                          instance.semester,
                          instance.course.id
                        )}
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

      <Dialog open={openEditDialog} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Course Instance</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Year"
              value={selectedInstance?.year || ''}
              onChange={(e) => setSelectedInstance({ ...selectedInstance, year: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Semester"
              value={selectedInstance?.semester || ''}
              onChange={(e) => setSelectedInstance({ ...selectedInstance, semester: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Course ID"
              value={selectedInstance?.course?.courseId || ''}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Course Title"
              value={selectedInstance?.course?.title || ''}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Instructor Name"
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InstanceList;
