//import './App.css'
import { Link, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';

function App() {
  

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'grey' }}>
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/customers">Customers</Button>
          <Button color="inherit" component={Link} to="/trainings">Trainings</Button>
          <Button color="inherit" component={Link} to="/calendar">Calendar</Button>
        </Toolbar>
      </AppBar>
      <Outlet />
      
    </>
  )
}

export default App
