import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/Home/home.jsx';
import Main from './components/Main/main.jsx';
import PageNotFound from './components/Err/err.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import ProtectedRoute2 from './components/ProtectedRoute2/ProtectedRoute2.jsx';




const router = createBrowserRouter([
  {
    path: '/',
    element: (
     <ProtectedRoute2>
        <Home />
        </ProtectedRoute2>
     
    ),
  },
  {
    path: '/main',
    element: (
      <ProtectedRoute>
        <Main />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

