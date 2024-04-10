import { Box, Toolbar } from '@mui/material';
import { NavBar, SideBar } from '../components';


const drawerWidth = 280;

export const JournalLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }} className='animate__animated animate__fadeIn animate__faster' >

        <NavBar drawerWidth={drawerWidth} />

        <SideBar drawerWidth={drawerWidth} />

        <Box 
            component='main'
            sx={{ flexGrow: 1, p: 3 }}
        >
            <Toolbar /> {/* Esto es para un espacio, sino sale esto tapado por la navbar*/}

            { children }

        </Box>

    </Box>
  )
}
