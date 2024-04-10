import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthRoutes } from '../auth/routes/AuthRoutes';
import { JournalRoutes } from '../journal/routes/JournalRoutes';
import { CheckingAuth } from '../ui/components';
import { useCheckAuth } from '../hooks';


export const AppRouter = () => {

  const { status } = useCheckAuth();
  

  if( status === 'checking' ) {
    return <CheckingAuth />
  }

  return (
    <Routes>

      {
        // Exiten solo las rutas de la app o de auth dependiendo del estado 
        (status === 'authenticated')
        ? <Route path="/*" element={<JournalRoutes />} />
        : <Route path="/auth/*" element={<AuthRoutes />} />
      }

      {/* Se creo esta ruta porque si no se está en la ruta de auth y las de la app no existen entonces paila */}
      <Route path='/*' element={<Navigate to='/auth/login' />} />

        {/* Login y registro */}
        {/* <Route path="/auth/*" element={<AuthRoutes />} /> */}

        {/* JournalApp */}
        {/* <Route path="/*" element={<JournalRoutes />} /> */}

    </Routes>
  )
}
