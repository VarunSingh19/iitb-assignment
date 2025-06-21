import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Link
} from '@mui/material';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Course Management System
        </Typography>
        <Button color="inherit" component={Link} href="/">
          Courses
        </Button>
        <Button color="inherit" component={Link} href="/instances">
          Course Instances
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
