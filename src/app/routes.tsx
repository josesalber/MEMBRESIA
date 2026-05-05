import { createBrowserRouter, Navigate } from 'react-router';
import { MainLayout } from '../layouts/MainLayout';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Instituciones } from '../pages/Instituciones';
import { CrearInstitucion } from '../pages/CrearInstitucion';
import { EditarInstitucion } from '../pages/EditarInstitucion';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'instituciones',
        element: <Instituciones />,
      },
      {
        path: 'instituciones/crear',
        element: <CrearInstitucion />,
      },
      {
        path: 'instituciones/:id/editar',
        element: <EditarInstitucion />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
