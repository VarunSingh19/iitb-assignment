import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import CourseList from './components/CourseList';
import CourseForm from './components/CourseForm';
import InstanceList from './components/InstanceList';
import InstanceForm from './components/InstanceForm';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<CourseList />} />
            <Route path="/courses/new" element={<CourseForm />} />
            <Route path="/instances" element={<InstanceList />} />
            <Route path="/instances/new" element={<InstanceForm />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
